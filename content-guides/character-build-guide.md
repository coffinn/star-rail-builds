# Character Build Contribution Guide

A complete guide for adding, editing, and maintaining character build recommendations in **Star Rail Builds**.

This guide focuses on the build-guide content stored under:

```text
src/content/
```

It covers:

- character content folders
- metadata
- single and alternate builds
- character-level shared defaults
- build-specific overrides
- build names and build-wide notes
- Light Cone recommendations
- Relic recommendations
- Relic main stats
- Relic substats
- Recommended Stats
- Trace priorities
- item notes and the `ⓘ` system
- section-wide notes
- translations and IDs
- testing and validation
- complete single-build and multi-build examples

> This guide is for **build recommendations**. Character kit data such as ability descriptions, Eidolons, base stats, Memosprites, alternate abilities, and Global Passives lives under `src/data/characters/` and is handled separately.

---

# Table of Contents

1. [How Character Builds Are Organized](#1-how-character-builds-are-organized)
2. [Quick Start](#2-quick-start)
3. [Character Folder and Metadata](#3-character-folder-and-metadata)
4. [How Build Folders Work](#4-how-build-folders-work)
5. [Adding an Alternate Build](#5-adding-an-alternate-build)
6. [Character-Level Defaults and Build Overrides](#6-character-level-defaults-and-build-overrides)
7. [`build-notes.json`](#7-build-notesjson)
8. [`light-cones.json`](#8-light-conesjson)
9. [`relic-sets.json`](#9-relic-setsjson)
10. [`relic-mainstats.json`](#10-relic-mainstatsjson)
11. [`relic-substats.json`](#11-relic-substatsjson)
12. [`recommended-stats.json`](#12-recommended-statsjson)
13. [`traces.json`](#13-tracesjson)
14. [The `ⓘ` Note System](#14-the--note-system)
15. [Section-Level Notes](#15-section-level-notes)
16. [Build-Wide Notes](#16-build-wide-notes)
17. [Calculation Credits](#17-calculation-credits)
18. [Markdown and Inline Translation Tokens](#18-markdown-and-inline-translation-tokens)
19. [IDs and Translation Files](#19-ids-and-translation-files)
20. [Complete Single-Build Example](#20-complete-single-build-example)
21. [Complete Alternate-Build Example](#21-complete-alternate-build-example)
22. [Recommended Workflow for Multiple Builds](#22-recommended-workflow-for-multiple-builds)
23. [Testing and Validation](#23-testing-and-validation)
24. [Common Mistakes](#24-common-mistakes)
25. [Copy-Paste Templates](#25-copy-paste-templates)
26. [Final Checklist](#26-final-checklist)

---

# 1. How Character Builds Are Organized

Character build content is organized by:

```text
src/content/<element>/<rarity>/<character>/<build>/
```

Example:

```text
src/content/quantum/5/silver-wolf/support/
```

Breaking that down:

```text
quantum       = element
5             = rarity
silver-wolf   = character slug
support       = build slug
```

A normal character folder may look like:

```text
src/content/quantum/5/silver-wolf/
├── metadata.json
└── support/
    ├── build-notes.json
    ├── light-cones.json
    ├── relic-sets.json
    ├── relic-mainstats.json
    ├── relic-substats.json
    ├── recommended-stats.json
    └── traces.json
```

A character with multiple builds may look like:

```text
src/content/quantum/5/example-character/
├── metadata.json
├── support/
│   ├── build-notes.json
│   ├── light-cones.json
│   ├── relic-sets.json
│   ├── relic-mainstats.json
│   ├── relic-substats.json
│   ├── recommended-stats.json
│   └── traces.json
└── break-dps/
    ├── build-notes.json
    ├── light-cones.json
    ├── relic-sets.json
    ├── relic-mainstats.json
    ├── relic-substats.json
    ├── recommended-stats.json
    └── traces.json
```

The site automatically treats **child directories inside the character folder as builds**.

You do not need to register each build in a separate list.

---

# 2. Quick Start

If the character already exists and you only want to add one build:

## Step 1

Create a build folder:

```text
src/content/<element>/<rarity>/<character>/<build-slug>/
```

Example:

```text
src/content/quantum/5/silver-wolf/support/
```

## Step 2

Add the normal build files:

```text
build-notes.json
light-cones.json
relic-sets.json
relic-mainstats.json
relic-substats.json
recommended-stats.json
traces.json
```

## Step 3

At minimum, give the build a visible name in:

```text
build-notes.json
```

Example:

```json
{
  "best": true,
  "name": {
    "en": "Support"
  }
}
```

## Step 4

Fill in recommendations.

## Step 5

Run:

```bash
npm run validate
```

Then:

```bash
npm run build
```

---

# 3. Character Folder and Metadata

Character-level metadata lives at:

```text
src/content/<element>/<rarity>/<character>/metadata.json
```

Example:

```text
src/content/quantum/5/silver-wolf/metadata.json
```

A typical file looks like:

```json
{
  "path": "nihility",
  "last_updated": "4.0",
  "version_released": "1.1"
}
```

## Main fields

### `path`

The character's Path.

Examples:

```text
abundance
destruction
elation
erudition
harmony
hunt
nihility
preservation
remembrance
```

This is important because Light Cone recommendations are resolved against the shared Light Cone database for that Path.

### `last_updated`

The game version in which the guide was last updated.

Example:

```json
"last_updated": "4.0"
```

This is also used by the site's Recently Updated filtering system.

### `version_released`

The version in which the character originally released.

Example:

```json
"version_released": "1.1"
```

This is used for release-date sorting.

---

## Element, rarity, and character slug

These come from the folder path itself:

```text
src/content/quantum/5/silver-wolf/
```

means:

```text
element   = quantum
rarity    = 5
slug      = silver-wolf
```

Use stable lowercase slugs.

Good:

```text
silver-wolf
trailblazer-preservation
march-7th
```

Avoid display-name folders like:

```text
Silver Wolf
Trailblazer: Preservation
March 7th
```

---

# 4. How Build Folders Work

Every child directory directly inside a character content folder is treated as a build.

For example:

```text
example-character/
├── metadata.json
├── support/
└── break-dps/
```

creates two builds:

```text
Support
Break DPS
```

The folder names themselves are **slugs**, not necessarily the visible titles.

Use:

```text
support
dps
break-dps
sustain
hybrid
hypercarry
sub-dps
```

The visible build name should be defined in:

```text
build-notes.json
```

Example:

```json
{
  "name": {
    "en": "Break DPS"
  }
}
```

---

## Which build opens by default?

The character page looks for a build with:

```json
"best": true
```

That build becomes the default displayed build.

If no build has `"best": true`, the site falls back to the first discovered build.

For predictable behavior, a multi-build character should normally have **exactly one** build marked:

```json
"best": true
```

---

# 5. Adding an Alternate Build

Adding an alternate build is intentionally simple.

Suppose the character currently has:

```text
example-character/
├── metadata.json
└── support/
    ├── build-notes.json
    ├── light-cones.json
    ├── relic-sets.json
    ├── relic-mainstats.json
    ├── relic-substats.json
    ├── recommended-stats.json
    └── traces.json
```

You want to add a Break DPS build.

Create:

```text
example-character/
└── break-dps/
```

Then add its build files.

The result:

```text
example-character/
├── metadata.json
├── support/
│   ├── build-notes.json
│   ├── light-cones.json
│   ├── relic-sets.json
│   ├── relic-mainstats.json
│   ├── relic-substats.json
│   ├── recommended-stats.json
│   └── traces.json
└── break-dps/
    ├── build-notes.json
    ├── light-cones.json
    ├── relic-sets.json
    ├── relic-mainstats.json
    ├── relic-substats.json
    ├── recommended-stats.json
    └── traces.json
```

No separate registration is required.

The character page will discover both directories and expose them as separate builds.

---

## Example primary build

`support/build-notes.json`:

```json
{
  "best": true,
  "name": {
    "en": "Support"
  }
}
```

## Example alternate build

`break-dps/build-notes.json`:

```json
{
  "name": {
    "en": "Break DPS"
  }
}
```

Do not set:

```json
"best": true
```

on the alternate build unless you want it to become the primary/default build.

---

# 6. Character-Level Defaults and Build Overrides

You do **not** have to duplicate every file across every build.

The site supports shared files at the character level.

For a build file, lookup is:

```text
1. Current build folder
2. Parent character folder
```

The build-specific version wins.

---

## Example

Suppose both builds use the same Relic main stats and Trace priority.

Instead of this:

```text
example-character/
├── support/
│   ├── relic-mainstats.json
│   └── traces.json
└── break-dps/
    ├── relic-mainstats.json
    └── traces.json
```

you can use:

```text
example-character/
├── relic-mainstats.json
├── traces.json
├── support/
│   └── ...
└── break-dps/
    └── ...
```

Both builds inherit those character-level files.

---

## Overriding only one build

Suppose both builds normally use the same main stats, except Break DPS needs different ones.

Use:

```text
example-character/
├── relic-mainstats.json
├── support/
│   └── ...
└── break-dps/
    ├── relic-mainstats.json
    └── ...
```

Then:

```text
support
    ↓
uses character-level relic-mainstats.json

break-dps
    ↓
uses break-dps/relic-mainstats.json
```

---

## Recommended strategy

Put a file at the character level when it is genuinely shared between builds.

Good candidates:

```text
relic-mainstats.json
relic-substats.json
recommended-stats.json
traces.json
```

But any build file supported by the loader can use the same default/override pattern.

Do not duplicate identical files unless there is a reason.

---

# 7. `build-notes.json`

Location:

```text
src/content/<element>/<rarity>/<character>/<build>/build-notes.json
```

This controls:

- visible build name
- whether it is the primary/best build
- build-wide editorial notes
- optional calculation credits

---

## Minimal example

```json
{
  "best": true,
  "name": {
    "en": "Support"
  }
}
```

---

## Full example

```json
{
  "best": true,
  "name": {
    "en": "Support"
  },
  "notes": [
    {
      "en": "This build focuses on fast debuff application and team utility."
    },
    {
      "en": "Prioritize the listed SPD target before investing heavily into defensive substats."
    }
  ]
}
```

---

## `best`

Use:

```json
"best": true
```

on the primary build.

For alternate builds, either omit `best` or use:

```json
"best": false
```

Recommended:

- exactly one primary build
- all other builds unmarked

---

## `name`

Visible build title:

```json
"name": {
  "en": "Support"
}
```

Other translations may be added:

```json
"name": {
  "en": "Support",
  "fr": "Soutien"
}
```

If no visible name exists, the site falls back to the build folder slug.

---

# 8. `light-cones.json`

Location:

```text
src/content/<element>/<rarity>/<character>/<build>/light-cones.json
```

Light Cones are ranked from top to bottom.

---

## Basic example

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

This means approximately:

```text
1. Incessant Rain [S1]
2. Before the Tutorial Mission Starts [S5]
```

---

## Light Cone IDs

Use the Light Cone's ID, not its display name.

Good:

```json
"name": "before-the-tutorial-mission-starts"
```

Avoid:

```json
"name": "Before the Tutorial Mission Starts"
```

The display name is translated from shared site data.

---

## Superimposition

Use:

```json
"superimposition": 1
```

for S1.

Use:

```json
"superimposition": 5
```

for S5.

Strings may also be used when needed:

```json
"superimposition": "3+"
```

---

## Equal / approximate alternatives

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

The first item is the main item for the rank.

Later items are shown as approximate alternatives.

Conceptually:

```text
1. Light Cone A
≈ Light Cone B
```

---

## Conditional Light Cones

Use `conditional` for recommendations that only apply in specific circumstances:

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
        "en": "Use this only when its passive can be activated consistently."
      }
    }
  ]
}
```

Conditional recommendations should usually have a note explaining the condition.

---

## Light Cone note

```json
{
  "name": "incessant-rain",
  "superimposition": 1,
  "note": {
    "en": "Preferred when the extra Effect Hit Rate and debuff utility are useful."
  }
}
```

This adds the small clickable `ⓘ` note marker.

---

## Section-level Light Cone note

```json
{
  "notes": [
    {
      "en": "These rankings assume the character is used in a standard endgame team."
    }
  ],
  "light_cones": [
    ...
  ]
}
```

This creates a general note for the Light Cone section without attaching `ⓘ` to one item.

---

# 9. `relic-sets.json`

Location:

```text
src/content/<element>/<rarity>/<character>/<build>/relic-sets.json
```

This file contains:

- Cavern Relics
- Planar Ornaments
- rankings
- alternate set combinations
- conditional sets

---

## Basic example

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

---

## Ranking

Each object in:

```json
"relic_sets": []
```

is another ranking position.

Example:

```json
{
  "relic_sets": [
    {
      "groups": [
        {
          "items": [
            {
              "name": "set-a",
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
              "name": "set-b",
              "pieces": 4
            }
          ]
        }
      ]
    }
  ]
}
```

renders conceptually as:

```text
1. Set A
2. Set B
```

---

## Normal 2-Pc + 2-Pc combination

For one exact combination:

```json
{
  "groups": [
    {
      "items": [
        {
          "name": "set-a",
          "pieces": 2
        },
        {
          "name": "set-b",
          "pieces": 2
        }
      ]
    }
  ]
}
```

---

## Alternate sets at the same ranking

Use multiple `groups` inside the same ranked entry:

```json
{
  "groups": [
    {
      "items": [
        {
          "name": "genius-of-brilliant-stars",
          "pieces": 4
        }
      ]
    },
    {
      "items": [
        {
          "name": "poet-of-mourning-collapse",
          "pieces": 4
        }
      ]
    }
  ]
}
```

Conceptually:

```text
2. Genius of Brilliant Stars
≈ Poet of Mourning Collapse
```

---

## Choose Two

Use:

```json
"choose": true
```

when the player should choose two 2-Pc sets from a pool.

Example:

```json
{
  "groups": [
    {
      "choose": true,
      "items": [
        {
          "name": "messenger-traversing-hackerspace",
          "pieces": 2
        },
        {
          "name": "sacerdos-relived-ordeal",
          "pieces": 2
        },
        {
          "name": "warrior-goddess-of-sun-and-thunder",
          "pieces": 2
        }
      ]
    }
  ]
}
```

Use this for recommendations meaning:

```text
Choose any two of these 2-Pc sets.
```

---

## Choose-One pools

Use `choices` when the recommendation needs one set from one pool and one set from another.

Example:

```json
{
  "groups": [
    {
      "choices": [
        {
          "items": [
            {
              "name": "messenger-traversing-hackerspace",
              "pieces": 2
            },
            {
              "name": "sacerdos-relived-ordeal",
              "pieces": 2
            }
          ]
        },
        {
          "items": [
            {
              "name": "warrior-goddess-of-sun-and-thunder",
              "pieces": 2
            },
            {
              "name": "eagle-of-twilight-line",
              "pieces": 2
            }
          ]
        }
      ]
    }
  ]
}
```

This means:

```text
Choose one from Pool A
AND
choose one from Pool B
```

---

## Fixed set + choice pool

You can combine fixed `items` with `choices`:

```json
{
  "groups": [
    {
      "items": [
        {
          "name": "sacerdos-relived-ordeal",
          "pieces": 2
        }
      ],
      "choices": [
        {
          "items": [
            {
              "name": "messenger-traversing-hackerspace",
              "pieces": 2
            },
            {
              "name": "warrior-goddess-of-sun-and-thunder",
              "pieces": 2
            }
          ]
        }
      ]
    }
  ]
}
```

This means:

```text
2-Pc Sacerdos
+
choose one of the listed 2-Pc sets
```

---

## Conditional Relics

Conditional entries are group objects directly:

```json
{
  "conditional": [
    {
      "items": [
        {
          "name": "eagle-of-twilight-line",
          "pieces": 4,
          "note": {
            "en": "Only use this when frequent Ultimate usage makes the Action Advance valuable."
          }
        }
      ]
    }
  ]
}
```

---

## Relic item note

```json
{
  "name": "eagle-of-twilight-line",
  "pieces": 4,
  "note": {
    "en": "The Action Advance can improve rotation frequency."
  }
}
```

---

# 10. `relic-mainstats.json`

Location:

```text
src/content/<element>/<rarity>/<character>/<build>/relic-mainstats.json
```

HSR main stats use these slots:

```text
body
feet
planar_sphere
link_rope
```

---

## Basic example

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

Values are listed in recommendation order.

For example:

```json
"planar_sphere": [
  "hp%",
  "def%"
]
```

means HP% is preferred over DEF%.

---

## Common stat IDs

Examples:

```text
hp%
atk%
def%
spd
cr
cd
ehr
effect-res
break-effect
outgoing-healing
err
physical-dmg
fire-dmg
ice-dmg
lightning-dmg
wind-dmg
quantum-dmg
imaginary-dmg
```

Check:

```text
src/i18n/en/stats.json
```

for the actual supported IDs.

---

## Main stat with a note

A plain stat:

```json
"body": [
  "ehr"
]
```

can be converted to an object:

```json
"body": [
  {
    "name": "ehr",
    "note": {
      "en": "Use an Effect Hit Rate body if the desired EHR target cannot be reached through substats."
    }
  }
]
```

You can mix object and string entries:

```json
"planar_sphere": [
  {
    "name": "hp%",
    "note": {
      "en": "Usually preferred when additional survivability is needed."
    }
  },
  "def%"
]
```

---

# 11. `relic-substats.json`

Location:

```text
src/content/<element>/<rarity>/<character>/<build>/relic-substats.json
```

---

## Basic example

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

This is displayed in priority order.

---

## Substat with a note

```json
{
  "substats_priority": [
    {
      "name": "spd",
      "note": {
        "en": "Prioritize SPD until the listed breakpoint is reached."
      }
    },
    "ehr",
    "hp%",
    "def%"
  ]
}
```

---

## Same-rank / approximate alternatives

Use an `items` group:

```json
{
  "substats_priority": [
    "spd",
    {
      "items": [
        "ehr",
        "effect-res"
      ]
    },
    "hp%"
  ]
}
```

Conceptually:

```text
1. SPD
2. Effect Hit Rate
≈ Effect RES
3. HP%
```

---

## Custom translated row

If a priority row needs custom text, the `name` may use translation tokens:

```json
{
  "name": "[[stat:cr]] / [[stat:cd]]"
}
```

---

# 12. `recommended-stats.json`

Location:

```text
src/content/<element>/<rarity>/<character>/<build>/recommended-stats.json
```

This section is for **final character stat targets**, not Relic main-stat choices.

Example use cases:

```text
SPD              134 baseline / 160+ recommended
Effect Hit Rate  67% baseline / 96%+ recommended
HP               3000+ / 3500+
```

---

## Basic format

```json
{
  "stats": [
    {
      "name": "spd",
      "baseline": "134",
      "recommended": "160+"
    },
    {
      "name": "ehr",
      "baseline": "67%",
      "recommended": "96%+"
    }
  ]
}
```

---

## Fields

Each entry supports:

```text
name
baseline
recommended
note
```

### `name`

Stat ID.

### `baseline`

Minimum or basic target.

### `recommended`

Preferred target.

At least one of `baseline` or `recommended` should be present.

---

## Baseline only

```json
{
  "name": "spd",
  "baseline": "134"
}
```

Conceptually:

```text
SPD    134    —
```

---

## Recommended only

```json
{
  "name": "total-def",
  "recommended": "1000+"
}
```

Conceptually:

```text
DEF    —    1000+
```

---

## Strings are usually best

Both numbers and strings may be used.

Number:

```json
{
  "name": "spd",
  "recommended": 160
}
```

String:

```json
{
  "name": "spd",
  "recommended": "160+"
}
```

Strings are usually more useful because they allow:

```text
+
%
~
ranges
```

Examples:

```json
"recommended": "160+"
```

```json
"recommended": "80%+"
```

```json
"recommended": "3500–4000"
```

---

## Recommended Stat note

```json
{
  "name": "spd",
  "baseline": "134",
  "recommended": "160+",
  "note": {
    "en": "160+ SPD is preferred for faster rotations, while 134 SPD is a reasonable baseline."
  }
}
```

This adds the clickable `ⓘ` marker.

---

## Full example

```json
{
  "stats": [
    {
      "name": "spd",
      "baseline": "134",
      "recommended": "160+",
      "note": {
        "en": "160+ SPD is the preferred target when the build can reach it without sacrificing key utility stats."
      }
    },
    {
      "name": "ehr",
      "baseline": "67%",
      "recommended": "96%+"
    },
    {
      "name": "total-hp",
      "baseline": "3000+",
      "recommended": "3500+"
    },
    {
      "name": "total-def",
      "recommended": "1000+"
    }
  ]
}
```

---

## Total HP / ATK / DEF IDs

For final character totals, prefer IDs intended to display as total stats:

```text
total-hp
total-atk
total-def
```

Do not accidentally use Relic flat-stat IDs if those translate as:

```text
hp   -> Flat HP
atk  -> Flat ATK
def  -> Flat DEF
```

If the total-stat IDs are not yet present in a language file, add them to:

```text
src/i18n/en/stats.json
```

Example:

```json
"total-hp": "HP",
"total-atk": "ATK",
"total-def": "DEF"
```

---

# 13. `traces.json`

Location:

```text
src/content/<element>/<rarity>/<character>/<build>/traces.json
```

This controls Trace leveling priority.

---

## Basic example

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

Conceptually:

```text
1. Skill = Ultimate
2. Talent
3. Basic ATK
```

---

## Standard ability IDs

Typical IDs:

```text
basic
skill
ultimate
talent
```

Use IDs instead of display text whenever possible.

---

## Equal priority

Multiple items in one normal group are equal:

```json
{
  "items": [
    {
      "name": "skill"
    },
    {
      "name": "ultimate"
    }
  ]
}
```

renders conceptually as:

```text
Skill = Ultimate
```

---

## Approximate priority

Use:

```json
"approx": true
```

when the first item is the main priority and the later items are close alternatives:

```json
{
  "approx": true,
  "items": [
    {
      "name": "skill"
    },
    {
      "name": "talent"
    }
  ]
}
```

Conceptually:

```text
1. Skill
≈ Talent
```

---

## Trace note

```json
{
  "name": "basic",
  "note": {
    "en": "Only level Basic ATK if this build uses it frequently."
  }
}
```

---

# 14. The `ⓘ` Note System

The top recommendation cards support item-specific notes.

These notes show a small clickable:

```text
ⓘ
```

beside the relevant recommendation.

The marker links to the matching explanation in the Notes section.

The general syntax is:

```json
"note": {
  "en": "Explanation here."
}
```

---

## Light Cone

```json
{
  "name": "incessant-rain",
  "superimposition": 1,
  "note": {
    "en": "Preferred when its Effect Hit Rate and debuff utility are valuable."
  }
}
```

---

## Relic

```json
{
  "name": "eagle-of-twilight-line",
  "pieces": 4,
  "note": {
    "en": "The Action Advance is valuable in rotations that Ultimate frequently."
  }
}
```

---

## Relic main stat

```json
{
  "name": "ehr",
  "note": {
    "en": "Use when the EHR target cannot be reached through substats."
  }
}
```

---

## Relic substat

```json
{
  "name": "spd",
  "note": {
    "en": "Prioritize this until the desired breakpoint is reached."
  }
}
```

---

## Recommended Stat

```json
{
  "name": "spd",
  "baseline": "134",
  "recommended": "160+",
  "note": {
    "en": "134 is the baseline, while 160+ is preferred for the faster rotation."
  }
}
```

---

## Trace

```json
{
  "name": "basic",
  "note": {
    "en": "This can remain at a lower level if Basic ATK is rarely used."
  }
}
```

---

# 15. Section-Level Notes

Use top-level:

```json
"notes": []
```

when the explanation applies to the entire section instead of one specific item.

Example:

```json
{
  "notes": [
    {
      "en": "These Light Cone rankings assume a normal endgame team and standard rotation."
    }
  ],
  "light_cones": [
    ...
  ]
}
```

A section-level note:

- appears in the appropriate Notes section
- does **not** attach `ⓘ` to one item

Use:

```text
note
```

for one specific item.

Use:

```text
notes
```

for the section as a whole.

---

# 16. Build-Wide Notes

Use `build-notes.json` when a note applies to the entire build.

Example:

```json
{
  "name": {
    "en": "Support"
  },
  "notes": [
    {
      "en": "This build assumes the character is played as a fast debuffer rather than a damage dealer."
    },
    {
      "en": "The listed SPD recommendation takes priority over additional defensive stats."
    }
  ]
}
```

These notes are not attached to a specific item.

They belong to the build as a whole.

---

# 17. Calculation Credits

`build-notes.json` can include optional calculation credits.

For HSR content, useful keys include:

```text
light_cones
relic
relics
trace
traces
global
```

A category may be one credit object or an array of objects.

---

## Example

```json
{
  "name": {
    "en": "Support"
  },
  "light_cones": {
    "link": "https://example.com/light-cone-calcs",
    "author": "ExampleAuthor",
    "detail": "Single-target comparison"
  },
  "relics": [
    {
      "link": "https://example.com/relic-calcs-a",
      "author": "ExampleAuthor",
      "detail": "4-Pc set comparison"
    },
    {
      "link": "https://example.com/relic-calcs-b",
      "author": "AnotherAuthor"
    }
  ],
  "traces": {
    "link": "https://example.com/trace-calcs",
    "author": "ExampleAuthor"
  },
  "global": {
    "link": "https://example.com/full-sheet",
    "author": "ExampleAuthor",
    "detail": "Full build calculations"
  }
}
```

---

## Credit fields

### `link`

URL to the calculation.

### `author`

Person credited.

### `detail`

Optional description.

Example:

```json
"detail": "Single-target comparison"
```

---

# 18. Markdown and Inline Translation Tokens

Editorial notes support Markdown.

Example:

```json
{
  "en": "**160 SPD** is preferred when possible."
}
```

You can also reference translated site values using inline translation tokens.

---

## Character

```text
[[character:silver-wolf]]
```

## Light Cone

```text
[[light-cone:before-the-tutorial-mission-starts]]
```

## Relic set

```text
[[set:eagle-of-twilight-line]]
```

## Stat

```text
[[stat:spd]]
```

```text
[[stat:ehr]]
```

## Ability

```text
[[ability:skill]]
```

---

## Example note

```json
{
  "en": "Reach **160 [[stat:spd]]** when possible, then prioritize [[stat:ehr]]."
}
```

This is preferable to hardcoding translated display names inside every language.

---

# 19. IDs and Translation Files

Build JSON generally stores stable IDs.

Display names come from translation dictionaries and shared data.

Common locations:

```text
src/i18n/<lang>/characters.json
src/i18n/<lang>/light-cones.json
src/i18n/<lang>/relic-sets.json
src/i18n/<lang>/stats.json
src/i18n/<lang>/abilities.json
src/i18n/<lang>/ui.json
```

---

## Do not use display names as IDs

Good:

```json
"name": "sprightly-vonwacq"
```

Avoid:

```json
"name": "Sprightly Vonwacq"
```

Good:

```json
"name": "spd"
```

Avoid:

```json
"name": "Speed"
```

Good:

```json
"name": "skill"
```

Avoid:

```json
"name": "Skill"
```

---

## Notes require English fallback

When using localized note objects, include:

```json
"en": "..."
```

Other languages are optional.

Example:

```json
"note": {
  "en": "English fallback.",
  "fr": "French translation."
}
```

---

# 20. Complete Single-Build Example

Folder:

```text
src/content/quantum/5/example-character/
├── metadata.json
└── support/
    ├── build-notes.json
    ├── light-cones.json
    ├── relic-sets.json
    ├── relic-mainstats.json
    ├── relic-substats.json
    ├── recommended-stats.json
    └── traces.json
```

---

## `metadata.json`

```json
{
  "path": "nihility",
  "last_updated": "4.0",
  "version_released": "4.0"
}
```

---

## `support/build-notes.json`

```json
{
  "best": true,
  "name": {
    "en": "Support"
  },
  "notes": [
    {
      "en": "This build focuses on fast debuff application and team utility."
    }
  ]
}
```

---

## `support/light-cones.json`

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
          "superimposition": 5,
          "note": {
            "en": "A strong free option when the extra Energy is useful."
          }
        }
      ]
    }
  ]
}
```

---

## `support/relic-sets.json`

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

---

## `support/relic-mainstats.json`

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

---

## `support/relic-substats.json`

```json
{
  "substats_priority": [
    {
      "name": "spd",
      "note": {
        "en": "Prioritize SPD until the intended breakpoint is reached."
      }
    },
    "ehr",
    "hp%",
    "def%"
  ]
}
```

---

## `support/recommended-stats.json`

```json
{
  "stats": [
    {
      "name": "spd",
      "baseline": "134",
      "recommended": "160+",
      "note": {
        "en": "160+ SPD is preferred for faster rotations, while 134 is the basic breakpoint."
      }
    },
    {
      "name": "ehr",
      "baseline": "67%",
      "recommended": "96%+"
    },
    {
      "name": "total-hp",
      "recommended": "3500+"
    }
  ]
}
```

---

## `support/traces.json`

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
          "name": "basic",
          "note": {
            "en": "Basic ATK can remain lower if it contributes little to the build."
          }
        }
      ]
    }
  ]
}
```

---

# 21. Complete Alternate-Build Example

Suppose a character has two builds:

```text
Support
Break DPS
```

We will share main stats only where they are actually identical.

Folder:

```text
src/content/quantum/5/example-character/
├── metadata.json
├── support/
│   ├── build-notes.json
│   ├── light-cones.json
│   ├── relic-sets.json
│   ├── relic-mainstats.json
│   ├── relic-substats.json
│   ├── recommended-stats.json
│   └── traces.json
└── break-dps/
    ├── build-notes.json
    ├── light-cones.json
    ├── relic-sets.json
    ├── relic-mainstats.json
    ├── relic-substats.json
    ├── recommended-stats.json
    └── traces.json
```

---

## Primary Support build

`support/build-notes.json`:

```json
{
  "best": true,
  "name": {
    "en": "Support"
  },
  "notes": [
    {
      "en": "Recommended general-purpose build."
    }
  ]
}
```

---

## Alternate Break build

`break-dps/build-notes.json`:

```json
{
  "name": {
    "en": "Break DPS"
  },
  "notes": [
    {
      "en": "Use this build only when the character is being played around Weakness Break damage."
    }
  ]
}
```

---

## Different Light Cones

Support:

```json
{
  "light_cones": [
    {
      "items": [
        {
          "name": "support-light-cone",
          "superimposition": 1
        }
      ]
    }
  ]
}
```

Break DPS:

```json
{
  "light_cones": [
    {
      "items": [
        {
          "name": "break-light-cone",
          "superimposition": 1
        }
      ]
    }
  ]
}
```

---

## Different Relics

Support:

```json
{
  "relic_sets": [
    {
      "groups": [
        {
          "items": [
            {
              "name": "support-set",
              "pieces": 4
            }
          ]
        }
      ]
    }
  ],
  "planar_ornaments": []
}
```

Break:

```json
{
  "relic_sets": [
    {
      "groups": [
        {
          "items": [
            {
              "name": "iron-cavalry-against-the-scourge",
              "pieces": 4
            }
          ]
        }
      ]
    }
  ],
  "planar_ornaments": []
}
```

---

## Different Recommended Stats

Support:

```json
{
  "stats": [
    {
      "name": "spd",
      "baseline": "134",
      "recommended": "160+"
    },
    {
      "name": "ehr",
      "recommended": "96%+"
    }
  ]
}
```

Break DPS:

```json
{
  "stats": [
    {
      "name": "spd",
      "baseline": "145",
      "recommended": "160+"
    },
    {
      "name": "break-effect",
      "baseline": "180%",
      "recommended": "220%+"
    }
  ]
}
```

This is the core idea of alternate builds:

> each build folder is a complete recommendation set for a different playstyle.

---

# 22. Recommended Workflow for Multiple Builds

When adding a second or third build, do not immediately copy every JSON file.

First compare the builds.

Ask:

```text
Are the Light Cones different?
Are the Relics different?
Are the main stats different?
Are the substats different?
Are the Recommended Stats different?
Are the Trace priorities different?
```

If a file is identical across every build, consider moving it to the character folder.

---

## Example optimized structure

Suppose both builds share:

```text
relic-mainstats.json
traces.json
```

but differ in everything else.

Use:

```text
example-character/
├── metadata.json
├── relic-mainstats.json
├── traces.json
├── support/
│   ├── build-notes.json
│   ├── light-cones.json
│   ├── relic-sets.json
│   ├── relic-substats.json
│   └── recommended-stats.json
└── break-dps/
    ├── build-notes.json
    ├── light-cones.json
    ├── relic-sets.json
    ├── relic-substats.json
    └── recommended-stats.json
```

The loader resolves:

```text
support/relic-mainstats.json
```

If missing:

```text
../relic-mainstats.json
```

is used.

Same for the other supported build files.

---

## When not to share

Do not share a file just because the current values happen to be similar.

If the builds conceptually have different goals and are likely to diverge later, keeping separate files may make maintenance clearer.

Good shared default:

```text
Both builds always use the exact same Trace priority.
```

Less ideal shared default:

```text
They currently happen to have the same stats, but one build is a totally different playstyle and will probably change.
```

---

# 23. Testing and Validation

From the repository root:

```bash
npm run validate
```

Then start the local site:

```bash
npm run dev
```

Before pushing:

```bash
npm run build
```

The production build should catch many content problems before deployment.

---

## Things to visually check

For every build:

- build selector shows the correct build names
- intended build opens by default
- only the intended build has the best-build treatment
- Light Cone ranks display correctly
- Light Cone Superimpositions are correct
- Relic rankings display correctly
- 2-Pc combinations render correctly
- Planar Ornaments render correctly
- main-stat order is correct
- substat order is correct
- Recommended Stats show the intended baseline/recommended values
- Trace order is correct
- `ⓘ` markers appear on items with notes
- clicking a note marker jumps to the intended Notes entry
- section notes appear in the intended section
- mobile layout is readable

---

# 24. Common Mistakes

## Wrong folder level

Wrong:

```text
src/content/quantum/5/silver-wolf/light-cones.json
```

when you meant the file to apply to only the Support build.

Correct:

```text
src/content/quantum/5/silver-wolf/support/light-cones.json
```

Character-level placement means the file is a shared default.

---

## Display name instead of ID

Wrong:

```json
"name": "Sprightly Vonwacq"
```

Correct:

```json
"name": "sprightly-vonwacq"
```

---

## Wrong Light Cone field

Correct:

```json
"light_cones": []
```

Avoid:

```json
"lightcones": []
```

or old Genshin terminology such as:

```json
"weapons": []
```

---

## Wrong Relic slot

Correct:

```text
body
feet
planar_sphere
link_rope
```

Do not use old Genshin slots such as:

```text
sands
goblet
circlet
```

---

## Wrong Trace key

Use:

```json
"traces": []
```

not old:

```json
"talents": []
```

for current HSR build content.

---

## Forgetting the English note fallback

Wrong:

```json
"note": {
  "fr": "..."
}
```

Correct:

```json
"note": {
  "en": "..."
}
```

Other languages may then be added.

---

## Multiple best builds

Avoid putting:

```json
"best": true
```

in several build folders.

Normally exactly one build should be the default/primary build.

---

## Empty recommended stat entry

Bad:

```json
{
  "name": "spd"
}
```

A Recommended Stat should normally have:

```text
baseline
```

or:

```text
recommended
```

or both.

---

## Hardcoding long explanations into a value

Bad:

```json
{
  "name": "spd",
  "recommended": "160 if you can get it but 134 is okay when your other stats are too low"
}
```

Better:

```json
{
  "name": "spd",
  "baseline": "134",
  "recommended": "160+",
  "note": {
    "en": "Use 134 as the baseline if reaching 160 would sacrifice too many important stats."
  }
}
```

---

## Invalid JSON

JSON requires commas:

Wrong:

```json
{
  "name": "spd"
  "recommended": "160+"
}
```

Correct:

```json
{
  "name": "spd",
  "recommended": "160+"
}
```

---

## Duplicating shared content unnecessarily

If two builds use the exact same file, use a character-level default instead of maintaining two identical copies.

---

# 25. Copy-Paste Templates

## Complete build folder

```text
<build-slug>/
├── build-notes.json
├── light-cones.json
├── relic-sets.json
├── relic-mainstats.json
├── relic-substats.json
├── recommended-stats.json
└── traces.json
```

---

## `build-notes.json`

```json
{
  "best": false,
  "name": {
    "en": "Build Name"
  },
  "notes": [
    {
      "en": "Optional build-wide note."
    }
  ]
}
```

---

## `light-cones.json`

```json
{
  "light_cones": [
    {
      "items": [
        {
          "name": "light-cone-id",
          "superimposition": 1
        }
      ]
    }
  ],
  "conditional": []
}
```

---

## `relic-sets.json`

```json
{
  "relic_sets": [
    {
      "groups": [
        {
          "items": [
            {
              "name": "cavern-relic-id",
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
              "name": "planar-ornament-id",
              "pieces": 2
            }
          ]
        }
      ]
    }
  ]
}
```

---

## `relic-mainstats.json`

```json
{
  "main_stats": {
    "body": [
      "cr"
    ],
    "feet": [
      "spd"
    ],
    "planar_sphere": [
      "element-dmg"
    ],
    "link_rope": [
      "atk%"
    ]
  }
}
```

Replace:

```text
element-dmg
```

with the actual supported elemental DMG ID, for example:

```text
quantum-dmg
imaginary-dmg
fire-dmg
```

---

## `relic-substats.json`

```json
{
  "substats_priority": [
    "cr",
    "cd",
    "spd",
    "atk%"
  ]
}
```

---

## `recommended-stats.json`

```json
{
  "stats": [
    {
      "name": "spd",
      "baseline": "",
      "recommended": ""
    },
    {
      "name": "cr",
      "baseline": "",
      "recommended": ""
    },
    {
      "name": "cd",
      "baseline": "",
      "recommended": ""
    }
  ]
}
```

Remove fields or entries that are not needed before committing.

---

## `traces.json`

```json
{
  "traces": [
    {
      "items": [
        {
          "name": "skill"
        }
      ]
    },
    {
      "items": [
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

## Item note template

```json
"note": {
  "en": "Explanation here."
}
```

---

## Section note template

```json
"notes": [
  {
    "en": "General section explanation here."
  }
]
```

---

## Alternate-build starter structure

```text
src/content/<element>/<rarity>/<character>/
├── metadata.json
├── main-build/
│   ├── build-notes.json
│   ├── light-cones.json
│   ├── relic-sets.json
│   ├── relic-mainstats.json
│   ├── relic-substats.json
│   ├── recommended-stats.json
│   └── traces.json
└── alternate-build/
    ├── build-notes.json
    ├── light-cones.json
    ├── relic-sets.json
    ├── relic-mainstats.json
    ├── relic-substats.json
    ├── recommended-stats.json
    └── traces.json
```

Primary:

```json
{
  "best": true,
  "name": {
    "en": "Main Build"
  }
}
```

Alternate:

```json
{
  "name": {
    "en": "Alternate Build"
  }
}
```

---

# 26. Final Checklist

Before considering a character build finished:

- [ ] Character folder is under the correct element and rarity.
- [ ] `metadata.json` has the correct Path.
- [ ] `last_updated` is current.
- [ ] Build folder uses a stable lowercase slug.
- [ ] `build-notes.json` has the correct visible name.
- [ ] Exactly one intended primary build uses `"best": true`.
- [ ] Alternate builds are separate child directories.
- [ ] Shared files are placed at character level only when they truly apply to multiple builds.
- [ ] Build-specific files override shared defaults where necessary.
- [ ] Light Cone IDs exist in shared Light Cone data.
- [ ] Light Cone Superimpositions are correct.
- [ ] Relic set IDs exist.
- [ ] Cavern and Planar recommendations are in the correct arrays.
- [ ] Main stats use HSR slots: `body`, `feet`, `planar_sphere`, `link_rope`.
- [ ] Substats are in the intended order.
- [ ] Recommended Stats use appropriate IDs and display-ready values.
- [ ] Trace priorities use `basic`, `skill`, `ultimate`, and `talent` where appropriate.
- [ ] Item-specific explanations use `note`.
- [ ] General section explanations use `notes`.
- [ ] Notes include an English fallback.
- [ ] `ⓘ` markers appear where intended.
- [ ] JSON syntax is valid.
- [ ] `npm run validate` passes.
- [ ] `npm run dev` looks correct locally.
- [ ] All alternate builds switch correctly on the character page.
- [ ] `npm run build` passes before pushing.

---

# Short Version: How to Add an Alternate Build

If you only need the answer to "How do I add another build?", it is:

1. Go to the character folder:

   ```text
   src/content/<element>/<rarity>/<character>/
   ```

2. Create another child folder:

   ```text
   break-dps/
   ```

3. Add:

   ```text
   build-notes.json
   light-cones.json
   relic-sets.json
   relic-mainstats.json
   relic-substats.json
   recommended-stats.json
   traces.json
   ```

4. Give it a visible name:

   ```json
   {
     "name": {
       "en": "Break DPS"
     }
   }
   ```

5. Keep `"best": true` only on the build that should open by default.

6. If both builds share an identical JSON file, move that file to the parent character folder and omit it from the build folders that should inherit it.

7. Run:

   ```bash
   npm run validate
   npm run build
   ```

That is all that is required for the site to discover the alternate build.
