import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import CasePointsLine from "../components/CasePointsLine";

test("case reveal shows the points paid, or that a replay pays nothing", () => {
  const first = renderToStaticMarkup(<CasePointsLine award={{ pointsAwarded: 5, replay: false, firstPoints: 5 }} />);
  assert.match(first, /\+5 pts · paid once per case/);
  const replay = renderToStaticMarkup(<CasePointsLine award={{ pointsAwarded: 0, replay: true, firstPoints: 10 }} />);
  assert.match(replay, /Replay · no new points \(this case paid \+10 pts the first time\)/);
});
