import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

let errors = 0;
let checked = 0;

function error(message) {
    console.error(`❌ ${message}`);
    errors++;
}

function ok(message) {
    console.log(`✓ ${message}`);
}

function readJSON(file) {
    checked++;

    try {
        return JSON.parse(
            fs.readFileSync(file, 'utf8'),
        );
    } catch (err) {
        error(
            `Invalid JSON: ${path.relative(ROOT, file)}\n   ${err.message}`,
        );

        return null;
    }
}

function existingJSON(file) {
    if (!fs.existsSync(file)) {
        return null;
    }

    return readJSON(file);
}

function getJSONFiles(directory) {
    if (!fs.existsSync(directory)) {
        return [];
    }

    return fs
        .readdirSync(directory)
        .filter((file) => file.endsWith('.json'))
        .map((file) =>
            path.join(directory, file),
        );
}

/*
 * Shared dictionaries
 */

const stats =
    existingJSON(
        path.join(
            ROOT,
            'src/i18n/en/stats.json',
        ),
    ) ?? {};

const elements =
    existingJSON(
        path.join(
            ROOT,
            'src/i18n/en/elements.json',
        ),
    ) ?? {};

const paths =
    existingJSON(
        path.join(
            ROOT,
            'src/i18n/en/paths.json',
        ),
    ) ?? {};

const relicData =
    existingJSON(
        path.join(
            ROOT,
            'src/data/relics/relic_sets.json',
        ),
    ) ?? {};

/*
 * Light Cones
 */

const lightConeDirectory = path.join(
    ROOT,
    'src/data/light-cones',
);

const lightCones = {};
const lightConePaths = {};

for (const file of getJSONFiles(
    lightConeDirectory,
)) {
    const pathName = path.basename(
        file,
        '.json',
    );

    const data = readJSON(file);

    if (!data) continue;

    for (const [id, info] of Object.entries(
        data,
    )) {
        if (lightCones[id]) {
            error(
                `Duplicate Light Cone ID "${id}"`,
            );
        }

        lightCones[id] = info;
        lightConePaths[id] = pathName;

        if (!info?.rarity) {
            error(
                `Light Cone "${id}" has no rarity`,
            );
        }
    }
}

ok(
    `Loaded ${Object.keys(lightCones).length} Light Cones`,
);

/*
 * Relic database
 */

for (const [id, relic] of Object.entries(
    relicData,
)) {
    if (
        relic.type !== 'cavern' &&
        relic.type !== 'planar'
    ) {
        error(
            `Relic "${id}" has invalid type "${relic.type}"`,
        );
    }

    if (!relic.rarity) {
        error(
            `Relic "${id}" has no rarity`,
        );
    }

    if (!relic['2p']) {
        error(
            `Relic "${id}" has no 2-piece effect`,
        );
    }

    if (
        relic.type === 'cavern' &&
        !relic['4p']
    ) {
        error(
            `Cavern Relic "${id}" has no 4-piece effect`,
        );
    }
}

ok(
    `Loaded ${Object.keys(relicData).length} Relic sets`,
);

/*
 * Helpers
 */

function validateStat(
    stat,
    sourceFile,
) {
    if (!(stat in stats)) {
        error(
            `Unknown stat "${stat}" in ${path.relative(
                ROOT,
                sourceFile,
            )}`,
        );
    }
}

function validateLightConeItem(
    item,
    characterPath,
    sourceFile,
) {
    const id =
        typeof item === 'string'
            ? item
            : item?.name;

    if (!id) {
        error(
            `Light Cone item without a name in ${path.relative(
                ROOT,
                sourceFile,
            )}`,
        );

        return;
    }

    if (!lightCones[id]) {
        error(
            `Unknown Light Cone "${id}" in ${path.relative(
                ROOT,
                sourceFile,
            )}`,
        );

        return;
    }

    const actualPath =
        lightConePaths[id];

    if (
        characterPath &&
        actualPath !== characterPath
    ) {
        error(
            `Light Cone "${id}" is ${actualPath}, but character uses ${characterPath} (${path.relative(
                ROOT,
                sourceFile,
            )})`,
        );
    }
}

