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
const { haQuestions } = await load("/src/lib/heikinAshiLab.ts");
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
  async "Japanese candles: core list toggle, three-tab detail, Heikin-Ashi lab"(p, w) {
    await p.goto(base + "/practice/japanese-candles", { waitUntil: "networkidle" });
    check(/battle between buyers and sellers/.test(await p.locator("main").innerText()), `candles: no framing lesson @${w}`);
    await p.getByTestId("core-side-bearish").click();
    check((await p.locator('[data-testid^="core-row-"]').count()) === 7, `candles: bearish list is not 7 rows @${w}`);
    await p.getByTestId("core-row-evening-star").click();
    check((await p.getByTestId("pattern-illustration").count()) === 1, `candles: no illustration @${w}`);
    await p.getByTestId("pattern-tab-trade").click();
    const panel = await p.getByTestId("pattern-tabpanel").innerText();
    check(/Stop \(invalidation\)/.test(panel) && /Not a guarantee/.test(panel), `candles: trade tab incomplete @${w}`);
    if (w < 600) {
      const b = await p.getByTestId("pattern-tab-psychology").boundingBox();
      check(b.height >= 44, `candles: tab ${b.height}px tall @${w}`);
    }
    check((await overflow(p)) <= 1, `candles overflow @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/japanese-candles-${w}.png`, fullPage: false });
    await p.keyboard.press("Escape");
    await p.goto(base + "/practice/heikin-ashi", { waitUntil: "networkidle" });
    check((await p.getByTestId("ha-chart-regular").count()) === 1 && (await p.getByTestId("ha-chart-ha").count()) === 1, `HA: side by side missing @${w}`);
    await p.getByTestId("ha-view-ha").click();
    check((await p.getByTestId("ha-chart-regular").count()) === 0, `HA: view toggle failed @${w}`);
    const q = haQuestions().find((x) => x.id === "ha-calc-close");
    const card = p.locator(`[data-question="${q.id}"]`);
    await card.locator("button", { hasText: q.options.find((o) => o.id === q.correct).label }).first().click();
    check(/^Right\./.test(await card.getByTestId("ha-feedback").innerText()), `HA: computed key not graded right @${w}`);
    check((await overflow(p)) <= 1, `HA overflow @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/heikin-ashi-${w}.png`, fullPage: true });
  },

  async "Chart patterns: Archive deep link, volume pane, three tabs, Learn group"(p, w) {
    await p.goto(base + "/archive?tab=patterns&open=cup-and-handle", { waitUntil: "networkidle" });
    const ill = p.getByTestId("pattern-illustration");
    check((await ill.count()) === 1, `chart patterns: no illustration @${w}`);
    check((await ill.locator('[aria-label="Volume"]').count()) >= 1, `chart patterns: no volume pane @${w}`);
    await p.getByTestId("pattern-tab-trade").click();
    const panel = await p.getByTestId("pattern-tabpanel").innerText();
    check(/handle/i.test(panel) && /Stop \(invalidation\)/.test(panel), `chart patterns: trade tab incomplete @${w}`);
    check(!/general guide/i.test(panel), `chart patterns: fell back to the general guide @${w}`);
    check((await overflow(p)) <= 1, `chart patterns overflow @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/chart-patterns-${w}.png`, fullPage: false });
    await p.keyboard.press("Escape");
    await p.goto(base + "/training?group=chart-patterns", { waitUntil: "networkidle" });
    check(/Chart, Gap & Volume Patterns/.test(await p.locator("main").innerText()), `chart patterns: Learn group missing @${w}`);
  },

  async "Gamma squeeze case: enter, size, exit, reveal, stall counterfactual, points"(p, w) {
    await p.goto(base + "/practice/gamma-squeeze", { waitUntil: "networkidle" });
    check(/not always net short/.test(await p.getByTestId("sqz-tldr").innerText()), `squeeze: TL;DR missing @${w}`);
    check((await p.getByTestId("sqz-reveal").count()) === 0, `squeeze: reveal shown before the decisions @${w}`);
    for (const [step, choice] of [["enter", "plan"], ["size", "small"], ["exit", "sell"]]) {
      await p.getByTestId(`sqz-step-${step}`).locator(`[data-choice="${choice}"]`).click();
    }
    const grade = await p.getByTestId("sqz-grade").innerText();
    check(/Sound process/.test(grade) && /30 \/ 30/.test(grade) && /\+10 progress points/.test(grade), `squeeze: grade/points wrong (${grade}) @${w}`);
    const reveal = await p.getByTestId("sqz-reveal").innerText();
    check(/25 contracts/.test(reveal) && /\$5,075/.test(reveal), `squeeze: reveal numbers wrong @${w}`);
    check(/whole \$200 is gone/.test(await p.getByTestId("sqz-stall").innerText()), `squeeze: stall panel missing @${w}`);
    check((await p.getByTestId("sqz-stall-chart").count()) === 1, `squeeze: stall value chart missing @${w}`);
    const progress = await stored(p, "analysis_core_progress_v1");
    check(!!progress && JSON.stringify(progress).includes("gamma-squeeze"), `squeeze: case result not saved @${w}`);
    check((await overflow(p)) <= 1, `squeeze overflow @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/gamma-squeeze-${w}.png`, fullPage: true });
    await p.goto(base + "/training?group=squeezes", { waitUntil: "networkidle" });
    check(/Squeezes, Options Flow & Survivorship/.test(await p.locator("main").innerText()), `squeeze: Learn group missing @${w}`);
    await p.goto(base + "/coach/chasing-a-squeeze", { waitUntil: "networkidle" });
    const sqGate = p.getByRole("button", { name: "Browse this session" });
    if (await sqGate.count()) await sqGate.click();
    check(/Chasing a squeeze/.test(await p.locator("body").innerText()), `squeeze: coach session missing @${w}`);
  },

  async "News & biases: lesson, news-day checkpoints, optional bias check on the paper ticket"(p, w) {
    await p.goto(base + "/practice/news-biases", { waitUntil: "networkidle" });
    check((await p.locator("[data-bias]").count()) === 6, `news: six bias cards missing @${w}`);
    check(/LEAPS/.test(await p.getByTestId("nb-horizon").innerText()), `news: horizon table missing @${w}`);
    for (const step of await p.locator("[data-step]").all()) await step.locator('[data-pick="good"]').click();
    check(/3 \/ 3/.test(await p.getByTestId("nb-day-score").innerText()), `news: checkpoints not graded @${w}`);
    check((await overflow(p)) <= 1, `news overflow @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/news-biases-${w}.png`, fullPage: true });
    await p.goto(base + "/paper", { waitUntil: "networkidle" });
    await p.getByTestId("paper-start").click();
    check((await p.getByTestId("bias-check-list").count()) === 0, `news: bias check should be off by default @${w}`);
    await p.getByTestId("ticket-qty").fill("10");
    await p.getByTestId("bias-check-toggle").check();
    check(await p.getByTestId("ticket-submit").isDisabled(), `news: bias check did not hold the order @${w}`);
    for (const box of await p.locator("[data-bias-item]").all()) await box.check();
    check(await p.getByTestId("ticket-submit").isEnabled(), `news: bias check did not release the order @${w}`);
    if (SHOTS) await p.getByTestId("order-ticket").screenshot({ path: `${SHOTS}/news-bias-ticket-${w}.png` });
    await p.goto(base + "/coach/news-day-decision", { waitUntil: "networkidle" });
    const nbGate = p.getByRole("button", { name: "Browse this session" });
    if (await nbGate.count()) await nbGate.click();
    check(/A news-day decision/.test(await p.locator("body").innerText()), `news: coach session missing @${w}`);
  },

  async "Algo trading: broker APIs, PDT replacement, ATR sizing, news-day playbook"(p, w) {
    await p.goto(base + "/practice/algo-trading", { waitUntil: "networkidle" });
    check((await p.locator("[data-broker]").count()) === 9, `algo: broker table rows wrong @${w}`);
    check(/No public stock-trading API/.test(await p.getByTestId("algo-brokers").innerText()), `algo: Robinhood row missing @${w}`);
    const pdt = await p.getByTestId("algo-pdt").innerText();
    check(/June 4, 2026/.test(pdt) && /October 20, 2027/.test(pdt) && /\$2,000/.test(pdt), `algo: PDT panel wrong @${w}`);
    check(/→ 33 shares/.test(await p.getByTestId("atr-result").innerText()), `algo: ATR default should be 33 shares @${w}`);
    await p.getByTestId("atr-mult").fill("1.5");
    check(/→ 66 shares/.test(await p.getByTestId("atr-result").innerText()), `algo: ATR recompute wrong @${w}`);
    for (const box of await p.locator("[data-playbook-item]").all()) await box.check();
    const done = await stored(p, "analysis_core_misc_practices_done_v1");
    check(!!done && JSON.stringify(done).includes("algo-trading"), `algo: practice not marked done @${w}`);
    check((await overflow(p)) <= 1, `algo overflow @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/algo-trading-${w}.png`, fullPage: true });
    await p.goto(base + "/training?group=algo-trading", { waitUntil: "networkidle" });
    check(/Automated & Algo Trading/.test(await p.locator("main").innerText()), `algo: Learn group missing @${w}`);
  },

  async "Charting apps: 11-app table, spot the trap, Webull example screenshots + lightbox, broker learning"(p, w) {
    await p.goto(base + "/practice/charting-apps", { waitUntil: "networkidle" });
    check((await p.locator("[data-app]").count()) === 11, `charts: app table rows wrong @${w}`);
    for (const spot of await p.locator("[data-spot]").all()) await spot.locator("button").first().click();
    check(/\/ 3 correct/.test(await p.getByTestId("ca-spot-score").innerText()), `charts: spot-the-trap not graded @${w}`);
    const shots = p.locator("[data-shot] img");
    check((await shots.count()) === 2, `charts: Webull screenshots missing @${w}`);
    await p.getByTestId("ca-webull-shots").scrollIntoViewIfNeeded();
    for (const img of await shots.all()) {
      await img.evaluate((el) => el.loading = "eager");
      const ok = await img.evaluate((el) => el.complete ? el.naturalWidth > 0 : new Promise((r) => { el.onload = () => r(el.naturalWidth > 0); el.onerror = () => r(false); }));
      check(ok, `charts: screenshot did not load @${w}`);
      check(((await img.getAttribute("alt")) || "").length > 40, `charts: screenshot alt text missing @${w}`);
    }
    check(/Example Webull screenshots/.test(await p.getByTestId("ca-webull").innerText()), `charts: screenshot label missing @${w}`);
    if (SHOTS) await p.getByTestId("ca-webull").screenshot({ path: `${SHOTS}/charting-apps-webull-${w}.png` });
    await p.locator("[data-shot] button").first().click();
    check((await p.getByTestId("ca-lightbox").count()) === 1, `charts: lightbox did not open @${w}`);
    await p.keyboard.press("Escape");
    check((await p.getByTestId("ca-lightbox").count()) === 0, `charts: lightbox did not close @${w}`);
    check((await p.getByTestId("ca-learn").locator("a[href^='https://']").count()) >= 5, `charts: broker learning links missing @${w}`);
    const done = await stored(p, "analysis_core_misc_practices_done_v1");
    check(!!done && JSON.stringify(done).includes("charting-apps"), `charts: practice not marked done @${w}`);
    check((await overflow(p)) <= 1, `charts overflow @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/charting-apps-${w}.png`, fullPage: true });
    await p.goto(base + "/training?group=charting-apps", { waitUntil: "networkidle" });
    check(/Indicator & Charting Apps/.test(await p.locator("main").innerText()), `charts: Learn group missing @${w}`);
  },

  async "Crypto candles: why-lesson, harami takeaway, filter tags, Archive crypto chip"(p, w) {
    await p.goto(base + "/practice/crypto-candles", { waitUntil: "networkidle" });
    check(/24\/7/.test(await p.getByTestId("cc-why").innerText()), `crypto: why lesson missing @${w}`);
    const take = await p.getByTestId("cc-harami-takeaway").innerText();
    check(/A harami candle signals a potential trend reversal by showing market hesitation/.test(take), `crypto: harami takeaway wrong @${w}`);
    const before = await p.locator("[data-pattern]").count();
    check(before >= 80, `crypto: pattern list too small (${before}) @${w}`);
    await p.locator('[data-fit="rare"]').click();
    const rare = await p.locator("[data-pattern]").count();
    check(rare > 0 && rare < before, `crypto: rare filter wrong (${rare}/${before}) @${w}`);
    check((await p.locator('[data-crypto-fit="rare"]').count()) === rare, `crypto: rare tags mismatch @${w}`);
    check((await overflow(p)) <= 1, `crypto overflow @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/crypto-candles-${w}.png`, fullPage: true });
    await p.goto(base + "/archive?tab=patterns&crypto=works", { waitUntil: "networkidle" });
    check((await p.getByTestId("archive-crypto-works").count()) === 1, `crypto: Archive chip missing @${w}`);
    check((await p.locator("[data-crypto-fit='works']").count()) >= 10, `crypto: Archive works tags missing @${w}`);
    await p.goto(base + "/archive?tab=patterns&open=harami", { waitUntil: "networkidle" });
    check(/A harami candle signals a potential trend reversal/.test(await p.getByTestId("pattern-takeaway").innerText()), `crypto: Archive harami takeaway missing @${w}`);
    check(/works in crypto/i.test(await p.getByTestId("pattern-crypto-fit").innerText()), `crypto: modal crypto tag missing @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/crypto-harami-${w}.png`, fullPage: true });
    await p.goto(base + "/training?group=crypto-candles", { waitUntil: "networkidle" });
    check(/Candlesticks for Crypto/.test(await p.locator("main").innerText()), `crypto: Learn group missing @${w}`);
  },

  async "Reversal charts: gallery, rectangle distinction, confirmation drills"(p, w) {
    await p.goto(base + "/practice/reversal-charts", { waitUntil: "networkidle" });
    check((await p.locator("[data-rev]").count()) === 8, `rev: gallery missing @${w}`);
    check(/Triple bottom is not a rectangle/.test(await p.getByTestId("rev-rectangle").innerText()), `rev: rectangle panel missing @${w}`);
    await p.locator('[data-rev="head-shoulders"]').click();
    check(/neckline/i.test(await p.getByTestId("rev-detail").innerText()), `rev: H&S detail missing @${w}`);
    for (const drill of await p.locator("[data-drill]").all()) {
      const ans = await drill.locator("button").evaluateAll((btns) => {
        // click the correct-looking option by trying until graded — instead click each until result appears
        return btns.map((b) => b.textContent || "");
      });
      // click first option; if wrong, that's ok — we just need them graded
      await drill.locator("button").first().click();
    }
    check(/\/ 6 correct/.test(await p.getByTestId("rev-score").innerText()), `rev: drills not graded @${w}`);
    check((await overflow(p)) <= 1, `rev overflow @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/reversal-charts-${w}.png`, fullPage: true });
    await p.goto(base + "/archive?tab=patterns&open=double-bottom", { waitUntil: "networkidle" });
    await p.getByTestId("pattern-tab-trade").click();
    check(/neckline/i.test(await p.locator("[role=dialog]").innerText()), `rev: Archive tabs not deepened @${w}`);
    await p.goto(base + "/training?group=reversal-charts", { waitUntil: "networkidle" });
    check(/Reversal Chart Patterns/.test(await p.locator("main").innerText()), `rev: Learn group missing @${w}`);
  },

  async "One-minute charts: grouping, MES calculator, legs, fib settings"(p, w) {
    await p.goto(base + "/practice/one-minute-charts", { waitUntil: "networkidle" });
    check(/5 × 1-minute = 1 × 5-minute/.test(await p.getByTestId("om-grouping").innerText()), `om: grouping missing @${w}`);
    check(/\b78\b/.test(await p.getByTestId("om-grouping").innerText()), `om: 78 bars missing @${w}`);
    check(/\$1\.25/.test(await p.getByTestId("om-mes").innerText()), `om: MES tick missing @${w}`);
    await p.getByTestId("mes-ticks").fill("1");
    check(/costs ate the scalp/.test(await p.getByTestId("mes-net").innerText()), `om: 1-tick scalp should lose @${w}`);
    await p.getByTestId("mes-ticks").fill("3");
    check(/net \$/.test(await p.getByTestId("mes-net").innerText()), `om: 3-tick net missing @${w}`);
    check(/Reverse/.test(await p.getByTestId("om-fib").innerText()) && /Extend Lines Left\/Right/.test(await p.getByTestId("om-fib").innerText()), `om: Fib settings missing @${w}`);
    check(/Bar Count Normal 2/.test(await p.getByTestId("om-barcount").innerText()), `om: bar count name missing @${w}`);
    for (const leg of await p.locator("[data-leg] button").all()) await leg.click();
    const done = await stored(p, "analysis_core_misc_practices_done_v1");
    check(!!done && JSON.stringify(done).includes("one-minute-charts"), `om: practice not marked done @${w}`);
    check((await overflow(p)) <= 1, `om overflow @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/one-minute-charts-${w}.png`, fullPage: true });
    await p.goto(base + "/training?group=one-minute-charts", { waitUntil: "networkidle" });
    check(/Reading 1-Minute Charts/.test(await p.locator("main").innerText()), `om: Learn group missing @${w}`);
  },

  async "Fib decision map: levels, R:R, plan drill"(p, w) {
    await p.goto(base + "/practice/fib-decision-map", { waitUntil: "networkidle" });
    check(/5050/.test(await p.getByTestId("fib-chart").innerText()) && /5000/.test(await p.getByTestId("fib-chart").innerText()), `fib: swing missing @${w}`);
    check(/61\.8%/.test(await p.getByTestId("fib-levels").innerText()), `fib: 61.8 level missing @${w}`);
    check(/Reverse/.test(await p.getByTestId("fib-caution").innerText()), `fib: Reverse refresher missing @${w}`);
    await p.getByTestId("fib-entry").fill("5025");
    await p.getByTestId("fib-stop").fill("4995");
    await p.getByTestId("fib-target").fill("5085");
    check(/R:R ≈ 2/.test(await p.getByTestId("fib-rr-out").innerText()), `fib: R:R 2 missing @${w}`);
    await p.locator("[data-choice=b]").click();
    check(/Coherent plan/.test(await p.getByTestId("fib-drill-feedback").innerText()), `fib: correct plan feedback missing @${w}`);
    const done = await stored(p, "analysis_core_misc_practices_done_v1");
    check(!!done && JSON.stringify(done).includes("fib-decision-map"), `fib: practice not marked done @${w}`);
    check((await overflow(p)) <= 1, `fib overflow @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/fib-decision-map-${w}.png`, fullPage: true });
    await p.goto(base + "/training?group=fib-decision-map", { waitUntil: "networkidle" });
    check(/Fibonacci Decision Map/.test(await p.locator("main").innerText()), `fib: Learn group missing @${w}`);
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
