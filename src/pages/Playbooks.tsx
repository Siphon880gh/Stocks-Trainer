import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrowsePopover from "../components/BrowsePopover";
import { NAVIGATOR_CLASS_LABELS } from "../lib/marketNavigator";
import { buildPlaybookCursorPrompt, classifySourceUrl } from "../lib/playbookPrompt";
import { listPlaybooks } from "../lib/playbooks";

function cursorPromptHref(prompt: string): string {
  const href = new URL("https://cursor.com/link/prompt");
  href.searchParams.set("text", prompt);
  return href.toString();
}

function CursorMark() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" className="shrink-0">
      <path
        fill="currentColor"
        d="M2.2 1.4v13.2l3.7-3.2 1.7 4.1 2.3-1-1.7-4 4.6-1.1L2.2 1.4z"
      />
    </svg>
  );
}

export default function Playbooks() {
  const navigate = useNavigate();
  const playbooks = listPlaybooks();
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);
  const [urlBlurred, setUrlBlurred] = useState(false);
  const kind = classifySourceUrl(url);
  const built = useMemo(() => buildPlaybookCursorPrompt({ url, notes }), [url, notes]);
  const prompt = built.ok ? built.prompt : "";
  const showUrlError = urlBlurred && url.trim() !== "" && !built.ok;
  const openHref = prompt ? cursorPromptHref(prompt) : "";

  const onCopy = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-grow max-w-3xl mx-auto w-full px-6 py-8 space-y-8">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">Playbooks</h1>
            <p className="text-muted text-sm mt-2">
              Strategy kits from a YouTube video, Medium post, or other page. SAMPLE /
              educational only — not a live desk.
            </p>
          </div>
          {playbooks.length > 0 ? (
            <BrowsePopover
              title="Playbooks"
              items={playbooks.map((p) => ({
                id: p.id,
                label: p.title,
                hint: `${NAVIGATOR_CLASS_LABELS[p.assetClass]} · ${p.source.label}`,
              }))}
              onSelect={(id) => navigate(`/playbooks/${id}`)}
            />
          ) : null}
        </div>

        {playbooks.length === 0 ? (
          <p className="text-sm text-muted">
            No playbooks yet. Paste a source URL below, copy the Cursor prompt, and run
            it in this repo so the kit appears here.
          </p>
        ) : (
          <ul className="space-y-4" aria-label="Playbook catalog">
            {playbooks.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/playbooks/${p.id}`}
                  className="block panel p-4 hover:border-primary/40 transition-colors space-y-2"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="text-lg font-semibold">{p.title}</h2>
                    <span className="text-[12px] text-muted">
                      {NAVIGATOR_CLASS_LABELS[p.assetClass]}
                    </span>
                  </div>
                  <p className="text-sm text-muted">{p.summary}</p>
                  <p className="text-[12px] text-muted">{p.source.label}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <section className="space-y-5" aria-labelledby="create-playbook-heading">
          <div className="space-y-1">
            <h2 id="create-playbook-heading" className="text-lg font-semibold tracking-tight">
              Create from a source
            </h2>
            <p className="text-sm text-muted">
              Paste a video or page URL. The prompt updates as you type. Copy it, or open
              it in Cursor, to fill the four Playbook panels from pages this app already
              has.
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex flex-col gap-1">
              <span className="text-[12px] text-muted">Source URL</span>
              <input
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setCopied(false);
                }}
                onBlur={() => setUrlBlurred(true)}
                placeholder="https://www.youtube.com/watch?v=… or a Medium URL"
                className="bg-surface border border-line text-ink px-3 py-2 rounded-md text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                inputMode="url"
                autoComplete="url"
                aria-invalid={showUrlError}
                aria-describedby={showUrlError ? "playbook-url-error" : undefined}
              />
            </label>
            {kind === "youtube" ? (
              <p className="text-[12px] text-muted">
                YouTube — the prompt asks for the transcript and description, then asks
                you if the strategy is unclear.
              </p>
            ) : kind === "webpage" ? (
              <p className="text-[12px] text-muted">
                Webpage — the prompt asks to read the page, then asks you if the
                strategy is unclear.
              </p>
            ) : null}
            {showUrlError ? (
              <p id="playbook-url-error" className="text-sm text-accent-red" role="alert">
                {built.ok === false ? built.error : "Need a full URL (https://…)"}
              </p>
            ) : null}
            <label className="flex flex-col gap-1">
              <span className="text-[12px] text-muted">What you already know (optional)</span>
              <textarea
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  setCopied(false);
                }}
                rows={3}
                className="bg-surface border border-line text-ink px-3 py-2 rounded-md text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                placeholder="Market, name of the setup, or what you want taught"
              />
            </label>
          </div>

          <div className="space-y-3">
            <h3 className="text-[15px] font-semibold tracking-tight text-ink">Prompt preview</h3>
            <pre
              className="min-h-[12rem] max-h-[min(28rem,70vh)] overflow-auto rounded-xl border border-line bg-canvas px-4 py-3 text-[13px] leading-relaxed text-ink whitespace-pre-wrap break-words font-[ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace]"
              tabIndex={0}
              aria-label="Prompt preview"
            >
              {prompt || (
                <span className="text-muted">
                  Paste a YouTube or webpage URL above. The prompt updates as you type.
                </span>
              )}
            </pre>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onCopy}
                disabled={!prompt}
                className="inline-flex rounded-lg border border-line bg-surface px-3 py-1.5 text-sm text-ink hover:bg-canvas disabled:opacity-40 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {copied ? "Copied" : "Copy prompt"}
              </button>
              {prompt ? (
                <a
                  href={openHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-ink hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
                >
                  <CursorMark />
                  <span>
                    Open in <span className="font-semibold">Cursor</span>
                  </span>
                  <span
                    className="material-symbols-outlined text-[16px] text-muted leading-none"
                    title="Opens Cursor with this prompt pre-filled. Review it before it runs."
                    aria-hidden
                  >
                    info
                  </span>
                </a>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm text-muted opacity-50">
                  <CursorMark />
                  <span>
                    Open in <span className="font-semibold">Cursor</span>
                  </span>
                  <span className="material-symbols-outlined text-[16px] leading-none" aria-hidden>
                    info
                  </span>
                </span>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
