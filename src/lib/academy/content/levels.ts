/**
 * BA1.M1: the Academy course map. Levels → courses → ordered unit ids.
 * Prerequisites always point to earlier levels, so the map is a DAG rooted at L0.
 */
import type { Level, LevelId, Unit } from "../types";
import { UNITS_L0_L3 } from "./unitsL0L3";
import { UNITS_L4_L7 } from "./unitsL4L7";

export const UNITS: Unit[] = [...UNITS_L0_L3, ...UNITS_L4_L7];

const ids = (levelId: LevelId, courseId: string) => UNITS.filter((u) => u.levelId === levelId && u.courseId === courseId).map((u) => u.id);

export const LEVELS: Level[] = [
  {
    id: "L0",
    title: "Orientation",
    summary: "How markets and this app work, why risk comes first, and what a simulated account can and cannot teach.",
    prerequisites: [],
    courses: [{ id: "orientation", levelId: "L0", title: "Start here", summary: "Markets, the app, risk and paper trading.", unitIds: ids("L0", "orientation") }],
  },
  {
    id: "L1",
    title: "Stock basics",
    summary: "Shares, quotes, why prices move, long vs short, and spreading risk.",
    prerequisites: ["L0"],
    courses: [{ id: "stock-basics", levelId: "L1", title: "Stocks and quotes", summary: "What you own and how it is priced.", unitIds: ids("L1", "stock-basics") }],
  },
  {
    id: "L2",
    title: "Charts & candles",
    summary: "Read candles, trends, levels and volume, and why patterns need context.",
    prerequisites: ["L1"],
    courses: [{ id: "charts-and-candles", levelId: "L2", title: "Reading charts", summary: "Candles, structure, levels and volume.", unitIds: ids("L2", "charts-and-candles") }],
  },
  {
    id: "L3",
    title: "Orders, sizing & risk",
    summary: "Every order type, how long orders last, how many shares to buy, and a plan before entry.",
    prerequisites: ["L2"],
    courses: [
      { id: "order-types", levelId: "L3", title: "Order types", summary: "Market, limit, stop, stop-limit, trailing stop and time in force.", unitIds: ids("L3", "order-types") },
      { id: "sizing-and-planning", levelId: "L3", title: "Sizing and planning", summary: "Position size from risk, and the four-number trade plan.", unitIds: ids("L3", "sizing-and-planning") },
    ],
  },
  {
    id: "L4",
    title: "Company fundamentals & earnings",
    summary: "The three statements, profit vs cash, margins and P/E, earnings expectations and reactions, debt risk.",
    prerequisites: ["L1"],
    courses: [
      { id: "reading-statements", levelId: "L4", title: "Reading statements", summary: "Income statement, balance sheet, cash flow, margins and P/E.", unitIds: ids("L4", "reading-statements") },
      { id: "earnings", levelId: "L4", title: "Earnings season", summary: "Expectations, reactions and balance-sheet risk.", unitIds: ids("L4", "earnings") },
    ],
  },
  {
    id: "L5",
    title: "Macro & rates",
    summary: "Jobs and inflation reports, the Fed, the yield curve, macro reactions and rate-sensitive sectors.",
    prerequisites: ["L1"],
    courses: [{ id: "macro-and-rates", levelId: "L5", title: "Macro and rates", summary: "How economic data and interest rates move markets.", unitIds: ids("L5", "macro-and-rates") }],
  },
  {
    id: "L6",
    title: "Options education",
    summary: "Calls, puts, payoff at expiration, income strategies and why options can lose 100% quickly. Education only.",
    prerequisites: ["L3"],
    courses: [{ id: "options-basics", levelId: "L6", title: "Options basics", summary: "Definitions, payoff math and risk, before the options ladder.", unitIds: ids("L6", "options-basics") }],
  },
  {
    id: "L7",
    title: "Other markets",
    summary: "ETFs, futures, currencies and crypto: what is different and what is the same.",
    prerequisites: ["L1"],
    courses: [{ id: "other-markets", levelId: "L7", title: "Beyond single stocks", summary: "ETFs, futures, forex and crypto basics.", unitIds: ids("L7", "other-markets") }],
  },
];

export const getLevel = (id: string) => LEVELS.find((l) => l.id === id);
export const getUnit = (id: string) => UNITS.find((u) => u.id === id);
export const unitsForLevel = (id: LevelId) => LEVELS.find((l) => l.id === id)!.courses.flatMap((c) => c.unitIds).map((u) => getUnit(u)!);
/** Course-map order: level order, then course order, then unit order. */
export const UNIT_ORDER: string[] = LEVELS.flatMap((l) => l.courses.flatMap((c) => c.unitIds));
