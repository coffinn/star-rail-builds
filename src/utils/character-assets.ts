import type {
    ImageMetadata,
} from 'astro';

type CharacterAssetKind =
    | 'image'
    | 'portrait';

type CharacterAssetImage =
    Promise<{
        default: ImageMetadata;
    }>;

type CharacterAssetContext = {
    element: string;
    rarity: string;
    character: string;
};

const assetBaseNames:
    Record<
        CharacterAssetKind,
        string
    > = {
        image: 'splash_art',
        portrait: 'portrait',
    };

const extensions = [
    'webp',
    'png',
] as const;

const characterImages =
    import.meta.glob<{
        default: ImageMetadata;
    }>([
        '/src/assets/character-assets/**/*.webp',
        '/src/assets/character-assets/**/*.png',
    ]);

export function resolveCharacterAssetImage(
    context: CharacterAssetContext,
    kind: CharacterAssetKind,
): CharacterAssetImage | undefined {
    const baseName =
        assetBaseNames[kind];

    for (
        const extension of extensions
    ) {
        const assetPath = [
            '/src/assets/character-assets',
            context.element,
            context.rarity,
            context.character,
            `${baseName}.${extension}`,
        ].join('/');

        const image =
            characterImages[
                assetPath
            ];

        if (image) {
            return image();
        }
    }

    return undefined;
}