import { Children, cloneElement, isValidElement, useEffect, useState, type ReactElement, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

export interface TocGroupProps {
  id: string;
  label: string;
  /** Extra hashes that open this group, such as a panel inside it. */
  aliases?: string[];
  hidden?: boolean;
  children: ReactNode;
}

/** One group of Table of Contents panels. The carousel shows one group at a time. */
export function TocGroup({ id, hidden, children }: TocGroupProps) {
  return (
    <div id={id} hidden={hidden} data-toc-group={id} className="w-full flex flex-col items-center gap-6">
      {children}
    </div>
  );
}

function slideProps(node: ReactNode): TocGroupProps | null {
  if (!isValidElement<TocGroupProps>(node)) return null;
  return node.props;
}

/** Dots and chevrons that reveal one group of panels at a time. The address hash selects the group. */
export default function PanelCarousel({ children }: { children: ReactNode }) {
  const slides = Children.toArray(children).filter((node) => slideProps(node));
  const { hash } = useLocation();
  const navigate = useNavigate();
  const indexFor = (value: string) => {
    const id = value.replace(/^#/, "");
    if (!id) return 0;
    const found = slides.findIndex((node) => {
      const props = slideProps(node);
      return props?.id === id || props?.aliases?.includes(id);
    });
    return found >= 0 ? found : 0;
  };
  const [index, setIndex] = useState(() => indexFor(hash));
  useEffect(() => {
    setIndex(indexFor(hash));
  }, [hash, slides.length]);
  const go = (next: number) => {
    const count = slides.length;
    if (!count) return;
    const i = (next + count) % count;
    const id = slideProps(slides[i])?.id;
    setIndex(i);
    if (id) navigate({ hash: id }, { replace: true });
  };
  const active = slideProps(slides[index]);
  return (
    <div className="w-full max-w-xl space-y-3" data-testid="toc-carousel" data-active={active?.id ?? ""}>
      <div className="flex items-center gap-2" data-toc-controls="">
        <button
          type="button"
          aria-label="Previous group"
          onClick={() => go(index - 1)}
          className="grid place-items-center w-9 h-9 rounded-full border border-line bg-surface text-ink hover:bg-canvas"
        >
          <span className="material-symbols-outlined" aria-hidden>chevron_left</span>
        </button>
        <p className="flex-1 text-center text-sm font-semibold">{active?.label}</p>
        <button
          type="button"
          aria-label="Next group"
          onClick={() => go(index + 1)}
          className="grid place-items-center w-9 h-9 rounded-full border border-line bg-surface text-ink hover:bg-canvas"
        >
          <span className="material-symbols-outlined" aria-hidden>chevron_right</span>
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1.5" role="tablist" aria-label="Panel groups">
        {slides.map((node, i) => {
          const props = slideProps(node)!;
          const on = i === index;
          return (
            <button
              key={props.id}
              type="button"
              role="tab"
              aria-selected={on}
              aria-label={props.label}
              onClick={() => go(i)}
              className="grid place-items-center w-8 h-8"
            >
              <span className={cn("block rounded-full", on ? "w-2.5 h-2.5 bg-primary" : "w-2 h-2 bg-line")} />
            </button>
          );
        })}
      </div>
      {slides.map((node, i) => cloneElement(node as ReactElement<TocGroupProps>, { hidden: i !== index, key: slideProps(node)!.id }))}
    </div>
  );
}
