/**
 * Financial-statement, cash-forecast and earnings-expectation glossary terms (FE3.M3).
 * Spread into LITERACY_TERMS (Archive → Literacy, Flashcards, quiz "Open glossary" links).
 * Type-only import: no runtime cycle with literacyTerms.ts.
 * SAMPLE educational definitions, not investment advice.
 */
import type { LiteracyTerm } from "../literacyTerms";

export const FINANCIAL_TERMS: LiteracyTerm[] = [
  {
    id: "income-statement",
    name: "Income statement",
    category: "process",
    summary: "Sales minus costs for a period: how revenue turns into profit (or loss).",
    detail:
      "Read top to bottom: revenue → gross profit → operating income → pretax → net income → EPS. It covers a period (a quarter) and uses accrual accounting, so profit is not the same as cash. SAMPLE educational definition.",
  },
  {
    id: "balance-sheet",
    name: "Balance sheet",
    category: "process",
    summary: "A snapshot of what a company owns and owes on one date. Assets = liabilities + equity, always.",
    detail:
      "Assets (cash, receivables, inventory, factories) are funded by liabilities (payables, debt) and equity (money from owners plus kept profits). If the two sides do not match, the numbers are wrong. SAMPLE educational definition.",
  },
  {
    id: "cash-flow-statement",
    name: "Cash flow statement",
    category: "process",
    summary: "Where cash actually came from and went: operating, investing and financing.",
    detail:
      "Starts from net income, adds back non-cash costs (depreciation, stock comp), adjusts for working capital, then subtracts capex and shows borrowing, repayments, share sales and dividends. Ending cash must equal the balance-sheet cash. SAMPLE educational definition.",
  },
  {
    id: "gross-margin",
    name: "Gross margin",
    category: "process",
    summary: "Gross profit ÷ revenue: what is left after the direct cost of what was sold.",
    detail:
      "Software often runs 70–80%, retailers 30–40%, heavy industry 20–30%. A falling gross margin can mean discounting, higher input costs or fixed factory costs spread over fewer sales. SAMPLE educational definition.",
  },
  {
    id: "operating-income",
    name: "Operating income (EBIT)",
    category: "process",
    summary: "Gross profit minus operating expenses (R&D, sales, admin): profit from running the business.",
    detail:
      "Before interest and taxes, so it compares businesses with different debt loads. Operating margin = operating income ÷ revenue. SAMPLE educational definition.",
  },
  {
    id: "ebitda",
    name: "EBITDA",
    category: "process",
    summary: "Operating income plus depreciation and amortization: a rough proxy for operating cash earnings.",
    detail:
      "Lenders use it for leverage (net debt ÷ EBITDA). It ignores capex, working capital, interest and taxes, so it flatters capital-heavy companies. SAMPLE educational definition.",
  },
  {
    id: "eps",
    name: "EPS (earnings per share)",
    category: "process",
    summary: "Net income ÷ shares. Diluted EPS counts options and RSUs that could become shares.",
    detail:
      "Earnings headlines compare EPS to the consensus estimate. When a company loses money, diluted EPS uses basic shares (extra shares would make the loss look smaller). SAMPLE educational definition.",
  },
  {
    id: "accounts-receivable",
    name: "Accounts receivable & DSO",
    category: "process",
    summary: "Money customers owe for things already sold. DSO = days of sales not yet collected.",
    detail:
      "DSO = receivables ÷ revenue × days in the period. Rising DSO means cash is arriving more slowly than sales: watch for it in a cash forecast's collections line. SAMPLE educational definition.",
  },
  {
    id: "inventory-days",
    name: "Inventory & days inventory (DIO)",
    category: "process",
    summary: "Goods bought or made but not yet sold. DIO = how many days of cost sit on the shelf.",
    detail:
      "Retailers build inventory before the holidays, so a seasonal peak is normal. Inventory growing faster than sales, year over year, can foreshadow markdowns. SAMPLE educational definition.",
  },
  {
    id: "accounts-payable",
    name: "Accounts payable & DPO",
    category: "process",
    summary: "Bills the company owes suppliers. DPO = how many days it takes to pay them.",
    detail:
      "Paying suppliers later keeps cash in the business (a source of operating cash flow), but stretching too far strains suppliers. SAMPLE educational definition.",
  },
  {
    id: "working-capital",
    name: "Working capital",
    category: "process",
    summary: "Short-term assets minus short-term liabilities; changes in it move operating cash flow.",
    detail:
      "More receivables or inventory uses cash; more payables or deferred revenue supplies it. Cash conversion cycle = DSO + DIO − DPO. Current ratio = current assets ÷ current liabilities. SAMPLE educational definition.",
  },
  {
    id: "deferred-revenue",
    name: "Deferred revenue",
    category: "process",
    summary: "Cash collected for service not yet delivered. A liability now, revenue later.",
    detail:
      "Subscription companies bill up front, so growing deferred revenue lifts operating cash flow above net income. A shrinking balance can signal slowing bookings. SAMPLE educational definition.",
  },
  {
    id: "capex",
    name: "Capex (capital expenditures)",
    category: "process",
    summary: "Cash spent on long-lived assets like factories, stores and servers.",
    detail:
      "Shown in investing cash flow, not on the income statement; it hits profit slowly through depreciation. Free cash flow = operating cash flow − capex. SAMPLE educational definition.",
  },
  {
    id: "stock-based-comp",
    name: "Stock-based compensation",
    category: "process",
    summary: "Paying employees in shares or options: a real cost that uses no cash today.",
    detail:
      "Added back in operating cash flow, so cash flow can look better than profit. The cost shows up as dilution (more shares outstanding). SAMPLE educational definition.",
  },
  {
    id: "dilution",
    name: "Dilution",
    category: "ownership",
    summary: "New shares shrink each existing share's slice of the company.",
    detail:
      "Equity raises, stock comp and convertible debt add shares. A raise can save a cash-burning company but lowers EPS for the same profit. SAMPLE educational definition.",
  },
  {
    id: "net-debt",
    name: "Net debt",
    category: "process",
    summary: "Total debt minus cash. Negative net debt means more cash than borrowings.",
    detail:
      "Used with EBITDA to judge how heavy the debt is: net leverage = net debt ÷ trailing-twelve-month EBITDA. SAMPLE educational definition.",
  },
  {
    id: "net-leverage",
    name: "Net leverage (net debt ÷ EBITDA)",
    category: "process",
    summary: "How many years of EBITDA it would take to pay off net debt.",
    detail:
      "Below ~2× is usually comfortable; 3–4× is heavy for a cyclical business. Lenders often cap it in a covenant. It rises when EBITDA falls even if debt is unchanged. SAMPLE educational definition.",
  },
  {
    id: "interest-coverage",
    name: "Interest coverage",
    category: "process",
    summary: "Operating income ÷ interest expense: how many times profit covers interest.",
    detail:
      "Under ~3× leaves little room if sales drop. SAMPLE educational definition.",
  },
  {
    id: "debt-covenant",
    name: "Debt covenant",
    category: "process",
    summary: "A promise to lenders, e.g. keep leverage under 3.5× or cash above a minimum.",
    detail:
      "Breaking one can let lenders demand repayment or raise the rate. Companies watch covenants in their cash forecasts and may draw a revolver or cut spending to avoid a breach. SAMPLE educational definition.",
  },
  {
    id: "cash-burn",
    name: "Cash burn & runway",
    category: "process",
    summary: "Burn = cash lost per month. Runway = months until cash runs out at that pace.",
    detail:
      "Runway = cash ÷ monthly burn (here, burn from negative free cash flow). Short runway often means an equity raise or a pivot to profitability, both of which move the stock. SAMPLE educational definition.",
  },
  {
    id: "thirteen-week-cash-flow",
    name: "13-week cash flow forecast",
    category: "process",
    summary: "A week-by-week plan of cash in and out for the next quarter.",
    detail:
      "Rows: collections and other receipts in; payroll, suppliers, rent, marketing, taxes, debt service and capex out. Net = in − out; ending cash = beginning + net (+ revolver draws). Treasurers use it to spot a cash dip weeks before it happens. SAMPLE educational definition.",
  },
  {
    id: "revolver",
    name: "Revolver (revolving credit line)",
    category: "process",
    summary: "A bank credit line a company can draw and repay as needed, up to a limit.",
    detail:
      "Used to cover short dips, e.g. a big interest payment or holiday inventory. Drawing heavily on it can be an early warning sign. SAMPLE educational definition.",
  },
  {
    id: "minimum-cash",
    name: "Minimum cash balance",
    category: "process",
    summary: "The cash floor a company (or its lender) wants to keep at all times.",
    detail:
      "In a 13-week forecast, any week that ends below the floor is flagged as a breach so treasury can act early. SAMPLE educational definition.",
  },
  {
    id: "consensus-estimate",
    name: "Consensus estimate",
    category: "markets",
    summary: "The average analyst forecast for EPS or revenue: the bar a report is judged against.",
    detail:
      "Beat = actual above consensus; miss = below. Stocks react to the gap between results and expectations, not to whether results are good in absolute terms. SAMPLE educational definition.",
  },
  {
    id: "earnings-surprise",
    name: "Earnings surprise",
    category: "markets",
    summary: "(Actual − estimate) ÷ |estimate|: how far results landed from the bar.",
    detail:
      "Small beats are routine. Guidance and the quality of the beat (revenue vs one-off cost cuts) often matter more than the headline EPS surprise. SAMPLE educational definition.",
  },
  {
    id: "guidance-raise-cut",
    name: "Guidance raise / cut",
    category: "markets",
    summary: "Management raising or lowering its own forecast for coming quarters.",
    detail:
      "A beat with a guidance cut often sells off; a miss with a raise can rally. Compare the new range's midpoint to consensus for next quarter. SAMPLE educational definition.",
  },
  {
    id: "post-earnings-drift",
    name: "Post-earnings drift",
    category: "markets",
    summary: "The tendency of a stock to keep moving in the direction of a big surprise for days or weeks.",
    detail:
      "Also called PEAD. Not guaranteed: many gaps fill instead. In the Read the Print game it is one of six reaction shapes. SAMPLE educational definition, not a trading signal.",
  },
  {
    id: "earnings-gap",
    name: "Earnings gap (hold vs fill)",
    category: "markets",
    summary: "The jump between yesterday's close and the open after a report, and whether it holds.",
    detail:
      "Gap-and-go: the gap holds and extends. Gap fill: price drifts back to the prior close. Volume on the gap day is usually several times normal. SAMPLE educational definition.",
  },
  {
    id: "kpi",
    name: "KPI (key performance indicator)",
    category: "process",
    summary: "A company-specific number investors track besides profit: retention, same-store sales, backlog.",
    detail:
      "Earnings previews list the KPIs that matter for each business. A KPI miss can sink a stock even when EPS beats. SAMPLE educational definition.",
  },
  {
    id: "implied-move",
    name: "Implied move",
    category: "markets",
    summary: "The report-day move options prices expect, as ±%. A move inside it is 'muted'.",
    detail:
      "Roughly the price of the at-the-money straddle ÷ the stock price. Compare the actual move to it: bigger means the news surprised. SAMPLE educational definition, not an options strategy.",
  },
  {
    id: "pre-earnings-run-up",
    name: "Pre-earnings run-up",
    category: "markets",
    summary: "A rally in the days before a report. Raises the bar: good news may already be priced in.",
    detail:
      "After a big run-up, an ordinary beat often sells off ('sell the news'). After a sell-off into the print, the bar is lower. SAMPLE educational definition.",
  },
  {
    id: "positioning",
    name: "Positioning",
    category: "markets",
    summary: "How many investors already own (or are short) a stock going into news.",
    detail:
      "Crowded longs have fewer buyers left after good news; underweight funds chasing a surprise can fuel post-earnings drift. SAMPLE educational definition.",
  },
  {
    id: "volume-spike",
    name: "Volume spike",
    category: "markets",
    summary: "Trading volume several times normal, typical on an earnings gap day.",
    detail:
      "Report-day volume is often 3–6× the 20-day average. A gap on heavy volume that holds is a stronger signal than one on light volume. SAMPLE educational definition.",
  },
];
