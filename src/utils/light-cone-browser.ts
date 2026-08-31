import fs from 'fs';
import path from 'path';

import { readJSONFile } from './content';
import { getLocale, t } from './i18n';
import { resolveLightConeAssetImage } from './item-assets';

import {
    formatLightConePassive,
    type LightConePassiveText,
    type LightConePassiveValue,
} from './light-cone-passive';

const superimpositions = [1, 2, 3, 4, 5] as const;

type SharedLightConeData = {
    rarity: number;
    source?: string | string[];
    version_released?: string;

    passive?: LightConePassiveText;

    s1?: LightConePassiveValue[];
    s2?: LightConePassiveValue[];
    s3?: LightConePassiveValue[];
    s4?: LightConePassiveValue[];
    s5?: LightConePassiveValue[];

    level_1?: {
        hp?: number;
        atk?: number;
        def?: number;
    };

    level_max?: {
        hp?: number;
        atk?: number;
        def?: number;
    };
};

/**
 * Gets every Light Cone Path from src/data/light-cones.
 *
 * Example:
 * nihility.json -> "nihility"
 * harmony.json -> "harmony"
 */
function getLightConePaths() {
    const lightConeDataPath = path.resolve('src/data/light-cones');

    if (!fs.existsSync(lightConeDataPath)) {
        return [];
    }

    return fs
        .readdirSync(lightConeDataPath)
        .filter((fileName) => fileName.endsWith('.json'))
        .map((fileName) => path.basename(fileName, '.json'));
}

/**
 * Loads every Light Cone from every Path.
 */
function getLightConeEntries(locale: any, lang: string) {
    const lightConeDataPath = path.resolve('src/data/light-cones');
    const lightConePaths = getLightConePaths();

    return lightConePaths.flatMap((pathName) => {
        const filePath = path.join(
            lightConeDataPath,
            `${pathName}.json`,
        );

        const pathData = readJSONFile(filePath) as Record<
            string,
            SharedLightConeData
        >;

        const pathLabel = t(
            locale,
            'path',
            pathName,
            undefined,
            false,
        );

        return Object.entries(pathData).map(([id, info]) => {
            return {
                id,

                image: resolveLightConeAssetImage(
                    pathName,
                    id,
                ),

                name: t(
                    locale,
                    'lightcone',
                    id,
                    undefined,
                    false,
                ),

                rarity: info.rarity,

                path: pathName,
                pathLabel,

                versionReleased:
                    info.version_released ?? '',

                sourceName: info.source
                    ? (
                        Array.isArray(info.source)
                            ? info.source
                            : [info.source]
                    )
                        .map((source) =>
                            t(
                                locale,
                                'lightconesource',
                                source,
                                undefined,
                                false,
                            ),
                        )
                        .join(' / ')
                    : '',

                level1Hp: String(
                    info.level_1?.hp ?? '',
                ),

                levelMaxHp: String(
                    info.level_max?.hp ?? '',
                ),

                level1Atk: String(
                    info.level_1?.atk ?? '',
                ),

                levelMaxAtk: String(
                    info.level_max?.atk ?? '',
                ),

                level1Def: String(
                    info.level_1?.def ?? '',
                ),

                levelMaxDef: String(
                    info.level_max?.def ?? '',
                ),

                passivePanels: info.passive
                    ? superimpositions.map(
                        (superimposition) => ({
                            superimposition,

                            html: formatLightConePassive(
                                info,
                                superimposition,
                                lang,
                            ),
                        }),
                    )
                    : [],
            };
        });
    });
}

/**
 * Builds all data needed by the Light Cone browser.
 */
export function getLightConeBrowserData(
    lang = 'en',
) {
    const locale = getLocale(lang);

    const lightCones = getLightConeEntries(
        locale,
        lang,
    ).sort((a, b) =>
        a.name.localeCompare(b.name),
    );

    const paths = [
        ...new Map(
            lightCones.map((lightCone) => [
                lightCone.path,
                {
                    id: lightCone.path,
                    label: lightCone.pathLabel,
                },
            ]),
        ).values(),
    ].sort((a, b) =>
        a.label.localeCompare(b.label),
    );

    const rarities = [
        ...new Set(
            lightCones.map(
                (lightCone) => lightCone.rarity,
            ),
        ),
    ].sort((a, b) => a - b);

    return {
        lang,
        locale,
        rarities,
        paths,
        lightCones,
    };
}