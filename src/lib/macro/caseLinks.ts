import { getLesson } from "./lessons";
import { getMacroSource } from "./sources";

/** MF8.M2: existing macro case id → Macro Desk lesson. Risk-off / supply-shock cases have no single release and stay unmapped. */
export const MACRO_CASE_LESSON_LINKS: Record<string, string> = {
  "case-macro-print": "cpi",
  "case-macro-beg-print-soft-landing": "cpi",
  "case-macro-beg-print-jobs-hot": "employment-situation",
  "case-scale-risk-on": "employment-situation",
  "case-macro-beg-print-gdp-soft": "gdp",
};

export interface CaseMacroLink {
  lessonId: string;
  lessonTitle: string;
  sourceName: string;
  sourceUrl: string;
}

export function macroLinkForCase(caseId: string): CaseMacroLink | undefined {
  const lessonId = MACRO_CASE_LESSON_LINKS[caseId];
  const lesson = lessonId ? getLesson(lessonId) : undefined;
  const src = lesson ? getMacroSource(lesson.sourceId) : undefined;
  if (!lesson || !src) return undefined;
  return { lessonId: lesson.id, lessonTitle: lesson.title, sourceName: `${src.agency} — ${src.title}`, sourceUrl: src.url };
}
