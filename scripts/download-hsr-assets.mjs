#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const kind = process.argv[2];

const validKinds = new Set([
    'character',
    'light-cone',
    'relic',
]);

if (!validKinds.has(kind)) {
    throw new Error(
        'Expected asset kind: character, light-cone, or relic.',
    );
}

const ROOT = process.cwd();

const API_ROOT =
    'https://vizualabstract.github.io/StarRailStaticAPI';

const DB_ROOT = `${API_ROOT}/db/en`;
const ASSET_ROOT = `${API_ROOT}/assets`;

const supportedExtensions = [
    '.webp',
    '.png',
    '.jpg',
    '.jpeg',
];

function normalizeName(value) {
    return String(value ?? '')
        .toLowerCase()
        .replace(/[\u2019']/g, '')
        .replaceAll('&', ' and ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function readJSON(filePath) {
    return JSON.parse(
        await fs.readFile(filePath, 'utf8'),
    );
}

async function fetchJSON(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `${response.status} ${response.statusText}: ${url}`,
        );
    }

    return response.json();
}

async function pathExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function existingAsset(
    basePath,
) {
    for (const extension of supportedExtensions) {
        const candidate =
            `${basePath}${extension}`;

        if (await pathExists(candidate)) {
            return candidate;
        }
    }

    return null;
}

function getSourceExtension(sourcePath) {
    const extension =
        path.extname(
            new URL(
                sourcePath,
                `${ASSET_ROOT}/`,
            ).pathname,
        ) || '.png';

    return extension.toLowerCase();
}

async function downloadAsset(
    sourcePath,
    outputBasePath,
    force,
) {
    if (!sourcePath) {
        throw new Error(
            'Source has no image path.',
        );
    }

    const existing =
        await existingAsset(outputBasePath);

    if (existing && !force) {
        console.log(
            `skip       ${path.relative(ROOT, existing)}`,
        );

        return 'skipped';
    }

    const extension =
        getSourceExtension(sourcePath);

    const outputPath =
        `${outputBasePath}${extension}`;

    const url =
        `${ASSET_ROOT}/${sourcePath}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `${response.status} ${response.statusText}: ${url}`,
        );
    }

    const bytes = Buffer.from(
        await response.arrayBuffer(),
    );

    await fs.mkdir(
        path.dirname(outputPath),
        {
            recursive: true,
        },
    );

    await fs.writeFile(
        outputPath,
        bytes,
    );

    console.log(
        `downloaded ${path.relative(ROOT, outputPath)}`,
    );

    return 'downloaded';
}

/*
 * Local character definitions
 */

async function loadLocalCharacters() {
    const directory = path.join(
        ROOT,
        'src/data/characters',
    );

    const files = (
        await fs.readdir(directory)
    ).filter((file) =>
        file.endsWith('.json'),
    );

    const entries = new Map();

    for (const file of files) {
        const slug =
            path.basename(
                file,
                '.json',
            );

        const data = await readJSON(
            path.join(
                directory,
                file,
            ),
        );

        entries.set(slug, {
            key: slug,

            displayName:
                data.name ?? slug,

            element:
                String(
                    data.element ?? '',
                ).toLowerCase(),

            rarity:
                String(
                    data.rarity ?? '',
                ),
        });
    }

    return entries;
}

/*
 * Local Light Cone definitions
 */

async function loadLocalLightCones() {
    const directory = path.join(
        ROOT,
        'src/data/light-cones',
    );

    const names = await readJSON(
        path.join(
            ROOT,
            'src/i18n/en/light-cones.json',
        ),
    );

    const files = (
        await fs.readdir(directory)
    ).filter((file) =>
        file.endsWith('.json'),
    );

    const entries = new Map();

    for (const file of files) {
        const pathName =
            path.basename(
                file,
                '.json',
            );

        const data = await readJSON(
            path.join(
                directory,
                file,
            ),
        );

        for (const key of Object.keys(data)) {
            if (entries.has(key)) {
                throw new Error(
                    `Duplicate Light Cone ID: ${key}`,
                );
            }

            entries.set(key, {
                key,
                pathName,

                displayName:
                    names[key] ?? key,
            });
        }
    }

    return entries;
}

/*
 * Local Relic definitions
 */

async function loadLocalRelics() {
    const data = await readJSON(
        path.join(
            ROOT,
            'src/data/relics/relic_sets.json',
        ),
    );

    const names = await readJSON(
        path.join(
            ROOT,
            'src/i18n/en/relic-sets.json',
        ),
    );

    return new Map(
        Object.keys(data).map(
            (key) => [
                key,
                {
                    key,

                    displayName:
                        names[key] ??
                        key,
                },
            ],
        ),
    );
}

/*
 * Source API
 */

const sourceConfig = {
    character: {
        endpoint: 'characters',

        loadLocal:
            loadLocalCharacters,
    },

    'light-cone': {
        endpoint: 'light_cones',

        loadLocal:
            loadLocalLightCones,
    },

    relic: {
        endpoint: 'relic_sets',

        loadLocal:
            loadLocalRelics,
    },
};

function parseArguments() {
    const args =
        process.argv.slice(3);

    let all = false;
    let force = false;

    const requested = [];

    for (const arg of args) {
        if (arg === '--all') {
            all = true;
            continue;
        }

        if (arg === '--force') {
            force = true;
            continue;
        }

        requested.push(arg);
    }

    return {
        all,
        force,
        requested,
    };
}

/*
 * Allows:
 *
 * silver-wolf
 *
 * or an explicit source ID:
 *
 * silver-wolf=1006
 */

function parseRequestedKey(value) {
    const separator =
        value.indexOf('=');

    if (separator === -1) {
        return {
            key: normalizeName(value),
            sourceId: null,
        };
    }

    return {
        key: normalizeName(
            value.slice(
                0,
                separator,
            ),
        ),

        sourceId:
            value.slice(
                separator + 1,
            ),
    };
}

function findSourceEntry(
    sourceEntries,
    localEntry,
    sourceId,
) {
    if (sourceId) {
        const entry =
            sourceEntries[sourceId];

        if (!entry) {
            throw new Error(
                `No source entry with ID "${sourceId}".`,
            );
        }

        return entry;
    }

    const wantedName =
        normalizeName(
            localEntry.displayName,
        );

    const matches =
        Object.values(
            sourceEntries,
        ).filter(
            (entry) =>
                normalizeName(
                    entry.name,
                ) === wantedName,
        );

    if (matches.length === 0) {
        throw new Error(
            `Could not find "${localEntry.displayName}" in source data.`,
        );
    }

    if (matches.length > 1) {
        throw new Error(
            `Multiple source entries match "${localEntry.displayName}". Pass ${localEntry.key}=SOURCE_ID instead.`,
        );
    }

    return matches[0];
}

async function downloadCharacter(
    localEntry,
    sourceEntry,
    force,
) {
    const directory = path.join(
        ROOT,
        'src/assets/character-assets',
        localEntry.element,
        localEntry.rarity,
        localEntry.key,
    );

    /*
     * Square icon used by the character
     * browser/header.
     */
    await downloadAsset(
        sourceEntry.icon,
        path.join(
            directory,
            'portrait',
        ),
        force,
    );

    /*
     * Larger character artwork.
     */
    await downloadAsset(
        sourceEntry.preview ??
            sourceEntry.portrait,
        path.join(
            directory,
            'splash_art',
        ),
        force,
    );
}

async function downloadLightCone(
    localEntry,
    sourceEntry,
    force,
) {
    await downloadAsset(
        sourceEntry.icon,
        path.join(
            ROOT,
            'src/assets/item-assets/light-cones',
            localEntry.pathName,
            localEntry.key,
        ),
        force,
    );
}

async function downloadRelic(
    localEntry,
    sourceEntry,
    force,
) {
    await downloadAsset(
        sourceEntry.icon,
        path.join(
            ROOT,
            'src/assets/item-assets/relics',
            localEntry.key,
        ),
        force,
    );
}

async function main() {
    const config =
        sourceConfig[kind];

    const {
        all,
        force,
        requested,
    } = parseArguments();

    const localEntries =
        await config.loadLocal();

    if (
        !all &&
        requested.length === 0
    ) {
        console.log(`
Usage:

  npm run download:${kind}-assets -- <id>
  npm run download:${kind}-assets -- <id> <id>
  npm run download:${kind}-assets -- --all
  npm run download:${kind}-assets -- <local-id>=<source-id>

Options:

  --all      Download all locally defined assets
  --force    Replace assets that already exist
`);

        process.exit(0);
    }

    const sourceEntries =
        await fetchJSON(
            `${DB_ROOT}/${config.endpoint}.json`,
        );

    const requests = all
        ? [...localEntries.keys()].map(
              (key) => ({
                  key,
                  sourceId: null,
              }),
          )
        : requested.map(
              parseRequestedKey,
          );

    let failed = 0;

    for (const request of requests) {
        const localEntry =
            localEntries.get(
                request.key,
            );

        if (!localEntry) {
            console.error(
                `failed     ${request.key}: unknown local ${kind}`,
            );

            failed++;
            continue;
        }

        try {
            const sourceEntry =
                findSourceEntry(
                    sourceEntries,
                    localEntry,
                    request.sourceId,
                );

            console.log(
                `\n${localEntry.key} -> ${sourceEntry.name} [${sourceEntry.id}]`,
            );

            if (kind === 'character') {
                await downloadCharacter(
                    localEntry,
                    sourceEntry,
                    force,
                );
            } else if (
                kind === 'light-cone'
            ) {
                await downloadLightCone(
                    localEntry,
                    sourceEntry,
                    force,
                );
            } else {
                await downloadRelic(
                    localEntry,
                    sourceEntry,
                    force,
                );
            }
        } catch (error) {
            console.error(
                `failed     ${localEntry.key}: ${
                    error instanceof Error
                        ? error.message
                        : String(error)
                }`,
            );

            failed++;
        }
    }

    console.log(
        `\nDone. failed=${failed}`,
    );

    if (failed > 0) {
        process.exitCode = 1;
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});