function validateLightConeFile(
    file,
    characterPath,
) {
    const data = readJSON(file);

    if (!data) return;

    if (
        !Array.isArray(data.light_cones)
    ) {
        error(
            `${path.relative(
                ROOT,
                file,
            )} is missing "light_cones" array`,
        );

        return;
    }

    for (const rank of data.light_cones) {
        if (!Array.isArray(rank.items)) {
            error(
                `Light Cone rank has no items array in ${path.relative(
                    ROOT,
                    file,
                )}`,
            );

            continue;
        }

        for (const item of rank.items) {
            validateLightConeItem(
                item,
                characterPath,
                file,
            );
        }
    }

    for (const item of data.conditional ?? []) {
        validateLightConeItem(
            item,
            characterPath,
            file,
        );
    }
}

function validateRelicItem(
    item,
    file,
) {
    if (!item?.name) {
        error(
            `Relic item has no name in ${path.relative(
                ROOT,
                file,
            )}`,
        );

        return;
    }

    const relic =
        relicData[item.name];

    if (!relic) {
        error(
            `Unknown Relic "${item.name}" in ${path.relative(
                ROOT,
                file,
            )}`,
        );

        return;
    }

    if (
        relic.type === 'planar' &&
        item.pieces !== 2
    ) {
        error(
            `Planar Ornament "${item.name}" must use 2 pieces`,
        );
    }

    if (
        relic.type === 'cavern' &&
        ![2, 4].includes(item.pieces)
    ) {
        error(
            `Cavern Relic "${item.name}" must use 2 or 4 pieces`,
        );
    }
}

function validateRelicGroup(
    group,
    file,
) {
    for (const item of group.items ?? []) {
        validateRelicItem(
            item,
            file,
        );
    }

    for (const choice of group.choices ?? []) {
        for (const item of choice.items ?? []) {
            validateRelicItem(
                item,
                file,
            );
        }
    }
}

function validateRelicSetFile(file) {
    const data = readJSON(file);

    if (!data) return;

    for (const section of [
        'relic_sets',
        'planar_ornaments',
    ]) {
        for (const rank of data[section] ?? []) {
            for (const group of rank.groups ?? []) {
                validateRelicGroup(
                    group,
                    file,
                );
            }
        }
    }

    for (const entry of data.conditional ?? []) {
        const groups =
            entry.groups ?? [entry];

        for (const group of groups) {
            validateRelicGroup(
                group,
                file,
            );
        }
    }
}

function validateMainStats(file) {
    const data = readJSON(file);

    if (!data) return;

    const mainStats =
        data.main_stats ?? {};

    const validSlots = new Set([
        'body',
        'feet',
        'planar_sphere',
        'link_rope',
    ]);

    for (const [slot, values] of Object.entries(
        mainStats,
    )) {
        if (!validSlots.has(slot)) {
            error(
                `Unknown relic slot "${slot}" in ${path.relative(
                    ROOT,
                    file,
                )}`,
            );
        }

        for (const value of values ?? []) {
            const stat =
                typeof value === 'string'
                    ? value
                    : value?.name;

            if (stat) {
                validateStat(stat, file);
            }
        }
    }
}

function validateSubstats(file) {
    const data = readJSON(file);

    if (!data) return;

    for (
        const value of
        data.substats_priority ?? []
    ) {
        if (typeof value === 'string') {
            validateStat(value, file);
            continue;
        }

        for (const stat of value.items ?? []) {
            validateStat(stat, file);
        }
    }
}

/*
 * Character content
 */

const contentRoot = path.join(
    ROOT,
    'src/content',
);

const characterDataRoot = path.join(
    ROOT,
    'src/data/characters',
);

