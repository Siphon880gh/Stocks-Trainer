/**
 * Optional exhibit shown above a quiz question (FE6): a statement table, a 13-week forecast,
 * an earnings preview card or an earnings reaction chart, all built from the fictional fixtures.
 * Kept here (not in quizData.ts) so the shared quiz file only gains a type-only import.
 */
import type { WhatIf } from "./cashForecast";

export type StatementTab = "income" | "balance" | "cashflow" | "metrics";

export type FinancialsExhibit =
  | { kind: "statement"; companyId: string; tab: StatementTab; start: number; count: number; highlightColumn?: number }
  | { kind: "forecast"; forecastId: string; whatIf?: WhatIf }
  | { kind: "preview"; eventId: string; revealActuals?: boolean }
  | {
      kind: "reaction";
      eventId: string;
      /** "pre" = only the 30 sessions before the report; "full" = pre + report + 15 after. */
      bars: "pre" | "full";
      /** Bar to highlight (index into the shown bars). Defaults to the report bar on "full". */
      highlightIndex?: number;
    };
