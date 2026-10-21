import type { ReleaseEvent } from "../../../lib/macro/releases";
import { ClaimsViewer, EmploymentSituationViewer, JoltsViewer } from "./LaborViewers";
import { CpiViewer, PceViewer, PpiViewer } from "./PriceViewers";
import { DotPlotViewer, FomcStatementViewer } from "./RatesViewers";
import { HousingStartsViewer, PmmsViewer } from "./HousingViewers";
import { GdpViewer, IsmViewer, RetailSalesViewer, SentimentViewer } from "./ActivityViewers";
import { meetingByMonth } from "../../../lib/macro/fed";

/** The SIMULATED look-alike page for one release event. */
export default function ViewerForEvent({ event }: { event: ReleaseEvent }) {
  const m = event.month;
  switch (event.kind) {
    case "payrolls": return <EmploymentSituationViewer month={m} />;
    case "claims": return <ClaimsViewer week={event.week!} />;
    case "jolts": return <JoltsViewer month={m} />;
    case "cpi": return <CpiViewer month={m} />;
    case "ppi": return <PpiViewer month={m} />;
    case "pce": return <PceViewer month={m} />;
    case "gdp": return <GdpViewer quarter={event.quarter!} />;
    case "retail": return <RetailSalesViewer month={m} />;
    case "ism-mfg": return <IsmViewer month={m} kind="mfg" />;
    case "ism-services": return <IsmViewer month={m} kind="services" />;
    case "sentiment": return <SentimentViewer month={m} />;
    case "housing-starts": return <HousingStartsViewer month={m} />;
    case "pmms": return <PmmsViewer week={event.week!} />;
    case "fomc":
      return (
        <div className="space-y-4">
          <FomcStatementViewer month={m} />
          {meetingByMonth(m)?.sep && <DotPlotViewer month={m} />}
        </div>
      );
  }
}
