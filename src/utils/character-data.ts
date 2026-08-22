import fs from 'fs';
import path from 'path';

import { readJSONFile } from './content';

export type CharacterAbilityVariant = {
    type: string;
    name: string;

    tag?: string;

    energy_gain?: number;
    energy_cost?: number;
    break?: number | string;

    description?: string;

    description_template?: string;

    scaling?: Record<
        string,
        Array<number | string>
    >;
};

export type CharacterAbility = {
    type: string;
    name: string;

    tag?: string;

    energy_gain?: number;
    energy_cost?: number;
    break?: number | string;

    description?: string;

    min_level?: number;
    max_level?: number;
    default_level?: number;

    description_template?: string;

    scaling?: Record<
        string,
        Array<number | string>
    >;

    variants?: CharacterAbilityVariant[];
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
type ScalableAbility = {
    description?: string;
    description_template?: string;

    scaling?: Record<
        string,
        Array<number | string>
    >;
};

export function renderCharacterAbilityDescription(
    ability: ScalableAbility,
    requestedLevel?: number,
    minLevel = 1,
    defaultLevel = minLevel,
) {
    if (
        !ability.description_template ||
        !ability.scaling
    ) {
        return ability.description ?? '';
    }

    const level =
        requestedLevel ??
        defaultLevel;

    const index =
        level - minLevel;

    return ability.description_template.replace(
        /\{\{([a-zA-Z0-9_-]+)\}\}/g,
        (match, key: string) => {
            const value =
                ability.scaling?.[key]?.[index];

            return value === undefined
                ? match
                : String(value);
        },
    );
}