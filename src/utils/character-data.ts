import fs from 'fs';
import path from 'path';

import { readJSONFile } from './content';

export type CharacterAbility = {
    type: string;
    name: string;

    tag?: string;

    energy_gain?: number;
    energy_cost?: number;
    break?: number | string;

    // Static abilities such as Technique can use this.
    description?: string;

    // Level-scaled abilities use these.
    min_level?: number;
    max_level?: number;
    default_level?: number;

    description_template?: string;

    scaling?: Record<
        string,
        Array<number | string>
    >;
};

export type CharacterMajorTrace = {
    name: string;
    description: string;
};

export type CharacterStatBonus = {
    stat: string;
    value: string;
};

export type CharacterEidolon = {
    level: number;
    name: string;
    description: string;
};

export type CharacterData = {
    id: string;
    name: string;
    rarity: number;
    element: string;
    path: string;

    version_released?: string;
    max_energy?: number;

    level_80_stats?: {
        hp?: number;
        atk?: number;
        def?: number;
        spd?: number;
    };

    abilities: Record<
        string,
        CharacterAbility
    >;

    major_traces: Record<
        string,
        CharacterMajorTrace
    >;

    stat_bonuses: CharacterStatBonus[];

    eidolons: CharacterEidolon[];
};

const characterDataPath = path.resolve(
    'src/data/characters',
);

export function loadCharacterData(
    characterId: string,
): CharacterData | null {
    const filePath = path.join(
        characterDataPath,
        `${characterId}.json`,
    );

    if (!fs.existsSync(filePath)) {
        return null;
    }

    return readJSONFile(
        filePath,
    ) as CharacterData;
}

/**
 * Builds an ability description at a chosen
 * trace level.
 */
export function renderCharacterAbilityDescription(
    ability: CharacterAbility,
    requestedLevel?: number,
) {
    if (
        !ability.description_template ||
        !ability.scaling
    ) {
        return ability.description ?? '';
    }

    const minLevel =
        ability.min_level ?? 1;

    const maxLevel =
        ability.max_level ?? minLevel;

    const defaultLevel =
        ability.default_level ??
        maxLevel;

    const level = Math.max(
        minLevel,
        Math.min(
            requestedLevel ?? defaultLevel,
            maxLevel,
        ),
    );

    const index = level - minLevel;

    return ability.description_template.replace(
        /\{\{([a-zA-Z0-9_-]+)\}\}/g,
        (match, key: string) => {
            const values =
                ability.scaling?.[key];

            const value =
                values?.[index];

            return value === undefined
                ? match
                : String(value);
        },
    );
}