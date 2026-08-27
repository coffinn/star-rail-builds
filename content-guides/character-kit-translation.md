# Character Kit Translation Quick Reference

Character-specific kit translations go in:

```text
src/i18n/<language>/character-kits/<unit>.json
```

Example:

```text
src/i18n/ru/character-kits/silver-wolf.json
```

These files should contain **translated text only**.
All gameplay numbers, scaling arrays, IDs, levels, Energy values, Break values, etc. stay in:

```text
src/data/characters/<unit>.json
```

---

## Golden Rule

### ✅ Translate these

* Ability names
* Ability descriptions
* Ability tags
* Variant names
* Variant selector labels
* Memosprite names/text
* Elation ability text
* Global Passive names/tags/descriptions
* Major Trace names/descriptions
* Stat Bonus names
* Eidolon names/descriptions

### ❌ Do NOT change these

* Ability IDs
* Object keys
* Variant order
* Eidolon numbers
* Major Trace numbers
* Scaling placeholder names
* Scaling arrays
* Damage values
* Energy values
* Break values
* Trace level ranges
* Character IDs

---

# Placeholders

Placeholders inside descriptions **must remain exactly the same**.

English/source:

```json
"description_template": "Deals Quantum DMG equal to {{damage}}% of Silver Wolf's ATK."
```

Translated:

```json
"description_template": "Наносит квантовый урон, равный {{damage}}% от силы атаки Серебряного Волка."
```

### ✅ Correct

```text
{{damage}}
{{weakness_chance}}
{{def_down}}
{{all_res_down}}
```

### ❌ Wrong

Do not translate:

```text
{{damage}}
```

into something like:

```text
{{урон}}
```

The website uses the placeholder ID to insert the correct scaling value.

---

# Abilities

Example:

```json
{
  "abilities": {
    "basic": {
      "name": "Translated Basic ATK Name",
      "tag": "Translated Tag",
      "description_template": "Translated description using {{damage}}%."
    },

    "skill": {
      "name": "Translated Skill Name",
      "tag": "Translated Tag",
      "description_template": "Translated description using {{chance}}%."
    },

    "ultimate": {
      "name": "Translated Ultimate Name",
      "tag": "Translated Tag",
      "description_template": "Translated Ultimate description."
    },

    "talent": {
      "name": "Translated Talent Name",
      "tag": "Translated Tag",
      "description_template": "Translated Talent description."
    },

    "technique": {
      "name": "Translated Technique Name",
      "tag": "Translated Tag",
      "description": "Translated Technique description."
    }
  }
}
```

Keep these IDs unchanged:

```text
basic
skill
ultimate
talent
technique
```

You normally **do not need to translate `type` here** if the UI is using the shared:

```text
src/i18n/<language>/abilities.json
```

for Basic ATK / Skill / Ultimate / Talent / Technique.

---

# Alternate Ability Variants

If an ability has variants:

```json
{
  "abilities": {
    "skill": {
      "name": "Translated Skill Name",

      "variant_selector": {
        "label": "Translated Selector Label"
      },

      "variants": [
        {
          "selector_label": "Translated Option 1",
          "type": "Translated Variant Type",
          "name": "Translated Variant Name",
          "tag": "Translated Tag",
          "description_template": "Translated text with {{damage}}%."
        },

        {
          "selector_label": "Translated Option 2",
          "type": "Translated Variant Type",
          "name": "Translated Variant Name",
          "tag": "Translated Tag",
          "description_template": "Translated text with {{damage}}%."
        }
      ]
    }
  }
}
```

## Important

The `variants` array must stay in the **same order** as the original character JSON.

If the English character data has:

```text
Variant 1 = Normal
Variant 2 = Enhanced
```

the translation file must keep:

```text
Translation entry 1 = Normal
Translation entry 2 = Enhanced
```

Do not reorder them.

---

# Major Traces

Translate the name and description.

Keep the Ascension IDs unchanged:

```json
{
  "major_traces": {
    "2": {
      "name": "Translated A2 Name",
      "description": "Translated A2 description."
    },

    "4": {
      "name": "Translated A4 Name",
      "description": "Translated A4 description."
    },

    "6": {
      "name": "Translated A6 Name",
      "description": "Translated A6 description."
    }
  }
}
```

Do not change:

```text
"2"
"4"
"6"
```

---

# Eidolons

Use the Eidolon number as the ID:

```json
{
  "eidolons": {
    "1": {
      "name": "Translated E1 Name",
      "description": "Translated E1 description."
    },

    "2": {
      "name": "Translated E2 Name",
      "description": "Translated E2 description."
    },

    "3": {
      "name": "Translated E3 Name",
      "description": "Translated E3 description."
    },

    "4": {
      "name": "Translated E4 Name",
      "description": "Translated E4 description."
    },

    "5": {
      "name": "Translated E5 Name",
      "description": "Translated E5 description."
    },

    "6": {
      "name": "Translated E6 Name",
      "description": "Translated E6 description."
    }
  }
}
```

