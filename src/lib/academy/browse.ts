/**
 * Session-only Academy preview. Closing the tab clears it. It is not level progress:
 * a locked lesson can be read, and its check is not recorded.
 */
const ACADEMY_BROWSE_ALL_KEY = "analysis_core_academy_browse_all_v1";

type BrowseStore = {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
};

function browseStore(): BrowseStore | null {
  try {
    return typeof sessionStorage !== "undefined" ? sessionStorage : null;
  } catch {
    return null;
  }
}

export function readAcademyBrowseAll(storage: Pick<BrowseStore, "getItem"> | null = browseStore()): boolean {
  try {
    return storage?.getItem(ACADEMY_BROWSE_ALL_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeAcademyBrowseAll(enabled: boolean, storage: BrowseStore | null = browseStore()): void {
  try {
    if (!storage) return;
    if (enabled) storage.setItem(ACADEMY_BROWSE_ALL_KEY, "1");
    else storage.removeItem(ACADEMY_BROWSE_ALL_KEY);
  } catch {
    /* private mode / blocked storage */
  }
}

/** A locked unit opened while Browse all is on: show it, and do not record the check. */
export function isAcademyPreview(status: string, browseAll: boolean): boolean {
  return browseAll && status === "locked";
}
