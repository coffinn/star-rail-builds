import type { ImageMetadata } from 'astro';

export type AssetImage = Promise<{ default: ImageMetadata }>;

const weaponTypes = [
    'bow',
    'catalyst',
    'claymore',
    'polearm',
    'sword',
] as const;

const itemImages = import.meta.glob<{ default: ImageMetadata }>(
    '/src/assets/item-assets/**/*.webp',
);
const itemUrls = import.meta.glob<string>('/src/assets/item-assets/**/*.webp', {
    eager: true,
    import: 'default',
    query: '?url',
});
export function resolveRelicAssetImage(id: string) {
    return assetImage('relics', `${id}.webp`);
}
export function resolveRelicAssetUrl(id: string) {
    return assetUrl('relics', `${id}.webp`);
}
function assetPath(...parts: string[]) {
    return ['/src/assets/item-assets', ...parts].join('/');
}

function assetImage(...parts: string[]) {
    return itemImages[assetPath(...parts)]?.() ?? '';
}

function assetUrl(...parts: string[]) {
    return itemUrls[assetPath(...parts)] ?? '';
}

export function resolveWeaponAssetImage(type: string, id: string) {
    return assetImage('weapons', type, `${id}.webp`);
}

function weaponAssetUrl(type: string, id: string) {
    return assetUrl('weapons', type, `${id}.webp`);
}

export function resolveWeaponAssetUrlById(id: string) {
    const type = weaponTypes.find(
        (weaponType) => itemUrls[assetPath('weapons', weaponType, `${id}.webp`)],
    );

    return type ? weaponAssetUrl(type, id) : '';
}

export function resolveLightConeAssetImage(pathName: string, id: string) {
    return assetImage('light-cones', pathName, `${id}.webp`);
}

export function resolveLightConeAssetUrl(pathName: string, id: string) {
    return assetUrl('light-cones', pathName, `${id}.webp`);
}

export function resolveLightConeAssetUrlById(id: string) {
    const lightConeRoot = `${assetPath('light-cones')}/`;
    const suffix = `/${id}.webp`;

    const matchingPath = Object.keys(itemUrls).find(
        (asset) =>
            asset.startsWith(lightConeRoot) &&
            asset.endsWith(suffix),
    );

    return matchingPath ? itemUrls[matchingPath] : '';
}

export function resolveArtifactAssetImage(id: string) {
    return assetImage('artifacts', `${id}.webp`);
}

export function resolveArtifactAssetUrl(id: string) {
    return assetUrl('artifacts', `${id}.webp`);
}
