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
    });
  }

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
