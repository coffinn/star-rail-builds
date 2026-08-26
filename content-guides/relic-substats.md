# relic-substats.json

`relic-substats.json` defines substat priority for one build.

```txt
src/content/<type>/<rarity>/<character>/<build>/relic-substats.json
```

## Expected Shape

```json
{
  "notes": [
    {
      "en": "Substat priority changes after meeting the CRIT Rate target."
    }
  ],
  "substats_priority": [
    "er",
    {
      "name": "cr",
      "note": {
        "en": "Prioritize until you reach 100% CRIT rate.",
        "fr": "This definitely says that in french."
      }
    },
    {
      "items": [
        "atk%",
        "cd"
      ]
    }
  ]
}
```

## Fields

- `substats_priority`: Ordered list of substats.
- `notes`: Optional top-level section notes shown under
  `Regarding Relic Choices:` without adding a `*` marker to any substat.
- Each item may be either:
  - a stat ID string, such as `"cr"` or `"atk%"`
  - an object with `name` and optional `note`
  - an alternative group with `items`, where the first stat keeps the numbered
    rank and later stats render with `≈`
- `name`: Stat ID from `src/i18n/<lang>/stats.json`. Object names can also use
  inline translation tokens when a row needs custom text, such as
  `"[[stat:cr/cd]] / [[stat:hp%]]"`.
- `items`: List of stat strings or stat objects for same-rank alternatives.
- `note`: Optional localized editorial note. Adds a `*` marker beside the
  substat and renders in the `Substats` part of the relic notes section.

## Notes

- String items are concise and should be used when no note is needed.
- Object items should be used when a substat needs an explanation, or when the
  row needs custom text with inline translation tokens.
- Adding `note` to a substat automatically adds a `*` marker next to that
  substat in the substat priority list.
- The same `note` also automatically creates a matching note entry under the
  `Substats` part of `Regarding Relic Choices:`.
- Notes support Markdown and inline translation tokens.

Example with the same note translated in different languages:

```json
{
  "name": "cr",
  "note": {
    "en": "Prioritize reaching 100% CRIT Rate.",
    "fr": "This is definitely about reaching 100% CRIT Rate in french."
  }
}
```

Example with a custom object name using inline translation tokens:

```json
{
  "name": "[[stat:cr/cd]] / [[stat:hp%]]"
}
```

This renders as:

```txt
CRIT Rate / CRIT DMG / HP%
```

## Alternative Groups

Alternative groups are useful when two stats share a priority slot.

```json
{
  "substats_priority": [
    {
      "name": "cr",
      "note": {
        "en": "Prioritize first until you reach 100% CRIT Rate.",
        "fr": "Something about prioritizing CRIT Rate until 100%."
      }
    },
    "cr/cd",
    {
      "items": [
        "atk%",
        "spd"
      ]
    }
  ]
}
```

This renders as:

```txt
1. Energy Recharge*
2. CRIT Rate / CRIT DMG
3. ATK%
≈ SPD
```
