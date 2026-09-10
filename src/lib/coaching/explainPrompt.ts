import {
  buildAiExplainPrompt,
  chatGptShareUrl,
  claudeShareUrl,
  ohlcMarkdownTable,
} from "../aiExplainPrompt";
import { getCaseStudy } from "../caseStudies";
import type { OHLC } from "../ohlcData";
import { listPlaybooks } from "../playbooks";
import { getSamplePack } from "../samplePacks";
import type { CoachingOutcome } from "./types";
import type { PathTrailStep } from "./pathTrail";

export { buildAiExplainPrompt, chatGptShareUrl, claudeShareUrl };

/** Unique playbook Chart look (or case tape) for this session, if one exists. */
export function chartBarsForCoachSlug(slug: string): OHLC[] | undefined {
  const hits = listPlaybooks().filter((p) => p.coachSlug === slug);
  const packIds = [
    ...new Set(
      hits.map((p) => p.samplePackId).filter((id): id is string => Boolean(id))
    ),
  ];
  if (packIds.length === 1) {
    const bars = getSamplePack(packIds[0])?.ohlc;
    return bars && bars.length > 0 ? bars : undefined;
  }
  const caseIds = [
    ...new Set(hits.map((p) => p.caseId).filter((id): id is string => Boolean(id))),
  ];
  if (caseIds.length === 1) {
    const bars = getCaseStudy(caseIds[0])?.postOhlc;
    return bars && bars.length > 0 ? bars : undefined;
  }
  return undefined;
}

/** Show AI Explain after a correct choice (not on start, not on wrong). */
export function canShowAiExplain(
  outcome: CoachingOutcome,
  historyLength: number
): boolean {
  return historyLength > 0 && (outcome === "continue" || outcome === "success");
}

/** Turn a node message into markdown, bolding the question line. */
export function nodeMessageToMarkdown(message: string): string {
  const trimmed = message.trim();
  if (!trimmed) return "";
  const paragraphs = trimmed.split(/\n{2,}/);
  return paragraphs
    .map((paragraph) => {
      const lines = paragraph
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      if (lines.length === 0) return "";
      const last = lines[lines.length - 1]!;
      if (last.endsWith("?") && last.length < 160) {
        const body = lines.slice(0, -1);
        const question = `**${last}**`;
        return body.length > 0 ? `${body.join("\n")}\n\n${question}` : question;
      }
      return lines.join("\n");
    })
    .filter(Boolean)
    .join("\n\n");
}

/** Session title plus path text through the current node. */
export function buildPathExplanationMarkdown(input: {
  title: string;
  topic?: string;
  steps: PathTrailStep[];
  /** SAMPLE tape shown on this step, if any. */
  chart?: OHLC[];
}): string {
  const blocks: string[] = [`# ${input.title.trim()}`];
  const topic = input.topic?.trim();
  if (topic) blocks.push(`*${topic}*`);

  for (const step of input.steps) {
    const heading = `## ${step.index}.`;
    const body = nodeMessageToMarkdown(step.messagePreview);
    const chunk = [heading, "", body];
    if (step.choiceLabel) {
      chunk.push("", `*You chose: ${step.choiceLabel}*`);
    }
    blocks.push(chunk.join("\n"));
  }

  const chart = input.chart?.length ? ohlcMarkdownTable(input.chart) : "";
  if (chart) blocks.push(chart);

  return `${blocks.join("\n\n")}\n`;
}
