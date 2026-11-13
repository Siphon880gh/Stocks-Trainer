import { Fragment, useState } from "react";
import { fillWorkflowNote, toolTextPlain, workflowProgress, type ToolWorkflow } from "../../lib/toolTraining";
import { ToolTextView } from "./Simulation";

/**
 * A guided multi-tool workflow (capstone part 2): numbered steps with live links and inputs on the left, the
 * research note filling in on the right. Values come from the lesson page (saved per lesson).
 */
export function WorkflowPanel({
  workflow,
  values,
  onChange,
}: {
  workflow: ToolWorkflow;
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const lines = fillWorkflowNote(workflow, values);
  const { filled, total } = workflowProgress(workflow, values);
  const copy = () => {
    const text = [workflow.noteTitle, ...lines].join("\n");
    void navigator.clipboard?.writeText(text).then(() => setCopied(true), () => setCopied(false));
  };
  return (
    <section className="panel p-4 space-y-3 text-[13px]" data-testid="tool-workflow">
      <div>
        <p className="font-semibold text-[14px]">{workflow.title}</p>
        <p className="text-[11px] text-muted">{workflow.intro}</p>
        <p className="text-[11px] text-muted" data-testid="workflow-progress">{filled} of {total} fields filled</p>
      </div>
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <ol className="space-y-3 list-decimal pl-5">
          {workflow.steps.map((st) => (
            <li key={st.id} className="space-y-1" data-workflow-step={st.id}>
              <p className="font-medium text-[12px]">{st.title}</p>
              <ul className="text-[12px] space-y-0.5">
                {st.do.map((d) => <li key={toolTextPlain(d)}><ToolTextView text={d} /></li>)}
              </ul>
              <p className="text-[12px] space-x-2">
                {st.live.map((l) => (
                  <Fragment key={l.url}>
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-primary underline" data-live-tool={l.tool}>
                      {l.tool}: {l.label} ↗
                    </a>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </Fragment>
                ))}
              </p>
              <div className="flex flex-col gap-1">
                {st.fields.map((f) => (
                  <label key={f.key} className="text-[11px] text-muted flex flex-col gap-0.5">
                    {f.label}
                    <input
                      value={values[f.key] ?? ""}
                      onChange={(e) => onChange(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      aria-label={f.label}
                      data-workflow-field={f.key}
                      className="px-2 py-1 rounded border bg-transparent text-[12px] text-ink"
                    />
                  </label>
                ))}
              </div>
            </li>
          ))}
        </ol>
        <div className="panel p-3 space-y-2 md:sticky md:top-4 self-start">
          <p className="font-medium text-[12px]">{workflow.noteTitle}</p>
          <ul className="text-[12px] space-y-1" data-testid="workflow-note" aria-live="polite">
            {lines.map((l, i) => <li key={i}>{l}</li>)}
          </ul>
          <button type="button" onClick={copy} className="px-2 py-1 rounded border text-[11px]">
            {copied ? "Copied" : "Copy note"}
          </button>
          <p className="text-[11px] text-muted">Placeholders show the dated example reads; blanks (____) are still to fill. Examples, not recommendations.</p>
        </div>
      </div>
    </section>
  );
}
