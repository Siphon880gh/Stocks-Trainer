import { useSearchParams } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import CashForecastPanel from "../../components/financials/CashForecastPanel";
import StatementReader, { type ReaderTab } from "../../components/financials/StatementReader";

const TABS: ReaderTab[] = ["income", "balance", "cashflow", "metrics", "story"];

/** Learn → Statements lab: read three fictional companies' statements (FE1) and 13-week cash forecasts (FE2). */
export default function StatementsLab() {
  const [params] = useSearchParams();
  const tabParam = params.get("tab") as ReaderTab | null;
  const companyParam = params.get("company") ?? undefined;
  const all = params.get("all") === "1";
  const forecastParam = params.get("forecast") ?? undefined;
  const whatIf = {
    delayCollections: params.get("delay") === "1" || undefined,
    deferCapex: params.get("defer") === "1" || undefined,
    useRevolver: params.get("revolver") === "0" ? false : undefined,
  };
  return (
    <PracticeShell
      title="Statements lab"
      blurb="Read the income statement, balance sheet and cash flow statement of three fictional companies, then a 13-week cash forecast. Every number ties out; tap an underlined line for its glossary entry."
    >
      <div key={`${companyParam ?? ""}-${tabParam ?? ""}-${all}`}>
        <StatementReader
          initialCompanyId={companyParam}
          initialTab={tabParam && TABS.includes(tabParam) ? tabParam : "income"}
          initialLatestFour={!all}
        />
      </div>
      <div id="forecast" className="pt-4 space-y-2">
        <h2 className="text-[15px] font-semibold text-ink">13-week cash forecast</h2>
        <p className="text-[13px] text-muted">
          Treasurers plan cash week by week: what comes in, what goes out, and whether cash stays above the floor. Spot the bad week before
          it happens, then try the what-ifs.
        </p>
        <div key={`${forecastParam ?? ""}-${JSON.stringify(whatIf)}`}>
          <CashForecastPanel initialId={forecastParam} initialWhatIf={whatIf} />
        </div>
      </div>
    </PracticeShell>
  );
}
