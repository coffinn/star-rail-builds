# relic-mainstats.json

`relic-mainstats.json` defines main stat priorities for body, feet, planar sphere, and link rope.

```txt
src/content/<type>/<rarity>/<character>/<build>/relic-mainstats.json
```

## Expected Shape

```json
{
  "main_stats": {
    "body": [
      "cr",
      {
        "name": "cd",
        "note": {
          "en": "Use when you can reach 100% [[stat:cr]] without a [[stat:cd]] body."
        }
      }
    ],
    "feet": [
      "spd"
    ],
    "planar_sphere": [
      "quantum-dmg"
    ],
    "link_rope": [
      "atk%"
    ]
  },
  "notes": [
    {
      "en": "Main stat rankings assume the listed [[stat:cr]] target is met."
    }
  ]
}
```

## Fields

- `main_stats`: Object containing exactly these relic slots:
  - `chest`
  - `feet`
  - `planar_sphere`
  - `link_rope`
- Each slot is an ordered array of stat items.
- A stat item can be either:
  - A string stat ID, such as `"cd"` or `"atk%"`.
  - An object with `name` and optional `note`.
- `name`: Main stat ID or display string.
- `note`: Optional localized editorial note. Use this only on object stat
  items.
- `notes`: Optional top-level section notes shown under
  `Regarding Relic Choices:` without adding a `*` marker to any stat.

## Notes

- Stat IDs such as `atk%`, `err`, `cr`, and `cd` are translated through
  `src/i18n/<lang>/stats.json`.
- Custom display strings such as `merrymaking` can be used when no i18n ID exists.
- Adding `note` to an object stat automatically adds a `*` marker next to that
  stat in the main stat list.
- The same `note` also automatically creates a matching note entry under the
  `Main Stats` part of `Regarding Relic Choices:`.
- Notes support Markdown and inline translation tokens.

Example with the same note translated in different languages:

```json
{
  "name": "cr",
  "note": {
    "en": "Use when needed to reach 100% [[stat:cr]].",
    "fr": "This is the same note in french source: trust me bro."
  }
}
```
