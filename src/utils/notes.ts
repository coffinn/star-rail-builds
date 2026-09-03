import { marked } from 'marked';
import { getLocalizedNote } from './content';

/**
 * Converts localized note text into inline HTML.
 *
 * Paragraph wrappers are stripped because notes are inserted into existing
 * list/card text rather than standalone article blocks.
 *
 * @param note Raw localized note text.
 * @param sourceFile Source content file used for inline translation warnings.
 * @param translator Translation helper for inline tokens.
 * @returns Rendered HTML string.
 */
function renderNote(note: string, sourceFile: string, translator: any) {
    const renderedNote = translator.translateNoteText(note, sourceFile, {
        lightConePopovers: true,
        relicPopovers: true,
        rotationPopovers: true,
    });

    return (marked.parse(renderedNote) as string).replace(/<\/?p>/g, '');
}
export type NoteGroupRegistry = Map<
    string,
    {
        id: string;
        emitted: boolean;
        items: any[];
        names: string[];
        noteRef?: {
            id: string;
            name: string;
            note: string;
        };
    }
>;
function renderNoteName(
    name: string,
    sourceFile: string,
    translator: any,
) {
    return translator.translateNoteText(
        name,
        sourceFile,
        {
            lightConePopovers: true,
            relicPopovers: true,
        },
    );
}
/**
 * Picks a short, stable note ID prefix from a content file name.
 *
 * @param sourceFile Content file path.
 * @returns Prefix used in note anchors.
 */
function getNotePrefix(sourceFile: string) {
    /* HSR build files */
    if (sourceFile.endsWith('light-cones.json')) return 'lc';
    if (sourceFile.endsWith('relic-sets.json')) return 'rs';
    if (sourceFile.endsWith('relic-mainstats.json')) return 'rm';
    if (sourceFile.endsWith('relic-substats.json')) return 'rsub';
    if (sourceFile.endsWith('recommended-stats.json')) return 'rec';
    if (sourceFile.endsWith('traces.json')) return 'tr';

    /* Legacy Genshin names, kept for compatibility */
    if (sourceFile.endsWith('weapons.json')) return 'w';
    if (sourceFile.endsWith('artifacts-sets.json')) return 'as';
    if (sourceFile.endsWith('artifacts-mainstats.json')) return 'am';
    if (sourceFile.endsWith('artifacts-substats.json')) return 'at';
    if (sourceFile.endsWith('talents.json')) return 't';

    return 'n';
}

/**
 * Extracts the build folder name from a content file path.
 *
 * Note IDs must be unique across all build cards on the same page, not just
 * inside one JSON file type.
 *
 * @param sourceFile Content file path.
 * @returns Sanitized build slug, or `shared` when none can be inferred.
 */
function getNoteScope(sourceFile: string) {
    const parts = sourceFile.replace(/\\/g, '/').split('/');
    const fileName = parts[parts.length - 1];
    const scope = parts[parts.length - 2];

    if (!fileName || !scope || scope === 'content') {
        return 'shared';
    }

    return scope.replace(/[^a-z0-9_-]/gi, '-').toLowerCase();
}

/**
 * Creates a unique note anchor ID inside one note section.
 *
 * @param sourceFile Content file path.
 * @param index Zero-based note index.
 * @returns Anchor ID.
 */
