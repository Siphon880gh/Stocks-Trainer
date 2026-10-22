import { useState } from "react";
import type { AccountState, PaperSessionLog } from "../../../lib/academy/paper/types";
import { NOTE_MAX, journalCsv, journalFileName, journalRows, sessionNote } from "../../../lib/academy/paper/journal";
import { money, signedMoney } from "../../../lib/academy/paper/describe";

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

/** BA11.M5: one row per fill with a note box, plus CSV export. SIMULATED. */
export default function JournalPanel({ state, log, onLog }: { state: AccountState; log: PaperSessionLog; onLog: (log: PaperSessionLog) => void }) {
  const rows = journalRows(state, log.notes);
  const [draft, setDraft] = useState<Record<string, string>>({});
  return (
    <section className="panel p-3 space-y-2" aria-label="Trade journal" data-testid="journal">
      <div className="flex items-center gap-2">
        <p className="font-semibold text-[13px] flex-1">Trade journal</p>
        <button type="button" disabled={!rows.length} onClick={() => download(journalFileName(log), journalCsv(rows))} className="px-2 py-1 rounded-md border border-line text-[12px] disabled:opacity-40" data-testid="journal-csv">
          Export CSV
        </button>
      </div>
      <p className="text-[12px] text-muted">Write why you took each fill and what you would do differently. Reviewing your own notes is how a plan improves.</p>
      {rows.length === 0 ? <p className="text-[12px] text-muted">No fills yet.</p> : null}
      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.orderId} className="text-[12px] space-y-1" data-fill={r.orderId}>
            <p className="tabular-nums">
              Bar {r.bar} · {r.action} {r.qty} {r.symbol} at {money(r.price)}
              {r.fee ? ` · fee ${money(r.fee)}` : ""}
              {r.realized ? ` · realized ${signedMoney(r.realized)}` : ""}
            </p>
            <textarea
              className="w-full border border-line rounded-md px-2 py-1 text-[12px]"
              rows={2}
              maxLength={NOTE_MAX}
              placeholder="Why this trade? Plan, stop, what happened…"
              value={draft[r.orderId] ?? r.note}
              onChange={(e) => setDraft({ ...draft, [r.orderId]: e.target.value })}
              onBlur={() => {
                const text = draft[r.orderId];
                if (text !== undefined && text.trim() !== r.note) onLog(sessionNote(log, r.orderId, text));
              }}
              data-testid={`note-${r.orderId}`}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
