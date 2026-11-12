import type { QuizOption, QuizQuestion } from "../quizData";
import type { OHLC } from "../ohlcData";

const IDS = ["A", "B", "C", "D"] as const;
export type OptId = (typeof IDS)[number];

/** Multiple choice with the right answer placed at `at`. */
export function mc(id: string, prompt: string, at: OptId, right: string, wrong: string[], explanation: string, glossaryTermId?: string): QuizQuestion {
  const o = [...wrong];
  o.splice(IDS.indexOf(at), 0, right);
  const options: QuizOption[] = o.map((label, i) => ({ id: IDS[i]!, label, description: "" }));
  return { id, prompt, correctAnswer: at, options, explanation, ...(glossaryTermId ? { glossaryTermId } : {}) };
}

export const r2 = (v: number) => Math.round(v * 100) / 100;
export const pct = (v: number, d = 1) => `${v < 0 ? "−" : ""}${Math.abs(v).toFixed(d)}%`;
export const usd = (v: number, d = 2) =>
  `${v < 0 ? "−" : ""}$${Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d })}`;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * SIMULATED daily tape for a case: `pre` bars drifting by `preDrift` per bar, then `post` bars by `postDrift`
 * (the first post bar can gap by `gap`). Seeded, so a case always draws the same tape and different seeds
 * give different shapes (the content graph rejects rescaled clones).
 */
export function seededTape(o: {
  seed: number;
  start: number;
  pre?: number;
  post?: number;
  preDrift: number;
  postDrift: number;
  vol: number;
  gap?: number;
}): { pre: OHLC[]; full: OHLC[] } {
  const rnd = mulberry32(o.seed);
  const nPre = o.pre ?? 12;
  const nPost = o.post ?? 4;
  const bars: OHLC[] = [];
  let close = o.start;
  for (let i = 0; i < nPre + nPost; i++) {
    const isPost = i >= nPre;
    const open = r2(i === nPre && o.gap ? close * (1 + o.gap) : close * (1 + (rnd() - 0.5) * o.vol * 0.4));
    const drift = isPost ? o.postDrift : o.preDrift;
    const next = r2(open * (1 + drift + (rnd() - 0.5) * o.vol));
    const high = r2(Math.max(open, next) * (1 + rnd() * o.vol * 0.5));
    const low = r2(Math.min(open, next) * (1 - rnd() * o.vol * 0.5));
    const name = isPost ? `T+${i - nPre + 1}` : `T-${nPre - i}`;
    bars.push({ name, open, high, low, close: next });
    close = next;
  }
  return { pre: bars.slice(0, nPre), full: bars };
}
