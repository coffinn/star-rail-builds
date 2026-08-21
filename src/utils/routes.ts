import { getPublicCharacterSlug } from './character-slugs';
import { getContentCharacters } from './content-tree';
import { languageCodes } from './languages';

/**
 * Returns static route params for every supported language.
 */
export function getLanguageStaticPaths() {
    return languageCodes.map((lang) => ({
        params: { lang },
    }));
}

/**
 * Finds every character slug available in src/content.
 *
 * Every playable form has its own unique character folder,
 * so the folder name maps directly to the public URL.
 */
function getCharacterSlugs() {
    const slugs = new Set(
        getContentCharacters().map(({ character }) =>
            getPublicCharacterSlug({ character }),
        ),
    );

    return [...slugs].sort((a, b) =>
        a.localeCompare(b),
    );
}

/**
 * Returns static route params for every localized
 * character page.
 */
export function getCharacterStaticPaths() {
    const characters = getCharacterSlugs();

    return languageCodes.flatMap((lang) =>
        characters.map((character) => ({
            params: {
                lang,
                character,
            },
        })),
    );
}