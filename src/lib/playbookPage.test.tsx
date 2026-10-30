import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Playbook from "../pages/Playbook.tsx";
import Playbooks from "../pages/Playbooks.tsx";
import { hrefs, renderHtml, renderText } from "./macro/renderHarness.ts";
import { PLAYBOOKS } from "./playbooks.ts";

function page(id: string) {
  return (
    <MemoryRouter initialEntries={[`/playbooks/${id}`]}>
      <Routes>
        <Route path="/playbooks/:id" element={<Playbook />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Playbook page", () => {
  for (const p of PLAYBOOKS) {
    it(`${p.id}: resource link sits above the four panels and every panel is wired`, () => {
      const html = renderHtml(page(p.id));
      const resource = html.indexOf(`href="${p.source.url.replace(/&/g, "&amp;")}"`);
      const firstPanel = html.indexOf("<details");
      assert.ok(resource > 0, "resource link present");
      assert.ok(firstPanel > resource, "resource link is above the panels");
      const links = hrefs(html);
      assert.ok(links.includes(`/coach/${p.coachSlug}`), "coaching link");
      assert.ok(links.includes(`/cases/${p.caseId}`), "case link");
      const text = renderText(page(p.id));
      assert.doesNotMatch(text, /No coaching session wired yet|No case wired yet/);
      if (p.source.kind === "webpage") assert.match(text, /public page — not advice/);
      else assert.match(text, /not their paid course/);
      for (const l of p.related ?? []) assert.ok(links.includes(l.to.replace(/&/g, "&amp;")) || links.includes(l.to), `related link ${l.to}`);
    });
  }

  for (const p of PLAYBOOKS.filter((x) => x.video)) {
    it(`${p.id}: lazy 16:9 video embed sits between the resource link and the panels, with the creator credited`, () => {
      const v = p.video!;
      const html = renderHtml(page(p.id));
      const iframe = html.match(/<iframe[^>]*>/)?.[0] ?? "";
      assert.ok(iframe, "iframe rendered");
      assert.match(iframe, new RegExp(`src="${v.embedUrl}"`));
      assert.match(iframe, /loading="lazy"/);
      assert.match(iframe, /allowfullscreen/i);
      assert.match(iframe, new RegExp(`title="${v.title}[^"]*${v.creator}`));
      assert.match(html, /aspect-video/);
      const at = html.indexOf("<iframe");
      assert.ok(html.indexOf(`href="${p.source.url}"`) < at, "source credit stays above the player");
      assert.ok(at < html.indexOf("<details"), "player sits above the panels");
      const text = renderText(page(p.id));
      assert.ok(text.includes(`Video: ${v.title} by ${v.creator}`), "credit line");
      const links = hrefs(html);
      assert.ok(links.includes(v.watchUrl), "credit links the video");
      if (v.channelUrl) assert.ok(links.includes(v.channelUrl), "credit links the channel");
    });
  }

  for (const p of PLAYBOOKS.filter((x) => x.credibility)) {
    it(`${p.id}: credibility panel follows Strategy and links every source`, () => {
      const c = p.credibility!;
      const html = renderHtml(page(p.id));
      const strategy = html.indexOf(">Strategy<");
      const cred = html.indexOf(`>${c.title}<`);
      const coaching = html.indexOf(">Coaching<");
      assert.ok(strategy > 0 && strategy < cred && cred < coaching, "panel order: Strategy, credibility, Coaching");
      const text = renderText(page(p.id));
      for (const para of c.summary) assert.ok(text.includes(para), para.slice(0, 40));
      for (const s of c.sources) {
        assert.ok(text.includes(s.label), s.label);
        if (s.role === "corroborates") assert.ok(text.includes(s.supports) && text.includes(s.note), s.url);
      }
      if (c.sources.some((s) => s.role === "presents")) assert.match(text, /present it rather than evaluate it/);
      const links = hrefs(html);
      for (const s of c.sources) assert.ok(links.includes(s.url), s.url);
    });
  }

  it("kits without a video render no iframe", () => {
    for (const p of PLAYBOOKS.filter((x) => !x.video)) assert.doesNotMatch(renderHtml(page(p.id)), /<iframe/, p.id);
  });

  it("the list links every kit", () => {
    const html = renderHtml(
      <MemoryRouter initialEntries={["/playbooks"]}>
        <Playbooks />
      </MemoryRouter>,
    );
    const links = hrefs(html);
    for (const p of PLAYBOOKS) assert.ok(links.includes(`/playbooks/${p.id}`), p.id);
  });
});
