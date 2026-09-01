# relic-sets.json

`relic-sets.json` defines ranked artifact set recommendations for one build.

```txt
src/content/<type>/<rarity>/<character>/<build>/relic-sets.json
```

## Expected Shape

```json
{
  "relic_sets": [
    {
      "groups": [
        {
          "items": [
            {
              "name": "genius-of-brilliant-stars",
              "pieces": 4
            }
          ]
        }
      ]
    },
    {
      "groups": [
        {
          "choose": true,
          "items": [
            {
              "name": "2pc-speed",
              "pieces": 2
            }
          ]
        }
      ]
    }
  ],
  "planar_ornaments": [
        {
            "groups": [
                {
                    "items": [
                        {
                            "name": "sprightly-vonwacq",
                            "pieces": 2
                        }
                    ]
                }
            ]
        }
    ]
  "conditional": [
    {
      "items": [
        {
          "name": "divine-querying-master-smith",
          "pieces": 4,
          "note": {
            "en": "Only useful when using Anaxa's signature weapon."
          }
        }
      ]
    }
  ],
  "notes": [
    {
      "en": "This ranking assumes the best in slot team."
    }
  ]
}
```

## Fields

- `relic_sets`: Ordered ranking entries. The array order controls the
  displayed ranking number.
  - `relic_sets[].groups`: Rendered lines for that ranking entry.
    - The first group renders on the numbered line.
    - Later groups render as approximate alternatives below the numbered line.
    - `relic_sets[].groups[].choose`: Optional boolean. Use `true` when this
      group is a choose-two mix.
    - `relic_sets[].groups[].items`: Relic set items shown in this group.
      Required unless the group uses `choices`.
      - `relic_sets[].groups[].items[].name`: Relic set ID or alias from
        `src/i18n/<lang>/relic-sets.json`, or a stat pseudo-set ID from
        `src/i18n/<lang>/stats.json`, such as `atk-set` or `2pc-speed`.
      - `relic_sets[].groups[].items[].pieces`: Number of set pieces,
        usually `2` or `4`.
      - `relic_sets[].groups[].items[].note`: Optional localized editorial
        note. Adds a `*` marker beside the item and renders in the relic
        notes section.
    - `relic_sets[].groups[].choices`: Optional array of choose-one item
      pools. Use this for 2p/2p combinations where the player should choose one
      item from each pool, such as one DMG set and one ATK/SPD set.
      If the group also has `items`, those items are fixed and the choice pools
      render after them on the same line.
      - `relic_sets[].groups[].choices[].items`: Artifact set items shown in
        that choose-one pool.
      - Choice items use the same `name`, `pieces`, and `note` fields as normal
        group items.
- `conditional`: Optional unranked relic set groups shown below the ranking
  under `Conditional (See Notes):`.
  - `conditional[].choose`: Optional boolean. Works the same way as
    `relic_sets[].groups[].choose`.
  - `conditional[].items`: Relic set items shown in this conditional group.
    - `conditional[].items[].name`: Relic set ID, relic set alias, or
      stat pseudo-set ID.
    - `conditional[].items[].pieces`: Number of set pieces, usually `2` or `4`.
    - `conditional[].items[].note`: Optional localized editorial note.
- `notes`: Optional top-level section notes shown under
  `Regarding Relic Choices:` without adding a `*` marker to any item.

## Group Rules

Every ranked relic entry must use `groups`.

### Single Entry

Use one group for a simple ranked set.

```json
{
  "groups": [
    {
      "items": [{ "name": "eagle-of-twilight-line", "pieces": 4 }]
    }
  ]
}
```

This renders as:

```txt
1 Eagle of Twilight Line (4)
```

### Alternative Entry

Use multiple groups when different options are close enough to share the same
ranking position.

The first group renders on the numbered line. Each extra group renders below it
as an approximate alternative with `≈`.

```json
{
  "groups": [
    {
      "items": [{ "name": "genius-of-brilliant-stars", "pieces": 4 }]
    },
    {
      "items": [{ "name": "poet-of-mourning-collapse", "pieces": 4 }]
    }
  ]
}
```

This renders as:

```txt
2. Genius of Brilliant Stars (4)
   ≈ Poet of Mourning Collapse (4)
```

### Choose Entry

Use `choose: true` when the player should pick two relic set items from the
same group.

