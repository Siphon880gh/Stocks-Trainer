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

  it("webpage kits researched from public sources carry a verification date", () => {
    for (const p of PLAYBOOKS.filter((x) => x.source.kind === "webpage")) {
      assert.ok(p.source.verifiedOn, `${p.id} needs source.verifiedOn`);
    }
  });
});
