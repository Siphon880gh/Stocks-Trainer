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
/** Optional: E2E_ONLY=<substring> runs only flows whose name contains it. */
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
// Mobile emulation widens innerWidth to the content, so measure against the visual viewport.
const overflow = (p) => p.evaluate(() => document.documentElement.scrollWidth - (window.visualViewport?.width ?? innerWidth));
/**
 * Text under WCAG AA on the page: every visible text node is composited over its real (possibly translucent)
 * background chain and checked at 4.5:1 (3:1 for large text). Chart SVG labels, the AI helper, disabled controls
 * and faded (opacity < 0.75) content are skipped. Returns "ratio colour-on-background 'text'" strings.
 */
const contrastFailures = (p) =>
  p.evaluate(() => {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 1;
    const cx = cv.getContext("2d", { willReadFrequently: true });
    const alphaOf = (c) => {
      const m = c.match(/\/\s*([\d.]+%?)\s*\)|rgba\([^)]*,\s*([\d.]+)\)/);
      if (!m) return 1;
      const v = m[1] ?? m[2];
      return v.endsWith("%") ? parseFloat(v) / 100 : +v;
    };
    const paint = (layers) => {
      cx.fillStyle = "#fff";
      cx.fillRect(0, 0, 1, 1);
      for (const c of layers) {
        cx.fillStyle = c;
        cx.fillRect(0, 0, 1, 1);
      }
      const d = cx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2]];
    };
    const lum = ([r, g, b]) => {
      const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const bgLayers = (el) => {
      const layers = [];
      for (let e = el; e; e = e.parentElement) {
        const c = getComputedStyle(e).backgroundColor;
        const a = c && c !== "transparent" ? alphaOf(c) : 0;
        if (a === 0) continue;
        layers.unshift(c);
        if (a >= 0.99) break;
      }
      return layers;
    };
    const faded = (el) => {
      let o = 1;
      for (let e = el; e; e = e.parentElement) o *= +getComputedStyle(e).opacity;
      return o < 0.75;
    };
    const out = new Map();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const t = walker.currentNode;
      const text = t.textContent.trim();
      if (!text) continue;
      const el = t.parentElement;
      if (!el || el.closest("svg,.hai-float,[data-harness],[hidden],[aria-hidden=true],button[disabled],[aria-disabled=true],input[disabled],select[disabled]")) continue;
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2 || s.visibility === "hidden" || s.display === "none" || faded(el)) continue;
      const layers = bgLayers(el);
      const bg = paint(layers);
      const fg = paint([...layers, s.color]);
      const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
      const ratio = (a + 0.05) / (b + 0.05);
      const fs = parseFloat(s.fontSize);
      const need = fs >= 24 || (fs >= 18.66 && +s.fontWeight >= 700) ? 3 : 4.5;
      if (ratio < need - 0.01) out.set(`${s.color}|${layers.at(-1) ?? "none"}`, `${ratio.toFixed(2)} ${s.color} on ${layers.at(-1) ?? "page"} '${text.slice(0, 40)}'`);
    }
    return [...out.values()];
  });
const CONTRAST_PAGES = ["/", "/browse", "/training", "/academy", "/practice/levels", "/paper/desk", "/archive", "/map", "/cases", "/coach", "/macro", "/playbooks"];

