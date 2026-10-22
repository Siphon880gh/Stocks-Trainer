/** Saved walkthrough step per id (localStorage), so a learner can resume a narrative. */
export interface WalkthroughStep {
  id: string;
  title: string;
  body: string;
  /** `data-tour` value of the element to highlight; omit for a centred step. */
  target?: string;
}

const PROGRESS_KEY = "analysis_core_tour_progress_v1";
/** Saved step per walkthrough id, so a learner can resume. */
export function loadTourStep(id: string): number | null {
  try {
    const m = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "{}") as Record<string, number>;
    return typeof m[id] === "number" ? m[id]! : null;
  } catch { return null; }
}
export function saveTourStep(id: string, index: number | null): void {
  try {
    const m = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "{}") as Record<string, number>;
    if (index == null) delete m[id]; else m[id] = index;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(m));
  } catch { /* storage unavailable */ }
}