function validateBuildFiles(
    directory,
    characterPath,
) {
    const lightConeFile = path.join(
        directory,
        'light-cones.json',
    );

    const relicSetFile = path.join(
        directory,
        'relic-sets.json',
    );

    const mainStatsFile = path.join(
        directory,
        'relic-mainstats.json',
    );

    const substatsFile = path.join(
        directory,
        'relic-substats.json',
    );

    if (fs.existsSync(lightConeFile)) {
        validateLightConeFile(
            lightConeFile,
            characterPath,
        );
    }

    if (fs.existsSync(relicSetFile)) {
        validateRelicSetFile(
            relicSetFile,
        );
    }

    if (fs.existsSync(mainStatsFile)) {
        validateMainStats(
            mainStatsFile,
        );
    }

    if (fs.existsSync(substatsFile)) {
        validateSubstats(
            substatsFile,
        );
    }
}

for (const element of fs.readdirSync(
    contentRoot,
)) {
    if (element === 'site') continue;

    const elementDirectory = path.join(
        contentRoot,
        element,
    );

    if (
        !fs.statSync(elementDirectory).isDirectory()
    ) {
        continue;
    }

    if (!(element in elements)) {
        error(
            `Unknown element directory "${element}"`,
        );
    }

    for (const rarity of fs.readdirSync(
        elementDirectory,
    )) {
        const rarityDirectory = path.join(
            elementDirectory,
            rarity,
        );

        if (
            !fs
                .statSync(rarityDirectory)
                .isDirectory()
        ) {
            continue;
        }

        for (const character of fs.readdirSync(
            rarityDirectory,
        )) {
            const characterDirectory = path.join(
                rarityDirectory,
                character,
            );

            if (
                !fs
                    .statSync(characterDirectory)
                    .isDirectory()
            ) {
                continue;
            }

            const metadataFile = path.join(
                characterDirectory,
                'metadata.json',
            );

            if (!fs.existsSync(metadataFile)) {
                error(
                    `Missing metadata.json for ${character}`,
                );

                continue;
            }

            const metadata =
                readJSON(metadataFile);

            if (!metadata) continue;

            if (!(metadata.path in paths)) {
                error(
                    `Character "${character}" has unknown Path "${metadata.path}"`,
                );
            }

            const characterDataFile = path.join(
                characterDataRoot,
                `${character}.json`,
            );

            if (
                !fs.existsSync(
                    characterDataFile,
                )
            ) {
                error(
                    `Missing src/data/characters/${character}.json`,
                );
            } else {
                const characterData =
                    readJSON(
                        characterDataFile,
                    );

                if (
                    characterData?.id &&
                    characterData.id !==
                        character
                ) {
                    error(
                        `Character ID "${characterData.id}" does not match filename "${character}.json"`,
                    );
                }

                if (
                    characterData?.element &&
                    characterData.element !==
                        element
                ) {
                    error(
                        `${character}.json says element "${characterData.element}", but content folder is "${element}"`,
                    );
                }

                if (
                    characterData?.path &&
                    characterData.path !==
                        metadata.path
                ) {
                    error(
                        `${character}.json says Path "${characterData.path}", but metadata says "${metadata.path}"`,
                    );
                }
            }

            /*
             * Character-level defaults.
             */
            validateBuildFiles(
                characterDirectory,
                metadata.path,
            );

            /*
             * Individual builds.
             */
            for (const entry of fs.readdirSync(
                characterDirectory,
                {
                    withFileTypes: true,
                },
            )) {
                if (!entry.isDirectory()) {
                    continue;
                }

                validateBuildFiles(
                    path.join(
                        characterDirectory,
                        entry.name,
                    ),
                    metadata.path,
                );
            }
        }
    }
}

/*
 * Result
 */

console.log('');

if (errors > 0) {
    console.error(
        `❌ Content validation failed with ${errors} error(s).`,
    );

    process.exit(1);
}

console.log(
    `✓ Content validation passed (${checked} JSON files checked).`,
);