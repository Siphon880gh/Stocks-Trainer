import { Link } from "react-router-dom";
import { academyHomeTip } from "../../lib/academy/homeTip";
import { loadAcademy, type KVStorage } from "../../lib/academy/storage";

/** BA10.M4: one-line Home tip naming the Beginner Academy. */
export default function AcademyHomeTip({ storage }: { storage?: KVStorage }) {
  const t = academyHomeTip(loadAcademy(storage).state);
  return (
    <section className="text-[13px] text-muted" data-testid="academy-home-tip">
      <span className="material-symbols-outlined text-sm align-middle mr-1" aria-hidden>
        school
      </span>
      {t.text}{" "}
      <Link to={t.to} className="text-primary underline">
        {t.linkLabel}
      </Link>
    </section>
  );
}
