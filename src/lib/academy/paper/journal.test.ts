import { test } from "node:test";
import assert from "node:assert/strict";
import { CSV_HEADER, NOTE_MAX, csvField, journalCsv, journalFileName, journalRows, sessionNote } from "./journal";
import { newSessionLog, replay, sessionPlace, sessionStep, START_BAR } from "./session";

function log0() {
  let log = newSessionLog("trend-up", 1_000_000, START_BAR, { feeCents: 100 });
  log = sessionPlace(log, { symbol: "TRWL.S", side: "buy", type: "market", qty: 10, tif: "day" }).log;
  log = sessionStep(log, 2);
  log = sessionPlace(log, { symbol: "TRWL.S", side: "sell", type: "limit", limitPrice: 5400, qty: 10, tif: "gtc" }).log;
  return sessionStep(log, 3);
}

test("RFC 4180 fields: plain stays plain; comma, quote, CR and LF are quoted with quotes doubled", () => {
  assert.equal(csvField("plain"), "plain");
  assert.equal(csvField(12.5), "12.5");
  assert.equal(csvField("a,b"), '"a,b"');
  assert.equal(csvField('say "hi"'), '"say ""hi"""');
  assert.equal(csvField("line1\nline2"), '"line1\nline2"');
  assert.equal(csvField("x\r\ny"), '"x\r\ny"');
});

test("journal rows follow the fills; notes attach by order id and never change the replay", () => {
  const log = log0();
  const before = replay(log);
  const noted = sessionNote(sessionNote(log, "o1", "  Breakout over the range, stop under it, \"textbook\"  "), "o2", "Target hit");
  assert.deepEqual(replay(noted), before, "notes are not actions");
  const rows = journalRows(before, noted.notes);
  assert.equal(rows.length, 2);
  assert.equal(rows[0]!.action, "Buy");
  assert.equal(rows[0]!.fee, 100);
  assert.equal(rows[0]!.note, 'Breakout over the range, stop under it, "textbook"');
  assert.equal(rows[1]!.action, "Sell");
  assert.equal(rows[1]!.realized, before.fills[1]!.realized);
  assert.equal(sessionNote(noted, "o1", "   ").notes!.o1, undefined, "an empty note clears it");
  assert.equal(sessionNote(sessionNote(log, "o1", "x"), "o1", "").notes, undefined);
  assert.equal(sessionNote(log, "o1", "y".repeat(NOTE_MAX + 50)).notes!.o1!.length, NOTE_MAX);
});

test("CSV export: header, one CRLF line per fill, dollars with 2 decimals, labelled SIMULATED, parses back", () => {
  const log = sessionNote(log0(), "o1", 'Entry, "why": trend\nsecond line');
  const csv = journalCsv(journalRows(replay(log), log.notes));
  assert.ok(csv.endsWith("\r\n"));
  assert.ok(csv.startsWith(CSV_HEADER.join(",") + "\r\n"));
  assert.match(csv, /SIMULATED \(SAMPLE tape\),11,TRWL\.S,Buy,Market · Day,10,\d+\.\d{2},1\.00,0\.00,"Entry, ""why"": trend\nsecond line"\r\n/);
  // Minimal RFC 4180 parser: the export round-trips.
  const rows: string[][] = [];
  let row: string[] = [], f = "", q = false;
  for (let i = 0; i < csv.length; i++) {
    const c = csv[i]!;
    if (q) {
      if (c === '"' && csv[i + 1] === '"') (f += '"'), i++;
      else if (c === '"') q = false;
      else f += c;
    } else if (c === '"') q = true;
    else if (c === ",") row.push(f), (f = "");
    else if (c === "\r" && csv[i + 1] === "\n") row.push(f), rows.push(row), (row = []), (f = ""), i++;
    else f += c;
  }
  assert.equal(rows.length, 3);
  assert.ok(rows.every((r) => r.length === CSV_HEADER.length));
  assert.equal(rows[1]![9], 'Entry, "why": trend\nsecond line');
  assert.equal(journalFileName(log), "paper-journal-SIMULATED-trend-up-bar15.csv");
});
