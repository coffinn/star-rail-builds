import type { ImageMetadata } from 'astro';

export type AssetImage = Promise<{
    default: ImageMetadata;
}>;

const assetExtensions = [
    'webp',
    'png',
] as const;

const itemImages =
    import.meta.glob<{
        default: ImageMetadata;
    }>([
        '/src/assets/item-assets/**/*.webp',
        '/src/assets/item-assets/**/*.png',
    ]);

const itemUrls =
    import.meta.glob<string>(
        [
            '/src/assets/item-assets/**/*.webp',
            '/src/assets/item-assets/**/*.png',
        ],
        {
            eager: true,
            import: 'default',
            query: '?url',
        },
    );

/**
 * Builds the base path without an extension.
 *
 * Example:
 * /src/assets/item-assets/relics/eagle-of-twilight-line
 */
function assetPath(
    ...parts: string[]
) {
    return [
        '/src/assets/item-assets',
        ...parts,
    ].join('/');
}

/**
 * Returns all supported filename candidates.
 *
 * Example:
 * [
 *   ".../eagle-of-twilight-line.webp",
 *   ".../eagle-of-twilight-line.png"
 * ]
 */
function assetCandidates(
    ...parts: string[]
) {
    const basePath =
        assetPath(...parts);

    return assetExtensions.map(
        (extension) =>
            `${basePath}.${extension}`,
    );
}

/**
 * Resolves an Astro image import.
 */
function assetImage(
    ...parts: string[]
): AssetImage | '' {
    for (const candidate of assetCandidates(
        ...parts,
    )) {
        const loader =
            itemImages[candidate];

        if (loader) {
            return loader();
        }
    }

    return '';
}

/**
 * Resolves an image URL for popovers/etc.
 */
function assetUrl(
    ...parts: string[]
) {
    for (const candidate of assetCandidates(
        ...parts,
    )) {
        const url =
            itemUrls[candidate];

        if (url) {
            return url;
        }
    }

    return '';
}

/*
 * Relics
 */

export function resolveRelicAssetImage(
    id: string,
) {
    return assetImage(
        'relics',
        id,
    );
}

export function resolveRelicAssetUrl(
    id: string,
) {
    return assetUrl(
        'relics',
        id,
    );
}

/*
 * Light Cones
 */

export function resolveLightConeAssetImage(
    pathName: string,
    id: string,
) {
    return assetImage(
        'light-cones',
        pathName,
        id,
    );
}

export function resolveLightConeAssetUrl(
    pathName: string,
    id: string,
) {
    return assetUrl(
        'light-cones',
        pathName,
        id,
    );
}

/**
 * Finds a Light Cone image by ID regardless
 * of which Path folder contains it.
 *
 * Used by inline Light Cone popovers.
 */
export function resolveLightConeAssetUrlById(
    id: string,
) {
    const lightConeRoot =
        `${assetPath(
            'light-cones',
        )}/`;

    for (const extension of assetExtensions) {
        const suffix =
            `/${id}.${extension}`;

        const matchingPath =
            Object.keys(
                itemUrls,
            ).find(
                (candidate) =>
                    candidate.startsWith(
                        lightConeRoot,
                    ) &&
                    candidate.endsWith(
                        suffix,
                    ),
            );

        if (matchingPath) {
            return itemUrls[
                matchingPath
            ];
        }
    }

    return '';
}