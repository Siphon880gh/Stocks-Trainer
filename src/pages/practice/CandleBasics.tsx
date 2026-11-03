import { useState } from "react";
import { Link } from "react-router-dom";
import { CANDLE_LESSONS, matchIsCorrect, type CandleLesson } from "../../lib/candleBasics";
import { CHART } from "../../lib/chartTheme";
import { cn } from "../../lib/utils";

const TOP = 28;
const HEIGHT = 250;
const priceY = (price: number) => TOP + ((100 - price) / 100) * HEIGHT;

function Arrow({ x, from, to, color }: { x: number; from: number; to: number; color: string }) {
  const y1 = priceY(from);
  const y2 = priceY(to);
  const down = y2 > y1;
  const head = 8;
  const tip = y2;
  const shaft = down ? y2 - head : y2 + head;
  return (
    <g aria-hidden>
      <line x1={x} y1={y1} x2={x} y2={shaft} stroke={color} strokeWidth={2} />
      <polygon
        points={down ? `${x},${tip} ${x - 5},${tip - head} ${x + 5},${tip - head}` : `${x},${tip} ${x - 5},${tip + head} ${x + 5},${tip + head}`}
        fill={color}
      />
    </g>
  );
}

function DrawnCandle({ lesson, labeled }: { lesson: CandleLesson; labeled: boolean }) {
  const up = lesson.close >= lesson.open;
  const color = up ? CHART.up : CHART.down;
  const bodyTop = priceY(Math.max(lesson.open, lesson.close));
  const bodyBot = priceY(Math.min(lesson.open, lesson.close));
  const bodyH = Math.max(3, bodyBot - bodyTop);
  const cx = 210;
  return (
    <svg viewBox="0 0 460 310" className="w-full max-w-xl h-auto" role="img" aria-label={labeled ? lesson.title : "Candlestick"}>
      <rect x="0" y="0" width="460" height="310" fill={CHART.pane} rx="8" />
      <line x1={cx} y1={priceY(lesson.high)} x2={cx} y2={priceY(lesson.low)} stroke={color} strokeWidth={2} />
      <rect x={cx - 16} y={bodyTop} width={32} height={bodyH} fill={color} rx={2} />
      {labeled && bodyH > 36 ? (
        <text x={cx} y={bodyTop + bodyH / 2 + 4} textAnchor="middle" fill="#fff" fontSize="11">
          {up ? "buyers" : "sellers"}
        </text>
      ) : null}
      {labeled
        ? lesson.arrows.map((arrow, i) => {
            const mid = (priceY(arrow.from) + priceY(arrow.to)) / 2;
            const x = cx + 34 + (i % 2) * 16;
            return (
              <g key={arrow.text}>
                <Arrow x={x} from={arrow.from} to={arrow.to} color={CHART.highlight} />
                <text x={x + 10} y={mid + i * 16 - 8} fill={CHART.text} fontSize="11">
                  {arrow.text}
                </text>
              </g>
            );
          })
        : null}
      {labeled
        ? (() => {
            const placed: { side: "left" | "right"; y: number }[] = [];
            const ordered = [...lesson.marks].sort((a, b) => b.price - a.price);
            return ordered.map((mark) => {
              let y = priceY(mark.price);
              for (const earlier of placed) {
                if (earlier.side === mark.side && Math.abs(earlier.y - y) < 16) y = earlier.y + 16;
              }
              placed.push({ side: mark.side, y });
              const left = mark.side === "left";
              return (
                <g key={mark.text}>
                  <line x1={left ? 148 : cx + 18} y1={priceY(mark.price)} x2={left ? cx - 20 : 292} y2={y} stroke={CHART.axis} strokeWidth={1} />
                  <text x={left ? 8 : 298} y={y + 4} fill={CHART.text} fontSize="12">
                    {mark.text}
                  </text>
                </g>
              );
            });
          })()
        : null}
    </svg>
  );
}

