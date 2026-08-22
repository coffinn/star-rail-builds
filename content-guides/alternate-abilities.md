# Adding Alternate / Enhanced Abilities

Use this structure for Enhanced Skills, Enhanced Basic ATKs, Joint Attacks, transformation abilities, alternate Talent effects, or any other alternate version of a character ability.

> **Core rule:** Alternate abilities go inside the parent ability's `variants` array. They share the parent ability's Trace level slider and do not need their own `min_level`, `max_level`, or `default_level`.

## Basic Structure

Add a `variants` array inside the parent ability.

For example, an Enhanced Skill belongs inside `skill`:

```json
"skill": {
  "type": "Skill",
  "name": "Normal Skill",
  "tag": "Single Target",

  "min_level": 1,
  "max_level": 12,
  "default_level": 10,

  "description_template": "Deals {{damage}}% ATK as DMG.",

  "scaling": {
    "damage": [
      100,
      110,
      120,
      130,
      140,
      150,
      160,
      170,
      180,
      190,
      200,
      210
    ]
  },

  "variants": [
    {
      "type": "Skill (Enhanced)",
      "name": "Enhanced Skill Name",
      "tag": "Bounce",

      "description_template": "Deals {{damage}}% ATK as enhanced DMG.",

      "scaling": {
        "damage": [
          50,
          55,
          60,
          65,
          70,
          75,
          80,
          85,
          90,
          95,
          100,
          105
        ]
      }
    }
  ]
}
```

## Important Rules

- Do **not** create separate top-level keys such as `skill_enhanced` or `talent_joint`. They will not be displayed.
- Variants inherit the parent Trace levels, so omit `min_level`, `max_level`, and `default_level` from the variant.
- A variant can have its own `type`, `name`, `tag`, `energy_gain`, `energy_cost`, `break`, description, and scaling.
- Each scaling array should contain one value for every level supported by the parent Trace.
- Moving the parent Trace slider updates the normal ability and all of its variants together.

For example:

```text
Skill Lv. 10
├─ Normal Skill uses level 10 scaling
└─ Enhanced Skill uses level 10 scaling
```

## Multiple Alternate Abilities

A single parent ability can contain more than one variant.

This is useful for characters with multiple enhanced skills or alternate forms.

```json
"variants": [
  {
    "type": "Skill (Enhanced)",
    "name": "Enhanced Skill A",

    "description_template": "Deals {{damage}}% DMG.",

    "scaling": {
      "damage": [
        100,
        110,
        120,
        130,
        140,
        150,
        160,
        170,
        180,
        190,
        200,
        210
      ]
    }
  },
  {
    "type": "Skill (Enhanced)",
    "name": "Enhanced Skill B",

    "description_template": "Deals {{damage}}% DMG.",

    "scaling": {
      "damage": [
        80,
        88,
        96,
        104,
        112,
        120,
        128,
        136,
        144,
        152,
        160,
        168
      ]
    }
  }
]
```

## Where Variants Can Be Used

Variants can be added under any supported parent ability:

```json
"basic": {
  "variants": []
}

"skill": {
  "variants": []
}

"talent": {
  "variants": []
}

"ultimate": {
  "variants": []
}
```

Common `type` labels include:

- `Enhanced Skill`
- `Enhanced Basic ATK`
- `Joint Talent`
- `Alternate Skill`
- `Transformation Skill`

## Example: Enhanced Skill

```json
"skill": {
  "type": "Skill",
  "name": "Jeweled Sword Zelretch",

  "min_level": 1,
  "max_level": 12,
  "default_level": 10,

  "description_template": "Deals {{damage}}% ATK as DMG.",

  "scaling": {
    "damage": [
      100,
      108,
      116,
      124,
      132,
      140,
      150,
      160,
      170,
      180,
      188,
      196
    ]
  },

  "variants": [
    {
      "type": "Skill (Enhanced)",
      "name": "Second Magic Experiment",
      "tag": "Bounce",

      "description_template": "Deals {{damage}}% ATK as enhanced DMG.",

      "scaling": {
        "damage": [
          50,
          54,
          58,
          62,
          66,
          70,
          75,
          80,
          85,
          90,
          94,
          98
        ]
      }
    }
  ]
}
```

## Example: Joint Talent

A Joint Attack tied to a character's Talent should be placed inside the Talent's `variants` array:

```json
"talent": {
  "type": "Talent",
  "name": "Normal Talent",

  "min_level": 1,
  "max_level": 12,
  "default_level": 10,

  "description_template": "Normal Talent description with {{value}}% scaling.",

  "scaling": {
    "value": [
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      20,
      21,
      22
    ]
  },

  "variants": [
    {
      "type": "Joint Talent",
      "name": "Joint Attack Name",
      "tag": "AoE",

      "description_template": "Deals {{damage}}% DMG.",

      "scaling": {
        "damage": [
          150,
          165,
          180,
          195,
          210,
          225,
          243.75,
          262.5,
          281.25,
          300,
          315,
          330
        ]
      }
    }
  ]
}
```

## When Not to Use `variants`

Use `variants` when the alternate ability is another form of an existing Trace and should use the same Trace level slider.

Do **not** use `variants` if the ability:

- has its own independent Trace level,
- has its own separate leveling range,
- should have its own independent slider,
- or is not logically tied to an existing parent ability.

In those cases, it should remain a separate top-level ability and the frontend may need to be updated to support it.
