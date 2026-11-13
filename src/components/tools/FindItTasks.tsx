import { Fragment, useState } from "react";
import { checkFindTask, nowStamp, taskFormatHint, toolTextPlain, type FindTaskRecord, type ToolTask } from "../../lib/toolTraining";
import { ToolTextView } from "./Simulation";

/**
 * "Find it yourself" (Tool Training): open the live page, type the value and the page's time stamp, check. The
 * check is format and plausibility only; live values move, so there is no exact answer. Records come from the
 * lesson page (saved per lesson).
 */
export function FindItTasks({
  tasks,
  records,
  onRecord,
}: {
  tasks: ToolTask[];
  records: Record<string, FindTaskRecord>;
  onRecord: (id: string, rec: FindTaskRecord) => void;
}) {
  if (!tasks.length) return null;
  const done = tasks.filter((t) => records[t.id]?.ok).length;
  return (
    <section className="panel p-4 space-y-3 text-[13px]" data-testid="tool-tasks">
      <div>
        <p className="font-semibold text-[14px]">Find it yourself: {tasks.length} tasks on the live tools</p>
        <p className="text-[11px] text-muted">
          Open each link in a new tab, find the field, then type what you saw and the time stamp on the page (or when you looked). Live values move, so the check is the format and a plausible range, not an exact number.
        </p>
        <p className="text-[11px] text-muted" data-testid="tool-tasks-count">{done} of {tasks.length} recorded</p>
      </div>
      {tasks.map((t) => <Fragment key={t.id}><TaskRow task={t} record={records[t.id]} onRecord={(r) => onRecord(t.id, r)} /></Fragment>)}
    </section>
  );
}

function TaskRow({ task, record, onRecord }: { task: ToolTask; record?: FindTaskRecord; onRecord: (r: FindTaskRecord) => void }) {
  const [value, setValue] = useState(record?.value ?? "");
  const [stamp, setStamp] = useState(record?.stamp ?? "");
  const [problems, setProblems] = useState<string[] | null>(null);
  const label = toolTextPlain(task.find);
  const check = () => {
    const r = checkFindTask(task, value, stamp);
    setProblems(r.problems);
    if (r.ok) onRecord({ value: value.trim(), stamp: stamp.trim(), checkedAt: new Date().toISOString(), ok: true });
  };
  const saved = record?.ok && problems === null;
  return (
    <div className="panel p-3 space-y-2" data-task={task.id}>
      <p className="font-medium text-[12px]"><ToolTextView text={task.find} /></p>
      <p className="text-[12px]">
        <a href={task.live.url} target="_blank" rel="noopener noreferrer" className="text-primary underline" data-live-tool={task.live.tool}>
          Open {task.live.label} on {task.live.tool}
        </a>
        <span className="sr-only"> (opens in a new tab)</span>
        <span className="text-muted"> · {task.where}</span>
      </p>
      <div className="flex flex-wrap gap-2 items-end">
        <label className="text-[11px] text-muted flex flex-col gap-0.5">
          Value you found
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={task.answer.example}
            aria-label={`${label}: value`}
            className="px-2 py-1 rounded border bg-transparent text-[12px] text-ink w-40"
          />
        </label>
        <label className="text-[11px] text-muted flex flex-col gap-0.5">
          Time stamp on the page
          <input
            value={stamp}
            onChange={(e) => setStamp(e.target.value)}
            placeholder="Nov 12 • 4:00 PM ET"
            aria-label={`${label}: time stamp`}
            className="px-2 py-1 rounded border bg-transparent text-[12px] text-ink w-48"
          />
        </label>
        <button type="button" onClick={() => setStamp(nowStamp())} className="px-2 py-1 rounded border text-[11px]">Use the time now</button>
        <button type="button" onClick={check} className="px-2 py-1 rounded border border-primary text-primary text-[12px]">Check</button>
      </div>
      <p className="text-[11px] text-muted">{taskFormatHint(task.answer)}</p>
      {problems && problems.length ? (
        <ul className="text-[12px] list-disc pl-5" role="status" data-task-problems>
          {problems.map((p) => <li key={p}>{p}</li>)}
        </ul>
      ) : null}
      {(problems && !problems.length) || saved ? (
        <p className="text-[12px]" role="status" data-task-ok>
          Recorded: {record?.value ?? value} · {record?.stamp ?? stamp}. The format and range look right. {task.why}
        </p>
      ) : null}
    </div>
  );
}
