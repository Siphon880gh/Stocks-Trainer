import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getCaseStudy } from "./caseStudies.ts";
import { loadSession } from "./coaching/index.ts";
import { getOverlay } from "./overlays.ts";
import { classifySourceUrl } from "./playbookPrompt.ts";
import { PLAYBOOKS, getPlaybook, listPlaybooks } from "./playbooks.ts";
import { getSamplePack } from "./samplePacks.ts";

describe("playbooks registry", () => {
  it("ids are unique kebab-case and resolve through getPlaybook", () => {
    const ids = PLAYBOOKS.map((p) => p.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const id of ids) {
      assert.match(id, /^[a-z0-9]+(-[a-z0-9]+)*$/);
      assert.equal(getPlaybook(id)?.id, id);
    }
    assert.equal(listPlaybooks().length, PLAYBOOKS.length);
  });

  it("every source is a full https link whose kind matches the URL, never a YouTube channel", () => {
    for (const p of PLAYBOOKS) {
      assert.match(p.source.url, /^https:\/\//, p.id);
      assert.equal(classifySourceUrl(p.source.url), p.source.kind, p.id);
      assert.ok(p.source.label.trim().length > 0, `${p.id} label`);
      if (p.source.kind === "youtube") {
        assert.doesNotMatch(p.source.url, /\/(@|channel\/|c\/|user\/)/, `${p.id} is a channel link`);
      }
      if (p.source.verifiedOn) assert.match(p.source.verifiedOn, /^\d{4}-\d{2}-\d{2}$/, p.id);
    }
  });

  it("every kit fills all four panels with something that exists", () => {
    for (const p of PLAYBOOKS) {
      assert.ok(p.explanation.includes("SAMPLE"), `${p.id} explanation keeps SAMPLE honesty`);
      assert.ok(p.coachSlug, `${p.id} coachSlug`);
      const coach = loadSession(p.coachSlug!);
      assert.equal(coach.ok, true, `${p.id} coach ${p.coachSlug}`);
      assert.ok(p.caseId, `${p.id} caseId`);
      const study = getCaseStudy(p.caseId!);
      assert.ok(study, `${p.id} case ${p.caseId}`);
      assert.equal(study!.assetClass ?? "equity", p.assetClass, `${p.id} case asset class`);
      assert.ok(p.samplePackId, `${p.id} samplePackId`);
      const pack = getSamplePack(p.samplePackId!);
      assert.ok(pack, `${p.id} pack ${p.samplePackId}`);
      assert.equal(pack!.assetClass, p.assetClass, `${p.id} pack asset class`);
      for (const o of p.overlayIds ?? []) assert.ok(getOverlay(o), `${p.id} overlay ${o}`);
    }
  });

  it("video embeds use youtube-nocookie for the same video as the credited watch link", () => {
    const id = (u: string) => {
      const url = new URL(u);
      return url.hostname.endsWith("youtu.be") ? url.pathname.slice(1) : (url.searchParams.get("v") ?? url.pathname.split("/").pop());
    };
    for (const p of PLAYBOOKS.filter((x) => x.video)) {
      const v = p.video!;
      assert.match(v.embedUrl, /^https:\/\/www\.youtube-nocookie\.com\/embed\/[\w-]{11}$/, p.id);
      assert.equal(classifySourceUrl(v.watchUrl), "youtube", p.id);
      assert.equal(id(v.embedUrl), id(v.watchUrl), `${p.id} embed and watch link are the same video`);
      assert.ok(v.title.trim() && v.creator.trim(), p.id);
      if (v.channelUrl) assert.match(v.channelUrl, /^https:\/\/www\.youtube\.com\/(@[\w.-]+|channel\/[\w-]+)$/, p.id);
    }
    assert.ok(getPlaybook("price-action-four-pillars")?.video, "four pillars kit embeds its video");
  });

  it("credibility notes: https webpages with a verification date, mapped to what they support", () => {
    for (const p of PLAYBOOKS.filter((x) => x.credibility)) {
      const c = p.credibility!;
      assert.ok(c.title.trim() && c.summary.length > 0, p.id);
      assert.equal(new Set(c.sources.map((s) => s.url)).size, c.sources.length, `${p.id} duplicate source`);
      for (const s of c.sources) {
        assert.match(s.url, /^https:\/\//, s.url);
        assert.equal(classifySourceUrl(s.url), "webpage", s.url);
        assert.match(s.verifiedOn, /^\d{4}-\d{2}-\d{2}$/, s.url);
        assert.ok(s.supports.trim() && s.label.trim() && s.note.trim(), s.url);
      }
      assert.ok(c.sources.some((s) => s.role === "corroborates"), `${p.id} needs at least one corroborating source`);
    }
    const fp = getPlaybook("price-action-four-pillars")!.credibility!;
    assert.match(fp.summary.join(" "), /own framing/);
    assert.match(fp.summary.join(" "), /no independent reviews or track record/);
    assert.match(fp.summary.join(" "), /no evidence that this particular version is profitable/);
    assert.match(fp.summary.join(" "), /Simple is not safe/);
    const backing = fp.sources.filter((s) => s.role === "corroborates").map((s) => s.supports).join(" | ");
    for (const pillar of ["1 · Map", "2 · Confirmation", "3 · Invalidation", "4 · Context"]) assert.ok(backing.includes(pillar), pillar);
    assert.deepEqual(
      fp.sources.filter((s) => s.role === "presents").map((s) => new URL(s.url).hostname),
      ["www.tradezella.com", "www.chartfanatics.com"],
    );
  });

  it("webpage kits researched from public sources carry a verification date", () => {
    for (const p of PLAYBOOKS.filter((x) => x.source.kind === "webpage")) {
      assert.ok(p.source.verifiedOn, `${p.id} needs source.verifiedOn`);
    }
  });
});
