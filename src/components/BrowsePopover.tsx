import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { cn } from "../lib/utils";

export interface BrowseItem {
  id: string;
  label: string;
  hint?: string;
  disabled?: boolean;
}

type SortMode = "usual" | "az" | "za";

const SORT_NEXT: Record<SortMode, SortMode> = {
  usual: "az",
  az: "za",
  za: "usual",
};

const SORT_LABEL: Record<SortMode, string> = {
  usual: "Sort",
  az: "A–Z",
  za: "Z–A",
};

const SORT_STATE: Record<SortMode, string> = {
  usual: "usual order",
  az: "alphabetically",
  za: "reverse alphabetically",
};

function sortedItems(items: BrowseItem[], mode: SortMode): BrowseItem[] {
  if (mode === "usual") return items;
  const next = [...items].sort((a, b) =>
    a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
  );
  if (mode === "za") next.reverse();
  return next;
}

function itemMatches(item: BrowseItem, query: string): boolean {
  const n = query.trim().toLowerCase();
  if (!n) return true;
  if (item.label.toLowerCase().includes(n)) return true;
  return Boolean(item.hint?.toLowerCase().includes(n));
}

function filteredItems(items: BrowseItem[], query: string, mode: SortMode): BrowseItem[] {
  const n = query.trim().toLowerCase();
  const pool = n ? items.filter((item) => itemMatches(item, n)) : items;
  if (!n) return sortedItems(pool, mode);
  const prefix: BrowseItem[] = [];
  const rest: BrowseItem[] = [];
  for (const item of pool) {
    if (item.label.toLowerCase().startsWith(n)) prefix.push(item);
    else rest.push(item);
  }
  if (mode === "usual") return [...prefix, ...rest];
  return [...sortedItems(prefix, mode), ...sortedItems(rest, mode)];
}

