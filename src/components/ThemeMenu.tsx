import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { THEME_PREFS, useTheme, type ThemePref } from "../lib/theme";
import { cn } from "../lib/utils";
import { Z } from "../lib/zLayers";

const LABEL: Record<ThemePref, string> = { light: "Light", dark: "Dark", system: "System" };
const ICON: Record<ThemePref, string> = { light: "light_mode", dark: "dark_mode", system: "contrast" };

/** Light / Dark / System picker in the header. System follows the device and is the default. */
export default function ThemeMenu({ className }: { className?: string }) {
  const { pref, theme, setPref } = useTheme();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const items = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!open) return;
    items.current[THEME_PREFS.indexOf(pref)]?.focus();
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
    // Runs when the menu opens: focus the checked item, close on an outside press.
  }, [open]);

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) button.current?.focus();
  };
  const choose = (p: ThemePref) => {
    setPref(p);
    close();
  };
  const onMenuKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const i = items.current.findIndex((el) => el === document.activeElement);
    const n = THEME_PREFS.length;
    const go = (j: number) => items.current[(j + n) % n]?.focus();
    if (e.key === "ArrowDown") (e.preventDefault(), go(i + 1));
    else if (e.key === "ArrowUp") (e.preventDefault(), go(i - 1));
    else if (e.key === "Home") (e.preventDefault(), go(0));
    else if (e.key === "End") (e.preventDefault(), go(n - 1));
    else if (e.key === "Escape") (e.preventDefault(), close());
    else if (e.key === "Tab") close(false);
  };

  const current = pref === "system" ? `System (${theme})` : LABEL[pref];
  return (
    <div ref={wrap} className={cn("relative", className)}>
      <button
        ref={button}
        type="button"
        data-testid="theme-button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Theme: ${current}`}
        title={`Theme: ${current}`}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex min-h-11 min-w-11 md:min-h-9 md:min-w-9 items-center justify-center rounded-md text-muted hover:bg-canvas hover:text-ink"
      >
        <span className="material-symbols-outlined text-[20px]" aria-hidden>
          {ICON[pref]}
        </span>
      </button>
      {open ? (
        <div
          role="menu"
          aria-label="Theme"
          data-testid="theme-menu"
          onKeyDown={onMenuKey}
          style={{ zIndex: Z.popover }}
          className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-line bg-surface p-1 shadow-lg"
        >
          {THEME_PREFS.map((p, i) => (
            <button
              key={p}
              ref={(el) => {
                items.current[i] = el;
              }}
              type="button"
              role="menuitemradio"
              aria-checked={pref === p}
              tabIndex={pref === p ? 0 : -1}
              data-theme-option={p}
              onClick={() => choose(p)}
              className={cn(
                "flex w-full min-h-11 md:min-h-9 items-center gap-2 rounded-md px-2.5 text-left text-sm",
                pref === p ? "bg-primary/10 font-semibold text-primary" : "text-ink hover:bg-canvas",
              )}
            >
              <span className="material-symbols-outlined text-[18px]" aria-hidden>
                {ICON[p]}
              </span>
              <span className="flex-1">{LABEL[p]}</span>
              {p === "system" ? <span className="text-xs font-normal text-muted">Device</span> : null}
              {pref === p ? (
                <span className="material-symbols-outlined text-[18px]" aria-hidden>
                  check
                </span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
