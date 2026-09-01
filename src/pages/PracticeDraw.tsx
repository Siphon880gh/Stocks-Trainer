import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  BRUSH_HEX,
  DRAW_TEMPLATES,
  type BrushColor,
  type DrawGrade,
  type DrawTemplateId,
  type Point,
  type Stroke,
  getDrawTemplate,
  gradeSketch,
  loadLastDrawAttempt,
  parseDrawTemplateId,
  saveLastDrawAttempt,
} from "../lib/practiceDraw";

function hexAlpha(hex: string, alpha: number): string {
  const n = Number.parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function pointerToNorm(
  el: HTMLCanvasElement,
  clientX: number,
  clientY: number,
): Point {
  const rect = el.getBoundingClientRect();
  const x = (clientX - rect.left) / rect.width;
  const y = (clientY - rect.top) / rect.height;
  return {
    x: Math.min(1, Math.max(0, x)),
    y: Math.min(1, Math.max(0, y)),
  };
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  strokes: Stroke[],
  templateId: DrawTemplateId | null,
  active: Stroke | null,
) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#0a0f08";
  ctx.fillRect(0, 0, width, height);

  // subtle grid
  ctx.strokeStyle = "rgba(56, 255, 20, 0.08)";
  ctx.lineWidth = 1;
  const step = Math.max(20, Math.floor(width / 16));
  for (let x = step; x < width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = step; y < height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  if (templateId) {
    const template = getDrawTemplate(templateId);
    ctx.lineWidth = Math.max(2, width * 0.01);
    const dashOn = Math.max(3, Math.round(width * 0.01));
    const dashOff = Math.max(2, Math.round(width * 0.008));
    ctx.setLineDash([dashOn, dashOff]);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const guide of template.guides) {
      if (guide.points.length === 0) continue;
      ctx.strokeStyle = hexAlpha(BRUSH_HEX[guide.color], 0.4);
      ctx.beginPath();
      ctx.moveTo(guide.points[0].x * width, guide.points[0].y * height);
      for (let i = 1; i < guide.points.length; i++) {
        ctx.lineTo(guide.points[i].x * width, guide.points[i].y * height);
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }

  const all = active ? [...strokes, active] : strokes;
  ctx.lineWidth = Math.max(2.5, width * 0.012);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const stroke of all) {
    if (stroke.points.length === 0) continue;
    ctx.strokeStyle = BRUSH_HEX[stroke.color];
    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x * width, stroke.points[0].y * height);
    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x * width, stroke.points[i].y * height);
    }
    ctx.stroke();
  }
}

const GRADE_LABEL: Record<DrawGrade, string> = {
  correct: "CORRECT",
  partial: "PARTIAL",
  incorrect: "INCORRECT",
};

