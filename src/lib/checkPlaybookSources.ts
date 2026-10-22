/**
 * Network check for every Playbook resource link (npm run check:playbook-sources).
 * Not part of verify (needs network). YouTube links are confirmed through oEmbed so a removed
 * video fails even though watch?v= pages answer 200.
 */
import { PLAYBOOKS } from "./playbooks";

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";

async function once(url: string): Promise<number> {
  try {
    const res = await fetch(url, { redirect: "follow", headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20000) });
    return res.status;
  } catch {
    return 0;
  }
}

async function status(url: string): Promise<number> {
  let code = 0;
  for (let i = 0; i < 3; i++) {
    code = await once(url);
    if (code !== 0 && code < 500) break;
    await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
  }
  return code;
}

async function main() {
  let failed = 0;
  for (const p of PLAYBOOKS) {
    const target =
      p.source.kind === "youtube"
        ? `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(p.source.url)}`
        : p.source.url;
    const code = await status(target);
    const ok = code >= 200 && code < 400;
    if (!ok) failed++;
    console.log(`${ok ? "ok  " : "FAIL"} ${String(code).padStart(3)} ${p.id} ${p.source.url}`);
  }
  console.log(`${PLAYBOOKS.length - failed}/${PLAYBOOKS.length} playbook sources ok`);
  process.exit(failed ? 1 : 0);
}

void main();
