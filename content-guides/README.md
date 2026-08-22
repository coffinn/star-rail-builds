# Content JSON Architecture

This folder documents the expected shape of the JSON files under `src/content`.
These files are for contributor to read and understand how the JSONs must be written for it to be interpreted and displayed properly on the website.

## Folder Layout

Character content is organized by element, rarity, character slug, then build
slug:

```txt
src/content/<type>/<rarity>/<character>/<build>/
```

Example:

```txt
src/content/quantum/5/silver-wolf/support/
```

Character metadata lives inside the character folder. Matching local images
mirror that path under `src/assets/character-assets`:

```txt
src/content/quantum/5/silver-wolf/metadata.json
src/assets/character-assets/quamtum/5/silver-wolf/splash_art.png
src/assets/character-assets/quantum/5/silver-wolf/portrait.png
```

`metadata.json` is used for character display data and the home page character
filters. Character images render only from the matching local WebP files under
`src/assets/character-assets`.

Build-level files live inside each build folder:

```txt
src/content/quantum/5/silver-wolf/support/build-notes.json
src/content/quantum/5/silver-wolf/support/light-cones.json
src/content/quantum/5/silver-wolf/support/relic-mainstats.json
src/content/quantum/5/silver-wolf/support/relic-sets.json
src/content/quantum/5/silver-wolf/support/relic-substats.json
src/content/quantum/5/silver-wolf/support/traces.json
```

## Character Defaults and Build Overrides

Build JSON files can be shared at the character level to avoid duplicating
common data across builds.

When the site loads a build JSON file, it checks in this order:

```txt
1. src/content/<type>/<rarity>/<character>/<build>/<file>.json
2. src/content/<type>/<rarity>/<character>/<file>.json
```

If the build folder contains the file, that build-specific file is used. If the
build folder does not contain the file, the character-level file is used as the
default.

This is useful when multiple builds share the same values. For example, if two
Amber builds use the same artifact main stats, place the shared file here:

```txt
src/content/quantum/5/silver-wolf/relic-mainstats.json
```

Then only add this file inside a specific build folder when that build needs to
override the shared defaults:

```txt
src/content/quantum/5/silver-wolf/support/relics-mainstats.json
```

This default-and-override behavior applies to build data loaded through the
content loader, including:

- `build-notes.json`
- `light-cones.json`
- `relic-mainstats.json`
- `relic-sets.json`
- `relic-substats.json`
- `traces.json`

## Shared Rules

- Folder names are stable slugs and should not be translated.
- Gameplay names usually use IDs from `src/i18n/<lang>/*.json`.
- Light cone rarity, stats, and passive data live in `src/data/light-cones/<light-cone-path>.json`. Build
  `light-cones.json` files should list light cone IDs, superimpositions, and notes only.
- Relic set rarity and set effects live in `src/data/artifacts/artifact_sets.json`. Build
  `relic-sets.json` files should list relic set IDs, rankings, and notes only.
- Notes are translated directly inside the JSONs
- Notes, when present, must include `en`; other languages are optional.
- Requested language falls back to `en`.
- Notes support Markdown (adding `**` around a work to make it bold for example), inline translation tokens, and rotation notation popovers.
- Item notes automatically add a `ⓘ` marker next to the item and create a
  matching entry in the relevant notes section.
- Top-level section notes do not add a `ⓘ` marker because they are not attached
  to one specific item.

## Recently Updated Home Filter

The home page `Recently updated` filter is generated automatically from content
data. The site reads `src/content/site/changelog.json`, uses the first two items
in `groups` as the recent changelog versions, then compares those versions with
each character metadata file:

```txt
src/content/<type>/<rarity>/<character>/metadata.json
```

A character appears in the filter when its `last_updated` value matches either
of the two latest changelog versions. Extra spaces and spacing around `/` are
normalized, so `6.6/Luna VII` and `6.6 / Luna VII` match, but contributors
should still copy the version format from the changelog to avoid mistakes.

