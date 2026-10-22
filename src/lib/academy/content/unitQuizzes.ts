/** BA2.M1: every unit's quiz (ids `BA-<unitId>-NN`). Original items; letters rotate A→D within each level. */
import type { UnitQuizItem } from "../types";
import { QUIZZES_L0_L3 } from "./quizzesL0L3";
import { QUIZZES_L4_L7 } from "./quizzesL4L7";

export const UNIT_QUIZ_ITEMS: UnitQuizItem[] = [...QUIZZES_L0_L3, ...QUIZZES_L4_L7];

export const quizForUnit = (unitId: string) => UNIT_QUIZ_ITEMS.filter((q) => q.unitId === unitId);
