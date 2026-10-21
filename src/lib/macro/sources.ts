import type { MacroSource } from "./types";

/** Official public pages each macro lesson links to. Must match docs/projects/macro-forces/SOURCES.md 1:1 (sources.test.ts). */
export const MACRO_SOURCES: MacroSource[] = [
  { id: "bls-empsit", agency: "BLS", title: "Employment Situation Summary", url: "https://www.bls.gov/news.release/empsit.nr0.htm", releaseTimeET: "8:30 a.m., usually first Friday", botBlocked: true },
  { id: "bls-cpi", agency: "BLS", title: "Consumer Price Index Summary", url: "https://www.bls.gov/news.release/cpi.nr0.htm", releaseTimeET: "8:30 a.m.", botBlocked: true },
  { id: "bls-ppi", agency: "BLS", title: "Producer Price Index News Release summary", url: "https://www.bls.gov/news.release/ppi.nr0.htm", releaseTimeET: "8:30 a.m.", botBlocked: true },
  { id: "bls-jolts", agency: "BLS", title: "Job Openings and Labor Turnover Summary", url: "https://www.bls.gov/news.release/jolts.nr0.htm", releaseTimeET: "10:00 a.m.", botBlocked: true },
  { id: "bls-schedule", agency: "BLS", title: "Schedule of selected releases", url: "https://www.bls.gov/schedule/news_release/", botBlocked: true },
  { id: "dol-claims", agency: "DOL", title: "Unemployment Insurance Weekly Claims (PDF)", url: "https://www.dol.gov/ui/data.pdf", releaseTimeET: "8:30 a.m. Thursday", botBlocked: true },
  { id: "dol-claims-data", agency: "DOL / ETA", title: "Weekly claims data", url: "https://oui.doleta.gov/unemploy/claims.asp", botBlocked: false },
  { id: "bea-gdp", agency: "BEA", title: "Gross Domestic Product", url: "https://www.bea.gov/data/gdp/gross-domestic-product", releaseTimeET: "8:30 a.m.", botBlocked: false },
  { id: "bea-pce", agency: "BEA", title: "PCE Price Index", url: "https://www.bea.gov/data/personal-consumption-expenditures-price-index", releaseTimeET: "8:30 a.m.", botBlocked: false },
  { id: "bea-income", agency: "BEA", title: "Personal Income and Outlays", url: "https://www.bea.gov/data/income-saving/personal-income", releaseTimeET: "8:30 a.m.", botBlocked: false },
  { id: "bea-schedule", agency: "BEA", title: "Release schedule", url: "https://www.bea.gov/news/schedule", botBlocked: false },
  { id: "fed-fomc-calendar", agency: "Federal Reserve", title: "FOMC meeting calendars, statements, projection materials", url: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm", releaseTimeET: "2:00 p.m. statement", botBlocked: false },
  { id: "fed-fomc", agency: "Federal Reserve", title: "Federal Open Market Committee", url: "https://www.federalreserve.gov/monetarypolicy/fomc.htm", botBlocked: false },
  { id: "fed-openmarket", agency: "Federal Reserve", title: "Open market operations (target range history)", url: "https://www.federalreserve.gov/monetarypolicy/openmarket.htm", botBlocked: false },
  { id: "fed-press", agency: "Federal Reserve", title: "Press releases", url: "https://www.federalreserve.gov/newsevents/pressreleases.htm", botBlocked: false },
  { id: "cme-fedwatch", agency: "CME Group", title: "FedWatch (rate probabilities)", url: "https://www.cmegroup.com/markets/interest-rates/cme-fedwatch-tool.html", botBlocked: true },
  { id: "treasury-curve", agency: "U.S. Treasury", title: "Daily Treasury Par Yield Curve Rates", url: "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve", releaseTimeET: "end of day", botBlocked: false },
  { id: "freddie-pmms", agency: "Freddie Mac", title: "Primary Mortgage Market Survey", url: "https://www.freddiemac.com/pmms", releaseTimeET: "12:00 p.m. Thursday", botBlocked: false },
  { id: "census-retail", agency: "Census", title: "Advance Monthly Retail Trade", url: "https://www.census.gov/retail/index.html", releaseTimeET: "8:30 a.m.", botBlocked: false },
  { id: "census-housing", agency: "Census", title: "New Residential Construction", url: "https://www.census.gov/construction/nrc/index.html", releaseTimeET: "8:30 a.m.", botBlocked: false },
  { id: "ism-pmi", agency: "ISM", title: "ISM PMI Reports", url: "https://www.ismworld.org/supply-management-news-and-reports/reports/ism-report-on-business/", releaseTimeET: "10:00 a.m. (mfg 1st business day, services 3rd)", botBlocked: false },
  { id: "umich-sentiment", agency: "University of Michigan", title: "Surveys of Consumers", url: "https://www.sca.isr.umich.edu/", releaseTimeET: "10:00 a.m.", botBlocked: false },
  { id: "cb-confidence", agency: "Conference Board", title: "Consumer Confidence", url: "https://www.conference-board.org/topics/consumer-confidence", releaseTimeET: "10:00 a.m.", botBlocked: false },
  { id: "adp-employment", agency: "ADP", title: "National Employment Report", url: "https://www.adpemploymentreport.com/", releaseTimeET: "8:15 a.m.", botBlocked: false },
  { id: "fred-FEDFUNDS", agency: "FRED", title: "Federal Funds Effective Rate (monthly)", url: "https://fred.stlouisfed.org/series/FEDFUNDS", botBlocked: true, fredSeries: "FEDFUNDS" },
  { id: "fred-DFF", agency: "FRED", title: "Federal Funds Effective Rate (daily)", url: "https://fred.stlouisfed.org/series/DFF", botBlocked: true, fredSeries: "DFF" },
  { id: "fred-DGS10", agency: "FRED", title: "10-Year Treasury Constant Maturity", url: "https://fred.stlouisfed.org/series/DGS10", botBlocked: true, fredSeries: "DGS10" },
  { id: "fred-DGS2", agency: "FRED", title: "2-Year Treasury Constant Maturity", url: "https://fred.stlouisfed.org/series/DGS2", botBlocked: true, fredSeries: "DGS2" },
  { id: "fred-T10Y2Y", agency: "FRED", title: "10-Year minus 2-Year Treasury spread", url: "https://fred.stlouisfed.org/series/T10Y2Y", botBlocked: true, fredSeries: "T10Y2Y" },
  { id: "fred-T10YIE", agency: "FRED", title: "10-Year Breakeven Inflation Rate", url: "https://fred.stlouisfed.org/series/T10YIE", botBlocked: true, fredSeries: "T10YIE" },
  { id: "fred-UNRATE", agency: "FRED", title: "Unemployment Rate", url: "https://fred.stlouisfed.org/series/UNRATE", botBlocked: true, fredSeries: "UNRATE" },
  { id: "fred-PAYEMS", agency: "FRED", title: "All Employees, Total Nonfarm", url: "https://fred.stlouisfed.org/series/PAYEMS", botBlocked: true, fredSeries: "PAYEMS" },
  { id: "fred-CIVPART", agency: "FRED", title: "Labor Force Participation Rate", url: "https://fred.stlouisfed.org/series/CIVPART", botBlocked: true, fredSeries: "CIVPART" },
  { id: "fred-ICSA", agency: "FRED", title: "Initial Claims", url: "https://fred.stlouisfed.org/series/ICSA", botBlocked: true, fredSeries: "ICSA" },
  { id: "fred-JTSJOL", agency: "FRED", title: "Job Openings: Total Nonfarm", url: "https://fred.stlouisfed.org/series/JTSJOL", botBlocked: true, fredSeries: "JTSJOL" },
  { id: "fred-CPIAUCSL", agency: "FRED", title: "CPI-U: All Items", url: "https://fred.stlouisfed.org/series/CPIAUCSL", botBlocked: true, fredSeries: "CPIAUCSL" },
  { id: "fred-CPILFESL", agency: "FRED", title: "CPI-U: All Items Less Food and Energy", url: "https://fred.stlouisfed.org/series/CPILFESL", botBlocked: true, fredSeries: "CPILFESL" },
  { id: "fred-PCEPILFE", agency: "FRED", title: "Core PCE Price Index", url: "https://fred.stlouisfed.org/series/PCEPILFE", botBlocked: true, fredSeries: "PCEPILFE" },
  { id: "fred-GDPC1", agency: "FRED", title: "Real GDP", url: "https://fred.stlouisfed.org/series/GDPC1", botBlocked: true, fredSeries: "GDPC1" },
  { id: "fred-RSAFS", agency: "FRED", title: "Advance Retail Sales", url: "https://fred.stlouisfed.org/series/RSAFS", botBlocked: true, fredSeries: "RSAFS" },
  { id: "fred-UMCSENT", agency: "FRED", title: "UMich Consumer Sentiment", url: "https://fred.stlouisfed.org/series/UMCSENT", botBlocked: true, fredSeries: "UMCSENT" },
  { id: "fred-HOUST", agency: "FRED", title: "Housing Starts", url: "https://fred.stlouisfed.org/series/HOUST", botBlocked: true, fredSeries: "HOUST" },
  { id: "fred-MORTGAGE30US", agency: "FRED", title: "30-Year Fixed Rate Mortgage Average", url: "https://fred.stlouisfed.org/series/MORTGAGE30US", botBlocked: true, fredSeries: "MORTGAGE30US" },
  { id: "fred-DTWEXBGS", agency: "FRED", title: "Nominal Broad U.S. Dollar Index", url: "https://fred.stlouisfed.org/series/DTWEXBGS", botBlocked: true, fredSeries: "DTWEXBGS" },
];

/** Hosts a "Visit the real source" link may point at. */
export const OFFICIAL_HOSTS = [
  "www.bls.gov",
  "www.dol.gov",
  "oui.doleta.gov",
  "www.bea.gov",
  "www.federalreserve.gov",
  "www.cmegroup.com",
  "home.treasury.gov",
  "www.freddiemac.com",
  "www.census.gov",
  "www.ismworld.org",
  "www.sca.isr.umich.edu",
  "www.conference-board.org",
  "www.adpemploymentreport.com",
  "fred.stlouisfed.org",
];

const BY_ID = new Map(MACRO_SOURCES.map((s) => [s.id, s]));

export function getMacroSource(id: string): MacroSource | undefined {
  return BY_ID.get(id);
}

export function fredSource(seriesId: string): MacroSource | undefined {
  return BY_ID.get(`fred-${seriesId}`);
}
