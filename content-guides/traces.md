# talents.json

`talents.json` defines talent priority groups for one build.

```txt
src/content/<type>/<rarity>/<character>/<build>/traces.json
```

## Expected Shape

```json
{
  "notes": [
    {
      "en": "Talent priority assumes this build's main rotation."
    }
  ],
  "talents": [
    {
        "items": [
            {
                "name": "ba"
            }
        ]
    },
    {
      "approx": true,
      "items": [
        {
          "name": "skill"
        },
        {
          "name": "ultimate"
        },
        {
          "name": "talent"
        }
      ]
    }
  ]
}
```

## Fields

- `traces`: Ordered priority groups.
- `notes`: Optional section-level notes shown under
  `Regarding Talents Choices:` without adding a `*` marker to any trace.
- `traces[].items`: Traces in the same priority position. Multiple items
  render on one line with `=`.
- `traces[].approx`: Optional boolean. Use `true` when multiple traces are
  close alternatives instead of exactly equal. Later items render below the
  numbered line with `≈`.
- `traces[].name`: Trace ID from `src/i18n/<lang>/traces.json`.
  Current IDs are `ba`, `skill`, `ultimate`, and `talent`.
- `items[].note`: Optional localized editorial note. Adds a `*` marker beside
  the trace and renders in the trace notes section.

## Notes

- Use trace IDs instead of display names when possible.
- Existing display strings such as `"Basic ATK"` still work, but they are
  not translated.
- Adding `note` to a talent automatically adds a `*` marker next to that trace
  in the trace priority list.
- The same `note` also automatically creates a matching note entry under
  `Regarding Trace Choices:`.
- Notes support Markdown and inline translation tokens such as
  `[[ability:skill]]`.

## Equal Priority

Use multiple items in the same priority group when talents should be leveled
equally:

```json
{
  "talents": [
    {
      "items": [
        {
          "name": "ultimate"
        },
        {
          "name": "skill",
          "note": {
            "en": "Prioritize [[ability:skill]] first if this character is mainly used for shielding.",
            "fr": "Priorisez le [[ability:skill]] si ce personnage est surtout utilise pour son bouclier."
          }
        }
      ]
    }
  ]
}
```

This renders as:

```txt
1. Burst = Skill*
```

## Approximate Priority

Use `approx: true` when later talents should render as approximate alternatives:

```json
{
  "talents": [
    {
      "approx": true,
      "items": [
        {
          "name": "skill"
        },
        {
          "name": "ba"
        }
      ]
    }
  ]
}
```

This renders as:

```txt
1. Skill
≈ Basic ATK
```

## Translated Note Example

```json
{
  "name": "skill",
  "note": {
    "en": "Level [[ability:skill]] first if most of the build's damage comes from it.",
    "fr": "Montez l'[[ability:skill]] en premier si la majorite des degats du build viennent de lui."
  }
}
```