If no character matches either recent version, the filter is not shown.

## Section-Level Notes

Build data files can include top-level `notes` for comments that belong to the
whole section instead of one specific item.

Example:

```json
{
  "notes": [
    {
      "en": "This ranking assumes the team can maintain the required aura.",
      "fr": "Ce classement suppose que l'équipe peut maintenir l'aura requise."
    }
  ],
  "relic_sets": []
}
```

Section-level notes render inside the matching notes section, such as
`Regarding Relic Choices:`, without adding a `ⓘ` marker to any listed item.

## Item-Level Notes

Use an item-level `note` when the explanation belongs to one specific light cone,
relic, stat, or trace.

Example:

```json
{
  "name": "before-the-tutorial-mission-starts",
  "note": {
    "en": "Useful when the wearer needs extra energy."
  }
}
```

This automatically:

- adds a `ⓘ` marker next to the item in the build card
- creates the matching entry under the correct notes heading

For example, light cone notes render under `Regarding Light Cone Choices:`, relic
notes render under `Regarding Relic Choices:`, and trace notes render under
`Regarding Trace Choices:`.

## What To Edit

- Use [metadata.md](./metadata.md) for character images, weapon type, and
  update version.
- Use [build-notes.md](./build-notes.md) for the build title, best-build badge,
  build-wide notes, and calculation credits.
- Use [light-cones.md](./light-cones.md) for ranked light cones and conditional light cones.
- Use [relic-sets.md](./artifacts-sets.md) for relic set rankings and
  conditional relic sets.
- Use [relic-mainstats.md](./artifacts-mainstats.md) for body, feet, planar sphere, and link rope main stats.
- Use [relic-substats.md](./artifacts-substats.md) for substat priority.
- Use [traces.md](./talents.md) for trace priority.
- You can copy the content of [json-base](./json-base) to have a pre-made structure for the different jsons

## Data and i18n Files

Shared gameplay data lives in [`src/data`](../src/data). Use it for reusable
weapon data and artifact set effects. Do not put build rankings or build notes
there.

## i18n Dictionary Files

Each language folder must contain these translation dictionaries:

```txt
src/i18n/<lang>/light-cones.json
src/i18n/<lang>/relic-sets.json
src/i18n/<lang>/characters.json
src/i18n/<lang>/elements.json
src/i18n/<lang>/types.json
src/i18n/<lang>/abilities.json
src/i18n/<lang>/notes.json
src/i18n/<lang>/ui.json
```

Use `stats.json` for stat labels and stat-like pseudo-set labels, such as `err`,
`atk%`, and `ehr`.

Use `elements.json` for elemental types, such as `fire`,
`ice`, and `lightning`.

Use `abilities.json` for ability labels and `notes.json` for reusable note
labels referenced by inline translation tokens.

## Inline Translation Tokens

For the full token rules and examples, read
[Inline Translation Tokens](../src/i18n/README.md#inline-translation-tokens).

Editorial text can reference i18n IDs:

```txt
[[light-cone:before-the-tutorial-mission-starts]]
[[set:eagle-of-twilight-line]]
[[character:silver-wolf]]
[[stat:cd]]
[[element:pyro]]
[[err]]
```

Typed tokens search a specific category. Untyped tokens search known categories.

## Rotation Notation Popovers

Use `{rot:...}` in note text when a rotation or combo notation should show the
standard keybind legend popover:

```txt
{rot:N2C}
{rot:Q > N2 E > N2 E}
```

The text inside the marker is what readers see. The popover text is translated
from the selected site language when available and falls back to English.

## File Guides

- [metadata.md](./metadata.md)
- [build-notes.md](./build-notes.md)
- [light-cones.md](./light-cones.md)
- [relic-sets.md](./relic-sets.md)
- [relic-mainstats.md](./relic-mainstats.md)
- [relic-substats.md](./relic-substats.md)
- [traces.md](./traces.md)
