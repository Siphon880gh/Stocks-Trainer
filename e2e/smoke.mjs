/**
 * Lightweight interaction smoke test (not part of `npm run verify`: it needs a browser).
 *
 *   npm run test:e2e
 *
 * Starts its own Vite dev server on a free port (never 3001), drives headless Chrome through the
 * flows the 2026-10-22 interaction QA found bugs in and Weng's 2026-10-22 decisions (quiz pass mark,
 * case points, Today points, streak labels, challenge resume, glossary ⓘ beside choices), at 390 and 1280 px,
 * then stops the server. Answer keys come from the app's own modules via Vite's ssrLoadModule.
 * Needs `playwright-core`, which is not a project dependency: either `npm i --no-save playwright-core`
 * or point PLAYWRIGHT_CORE at an installed copy (e.g. /tmp/pw/node_modules/playwright-core/index.js),
 * plus a Chrome binary (CHROME_PATH, default: the macOS Google Chrome app).
 */
import { createServer } from "vite";

let chromium;
try {
  const mod = await import(process.env.PLAYWRIGHT_CORE ?? "playwright-core");
  ({ chromium } = mod.default ?? mod);
} catch {
  console.error("test:e2e needs playwright-core: run `npm i --no-save playwright-core` or set PLAYWRIGHT_CORE (and CHROME_PATH if Chrome is not in /Applications).");
  process.exit(2);
}
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const server = await createServer({ server: { port: 3190, strictPort: false, host: "127.0.0.1" }, logLevel: "error" });
await server.listen();
const base = server.resolvedUrls.local[0].replace(/\/$/, "");
const load = (m) => server.ssrLoadModule(m);
const { getQuestionsForGroup } = await load("/src/lib/quizData.ts");
const { UNIT_QUIZ_ITEMS } = await load("/src/lib/academy/content/unitQuizzes.ts");
const { UNIT_ORDER } = await load("/src/lib/academy/content/levels.ts");
const { emptyAcademy, ACADEMY_KEY } = await load("/src/lib/academy/storage.ts");
const { oscQuestions } = await load("/src/lib/oscillatorLab.ts");
/** Optional: QA_SHOTS=<dir> saves a screenshot of the oscillators lab at each width (never committed). */
const SHOTS = process.env.QA_SHOTS;
const stored = (p, key) => p.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? "null"), key);
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const failures = [];
let checks = 0;
const check = (ok, msg) => {
  checks++;
  if (!ok) failures.push(msg);
};

async function page(width) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, isMobile: width < 600, hasTouch: width < 600 });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(String(e)));
  p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  return { p, ctx, errors };
}
const overflow = (p) => p.evaluate(() => document.documentElement.scrollWidth - innerWidth);