function MatchQuiz() {
  const [picked, setPicked] = useState<string | null>(null);
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [missId, setMissId] = useState<string | null>(null);
  const prompts = [...CANDLE_LESSONS].reverse();
  const done = CANDLE_LESSONS.every((lesson) => pairs[lesson.id] === lesson.id);
  const used = new Set(Object.values(pairs));
  const chooseCandle = (lessonId: string) => {
    if (!picked || pairs[lessonId]) return;
    if (matchIsCorrect(lessonId, picked)) {
      setPairs((prev) => ({ ...prev, [lessonId]: picked }));
      setPicked(null);
      setMissId(null);
    } else {
      setMissId(lessonId);
      setPicked(null);
    }
  };
  return (
    <div className="space-y-4" data-testid="candle-match">
      <div>
        <h2 className="text-lg font-semibold">Match them</h2>
        <p className="text-sm text-muted mt-1">
          Pick a description, then pick the candle it belongs to. You have seen every shape.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {prompts.map((lesson) => {
          const taken = used.has(lesson.id);
          return (
            <button
              key={lesson.id}
              type="button"
              disabled={taken}
              aria-pressed={picked === lesson.id}
              onClick={() => setPicked(lesson.id)}
              className={cn(
                "px-2.5 py-1.5 rounded-lg border text-left text-[13px]",
                taken && "opacity-40",
                picked === lesson.id ? "border-primary bg-primary/10 text-primary font-semibold" : "border-line bg-surface",
              )}
            >
              {lesson.match}
            </button>
          );
        })}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {CANDLE_LESSONS.map((lesson, i) => {
          const matched = pairs[lesson.id] === lesson.id;
          return (
            <button
              key={lesson.id}
              type="button"
              aria-label={matched ? lesson.match : `Candle ${i + 1}`}
              data-testid={`match-${lesson.id}`}
              data-matched={matched ? "true" : "false"}
              onClick={() => chooseCandle(lesson.id)}
              className={cn(
                "rounded-lg border bg-surface p-2 text-left",
                matched && "border-emerald-500",
                missId === lesson.id && "border-accent-red",
                !matched && "border-line hover:border-primary",
              )}
            >
              <DrawnCandle lesson={lesson} labeled={false} />
              {matched ? <p className="text-[12px] text-emerald-600 px-1 pb-1">{lesson.match}</p> : null}
            </button>
          );
        })}
      </div>
      {done ? (
        <p className="text-sm font-semibold text-emerald-600" data-testid="candle-match-done">
          You matched every variation. The shapes are ways of reading one period, not a signal to buy or sell.
        </p>
      ) : (
        <p className="text-[12px] text-muted">{picked ? "Now choose the matching candle." : "Choose a description first."}</p>
      )}
    </div>
  );
}

/** Browse one candle shape at a time, then match the shapes to what they show. */
export default function CandleBasics() {
  const [index, setIndex] = useState(0);
  const count = CANDLE_LESSONS.length + 1;
  const quiz = index === CANDLE_LESSONS.length;
  const lesson = CANDLE_LESSONS[index];
  const go = (next: number) => setIndex(Math.max(0, Math.min(count - 1, next)));
  return (
    <main className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full space-y-4">
      <div>
        <p className="text-[12px] text-muted">
          <Link to="/training" className="hover:text-ink">Table of Contents</Link>
          {" · Pattern recognition"}
        </p>
        <h1 className="text-lg font-semibold tracking-tight mt-1">Candlestick Basics</h1>
        <p className="text-[13px] text-muted">
          One five-minute candle at a time. The arrows are one possible path inside the period. A real candle does not store that path, only the open, high, low and close. Diagram, not a live chart. Not trading advice.
        </p>
      </div>
      <div className="flex items-center gap-2" data-testid="candle-basics">
        <button
          type="button"
          aria-label="Previous variation"
          disabled={index === 0}
          onClick={() => go(index - 1)}
          className="grid place-items-center w-9 h-9 rounded-full border border-line bg-surface disabled:opacity-40"
        >
          <span className="material-symbols-outlined" aria-hidden>chevron_left</span>
        </button>
        <p className="flex-1 text-center text-sm font-semibold">{quiz ? "Match them" : lesson!.title}</p>
        <button
          type="button"
          aria-label="Next variation"
          disabled={index === count - 1}
          onClick={() => go(index + 1)}
          className="grid place-items-center w-9 h-9 rounded-full border border-line bg-surface disabled:opacity-40"
        >
          <span className="material-symbols-outlined" aria-hidden>chevron_right</span>
        </button>
      </div>
      <div className="flex flex-wrap justify-center gap-1.5" role="tablist" aria-label="Candle variations">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={i === CANDLE_LESSONS.length ? "Match them" : CANDLE_LESSONS[i]!.title}
            onClick={() => go(i)}
            className="grid place-items-center w-8 h-8"
          >
            <span className={cn("block rounded-full", i === index ? "w-2.5 h-2.5 bg-primary" : "w-2 h-2 bg-line")} />
          </button>
        ))}
      </div>
      {quiz || !lesson ? (
        <MatchQuiz />
      ) : (
        <section className="space-y-3" data-testid="candle-slide" data-lesson={lesson.id}>
          <DrawnCandle lesson={lesson} labeled />
          <p className="text-sm text-ink">{lesson.story}</p>
        </section>
      )}
    </main>
  );
}
