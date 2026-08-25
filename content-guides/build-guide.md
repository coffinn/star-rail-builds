# Build Guide Contribution Guide

This guide explains how to add a **character build guide** to Star Rail Builds.

It assumes the character itself already exists. This guide only covers the build recommendation files: build name/notes, Light Cones, Relics, main stats, substats, and Trace priority.

---

## 1. Build Folder Location

A build lives inside the character's content folder:

```text
src/content/<element>/<rarity>/<character>/<build>/
```

Example:

```text
src/content/quantum/5/silver-wolf/support/
```

A build folder should normally contain:

```text
build-notes.json
light-cones.json
relic-sets.json
relic-mainstats.json
relic-substats.json
traces.json
```

Use a stable lowercase slug for the build folder, such as:

```text
support
dps
break-dps
sustain
```

The folder name is not the visible build title. The visible title comes from `build-notes.json`.

---

## 2. `build-notes.json`

This file controls the build's displayed name and general build notes.

```json
{
  "best": true,
  "name": {
    "en": "Support"
  },
  "notes": [
    {
      "en": "This build focuses on debuffing enemies and supporting the team."
    }
  ]
}
```

### Fields

- `best`: marks the primary/recommended build.
- `name`: visible build title.
- `notes`: optional build-wide notes.

Only the build that should receive the best-build treatment should use:

```json
"best": true
```

---

## 3. `light-cones.json`

Light Cones are ranked from top to bottom.

```json
{
  "light_cones": [
    {
      "items": [
        {
          "name": "incessant-rain",
          "superimposition": 1
        }
      ]
    },
    {
      "items": [
        {
          "name": "before-the-tutorial-mission-starts",
          "superimposition": 5
        }
      ]
    }
  ]
}
```

The first object is Rank 1, the second is Rank 2, and so on.

### Equal / alternate options

Put multiple Light Cones in the same `items` array:

```json
{
  "light_cones": [
    {
      "items": [
        {
          "name": "light-cone-a",
          "superimposition": 1
        },
        {
          "name": "light-cone-b",
          "superimposition": 5
        }
      ]
    }
  ]
}
```

The first item is the main recommendation for that rank, with later items shown as alternatives.

### Superimposition

Use:

```json
"superimposition": 1
```

for S1, or:

```json
"superimposition": 5
```

for S5.

### Item notes

A Light Cone can have an explanatory note:

```json
{
  "name": "example-light-cone",
  "superimposition": 1,
  "note": {
    "en": "Best when the team can consistently satisfy its passive condition."
  }
}
```

### Conditional Light Cones

The renderer also supports a separate `conditional` list:

```json
{
  "light_cones": [
    {
      "items": [
        {
          "name": "main-option",
          "superimposition": 1
        }
      ]
    }
  ],
  "conditional": [
    {
      "name": "conditional-option",
      "superimposition": 5,
      "note": {
        "en": "Use only when its passive can be activated consistently."
      }
    }
  ]
}
```

Use the Light Cone's kebab-case ID from the shared Light Cone data, not its display name.

---

## 4. `relic-sets.json`

This file contains both Cavern Relics and Planar Ornaments.

```json
{
  "relic_sets": [
    {
      "groups": [
        {
          "items": [
            {
              "name": "eagle-of-twilight-line",
              "pieces": 4
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
}
```

- `relic_sets`: Cavern Relic recommendations.
- `planar_ornaments`: Planar Ornament recommendations.
- `name`: relic set kebab-case ID.
- `pieces`: number of pieces used.

### 2-Pc + 2-Pc example

```json
{
  "items": [
    {
      "name": "set-one",
      "pieces": 2
    },
    {
      "name": "set-two",
      "pieces": 2
    }
  ]
}
```

### Multiple ranking positions

Each object in `relic_sets` or `planar_ornaments` is another recommendation position.

```json
{
  "relic_sets": [
    {
      "groups": [
        {
          "items": [
            {
              "name": "best-set",
              "pieces": 4
            }
          ]
        }
      ]
    },
    {
      "groups": [
        {
          "items": [
            {
              "name": "second-best-set",
              "pieces": 4
            }
          ]
        }
      ]
    }
  ]
}
```

### Advanced choice groups

Relic groups support `choose` for interchangeable set options.

```json
{
  "items": [
    {
      "name": "set-a",
      "pieces": 2
    },
    {
      "name": "set-b",
      "pieces": 2
    },
    {
      "name": "set-c",
      "pieces": 2
    }
  ],
  "choose": true
}
```

Use these more complex structures only when the recommendation actually needs them.

---

## 5. `relic-mainstats.json`

Main stats are separated by HSR equipment slot.

```json
{
  "main_stats": {
    "body": [
      "ehr"
    ],
    "feet": [
      "spd"
    ],
    "planar_sphere": [
      "hp%",
      "def%"
    ],
    "link_rope": [
      "err"
    ]
  }
}
```

Supported slots:

```text
body
feet
planar_sphere
link_rope
```

Use stat IDs rather than full display names.

Common examples include:

```text
hp%
atk%
def%
spd
ehr
cr
cd
err
break
```

When multiple main stats are acceptable, list them in recommendation order.

---

## 6. `relic-substats.json`

This is the character's substat priority.

