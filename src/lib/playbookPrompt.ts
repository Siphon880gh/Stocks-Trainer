import type { PlaybookSourceKind } from "./playbooks";

export type SourceUrlKind = PlaybookSourceKind | "invalid";

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtu.be",
  "www.youtu.be",
]);

/** Accept pasted hosts without a scheme. */
export function normalizeSourceUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function classifySourceUrl(raw: string): SourceUrlKind {
  const normalized = normalizeSourceUrl(raw);
  if (!normalized) return "invalid";
  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    return "invalid";
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "invalid";
  const host = parsed.hostname.toLowerCase();
  if (!host.includes(".") && host !== "localhost") return "invalid";
  if (YOUTUBE_HOSTS.has(host)) return "youtube";
  return "webpage";
}

export function buildPlaybookCursorPrompt(input: {
  url: string;
  notes?: string;
}): { ok: true; prompt: string; kind: PlaybookSourceKind } | { ok: false; error: string } {
  const kind = classifySourceUrl(input.url);
  if (kind === "invalid") {
    return { ok: false, error: "Need a full URL (https://…)" };
  }
  const url = normalizeSourceUrl(input.url);
  const notes = input.notes?.trim() ?? "";

  const readBlock =
    kind === "youtube"
      ? [
          "## Read the source first (YouTube)",
          "- Get the **video transcript** and the **description**. Those are the source of truth, not the title alone.",
          "- From transcript + description, name the trading strategy in learner language.",
          "- If the video mixes several setups, the transcript is vague, or you cannot tell the market, **stop and ask the human** which strategy and market to teach. Do not guess.",
        ].join("\n")
      : [
          "## Read the source first (webpage)",
          "- Read the page content at the URL (Medium, blog, docs, or other site).",
          "- Name the trading strategy in learner language from what the page actually says.",
          "- If the page is paywalled, thin, or mixes several setups, **stop and ask the human** which strategy and market to teach. Do not guess.",
        ].join("\n");

  const notesBlock = notes
    ? [
        "## What the human already thinks",
        notes,
        "",
        "Treat this as a hint. The source still wins. If the hint and the source disagree, ask the human.",
      ].join("\n")
    : "";

  const prompt = [
    "# Add a Playbook from this source",
    "",
    `Source URL: ${url}`,
    `Source kind: ${kind === "youtube" ? "YouTube" : "webpage"}`,
    "",
    readBlock,
    ...(notesBlock ? ["", notesBlock] : []),
    "",
    "## Identify before you author",
    "- Strategy name (sentence case, learner language).",
    "- Market / asset class: `equity` | `forex` | `future` | `crypto` | `option_context`.",
    "- SAMPLE / STYLIZED / educational only. No LIVE or REAL_TIME theater. No brokerage. No paid API keys.",
    "- Options = educational context only (no chain, no Greeks engine).",
    "- Equities remain the traditional retail path. Do not change Beginner Equities unlocks or `analysis_core_progress_v1`.",
    "",
    "## The codebase already has the pages that become the panels",
    "",
    "Do **not** explain or reinvent panel chrome. Playbooks already ships four **collapsed** expandable panels (click to open). Fill them by wiring existing pages and registries.",
    "",
    "The codebase has:",
    "- **Playbook registry** — `src/lib/playbooks.ts` (`PLAYBOOKS`, `getPlaybook`, `listPlaybooks`). Append one new `Playbook` (unique kebab `id`). Set `source.url` to the video or page (not a YouTube channel), and `source.label` (YouTuber or page name).",
    "- **Playbook list** — `/playbooks` · `src/pages/Playbooks.tsx`.",
    "- **Playbook page** — `/playbooks/:id` · `src/pages/Playbook.tsx`. The original resource is linked **near the top**, above the four panels (Resource · {label} → the video or page). Keep that credit. Do not add a YouTube channel link. Do not bury the YouTuber or page only inside Strategy text.",
    "- Four panels, collapsed until clicked:",
    "  1. **Strategy** — explanation of the rule set (`playbook.explanation`).",
    "  2. **Coaching** — step-by-step tree (`playbook.coachSlug`).",
    "  3. **Case study** — decide-and-reveal (`playbook.caseId`).",
    "  4. **Chart look** — SAMPLE tape + overlays (`playbook.samplePackId`, `playbook.overlayIds`).",
    "- **Step coaching pages** — `/coach` · `/coach/:slug` · `src/pages/Coach.tsx` · `src/pages/CoachSession.tsx` · sessions in `src/lib/coaching/sessions/` registered in `src/lib/coaching/sessions/index.ts`. Follow `.agents/skills/add-coaching-session/SKILL.md`.",
    "- **Case study pages** — `/cases` · `/cases/:caseId` · `src/pages/Cases.tsx` · `src/pages/CasePlayer.tsx` · `src/lib/caseStudies.ts` · `src/lib/multiAssetCases.ts`.",
    "- **Charts page** — `/market` · `src/pages/Market.tsx` · `src/components/MarketChart.tsx` · SAMPLE packs in `src/lib/samplePacks.ts` / `src/lib/markets.ts`.",
    "- **Overlays the chart already renders** — `src/lib/overlays.ts`: `sma`, `ema`, `rsi`, `macd`, `bollinger`. Only attach overlays MarketChart already draws. Do not invent overlay ids.",
    "",
    "## What to generate",
    "One playbook row plus the content those four panels already know how to show. The heading block on `/playbooks/:id` must keep the original resource link near the top.",
    "- Strategy panel: how the rule set works. SAMPLE honesty. No investment advice.",
    "- Coaching panel: a new coaching session (or reuse a session that already teaches this exact skill) and set `coachSlug`.",
    "- Case study panel: a new `CaseStudy` with distinct pre/post OHLC and a process debrief; set `caseId`. `allowShort: false` unless the strategy truly teaches short.",
    "- Chart look panel: a distinct SAMPLE pack (or a pack whose shape already matches) and only the overlays the strategy actually uses.",
    "",
    "Distinct OHLC — do not `scale()` an existing series. Leave `npm run dev` on port 3001 alone. Verify with `npm run lint` && `npm run build` (and `npm run test:coaching` if you add a session). Do not commit unless asked.",
    "",
  ].join("\n");

  return { ok: true, prompt, kind };
}
