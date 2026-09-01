import { formatMissingTranslationWarning, t } from './i18n';
import translationAliases from '../data/translation-aliases.json';
import {
    formatLightConePassive,
    type LightConePassiveText,
    type LightConePassiveValue,
} from './light-cone-passive';

import {
    resolveRelicAssetUrl,
    resolveLightConeAssetUrlById,
} from './item-assets';

type TranslationCategory =
    | 'relic'
    | 'lightcone'
    | 'character'
    | 'stat'
    | 'element'
    | 'path'
    | 'ability'
    | 'note';

type InlineTranslationCategory =
    | TranslationCategory
    | 'set'
    | 'artifact'
    | 'weapon'
    | 'light-cone';

const CATEGORIES: TranslationCategory[] = [
    'relic',
    'lightcone',
    'character',
    'stat',
    'element',
    'path',
    'ability',
    'note'
];

type SharedLightConeData = {
    rarity: number;
    source?: string;

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

type LocalizedRelicEffect = {
    en?: string;
    [lang: string]: string | undefined;
};

type SharedRelicSetData = {
    rarity: number;
    '1p'?: LocalizedRelicEffect;
    '2p'?: LocalizedRelicEffect;
    '4p'?: LocalizedRelicEffect;
};

type TranslateNoteTextOptions = {
    lightConePopovers?: boolean;
    relicPopovers?: boolean;

    // Temporary compatibility with older callers.
    artifactPopovers?: boolean;

    rotationPopovers?: boolean;
};

type TranslationAliasCategory = Partial<
    Record<InlineTranslationCategory, Record<string, string>>
>;

const aliases = translationAliases as TranslationAliasCategory;

const INLINE_TRANSLATION_TOKEN_PATTERN =
    /\[\[(?:(relic|set|artifact|weapon|lightcone|light-cone|character|stat|element|path|ability|note):)?([a-z0-9%/-]+)(?:\|([^\]\n]+))?\]\]/g;
const ROTATION_POPOVER_INTRO_ID = 'Rotation notation intro';
const ROTATION_POPOVER_NUMBER_INTRO_ID = 'Rotation notation number intro';
const ROTATION_POPOVER_EXAMPLE_ID = 'Rotation notation example';
const ROTATION_POPOVER_ACTION_ROWS = [
    { key: 'N/NA', valueId: 'Rotation notation N/NA' },
    { key: 'E', valueId: 'Rotation notation E' },
    { key: 'Q/Ult/A', valueId: 'Rotation notation Q/Ult' },
    { key: 'C/CA', valueId: 'Rotation notation C/CA' },
    { key: 'P', valueId: 'Rotation notation P' },
    { key: 'D', valueId: 'Rotation notation D' },
    { key: 'J', valueId: 'Rotation notation J' },
    { key: 'W', valueId: 'Rotation notation W' },
    { key: '(text)', valueId: 'Rotation notation text' },
] as const;
const ROTATION_POPOVER_NUMBER_ROWS = [
    { key: 'N#', valueId: 'Rotation notation N#' },
    { key: '#[combo]', valueId: 'Rotation notation #[combo]' },
] as const;

/**
 * Escapes dynamic text before inserting it into generated popover HTML.
 */
function escapeHtml(value: unknown) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Formats weapon stat values as level 1 / max when both are available.
 */
function formatLightConeStatValue(
    level1Value?: number | string,
    levelMaxValue?: number | string,
) {
    if (
        level1Value === undefined ||
        level1Value === null ||
        level1Value === ''
    ) {
        return '';
    }

    if (
        levelMaxValue === undefined ||
        levelMaxValue === null ||
        levelMaxValue === ''
    ) {
        return String(level1Value);
    }

    return `${level1Value} / ${levelMaxValue}`;
}

/**
 * Translates a weapon source enum while falling back to the stored value.
 */
function translateLightConeSource(
    locale: any,
    source?: string | string[],
) {
    if (!source) {
        return '';
    }

    const sources = Array.isArray(source)
        ? source
        : [source];

    return sources
        .map((sourceId) =>
            t(
                locale,
                'lightconesource',
                sourceId,
                undefined,
                false,
            ),
        )
        .join(' / ');
}
/**
 * Helper class for translating structured content IDs and inline note references.
 *
 * Supports:
 * - translating artifact set/weapon/character/stat/element IDs
 * - parsing inline note syntax like [[weapon:amos-bow]]
 * - tracking missing translation warnings
 */
export class TranslationHelper {
    // Collected missing translation warnings.
    private warnings: string[] = [];

    // Used to prevent duplicate warnings.
    private warningSet = new Set<string>();

