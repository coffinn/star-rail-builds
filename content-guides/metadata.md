# metadata.json

`metadata.json` describes character-level display metadata. It lives in the
character folder, not inside a build folder.

The site also uses this file to build the character cards on the home page,
including the data used by homepage filters.

```txt
src/content/<type>/<rarity>/<character>/metadata.json
```

## Expected Shape

```json
{
  "path": "nihility",
  "last_updated": "4.0",
  "version_released": "3.3"
}
```

## Fields

- `path`: Character path used for home page character data,
  filtering, and shared light cone rarity lookup. Common values include `abundance`,
  `destruction`, `elation`, `erudition`, and `harmony`. This must match one of the
  files in `src/data/light-cones`.
- `last_updated`: Honkai: Star Rail version string shown in the page header and used by
  the home page `Recently updated` filter. Also used to block access to a
  character's guide if its value is "WIP"
- `version_released`: Character release version from the official HoYoWiki,
  used by the home page `Release date - Newest` sort. 

## Recently Updated Filter

The home page checks the two latest versions from the first two `groups` items
in `src/content/site/changelog.json`.

When a character should appear under the `Recently updated` filter, set
`last_updated` to either version:

```json
{
  "last_updated": "4.4"
}
```

The comparison trims extra spaces and normalizes spacing around `/`. For
clarity, still copy the version exactly as it appears in the changelog. If the
value does not match either recent changelog version, the character remains
visible in the normal roster but will not appear when the `Recently updated`
filter is checked.

## Images

Hosted image files mirror the character content path under
`src/assets/character-assets`:

```txt
src/assets/character-assets/<type>/<rarity>/<character>/splash_art.png
src/assets/character-assets/<type>/<rarity>/<character>/portrait.png
```

The site renders character images only from these local files. Metadata image
URLs are ignored by the runtime.

The hosted files must be real images and must use `portrait.png` as the exact name.

- Use the small character icon from the HoYoLab Battle Chronicles for `portrait`.
- Do not use fan wiki, cropped screenshots, or unofficial image links.
- We're using the Battle Chronicles portrait because the images are of higher quality, and won't look blurry on mobile.

## Folder Values

Some character information does not live inside `metadata.json`; it comes from
the folder path instead.

```txt
src/content/<type>/<rarity>/<character>/metadata.json
```

- `<type>` controls the character page theme color and the type filter on
  the home page.
- `<rarity>` controls the rarity filter on the home page.
- `<character>` is the character slug used in URLs and translation lookups.

Example:

```txt
src/content/quantum/5/silver-wolf/metadata.json
```

This means:

- element: `quantum`
- rarity: `5`
- character slug: `silver-wolf`
