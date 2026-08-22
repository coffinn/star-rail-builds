# Remembrance Memosprite Abilities

Use the `memosprite` section for Remembrance characters with independently leveled Memosprite Skills and Talents.

Memosprite abilities are separate from the character's normal `abilities` section.

## Structure

```json
"memosprite": {
  "name": "Memosprite Name",
  "initial_spd": 165,
  "hp_source": "100% of max resource",

  "skills": {
    "skill": {
      "type": "Memosprite Skill",
      "name": "Memosprite Skill Name",
      "tag": "AoE",

      "min_level": 1,
      "max_level": 10,
      "default_level": 6,

      "description_template": "Deals {{damage}}% DMG to all enemies.",

      "scaling": {
        "damage": [
          20,
          24,
          28,
          32,
          36,
          40,
          44,
          48,
          52,
          56
        ]
      }
    },

    "talent": {
      "type": "Memosprite Talent",
      "name": "Memosprite Talent Name",
      "tag": "Support",
      "description": "Memosprite Talent description."
    }
  }
}
```

## Rules

- Put all Memosprite abilities under `memosprite.skills`.
- Use `type: "Memosprite Skill"` or `type: "Memosprite Talent"` as appropriate.
- Independently leveled Memosprite abilities keep their own `min_level`, `max_level`, and `default_level`.
- Each scalable Memosprite ability receives its own Trace level slider.
- Non-scaling Memosprite abilities can use a normal `description` instead of `description_template` and `scaling`.

> Do not use `variants` for independently leveled Memosprite abilities. `variants` are only for alternate forms that share another ability's Trace level.
