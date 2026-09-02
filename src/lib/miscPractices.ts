/** Learn → Misc Practices hub entries. Drawing keeps its existing route. */

export interface MiscPracticeItem {
  id: string;
  title: string;
  to: string;
}

export const MISC_PRACTICE_ITEMS: MiscPracticeItem[] = [
  { id: "draw", title: "Drawing", to: "/practice-draw" },
  { id: "flashcards", title: "Flashcards", to: "/practice/flashcards" },
  { id: "label", title: "Label", to: "/practice/label" },
  { id: "regime", title: "Trend vs range", to: "/practice/regime" },
  { id: "replay", title: "Bar replay", to: "/practice/replay" },
  { id: "plan", title: "Mark the plan", to: "/practice/plan" },
  { id: "hunt", title: "Pattern hunt", to: "/practice/hunt" },
];

const DONE_KEY = "analysis_core_misc_practices_done_v1";

function loadDoneIds(): string[] {
  try {
    const raw = localStorage.getItem(DONE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

export function isMiscPracticeDone(id: string): boolean {
  return loadDoneIds().includes(id);
}

export function markMiscPracticeDone(id: string): void {
  const next = new Set(loadDoneIds());
  next.add(id);
  localStorage.setItem(DONE_KEY, JSON.stringify([...next]));
}