export default function PracticeDraw() {
  const [searchParams] = useSearchParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [activeStroke, setActiveStroke] = useState<Stroke | null>(null);
  const [brushColor, setBrushColor] = useState<BrushColor>("bullish");
  const [templateId, setTemplateId] = useState<DrawTemplateId>("doji");
  const [result, setResult] = useState<{
    grade: DrawGrade;
    score: number;
    tip: string;
  } | null>(null);
  const [restoredNote, setRestoredNote] = useState<string | null>(null);
  const [writebackNote, setWritebackNote] = useState<string | null>(null);

  useEffect(() => {
    const ref = searchParams.get("template") ?? searchParams.get("contentRef");
    const fromQuery = ref ? parseDrawTemplateId(ref) : null;
    if (fromQuery) {
      setTemplateId(fromQuery);
      setBrushColor(getDrawTemplate(fromQuery).openingBrush);
    }
    const last = loadLastDrawAttempt();
    if (!last) return;
    if (!fromQuery) {
      setTemplateId(last.templateId);
      setBrushColor(getDrawTemplate(last.templateId).openingBrush);
    }
    setStrokes(last.strokes);
    setResult({ grade: last.grade, score: last.score, tip: last.tip });
    setRestoredNote(`LAST_ATTEMPT restored · ${last.grade.toUpperCase()}`);
  }, [searchParams]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeAndPaint = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawScene(ctx, w, h, strokes, templateId, activeStroke);
    };

    resizeAndPaint();
    const ro = new ResizeObserver(resizeAndPaint);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    window.addEventListener("resize", resizeAndPaint);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resizeAndPaint);
    };
  }, [strokes, templateId, activeStroke]);

  const beginStroke = (clientX: number, clientY: number, pointerId: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(pointerId);
    drawingRef.current = true;
    setResult(null);
    setRestoredNote(null);
    setActiveStroke({
      points: [pointerToNorm(canvas, clientX, clientY)],
      color: brushColor,
    });
  };

  const extendStroke = (clientX: number, clientY: number) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const p = pointerToNorm(canvas, clientX, clientY);
    setActiveStroke((prev) =>
      prev
        ? { ...prev, points: [...prev.points, p] }
        : { points: [p], color: brushColor },
    );
  };

  const endStroke = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    setActiveStroke((prev) => {
      if (prev && prev.points.length > 0) {
        setStrokes((s) => [...s, prev]);
      }
      return null;
    });
  };

  const handleUndo = () => {
    setResult(null);
    setRestoredNote(null);
    setStrokes((s) => s.slice(0, -1));
  };

  const handleClear = () => {
    setResult(null);
    setRestoredNote(null);
    setStrokes([]);
    setActiveStroke(null);
  };

  const handleSubmit = () => {
    const graded = gradeSketch(strokes, templateId);
    setResult(graded);
    saveLastDrawAttempt({
      templateId,
      strokes,
      grade: graded.grade,
      score: graded.score,
      tip: graded.tip,
      savedAtIso: new Date().toISOString(),
    });
    setRestoredNote(null);
    setWritebackNote(
      `WRITEBACK · tip flag set for Dashboard · ${graded.grade.toUpperCase()}`,
    );
  };

  const template = getDrawTemplate(templateId);

  return (
    <div className="flex-1 flex flex-col">
      <header className="sticky top-0 z-10 bg-background-dark/95 border-b border-primary/30 backdrop-blur-sm">
        <div className="flex items-center p-4 justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">history_edu</span>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-primary font-mono">PRACTICE_DRAW</h1>
              <p className="text-[10px] text-primary/60 leading-none">DRAW_CANDLESTICK_PATTERNS</p>
            </div>
          </Link>
          <Link
            to="/"
            className="p-2 rounded hover:bg-primary/10 text-primary transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-xs font-mono">BACK</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full space-y-4">
        <section className="border-neon p-3 bg-neutral-dark/60 rounded-xl">
          <h2 className="text-[10px] font-bold tracking-widest text-primary/70 mb-2 font-mono">
            TEMPLATE_PICKER
          </h2>
          <div className="flex flex-wrap gap-2">
            {DRAW_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTemplateId(t.id);
                  setResult(null);
                  setRestoredNote(null);
                  setBrushColor(t.openingBrush);
                }}
                className={`px-3 py-2 text-xs font-mono rounded border transition-colors ${
                  templateId === t.id
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-primary/30 text-primary/70 hover:bg-primary/10"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[10px] font-mono text-primary/50">
            Guide silhouette shown as dashed lines · {template.name}
            {template.hint ? ` · ${template.hint}` : ""}
          </p>
        </section>

        <section className="border-neon p-3 bg-neutral-dark/60 rounded-xl space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h2 className="text-[10px] font-bold tracking-widest text-primary/70 font-mono">
              CANVAS_AREA
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5" role="group" aria-label="Brush color">
                <span className="text-[9px] font-mono text-primary/50 tracking-widest">BRUSH</span>
                {(["bullish", "bearish"] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={c === "bullish" ? "Bullish green brush" : "Bearish red brush"}
                    aria-pressed={brushColor === c}
                    onClick={() => setBrushColor(c)}
                    className={`w-6 h-6 rounded-sm border-2 ${
                      brushColor === c
                        ? c === "bullish"
                          ? "border-primary shadow-[0_0_8px_#38ff14]"
                          : "border-accent-red shadow-[0_0_8px_#ff3814]"
                        : "border-primary/30 opacity-70"
                    }`}
                    style={{ backgroundColor: BRUSH_HEX[c] }}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={handleUndo}
                disabled={strokes.length === 0}
                className="px-3 py-1.5 text-[10px] font-mono border border-primary/40 rounded text-primary disabled:opacity-30 hover:bg-primary/10"
              >
                UNDO
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={strokes.length === 0 && !activeStroke}
                className="px-3 py-1.5 text-[10px] font-mono border border-primary/40 rounded text-primary disabled:opacity-30 hover:bg-primary/10"
              >
                CLEAR
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={strokes.length === 0}
                className="px-3 py-1.5 text-[10px] font-mono border border-primary rounded bg-primary/20 text-primary font-bold disabled:opacity-30 hover:bg-primary/30"
              >
                SUBMIT
              </button>
            </div>
          </div>
          <div
            className="aspect-video w-full bg-background-dark border-2 border-primary/40 rounded-lg overflow-hidden touch-none"
            style={{ touchAction: "none" }}
          >
            <canvas
              ref={canvasRef}
              aria-label="Practice draw canvas"
              className="w-full h-full cursor-crosshair block"
              onPointerDown={(e) => {
                e.preventDefault();
                beginStroke(e.clientX, e.clientY, e.pointerId);
              }}
              onPointerMove={(e) => {
                e.preventDefault();
                extendStroke(e.clientX, e.clientY);
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                endStroke();
              }}
              onPointerCancel={() => endStroke()}
            />
          </div>
          <p className="text-[10px] font-mono text-primary/40">
            Pointer / touch · strokes: {strokes.length}
            {activeStroke ? " · drawing…" : ""} · brush:{" "}
            {brushColor === "bullish" ? "GREEN" : "RED"}
          </p>
        </section>

        {(result || restoredNote || writebackNote) && (
          <section className="border-neon p-4 bg-neutral-dark/80 rounded-xl font-mono text-[11px] space-y-1">
            {restoredNote && <p className="text-primary/50">&gt; {restoredNote}</p>}
            {result && (
              <>
                <p
                  className={
                    result.grade === "correct"
                      ? "text-primary"
                      : result.grade === "partial"
                        ? "text-primary/80"
                        : "text-accent-red"
                  }
                >
                  &gt; GRADE: {GRADE_LABEL[result.grade]} · score{" "}
                  {Math.round(result.score * 100)}%
                </p>
                <p className="text-primary/70">&gt; TIP: {result.tip}</p>
              </>
            )}
            {writebackNote && <p className="text-primary/60">&gt; {writebackNote}</p>}
          </section>
        )}

        <section className="border-neon p-4 bg-neutral-dark/80 rounded-xl font-mono text-[11px] space-y-1">
          <p className="text-primary/40">&gt; PRACTICE_DRAW ready</p>
          <p className="text-primary/40">&gt; Templates: Doji · Hammer · Bullish Engulfing · Bearish Engulfing</p>
          <p className="text-primary/40">&gt; Brush GREEN / RED — match the dashed candle colors</p>
          <p className="text-primary/80">&gt; Sketch the guide, then SUBMIT for a coarse grade</p>
          <p className="text-primary/40 animate-pulse">_</p>
        </section>

        <div className="flex gap-4">
          <Link
            to="/archive"
            className="flex-1 p-4 border border-primary/30 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors text-center"
          >
            <span className="material-symbols-outlined text-primary block mb-2">menu_book</span>
            <span className="text-xs font-mono text-primary">READ_THEORY</span>
          </Link>
          <Link
            to="/training"
            className="flex-1 p-4 border border-primary rounded-xl bg-primary/20 hover:bg-primary/30 transition-colors text-center"
          >
            <span className="material-symbols-outlined text-primary block mb-2">quiz</span>
            <span className="text-xs font-mono text-primary font-bold">QUIZ_CENTER</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