    /**
     * Creates a new translation helper instance.
     *
     * @param locale Current locale object returned by getLocale().
     * @param weaponDataById Shared weapon data keyed by weapon translation ID.
     */
    constructor(
        private locale: any,
        private lightConeDataById: Record<string, SharedLightConeData> = {},
        private lang = 'en',
        private relicSetDataById: Record<
            string,
            SharedRelicSetData
        > = {},
    ) { }

    /**
     * Translates a content ID from a specific category.
     *
     * If the locale-specific translation is missing, a warning is stored while
     * the shared i18n helper falls back to English when available.
     * TODO: remove cuz i dont use the warnings anymore
     * @param category Translation category.
     * @param id Translation ID.
     * @param sourceFile Optional source file path for debugging.
     * @returns Localized string, English fallback, or original ID if unresolved.
     */
    translate(category: TranslationCategory, id: string, sourceFile?: string) {

        return t(this.locale, category, id, sourceFile);
    }

    /**
     * Parses and translates inline note references.
     *
     * Supported syntax:
     * - [[weapon:amos-bow]]
     * - [[set:viridescent-venerer]]
     * - [[character:furina]]
     * - [[stat:er]]
     * - [[element:melt]]
     * - [[ability:burst]]
     * - [[note:er-req]]
     * - [[some-id]] (automatic category lookup)
     * - [[weapon:the-catch|custom visible text]]
     *
     * Unknown IDs are left unchanged and logged as warnings.
     *
     * @param text Raw note text.
     * @param sourceFile Optional source file path for debugging.
     * @returns Note text with translated inline references.
     */
    translateNoteText(
        text: string,
        sourceFile?: string,
        options: TranslateNoteTextOptions = {},
    ) {
        const translatedText = text.replace(
            INLINE_TRANSLATION_TOKEN_PATTERN,
            (
                match,
                category: InlineTranslationCategory | undefined,
                id: string,
                label: string | undefined,
            ) => {
                const translation = this.translateInlineId(
                    id,
                    category,
                    sourceFile,
                    options,
                    label,
                );

                return translation ?? match;
            },
        );

        return options.rotationPopovers
            ? this.renderRotationPopovers(translatedText)
            : translatedText;
    }

