import { test } from "node:test";
import assert from "node:assert/strict";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MacroDesk from "../../pages/macro/MacroDesk";
import MacroLesson from "../../pages/macro/MacroLesson";
import MacroPlay from "../../pages/macro/MacroPlay";
import { MACRO_LESSONS } from "./lessons";
import { getMacroSource } from "./sources";
import { hrefs, renderHtml, renderText } from "./renderHarness";

const at = (path: string) => (
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/macro" element={<MacroDesk />} />
      <Route path="/macro/play" element={<MacroPlay />} />
      <Route path="/macro/:lessonId" element={<MacroLesson />} />
    </Routes>
  </MemoryRouter>
);

test("/macro hub lists every lesson and the play link", () => {
  const html = renderHtml(at("/macro"));
  for (const l of MACRO_LESSONS) assert.ok(html.includes(`data-lesson="${l.id}"`), l.id);
  assert.ok(hrefs(html).includes("/macro/play"));
});

test("every lesson page renders the real-source link first, then the SIMULATED look-alike", () => {
  for (const l of MACRO_LESSONS) {
    const html = renderHtml(at(`/macro/${l.id}`));
    const url = getMacroSource(l.sourceId)!.url;
    const iLink = html.indexOf(`href="${url}"`);
    const iSim = html.indexOf('data-simulated="true"');
    assert.ok(iLink >= 0, `${l.id} link`);
    assert.ok(iSim > iLink, `${l.id} order`);
    assert.ok(html.includes(`/training?group=${l.quizGroup}`), `${l.id} quiz link`);
    assert.doesNotMatch(html, /NaN|undefined/, l.id);
  }
});

test("unknown lesson shows a not-found card; /macro/play renders round 1", () => {
  assert.match(renderHtml(at("/macro/nope")), /data-not-found="true"/);
  assert.match(renderText(at("/macro/play")), /Round 1 of \d+/);
});
