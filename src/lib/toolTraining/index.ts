/**
 * Registry of tool-training lessons (TT1–TT5). Each lesson feeds a Learn group, cases, glossary terms, a page at
 * /tools/<slug> (`ToolLessonPage`) and a coach session. Add a lesson here; the menu, hub, ToC and progress map
 * read this list. See AGENTS_CODE_REFERENCE.md ("Tool training").
 */
import type { QuizQuestion } from "../quizData";
import type { ToolLesson, ToolTrainingMode, ToolTrainingQuizGroupId } from "./types";
import { MARKET_FORCES_LESSON } from "./marketForces";
import { STOCKANALYSIS_LESSON } from "./stockAnalysis";
import { FINVIZ_LESSON } from "./finviz";
import { YAHOO_FINANCE_LESSON } from "./yahooFinance";
import { CAPSTONE_LESSON } from "./capstone";
import { CAPSTONE_BANK_LESSON } from "./capstoneBank";
import { EDGAR_LESSON } from "./edgar";
import { EARNINGS_INSIDERS_LESSON } from "./earningsInsiders";

export type { BarWalkSim, ColumnStep, ColumnWalkSim, MockBlock, MockCallout, SimBar, SimBarMark, FindTaskAnswer, SimRef, TermRef, ToolLesson, ToolScreen, ToolSimulation, ToolTask, ToolText, ToolTrainingMode, ToolTrainingQuizGroupId, ToolWalkthrough, ToolWorkflow, WorkflowField, WorkflowStep } from "./types";
export * from "./simWalk";
export * from "./liveLinks";
export * from "./fieldTerms";
export * from "./tasks";
export * from "./workflow";
import { TOOL_FIELD_TERMS } from "./fieldTerms";

export const TOOL_LESSONS: ToolLesson[] = [MARKET_FORCES_LESSON, STOCKANALYSIS_LESSON, FINVIZ_LESSON, YAHOO_FINANCE_LESSON, EDGAR_LESSON, EARNINGS_INSIDERS_LESSON, CAPSTONE_LESSON, CAPSTONE_BANK_LESSON];

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
/** Lesson terms, then the field-label definitions behind the screens' hover terms (`fieldTerms.ts`). */
export const TOOL_TERMS = [...TOOL_LESSONS.flatMap((t) => t.terms), ...TOOL_FIELD_TERMS];
export const TOOL_MODE_LABELS = Object.fromEntries(TOOL_LESSONS.map((t) => [t.mode, t.modeLabel])) as Record<ToolTrainingMode, string>;
export const TOOL_MODE_TIPS = Object.fromEntries(TOOL_LESSONS.map((t) => [t.mode, t.modeTip])) as Record<ToolTrainingMode, string>;

/** The existing comparison lab stays where it is; tool training links to it. */
export const CHARTING_APPS_ROUTE = "/practice/charting-apps";
