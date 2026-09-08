import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrowsePopover from "../components/BrowsePopover";
import YouTubeSearchLink from "../components/YouTubeSearchLink";
import { NAVIGATOR_CLASS_LABELS } from "../lib/marketNavigator";
import { buildPlaybookCursorPrompt, classifySourceUrl, type SourceUrlKind } from "../lib/playbookPrompt";
import { listPlaybooks } from "../lib/playbooks";
import { cn } from "../lib/utils";

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

type Pane = "library" | "create";

function CreateFromSource({
  variant,
  url,
  notes,
  copied,
  kind,
  prompt,
  openHref,
  showUrlError,
  urlError,
  onUrlChange,
  onUrlBlur,
  onNotesChange,
  onCopy,
}: {
  variant: "rail" | "page";
  url: string;
  notes: string;
  copied: boolean;
  kind: SourceUrlKind;
  prompt: string;
  openHref: string;
  showUrlError: boolean;
  urlError: string;
  onUrlChange: (value: string) => void;
  onUrlBlur: () => void;
  onNotesChange: (value: string) => void;
  onCopy: () => void;
}) {
  const actions = (
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
  );

  return (
    <section
      id="create-playbook"
      aria-labelledby="create-playbook-heading"
      className={cn(
        "space-y-5",
        variant === "rail" &&
          "panel p-4 md:p-5 md:sticky md:top-16 md:max-h-[calc(100dvh-4.5rem)] md:flex md:flex-col md:gap-6 md:space-y-0 md:overflow-hidden",
      )}
    >
      <div className="space-y-1">
        <h2
          id="create-playbook-heading"
          tabIndex={-1}
          className="text-lg font-semibold tracking-tight outline-none"
        >
          Create from a source
        </h2>
        <p className="text-sm text-muted">
          Paste a video or page URL. The prompt updates as you type. Copy it, or open it in Cursor,
          to fill the four Playbook panels from pages this app already has.
        </p>
      </div>

      <div className="space-y-3">
        <label className="flex flex-col gap-1">
          <span className="text-[12px] text-muted">Source URL</span>
          <input
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            onBlur={onUrlBlur}
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
            YouTube — the prompt asks for the transcript and description, then asks you if the
            strategy is unclear.
          </p>
        ) : kind === "webpage" ? (
          <p className="text-[12px] text-muted">
            Webpage — the prompt asks to read the page, then asks you if the strategy is unclear.
          </p>
        ) : null}
        {showUrlError ? (
          <p id="playbook-url-error" className="text-sm text-accent-red" role="alert">
            {urlError}
          </p>
        ) : null}
        <label className="flex flex-col gap-1">
          <span className="text-[12px] text-muted">What you already know (optional)</span>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={variant === "rail" ? 2 : 3}
            className="bg-surface border border-line text-ink px-3 py-2 rounded-md text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            placeholder="Market, name of the setup, or what you want taught"
          />
        </label>
      </div>

      <div
        className={cn(
          "space-y-3",
          variant === "rail" && "md:flex md:min-h-0 md:flex-1 md:flex-col",
        )}
      >
        <h3 className="text-[15px] font-semibold tracking-tight text-ink shrink-0">Prompt preview</h3>
        <pre
          className={cn(
            "overflow-auto rounded-xl border border-line bg-canvas px-4 py-3 text-[13px] leading-relaxed text-ink whitespace-pre-wrap break-words font-[ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace]",
            variant === "rail"
              ? "min-h-[5rem] md:min-h-0 md:flex-1"
              : "min-h-[12rem] max-h-[min(28rem,70vh)] mb-5",
          )}
          tabIndex={0}
          aria-label="Prompt preview"
        >
          {prompt || (
            <span className="text-muted">
              Paste a YouTube or webpage URL above. The prompt updates as you type.
            </span>
          )}
        </pre>
        {variant === "page" ? actions : null}
      </div>

      {variant === "rail" ? (
        <div className="shrink-0 -mx-4 -mb-4 border-t border-line bg-surface px-4 py-4 md:-mx-5 md:-mb-5 md:px-5">
          {actions}
        </div>
      ) : null}
    </section>
  );
}

