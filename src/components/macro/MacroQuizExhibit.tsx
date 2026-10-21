import type { MacroExhibit } from "../../lib/macro/quiz/exhibit";
import { getRelease } from "../../lib/macro/releases";
import ExpectationsPanel from "./ExpectationsPanel";
import FedPricingCard from "./FedPricingCard";
import ReactionChartView from "./ReactionChartView";
import ViewerForEvent from "./viewers/ViewerForEvent";
import { DotPlotViewer, TreasuryCurveViewer } from "./viewers/RatesViewers";
import { PmmsViewer } from "./viewers/HousingViewers";

/** Quiz exhibit for macro questions (MF7). Charts reveal their outcome / annotations only after submit. */
export default function MacroQuizExhibit({ exhibit, revealed = false }: { exhibit: MacroExhibit; revealed?: boolean }) {
  switch (exhibit.kind) {
    case "release": {
      const e = getRelease(exhibit.eventId);
      if (!e) return null;
      return (
        <div className="space-y-3">
          <ExpectationsPanel event={e} revealed hideRead={!revealed} />
          {exhibit.showViewer && <ViewerForEvent event={e} />}
        </div>
      );
    }
    case "reaction": {
      const e = getRelease(exhibit.eventId);
      if (!e) return null;
      return (
        <div className="space-y-3">
          {exhibit.mode === "predict" && <ExpectationsPanel event={e} revealed hideRead={!revealed} />}
          <ReactionChartView eventId={e.id} instrument={exhibit.instrument} revealed={exhibit.mode === "classify" || revealed} annotate={revealed} height={260} />
        </div>
      );
    }
    case "curve": return <TreasuryCurveViewer day={exhibit.day} />;
    case "pmms": return <PmmsViewer week={exhibit.week} />;
    case "pricing": return <FedPricingCard month={exhibit.month} />;
    case "dots": return <DotPlotViewer month={exhibit.month} />;
  }
}
