type CharacterSlugParts = {
    character: string;
};

/**
 * Converts a character content folder name into its
 * public URL slug.
 *
 * Each playable form should have its own unique folder
 * name, so no character-specific routing logic is needed.
 *
 * Examples:
 * - silver-wolf
 * - destruction-trailblazer
 * - preservation-trailblazer
 * - harmony-trailblazer
 */
export function getPublicCharacterSlug({
    character,
}: CharacterSlugParts) {
    return character.toLowerCase();
}

/**
 * Converts a public character URL slug back into the
 * content folder lookup value.
 */
export function parsePublicCharacterSlug(
    slug: string,
): CharacterSlugParts {
    return {
        character: slug.toLowerCase(),
    };
}

/**
 * Gets the translated display name for a character slug.
 */
export function getPublicCharacterName(
    locale: any,
    { character }: CharacterSlugParts,
) {
    return (
        locale?.character?.[character] ??
        character
    );
}