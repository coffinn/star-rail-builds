# build-notes.json

`build-notes.json` defines the translated build title, the optional "best build"
badge, build-level editorial notes, and optional calculation credits.

```txt
src/content/<type>/<rarity>/<character>/<build>/build-notes.json
```

## Expected Shape

```json
{
  "best": true,
  "name": {
    "en": "[[element:lighting]] DPS",
    "fr": "DPS [[element:lightning]]"
  },
  "relic": {
    "link": "https://example.com/relic-calculation",
    "author": "AuthorName"
  },
  "light_cones": [
    {
      "link": "https://example.com/light-cone-calculation-a",
      "author": "AuthorName",
      "detail": "single target"
    },
    {
      "link": "https://example.com/light-cone-calculation-b",
      "author": "OtherAuthor"
    }
  ],
  "talent": {
    "link": "https://example.com/trace-calculation",
    "author": "AuthorName"
  },
  "global": {
    "link": "https://example.com/all-calculations",
    "author": "AuthorName"
  },
  "notes": [
    {
      "en": "Use **Markdown** and [[character:bennett]] here.",
      "fr": "Utilisez **Markdown** et [[character:bennett]] ici."
    }
  ]
}
```

## Fields

- `name`: Optional localized build title object.
  - `en` is the fallback title.
  - Other language keys are optional.
  - Supports inline translation tokens.
  - If `name` is missing, the site falls back to the build folder name.
- `best`: Optional boolean. Use `true` for the role/build the character best
  excels at. This shows a badge on the closed build card header.
- `relic` or `relics`: Optional detailed artifact calculation credit.
- `light_cones`: Optional detailed weapon calculation credit.
- `trace` or `traces`: Optional detailed talent calculation credit.
- `global`: Optional detailed calculation credit for the whole build.
- `notes`: Array of localized editorial note objects.
  - Each note item must include `en`. The requested language falls back to `en`.
  - Supports Markdown and inline translation tokens.
  - These notes appear directly under the main `Notes` title, before the
    Light Cone, Relics, and Traces note sections.
  - Build-level notes do not add a `*` marker because they are not attached to
    one specific item.

## Detailed Calculation Credits

Use these optional objects to show detailed calculation links at the top of the
Notes card. Each category can be either one credit object or an array of credit
objects.

```json
{
  "relics": {
    "link": "https://example.com/relic-calculation",
    "author": "AuthorName",
    "detail": "4pc comparison"
  },
  "light_cone": [
    {
      "link": "https://example.com/light-cone-calculation-a",
      "author": "AuthorName",
      "detail": "single target"
    },
    {
      "link": "https://example.com/light-cone-calculation-b",
      "author": "OtherAuthor"
    }
  ],
  "trace": {
    "link": "https://example.com/trace-calculation",
    "author": "AuthorName"
  },
  "global": {
    "link": "https://example.com/all-calculations",
    "author": "AuthorName"
  }
}
```

Each object has:

- `link`: URL opened by the detailed calculation link.
- `author`: Name shown after "Thank you to".
- `detail`: Optional text shown in parentheses after the detailed calculation
  link text. Supports inline translation tokens.

For example, this:

```json
{
  "light_cone": {
    "link": "https://example.com/light-cone-calculation",
    "author": "AuthorName",
    "detail": "single target"
  }
}
```

renders as:

```txt
Detailed light cone calculations (single target) - Thank you to AuthorName!
```

The current keys are intentionally:

- `relic` or `relics`: Shows `Detailed relic calculations`
- `light_cone`: Shows `Detailed light_cone calculations`
- `trace` or `traces`: Shows `Detailed trace calculations`
- `global`: Shows `Detailed calculations`

## Build-Level Notes

Use this shape for regular build notes:

```json
{
  "notes": [
    {
      "en": "Required English fallback.",
      "fr": "Optional French translation."
    }
  ]
}
```

Example with Markdown, inline translation tokens, and multiple languages:

```json
{
  "notes": [
    {
      "en": "[[character:kafka]] needs enough [[stat:spd]] to act twice in the first cycle.",
      "fr": "[[character:xingqiu]] a besoin d'assez de [[stat:er]] pour utiliser son dechainement a chaque rotation.",
      "es": "[[character:xingqiu]] necesita suficiente [[stat:er]] para usar su definitiva en cada rotacion."
    }
  ]
}
```

`en` is required. Other language keys are optional. If a translation is missing,
the site uses the English version.

## Where It Renders

Build-level notes render at the top of the Notes card, before these automatic
section note areas:

- `Regarding Light Cone Choices:`
- `Regarding Relic Choices:`
- `Regarding Trace Choices:`

Use `build-notes.json` for comments about the whole build. Use item `note`
fields in `light-cones.json`, `relic-sets.json`, `relic-mainstats.json`,
`relic-substats.json`, or `traces.json` when the note belongs to one
specific listed item and should add a `*` marker.
