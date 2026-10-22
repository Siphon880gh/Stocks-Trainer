/**
 * BA11.M5: trade journal. One row per fill with the learner's note, exported as RFC 4180 CSV.
 * SIMULATED — virtual money, SAMPLE prices. Notes live in the session log (they do not change the replay).
 */
import type { AccountState, PaperSessionLog } from "./types";
import { TYPE_LABELS } from "./describe";

export const NOTE_MAX = 500;

export interface JournalRow {
  orderId: string;
  bar: number;
  symbol: string;
  action: string;
  order: string;
  qty: number;
  price: number;
  fee: number;
  realized: number;
  note: string;
}

const actionOf = (side: "buy" | "sell", o?: { opensShort?: boolean; covers?: boolean }) => (o?.opensShort ? "Sell short" : o?.covers ? "Buy to cover" : side === "buy" ? "Buy" : "Sell");

export function journalRows(s: AccountState, notes: Record<string, string> = {}): JournalRow[] {
  return s.fills.map((f) => {
    const o = s.orders.find((x) => x.id === f.orderId);
    return {
      orderId: f.orderId,
      bar: f.bar,
      symbol: f.symbol,
      action: actionOf(f.side, o),
      order: o ? `${TYPE_LABELS[o.type]} · ${o.tif === "day" ? "Day" : "GTC"}` : "",
      qty: f.qty,
      price: f.price,
      fee: f.fee ?? 0,
      realized: f.realized,
      note: notes[f.orderId] ?? "",
    };
  });
}

/** RFC 4180: fields with a comma, quote, CR or LF are quoted and quotes doubled; lines end with CRLF. */
export function csvField(v: string | number): string {
  const s = String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const dollars = (c: number) => (c / 100).toFixed(2);

export const CSV_HEADER = ["source", "bar", "symbol", "action", "order", "shares", "price", "fee", "realized_pnl", "note"] as const;

export function journalCsv(rows: JournalRow[]): string {
  const lines = [CSV_HEADER.join(",")];
  for (const r of rows) lines.push(["SIMULATED (SAMPLE tape)", r.bar, r.symbol, r.action, r.order, r.qty, dollars(r.price), dollars(r.fee), dollars(r.realized), r.note].map(csvField).join(","));
  return lines.join("\r\n") + "\r\n";
}

/** Set or clear (empty text) the note on a fill. Trimmed and capped at NOTE_MAX characters. */
export function sessionNote(log: PaperSessionLog, orderId: string, text: string): PaperSessionLog {
  const notes = { ...(log.notes ?? {}) };
  const t = text.trim().slice(0, NOTE_MAX);
  if (t) notes[orderId] = t;
  else delete notes[orderId];
  const { notes: _old, ...rest } = log;
  return Object.keys(notes).length ? { ...rest, notes } : rest;
}

export const journalFileName = (log: PaperSessionLog) => `paper-journal-SIMULATED-${log.tapeId}-bar${log.bar}.csv`;
