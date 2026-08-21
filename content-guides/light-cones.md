# light-cones.json

`light-cones.json` defines ranked light cone recommendations for one build.

```txt
src/content/<type>/<rarity>/<character>/<build>/light-cones.json
```

## Expected Shape

```json
{
  "notes": [
    {
      "en": "Light cone rankings assume the listed team."
    }
  ],
  "light_cones": [
    {
      "items": [
        "a-grounded-ascent",
        {
          "name": "past-and-future",
          "superimposition": 5
        }
      ]
    }
  ],
  "conditional": [
    "",
    {
      "name": "dance-dance-dance",
      "note": {
        "en": "Can be used in niche rotations."
      }
    }
  ]
}
```

## Fields

- `light_cones`: Ordered ranking groups.
- `notes`: Optional section-level notes shown under
  `Regarding Light Cone Choices:` without adding a `*` marker to any weapon.
- `light_cones[].items`: Light cones in the same ranking position.
- `items[]`: Light cone i18n IDs or aliases, either as plain strings or as objects.
- `items[].name`: Light cone i18n ID or alias. Required when the item needs an
  object for `superimposition` or `note`.
- `items[].refinement`: Optional refinement rank. Use a number for exact
  refinements, such as `5`, or a string for ranges, such as `"4+"`.
- `items[].note`: Optional localized editorial note. Adds a `*` marker beside
  the light cone and renders in the light cone notes section.
- `conditional`: Optional unranked light cone list shown below the ranking under
  `Conditional (See Notes):`.

## Ranked Light Cones

Each entry in `light-cones` is one ranking position.

Use one item for a normal ranking:

```json
{
    "items": [
        "name": "incessant-rain"
    ]
},
{
    "items": [
        "name": "before-the-tutorial-mission-starts",
        "superimposition": 5
    ]
}
```

This renders as:

```txt
1. Incessant Rain (5 ★) [S1]
2. Before the Tutorial Mission Starts (4 ★) [R5]
```

Use multiple items in the same `items` array when light cones are close enough to
share the same ranking position. The first item keeps the rank number, and later
items render as approximate alternatives with `≈`.

```json
{
  "items": ["incessant-rain", "before-the-tutorial-mission-starts"]
}
```

This renders as:

```txt
1. Incessant Rain (5 ★)
≈ Before the Tutorial Mission Starts (4 ★)
```

## Conditional Light Cones

Use `conditional` for light cones that are only recommended under special conditions
explained in the notes.

Conditional weapons use the same item fields as ranked weapons:

```json
{
  "conditional": [
    {
      "name": "in-pursuit-of-the-wind",
      "note": {
        "en": "Only valuable in Super Break teams."
      }
    }
  ]
}
```

## Notes

- Light cone rarity is pulled from `src/data/light-cones/<light-cone-path>.json`, where
  `<light-cone-path>` comes from the character's `metadata.json` `light-cone` field.
- Light cone aliases from `src/data/translation-aliases.json` can be used in
  `items[]` or `items[].name`, such as `"bttms"` for
  `"before-the-tutorial-mission-starts"`.
- When adding a light cone that is not in the shared light cone data yet, add it to the
  matching file (`abundance.json`, `destruction.json`, `erudition.json`, `elation.json`,
  etc.) instead of adding `rarity` to the build.
- Adding `note` to a light cone automatically adds a `*` marker next to that light cone
  in the light cone ranking list.
- The same `note` also automatically creates a matching note entry under
  `Regarding Light Cone Choices:`.
- `note` must include `en` because it is the fallback if no other translation
  was provided.
- Notes support Markdown, such as `**bold text**` and inline translation tokens,
  such as `[[light-cone:the-light-cone-name]]`.

Example with the same note translated in different languages:

```json
{
  "name": "before-the-tutorial-mission-starts",
  "note": {
    "en": "Useful when the wearer needs extra energy.",
    "fr": "This is the same note in french source: trust me bro."
  }
}
```
