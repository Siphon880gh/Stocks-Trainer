/** Test-only helpers: render a React element to static HTML and assert on visible text. */
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

export function renderHtml(el: ReactElement): string {
  return renderToStaticMarkup(el);
}

/** Visible text with tags stripped and entities decoded (enough for number assertions). */
export function renderText(el: ReactElement): string {
  return renderHtml(el)
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ");
}

export const hrefs = (html: string) => [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]!);