function createNoteId(sourceFile: string, index: number) {
    return `${getNotePrefix(sourceFile)}-${getNoteScope(sourceFile)}-${index + 1}`;
}
function createGroupedNoteId(
    sourceFile: string,
    groupKey: string,
) {
    const safeGroup = groupKey
        .replace(/[^a-z0-9_-]/gi, '-')
        .toLowerCase();

    return `ng-${getNoteScope(sourceFile)}-${safeGroup}`;
}
function handleSharedNoteGroup(
    item: any,
    formatter: (item: any) => string,
    sourceFile: string,
    lang: string,
    translator: any,
    notes: {
        id: string;
        name: string;
        note: string;
    }[],
    sharedGroups?: NoteGroupRegistry,
) {
    if (!item.note_group || !sharedGroups) {
        return false;
    }

    const groupKey = item.note_group;

    let group = sharedGroups.get(groupKey);

    if (!group) {
        group = {
            id: createGroupedNoteId(
                sourceFile,
                groupKey,
            ),
            emitted: false,
            items: [],
            names: [],
        };

        sharedGroups.set(groupKey, group);
    }

    /*
     * Remember this item.
     */
    group.items.push(item);

    /*
     * Render and remember this item's display name.
     */
    const renderedName = renderNoteName(
        formatter(item),
        sourceFile,
        translator,
    );

    if (!group.names.includes(renderedName)) {
        group.names.push(renderedName);
    }

    /*
     * If the note already exists, update its title
     * whenever another member of the group appears.
     */
    if (group.noteRef) {
        group.noteRef.name =
            group.names.join(' / ');
    }

    const localizedNote =
        getLocalizedNote(item, lang);

    /*
     * If this is the first occurrence that actually
     * contains note text, create the single note.
     */
    if (
        localizedNote &&
        !group.emitted
    ) {
        /*
         * Give every item encountered so far
         * the same note ID.
         */
        group.items.forEach((groupItem) => {
            groupItem.noteId = group!.id;
        });

        const noteEntry = {
            id: group.id,

            name: group.names.join(' / '),

            note: renderNote(
                localizedNote,
                sourceFile,
                translator,
            ),
        };

        notes.push(noteEntry);

        /*
         * Keep a reference so later JSON files
         * can update this note's title.
         */
        group.noteRef = noteEntry;
        group.emitted = true;
    }

    /*
     * Items encountered after the note has already
     * been created also point to the same note.
     */
    if (group.emitted) {
        item.noteId = group.id;
    }

    return true;
}
/**
 * Collects top-level section notes from a content JSON object.
 *
 * @param data Parsed content JSON.
 * @param sourceFile Source file path for note IDs and warnings.
 * @param lang Requested language code.
 * @param translator Translation helper for inline tokens.
 * @returns Rendered note HTML strings.
 */
export function collectSectionNotes(
    data: any,
    sourceFile: string,
    lang: string,
    translator: any,
) {
    if (!Array.isArray(data?.notes)) return [];

    // Section notes do not attach to an individual item, so no noteId is needed.
    return data.notes
        .map((note: any) => getLocalizedNote({ note }, lang))
        .filter(Boolean)
        .map((note: string) => renderNote(note, sourceFile, translator));
}

/**
 * Collects item-level notes and attaches note IDs back onto source items.
 *
 * @param groups Ranked groups containing `items` arrays.
 * @param formatter Converts an item into the label shown in Notes.
 * @param sourceFile Source file path for note IDs and warnings.
 * @param lang Requested language code.
 * @param translator Translation helper for inline tokens.
 * @returns Notes ready for rendering in the Notes component.
 */
export function collectNotes(
    groups: any[],
    formatter: (item: any) => string,
    sourceFile: string,
    lang: string,
    translator: any,
    sharedGroups?: NoteGroupRegistry,
) {
    const notes: {
        id: string;
        name: string;
        note: string;
    }[] = [];

    const groupedNotes = new Map<
        string,
        {
            items: any[];
            names: string[];
            note?: string;
        }
    >();

    const allItems = groups.flatMap((group) => [
        ...(group.items ?? []),
        ...(group.choices ?? []).flatMap(
            (choice: any) => choice.items ?? [],
        ),
    ]);

    /*
     * First collect explicitly grouped notes.
     */
    allItems.forEach((item: any) => {
        /*
     * If a shared registry was provided, let it handle
     * note_group across different JSON files.
     */
        if (
            handleSharedNoteGroup(
                item,
                formatter,
                sourceFile,
                lang,
                translator,
                notes,
                sharedGroups,
            )
        ) {
            return;
        }

        /*
         * Otherwise fall back to the existing
         * same-file note_group behavior.
         */
        if (!item.note_group) return;

        const groupId = item.note_group;

        if (!groupedNotes.has(groupId)) {
            groupedNotes.set(groupId, {
                items: [],
                names: [],
            });
        }

        const group = groupedNotes.get(groupId)!;

        group.items.push(item);
        group.names.push(formatter(item));

        const localizedNote =
            getLocalizedNote(item, lang);

        /*
         * Only one item in the group needs to
         * actually contain the note text.
         */
        if (localizedNote && !group.note) {
            group.note = localizedNote;
        }
    });

    /*
     * Turn each note_group into one note.
     */
    groupedNotes.forEach((group) => {
        if (!group.note) return;

        const noteId = createNoteId(
            sourceFile,
            notes.length,
        );

        /*
         * Every item points to the same anchor.
         */
        group.items.forEach((item) => {
            item.noteId = noteId;
        });

        notes.push({
            id: noteId,
            name: renderNoteName(
                group.names.join(' / '),
                sourceFile,
                translator,
            ),
            note: renderNote(
                group.note,
                sourceFile,
                translator,
            ),
        });
    });

    /*
     * Existing behavior for ordinary,
     * non-grouped notes.
     */
    allItems.forEach((item: any) => {
        if (item.note_group) return;

        const localizedNote =
            getLocalizedNote(item, lang);

        if (!localizedNote) return;

        const name = formatter(item);
        const noteId = createNoteId(
            sourceFile,
            notes.length,
        );

        item.noteId = noteId;

        notes.push({
            id: noteId,
            name: renderNoteName(
                name,
                sourceFile,
                translator,
            ),
            note: renderNote(
                localizedNote,
                sourceFile,
                translator,
            ),
        });
    });

    return notes;
}