```json
{
  "substats_priority": [
    "spd",
    "ehr",
    "hp%",
    "def%"
  ]
}
```

The array is displayed in priority order.

---

## 7. `traces.json`

This controls Trace leveling priority.

```json
{
  "traces": [
    {
      "items": [
        {
          "name": "skill"
        },
        {
          "name": "ultimate"
        }
      ]
    },
    {
      "items": [
        {
          "name": "talent"
        }
      ]
    },
    {
      "items": [
        {
          "name": "basic"
        }
      ]
    }
  ]
}
```

This displays roughly as:

```text
1. Skill = Ultimate
2. Talent
3. Basic
```

### Equal priority

Put multiple Traces inside the same `items` array.

### Approximate priority

A Trace group also supports:

```json
"approx": true
```

Example:

```json
{
  "items": [
    {
      "name": "skill"
    },
    {
      "name": "talent"
    }
  ],
  "approx": true
}
```

With `approx`, the first item is the main priority and later items are displayed as approximate alternatives.

### Trace notes

```json
{
  "name": "basic",
  "note": {
    "en": "Only level this if the character uses Basic ATKs frequently."
  }
}
```

For standard characters, the usual IDs are:

```text
basic
skill
ultimate
talent
```

---

## 8. Character-Level Defaults

Build files can also be stored directly in the character folder instead of inside one specific build folder.

Example:

```text
src/content/quantum/5/example-character/relic-mainstats.json
```

The site checks:

```text
1. Current build folder
2. Parent character folder
```

The build-specific file wins when both exist.

This is useful when multiple builds share the same recommendations.

For example, if every build uses the same substat priority, put `relic-substats.json` in the character folder once and only override it inside builds that differ.

---

## 9. Complete Example Build Folder

```text
src/content/quantum/5/example-character/support/
├── build-notes.json
├── light-cones.json
├── relic-sets.json
├── relic-mainstats.json
├── relic-substats.json
└── traces.json
```

### `build-notes.json`

```json
{
  "best": true,
  "name": {
    "en": "Support"
  },
  "notes": [
    {
      "en": "Example support build."
    }
  ]
}
```

### `light-cones.json`

```json
{
  "light_cones": [
    {
      "items": [
        {
          "name": "example-light-cone",
          "superimposition": 1
        }
      ]
    }
  ]
}
```

### `relic-sets.json`

```json
{
  "relic_sets": [
    {
      "groups": [
        {
          "items": [
            {
              "name": "example-cavern-set",
              "pieces": 4
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
              "name": "example-planar-set",
              "pieces": 2
            }
          ]
        }
      ]
    }
  ]
}
```

### `relic-mainstats.json`

```json
{
  "main_stats": {
    "body": [
      "ehr"
    ],
    "feet": [
      "spd"
    ],
    "planar_sphere": [
      "hp%"
    ],
    "link_rope": [
      "err"
    ]
  }
}
```

### `relic-substats.json`

```json
{
  "substats_priority": [
    "spd",
    "ehr",
    "hp%",
    "def%"
  ]
}
```

### `traces.json`

```json
{
  "traces": [
    {
      "items": [
        {
          "name": "skill"
        },
        {
          "name": "ultimate"
        }
      ]
    },
    {
      "items": [
        {
          "name": "talent"
        }
      ]
    },
    {
      "items": [
        {
          "name": "basic"
        }
      ]
    }
  ]
}
```

---

## 10. Notes and Localization

Build notes and item-specific explanatory notes should include English.

```json
"note": {
  "en": "Use this option when the team needs additional Energy."
}
```

The site falls back to English when another language is unavailable.

Keep gameplay item names as IDs. Translation/display names should come from the site's shared data and i18n files instead of being hardcoded into each build.

---

## 11. Testing the Build

From the repository root:

```bash
npm run validate
```

Start the local site:

```bash
npm run dev
```

Before submitting or pushing a completed change:

```bash
npm run build
```

`npm run build` runs the duplicate-JSON-key check, content validation, and Astro production build.

---

## 12. Common Mistakes

### Wrong Light Cone key

Correct:

```json
"light_cones"
```

Not:

```json
"lightcones"
```

or:

```json
"weapons"
```

### Wrong file names

Use:

```text
light-cones.json
relic-sets.json
relic-mainstats.json
relic-substats.json
traces.json
build-notes.json
```

### Using display names instead of IDs

Correct:

```json
"name": "sprightly-vonwacq"
```

Avoid:

```json
"name": "Sprightly Vonwacq"
```

### Invalid JSON

JSON requires commas between properties:

```json
{
  "name": "example",
  "pieces": 4
}
```

A missing comma can prevent validation, builds, or scripts from reading the content.

### Repeating shared build data unnecessarily

If multiple builds use the exact same file, place it at the character level and only override it inside builds that differ.

---

## Quick Checklist

Before considering a build complete:

- Build folder is under the correct character.
- `build-notes.json` has the correct visible build name.
- Only the intended primary build uses `"best": true`.
- Light Cone IDs exist in shared Light Cone data.
- Relic IDs exist in shared Relic set data.
- Main stats use stat IDs.
- Substats are in the intended priority order.
- Trace groups are in the intended priority order.
- JSON syntax is valid.
- `npm run validate` passes.
- `npm run build` passes.
