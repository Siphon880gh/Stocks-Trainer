/** Shared AI Explain prompt wrapper (Coach + Cases). No runtime LLM. */

import type { CaseAction, CaseStudy } from "./caseStudies";
import { simplePE, type FinancialSnapshot } from "./financialSnapshots";
import type { OHLC } from "./ohlcData";

const FOLLOW_UP_A = "Can this be applied in other scenarios?";
const FOLLOW_UP_B = "What's happening financially?";

const CASE_ACTION_LABEL: Record<CaseAction, string> = {
  buy: "BUY",
  sell: "SELL",
  hold: "HOLD",
  short: "SHORT",
};

function fmtNum(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

function fmtPrice(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 4 });
}

function snapshotMarkdown(snapshot: FinancialSnapshot): string {
  const pe = simplePE(snapshot);
  return [
    `## Practice snapshot · ${snapshot.symbol}`,
    "",
    `- **Income:** Revenue ${fmtNum(snapshot.incomeStatement.revenue)} · Net income ${fmtNum(snapshot.incomeStatement.netIncome)} · Margin ${snapshot.incomeStatement.netMarginPct}%`,
    `- **Balance sheet:** Assets ${fmtNum(snapshot.balanceSheet.assets)} · Liabilities ${fmtNum(snapshot.balanceSheet.liabilities)} · Equity ${fmtNum(snapshot.balanceSheet.equity)}`,
    `- **Cash flow:** Operating CF ${fmtNum(snapshot.cashFlow.operatingCashFlow)} · Free CF ${fmtNum(snapshot.cashFlow.freeCashFlow)} · P/E ≈ ${pe.toFixed(1)}`,
  ].join("\n");
}

/** Markdown table of the SAMPLE tape (High, Open, Close, Low, timemark). */
export function ohlcMarkdownTable(bars: OHLC[]): string {
  if (bars.length === 0) return "";
  const rows = bars.map((bar) => {
    const time = String(bar.name ?? "").replace(/\|/g, "\\|").trim() || "—";
    return `| ${time} | ${fmtPrice(bar.high)} | ${fmtPrice(bar.open)} | ${fmtPrice(bar.close)} | ${fmtPrice(bar.low)} |`;
  });
  return [
    "## SAMPLE chart",
    "",
    "| Time | High | Open | Close | Low |",
    "| --- | ---: | ---: | ---: | ---: |",
    ...rows,
  ].join("\n");
}

/** Case title, brief, snapshot, chart, choice, and debrief — markdown for the prompt body. */
export function buildCaseExplanationMarkdown(
  study: CaseStudy,
  action: CaseAction
): string {
  const blocks: string[] = [`# ${study.title.trim()}`, study.brief.trim()];
  const headline = study.newsHeadline?.trim();
  if (headline) blocks.push(`**Headline:** ${headline}`);
  if (study.statementSnapshot) blocks.push(snapshotMarkdown(study.statementSnapshot));
  const chart = ohlcMarkdownTable(study.postOhlc);
  if (chart) blocks.push(chart);
  blocks.push(`*You chose: ${CASE_ACTION_LABEL[action]}*`);
  blocks.push(
    [
      `- **How to think about it:** ${study.debrief.process}`,
      `- **Why the price moved:** ${study.debrief.whyMarketMoved}`,
      `- **What the numbers showed:** ${study.debrief.evidence}`,
    ].join("\n")
  );
  return `${blocks.join("\n\n")}\n`;
}

export function buildAiExplainPrompt(explanation: string): string {
  const body = explanation.trim();
  return [
    "Read this explanation to the end. Generate a TLDR, then ELI5 up to that point.",
    "",
    "---",
    "",
    "After that, offer user what they can ask",
    "",
    `“${FOLLOW_UP_A}”`,
    `“${FOLLOW_UP_B}”`,
    "",
    "Explanation here:",
    '"""',
    body,
    '"""',
  ].join("\n");
}

export function chatGptShareUrl(prompt: string): string {
  const url = new URL("https://chatgpt.com/");
  url.searchParams.set("q", prompt);
  return url.toString();
}

export function claudeShareUrl(prompt: string): string {
  const url = new URL("https://claude.ai/new");
  url.searchParams.set("q", prompt);
  return url.toString();
}