export default function Playbooks() {
  const navigate = useNavigate();
  const playbooks = listPlaybooks();
  const [pane, setPane] = useState<Pane>("library");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);
  const [urlBlurred, setUrlBlurred] = useState(false);
  const kind = classifySourceUrl(url);
  const built = useMemo(() => buildPlaybookCursorPrompt({ url, notes }), [url, notes]);
  const prompt = built.ok ? built.prompt : "";
  const showUrlError = urlBlurred && url.trim() !== "" && !built.ok;
  const openHref = prompt ? cursorPromptHref(prompt) : "";
  const hasLibrary = playbooks.length > 0;

  const onCopy = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const createProps = {
    url,
    notes,
    copied,
    kind,
    prompt,
    openHref,
    showUrlError,
    urlError: built.ok === false ? built.error : "Need a full URL (https://…)",
    onUrlChange: (value: string) => {
      setUrl(value);
      setCopied(false);
    },
    onUrlBlur: () => setUrlBlurred(true),
    onNotesChange: (value: string) => {
      setNotes(value);
      setCopied(false);
    },
    onCopy,
  };

  const selectPane = (next: Pane) => {
    setPane(next);
    const headingId = next === "create" ? "create-playbook-heading" : "playbook-library-heading";
    requestAnimationFrame(() => {
      document.getElementById(headingId)?.focus();
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-8 space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">Playbooks</h1>
            <p className="text-muted text-sm mt-2">
              Strategy kits from a YouTube video, Medium post, or other page. SAMPLE /
              educational only — not a live desk.
            </p>
          </div>
          {hasLibrary ? (
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

        {hasLibrary ? (
          <div
            className="flex rounded-md border border-line bg-surface p-0.5 md:hidden"
            role="group"
            aria-label="Playbooks sections"
          >
            <button
              type="button"
              aria-pressed={pane === "library"}
              className={cn(
                "flex-1 px-3 py-1.5 text-sm rounded-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                pane === "library" ? "bg-primary/10 text-primary font-semibold" : "text-muted hover:text-ink",
              )}
              onClick={() => selectPane("library")}
            >
              Library
            </button>
            <button
              type="button"
              aria-pressed={pane === "create"}
              className={cn(
                "flex-1 px-3 py-1.5 text-sm rounded-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                pane === "create" ? "bg-primary/10 text-primary font-semibold" : "text-muted hover:text-ink",
              )}
              onClick={() => selectPane("create")}
            >
              Create from a source
            </button>
          </div>
        ) : (
          <p className="text-sm text-muted">
            No playbooks yet. Paste a source URL, copy the Cursor prompt, and run it in this repo so
            the kit appears here.
          </p>
        )}

        {hasLibrary ? (
          <div className="md:grid md:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)] md:gap-6 lg:gap-8 md:items-start">
            <section
              id="playbook-library"
              aria-labelledby="playbook-library-heading"
              className={cn("space-y-3", pane === "library" ? "block" : "hidden", "md:block")}
            >
              <h2
                id="playbook-library-heading"
                tabIndex={-1}
                className="text-lg font-semibold tracking-tight outline-none flex items-baseline gap-2 max-md:sr-only"
              >
                Library
                <span className="text-[12px] text-muted font-normal">{playbooks.length}</span>
              </h2>
              <ul className="space-y-3" aria-label="Playbook catalog">
                {playbooks.map((p) => (
                  <li key={p.id} className="panel p-4 hover:border-primary/40 transition-colors space-y-2">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Link to={`/playbooks/${p.id}`} className="text-lg font-semibold hover:text-primary">
                          {p.title}
                        </Link>
                        <YouTubeSearchLink title={p.title} />
                      </div>
                      <span className="text-[12px] text-muted">
                        {NAVIGATOR_CLASS_LABELS[p.assetClass]}
                      </span>
                    </div>
                    <Link to={`/playbooks/${p.id}`} className="block space-y-2">
                      <p className="text-sm text-muted">{p.summary}</p>
                      <p className="text-[12px] text-muted">{p.source.label}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <div className={cn(pane === "create" ? "block" : "hidden", "md:block")}>
              <CreateFromSource variant="rail" {...createProps} />
            </div>
          </div>
        ) : (
          <div className="max-w-2xl">
            <CreateFromSource variant="page" {...createProps} />
          </div>
        )}
      </main>
    </div>
  );
}
