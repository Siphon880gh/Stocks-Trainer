/**
 * z-index tokens. The walkthrough layers sit above every other overlay in the app (header 50, modals 100–220,
 * glossary popovers up to 260), so a tour popover is always on top. zLayers.test.ts fails if any component
 * uses a z-index at or above TOUR_BACKDROP.
 */
export const Z = {
  header: 50,
  modal: 100,
  popover: 200,
  jargon: 260,
  tourBackdrop: 1000,
  tourHighlight: 1001,
  tourPopover: 1002,
} as const;
