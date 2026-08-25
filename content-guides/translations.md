# Adding Translations

Translations are handled through the dictionaries in:

```text
src/i18n/
```

Each language has its own folder, for example:

```text
src/i18n/en/
src/i18n/fr/
src/i18n/de/
src/i18n/es/
```

## Translating an Existing Language

For a language that already has a folder, translate the **values** in that language's dictionary files while keeping the same IDs/keys as English.

Example:

```json
{
  "silver-wolf": "Silver Wolf"
}
```

French:

```json
{
  "silver-wolf": "Louve d'argent"
}
```

Do **not** translate the ID `silver-wolf`; only translate the displayed value.

Use the matching English file in `src/i18n/en/` as the reference. The current HSR dictionaries include:

```text
abilities.json
characters.json
elements.json
light-cones.json
notes.json
paths.json
relic-sets.json
stats.json
ui.json
```

For example:

```text
src/i18n/en/light-cones.json
```

maps to:

```text
src/i18n/fr/light-cones.json
```

If a translation is missing, the site falls back to English.

## Enabling a Language

Having a translation folder does not automatically make the language selectable.

Languages are registered in:

```text
src/utils/languages.ts
```

The current file only has English enabled; the other existing language entries are commented out.

To enable French, for example:

```ts
export const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
] as const;
```

Only enable a language once its dictionaries are ready enough to use.

## Adding a Completely New Language

For a language that does not already exist:

1. Create a new folder under `src/i18n/`.
2. Copy the dictionary file structure from `src/i18n/en/`.
3. Translate the values while keeping all IDs unchanged.
4. Add the language to `src/utils/languages.ts`.

Example:

```text
src/i18n/ja/
```

Then register it:

```ts
{ code: 'ja', name: '日本語' },
```

## Important Rules

- Keep translation IDs exactly the same across languages.
- Translate values, not keys.
- Use `src/i18n/en/` as the source/reference dictionary.
- Add new English keys first, then translate them into other languages.
- Keep all JSON valid.
- Missing translations fall back to English.
- Remember to enable the language in `src/utils/languages.ts` if it is not already active.

Test locally with:

```bash
npm run dev
```

Before pushing:

```bash
npm run build
```