/**
 * Collects notes from stat rows, including grouped same-rank stat options.
 *
 * @param items Stat items or grouped stat alternatives.
 * @param formatter Converts an item into the label shown in Notes.
 * @param sourceFile Source file path for note IDs and warnings.
 * @param lang Requested language code.
 * @param translator Translation helper for inline tokens.
 * @returns Notes ready for rendering in the Notes component.
 */
export function collectStatNotes(
    items: any[],
    formatter: (item: any) => string,
    sourceFile: string,
    lang: string,
    translator: any,
    sharedGroups?: NoteGroupRegistry,
) {
    const notes: {
        id: string;
        name: string;
        note: string;
    }[] = [];

    const flatItems = items.flatMap(
        (item) => item.items ?? [item],
    );

    const groupedNotes = new Map<
        string,
        {
            items: any[];
            names: string[];
            note?: string;
        }
    >();

    /*
     * First collect note_group entries.
     */
    flatItems.forEach((item: any) => {
        /*
         * Cross-JSON grouping.
         */
        if (
            handleSharedNoteGroup(
                item,
                formatter,
                sourceFile,
                lang,
                translator,
                notes,
                sharedGroups,
            )
        ) {
            return;
        }

        /*
         * Same-file grouping fallback.
         */
        if (!item.note_group) {
            return;
        }

        const groupId = item.note_group;

        if (!groupedNotes.has(groupId)) {
            groupedNotes.set(groupId, {
                items: [],
                names: [],
            });
        }

        const group = groupedNotes.get(groupId)!;

        group.items.push(item);

        const name = formatter(item);

        if (!group.names.includes(name)) {
            group.names.push(name);
        }

        const localizedNote =
            getLocalizedNote(item, lang);

        if (localizedNote && !group.note) {
            group.note = localizedNote;
        }
    });

    /*
     * Create one bottom note for each
     * same-file note group.
     */
    groupedNotes.forEach((group) => {
        if (!group.note) {
            return;
        }

        const noteId = createNoteId(
            sourceFile,
            notes.length,
        );

        group.items.forEach((item) => {
            item.noteId = noteId;
        });

        notes.push({
            id: noteId,

            name: renderNoteName(
                group.names.join(' / '),
                sourceFile,
                translator,
            ),

            note: renderNote(
                group.note,
                sourceFile,
                translator,
            ),
        });
    });

    /*
     * Normal ungrouped notes.
     */
    flatItems.forEach((item: any) => {
        if (item.note_group) {
            return;
        }

        const localizedNote =
            getLocalizedNote(item, lang);

        if (!localizedNote) {
            return;
        }

        const name = formatter(item);

        const noteId = createNoteId(
            sourceFile,
            notes.length,
        );

        item.noteId = noteId;

        notes.push({
            id: noteId,

            name: renderNoteName(
                name,
                sourceFile,
                translator,
            ),

            note: renderNote(
                localizedNote,
                sourceFile,
                translator,
            ),
        });
    });

    return notes;
}