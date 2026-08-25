# Toughness Damage (`break`) Fields

Use the `break` fields in character ability JSON to describe how much Toughness damage an ability deals.

The field you use depends on the attack pattern.

## Single Target or One Shared Value

Use:

```json
"break": 10
```

Use `break` when the ability has one Toughness damage value, such as:

- Single Target attacks
- Bounce hits where each hit uses the same Toughness value
- Other attacks that do not need separate target values

## Blast Attacks

Use separate values for the main and adjacent targets:

```json
"break_main": 20,
"break_adjacent": 10
```

Use this when the primary target and adjacent targets take different Toughness damage.

## AoE Attacks

Use:

```json
"break_aoe": 10
```

Use `break_aoe` when the ability deals the same Toughness damage to all enemies.

## Bounce Attacks

Use:
```json
"break_bounce": 5

Use `break_bounce`: Toughness damage dealt by each individual hit of a Bounce attack.

## Quick Reference

```text
break
→ one Toughness value / Single Target / Bounce per hit

break_main
→ primary target of a Blast attack

break_adjacent
→ adjacent targets of a Blast attack

break_aoe
→ all enemies in an AoE attack
```

## Example

```json
"skill": {
  "type": "Skill",
  "name": "Example Blast Skill",
  "tag": "Blast",

  "break_main": 20,
  "break_adjacent": 10,

  "description_template": "Deals {{main_damage}}% DMG to one enemy and {{adjacent_damage}}% DMG to adjacent enemies.",

  "scaling": {
    "main_damage": [
      100,
      110,
      120
    ],
    "adjacent_damage": [
      50,
      55,
      60
    ]
  }
}
```
