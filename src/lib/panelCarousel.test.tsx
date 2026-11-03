import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryRouter } from "react-router-dom";
import PanelCarousel, { TocGroup } from "../components/PanelCarousel.tsx";
import { renderHtml } from "./macro/renderHarness.ts";

describe("Table of Contents carousel", () => {
  it("shows one group and opens the group named in the address", () => {
    const html = renderHtml(
      <MemoryRouter initialEntries={["/training#practice"]}>
        <PanelCarousel>
          <TocGroup id="academy" label="Academy"><p>Academy panel</p></TocGroup>
          <TocGroup id="practice" label="Practice"><p>Practice panel</p></TocGroup>
          <TocGroup id="deep-study" label="Deep Study" aliases={["cases"]}><p>Cases panel</p></TocGroup>
        </PanelCarousel>
      </MemoryRouter>,
    );
    assert.match(html, /Table of Contents|data-testid="toc-carousel"/);
    assert.match(html, /data-active="practice"/);
    assert.match(html, /aria-label="Previous group"/);
    assert.match(html, /aria-label="Next group"/);
    assert.match(html, /aria-label="Practice"/);
    assert.match(html, /id="academy" hidden/);
    assert.doesNotMatch(html, /id="practice" hidden/);
  });

  it("opens a group from a panel inside it", () => {
    const html = renderHtml(
      <MemoryRouter initialEntries={["/training#cases"]}>
        <PanelCarousel>
          <TocGroup id="academy" label="Academy"><p>Academy panel</p></TocGroup>
          <TocGroup id="deep-study" label="Deep Study" aliases={["cases"]}><p id="cases">Cases panel</p></TocGroup>
        </PanelCarousel>
      </MemoryRouter>,
    );
    assert.match(html, /data-active="deep-study"/);
    assert.match(html, /id="academy" hidden/);
  });
});
