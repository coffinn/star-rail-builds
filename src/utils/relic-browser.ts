import path from 'path';
import { readJSONFile } from './content';
import { getLocale, t } from './i18n';
import { resolveRelicAssetImage } from './item-assets';

const bonusKeys = ['2p', '4p'] as const;

type RelicType = 'cavern' | 'planar';

type LocalizedRelicEffect = {
    en?: string;
    [lang: string]: string | undefined;
};

type RelicSetData = {
    type: RelicType;
    rarity: number;
    version_released?: string;
    tags?: string[];
    '2p'?: LocalizedRelicEffect;
    '4p'?: LocalizedRelicEffect;
};

type LabelRef = [string, string];

type TagOption = {
    id: string;
    label: LabelRef;
    tags: string[];
};

type TagOptionGroup = {
    label: LabelRef;
    options: TagOption[];
};

const tagOptionGroups: TagOptionGroup[] = [
    {
        label: ['ui', 'Stat'],
        options: [
            {
                id: 'spd',
                label: ['stat', 'spd'],
                tags: ['spd'],
            },
            {
                id: 'atk',
                label: ['stat', 'atk%'],
                tags: ['atk'],
            },
            {
                id: 'hp',
                label: ['stat', 'hp%'],
                tags: ['hp'],
            },
            {
                id: 'def',
                label: ['stat', 'def%'],
                tags: ['def'],
            },
            {
                id: 'crit-rate',
                label: ['stat', 'cr'],
                tags: ['crit-rate', 'cr'],
            },
            {
                id: 'crit-dmg',
                label: ['stat', 'cd'],
                tags: ['crit-dmg', 'cd'],
            },
            {
                id: 'effect-hit-rate',
                label: ['stat', 'ehr'],
                tags: ['effect-hit-rate', 'ehr'],
            },
            {
                id: 'effect-res',
                label: ['stat', 'effect-res'],
                tags: ['effect-res'],
            },
            {
                id: 'break-effect',
                label: ['stat', 'break-effect'],
                tags: ['break-effect'],
            },
            {
                id: 'energy-regen',
                label: ['stat', 'err'],
                tags: ['energy-regen', 'err'],
            },
        ],
    },
    {
        label: ['ui', 'Damage Type'],
        options: [
            {
                id: 'physical-dmg',
                label: ['stat', 'physical-dmg'],
                tags: ['physical-dmg'],
            },
            {
                id: 'fire-dmg',
                label: ['stat', 'fire-dmg'],
                tags: ['fire-dmg'],
            },
            {
                id: 'ice-dmg',
                label: ['stat', 'ice-dmg'],
                tags: ['ice-dmg'],
            },
            {
                id: 'lightning-dmg',
                label: ['stat', 'lightning-dmg'],
                tags: ['lightning-dmg'],
            },
            {
                id: 'wind-dmg',
                label: ['stat', 'wind-dmg'],
                tags: ['wind-dmg'],
            },
            {
                id: 'quantum-dmg',
                label: ['stat', 'quantum-dmg'],
                tags: ['quantum-dmg'],
            },
            {
                id: 'imaginary-dmg',
                label: ['stat', 'imaginary-dmg'],
                tags: ['imaginary-dmg'],
            },
        ],
    },
    {
        label: ['ui', 'Utility'],
        options: [
            {
                id: 'action-advance',
                label: ['ui', 'Action Advance'],
                tags: ['action-advance'],
            },
        ],
    },
];

const tagGroups: TagOption[] = tagOptionGroups.flatMap(
    (group) => group.options,
);

function getRelicTagGroups(tags: string[]) {
    const tagSet = new Set(tags);

    return tagGroups
        .filter((group) =>
            group.tags.some((tag) => tagSet.has(tag)),
        )
        .map((group) => group.id);
}

function getRelicSetEntries(
    locale: any,
    lang: string,
) {
    const filePath = path.resolve(
        'src/data/relics/relic_sets.json',
    );

    const relicData = readJSONFile(filePath) as Record<
        string,
        RelicSetData
    >;

    return Object.entries(relicData).map(
        ([id, info]) => {
            const bonuses = bonusKeys
                .map((key) => ({
                    id: key,
                    label: key.toUpperCase(),
                    html:
                        info[key]?.[lang] ??
                        info[key]?.en ??
                        '',
                }))
                .filter((bonus) => bonus.html);

            return {
                id,

                image: resolveRelicAssetImage(id),

                /*
                 * We are still temporarily using
                 * the "artifact" translation category.
                 */
                name: t(
                    locale,
                    'artifact',
                    id,
                    undefined,
                    false,
                ),

                type: info.type,

                rarity: info.rarity,

                versionReleased:
                    info.version_released ?? '',

                bonuses,

                tags: info.tags ?? [],

                tagGroups: getRelicTagGroups(
                    info.tags ?? [],
                ),
            };
        },
    );
}

export function getRelicSetBrowserData(
    lang = 'en',
) {
    const locale = getLocale(lang);

    const relicSets = getRelicSetEntries(
        locale,
        lang,
    ).sort((a, b) =>
        a.name.localeCompare(b.name),
    );

    const visibleTagOptionGroups =
        tagOptionGroups
            .map((group) => ({
                label: t(
                    locale,
                    group.label[0],
                    group.label[1],
                    undefined,
                    false,
                ),

                options: group.options
                    .filter((option) =>
                        relicSets.some((relicSet) =>
                            relicSet.tagGroups.includes(
                                option.id,
                            ),
                        ),
                    )
                    .map((option) => ({
                        id: option.id,

                        label: t(
                            locale,
                            option.label[0],
                            option.label[1],
                            undefined,
                            false,
                        ),
                    })),
            }))
            .filter(
                (group) =>
                    group.options.length > 0,
            );

    return {
        relicSets,
        lang,
        locale,
        tagOptionGroups:
            visibleTagOptionGroups,
    };
}