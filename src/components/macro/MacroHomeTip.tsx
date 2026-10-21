import { Link } from "react-router-dom";
import { macroHomeTip } from "../../lib/macro/homeTip";
import { loadMacroProgress, type MacroProgress } from "../../lib/macro/macroProgress";

/** MF9.M3: one-line Home tip naming the Macro Desk. */
export default function MacroHomeTip({ progress }: { progress?: MacroProgress }) {
  const t = macroHomeTip(progress ?? loadMacroProgress());
  return (
    <section className="text-[13px] text-muted" data-testid="macro-home-tip">
      <span className="material-symbols-outlined text-sm align-middle mr-1" aria-hidden>
        public
      </span>
      {t.text}{" "}
      <Link to={t.to} className="text-primary underline">
        {t.linkLabel}
      </Link>
    </section>
  );
}