const flows = {
  async "ORB context deep links: Learn questions, glossary and sourced playbook"(p, w) {
    const qs = getQuestionsForGroup("opening-range");
    const { withoutSampleWord } = await load("/src/lib/learnerCopy.ts");
    await p.goto(base + "/training?group=opening-range&start=1", { waitUntil: "networkidle" });
    const dlg = p.getByRole("dialog");
    await dlg.waitFor();
    const modalCopy = () => dlg.evaluate(el => {
      const copy = el.cloneNode(true);
      copy.querySelectorAll('button, [role="tooltip"]').forEach(n => n.remove());
      return copy.textContent.replace(/\s+/g, " ");
    });
    for (const q of qs) {
      check((await modalCopy()).includes(withoutSampleWord(q.prompt)), `ORB quiz prompt ${q.id} at ${w}`);
      await dlg.locator("button", { hasText: new RegExp(`^Option ${q.correctAnswer}\\b`) }).click();
      await dlg.getByRole("button", { name: /Submit/ }).click();
      check((await modalCopy()).includes(withoutSampleWord(q.explanation)), `ORB quiz explanation ${q.id} at ${w}`);
      await dlg.getByRole("button", { name: /Next question|Finish/ }).click();
    }
    await p.goto(base + "/archive?tab=literacy&open=orb-failed-break", { waitUntil: "networkidle" });
    check((await p.locator("body").innerText()).includes("Even a close outside can fail"), "ORB failed-break glossary deep-opens");
    await p.goto(base + "/playbooks/orb-context-confirmation", { waitUntil: "domcontentloaded" });
    await p.getByRole("heading", { name: "Opening range: context and confirmation", exact: true }).waitFor();
    check(await p.locator('iframe[src="https://www.youtube-nocookie.com/embed/UI-N7X15bFo"]').count() === 1, "ORB credits supplied video");
    check(await p.locator('a[href="/practice/opening-range#context"]').count() >= 1, "ORB playbook links to interactive context");
  },
  async "ORB context: completed windows, narrative exit, failed breaks and risk"(p, w) {
    await p.goto(base + "/practice/opening-range", { waitUntil: "networkidle" });
    const lab = p.getByTestId("orb-context");
    const status = p.getByTestId("orb-range-status");
    const next = lab.getByRole("button", { name: "Next candle", exact: true });
    check((await status.innerText()).includes("incomplete"), `ORB initial range incomplete at ${w}`);
    check(await lab.locator("[data-context-answer]").first().isDisabled(), "ORB cannot answer before decision");
    check(await lab.getByTestId("orb-context-result").count() === 0, "ORB future/result hidden before answer");
    await next.click();
    check((await status.innerText()).includes("99.00–102.00"), "ORB first three candles freeze 15m range");
    await lab.getByLabel("Opening window").selectOption("30");
    check((await status.innerText()).includes("incomplete"), "ORB does not leak eventual 30m range");
    await lab.getByRole("button", { name: "Walk me through the retest" }).click();
    check(await p.getByTestId("tour-popover").isVisible(), "ORB narrative opens");
    check(await p.getByTestId("tour-popover").evaluate(el => Number(getComputedStyle(el).zIndex) >= 1002), "ORB popover above charts");
    await p.getByTestId("tour-next").click();
    check((await status.innerText()).includes("99.00–102.00"), "ORB narrative advances chart frame");
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/orb-narrative-${w}.png` });
    await p.getByTestId("tour-prev").click();
    check((await status.innerText()).includes("incomplete"), "ORB narrative Prev rewinds chart frame");
    await p.getByTestId("tour-exit").click();
    check(await p.getByTestId("tour-backdrop").count() === 0, "ORB exit removes backdrop");
    await next.click();
    check((await status.innerText()).includes("99.00–102.00"), "ORB chart controls usable after exit");
    const { ORB_CONTEXT_CASES } = await load("/src/lib/orbConfirmation.ts");
    for (let i = 0; i < ORB_CONTEXT_CASES.length; i++) {
      await lab.getByLabel("ORB context scenario").selectOption(String(i));
      while (!(await next.isDisabled())) await next.click();
      check((await status.innerText()).includes("99.00–102.00"), `ORB frozen range at decision ${i}`);
      check(await lab.getByTestId("orb-context-result").count() === 0, `ORB answer hidden for case ${i}`);
      await lab.locator(`[data-context-answer="${ORB_CONTEXT_CASES[i].answer}"]`).click();
      check((await lab.getByTestId("orb-context-result").innerText()).includes("Correct reading"), `ORB correct evidence case ${i}`);
      check(await lab.locator("[data-context-answer]").first().isDisabled(), "ORB answer locks");
      await lab.getByLabel("ORB risk budget").fill("0");
      check((await lab.getByTestId("orb-risk-result").innerText()).includes("positive finite"), "ORB rejects zero budget");
      await lab.getByLabel("ORB risk budget").fill("100");
      check((await lab.getByTestId("orb-risk-result").innerText()).includes("shares"), "ORB recalculates valid sizing");
      while (!(await next.isDisabled())) await next.click();
      check((await lab.getByTestId("orb-context-result").innerText()).includes(ORB_CONTEXT_CASES[i].outcome), "ORB reveals authored aftermath");
      if (SHOTS && i === 0) { await lab.scrollIntoViewIfNeeded(); await p.screenshot({ path: `${SHOTS}/orb-reveal-${w}.png`, fullPage: false }); }
    }
    check((await lab.getByTestId("orb-context-score").innerText()).includes("3 / 3 answered · 3 correct"), "ORB context score");
    const done = () => stored(p, "analysis_core_misc_practices_done_v1");
    check(!(await done() ?? []).includes("opening-range"), "ORB not complete before legacy drills");
    for (const row of await p.locator("[data-drill]").all()) await row.getByRole("button").first().click();
    check((await done() ?? []).includes("opening-range"), "ORB complete after both practice sections");
    check((await overflow(p)) <= 1, `ORB no horizontal overflow at ${w}`);
  },
  async "route change starts at the top"(p) {
    // The Table of Contents shows one group at a time; Deep Study is tall and holds the Cases link.
    await p.goto(base + "/training#deep-study", { waitUntil: "networkidle" });
    await p.evaluate(() => scrollTo(0, 3000));
    check((await p.evaluate(() => scrollY)) > 0, "/training#deep-study did not scroll before the route change");
    await p.locator('[data-toc-group="deep-study"] a[href="/cases"]').first().click();
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
  async "Paper desk: replay clock, sized bracket, executions on the chart, news and filings unlock on their date"(p, w) {
    await p.goto(base + "/paper/desk", { waitUntil: "networkidle" });
    await p.getByTestId("desk-start").click();
    const clock = () => p.getByTestId("desk-clock").innerText();
    check((await clock()).includes("Jan 17, 2024"), `desk: starts on Jan 17, 2024 @${w}`);
    const newsIds = () => p.locator("[data-news-id]").evaluateAll((els) => els.map((e) => e.getAttribute("data-news-id")));
    const newsDate = (id) => id.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? "";
    check((await newsIds()).length > 0 && (await newsIds()).every((id) => newsDate(id) <= "2024-01-17"), `desk: no future news at the start @${w}`);
    await p.getByTestId("size-use").click();
    check((await p.getByTestId("ticket-qty").inputValue()) === (await p.getByTestId("size-result").getAttribute("data-qty")), `desk: sizing fills the ticket @${w}`);
    await p.getByTestId("ticket-submit").click();
    await p.getByTestId("desk-step-1").click();
    check((await p.getByTestId("desk-chart").getAttribute("data-executions")) === "1", `desk: fill marker on the chart @${w}`);
    check((await p.locator('[data-testid="positions"] tr[data-symbol="AAPL"]').count()) === 1, `desk: AAPL position @${w}`);
    await p.getByTestId("desk-tab-orders").click();
    check((await p.locator('[data-testid="open-orders"] [data-order]').count()) === 2, `desk: bracket exits working @${w}`);
    await p.getByTestId("desk-watchlist").locator('[data-symbol="MSFT"]').click();
    check((await p.getByTestId("desk-session").getAttribute("data-active")) === "MSFT", `desk: watchlist switches symbol @${w}`);
    await p.getByTestId("desk-research-financials").click();
    check(Number(await p.getByTestId("desk-financials").getAttribute("data-count")) >= 1, `desk: MSFT filing before the replay @${w}`);
    await p.getByTestId("desk-watchlist").locator('[data-symbol="AAPL"]').click();
    await p.getByTestId("desk-research-news").click();
    check(!(await newsIds()).includes("AAPL-2024-02-01-earnings"), `desk: Apple results hidden before Feb 1 @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/desk-before-${w}.png`, fullPage: true });
    for (let i = 0; i < 3; i++) await p.getByTestId("desk-step-5").click();
    check((await newsIds()).includes("AAPL-2024-02-01-earnings"), `desk: Apple results unlock after Feb 1 @${w}`);
    const at = await clock();
    await p.reload({ waitUntil: "networkidle" });
    check((await clock()) === at, `desk: clock restored on reload @${w}`);
    check((await overflow(p)) <= 1, `desk overflows at ${w}`);
    await p.getByTestId("desk-research-financials").click();
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/desk-after-${w}.png`, fullPage: true });
    await p.getByTestId("desk-reset").click();
    await p.getByTestId("desk-setup").waitFor();
    await p.locator('[data-scenario="sim-earnings-week"]').click();
    await p.getByTestId("desk-start").click();
    check((await p.getByTestId("desk-kind").innerText()).includes("SIMULATED"), `desk: simulated scenario labelled @${w}`);
  },
  async "Paper desk scenarios: grouped picker, guided tour on top then Exit, goals and the debrief at the end"(p, w) {
    await p.goto(base + "/paper/desk", { waitUntil: "networkidle" });
    if (await p.getByTestId("desk-reset").count()) await p.getByTestId("desk-reset").click();
    await p.getByTestId("desk-setup").waitFor();
    check((await p.locator("[data-topic]").count()) >= 11, `desk picker: topic groups @${w}`);
    check((await p.locator("[data-scenario]").count()) >= 30, `desk picker: 30 scenarios @${w}`);
    await p.locator('[data-topic-filter="corporate"]').click();
    check((await p.locator("[data-topic]").count()) === 1 && (await p.locator("[data-scenario]").count()) === 4, `desk picker: topic filter @${w}`);
    await p.locator('[data-scenario="sim-dividend"]').click();
    check((await p.getByTestId("desk-selected").innerText()).includes("ex-dividend"), `desk picker: selected lesson @${w}`);
    check((await overflow(p)) <= 1, `desk picker overflows at ${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/desk-picker-${w}.png`, fullPage: true });
    await p.getByTestId("desk-start").click();
    check((await p.getByTestId("desk-lesson").innerText()).includes("Lesson"), `desk: lesson strip @${w}`);
    await p.getByTestId("desk-tour").click();
    await p.getByTestId("tour-popover").waitFor();
    const z = await p.getByTestId("tour-popover").evaluate((el) => Number(getComputedStyle(el).zIndex));
    check(z >= 1000, `desk tour: popover on top (z ${z}) @${w}`);
    await p.getByTestId("tour-next").click();
    check((await p.getByTestId("tour-count").innerText()).includes("2"), `desk tour: steps @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/desk-tour-${w}.png` });
    await p.getByTestId("tour-exit").click();
    check((await p.getByTestId("tour-popover").count()) === 0 && (await p.getByTestId("tour-backdrop").count()) === 0, `desk tour: Exit removes it @${w}`);
    await p.getByTestId("ticket-qty").fill("100");
    await p.getByTestId("ticket-submit").click();
    await p.getByTestId("desk-step-1").click();
    check((await p.getByTestId("desk-chart").getAttribute("data-executions")) === "1", `desk: chart usable after the tour @${w}`);
    check((await p.locator('[data-testid="desk-goals"] [data-goal-status]').count()) >= 2, `desk: live goals @${w}`);
    for (let i = 0; i < 12 && !(await p.getByTestId("desk-debrief").count()); i++) await p.getByTestId("desk-step-5").click();
    await p.getByTestId("desk-debrief").waitFor();
    check((await p.getByTestId("debrief-signals").innerText()).includes("$2.40"), `desk debrief: signals @${w}`);
    check((await p.getByTestId("debrief-dividends").count()) === 1, `desk debrief: dividend received @${w}`);
    await p.getByTestId("debrief-note-0").fill("Held through the ex-date; price fell by the dividend.");
    await p.reload({ waitUntil: "networkidle" });
    check((await p.getByTestId("debrief-note-0").inputValue()).includes("ex-date"), `desk debrief: journal saved @${w}`);
    check((await overflow(p)) <= 1, `desk debrief overflows at ${w}`);
    if (SHOTS) await p.getByTestId("desk-debrief").screenshot({ path: `${SHOTS}/desk-debrief-${w}.png` });
    await p.getByTestId("desk-reset").click();
  },
  async "Quiz pass mark: below 70% stays incomplete, 70%+ completes"(p, w) {
    const qs = getQuestionsForGroup("equity-literacy");
    const runQuiz = async (right) => {
      await p.goto(base + "/training?group=equity-literacy&start=1", { waitUntil: "networkidle" });
      const dlg = p.getByRole("dialog");
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

  async "Chart pattern leftovers: complex head-and-shoulders and low tight flag in Archive and Learn"(p, w) {
    for (const [id, dir, theme, word] of [
      ["complex-head-shoulders", "down", "bearish-reversal", /neckline/i],
      ["complex-inverse-head-shoulders", "up", "bullish-reversal", /neckline/i],
      ["low-tight-flag", "up", "continuation", /pivot/i],
    ]) {
      await p.goto(base + `/archive?tab=patterns&open=${id}`, { waitUntil: "networkidle" });
      check((await p.getByTestId("pattern-illustration").count()) === 1, `leftovers: ${id} illustration @${w}`);
      check((await p.getByTestId("pattern-direction").getAttribute("data-direction")) === dir, `leftovers: ${id} direction @${w}`);
      check(/\/practice\/pattern-themes\?theme=/.test((await p.getByTestId("pattern-theme-primary").getAttribute("href")) ?? "") && (await p.getByTestId("pattern-theme-primary").getAttribute("href")).endsWith(theme), `leftovers: ${id} theme @${w}`);
      await p.getByTestId("pattern-tab-trade").click();
      const panel = await p.getByTestId("pattern-tabpanel").innerText();
      check(word.test(panel) && /Stop \(invalidation\)/.test(panel) && !/general guide/i.test(panel), `leftovers: ${id} trade tab @${w}`);
      check((await overflow(p)) <= 1, `leftovers: ${id} overflow @${w}`);
      if (SHOTS && id !== "complex-inverse-head-shoulders") await p.screenshot({ path: `${SHOTS}/${id}-${w}.png`, fullPage: false });
      await p.keyboard.press("Escape");
    }
    const qs = getQuestionsForGroup("chart-patterns");
    check(["complex-head-shoulders", "complex-inverse-head-shoulders", "low-tight-flag"].every((id) => qs.filter((q) => q.id.startsWith(`CP-${id}-`)).length === 5), `leftovers: Learn questions @${w}`);
  },

  async "Poster names (r27): tweezer star, stage bounce, measured moves, neckline retests, square bottom, steps, aliases"(p, w) {
    const rows = [
      ["tweezer-star", "down", "bearish-reversal", /Shooting star tweezers/],
      ["trend-stage-bounce", "up", "continuation", /Stage 2 pullback/],
      ["trendline-breakdown", "down", "breakout", null],
      ["measured-move-up", "up", "continuation", /Three-stage pattern/],
      ["measured-move-down", "down", "continuation", /Three-stage pattern/],
      ["neckline-retest-bullish", "up", "role-reversal", /On neckline \(ascending\)/],
      ["neckline-retest-bearish", "down", "role-reversal", /On neckline \(descending\)/],
      ["rectangle-bottom", "up", "bullish-reversal", /Square bottom/],
      ["step-top", "down", "bearish-reversal", /Staircase down/],
      ["step-bottom", "up", "bullish-reversal", /Staircase up/],
      ["bullish-three-pushes", "up", "exhaustion", /3 push pattern/],
      ["bearish-breakaway-gap", "down", "gap", /Breakaway gap \(descending\)/],
      ["bearish-runaway-gap", "down", "gap", /Measuring gap/],
      ["bull-flag", "up", null, /Parallelogram/],
    ];
    const shots = new Set(["tweezer-star", "trend-stage-bounce", "measured-move-up", "neckline-retest-bullish", "rectangle-bottom", "step-top"]);
    for (const [id, dir, theme, alias] of rows) {
      await p.goto(base + `/archive?tab=patterns&open=${id}`, { waitUntil: "networkidle" });
      check((await p.getByTestId("pattern-illustration").count()) === 1, `r27: ${id} illustration @${w}`);
      check((await p.getByTestId("pattern-direction").getAttribute("data-direction")) === dir, `r27: ${id} direction @${w}`);
      if (theme) check(((await p.getByTestId("pattern-theme-primary").getAttribute("href")) ?? "").endsWith(theme), `r27: ${id} theme @${w}`);
      if (alias) check(alias.test(await p.getByTestId("pattern-aliases").innerText()), `r27: ${id} also-called line @${w}`);
      check(/SIMULATED/i.test(await p.locator("body").innerText()), `r27: ${id} not labelled SIMULATED @${w}`);
      if (id !== "tweezer-star" && id !== "bull-flag") {
        await p.getByTestId("pattern-tab-trade").click();
        const panel = await p.getByTestId("pattern-tabpanel").innerText();
        check(/Stop \(invalidation\)/.test(panel) && !/general guide/i.test(panel), `r27: ${id} trade tab @${w}`);
      }
      check((await overflow(p)) <= 1, `r27: ${id} overflow @${w}`);
      if (SHOTS && shots.has(id)) await p.screenshot({ path: `${SHOTS}/r27-${id}-${w}.png`, fullPage: false });
      await p.keyboard.press("Escape");
    }
    const qs = getQuestionsForGroup("chart-patterns");
    check(rows.slice(1, 13).every(([id]) => qs.filter((q) => q.id.startsWith(`CP-${id}-`)).length === 5), `r27: Learn questions @${w}`);
    check(getQuestionsForGroup("tweezer-top").some((q) => /tweezer-star/i.test(q.id) || /Tweezer Star/.test(q.prompt ?? "")), `r27: tweezer star Learn questions @${w}`);
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
    check((await p.getByTestId("ca-table").locator("tr[data-app]").count()) === 11, `charts: app table rows wrong @${w}`);
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
    check(/Example Webull-style screens/.test(await p.getByTestId("ca-webull").innerText()), `charts: screenshot label missing @${w}`);
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
    check(/neckline/i.test(await p.getByRole("dialog").innerText()), `rev: Archive tabs not deepened @${w}`);
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
  async "Futures vs options: MES/ES calculator, Sharpe, Apple chain"(p, w) {
    await p.goto(base + "/practice/futures-vs-options", { waitUntil: "networkidle" });
    check(/right, but not the obligation/.test(await p.getByTestId("fo-compare").innerText()), `fo: compare table missing @${w}`);
    check(/\$20\.00/.test(await p.getByTestId("fo-calc-out").innerText()), `fo: MES 4pt $20 missing @${w}`);
    await p.locator("[data-contract=ES]").click();
    check(/\$200\.00/.test(await p.getByTestId("fo-calc-out").innerText()), `fo: ES 4pt $200 missing @${w}`);
    check(/Sharpe ≈ 0\.60/.test(await p.getByTestId("fo-sharpe-out").innerText()), `fo: Sharpe 0.6 missing @${w}`);
    check(/144,748/.test(await p.getByTestId("fo-ebitda").innerText()), `fo: EBITDA missing @${w}`);
    check(/12\.00|SMA\(5\)/.test(await p.getByTestId("fo-sma").innerText()), `fo: SMA missing @${w}`);
    const done = await stored(p, "analysis_core_misc_practices_done_v1");
    check(!!done && JSON.stringify(done).includes("futures-vs-options"), `fo: practice not marked done @${w}`);
    check((await overflow(p)) <= 1, `fo overflow @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/futures-vs-options-${w}.png`, fullPage: true });
    await p.goto(base + "/training?group=futures-vs-options", { waitUntil: "networkidle" });
    check(/Futures vs Options/.test(await p.locator("main").innerText()), `fo: Learn group missing @${w}`);
  },
  async "Technique narratives: popover on top, Next/Prev/keys, Exit leaves chart clickable"(p, w) {
    await p.goto(base + "/practice/technique-narratives", { waitUntil: "networkidle" });
    check((await p.locator("[data-narrative]").count()) >= 6, `nar: fewer than 6 narratives @${w}`);
    await p.getByTestId("nar-start").click();
    const pop = p.getByTestId("tour-popover");
    check(await pop.isVisible(), `nar: popover not visible @${w}`);
    const onTop = async () => {
      const b = await pop.boundingBox();
      return p.evaluate(([x, y]) => !!document.elementFromPoint(x, y)?.closest('[data-testid="tour-popover"]'), [b.x + b.width / 2, b.y + 12]);
    };
    check(await onTop(), `nar: popover not topmost @${w}`);
    for (let i = 0; i < 5; i++) await p.getByTestId("tour-next").click();
    check(/Step 6 of 8/.test(await p.getByTestId("tour-count").innerText()), `nar: step 6 missing @${w}`);
    check((await p.locator("[data-side=wrong]").getAttribute("aria-pressed")) === "true", `nar: wrong chart not shown on step 6 @${w}`);
    check(await onTop(), `nar: popover not topmost on step 6 @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/technique-narratives-popover-${w}.png` });
    await p.keyboard.press("ArrowLeft");
    check(/Step 5 of 8/.test(await p.getByTestId("tour-count").innerText()), `nar: ArrowLeft failed @${w}`);
    await p.getByTestId("tour-prev").click();
    check(/Step 4 of 8/.test(await p.getByTestId("tour-count").innerText()), `nar: Prev failed @${w}`);
    await p.keyboard.press("ArrowRight");
    check(/Step 5 of 8/.test(await p.getByTestId("tour-count").innerText()), `nar: ArrowRight failed @${w}`);
    await p.getByTestId("tour-exit").click();
    check((await p.getByTestId("tour-popover").count()) === 0 && (await p.getByTestId("tour-backdrop").count()) === 0, `nar: tour not closed @${w}`);
    const candle = p.locator('[data-testid="nar-canvas"] svg g[style*="pointer"]').nth(20);
    await candle.scrollIntoViewIfNeeded();
    const cb = await candle.boundingBox();
    const hit = await p.evaluate(([x, y]) => !!document.elementFromPoint(x, y)?.closest('[data-testid="nar-canvas"]'), [cb.x + cb.width / 2, cb.y + cb.height / 2]);
    check(hit, `nar: chart not reachable after Exit @${w}`);
    await candle.click();
    check(/Bar 21:/.test(await p.getByTestId("nar-readout").innerText()), `nar: candle click readout missing @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/technique-narratives-explore-${w}.png` });
    await p.reload({ waitUntil: "networkidle" });
    check(/Resume at step 5/.test(await p.getByTestId("nar-resume").innerText()), `nar: resume missing @${w}`);
    await p.getByTestId("nar-resume").click();
    await p.keyboard.press("Escape");
    check((await p.getByTestId("tour-popover").count()) === 0, `nar: Esc did not exit @${w}`);
    await p.getByTestId("nar-resume").click();
    for (let i = 0; i < 3; i++) await p.getByTestId("tour-next").click();
    await p.getByTestId("tour-finish").click();
    const done = await stored(p, "analysis_core_misc_practices_done_v1");
    check(!!done && JSON.stringify(done).includes("technique-narratives"), `nar: practice not marked done @${w}`);
    await p.locator("[data-narrative=bollinger-squeeze]").click();
    await p.locator("[data-side=wrong]").click();
    check(/−|-/.test(await p.getByTestId("nar-result").innerText()), `nar: wrong-chart loss missing @${w}`);
    check(/head fake/i.test(await p.getByTestId("nar-fail").innerText()), `nar: fail panel missing @${w}`);
    check((await overflow(p)) <= 1, `nar overflow @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/technique-narratives-${w}.png`, fullPage: true });
    await p.goto(base + "/training?group=technique-narratives", { waitUntil: "networkidle" });
    check(/Technique Narratives/.test(await p.locator("main").innerText()), `nar: Learn group missing @${w}`);
  },
  async "Missing wicks: walkthrough on top, zoom 1h/15m/1m, same hourly candle, explore after Exit"(p, w) {
    await p.goto(base + "/practice/missing-wicks", { waitUntil: "networkidle" });
    await p.getByTestId("mw-start").click();
    const pop = p.getByTestId("tour-popover");
    const onTop = async () => {
      const b = await pop.boundingBox();
      return p.evaluate(([x, y]) => !!document.elementFromPoint(x, y)?.closest('[data-testid="tour-popover"]'), [b.x + b.width / 2, b.y + 12]);
    };
    check(await onTop(), `mw: popover not topmost @${w}`);
    check(/no top wick/.test(await pop.innerText()), `mw: step 1 text @${w}`);
    await p.getByTestId("tour-next").click();
    await p.getByTestId("tour-next").click();
    check((await p.locator("[data-tf='15m']").getAttribute("aria-pressed")) === "true", `mw: step 3 not 15m @${w}`);
    await p.keyboard.press("ArrowRight");
    await p.keyboard.press("ArrowRight");
    check((await p.locator("[data-scn=B]").getAttribute("aria-pressed")) === "true" && (await p.locator("[data-tf='1m']").getAttribute("aria-pressed")) === "true", `mw: step 5 not B/1m @${w}`);
    check(await onTop(), `mw: popover not topmost on step 5 @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/missing-wicks-popover-${w}.png` });
    const cmp = await p.getByTestId("mw-compare").innerText();
    check((cmp.match(/100\.00\s+100\.00\s+97\.00\s+97\.50/g) ?? []).length === 2, `mw: compare rows differ @${w}`);
    await p.keyboard.press("Escape");
    check((await p.getByTestId("tour-backdrop").count()) === 0, `mw: Esc did not exit @${w}`);
    await p.locator("[data-tf='1h']").click();
    await p.locator("[data-scn=A]").click();
    const candle = p.locator('[data-testid="mw-canvas"] svg g[style*="pointer"]').nth(3);
    await candle.scrollIntoViewIfNeeded();
    const cb = await candle.boundingBox();
    check(await p.evaluate(([x, y]) => !!document.elementFromPoint(x, y)?.closest('[data-testid="mw-canvas"]'), [cb.x + cb.width / 2, cb.y + cb.height / 2]), `mw: chart not reachable after Exit @${w}`);
    await candle.click();
    check(/O 100\.00 · H 100\.00 · L 97\.00 · C 97\.50 · upper wick 0\.00/.test(await p.getByTestId("mw-readout").innerText()), `mw: hourly readout wrong @${w}`);
    await p.locator("[data-tf='15m']").click();
    check((await p.locator('[data-testid="mw-canvas"] svg g[style*="pointer"]').count()) === 4, `mw: 15m not 4 candles @${w}`);
    await p.locator("[data-tf='1m']").click();
    check((await p.locator('[data-testid="mw-canvas"] svg g[style*="pointer"]').count()) === 60, `mw: 1m not 60 candles @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/missing-wicks-explore-${w}.png` });
    await p.getByTestId("mw-resume").click();
    for (let i = 0; i < 3; i++) await p.getByTestId("tour-next").click();
    await p.getByTestId("tour-finish").click();
    const done = await stored(p, "analysis_core_misc_practices_done_v1");
    check(!!done && JSON.stringify(done).includes("missing-wicks"), `mw: practice not marked done @${w}`);
    check((await overflow(p)) <= 1, `mw overflow @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/missing-wicks-${w}.png`, fullPage: true });
    await p.goto(base + "/training?group=missing-wicks", { waitUntil: "networkidle" });
    check(/Missing Wicks/.test(await p.locator("main").innerText()), `mw: Learn group missing @${w}`);
  },
  async "Record-setting traders: banner, Verified by + source on every card, reported box, verdict, drill"(p, w) {
    await p.goto(base + "/practice/record-traders", { waitUntil: "networkidle" });
    const banner = p.getByTestId("rt-banner");
    check((await banner.innerText()).trim() === "This section includes only feats a neutral third party confirmed, with the verifier and source shown for each.", `rt: banner text @${w}`);
    const bb = await banner.boundingBox();
    const firstCard = await p.getByTestId("rt-card").first().boundingBox();
    check(bb && firstCard && bb.y < firstCard.y, `rt: banner not above cards @${w}`);
    const n = await p.getByTestId("rt-card").count();
    check(n >= 10, `rt: only ${n} cards @${w}`);
    for (let i = 0; i < n; i++) {
      const card = p.getByTestId("rt-card").nth(i);
      check(/^Verified by: \S/.test((await card.getByTestId("rt-verifier").innerText()).trim()), `rt: card ${i} verifier @${w}`);
      check(/^https:\/\//.test((await card.getByTestId("rt-source").getAttribute("href")) ?? ""), `rt: card ${i} source @${w}`);
    }
    const cards = await p.getByTestId("rt-cards").innerText();
    check(!/Simons|Medallion|Livermore/.test(cards), `rt: unaudited entry inside verified cards @${w}`);
    check(/not publicly audited/.test(await p.getByTestId("rt-reported").innerText()), `rt: reported box @${w}`);
    check((await p.getByTestId("rt-reported").getByText("Verified by").count()) === 0, `rt: reported box has Verified by @${w}`);
    await p.getByTestId("rt-more-zanger").click();
    const z = await p.getByTestId("rt-detail-zanger").innerText();
    check(/20–35%/.test(z) && /2:1 margin/.test(z) && /same day/.test(z), `rt: zanger rules @${w}`);
    check(/58%/.test(await p.getByTestId("rt-verdict").innerText()), `rt: verdict evidence @${w}`);
    check((await p.locator('[data-testid="rt-checklist"] input[type=checkbox]').count()) === 10, `rt: checklist @${w}`);
    for (let i = 0; i < 5; i++) {
      const c = p.getByTestId(`rt-claim-${i}`);
      await p.getByTestId(`rt-claim-${i}-${i % 2 ? "strong" : "weak"}`).click();
      check(/Right\.|Not quite/.test(await c.innerText()), `rt: claim ${i} feedback @${w}`);
    }
    check(/5\/5 answered · 5 right/.test(await p.getByTestId("rt-drill-score").innerText()), `rt: drill score @${w}`);
    const done = await stored(p, "analysis_core_misc_practices_done_v1");
    check(!!done && JSON.stringify(done).includes("record-traders"), `rt: practice not marked done @${w}`);
    check((await overflow(p)) <= 1, `rt overflow @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/record-traders-${w}.png`, fullPage: true });
    await p.goto(base + "/training?group=record-traders", { waitUntil: "networkidle" });
    check(/record-setting traders/i.test(await p.locator("main").innerText()), `rt: Learn group missing @${w}`);
  },
  async "Pattern themes: 17 themes, chips, quick map, checklist, Archive theme filter + modal chips"(p, w) {
    await p.goto(base + "/practice/pattern-themes", { waitUntil: "networkidle" });
    check((await p.locator('[data-testid="pt-chips"] button').count()) === 17, `pt: 17 chips @${w}`);
    await p.locator("[data-theme='failure']").click();
    await p.waitForSelector("[data-testid='pt-theme'][data-selected='failure']", { timeout: 5000 }).catch(() => {});
    check((await p.getByTestId("pt-theme").getAttribute("data-selected")) === "failure", `pt: select theme @${w}`);
    check(/Bull Trap \(Failed Breakout\)/.test(await p.getByTestId("pt-patterns").innerText()), `pt: failure lists bull trap @${w}`);
    check((await p.getByTestId("pt-map-row").count()) === 19, `pt: quick map rows @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/pattern-themes-${w}.png`, fullPage: true });
    for (const id of ["context", "location", "theme", "trigger", "risk"]) await p.getByTestId(`ptc-${id}`).check();
    check(/All 5 checked/.test(await p.getByTestId("ptc-status").innerText()), `pt: checklist status @${w}`);
    const done = await stored(p, "analysis_core_misc_practices_done_v1");
    check(!!done && JSON.stringify(done).includes("pattern-themes"), `pt: practice not marked done @${w}`);
    check((await overflow(p)) <= 1, `pt overflow @${w}`);
    await p.getByTestId("pt-archive-link").click();
    await p.waitForURL(/archive\?theme=failure/);
    await p.waitForSelector("[data-pattern-id='failed-breakout']", { timeout: 5000 }).catch(() => {});
    check((await overflow(p)) <= 1, `pt: archive overflow @${w}`);
    const ids = await p.locator("[data-pattern-id]").evaluateAll((els) => els.map((e) => e.getAttribute("data-pattern-id")));
    check(ids.includes("failed-breakout") && ids.includes("bullish-hikkake") && !ids.includes("morning-star") && ids.length < 20, `pt: archive theme filter (${ids.length}) @${w}`);
    await p.goto(base + "/archive?open=hammer", { waitUntil: "networkidle" });
    check(/Primary: Rejection/.test(await p.getByTestId("pattern-theme-primary").innerText()), `pt: modal primary chip @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/pattern-themes-modal-${w}.png` });
    await p.goto(base + "/training?group=pattern-themes", { waitUntil: "networkidle" });
    check(/Pattern Themes/.test(await p.locator("main").innerText()), `pt: Learn group missing @${w}`);
  },
  async "Essential candles: 50% takeaway, star diagrams, valid-star drill, inside bar"(p, w) {
    const { STAR_CASES, starCheck } = await load("/src/lib/essentialCandles.ts");
    await p.goto(base + "/practice/essential-candles", { waitUntil: "networkidle" });
    check(/^A morning star is a three-candle pattern where the third \(bullish\) candle closes above the 50% midpoint of the first \(bearish\) candle's body\./.test((await p.getByTestId("ec-takeaway").innerText()).trim()), `ec: takeaway @${w}`);
    for (const id of ["ec-diagram-morning", "ec-diagram-doji", "ec-diagram-evening"]) check((await p.locator(`[data-testid='${id}'] line[stroke-dasharray]`).count()) === 1, `ec: ${id} 50% line @${w}`);
    for (let i = 0; i < STAR_CASES.length; i++) {
      await p.getByTestId(`ec-case-${i}-${starCheck(STAR_CASES[i]).valid ? "valid" : "not-yet"}`).click();
    }
    check(new RegExp(`${STAR_CASES.length}/${STAR_CASES.length} answered · ${STAR_CASES.length} right`).test(await p.getByTestId("ec-drill-score").innerText()), `ec: drill score @${w}`);
    check(/not a valid morning star yet/.test(await p.getByTestId("ec-case-1").innerText()), `ec: near-miss feedback @${w}`);
    check(/Two candles/.test(await p.locator("[data-testid='ec-card'][data-id='inside-bar']").innerText()), `ec: inside bar two candles @${w}`);
    check((await p.getByTestId("ec-card").count()) >= 18, `ec: cards @${w}`);
    const done = await stored(p, "analysis_core_misc_practices_done_v1");
    check(!!done && JSON.stringify(done).includes("essential-candles"), `ec: practice not marked done @${w}`);
    check((await overflow(p)) <= 1, `ec overflow @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/essential-candles-${w}.png`, fullPage: true });
    await p.goto(base + "/archive?open=morning-star", { waitUntil: "networkidle" });
    check(/50% midpoint/.test(await p.getByTestId("pattern-takeaway").innerText()), `ec: archive takeaway @${w}`);
    await p.goto(base + "/training?group=essential-candles", { waitUntil: "networkidle" });
    check(/Essential Candles/.test(await p.locator("main").innerText()), `ec: Learn group missing @${w}`);
  },
  async "Which Way: Up/Down/Either drill, keys, feedback, resume, modal direction"(p, w) {
    const { roundsFor } = await load("/src/lib/whichWay.ts");
    await p.goto(base + "/practice/which-way", { waitUntil: "networkidle" });
    const deck = roundsFor("candles");
    check(new RegExp(`Candlesticks \\(${deck.length}\\)`).test(await p.getByTestId("ww-mode-candles").innerText()), `ww: candle deck count @${w}`);
    check(/Prior trend: (up|down)/.test(await p.getByTestId("ww-prior").innerText()), `ww: prior trend label @${w}`);
    for (let i = 0; i < 10; i++) {
      const r = p.getByTestId("ww-round");
      const ans = await r.getAttribute("data-answer");
      const id = await r.getAttribute("data-pattern");
      check(id === deck[i].id, `ww: round ${i} order @${w}`);
      if (i % 2) await p.keyboard.press(ans === "up" ? "ArrowUp" : ans === "down" ? "ArrowDown" : "e");
      else await p.getByTestId(`ww-pick-${ans}`).click();
      const fb = await p.getByTestId("ww-feedback").innerText();
      check(/Right\./.test(fb) && /Confirmation to wait for: Wait for/.test(fb), `ww: feedback ${i} @${w}`);
      if (i === 0 && SHOTS) await p.screenshot({ path: `${SHOTS}/which-way-${w}.png`, fullPage: true });
      if (i < 9) await p.keyboard.press("Enter");
    }
    check(/10\/10 right \(100%\)/.test(await p.getByTestId("ww-score").innerText()), `ww: score @${w}`);
    check(/Answer streak 10/.test(await p.getByTestId("ww-score").innerText()), `ww: streak @${w}`);
    const done = await stored(p, "analysis_core_misc_practices_done_v1");
    check(!!done && JSON.stringify(done).includes("which-way"), `ww: practice not marked done @${w}`);
    await p.getByTestId("ww-next").click();
    await p.getByTestId(`ww-pick-${(await p.getByTestId("ww-round").getAttribute("data-answer")) === "up" ? "down" : "up"}`).click();
    check(/Not quite/.test(await p.getByTestId("ww-feedback").innerText()), `ww: wrong feedback @${w}`);
    check(/Answer streak 0/.test(await p.getByTestId("ww-score").innerText()), `ww: streak reset @${w}`);
    check((await overflow(p)) <= 1, `ww overflow @${w}`);
    await p.reload({ waitUntil: "networkidle" });
    check(/11 \/ /.test(await p.getByTestId("ww-position").innerText()) && /10\/11 right/.test(await p.getByTestId("ww-score").innerText()), `ww: resumes @${w}`);
    await p.getByTestId("ww-mode-charts").click();
    check(/1 \/ /.test(await p.getByTestId("ww-position").innerText()), `ww: chart deck @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/which-way-charts-${w}.png`, fullPage: true });
    await p.goto(base + "/archive?open=hanging-man", { waitUntil: "networkidle" });
    check((await p.getByTestId("pattern-direction").getAttribute("data-direction")) === "down", `ww: modal direction @${w}`);
    await p.goto(base + "/training?group=which-way", { waitUntil: "networkidle" });
    check(/Which Way\?/.test(await p.locator("main").innerText()), `ww: Learn group missing @${w}`);
  },
  async "Progress map: world / tree / web views, next objective, progress fills in"(p, w) {
    await p.goto(base + "/", { waitUntil: "networkidle" });
    // Map is a top-level header link.
    await p.getByTestId("nav-map").click();
    await p.waitForURL(/\/map$/);
    check((await p.getByTestId("map-next").getAttribute("data-stage")) === "quiz:candle-anatomy", `map: first objective @${w}`);
    check((await p.getByTestId("map-region").count()) === 12, `map: 12 regions @${w}`);
    check((await p.locator("[data-testid='map-region'][data-region='candles']").getAttribute("data-pct")) === "0", `map: empty candles @${w}`);
    check((await overflow(p)) <= 1, `map world overflow @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/map-world-${w}.png`, fullPage: true });
    await p.getByTestId("map-view-tree").click();
    await p.waitForSelector("[data-testid='map-tree']");
    check((await p.getByTestId("tree-node").count()) >= 40, `map: tree nodes @${w}`);
    check((await p.locator("[data-testid='tree-node'][data-stage='quiz:candle-reading']").getAttribute("data-status")) === "locked", `map: locked reading @${w}`);
    check(/Unlocks →[^\n]*Reading One Candle/.test(await p.locator("[data-testid='tree-node'][data-stage='quiz:candle-anatomy']").innerText()), `map: unlocks text @${w}`);
    check((await overflow(p)) <= 1, `map tree overflow @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/map-tree-${w}.png`, fullPage: true });
    await p.getByTestId("map-view-web").click();
    await p.waitForSelector("[data-testid='map-web']");
    check((await p.getByTestId("web-unknown").count()) >= 5, `map: '?' nodes @${w}`);
    check((await p.locator("[data-testid='web-unknown'][data-stage='quiz:candle-anatomy']").count()) === 1, `map: first objective is a '?' @${w}`);
    check((await overflow(p)) <= 1, `map web overflow @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/map-web-${w}.png`, fullPage: true });
    check(/view=web/.test(p.url()), `map: view in URL @${w}`);
    await p.getByTestId("map-next-link").click();
    await p.waitForURL(/training\?group=candle-anatomy/);
    check(/Candlestick Basics/.test(await p.locator("main").innerText()), `map: next objective opens the quiz @${w}`);
    await p.evaluate(() => {
      localStorage.setItem("analysis_core_map_v1", JSON.stringify({ visited: ["/", "/map", "/practice/essential-candles"], quiz: { "candle-anatomy": { best: 90, passed: true } } }));
      localStorage.setItem("analysis_core_misc_practices_done_v1", JSON.stringify(["essential-candles"]));
    });
    await p.goto(base + "/map", { waitUntil: "networkidle" });
    check((await p.getByTestId("map-next").getAttribute("data-stage")) === "quiz:candle-reading", `map: next moves on @${w}`);
    check(Number(await p.locator("[data-testid='map-region'][data-region='candles']").getAttribute("data-pct")) > 0, `map: candles fills in @${w}`);
    check((await p.locator("[data-stage='quiz:candle-anatomy'][data-status='done']").count()) === 1, `map: done check @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/map-progress-${w}.png`, fullPage: false });
  },
  async "Directional nav: path picker, Next up, path chip, Browse everything and grouped menus"(p, w) {
    await p.goto(base + "/", { waitUntil: "networkidle" });
    check(await p.getByTestId("track-picker").isVisible(), `nav: picker on first visit @${w}`);
    check((await p.locator("[data-testid^='track-option-']").count()) === 8, `nav: 7 tracks + everything @${w}`);
    check((await p.getByTestId("next-up").count()) === 0, `nav: no Next up before a pick @${w}`);
    check(/Pick a path/.test(await p.getByTestId("track-chip").innerText()), `nav: chip prompts @${w}`);
    check((await overflow(p)) <= 1, `nav picker overflow @${w}`);
    await p.getByTestId("track-option-charts-patterns").click();
    await p.waitForSelector("[data-testid='next-up'][data-track='charts-patterns']");
    const steps = await p.getByTestId("next-up-step").count();
    check(steps >= 1 && steps <= 3, `nav: 1-3 next steps (${steps}) @${w}`);
    check(/Charts/.test(await p.getByTestId("track-chip").innerText()), `nav: chip names the track @${w}`);
    check((await p.getByTestId("track-picker").count()) === 0, `nav: picker folds away @${w}`);
    check((await overflow(p)) <= 1, `nav next-up overflow @${w}`);
    const first = await p.getByTestId("next-up-step").first().getAttribute("href");
    await p.getByTestId("next-up-step").first().click();
    await p.waitForURL((u) => u.href !== base + "/");
    check(first && p.url().includes(first.split("#")[0]), `nav: first step opens ${first} @${w}`);
    await p.goto(base + "/", { waitUntil: "networkidle" });
    check((await p.getByTestId("next-up").getAttribute("data-track")) === "charts-patterns", `nav: track persists @${w}`);
    // Change the path from the header chip: the dialog sits above the sticky header.
    await p.getByTestId("track-chip").click();
    const dialog = p.getByTestId("track-dialog");
    await dialog.waitFor();
    const onTop = await p.evaluate(() => {
      const el = document.elementFromPoint(innerWidth / 2, 30);
      return !!el?.closest("[data-testid='track-dialog']");
    });
    check(onTop, `nav: dialog above the header @${w}`);
    await dialog.getByTestId("track-option-fundamentals").click();
    await p.waitForSelector("[data-testid='next-up'][data-track='fundamentals']");
    check((await p.getByTestId("track-dialog").count()) === 0, `nav: dialog closes on pick @${w}`);
    // Every dropdown keeps Browse everything as its footer.
    await p.getByTestId("practice-menu").click();
    await p.getByTestId("practice-menu-browse").click();
    await p.waitForURL(/\/browse$/);
    await p.getByTestId("browse-everything").waitFor();
    check((await p.locator("[data-testid^='browse-section-']").count()) >= 15, `browse: sections @${w}`);
    check((await p.locator("[data-testid='browse-section-test-outs'] a").count()) === 8, `browse: 8 test-outs @${w}`);
    check((await p.locator("[data-testid='browse-section-macro-lessons'] a").count()) === 18, `browse: 18 macro lessons @${w}`);
    check((await overflow(p)) <= 1, `browse overflow @${w}`);
    await p.getByTestId("browse-search").fill("doji");
    const hit = p.locator("[data-testid='browse-results'] a[href$='/archive?tab=patterns&open=doji']");
    check((await hit.count()) === 1, `browse: search finds Doji @${w}`);
    await hit.click();
    await p.waitForURL(/archive\?tab=patterns&open=doji/);
    await p.goto(base + "/browse", { waitUntil: "networkidle" });
    await p.getByTestId("browse-toc").click();
    await p.waitForURL(/\/training$/);
    // Show me everything: the entry points instead of a narrow path.
    await p.goto(base + "/", { waitUntil: "networkidle" });
    await p.getByTestId("next-up-change").click();
    await p.getByTestId("track-dialog").getByTestId("track-option-everything").click();
    await p.waitForSelector("[data-testid='next-up'][data-track='everything']");
    check((await p.getByTestId("next-up-step").first().getAttribute("href")).endsWith("/browse"), `nav: everything starts at Browse @${w}`);
  },
  async "Nav tabs: level tabs in Learn, Practice and Trade, keyboard, remembered tab and For your path"(p, w) {
    await p.goto(base + "/", { waitUntil: "networkidle" });
    const vh = p.viewportSize().height;
    for (const m of ["learn", "practice", "trade"]) {
      await p.getByTestId(`${m}-menu`).click();
      const panel = p.getByTestId(`${m}-menu-panel`);
      await panel.waitFor();
      check((await panel.getByRole("tab").count()) === 3, `tabs: 3 level tabs without a track (${m}) @${w}`);
      check((await p.getByTestId(`navtab-${m}-beginner`).getAttribute("aria-selected")) === "true", `tabs: Beginner by default (${m}) @${w}`);
      await p.waitForFunction((id) => document.activeElement?.getAttribute("data-testid") === id, `navtab-${m}-beginner`);
      const shown = await p.getByTestId(`navpanel-${m}-beginner`).getByTestId("navtab-item").count();
      check(shown >= 2 && shown <= 12, `tabs: ${shown} beginner items (${m}) @${w}`);
      const groups = await p.getByTestId(`navpanel-${m}-beginner`).getByRole("group").count();
      check(groups >= 1 && groups <= 4, `tabs: ${groups} groups (${m}) @${w}`);
      const box = await panel.boundingBox();
      check(box && box.x >= 0 && box.x + box.width <= w + 1 && box.y + box.height <= vh + 1, `tabs: panel fits the viewport (${m}) @${w}`);
      check(await p.getByTestId(`${m}-menu-browse`).isVisible(), `tabs: Browse everything footer (${m}) @${w}`);
      check(await panel.getByRole("tabpanel").first().isVisible(), `tabs: a tabpanel shows (${m}) @${w}`);
      if (SHOTS) await p.screenshot({ path: `${SHOTS}/navtabs-${m}-${w}.png`, fullPage: false });
      // Arrow keys move between tabs and select them; Home and End jump.
      await p.keyboard.press("ArrowRight");
      check((await p.getByTestId(`navtab-${m}-intermediate`).getAttribute("aria-selected")) === "true", `tabs: ArrowRight selects Intermediate (${m}) @${w}`);
      check(await p.getByTestId(`navpanel-${m}-intermediate`).isVisible(), `tabs: Intermediate panel shows (${m}) @${w}`);
      check(!(await p.getByTestId(`navpanel-${m}-beginner`).isVisible()), `tabs: Beginner panel hides (${m}) @${w}`);
      await p.keyboard.press("End");
      check((await p.getByTestId(`navtab-${m}-advanced`).getAttribute("aria-selected")) === "true", `tabs: End selects Advanced (${m}) @${w}`);
      await p.keyboard.press("ArrowRight");
      check((await p.getByTestId(`navtab-${m}-beginner`).getAttribute("aria-selected")) === "true", `tabs: ArrowRight wraps (${m}) @${w}`);
      await p.keyboard.press("ArrowLeft");
      await p.keyboard.press("Home");
      check((await p.getByTestId(`navtab-${m}-beginner`).getAttribute("aria-selected")) === "true", `tabs: Home selects Beginner (${m}) @${w}`);
      await p.keyboard.press("ArrowDown");
      check(await p.evaluate((m) => !!document.activeElement?.closest(`[data-testid='navpanel-${m}-beginner']`), m), `tabs: ArrowDown enters the panel (${m}) @${w}`);
      await p.keyboard.press("Escape");
      check(!(await panel.isVisible()), `tabs: Escape closes (${m}) @${w}`);
      check(await p.evaluate((m) => document.activeElement?.getAttribute("data-testid") === `${m}-menu`, m), `tabs: focus returns to the toggle (${m}) @${w}`);
    }
    // Long tabs cap at 12 with Show all; the last tab used is remembered per menu.
    await p.getByTestId("practice-menu").click();
    await p.getByTestId("navtab-practice-intermediate").click();
    const inter = p.getByTestId("navpanel-practice-intermediate");
    check((await inter.getByTestId("navtab-item").count()) === 12, `tabs: 12 intermediate labs first @${w}`);
    await p.getByTestId("navtab-more-practice-intermediate").click();
    check((await inter.getByTestId("navtab-item").count()) === 20, `tabs: Show all lists 20 @${w}`);
    await p.keyboard.press("Escape");
    await p.getByTestId("practice-menu").click();
    check((await p.getByTestId("navtab-practice-intermediate").getAttribute("aria-selected")) === "true", `tabs: remembers the last tab @${w}`);
    await inter.getByTestId("navtab-item").first().click();
    await p.waitForURL((u) => u.pathname.startsWith("/practice/"));
    check(!(await p.getByTestId("practice-menu-panel").isVisible()), `tabs: following an item closes the menu @${w}`);
    // With a track: For your path is first and selected, and lists that track's steps for the menu.
    await p.goto(base + "/", { waitUntil: "networkidle" });
    await p.getByTestId("track-option-charts-patterns").click();
    await p.waitForSelector("[data-testid='next-up']");
    for (const m of ["practice", "learn"]) {
      await p.getByTestId(`${m}-menu`).click();
      const panel = p.getByTestId(`${m}-menu-panel`);
      check((await panel.getByRole("tab").count()) === 4, `tabs: 4 tabs with a track (${m}) @${w}`);
      check((await p.getByTestId(`navtab-${m}-path`).getAttribute("aria-selected")) === "true", `tabs: For your path by default (${m}) @${w}`);
      const items = await p.getByTestId(`navpanel-${m}-path`).getByTestId("navtab-item").count();
      check(items >= 1 && items <= 12, `tabs: ${items} path items (${m}) @${w}`);
      check(/Step \d+ of 15/.test(await p.getByTestId(`navpanel-${m}-path`).innerText()), `tabs: path items show their step (${m}) @${w}`);
      if (SHOTS && m === "practice") await p.screenshot({ path: `${SHOTS}/navtabs-path-${w}.png`, fullPage: false });
      await p.keyboard.press("Escape");
    }
    // The path dialog hides the corner AI helper so nothing draws over its backdrop.
    await p.getByTestId("track-chip").click();
    await p.getByTestId("track-dialog").waitFor();
    check(await p.evaluate(() => [...document.querySelectorAll(".hai-float")].every((el) => getComputedStyle(el).visibility === "hidden")), `tabs: AI helper hidden under the dialog @${w}`);
    await p.keyboard.press("Escape");
    check(await p.evaluate(() => [...document.querySelectorAll(".hai-float")].every((el) => getComputedStyle(el).visibility !== "hidden")), `tabs: AI helper back after the dialog @${w}`);
  },
  async "Browse popup: links open in a dialog over Browse, close by X, backdrop and Escape, focus returns, Open full page"(p, w) {
    await p.goto(base + "/browse", { waitUntil: "networkidle" });
    check((await p.getByRole("switch").count()) === 0, `popup: no new tab switch @${w}`);
    check((await p.locator("[data-testid='browse-everything'] a[target='_blank']").count()) === 0, `popup: no new-tab links @${w}`);
    const link = p.locator("[data-testid='browse-section-learn'] a[href$='/practice/candle-basics']").first();
    const dlg = p.getByTestId("browse-modal");
    const open = async (l) => { await l.click(); await dlg.waitFor({ state: "visible" }); };
    const closed = async (how) => {
      await dlg.waitFor({ state: "detached", timeout: 5000 });
      check(p.url().endsWith("/browse"), `popup: ${how} returns to /browse (${p.url()}) @${w}`);
    };
    const focusHref = () => p.evaluate(() => document.activeElement?.getAttribute("href") ?? document.activeElement?.tagName);
    await open(link);
    check((await dlg.getAttribute("role")) === "dialog" && (await dlg.getAttribute("aria-modal")) === "true", `popup: role dialog and aria-modal @${w}`);
    check((await p.getByRole("dialog", { name: "Candlestick Basics" }).count()) === 1, `popup: dialog named by its title @${w}`);
    check(p.url().endsWith("/practice/candle-basics"), `popup: URL is the page's own @${w}`);
    await dlg.locator("h1", { hasText: "Candlestick Basics" }).first().waitFor({ timeout: 10000 });
    check(true, `popup: page content loads inside @${w}`);
    check((await p.getByTestId("browse-everything").count()) === 1, `popup: Browse stays behind @${w}`);
    const box = await dlg.boundingBox();
    const vw = await p.evaluate(() => window.visualViewport?.width ?? innerWidth);
    check(box && box.x >= 0 && box.y >= 0 && box.x + box.width <= vw + 1 && box.y + box.height <= 901, `popup: fits the viewport @${w}`);
    check((await p.evaluate(() => document.body.style.overflow)) === "hidden", `popup: body scroll locked @${w}`);
    check(await p.evaluate(() => [...document.querySelectorAll(".hai-float")].every((el) => getComputedStyle(el).visibility === "hidden")), `popup: AI helper hidden @${w}`);
    check((await p.evaluate(() => document.activeElement?.getAttribute("data-testid"))) === "browse-modal-close", `popup: focus starts on Close @${w}`);
    const z = await p.getByTestId("browse-modal-backdrop").evaluate((el) => getComputedStyle(el).zIndex);
    check(z === "100", `popup: modal layer z-index (${z}) @${w}`);
    await p.keyboard.press("Shift+Tab");
    await p.keyboard.press("Shift+Tab");
    check(await p.evaluate(() => !!document.activeElement?.closest("[data-testid='browse-modal']")), `popup: focus stays in the dialog @${w}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/browse-modal-${w}.png` });
    await p.getByTestId("browse-modal-close").click();
    await closed("X");
    await p.waitForTimeout(100);
    check((await focusHref())?.endsWith("/practice/candle-basics"), `popup: focus back on the link after X @${w}`);
    check((await p.evaluate(() => document.body.style.overflow)) !== "hidden", `popup: scroll unlocked @${w}`);
    await open(link);
    await p.getByTestId("browse-modal-backdrop").click({ position: { x: 2, y: 2 } });
    await closed("backdrop");
    await open(link);
    await p.keyboard.press("Escape");
    await closed("Escape");
    await p.waitForTimeout(100);
    check((await focusHref())?.endsWith("/practice/candle-basics"), `popup: focus back on the link after Escape @${w}`);
    await p.getByTestId("browse-search").fill("doji");
    const hit = p.locator("[data-testid='browse-results'] a[href$='/archive?tab=patterns&open=doji']");
    await open(hit);
    check(p.url().endsWith("/archive?tab=patterns&open=doji"), `popup: search result keeps its query @${w}`);
    check(/doji/i.test(await p.getByTestId("browse-modal-title").textContent()), `popup: search result title @${w}`);
    await dlg.locator("h1", { hasText: "Library" }).first().waitFor({ timeout: 10000 });
    check(true, `popup: search result content loads @${w}`);
    await p.keyboard.press("Escape");
    await closed("Escape from search");
    check((await p.getByTestId("browse-search").inputValue()) === "doji", `popup: search kept after closing @${w}`);
    await open(p.locator("[data-testid='browse-section-macro-lessons'] a").first());
    await p.getByTestId("browse-modal-full").click();
    await dlg.waitFor({ state: "detached" });
    check(/\/macro\/[^/]+$/.test(new URL(p.url()).pathname), `popup: Open full page navigates (${p.url()}) @${w}`);
    check((await p.getByTestId("browse-everything").count()) === 0 && (await p.getByTestId("app-nav").count()) === 1, `popup: full page replaces Browse @${w}`);
    check((await p.evaluate(() => document.body.style.overflow)) !== "hidden", `popup: full page can scroll @${w}`);
    await p.goBack();
    await p.waitForURL(/\/browse$/);
    check((await dlg.count()) === 0, `popup: back from full page shows Browse with no dialog @${w}`);
  },
  async "Topic access: one sample per area and one deep link per kind still open after the redesign"(p, w) {
    const base0 = JSON.parse((await import("node:fs")).readFileSync(new URL("../docs/projects/navigation/topic-baseline-536eeb5.json", import.meta.url), "utf8"));
    const { CONTENT_SIM_SETS } = await load("/src/lib/contentSims.ts");
    const { TOOL_LESSONS } = await load("/src/lib/toolTraining/index.ts");
    const { CASE_STUDIES } = await load("/src/lib/caseStudies.ts");
    const { LITERACY_TERMS } = await load("/src/lib/literacyTerms.ts");
    const { listSessions } = await load("/src/lib/coaching/index.ts");
    const { QUIZ_GROUPS } = await load("/src/lib/quizData.ts");
    const simFor = (route) => {
      const set = CONTENT_SIM_SETS.find((s) => s.route === route && s.sims.length);
      if (set) return { url: route, sim: set.sims[0].id };
      const tool = TOOL_LESSONS.find((t) => t.simulations?.length);
      return { url: tool.route, sim: tool.simulations[0].id };
    };
    const sample = {
      "/academy/:unitId?check": "/academy/l1-what-is-a-share?check=1",
      "/archive?crypto": "/archive?crypto=all",
      "/archive?open": "/archive?tab=patterns&open=doji",
      "/archive?tab": "/archive?tab=indicators",
      "/archive?theme": "/archive?theme=continuation",
      "/cases?market": "/cases?market=crypto",
      "/cases?pack": "/cases?pack=forex",
      "/coach?class": "/coach?class=forex",
      "/macro/play?round": "/macro/play?round=round-cpi-14",
      "/market?class": "/market?class=crypto",
      "/market?nav": "/market?nav=1",
      "/practice/opening-range#context": "/practice/opening-range#context",
      "/practice/pattern-themes?theme": "/practice/pattern-themes?theme=gap",
      "/practice/read-the-print?round": "/practice/read-the-print?round=2",
      "/practice/statements#forecast": "/practice/statements#forecast",
      "/training?group": "/training?group=fed-policy",
      "/training?start": "/training?group=opening-range&start=1",
    };
    const urls = [];
    for (const d of base0.deepLinks) {
      const kind = `${d.route}${d.param}`;
      if (d.param === "?sim") {
        const route = d.route === "/academy/:unitId" ? CONTENT_SIM_SETS.find((s) => s.route.startsWith("/academy/")).route : d.route === "/tools/:toolId" ? null : d.route;
        const s = route ? simFor(route) : simFor("/tools/none");
        urls.push({ kind, url: `${s.url}?sim=${s.sim}`, sim: s.sim });
      } else if (d.route === "/training" && d.param.startsWith("#")) urls.push({ kind, url: `/training${d.param}` });
      else urls.push({ kind, url: sample[kind] });
    }
    check(urls.every((u) => u.url), `topics: a sample URL for every deep-link kind (${urls.filter((u) => !u.url).map((u) => u.kind)}) @${w}`);
    // One sample per area.
    const sess = listSessions();
    const areas = [
      "/academy/l3-stop-orders", "/academy/test-out/L2", "/academy/options", "/paper", "/paper/desk", "/paper/challenges/ride-the-trend",
      `/cases/${CASE_STUDIES[CASE_STUDIES.length - 1].id}`, `/coach/${sess[sess.length - 1].slug}`, "/playbooks/gap-and-go", "/macro/cpi",
      `/archive?tab=literacy&open=${LITERACY_TERMS[LITERACY_TERMS.length - 1].id}`, "/practice/technique-narratives", "/practice/energy",
      "/tools/finviz", "/map", "/practice/levels", "/practice/japanese-candles", "/practice-draw",
    ];
    const visit = async (url, label) => {
      await p.goto(base + url, { waitUntil: "domcontentloaded" });
      const heading = () => p.locator("h1, h2, [role='dialog']").first().waitFor({ timeout: 10000 }).then(() => true, () => false);
      let ok = await heading();
      // Non-equity cases sit behind the chart gate, unchanged by the redesign; its session peek opens them.
      const peek = p.getByRole("button", { name: /Open this case this session|Browse this session/ });
      if (!ok && (await peek.count())) {
        await peek.first().click();
        ok = await heading();
      }
      const path = new URL(p.url()).pathname;
      check(ok && path === url.split(/[?#]/)[0], `topics: ${label} opens ${url} (now ${path}) @${w}`);
    };
    for (const u of urls) {
      await visit(u.url, u.kind);
      if (u.sim) check(await p.locator(`[data-sim='${u.sim}']`).first().waitFor({ timeout: 10000 }).then(() => true, () => false), `topics: ${u.kind} opens its simulation @${w}`);
    }
    for (const a of areas) await visit(a, "area sample");
    // Click paths: search Browse everything for one item of each indexed kind.
    await p.goto(base + "/browse", { waitUntil: "networkidle" });
    const searches = [
      [QUIZ_GROUPS.find((g) => g.id === "fed-policy").name, "/training?group=fed-policy"],
      [sess[0].title, `/coach/${sess[0].slug}`],
      [CASE_STUDIES[0].title, `/cases/${CASE_STUDIES[0].id}`],
      ["doji", "/archive?tab=patterns&open=doji"],
      [LITERACY_TERMS[0].name, `/archive?tab=literacy&open=${LITERACY_TERMS[0].id}`],
    ];
    for (const [q, href] of searches) {
      await p.getByTestId("browse-search").fill(q);
      const n = await p.locator(`[data-testid='browse-results'] a[href$='${href}']`).count();
      check(n >= 1, `topics: Browse search "${q}" finds ${href} @${w}`);
    }
  },
  async "Header tap targets: every control is at least 44 px on a phone, compact on desktop"(p, w) {
    await p.goto(base + "/", { waitUntil: "networkidle" });
    const boxes = await p.evaluate(() => [...document.querySelectorAll("header a, header button")].filter((e) => e.offsetParent).map((e) => { const b = e.getBoundingClientRect(); return { t: (e.textContent || e.getAttribute("aria-label") || "").trim().slice(0, 20), w: b.width, h: b.height }; }));
    const header = await p.evaluate(() => document.querySelector("header").getBoundingClientRect().height);
    if (w < 768) for (const b of boxes) check(b.w >= 44 && b.h >= 44, `header: "${b.t}" is ${Math.round(b.w)}x${Math.round(b.h)} @${w}`);
    else check(header <= 60, `header: desktop row stays compact (${Math.round(header)} px) @${w}`);
    check((await overflow(p)) <= 1, `header: no sideways scroll @${w}`);
  },
  async "Page load failure: a page whose chunk fails shows a reload message, and the header stays"(_p, w) {
    // Own context: the failed import is meant to log errors, which the shared error check would count.
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 600, hasTouch: w < 600 });
    const p = await ctx.newPage();
    try {
      await p.route("**/src/pages/Archive.tsx*", (r) => r.abort());
      await p.goto(base + "/archive", { waitUntil: "networkidle" });
      const err = p.getByTestId("page-error");
      await err.waitFor({ timeout: 10000 });
      check((await err.getAttribute("role")) === "alert", `page error @${w}: role=alert`);
      check(await p.getByRole("button", { name: "Reload the page" }).isVisible(), `page error @${w}: reload button`);
      check(await p.locator("header").first().isVisible(), `page error @${w}: header still shown`);
      await p.unroute("**/src/pages/Archive.tsx*");
      await p.getByRole("button", { name: "Reload the page" }).click();
      await p.getByRole("heading", { level: 1, name: "Library" }).waitFor({ timeout: 10000 });
      check(true, `page error @${w}: reload recovers`);
    } finally {
      await ctx.close();
    }
  },
  async "Contrast: the 12 main pages meet WCAG AA text contrast in light and dark mode"(_p, w) {
    for (const theme of ["light", "dark"]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 600, hasTouch: w < 600 });
      await ctx.addInitScript((t) => {
        localStorage.setItem("analysis_core_theme_v1", t);
        localStorage.setItem("analysis_core_track_v1", JSON.stringify({ id: "charts-patterns", at: "2026-11-25T00:00:00.000Z" }));
      }, theme);
      const p = await ctx.newPage();
      try {
        for (const path of CONTRAST_PAGES) {
          await p.goto(base + path, { waitUntil: "networkidle" });
          await p.waitForTimeout(200);
          check((await p.evaluate(() => document.documentElement.classList.contains("dark"))) === (theme === "dark"), `contrast ${theme} ${path} @${w}: html class`);
          const bad = await contrastFailures(p);
          check(bad.length === 0, `contrast ${theme} ${path} @${w}: ${bad.length} under AA: ${bad.slice(0, 4).join(" | ")}`);
        }
      } finally {
        await ctx.close();
      }
    }
  },
};


try {
  for (const w of [390, 1280]) {
    for (const [name, fn] of Object.entries(flows)) {
      if (process.env.E2E_ONLY && !name.includes(process.env.E2E_ONLY)) continue;
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
