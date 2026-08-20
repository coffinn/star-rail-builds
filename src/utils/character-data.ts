import fs from 'fs';
import path from 'path';

import { readJSONFile } from './content';

export type CharacterAbility = {
    type: string;
    name: string;
    tag?: string;
    level?: number;
    energy_gain?: number;
    energy_cost?: number;
    break?: number | string;
    description: string;
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

    abilities: Record<string, CharacterAbility>;

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

    return readJSONFile(filePath) as CharacterData;
}