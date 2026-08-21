# Gameplay Data

This folder contains shared gameplay data used by the website.

Unlike `src/content`, this folder is not where character build recommendations
are written. It is where reusable item data lives: weapon stats, weapon passives,
and artifact set effects.

The site combines this data with `src/i18n` dictionaries and the build JSONs in
`src/content` to display localized names, popovers, and build sections.

## Folder Layout

```txt
src/data/
|-- relics/
|   |-- relic_sets.json
|-- light-cones/
|   |-- abundance.json
|   |-- destruction.json
|   |-- elation.json
|   |-- erudition.json
|   |-- harmony.json
|   |-- hunt.json
|   |-- nihility.json
|   |-- preservation.json
|   |-- remembrance.json
```

Matching static item images live separately under:

```txt
src/assets/item-assets/artifacts/<relic-set-id>.webp
src/assets/item-assets/light-cones/<light-cone-path>/<light-cone-id>.webp
```

## How It Connects To Content

Build files usually store IDs, not full display data.

Example in a build file:

```json
{
  "name": "incessant-rain"
}
```

The site then uses:

- `src/content/.../light-cones.json` to know which weapon is recommended.
- `src/i18n/<lang>/light-cones.json` to display the localized light cone name.
- `src/data/weapons/<light-cone-path>.json` to display light cone rarity, stats, and
  passive information in the weapon popover.
- `src/assets/item-assets/light-cones/<light-cone-path>/<light-cone-id>.webp` to display its
  image.

Artifact sets work the same way:

- `src/content/.../relic-sets.json` stores relic set IDs.
- `src/i18n/<lang>/relic-sets.json` displays localized relic set names.
- `src/data/relics/relic_sets.json` displays rarity and set effects in
  the relic popover.
- `src/assets/item-assets/relics/<relic-set-id>.webp` displays its image.

## Light Cone Data

Light Cone data is split by path.

Each Light Cone entry uses the same ID as the matching i18n entry:

```txt
src/i18n/<lang>/light-cones.json
src/data/light-cones/<light-cone-path>.json
```

A Light Cone entry can include:

- `rarity`: Light Cone rarity.
- `source`: special availability source ID shown in the Light Cone popover footer,
  when relevant. The display text is translated through
  `src/i18n/<lang>/ui.json` using keys like `Light Cone source Herta's Store`. Omitted
  sources display the translated `Light Cone source Warp` value. `Herta's Store` and
  `Light Cone Manifest` are also marked as free Light Cones in rankings and
  inline Light Cone popovers.
- `effects`: localized effect text.
- `level_1`: base stats at level 1.
- `level_max`: base stats at max level.
- `s1` to `s5`: superimposition values inserted into the passive text.

Effect text can use `{{value}}` placeholders. The popover replaces these with
the correct superimposition values.

## Relic Set Data

Relic set data lives in:

```txt
src/data/relics/relic_sets.json
```

Each relic set entry uses the same ID as the matching i18n entry:

```txt
src/i18n/<lang>/relic-sets.json
src/data/relics/relic_sets.json
```

A relic set entry can include:

- `rarity`: highest rarity for the set.
- `2p`: localized 2-piece effect.
- `4p`: localized 4-piece effect.

## Item Images

Download matching WebPs from HoYoWiki with:

```sh
npm run download:weapon-assets -- <weapon-id>
npm run download:artifact-assets -- <artifact-set-id>
```

Both commands also accept `--all`, `--file <path>`, `--force`, and `--dry-run`.
The downloaded files are written to the matching `src/assets/item-assets` folder.

## Localization Rules

Gameplay data can contain localized effect text directly, such as weapon
passives or artifact set effects.

Names do not live here. Names live in `src/i18n/<lang>/*.json`.

When adding localized effect text:

- Always add `en` first.
- Other languages are optional.
- The site falls back to English when the selected language is missing.
- Keep IDs stable and do not translate them.

## When To Edit This Folder

Edit this folder when you need to add or fix reusable gameplay data, such as:

- a missing light cone effect;
- an incorrect light cone stat;
- a missing relic set effect;
- an incorrect relic set rarity;
- a new light cone or relic set used by build content.

Use the item image commands above when that ID also needs a local image.

Do not edit this folder for build rankings, character notes, or translation-only
name changes. Use these folders instead:

- `src/content` for build recommendations and notes.
- `src/i18n` for translated names and UI labels.

## Important Rules

- Keep JSON valid: double quotes, commas between entries, and no trailing comma
  after the last entry.
- Use the same ID in `src/data`, `src/i18n`, and `src/content`.
- Do not translate IDs.
- Add English fallback text for any localized effect.
- Keep light cone data in the correct light-cone-path file.
- Do not duplicate build-specific notes here. Put those in the relevant build
  JSON under `src/content`.
