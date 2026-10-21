import type { LessonViewer as Spec } from "../../lib/macro/lessons";
import { getRelease } from "../../lib/macro/releases";
import ViewerForEvent from "./viewers/ViewerForEvent";
import { DotPlotViewer, FomcStatementViewer, FredSeriesViewer, TreasuryCurveViewer } from "./viewers/RatesViewers";

export default function LessonViewer({ spec }: { spec: Spec }) {
  switch (spec.type) {
    case "event": {
      const e = getRelease(spec.eventId);
      return e ? <ViewerForEvent event={e} /> : null;
    }
    case "fred": return <FredSeriesViewer seriesId={spec.seriesId} end={spec.end} window={720} />;
    case "curve": return <TreasuryCurveViewer day={spec.day} />;
    case "statement": return <FomcStatementViewer month={spec.month} />;
    case "dots": return <DotPlotViewer month={spec.month} />;
  }
}
