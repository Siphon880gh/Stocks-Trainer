/**
 * Network check for every "Visit the real source" URL (npm run check:macro-sources).
 * Not part of test:macro (needs network). Bot-blocked hosts may answer 403; that is accepted only
 * when SOURCES.md has a dated manual verification row for the source. FRED ids are confirmed via fredgraph.csv.
 */
import { readFileSync } from "node:fs";
import { MACRO_SOURCES } from "./sources";
import { manuallyVerified, parseVerificationLog } from "./sourcesLog";

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";

/** Retries transient 5xx / network errors (census.gov returns sporadic 500s) up to 4 times with backoff. */
async function status(url: string): Promise<number> {
  let code = 0;
  for (let i = 0; i < 4; i++) {
    code = await once(url);
    if (code !== 0 && code < 500) break;
    await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
  }
  return code;
}

async function once(url: string): Promise<number> {
  try {
    const res = await fetch(url, { redirect: "follow", headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20000) });
    return res.status;
  } catch {
    return 0;
  }
}

async function main() {
  const md = readFileSync(new URL("../../../docs/projects/macro-forces/SOURCES.md", import.meta.url), "utf8");
  const log = parseVerificationLog(md);
  let failed = 0;
  for (const s of MACRO_SOURCES) {
    let code = await status(s.url);
    let note = "";
    if (s.fredSeries) {
      const csv = await fetch(`https://fred.stlouisfed.org/graph/fredgraph.csv?id=${s.fredSeries}`, { signal: AbortSignal.timeout(20000) })
        .then((r) => r.text())
        .catch(() => "");
      note = csv.startsWith(`observation_date,${s.fredSeries}`) ? "fred id ok" : "fred id NOT confirmed";
      if (!note.endsWith("ok")) failed++;
    }
    let ok = code >= 200 && code < 400;
    if (!ok && s.botBlocked && (code === 403 || code === 0)) {
      const row = manuallyVerified(s, log);
      if (row) {
        ok = true;
        note = `${note ? note + "; " : ""}bot-blocked, manually verified ${row.date}`;
      }
    }
    if (!ok) failed++;
    console.log(`${ok ? "ok  " : "FAIL"} ${String(code).padStart(3)} ${s.id} ${note}`);
  }
  console.log(`${MACRO_SOURCES.length - failed}/${MACRO_SOURCES.length} sources ok`);
  process.exit(failed ? 1 : 0);
}

void main();