    /**
     * Replaces rotation notation markers with inline popovers.
     *
     * Contributors can write `{rot:N2C}` or `{rot:Q > N2 E}` in note text. The
     * notation inside the marker remains visible, and the popover always shows
     * the localized rotation legend.
     */
    private renderRotationPopovers(text: string) {
        return text.replace(/\{rot:([^}\n]+)\}/g, (match, notation: string) => {
            const trimmedNotation = notation.trim();

            return trimmedNotation
                ? this.renderRotationPopover(trimmedNotation)
                : match;
        });
    }

    /**
     * Builds the inline HTML for one rotation notation popover.
     */
    private renderRotationPopover(notation: string) {
        const cardHtml = [
            '<span class="rotation-popover-intro">',
            escapeHtml(
                t(this.locale, 'ui', ROTATION_POPOVER_INTRO_ID, undefined, false),
            ),
            '</span>',
            '<span class="rotation-popover-legend">',
            this.renderRotationPopoverRows(ROTATION_POPOVER_ACTION_ROWS),
            '</span>',
            '<span class="rotation-popover-note">',
            escapeHtml(
                t(
                    this.locale,
                    'ui',
                    ROTATION_POPOVER_NUMBER_INTRO_ID,
                    undefined,
                    false,
                ),
            ),
            '</span>',
            '<span class="rotation-popover-legend">',
            this.renderRotationPopoverRows(ROTATION_POPOVER_NUMBER_ROWS),
            '</span>',
            '<span class="rotation-popover-note">',
            escapeHtml(
                t(this.locale, 'ui', ROTATION_POPOVER_EXAMPLE_ID, undefined, false),
            ),
            '</span>',
        ].join('');

        return [
            '<span class="info-popover rotation-popover" data-info-popover-card-class="rotation-popover-card" data-info-popover-html="',
            escapeHtml(cardHtml),
            '">',
            '<button class="info-popover-trigger rotation-popover-trigger" type="button" aria-expanded="false">',
            escapeHtml(notation),
            '</button>',
            '</span>',
        ].join('');
    }

    /**
     * Builds the formatted key/value rows used inside the rotation legend.
     */
    private renderRotationPopoverRows(
        rows: readonly { key: string; valueId: string }[],
    ) {
        return rows
            .map((row) =>
                [
                    '<span class="rotation-popover-row">',
                    '<strong class="rotation-popover-key">',
                    escapeHtml(row.key),
                    '</strong>',
                    ' = ',
                    escapeHtml(t(this.locale, 'ui', row.valueId, undefined, false)),
                    '</span>',
                ].join(''),
            )
            .join('');
    }

    /**
     * Translates an inline note ID.
     *
     * If a category is provided, only that category is checked.
     * Otherwise, all known categories are searched.
     *
     * @param id Translation ID found inside an inline note reference.
     * @param category Optional translation category.
     * @param sourceFile Optional source file path for debugging.
     * @param label Optional text to show instead of the localized dictionary value.
     * @returns Localized or fallback string, or null if no translation exists.
     */
    private translateInlineId(
        id: string,
        category?: InlineTranslationCategory,
        sourceFile?: string,
        options: TranslateNoteTextOptions = {},
        label?: string,
    ) {
        const displayLabel = label?.trim();

        if (category) {
            const translationCategory = this.toTranslationCategory(category);
            const canonicalId = this.resolveAlias(translationCategory, id);
            const translation = t(this.locale, translationCategory, canonicalId, sourceFile);

            if (translation === canonicalId) {
                return null;
            }

            const displayName = displayLabel || translation;

            if (
                translationCategory === 'lightcone' &&
                options.lightConePopovers
            ) {
                return this.renderLightConePopover(
                    canonicalId,
                    translation,
                    displayName,
                );
            }

            if (
                translationCategory === 'relic' &&
                (
                    options.relicPopovers ||
                    options.artifactPopovers
                )
            ) {
                return this.renderRelicPopover(
                    canonicalId,
                    translation,
                    displayName,
                );
            }

            return displayLabel ? escapeHtml(displayLabel) : translation;
        }

        return this.findTranslationInAnyCategory(id, sourceFile, displayLabel);
    }

    /**
     * Maps inline token category aliases to real translation dictionaries.
     */
    private toTranslationCategory(
        category: InlineTranslationCategory,
    ): TranslationCategory {
        if (
            category === 'set' ||
            category === 'artifact'
        ) {
            return 'relic';
        }

        if (
            category === 'weapon' ||
            category === 'light-cone'
        ) {
            return 'lightcone';
        }

        return category;


    }

    /**
     * Resolves a short alias into its canonical translation ID.
     */
    resolveAlias(
        category: TranslationCategory,
        id: string,
    ) {
        const aliasCategory =
            category === 'relic'
                ? 'set'
                : category;

        return aliases[aliasCategory]?.[id] ?? id;
    }

    /**
     * Builds the inline HTML for a weapon translation token popover.
     */
    /**
 * Builds the inline HTML for a Light Cone translation token popover.
 */
    private renderLightConePopover(
        id: string,
        name: string,
        label = name,
    ) {
        const info = this.lightConeDataById[id];

        if (!info) {
            return escapeHtml(label);
        }

        const hpValue = formatLightConeStatValue(
            info.level_1?.hp,
            info.level_max?.hp,
        );

        const atkValue = formatLightConeStatValue(
            info.level_1?.atk,
            info.level_max?.atk,
        );

        const defValue = formatLightConeStatValue(
            info.level_1?.def,
            info.level_max?.def,
        );

        const superimpositions = [1, 2, 3, 4, 5] as const;

        const superimpositionButtons = superimpositions
            .map((superimposition) =>
                [
                    '<button ',
                    'class="weapon-popover-refinement-button" ',
                    'type="button" ',
                    'data-refinement="s',
                    superimposition,
                    '" ',
                    'aria-pressed="',
                    superimposition === 1 ? 'true' : 'false',
                    '">',
                    'S',
                    superimposition,
                    '</button>',
                ].join(''),
            )
            .join('');

        const passivePanels = superimpositions
            .map((superimposition) =>
                [
                    '<span ',
                    'class="weapon-popover-passive-refinement" ',
                    'data-refinement-panel="s',
                    superimposition,
                    '"',
                    superimposition === 1 ? '' : ' hidden',
                    '>',
                    formatLightConePassive(
                        info,
                        superimposition,
                        this.lang,
                    ),
                    '</span>',
                ].join(''),
            )
            .join('');

        const sourceName = translateLightConeSource(
            this.locale,
            info.source,
        );

        const sourceFooter = sourceName
            ? [
                '<span class="weapon-popover-source"><span>',
                escapeHtml(
                    t(
                        this.locale,
                        'ui',
                        'Source',
                        undefined,
                        false,
                    ),
                ),
                '</span><strong>',
                escapeHtml(sourceName),
                '</strong></span>',
            ].join('')
            : '';

        const imageUrl = resolveLightConeAssetUrlById(id);

        const imageMarkup = imageUrl
            ? [
                '<span class="info-popover-image weapon-popover-image"><img src="',
                escapeHtml(imageUrl),
                '" alt="" loading="lazy" decoding="async"></span>',
            ].join('')
            : '';

        const cardHtml = [
            '<span class="info-popover-header',
            imageUrl ? ' has-image' : '',
            '">',

            imageMarkup,

            '<span class="info-popover-name">',
            escapeHtml(name),
            '</span>',

            '<span class="info-popover-rarity">',
            escapeHtml(info.rarity),
            ' ★</span>',

            '</span>',

            '<span class="info-popover-stat"><span>HP</span><strong>',
            escapeHtml(hpValue),
            '</strong></span>',

            '<span class="info-popover-stat"><span>ATK</span><strong>',
            escapeHtml(atkValue),
            '</strong></span>',

            '<span class="info-popover-stat"><span>DEF</span><strong>',
            escapeHtml(defValue),
            '</strong></span>',

            '<span class="weapon-popover-refinement">',
            superimpositionButtons,
            '</span>',

            '<span class="weapon-popover-passive">',
            passivePanels,
            '</span>',

            sourceFooter,
        ].join('');

        return [
            '<span class="info-popover weapon-popover" data-info-popover-html="',
            escapeHtml(cardHtml),
            '">',
            '<button class="info-popover-trigger" type="button" aria-expanded="false">',
            escapeHtml(label),
            '</button>',
            '</span>',
        ].join('');
    }

    /**
     * Selects a localized artifact set effect with English fallback.
     */
    private getLocalizedRelicEffect(
        effect?: LocalizedRelicEffect,
    ) {
        if (!effect) return '';

        return effect[this.lang] ?? effect.en ?? '';
    }

    /**
     * Builds the inline HTML for an artifact set translation token popover.
     */
    private renderRelicPopover(
        id: string,
        name: string,
        label = name,
    ) {
        const info = this.relicSetDataById[id];

        if (!info) {
            return escapeHtml(label);
        }

        const effectRows = [
            {
                label: t(
                    this.locale,
                    'ui',
                    '1-Pc',
                    undefined,
                    false,
                ),
                value: this.getLocalizedRelicEffect(info['1p']),
            },
            {
                label: t(
                    this.locale,
                    'ui',
                    '2-Pc',
                    undefined,
                    false,
                ),
                value: this.getLocalizedRelicEffect(info['2p']),
            },
            {
                label: t(
                    this.locale,
                    'ui',
                    '4-Pc',
                    undefined,
                    false,
                ),
                value: this.getLocalizedRelicEffect(info['4p']),
            },
        ].filter((row) => row.value);
        const imageUrl = resolveRelicAssetUrl(id);
        const imageMarkup = imageUrl
            ? [
                '<span class="info-popover-image artifact-popover-image"><img src="',
                escapeHtml(imageUrl),
                '" alt="" loading="lazy" decoding="async"></span>',
            ].join('')
            : '';
        const cardHtml = [
            '<span class="info-popover-header',
            imageUrl ? ' has-image' : '',
            '">',
            imageMarkup,
            '<span class="info-popover-name">',
            escapeHtml(name),
            '</span>',
            '<span class="info-popover-rarity">',
            escapeHtml(info.rarity),
            ' \u2605</span>',
            '</span>',
            effectRows
                .map((row) =>
                    [
                        '<span class="info-popover-stat artifact-popover-effect"><span>',
                        escapeHtml(row.label),
                        '</span><strong>',
                        escapeHtml(row.value),
                        '</strong></span>',
                    ].join(''),
                )
                .join(''),
        ].join('');

        return [
            '<span class="info-popover artifact-popover" data-info-popover-card-class="artifact-popover-card" data-info-popover-html="',
            escapeHtml(cardHtml),
            '">',
            '<button class="info-popover-trigger artifact-popover-trigger" type="button" aria-expanded="false">',
            escapeHtml(label),
            '</button>',
            '</span>',
        ].join('');
    }

    /**
     * Searches every known translation category for a matching ID.
     *
     * Used by inline note references without an explicit category,
     * such as [[er]] or [[melt]].
     *
     * @param id Translation ID to search for.
     * @param sourceFile Optional source file path for debugging.
     * @param label Optional text to show instead of the localized dictionary value.
     * @returns Localized or fallback string, or null if no category contains it.
     */
    private findTranslationInAnyCategory(
        id: string,
        sourceFile?: string,
        label?: string,
    ) {
        for (const category of CATEGORIES) {
            const canonicalId = this.resolveAlias(category, id);
            // Fallback hits are valid display text, but the missing locale still matters.
            const hasLocalizedTranslation =
                this.locale?.[category]?.[canonicalId] !== undefined;
            const translation = t(
                this.locale,
                category,
                canonicalId,
                sourceFile,
                false,
            );

            if (translation !== canonicalId) {
                return label ? escapeHtml(label) : translation;
            }
        }


        return null;
    }

    /**
     * Stores a warning if it has not already been added.
     *
     * @param warning Warning message to store.
     */
    private addWarning(warning: string) {
        if (!this.warningSet.has(warning)) {
            this.warningSet.add(warning);
            this.warnings.push(warning);
        }
    }

    /**
     * Returns all collected translation warnings.
     *
     * @returns Array of warning strings.
     */
    getWarnings() {
        return this.warnings;
    }
}
