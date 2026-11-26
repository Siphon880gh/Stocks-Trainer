/**
 * Browse everything opens its links in a popup over the Browse page. The link carries the
 * Browse location as history state (the router's background-location pattern): the page
 * routes keep rendering Browse, and a second route tree renders the destination in a dialog.
 */
export type BackgroundLocation = { pathname: string; search: string; hash: string; state: null; key: string };
export type BrowseModalState = { browseModal: { background: BackgroundLocation; title: string } };

type LocationLike = { pathname: string; search?: string; hash?: string; key?: string };

export function browseModalState(background: LocationLike, title: string): BrowseModalState {
  return {
    browseModal: {
      background: {
        pathname: background.pathname,
        search: background.search ?? "",
        hash: background.hash ?? "",
        state: null,
        key: background.key ?? "default",
      },
      title,
    },
  };
}

/** The popup carried in a location's state, or null for a normal page visit. */
export function browseModalOf(state: unknown): BrowseModalState["browseModal"] | null {
  const m = (state as Partial<BrowseModalState> | null | undefined)?.browseModal;
  if (!m || typeof m !== "object") return null;
  const bg = m.background as Partial<BackgroundLocation> | undefined;
  if (!bg || typeof bg.pathname !== "string" || !bg.pathname.startsWith("/")) return null;
  return {
    background: { pathname: bg.pathname, search: bg.search ?? "", hash: bg.hash ?? "", state: null, key: bg.key ?? "default" },
    title: typeof m.title === "string" && m.title.trim() ? m.title : "Preview",
  };
}

/** The page location to render behind any popup. */
export function pageLocation<L extends LocationLike & { state?: unknown }>(location: L): L | BackgroundLocation {
  return browseModalOf(location.state)?.background ?? location;
}

// The link that opened the popup, so closing it can put focus back there.
let trigger: HTMLElement | null = null;
export function rememberBrowseTrigger(el: HTMLElement | null): void {
  trigger = el;
}
export function takeBrowseTrigger(): HTMLElement | null {
  const el = trigger;
  trigger = null;
  return el;
}
