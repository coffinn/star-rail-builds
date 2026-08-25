const HIGHLIGHT_CLASS = 'note-highlight-active';
const HIGHLIGHT_DURATION = 1800;

document.addEventListener('click', (event) => {
    const clicked = event.target;

    if (!(clicked instanceof Element)) {
        return;
    }

    const link =
        clicked.closest<HTMLAnchorElement>('.note-link');

    if (!link) {
        return;
    }

    const href = link.getAttribute('href');

    if (!href?.startsWith('#')) {
        return;
    }

    const noteId = decodeURIComponent(
        href.slice(1),
    );

    const target =
        document.getElementById(noteId);

    if (!target) {
        return;
    }

    event.preventDefault();

    // Keep the note ID in the URL.
    const url = new URL(window.location.href);
    url.hash = noteId;

    window.history.replaceState(
        {},
        '',
        url,
    );

    const reduceMotion =
        window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;

    target.scrollIntoView({
        behavior: reduceMotion
            ? 'auto'
            : 'smooth',
        block: 'center',
    });

    /*
     * Remove and re-add the class so the
     * animation restarts every time.
     */
    target.classList.remove(
        HIGHLIGHT_CLASS,
    );

    // Force the browser to restart the animation.
    void target.offsetWidth;

    target.classList.add(
        HIGHLIGHT_CLASS,
    );

    window.setTimeout(() => {
        target.classList.remove(
            HIGHLIGHT_CLASS,
        );
    }, HIGHLIGHT_DURATION);
});

export {};