Do not change the keys:

```text
1–6
```

---

# Stat Bonuses

Translate only the displayed stat name.

Example:

```json
{
  "stat_bonuses": [
    {
      "stat": "Translated Stat 1"
    },
    {
      "stat": "Translated Stat 2"
    },
    {
      "stat": "Translated Stat 3"
    }
  ]
}
```

## Important

Keep the entries in the **same order** as:

```text
src/data/characters/<unit>.json
```

The translation is matched by array position.

Do not copy the stat values into the translation file.

---

# Global Passives

Keep the Global Passive ID unchanged.

Example:

```json
{
  "global_passives": {
    "example-passive-id": {
      "name": "Translated Passive Name",
      "tag": "Translated Tag",
      "description": "Translated passive description."
    }
  }
}
```

If the source contains:

```json
"global_passives": {
  "system-warning": {
```

the translation must also use:

```json
"system-warning": {
```

Do not translate the ID itself.

---

# Memosprites

For Remembrance characters:

```json
{
  "memosprite": {
    "name": "Translated Memosprite Name",

    "skills": {
      "skill": {
        "name": "Translated Skill Name",
        "tag": "Translated Tag",
        "description_template": "Translated description with {{damage}}%."
      },

      "talent": {
        "name": "Translated Talent Name",
        "tag": "Translated Tag",
        "description_template": "Translated description."
      }
    }
  }
}
```

Keep skill IDs exactly the same as the original character JSON.

---

# Elation Skills

Example:

```json
{
  "elation": {
    "skills": {
      "skill": {
        "name": "Translated Elation Skill",
        "tag": "Translated Tag",
        "description_template": "Translated description with {{damage}}%."
      }
    }
  }
}
```

Again, keep the original skill IDs unchanged.

---

# What Should NOT Be Copied Into Translation Files

Do not copy fields like:

```json
"min_level": 1,
"max_level": 12,
"default_level": 10,
"energy_gain": 30,
"energy_cost": 110,
"break": 20,
"break_main": 20,
"break_adjacent": 10,
"scaling": {
  "damage": [
    50,
    55,
    60
  ]
}
```

Those stay in:

```text
src/data/characters/<unit>.json
```

The translation overlay automatically keeps them.

---

# Full Translation Skeleton

```json
{
  "abilities": {
    "basic": {
      "name": "",
      "tag": "",
      "description_template": ""
    },

    "skill": {
      "name": "",
      "tag": "",
      "description_template": ""
    },

    "ultimate": {
      "name": "",
      "tag": "",
      "description_template": ""
    },

    "talent": {
      "name": "",
      "tag": "",
      "description_template": ""
    },

    "technique": {
      "name": "",
      "tag": "",
      "description": ""
    }
  },

  "global_passives": {},

  "major_traces": {
    "2": {
      "name": "",
      "description": ""
    },

    "4": {
      "name": "",
      "description": ""
    },

    "6": {
      "name": "",
      "description": ""
    }
  },

  "stat_bonuses": [
    {
      "stat": ""
    },
    {
      "stat": ""
    },
    {
      "stat": ""
    }
  ],

  "eidolons": {
    "1": {
      "name": "",
      "description": ""
    },

    "2": {
      "name": "",
      "description": ""
    },

    "3": {
      "name": "",
      "description": ""
    },

    "4": {
      "name": "",
      "description": ""
    },

    "5": {
      "name": "",
      "description": ""
    },

    "6": {
      "name": "",
      "description": ""
    }
  }
}
```

Only include sections that actually exist for that character.

---

# Quick Checklist

Before committing a character-kit translation:

* [ ] File is inside `src/i18n/<language>/character-kits/`.
* [ ] Filename exactly matches the character ID.
* [ ] Ability IDs are unchanged.
* [ ] Major Trace IDs are unchanged.
* [ ] Eidolon IDs are unchanged.
* [ ] Global Passive IDs are unchanged.
* [ ] Memosprite/Elation skill IDs are unchanged.
* [ ] Variant order matches the original file.
* [ ] Stat Bonus order matches the original file.
* [ ] All `{{placeholders}}` are unchanged.
* [ ] No scaling arrays were copied.
* [ ] No gameplay numbers were manually translated.
* [ ] No Energy/Break/level fields were copied.
* [ ] Only user-visible text was translated.
* [ ] JSON syntax is valid.
* [ ] `npm run build` passes.

## Simplest rule to remember

**Translate what the player reads.**

**Do not translate what the code uses.**
