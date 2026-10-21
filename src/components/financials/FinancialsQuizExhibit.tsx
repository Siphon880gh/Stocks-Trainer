import CandlestickChart from "../CandlestickChart";
import { companyById } from "../../lib/financials/companies";
import { applyWhatIf, computeForecast } from "../../lib/financials/cashForecast";
import { forecastById } from "../../lib/financials/cashForecastFixtures";
import { eventById } from "../../lib/financials/earningsEvents";
import { FIN_DISCLAIMER } from "../../lib/financials/format";
import type { FinancialsExhibit } from "../../lib/financials/quizExhibit";
import { EVENT_INDEX, generateReaction, revealAnnotations } from "../../lib/financials/reactionCharts";
import BalanceSheetTable from "./BalanceSheetTable";
import CashFlowTable from "./CashFlowTable";
import CashForecastTable from "./CashForecastTable";
import EarningsPreviewCard from "./EarningsPreviewCard";
import IncomeStatementTable from "./IncomeStatementTable";
import { metricRows } from "./rows";
import StatementTable from "./StatementTable";

interface Props {
  exhibit: FinancialsExhibit;
  /** True after the answer is submitted: reaction charts add their teaching annotations. */
  revealed?: boolean;
}

/** Renders a quiz question's financial exhibit (FE6). Returns null for unknown ids. */
export default function FinancialsQuizExhibit({ exhibit, revealed = false }: Props) {
  const body = (() => {
    switch (exhibit.kind) {
      case "statement": {
        const company = companyById(exhibit.companyId);
        if (!company) return null;
        const p = { company, start: exhibit.start, count: exhibit.count, highlightColumn: exhibit.highlightColumn };
        if (exhibit.tab === "income") return <IncomeStatementTable {...p} />;
        if (exhibit.tab === "balance") return <BalanceSheetTable {...p} />;
        if (exhibit.tab === "cashflow") return <CashFlowTable {...p} />;
        return (
          <StatementTable
            title={`Metrics · ${company.ticker}`}
            columns={company.quarters.slice(exhibit.start, exhibit.start + exhibit.count).map((q) => q.label)}
            rows={metricRows(company, exhibit.start, exhibit.count)}
            highlightColumn={exhibit.highlightColumn}
            unitLabel={null}
          />
        );
      }
      case "forecast": {
        const input = forecastById(exhibit.forecastId);
        if (!input) return null;
        const result = computeForecast(exhibit.whatIf ? applyWhatIf(input, exhibit.whatIf) : input);
        return <CashForecastTable result={result} showCallout={false} hideBreachCues={!revealed} />;
      }
      case "preview": {
        const event = eventById(exhibit.eventId);
        if (!event) return null;
        return <EarningsPreviewCard event={event} revealActuals={exhibit.revealActuals} compact />;
      }
      case "reaction": {
        const event = eventById(exhibit.eventId);
        if (!event) return null;
        const rc = generateReaction(event);
        const full = exhibit.bars === "full";
        const data = full ? rc.bars : rc.bars.slice(0, EVENT_INDEX);
        const ann = full && revealed ? revealAnnotations(rc, event).annotations : undefined;
        return (
          <div data-exhibit-bars={data.length}>
            <p className="text-[10px] text-muted px-1 pb-1">
              SAMPLE chart · {full ? "around the report (with volume)" : "the 30 sessions before the report"}
              {full && !revealed ? " · teaching marks appear after you answer" : ""}
            </p>
            <CandlestickChart
              data={data}
              height={260}
              showVolume
              showScaleControls={false}
              highlightIndex={exhibit.highlightIndex ?? (full ? EVENT_INDEX : undefined)}
              annotations={ann}
            />
          </div>
        );
      }
    }
  })();
  if (!body) return null;
  return (
    <div className="space-y-1" data-financials-exhibit={exhibit.kind}>
      {body}
      <p className="text-[10px] text-muted px-1">{FIN_DISCLAIMER}</p>
    </div>
  );
}
