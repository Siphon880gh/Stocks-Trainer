/**
 * Registry of tool-training lessons (TT1–TT5). Each lesson feeds a Learn group, cases, glossary terms, a page at
 * /tools/<slug> (`ToolLessonPage`) and a coach session. Add a lesson here; the menu, hub, ToC and progress map
 * read this list. See AGENTS_CODE_REFERENCE.md ("Tool training").
 */
import type { QuizQuestion } from "../quizData";
import type { ToolLesson, ToolTrainingMode, ToolTrainingQuizGroupId } from "./types";
import { MARKET_FORCES_LESSON } from "./marketForces";

export type { MockBlock, MockCallout, ToolLesson, ToolScreen, ToolTrainingMode, ToolTrainingQuizGroupId, ToolWalkthrough } from "./types";

export const TOOL_LESSONS: ToolLesson[] = [MARKET_FORCES_LESSON];

export const TOOL_LESSON_IDS = TOOL_LESSONS.map((t) => t.id);

export function isToolTrainingQuizGroup(id: string): id is ToolTrainingQuizGroupId {
  return TOOL_LESSONS.some((t) => t.id === id);
}

export function getToolLesson(slug: string): ToolLesson | undefined {
  return TOOL_LESSONS.find((t) => t.slug === slug);
}

export function toolLessonQuestions(id: string): QuizQuestion[] {
  return TOOL_LESSONS.find((t) => t.id === id)?.questions ?? [];
}

export const TOOL_QUIZ_GROUPS = TOOL_LESSONS.map((t) => ({ id: t.id, name: t.quiz.name, description: t.quiz.description, icon: t.quiz.icon }));
export const TOOL_CASES = TOOL_LESSONS.flatMap((t) => t.cases);
export const TOOL_TERMS = TOOL_LESSONS.flatMap((t) => t.terms);
export const TOOL_MODE_LABELS = Object.fromEntries(TOOL_LESSONS.map((t) => [t.mode, t.modeLabel])) as Record<ToolTrainingMode, string>;
export const TOOL_MODE_TIPS = Object.fromEntries(TOOL_LESSONS.map((t) => [t.mode, t.modeTip])) as Record<ToolTrainingMode, string>;

/** The existing comparison lab stays where it is; tool training links to it. */
export const CHARTING_APPS_ROUTE = "/practice/charting-apps";
