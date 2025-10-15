/**
 * Custom mouse cursor loader
 */

export function initCustomCursor() {
  if (!window.fetch) return;

  const mouseCursorSrc = document.body.dataset.mouseCursor || '/assets/mouse-cursor.svg';

  fetch(mouseCursorSrc, { method: 'HEAD' })
    .then((response) => {
      if (response.ok) {
        document.documentElement.style.setProperty(
          '--mouse-cursor',
          `url("${mouseCursorSrc}") 6 2, auto`
        );
        document.documentElement.style.setProperty(
          '--mouse-cursor-interactive',
          `url("${mouseCursorSrc}") 6 2, pointer`
        );
      }
    })
    .catch(() => {
      // Silently fail - use default cursor
    });
}