function nextEnabledIndex(items: BrowseItem[], from: number, dir: 1 | -1): number {
  const len = items.length;
  if (len === 0) return -1;
  if (from < 0) {
    if (dir === 1) {
      const i = items.findIndex((item) => !item.disabled);
      return i;
    }
    for (let i = len - 1; i >= 0; i--) {
      if (!items[i].disabled) return i;
    }
    return -1;
  }
  let i = from;
  for (let step = 0; step < len; step++) {
    i = (i + dir + len) % len;
    if (!items[i].disabled) return i;
  }
  return from < len && !items[from].disabled ? from : -1;
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-primary/15 text-inherit rounded-[1px] p-0">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

interface BrowsePopoverProps {
  title: string;
  items: BrowseItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
  triggerLabel?: string;
}

export default function BrowsePopover({
  title,
  items,
  selectedId,
  onSelect,
  triggerLabel = "Browse",
}: BrowsePopoverProps) {
  const listId = useId();
  const listboxId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selectedRef = useRef<HTMLLIElement>(null);
  const activeRef = useRef<HTMLLIElement>(null);
  const queryRef = useRef("");
  const [open, setOpen] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("usual");
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  const searching = query.trim().length > 0;
  const visible = useMemo(
    () => filteredItems(items, query, sortMode),
    [items, query, sortMode],
  );

  const close = () => {
    setOpen(false);
    setQuery("");
    setActiveIndex(-1);
  };

  const pick = (item: BrowseItem) => {
    if (item.disabled) return;
    onSelect(item.id);
    close();
  };

  const clearSearch = () => {
    setQuery("");
    setActiveIndex(-1);
    searchRef.current?.focus();
  };

  useLayoutEffect(() => {
    if (!open) return;
    const wrap = wrapRef.current;
    const panel = panelRef.current;
    if (!wrap || !panel) return;

    const place = () => {
      const trigger = wrap.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      const pad = 8;
      const gap = 6;
      let left = trigger.right - panelRect.width;
      if (left < pad) left = pad;
      if (left + panelRect.width > window.innerWidth - pad) {
        left = window.innerWidth - panelRect.width - pad;
      }
      const spaceBelow = window.innerHeight - trigger.bottom - pad;
      const openAbove =
        spaceBelow < panelRect.height && trigger.top - gap - panelRect.height > pad;
      const top = openAbove
        ? trigger.top - gap - panelRect.height
        : trigger.bottom + gap;
      setCoords({ top, left });
    };

    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, visible.length, sortMode, searching]);

  useEffect(() => {
    if (!open) return;
    const node = searching ? activeRef.current : selectedRef.current;
    node?.scrollIntoView({ block: "nearest" });
  }, [open, selectedId, sortMode, searching, activeIndex]);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => searchRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    const queryChanged = queryRef.current !== query;
    queryRef.current = query;
    if (!query.trim()) {
      if (queryChanged) setActiveIndex(-1);
      return;
    }
    setActiveIndex((i) => {
      if (queryChanged) return visible.findIndex((item) => !item.disabled);
      if (i >= 0 && i < visible.length && !visible[i]?.disabled) return i;
      return visible.findIndex((item) => !item.disabled);
    });
  }, [query, visible]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      const t = e.target;
      if (!(t instanceof Node)) return;
      if (wrapRef.current?.contains(t)) return;
      close();
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (query.trim()) {
        e.preventDefault();
        clearSearch();
        return;
      }
      close();
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, query]);

  const onSearchKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => nextEnabledIndex(visible, i, 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => nextEnabledIndex(visible, i, -1));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const item = activeIndex >= 0 ? visible[activeIndex] : visible.find((row) => !row.disabled);
      if (item) pick(item);
      return;
    }
    if (e.key === "Escape") {
      if (query) {
        e.preventDefault();
        e.stopPropagation();
        clearSearch();
      }
    }
  };

  const activeId =
    activeIndex >= 0 && visible[activeIndex]
      ? `${listboxId}-${visible[activeIndex].id}`
      : undefined;

  return (
    <div ref={wrapRef} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          if (open) close();
          else setOpen(true);
        }}
        className={cn(
          "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[13px] border transition-colors",
          open
            ? "border-primary/40 bg-primary/10 text-primary font-semibold"
            : "border-line text-ink hover:bg-canvas",
        )}
      >
        {triggerLabel}
      </button>
      {open ? (
        <div
          ref={panelRef}
          id={listId}
          role="dialog"
          aria-label={title}
          className="fixed z-[80] w-[min(22rem,calc(100vw-1.5rem))] rounded-md border border-line bg-surface shadow-md"
          style={
            coords
              ? { top: coords.top, left: coords.left }
              : { visibility: "hidden", top: 0, left: 0 }
          }
        >
          <div className="flex items-center gap-2 px-3 py-2 border-b border-line">
            <p className="min-w-0 flex-1 text-sm font-semibold tracking-tight">
              {title}
            </p>
            <button
              type="button"
              onClick={() => setSortMode((m) => SORT_NEXT[m])}
              className="shrink-0 inline-flex items-center gap-1 text-[12px] text-muted hover:text-ink px-1.5 py-1 rounded-md hover:bg-canvas min-h-6"
              aria-label={`Sort, currently ${SORT_STATE[sortMode]}. Click to sort ${SORT_STATE[SORT_NEXT[sortMode]]}`}
              title={`Currently ${SORT_STATE[sortMode]}`}
            >
              <span className="material-symbols-outlined text-[16px] leading-none" aria-hidden>
                sort
              </span>
              {SORT_LABEL[sortMode]}
            </button>
          </div>
          <div className="px-2 pt-2">
            <div className="flex items-center gap-1 rounded-md border border-line bg-canvas px-2 focus-within:border-primary/50">
              <span
                className="material-symbols-outlined text-[16px] text-muted leading-none"
                aria-hidden
              >
                search
              </span>
              <input
                ref={searchRef}
                type="text"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={open}
                aria-controls={listboxId}
                aria-activedescendant={activeId}
                aria-label={`Search ${title}`}
                placeholder={`Search ${title.toLowerCase()}`}
                value={query}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onSearchKeyDown}
                className="min-w-0 flex-1 bg-transparent py-1.5 text-[13px] text-ink outline-none placeholder:text-muted"
              />
              {searching ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="shrink-0 inline-flex items-center justify-center size-6 rounded-md text-muted hover:text-ink hover:bg-surface"
                >
                  <span className="material-symbols-outlined text-[16px] leading-none" aria-hidden>
                    close
                  </span>
                </button>
              ) : null}
            </div>
          </div>
          <ul
            id={listboxId}
            role="listbox"
            aria-label={searching ? `${title} matches` : title}
            className={cn(
              "max-h-[min(22rem,calc(100vh-8rem))] overflow-y-auto py-1",
              searching
                ? "mx-2 mt-1 mb-2 rounded-md border border-line bg-surface overflow-hidden"
                : "mt-1",
            )}
          >
            {visible.length === 0 ? (
              <li role="presentation">
                <p className="px-3 py-3 text-[13px] text-muted" role="status">
                  {searching ? "No matches." : "Nothing to browse."}
                </p>
              </li>
            ) : (
              visible.map((item, index) => {
                const selected = item.id === selectedId;
                const active = index === activeIndex;
                return (
                  <li
                    key={item.id}
                    id={`${listboxId}-${item.id}`}
                    ref={
                      active
                        ? activeRef
                        : selected && !searching
                          ? selectedRef
                          : undefined
                    }
                    role="option"
                    aria-selected={active}
                    aria-disabled={item.disabled || undefined}
                    onMouseEnter={() => {
                      if (!item.disabled) setActiveIndex(index);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pick(item)}
                    className={cn(
                      "px-3 py-2 text-sm transition-colors",
                      item.disabled
                        ? "text-muted cursor-not-allowed"
                        : "cursor-pointer",
                      !item.disabled && active
                        ? "bg-canvas"
                        : !item.disabled && selected
                          ? "bg-primary/10"
                          : !item.disabled
                            ? "hover:bg-canvas"
                            : "",
                      selected && !item.disabled ? "text-ink font-semibold" : "text-ink",
                    )}
                  >
                    <span className="block leading-snug">
                      <HighlightedText text={item.label} query={query} />
                    </span>
                    {item.hint ? (
                      <span className="block text-[12px] text-muted font-normal mt-0.5">
                        <HighlightedText text={item.hint} query={query} />
                      </span>
                    ) : null}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
