import { useCallback, useSyncExternalStore } from "react";

/** Light, dark, or follow the device. Stored as a plain string under THEME_KEY; missing or unknown means "system". */
export type ThemePref = "light" | "dark" | "system";
export type Theme = "light" | "dark";
export const THEME_KEY = "analysis_core_theme_v1";
export const THEME_PREFS: readonly ThemePref[] = ["light", "dark", "system"];
const DARK_QUERY = "(prefers-color-scheme: dark)";

type KV = Pick<Storage, "getItem" | "setItem">;
const storage = (): KV | null => {
  try {
    return typeof localStorage === "undefined" ? null : localStorage;
  } catch {
    return null;
  }
};

/** Reads the saved choice; anything unreadable falls back to "system". */
export function readThemePref(kv: KV | null = storage()): ThemePref {
  let v: string | null = null;
  try {
    v = kv?.getItem(THEME_KEY) ?? null;
  } catch {
    v = null;
  }
  const clean = v?.replace(/"/g, "");
  return clean === "light" || clean === "dark" ? clean : "system";
}

export function writeThemePref(pref: ThemePref, kv: KV | null = storage()): void {
  try {
    kv?.setItem(THEME_KEY, pref);
  } catch {
    /* private mode or full storage: the choice lasts for this page only */
  }
}

export function resolveTheme(pref: ThemePref, systemDark: boolean): Theme {
  return pref === "system" ? (systemDark ? "dark" : "light") : pref;
}

export function systemPrefersDark(): boolean {
  return typeof matchMedia === "function" && matchMedia(DARK_QUERY).matches;
}

/** Sets the `dark` class, `data-theme` and `color-scheme` on <html> (the same thing the inline script in index.html does before React mounts). */
export function applyTheme(theme: Theme, root: HTMLElement | null = typeof document === "undefined" ? null : document.documentElement): void {
  if (!root) return;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

// A tiny store so every toggle and the <html> class agree, and "system" follows OS changes live.
let pref: ThemePref = readThemePref();
const listeners = new Set<() => void>();
const current = () => resolveTheme(pref, systemPrefersDark());
const emit = () => {
  applyTheme(current());
  listeners.forEach((l) => l());
};

export function setThemePref(next: ThemePref): void {
  pref = next;
  writeThemePref(next);
  emit();
}

let started = false;
/** Applies the saved theme and starts following the device setting (called once from main.tsx). */
export function startTheme(): void {
  if (started || typeof window === "undefined") return;
  started = true;
  pref = readThemePref();
  applyTheme(current());
  if (typeof matchMedia === "function") matchMedia(DARK_QUERY).addEventListener("change", () => pref === "system" && emit());
  // Another tab changed the choice.
  window.addEventListener("storage", (e) => {
    if (e.key !== THEME_KEY) return;
    pref = readThemePref();
    emit();
  });
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  let mq: MediaQueryList | null = null;
  if (typeof matchMedia === "function") {
    mq = matchMedia(DARK_QUERY);
    mq.addEventListener("change", l);
  }
  return () => {
    listeners.delete(l);
    mq?.removeEventListener("change", l);
  };
};
const snapshot = () => `${pref}:${current()}`;
const serverSnapshot = () => "system:light";

export function useTheme(): { pref: ThemePref; theme: Theme; setPref: (p: ThemePref) => void } {
  const snap = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [p, t] = snap.split(":") as [ThemePref, Theme];
  const setPref = useCallback((next: ThemePref) => setThemePref(next), []);
  return { pref: p, theme: t, setPref };
}
