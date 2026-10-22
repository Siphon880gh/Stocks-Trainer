/**
 * Lightweight interaction smoke test (not part of `npm run verify`: it needs a browser).
 *
 *   npm run test:e2e
 *
 * Starts its own Vite dev server on a free port (never 3001), drives headless Chrome through the
 * flows the 2026-10-22 interaction QA found bugs in, at 390 and 1280 px, then stops the server.
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
