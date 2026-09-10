import { useEffect, useId, useRef, useState } from "react";
import { chatGptShareUrl, claudeShareUrl } from "../lib/aiExplainPrompt";

interface Props {
  open: boolean;
  prompt: string;
  onClose: () => void;
}

function ChatGptMark() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="shrink-0">
      <circle cx="12" cy="12" r="12" fill="#10A37F" />
      <path
        fill="#fff"
        transform="translate(4.2 4.2) scale(0.65)"
        d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.2782a4.485 4.485 0 0 1 2.3655-1.9723V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 .0056l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.272zm16.5963 3.7905-5.8331-3.3879 2.0201-1.1638a.0757.0757 0 0 1 .071-.0056l4.8303 2.7913a4.4944 4.4944 0 0 1 .6538 6.8294 4.4708 4.4708 0 0 1-2.3655-1.9723V11.6a.7688.7688 0 0 0-.3947-.6813zm2.0107-3.0231-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.138 6.5376zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654 2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"
      />
    </svg>
  );
}

function ClaudeMark() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="shrink-0">
      <path
        fill="#D97757"
        d="M12.8 2.1c.5 4.4 1.6 6.8 4.8 9.1-3.2 2.3-4.3 4.7-4.8 10.7-.5-4.4-1.6-6.8-4.8-9.1 3.2-2.3 4.3-4.7 4.8-10.7Z"
      />
      <path
        fill="#C96442"
        d="M3.2 11.5c3.8-.4 6.1-1.5 8.3-4.4 2 3.1 4.4 4 8.3 4.4-3.8.4-6.1 1.5-8.3 4.4-2-3.1-4.4-4-8.3-4.4Z"
      />
    </svg>
  );
}

export default function AiExplainModal({ open, prompt, onClose }: Props) {
  const titleId = useId();
  const hintId = useId();
  const promptFieldId = `${titleId}-prompt`;
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [draft, setDraft] = useState(prompt);
  const [copied, setCopied] = useState(false);
  const [cursorHint, setCursorHint] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement as HTMLElement | null;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 0);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
      restoreRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setDraft(prompt);
    setCopied(false);
    setCursorHint(false);
  }, [open, prompt]);

  if (!open) return null;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      return;
    } catch {
      /* fall through to execCommand */
    }
    const field = document.getElementById(promptFieldId) as HTMLTextAreaElement | null;
    if (!field) {
      setCopied(false);
      return;
    }
    field.focus();
    field.select();
    const ok = document.execCommand("copy");
    setCopied(ok);
  };

  const linkClass =
    "inline-flex items-center gap-1.5 text-sm text-ink hover:opacity-80 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden bg-surface border border-line rounded-xl shadow-lg flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-surface shrink-0">
          <h2 id={titleId} className="text-lg font-semibold text-ink flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" aria-hidden>
              auto_fix_high
            </span>
            AI Explain
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="p-2 rounded hover:bg-primary/10 text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-4 overflow-y-auto min-h-0 flex-1 space-y-3">
          <label className="block text-[12px] text-muted" htmlFor={promptFieldId}>
            Prompt
          </label>
          <textarea
            id={promptFieldId}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setCopied(false);
            }}
            rows={16}
            className="w-full min-h-[14rem] rounded-xl border border-line bg-canvas px-4 py-3 text-[13px] leading-relaxed text-ink font-[ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          />
        </div>

        <div className="border-t border-line bg-surface px-4 py-3 space-y-3 shrink-0">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <button
              type="button"
              onClick={onCopy}
              className="inline-flex rounded-lg border border-line bg-surface px-3 py-1.5 text-sm text-ink hover:bg-canvas focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {copied ? "Copied" : "Copy prompt"}
            </button>
            <span className="text-sm text-ink">Open in</span>
            <a
              href={chatGptShareUrl(draft)}
              target="_blank"
              rel="noreferrer"
              className={linkClass}
            >
              <ChatGptMark />
              ChatGPT
            </a>
            <a
              href={claudeShareUrl(draft)}
              target="_blank"
              rel="noreferrer"
              className={linkClass}
            >
              <ClaudeMark />
              Claude
            </a>
            <button
              type="button"
              aria-expanded={cursorHint}
              aria-controls={hintId}
              aria-label="Cursor, how to use in Ask mode"
              onClick={() => setCursorHint((openHint) => !openHint)}
              className={linkClass}
            >
              Cursor
              <span
                className="material-symbols-outlined text-[16px] text-muted leading-none"
                aria-hidden
              >
                info
              </span>
            </button>
          </div>
          {cursorHint ? (
            <p id={hintId} className="text-sm text-muted leading-relaxed" role="note">
              Copy this prompt into Cursor for this repo. Use Ask mode so it will not change the
              codebase.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
