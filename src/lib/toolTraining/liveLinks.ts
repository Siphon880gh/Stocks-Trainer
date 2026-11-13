/**
 * Live links: the real page on each tool that a simulated screen (or column walk) mirrors. Every URL in Tool
 * Training's "Open the live version" links is built here, so a site's URL change is a one-line fix. Patterns were
 * checked on Nov 12, 2026. Market Forces has no public host yet, so it points at the local copy Weng serves.
 */

export type LiveTool = "StockAnalysis" | "Finviz" | "Yahoo Finance" | "Market Forces";

export interface LiveLink {
  tool: LiveTool;
  /** What the page is, e.g. "NEM income statement". Shown after the tool name. */
  label: string;
  url: string;
}

/** Local Market Forces tickers app (hash routing: theme, ticker, weights, compare). */
export const MARKET_FORCES_URL = "http://localhost:8888/weng/stocks/tickers/";

/** Where each tool's links must point; the live-link test checks every URL against this. */
export const LIVE_TOOL_ORIGINS: Record<LiveTool, string> = {
  StockAnalysis: "https://stockanalysis.com/",
  Finviz: "https://finviz.com/",
  "Yahoo Finance": "https://finance.yahoo.com/",
  "Market Forces": MARKET_FORCES_URL,
};

const lower = (symbol: string) => encodeURIComponent(symbol.trim().toLowerCase());
const upper = (symbol: string) => encodeURIComponent(symbol.trim().toUpperCase());

export type StockAnalysisStockTab = "" | "financials" | "statistics" | "forecast" | "dividend" | "history" | "company";
export type StockAnalysisEtfTab = "" | "holdings" | "dividend" | "history";

/** stockanalysis.com/stocks/<sym>/<tab>/ */
export function stockAnalysisStock(symbol: string, tab: StockAnalysisStockTab, label: string): LiveLink {
  return { tool: "StockAnalysis", label, url: `https://stockanalysis.com/stocks/${lower(symbol)}/${tab ? `${tab}/` : ""}` };
}

/** stockanalysis.com/etf/<sym>/<tab>/ */
export function stockAnalysisEtf(symbol: string, tab: StockAnalysisEtfTab, label: string): LiveLink {
  return { tool: "StockAnalysis", label, url: `https://stockanalysis.com/etf/${lower(symbol)}/${tab ? `${tab}/` : ""}` };
}

/** finviz.com/quote.ashx?t=<SYM> (snapshot, analyst and insider tables). */
export function finvizQuote(symbol: string, label: string): LiveLink {
  return { tool: "Finviz", label, url: `https://finviz.com/quote.ashx?t=${upper(symbol)}` };
}

/**
 * finviz.com/screener.ashx with filter codes (e.g. "ind_gold") and a view (111 = Overview). Commas join filters,
 * the way Finviz writes them in its own address bar.
 */
export function finvizScreener(filters: string[], label: string, view = "111"): LiveLink {
  const f = filters.map((x) => encodeURIComponent(x)).join(",");
  return { tool: "Finviz", label, url: `https://finviz.com/screener.ashx?v=${encodeURIComponent(view)}${f ? `&f=${f}` : ""}` };
}

/** finviz.com/elite: the plan comparison. */
export function finvizPlans(label: string): LiveLink {
  return { tool: "Finviz", label, url: "https://finviz.com/elite" };
}

export type YahooTab = "" | "key-statistics" | "history" | "financials" | "analysis" | "insider-transactions" | "holders";

/** finance.yahoo.com/quote/<SYM>/<tab>/ (Statistics lives at key-statistics). */
export function yahooQuote(symbol: string, tab: YahooTab, label: string): LiveLink {
  return { tool: "Yahoo Finance", label, url: `https://finance.yahoo.com/quote/${upper(symbol)}/${tab ? `${tab}/` : ""}` };
}

/** The local Market Forces app with a view in its hash: a theme, a selected ticker, or Index weights picks. */
export function marketForcesView(view: { theme?: string; ticker?: string; weights?: string[] }, label: string): LiveLink {
  const params: string[] = [];
  if (view.theme) params.push(`theme=${encodeURIComponent(view.theme)}`);
  if (view.ticker) params.push(`ticker=${upper(view.ticker)}`);
  if (view.weights) params.push(`weights=${view.weights.map(upper).join(",")}`);
  return { tool: "Market Forces", label, url: `${MARKET_FORCES_URL}${params.length ? `#${params.join("&")}` : ""}` };
}

/** True when `link.url` is well formed and sits on its tool's origin (https, or the local Market Forces app). */
export function isLiveLinkValid(link: LiveLink): boolean {
  let u: URL;
  try {
    u = new URL(link.url);
  } catch {
    return false;
  }
  const origin = LIVE_TOOL_ORIGINS[link.tool];
  if (!origin || !link.label.trim()) return false;
  if (link.tool === "Market Forces") return link.url.startsWith(MARKET_FORCES_URL);
  return u.protocol === "https:" && `${u.origin}/` === origin;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-11-12" → "Nov 12, 2026" (the snapshot date shown beside live links). */
export function formatSnapshotDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`;
}
