export type LightConePassiveValue = number | string | (number | string)[];

type LocalizedPassiveText = {
    en: string;
    [lang: string]: string | undefined;
};

export type LightConePassiveText = string | LocalizedPassiveText;

type LightConeSuperimpositionData = {
    passive?: LightConePassiveText;
    s1?: LightConePassiveValue[];
    s2?: LightConePassiveValue[];
    s3?: LightConePassiveValue[];
    s4?: LightConePassiveValue[];
    s5?: LightConePassiveValue[];
};

const SUPERIMPOSITION_KEYS = ['s1', 's2', 's3', 's4', 's5'] as const;

function formatPassiveValue(
    value: LightConePassiveValue | undefined,
    suffix = '',
) {
    const text = Array.isArray(value)
        ? value.join('/')
        : String(value ?? '');

    return `<span class="weapon-popover-passive-value">${text}${suffix}</span>`;
}

function getPassiveText(
    passive: LightConePassiveText | undefined,
    lang = 'en',
) {
    if (typeof passive === 'string') {
        return passive;
    }

    return passive?.[lang] ?? passive?.en ?? '';
}

function parseSuperimposition(superimposition?: number | string) {
    const match = String(superimposition ?? '').match(/[1-5]/);
    return match ? Number(match[0]) : null;
}

function getCombinedValue(
    info: LightConeSuperimpositionData,
    valueIndex: number,
    suffix = '',
) {
    const values = SUPERIMPOSITION_KEYS.map(
        (key) => info[key]?.[valueIndex],
    );

    const separator = values.some(Array.isArray) ? ' / ' : '/';

    return values
        .map((value) =>
            Array.isArray(value)
                ? `(${formatPassiveValue(value, suffix)})`
                : formatPassiveValue(value, suffix),
        )
        .join(separator);
}

export function formatLightConePassive(
    info: LightConeSuperimpositionData,
    superimposition?: number | string,
    lang = 'en',
) {
    const passive = getPassiveText(info.passive, lang);
    const selectedSuperimposition =
        parseSuperimposition(superimposition);

    let valueIndex = 0;

    return passive.replace(
        /\{\{value\}\}(\s*(?:%|％|x|×))?/g,
        (_match, suffix = '') => {
            const index = valueIndex;
            valueIndex += 1;

            if (selectedSuperimposition) {
                const key =
                    `s${selectedSuperimposition}` as (typeof SUPERIMPOSITION_KEYS)[number];

                return formatPassiveValue(
                    info[key]?.[index],
                    suffix,
                );
            }

            return getCombinedValue(
                info,
                index,
                suffix,
            );
        },
    );
}