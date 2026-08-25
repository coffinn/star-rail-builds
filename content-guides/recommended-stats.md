# Adding Recommended Stats

This guide explains how to add **Recommended Stats** to a character build guide.

Recommended Stats appear in the same recommendation row as:

- Light Cones
- Relics
- Relic Stats
- Recommended Stats

The system supports both **Baseline** and **Recommended** values. Either value can be omitted if a character only needs one meaningful target.

---

## 1. Create `recommended-stats.json`

For a specific build, create:

```text
src/content/<element>/<rarity>/<character>/<build>/recommended-stats.json
```

Example for Silver Wolf's Support build:

```text
src/content/quantum/5/silver-wolf/support/recommended-stats.json
```

---

## 2. Basic Format

Use this structure:

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

Each entry supports:

| Field | Required? | Description |
|---|---|---|
| `name` | Yes | The stat ID to display |
| `baseline` | No | Minimum or baseline target |
| `recommended` | No | Preferred target |

At least one of `baseline` or `recommended` should be present.

---

## 3. Example

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

This would display approximately as:

```text
Recommended Stats

Stat               Baseline     Recommended
SPD                134          160+
Effect Hit Rate    67%          96%+
HP                 3000+        3500+
DEF                —            1000+
```

If a field is omitted, the site displays `—`.

---

## 4. Stat IDs

Recommended Stats use the same translated stat system as the rest of the site.

Common IDs include:

```text
spd
cr
cd
ehr
effect-res
break-effect
energy-regen-rate
outgoing-healing
```

For final character totals, use:

```text
total-hp
total-atk
total-def
```

These should display as:

```text
HP
ATK
DEF
```

Do **not** use the normal Relic flat-stat IDs for final character totals if they are translated as:

```text
hp  -> Flat HP
atk -> Flat ATK
def -> Flat DEF
```

Use `total-hp`, `total-atk`, and `total-def` instead.

---

## 5. Adding a New Stat Name

If a stat ID does not already exist, add it to:

```text
src/i18n/en/stats.json
```

Example:

```json
{
  "total-hp": "HP",
  "total-atk": "ATK",
  "total-def": "DEF"
}
```

Keep existing Relic stat IDs unchanged unless you intentionally want to change their display everywhere.

---

## 6. Baseline Only

A stat does not need a recommended value.

Example:

```json
{
  "name": "spd",
  "baseline": "134"
}
```

This displays:

```text
SPD    134    —
```

---

## 7. Recommended Only

A stat can also have only a recommended target.

Example:

```json
{
  "name": "total-def",
  "recommended": "1000+"
}
```

This displays:

```text
DEF    —    1000+
```

This is useful when there is no meaningful lower threshold.

---

## 8. Number vs String Values

Both numbers and strings are supported.

Valid:

```json
{
  "name": "spd",
  "baseline": 134,
  "recommended": 160
}
```

Also valid:

```json
{
  "name": "spd",
  "baseline": "134+",
  "recommended": "160+"
}
```

Strings are usually more useful because HSR stat targets often need:

```text
+
%
~
ranges
```

Example:

```json
{
  "name": "cr",
  "baseline": "70%",
  "recommended": "80%+"
}
```

---

## 9. Character-Level Defaults

You can also place:

```text
recommended-stats.json
```

directly in the character folder:

```text
src/content/<element>/<rarity>/<character>/recommended-stats.json
```

Example:

```text
src/content/quantum/5/silver-wolf/recommended-stats.json
```

This acts as the character-level default.

A build can then provide its own:

```text
src/content/quantum/5/silver-wolf/support/recommended-stats.json
```

to override the default for that build.

This follows the same build fallback behavior used by the rest of the character build system.

---

## 10. Per-Build Example

A character could have:

```text
silver-wolf/
├── recommended-stats.json
├── support/
│   └── recommended-stats.json
└── break/
    └── recommended-stats.json
```

For example:

### Default

```json
{
  "stats": [
    {
      "name": "spd",
      "baseline": "134"
    }
  ]
}
```

### Support Build

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

### Break Build

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
      "recommended": "200%+"
    }
  ]
}
```

Each build can therefore have completely different stat goals.

---

## 11. Formatting Recommendations

Use display-ready values.

Good:

```json
{
  "name": "spd",
  "recommended": "160+"
}
```

Good:

```json
{
  "name": "cr",
  "baseline": "70%",
  "recommended": "80%+"
}
```

Good:

```json
{
  "name": "total-hp",
  "recommended": "3500–4000"
}
```

Avoid putting long explanations directly into the value field.

Bad:

```json
{
  "name": "spd",
  "recommended": "Try to reach 160 if you have enough speed substats but 134 is okay otherwise"
}
```

Put explanations like that in the character's build notes instead.

---

## 12. Suggested Ordering

A useful order is:

1. Speed
2. Important offensive/utility threshold
3. Crit stats, if relevant
4. Break Effect, Effect Hit Rate, Effect RES, etc.
5. HP / ATK / DEF
6. Other secondary stats

Example:

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
    },
    {
      "name": "total-hp",
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

## 13. Validation

The content validator should check:

- `stats` exists and is an array
- every entry has a `name`
- the stat ID exists
- every entry has at least `baseline` or `recommended`
- values are strings or numbers

After adding or editing Recommended Stats, run:

```bash
npm run build
```

If a stat ID is misspelled, such as:

```json
{
  "name": "speeed",
  "recommended": "160+"
}
```

the validator should report it instead of allowing invalid content into the deployed site.

---

## 14. Full Example

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
    },
    {
      "name": "effect-res",
      "recommended": "30%+"
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

## Quick Reference

File:

```text
recommended-stats.json
```

Build-specific location:

```text
src/content/<element>/<rarity>/<character>/<build>/recommended-stats.json
```

Character-level default location:

```text
src/content/<element>/<rarity>/<character>/recommended-stats.json
```

Minimum valid example:

```json
{
  "stats": [
    {
      "name": "spd",
      "recommended": "160+"
    }
  ]
}
```

Recommended template:

```json
{
  "stats": [
    {
      "name": "spd",
      "baseline": "",
      "recommended": ""
    },
    {
      "name": "ehr",
      "baseline": "",
      "recommended": ""
    }
  ]
}
```

Remove any empty fields before committing the file.