const flows = {
  async "route change starts at the top"(p) {
    await p.goto(base + "/training", { waitUntil: "networkidle" });
    await p.evaluate(() => scrollTo(0, 3000));
    await p.locator('a[href="/cases"]').first().click({ force: true });
    await p.waitForURL(/\/cases$/);
    await p.waitForTimeout(200);
    check((await p.evaluate(() => scrollY)) === 0, "/training → /cases kept the scroll offset");
  },
  async "Read the Print: score, bonus and next round"(p, w) {
    await p.goto(base + "/practice/read-the-print", { waitUntil: "networkidle" });
    const btn = (n) => p.getByRole("button", { name: n, exact: true });
    await btn("I've read it: make the call").click();
    await btn("A Gap up & hold").click(); // round 1's key is A
    await btn("Drift WITH the gap").click(); // and "with"
    check(/Session score\s*3/.test(await p.getByTestId("rtp-game").innerText()), `RTP round 1 should score 3 at ${w}`);
    await btn("Next round →").scrollIntoViewIfNeeded();
    await btn("Next round →").click();
    await p.waitForTimeout(150);
    const top = await p.getByTestId("rtp-game").evaluate((el) => el.getBoundingClientRect().top);
    check(top >= 0, `RTP next round opened scrolled past its top at ${w}`);
    check((await overflow(p)) <= 1, `RTP overflows at ${w}`);
  },
  async "Macro Desk: lock in, reveal, next round at the top"(p, w) {
    await p.goto(base + "/macro/play", { waitUntil: "networkidle" });
    const main = p.locator("main");
    await main.getByRole("button", { name: "Make my calls" }).click();
    const calls = main.getByRole("region", { name: "Your calls" });
    for (const row of await calls.locator("div.flex.flex-wrap").all()) await row.getByRole("button", { name: "Up" }).click();
    await main.getByRole("button", { name: "Lock in and reveal" }).click();
    check(/\d+ \/ \d+ calls right/.test(await main.getByRole("region", { name: "Result" }).innerText()), "macro result missing");
    await main.getByRole("button", { name: "Next round" }).click();
    await p.waitForTimeout(150);
    check((await p.evaluate(() => scrollY)) < 100, `macro next round kept the old scroll at ${w}`);
  },
  async "Options ladder: failed check offers Try again"(p) {
    await p.goto(base + "/academy/options", { waitUntil: "networkidle" });
    await p.getByTestId("ack-1").check();
    await p.getByTestId("start-check-1").click();
    for (const item of await p.locator('[data-testid="check-1"] [data-item]').all()) await item.locator("button").first().click();
    await p.getByTestId("submit-check-1").click();
    const passed = /Level 1 passed/.test(await p.getByTestId("check-result").innerText());
    check(passed || (await p.getByTestId("retry-check-1").count()) === 1, "options: no Try again after a failed check");
  },
  async "Test-out: failed result offers Try again"(p) {
    await p.goto(base + "/academy/test-out/L1", { waitUntil: "networkidle" });
    for (const item of await p.locator("[data-item]").all()) await item.locator("button").last().click();
    await p.getByTestId("submit-test-out").click();
    const passed = (await p.getByTestId("test-out-result").getAttribute("data-passed")) === "true";
    check(passed || (await p.getByTestId("test-out-retry").count()) === 1, "test-out: no Try again after a fail");
  },
  async "Paper: start, buy, step, reload keeps the session"(p, w) {
    await p.goto(base + "/paper", { waitUntil: "networkidle" });
    await p.getByTestId("paper-start").click();
    await p.getByTestId("ticket-qty").fill("10");
    await p.getByTestId("ticket-submit").click();
    await p.getByTestId("step-1").click();
    const eq = await p.locator('[data-stat="equity"]').innerText();
    await p.reload({ waitUntil: "networkidle" });
    check((await p.locator('[data-stat="equity"]').innerText()) === eq, `paper equity changed across reload at ${w}`);
    check((await p.locator('[data-testid="positions"] tr[data-symbol]').count()) === 1, "paper position missing after reload");
    check((await overflow(p)) <= 1, `paper overflows at ${w}`);
  },
  async "Quiz pass mark: below 70% stays incomplete, 70%+ completes"(p, w) {
    const qs = getQuestionsForGroup("equity-literacy");
    const runQuiz = async (right) => {
      await p.goto(base + "/training?group=equity-literacy&start=1", { waitUntil: "networkidle" });
      const dlg = p.locator("[role=dialog]");
      await dlg.waitFor({ timeout: 5000 });
      for (const q of qs) {
        const pick = right ? q.correctAnswer : q.options.find((o) => o.id !== q.correctAnswer).id;
        await dlg.locator("button", { hasText: new RegExp(`^Option ${pick}\\b`) }).click();
        await dlg.getByRole("button", { name: /Submit/ }).click();
        if (q === qs.at(-1)) {
          const line = await dlg.getByTestId("quiz-pass-line").innerText();
          check(right ? /Finish completes/.test(line) : /Score 70% to complete/.test(line), `quiz pass line @${w}: ${line}`);
        }
        await dlg.getByRole("button", { name: /Next question|Finish/ }).click();
      }
      return (await stored(p, "analysis_core_progress_v1")).milestones["E4.M1"];
    };
    const low = await runQuiz(false);
    check(low.status !== "complete" && low.score === 0 && low.attempts === 1, `0% quiz completed E4.M1 @${w}: ${JSON.stringify(low)}`);
    const high = await runQuiz(true);
    check(high.status === "complete" && high.attempts === 2, `100% quiz did not complete E4.M1 @${w}`);
    const again = await runQuiz(false);
    check(again.status === "complete", `a later low score revoked E4.M1 @${w}`);
  },
  async "Case points: paid once in the reveal, replay pays nothing"(p, w) {
    const play = async () => {
      await p.goto(base + "/cases/case-earn-beat-miss", { waitUntil: "networkidle" });
      const gate = p.getByRole("button", { name: "Open this case this session" });
      if (await gate.count()) await gate.click();
      await p.getByRole("button", { name: "BUY", exact: true }).click();
      await p.getByRole("button", { name: /Lock in and see what happened/ }).click();
      return p.getByTestId("case-points").innerText();
    };
    const first = await play();
    const pts = (await stored(p, "analysis_core_progress_v1")).scores.totalPoints;
    check(/^\+(10|5|1) pts · paid once per case/.test(first) && [10, 5, 1].includes(pts), `case first play @${w}: "${first}" total ${pts}`);
    const second = await play();
    check(/^Replay · no new points/.test(second), `case replay @${w}: "${second}"`);
    check((await stored(p, "analysis_core_progress_v1")).scores.totalPoints === pts, `case replay changed points @${w}`);
  },
  async "Today: a wrong answer gives +1 and counts the Day streak"(p, w) {
    const a = emptyAcademy();
    for (const id of UNIT_ORDER.slice(0, 3)) a.units[id] = { best: 3, total: 3, attempts: 1, lastAt: "2026-10-01T00:00:00.000Z", masteredAt: "2026-10-01T00:00:00.000Z" };
    await p.addInitScript(([k, v]) => localStorage.getItem(k) ?? localStorage.setItem(k, v), [ACADEMY_KEY, JSON.stringify(a)]);
    await p.goto(base + "/academy", { waitUntil: "networkidle" });
    const rv = p.getByTestId("today-review");
    const qid = await rv.getAttribute("data-question");
    const q = UNIT_QUIZ_ITEMS.find((x) => x.id === qid);
    const wrong = q.options.find((o) => o.id !== q.correctAnswer).id;
    await rv.locator(`button[data-option="${wrong}"]`).click();
    const flash = await p.getByTestId("today-flash").innerText();
    check(/^\+1 point for answering \(a correct answer earns \+5\)/.test(flash), `today wrong flash @${w}: ${flash}`);
    check(/^Day streak 1 day/.test(await p.getByTestId("today-streak").innerText()), `today Day streak label @${w}`);
    check(/Day streak 1 day/.test(await p.getByTestId("streak").innerText()), `hub rewards panel did not refresh after Today @${w}`);
    const ledger = (await stored(p, "analysis_core_academy_rewards_v1")).ledger;
    check(ledger.some((e) => e.source === "daily-goal" && e.points === 1), `today ledger @${w}`);
  },
  async "Streak labels: Answer streak in Learn, Day streak in the Academy"(p, w) {
    await p.goto(base + "/training", { waitUntil: "networkidle" });
    check((await p.getByTestId("answer-streak").first().innerText()).includes("Answer streak"), `Learn answer streak label @${w}`);
    await p.goto(base + "/academy", { waitUntil: "networkidle" });
    check(/Day streak/.test(await p.getByTestId("streak").innerText()), `Academy day streak label @${w}`);
    check(!/(^|[^y] )Streak \d/.test(await p.locator("main").innerText()), `bare "Streak n" left in the Academy @${w}`);
  },
  async "Challenge: a half-played run offers Resume / Restart after reload"(p, w) {
    await p.goto(base + "/paper/challenges/ride-the-trend", { waitUntil: "networkidle" });
    await p.getByTestId("ticket-type").selectOption("market");
    await p.getByTestId("ticket-qty").fill("50");
    await p.getByTestId("ticket-submit").click();
    await p.getByTestId("step-1").click();
    const bar = await p.getByTestId("bar-counter").innerText();
    await p.reload({ waitUntil: "networkidle" });
    check((await p.getByTestId("challenge-resume").count()) === 1, `no Resume prompt after reload @${w}`);
    await p.getByTestId("challenge-resume-go").click();
    check((await p.getByTestId("bar-counter").innerText()) === bar, `resume did not restore ${bar} @${w}`);
    await p.reload({ waitUntil: "networkidle" });
    await p.getByTestId("challenge-restart").click();
    check(!/Bar 1[2-9]/.test(await p.getByTestId("bar-counter").innerText()), `restart kept the old bar @${w}`);
    check(!(await stored(p, "analysis_core_academy_paper_v1")).challengeProgress["ride-the-trend"], `restart left saved progress @${w}`);
    // finishing clears it
    await p.getByTestId("ticket-type").selectOption("market");
    await p.getByTestId("ticket-qty").fill("50");
    await p.getByTestId("ticket-submit").click();
    for (let i = 0; i < 40 && !(await p.getByTestId("challenge-result").count()); i++) await p.getByTestId("step-5").click();
    const st = await stored(p, "analysis_core_academy_paper_v1");
    check(st.schemaVersion === 2 && !st.challengeProgress["ride-the-trend"], `finished run left saved progress @${w}`);
  },
  async "Glossary ⓘ: beside the choice; a tap on it opens the tip, a tap on the choice picks"(p, w) {
    await p.goto(base + "/coach/chart-soft-gate", { waitUntil: "networkidle" });
    const gate = p.getByRole("button", { name: "Browse this session" });
    if (await gate.count()) await gate.click();
    const row = p.locator('main [data-testid="with-glossary"]').first();
    for (let i = 0; i < 4 && !(await row.count()); i++) await p.getByRole("button", { name: /Continue$/ }).first().click();
    const info = row.locator('button[aria-label^="About "]').first();
    const box = await info.boundingBox();
    if (w < 600) check(box.width >= 44 && box.height >= 44, `ⓘ target ${box.width}x${box.height} @${w}`);
    check((await row.locator("button").first().locator('[aria-label^="About "]').count()) === 0, `ⓘ still inside the choice @${w}`);
    const mainText = () => p.evaluate(() => { const m = document.querySelector("main").cloneNode(true); m.querySelectorAll('[role="tooltip"]').forEach((t) => t.remove()); return m.innerText; });
    const before = await mainText();
    await info.click();
    check((await p.locator('[role="tooltip"]').count()) === 1, `ⓘ tap opened no tip @${w}`);
    check((await mainText()) === before, `ⓘ tap chose the answer @${w}`);
    await p.keyboard.press("Escape");
    await row.locator("button").first().click();
    check((await mainText()) !== before, `centre tap on the choice did nothing @${w}`);
  },
  async "Oscillators lab: volatility stop chart, computed key, Learn groups"(p, w) {
    await p.goto(base + "/practice/oscillators", { waitUntil: "networkidle" });
    check(/SIMULATED/.test(await p.locator("main").innerText()), `oscillators: no SIMULATED label @${w}`);
    await p.getByTestId("osc-tab-climb-then-gap").click();
    check((await p.locator('[data-testid="oscillator-chart"] [data-line="vstop"]').count()) === 1, `oscillators: no volatility stop line @${w}`);
    const q = oscQuestions().find((x) => x.id === "gap-flip");
    const card = p.locator(`[data-question="${q.id}"]`);
    const key = q.options.find((o) => o.id === q.correct);
    await card.locator("button", { hasText: key.label }).first().click();
    check(/^Right\./.test(await card.getByTestId("osc-feedback").innerText()), `oscillators: computed key not graded right @${w}`);
    check((await p.locator(`[data-testid="oscillator-chart"] [data-mark="${q.mark}"]`).count()) === 1, `oscillators: answer bar not marked @${w}`);
    if (w < 600) {
      const b = await card.getByRole("button").first().boundingBox();
      check(b.height >= 44, `oscillators: choice target ${b.height}px tall @${w}`);
    }
    check((await overflow(p)) <= 1, `oscillators overflow @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/oscillators-${w}.png`, fullPage: true });
    await p.goto(base + "/training?group=trading-risk", { waitUntil: "networkidle" });
    check(/Float, Short-Dated Options & Risk/.test(await p.locator("main").innerText()), `Learn: trading-risk group missing @${w}`);
  },
};


try {
  for (const w of [390, 1280]) {
    for (const [name, fn] of Object.entries(flows)) {
      const { p, ctx, errors } = await page(w);
      try {
        await fn(p, w);
      } catch (e) {
        failures.push(`${name} @${w}: ${String(e).split("\n")[0]}`);
      }
      check(errors.length === 0, `${name} @${w}: console/page error ${errors[0]}`);
      await ctx.close();
    }
  }
} finally {
  await browser.close();
  await server.close();
}
console.log(`e2e smoke: ${checks} checks, ${failures.length} failed`);
for (const f of failures) console.log("  ✗ " + f);
process.exit(failures.length ? 1 : 0);
