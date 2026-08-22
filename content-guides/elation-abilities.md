# Elation Abilities

Use the `elation` section for Elation-specific abilities that have their own independent Trace levels.

These abilities are **not** `variants`, because they do not share the level slider of a normal Skill, Talent, or other ability.

## Structure

```json
"elation": {
  "skills": {
    "skill": {
      "type": "Elation Skill",
      "name": "Elation Skill Name",
      "tag": "Bounce",

      "min_level": 1,
      "max_level": 12,
      "default_level": 10,

      "description_template": "Deals {{damage}}% Elation DMG.",

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
  }
}
```

## Rules

- Put independently leveled Elation abilities under `elation.skills`.
- Keep `min_level`, `max_level`, and `default_level` on each Elation ability.
- Each Elation ability receives its own Trace level slider.
- Multiple Elation abilities can be added by giving each one a unique key.

Example:

```json
"elation": {
  "skills": {
    "skill": {
      ...
    },
    "skill-2": {
      ...
    }
  }
}
```

> Use `variants` instead only when an alternate ability shares the Trace level of a normal parent ability.
