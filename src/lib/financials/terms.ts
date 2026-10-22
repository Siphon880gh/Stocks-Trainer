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
  /* ---- FE8.M1: banks ---- */
  {
    id: "net-interest-income",
    name: "Net interest income (NII)",
    category: "process",
    summary: "Interest a bank earns on loans and securities minus the interest it pays on deposits and borrowings.",
    detail:
      "NII is most of a typical bank's revenue. It grows when the loan book grows or when the spread widens (asset yields rise faster than funding costs) and shrinks when deposit costs catch up. SAMPLE educational definition.",
  },
  {
    id: "net-interest-margin",
    name: "Net interest margin (NIM)",
    category: "process",
    summary: "Annualized net interest income ÷ average earning assets: the bank's spread, in percent.",
    detail:
      "A NIM of 3.4% means each $100 of loans, securities and cash earns about $3.40 a year more than the bank pays for its funding. Watch the direction: a few basis points a quarter matter at bank scale. SAMPLE educational definition.",
  },
  {
    id: "deposit-beta",
    name: "Deposit beta",
    category: "markets",
    summary: "How much of a central-bank rate change a bank passes on to depositors.",
    detail:
      "A beta of 40% means a 1-point rate rise lifts deposit costs by about 0.4 points. Betas tend to start low and climb as savers move to higher-paying accounts, which is why margins can shrink well after rates stop rising. SAMPLE educational definition.",
  },
  {
    id: "efficiency-ratio",
    name: "Efficiency ratio",
    category: "process",
    summary: "Non-interest expense ÷ net revenue. Lower is better: it is the cost of producing each dollar of revenue.",
    detail:
      "Around 55–65% is common for regional banks. The ratio rises when revenue falls faster than costs (for example when the margin compresses), even if spending is flat. SAMPLE educational definition.",
  },
  {
    id: "ppnr",
    name: "Pre-provision net revenue (PPNR)",
    category: "process",
    summary: "Net revenue minus non-interest expense, before the provision for bad loans: a bank's core earning power.",
    detail:
      "PPNR is the cushion that absorbs credit losses. Analysts compare it with expected losses: if PPNR easily covers a bad year of charge-offs, capital is protected. SAMPLE educational definition.",
  },
  {
    id: "provision-for-credit-losses",
    name: "Provision for credit losses",
    category: "process",
    summary: "The expense a bank books to top up its reserve for loans it expects to go bad.",
    detail:
      "It is a non-cash expense when booked (added back in cash from operations). Under expected-loss accounting it reflects losses the bank expects over the life of its loans, so it can jump before any loan is actually written off. SAMPLE educational definition.",
  },
  {
    id: "net-charge-offs",
    name: "Net charge-offs (NCOs)",
    category: "process",
    summary: "Loans written off as uncollectable, minus recoveries. Usually shown annualized as a percent of loans.",
    detail:
      "Charge-offs are the losses actually realized; they reduce both gross loans and the allowance, not earnings directly. Earnings are hit through the provision that refills the allowance. SAMPLE educational definition.",
  },
  {
    id: "reserve-build",
    name: "Reserve build / release",
    category: "process",
    summary: "Provision above net charge-offs grows the loan-loss reserve (a build); below them it shrinks it (a release).",
    detail:
      "Provision ÷ net charge-offs above 1× is a build: the bank expects worse credit ahead. Builds lower EPS today; a release later flatters EPS. Separate the one-off reserve build from the run-rate earnings. SAMPLE educational definition.",
  },
  {
    id: "allowance-for-credit-losses",
    name: "Allowance for credit losses",
    category: "process",
    summary: "The reserve set aside against the loan book. Net loans = gross loans − allowance.",
    detail:
      "Allowance this quarter = last quarter + provision − net charge-offs. Allowance ÷ loans shows how much loss the bank has already reserved for. SAMPLE educational definition.",
  },
  {
    id: "nonperforming-loans",
    name: "Non-performing loans (NPLs)",
    category: "process",
    summary: "Loans where the borrower has stopped paying (typically 90+ days late or on non-accrual).",
    detail:
      "Rising NPLs are an early warning: charge-offs usually follow a few quarters later. Compare them with the allowance to see how much cushion is left. SAMPLE educational definition.",
  },
  {
    id: "loan-to-deposit",
    name: "Loan-to-deposit ratio",
    category: "process",
    summary: "Gross loans ÷ deposits: how much of its deposit base a bank has lent out.",
    detail:
      "Around 80–90% is common. Very high ratios mean the bank leans on costlier borrowings; very low ratios mean idle funding earning less. SAMPLE educational definition.",
  },
  {
    id: "bank-deposits",
    name: "Deposits (bank funding)",
    category: "process",
    summary: "Customer money a bank holds. For a bank, deposits are a liability and its main, cheapest source of funding.",
    detail:
      "When deposits leave, the bank must shrink, sell securities or borrow at higher rates. Deposit inflows show up in financing cash flow, and new loans in investing cash flow. SAMPLE educational definition.",
  },
  {
    id: "cet1-ratio",
    name: "CET1 ratio",
    category: "process",
    summary: "Common equity tier 1 capital ÷ risk-weighted assets: the main measure of a bank's loss-absorbing capital.",
    detail:
      "Regulators set minimums plus buffers (often 7%+ in total for smaller banks, more for large ones). Real CET1 has many adjustments; this app's version is simplified (equity − goodwill ÷ loans + 20% of securities). SAMPLE educational definition.",
  },
  {
    id: "return-on-equity",
    name: "Return on equity (ROE)",
    category: "process",
    summary: "Annualized net income ÷ shareholders' equity: profit generated per dollar of owners' capital.",
    detail:
      "For banks, ROE above the cost of equity (often ~10%) is what justifies trading above book value. A provision build or a squeezed margin lowers it. SAMPLE educational definition.",
  },
  {
    id: "tangible-book-value",
    name: "Tangible book value per share",
    category: "process",
    summary: "(Equity − goodwill and intangibles) ÷ shares. Banks are often valued as a multiple of it.",
    detail:
      "Price ÷ tangible book (P/TBV) is a standard bank valuation. Goodwill is removed because it cannot absorb losses in a crisis. SAMPLE educational definition.",
  },
  /* ---- FE8.M1: biotech ---- */
  {
    id: "royalty-revenue",
    name: "Royalty revenue",
    category: "process",
    summary: "A percentage of a partner's sales of a licensed product, booked as revenue with almost no cost of goods.",
    detail:
      "A 12% royalty on 50,000k of partner sales is 6,000k of revenue. The company does not control the sales, so partner destocking or pricing changes flow straight into its revenue. SAMPLE educational definition.",
  },
  {
    id: "clinical-trial-phases",
    name: "Clinical trial phases",
    category: "process",
    summary: "Phase 1 tests safety, Phase 2 dose and early efficacy, Phase 3 efficacy at scale before a regulator decides.",
    detail:
      "Each phase costs more and takes longer. Many programs that enter Phase 1 never reach approval, which is why pipeline value is uncertain until data arrive. SAMPLE educational definition.",
  },
  {
    id: "topline-readout",
    name: "Topline readout",
    category: "markets",
    summary: "The first public release of a trial's main results: did it hit its primary endpoint or not?",
    detail:
      "For a small biotech one readout can move the stock 30–70% in a day, in either direction. The full data come later, at a medical meeting or in a paper. SAMPLE educational definition.",
  },
  {
    id: "primary-endpoint",
    name: "Primary endpoint",
    category: "process",
    summary: "The main pre-specified result a trial is designed to test, such as a symptom score or survival.",
    detail:
      "A trial 'succeeds' when the primary endpoint is statistically significant versus the control arm. Wins on secondary endpoints rarely rescue a missed primary. SAMPLE educational definition.",
  },
  {
    id: "binary-event",
    name: "Binary event",
    category: "markets",
    summary: "News with two very different outcomes, like a trial readout or a regulatory decision. It cannot be read from charts.",
    detail:
      "The price gaps to a new level and often does not fill. Because the move can be larger than any stop, position size, not a stop-loss, is the main risk control. SAMPLE educational definition.",
  },
  {
    id: "at-the-market-offering",
    name: "At-the-market (ATM) offering",
    category: "ownership",
    summary: "A company quietly sells new shares into the market over time at the going price.",
    detail:
      "ATMs raise money gradually and with less price impact than a big deal, but they still dilute holders. Check share count growth each quarter. SAMPLE educational definition.",
  },
  {
    id: "follow-on-offering",
    name: "Follow-on offering",
    category: "ownership",
    summary: "A large sale of new shares by an already-public company, usually priced at a discount to the last close.",
    detail:
      "Biotechs often raise right after good data, when the price is high and fewer shares are needed. The stock typically dips toward the offer price the next day. SAMPLE educational definition.",
  },
  {
    id: "cash-runway",
    name: "Cash runway",
    category: "process",
    summary: "Months of operations the company can fund from its cash at the current burn rate: cash ÷ monthly burn.",
    detail:
      "Under about 18–24 months, the market expects a share sale soon, which can weigh on the price. Companies extend runway by cutting programs, partnering or raising money. SAMPLE educational definition.",
  },
];