A choose group renders the first item on the main line, the other items as
approximate alternatives, then a `Choose Two` label.

```json
{
  "groups": [
    {
      "choose": true,
      "items": [
        { "name": "messenger-traversing-hackerspace", "pieces": 2 },
        { "name": "sacerdos-relived-ordeal", "pieces": 2 },
        { "name": "warrior-goddess-of-sun-and-thunder", "pieces": 2 },
      ]
    }
  ]
}
```

This renders as:

```txt
3. Messenger Traversing Hackerspace (2)
   Sacerdos Relived Ordeal (2)
   Warrior Goddess of Sun and Thunder (2)
   Choose Two
```

### Choose-One Pools

Use `choices` when the player should choose one item from each pool. This is
for recommendations such as:

```txt
Messenger Traversing Hackerspace (2) / Sacerdos Relived Ordeal (2) [Choose One] and
Sacerdos Relived Ordeal (2) / Warrior Goddess of Sun and Thunder (2) [Choose One]
```

```json
{
  "groups": [
    {
      "choices": [
        {
          "items": [
            { "name": "messenger-traversing-hackerspace", "pieces": 2 },
            { "name": "sacerdos-relived-ordeal", "pieces": 2 }
          ]
        },
        {
          "items": [
            { "name": "sacerdos-relived-ordeal", "pieces": 2 },
            { "name": "warrior-goddess-of-sun-and-thunder", "pieces": 2 }
          ]
        }
      ]
    }
  ]
}
```

This renders as:

```txt
3. Messenger Traversing Hackerspace (2) / Sacerdos Relived Ordeal (2) [Choose One] and
   Sacerdos Relived Ordeal (2) / Warrior Goddess of Sun and Thunder (2) [Choose One]
```

### Fixed Entry With Choose-One Pool

Use both `items` and `choices` when part of a 2pc/2pc recommendation is fixed and
the remaining 2-piece set should be chosen from a pool.

```json
{
  "groups": [
    {
      "items": [{ "name": "sacerdos-relived-ordeal", "pieces": 2 }],
      "choices": [
        {
          "items": [
            { "name": "sacerdos-relived-ordeal", "pieces": 2 },
            { "name": "warrior-goddess-of-sun-and-thunder", "pieces": 2 }
          ]
        }
      ]
    }
  ]
}
```

This renders as:

```txt
2. Sacerdos Relived Ordeal (2) and Sacerdos Relived Ordeal (2) / Warrior Goddess of Sun and Thunder (2) [Choose One]
```

Do not put `items` or `choose` directly on a `relic_sets[]` entry.
They must be inside `relic_sets[].groups[]`.

## Conditional Sets

Use `conditional` for relic sets that are only recommended under special
conditions explained in notes. Unlike `relic_sets`, conditional entries are
group objects directly and do not use a `groups` wrapper:

```json
{
  "conditional": [
    {
      "items": [
        {
          "name": "eagle-of-twilight-line",
          "pieces": 4,
          "note": {
            "en": "Only valuable when the wearer can use Ultimate frequently."
          }
        }
      ]
    }
  ]
}
```

## Notes

- Notes support Markdown and inline translation tokens.
- Adding `note` to an item automatically adds a `*` marker next to that item in
  the relic set list.
- The same `note` also automatically creates a matching note entry under
  `Regarding Relic Choices:`.
- Relic set names are translated before rendering.
- Relic set names first look in `relic-sets.json`. If no artifact set
  translation exists, the site looks in `stats.json` so pseudo-set labels like
  `atk-set` can be used.
- Relic set aliases from `src/data/translation-aliases.json` can be used in
  `name`, such as `"isee"` for `"as-navigator-isee-sees-it"`.
- Non-`choose` groups with multiple items render on one line separated by `/`.
- `choose: true` groups render the first item on the main line, the remaining
  items as approximate alternatives, and a `Choose Two` label below them.
- `choices` groups render each item pool with a `Choose One` label. Without
  fixed `items`, each pool renders on its own line. With fixed `items`, the
  fixed item list and choice pool render together on one line.

Example with the same note translated in different languages:

```json
{
  "name": "eagle-of-twilight-line",
  "pieces": 4,
  "note": {
    "en": "Use if the wearer is able to Ultimate frequently.",
    "fr": "This note is definitely in French and is translated well."
  }
}
```
