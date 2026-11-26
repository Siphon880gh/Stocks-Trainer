/** Browse everything: the learner's choice to open its links in a new browser tab. */
export const BROWSE_NEW_TAB_KEY = "analysis_core_browse_new_tab_v1";

type KV = Pick<Storage, "getItem" | "setItem">;

function browser(): KV | undefined {
  try {
    return typeof localStorage === "undefined" ? undefined : localStorage;
  } catch {
    return undefined;
  }
}

/** Off unless the learner turned it on. */
export function loadBrowseNewTab(storage: KV | undefined = browser()): boolean {
  try {
    return storage?.getItem(BROWSE_NEW_TAB_KEY) === "1";
  } catch {
    return false;
  }
}

export function saveBrowseNewTab(on: boolean, storage: KV | undefined = browser()): void {
  try {
    storage?.setItem(BROWSE_NEW_TAB_KEY, on ? "1" : "0");
  } catch {
    // Storage can be full or blocked; the toggle still works for this visit.
  }
}

/** Extra props for a router Link: a new tab when on, normal in-app navigation when off. */
export function newTabProps(on: boolean): { target?: "_blank"; rel?: string } {
  return on ? { target: "_blank", rel: "noopener noreferrer" } : {};
}
