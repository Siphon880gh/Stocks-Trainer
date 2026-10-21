# Sources: real pages each lesson links to

Charter: [`CHARTER.md`](./CHARTER.md) · Registry in code: `src/lib/macro/sources.ts` (must match this table 1:1; `sources.test.ts` enforces it).

The app **links** to these pages and reproduces their **layout** with SIMULATED numbers. It never fetches them at runtime, never copies logos or narrative text, and never shows real values.

## Registry

| id | Agency | Page | URL | Release time (ET) | Bot-blocked |
|----|--------|------|-----|-------------------|-------------|
| bls-empsit | BLS | Employment Situation Summary | https://www.bls.gov/news.release/empsit.nr0.htm | 8:30 a.m., usually first Friday | yes |
| bls-cpi | BLS | Consumer Price Index Summary | https://www.bls.gov/news.release/cpi.nr0.htm | 8:30 a.m. | yes |
| bls-ppi | BLS | Producer Price Index News Release summary | https://www.bls.gov/news.release/ppi.nr0.htm | 8:30 a.m. | yes |
| bls-jolts | BLS | Job Openings and Labor Turnover Summary | https://www.bls.gov/news.release/jolts.nr0.htm | 10:00 a.m. | yes |
| bls-schedule | BLS | Schedule of selected releases | https://www.bls.gov/schedule/news_release/ | — | yes |
| dol-claims | DOL | Unemployment Insurance Weekly Claims (PDF) | https://www.dol.gov/ui/data.pdf | 8:30 a.m. Thursday | yes |
| dol-claims-data | DOL / ETA | Weekly claims data | https://oui.doleta.gov/unemploy/claims.asp | — | no |
| bea-gdp | BEA | Gross Domestic Product | https://www.bea.gov/data/gdp/gross-domestic-product | 8:30 a.m. | no |
| bea-pce | BEA | PCE Price Index | https://www.bea.gov/data/personal-consumption-expenditures-price-index | 8:30 a.m. | no |
| bea-income | BEA | Personal Income and Outlays | https://www.bea.gov/data/income-saving/personal-income | 8:30 a.m. | no |
| bea-schedule | BEA | Release schedule | https://www.bea.gov/news/schedule | — | no |
| fed-fomc-calendar | Federal Reserve | FOMC meeting calendars, statements, projection materials | https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm | 2:00 p.m. statement | no |
| fed-fomc | Federal Reserve | Federal Open Market Committee | https://www.federalreserve.gov/monetarypolicy/fomc.htm | — | no |
| fed-openmarket | Federal Reserve | Open market operations (target range history) | https://www.federalreserve.gov/monetarypolicy/openmarket.htm | — | no |
| fed-press | Federal Reserve | Press releases | https://www.federalreserve.gov/newsevents/pressreleases.htm | — | no |
| cme-fedwatch | CME Group | FedWatch (rate probabilities) | https://www.cmegroup.com/markets/interest-rates/cme-fedwatch-tool.html | — | yes |
| treasury-curve | U.S. Treasury | Daily Treasury Par Yield Curve Rates | https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve | end of day | no |
| freddie-pmms | Freddie Mac | Primary Mortgage Market Survey | https://www.freddiemac.com/pmms | 12:00 p.m. Thursday | no |
| census-retail | Census | Advance Monthly Retail Trade | https://www.census.gov/retail/index.html | 8:30 a.m. | no |
| census-housing | Census | New Residential Construction | https://www.census.gov/construction/nrc/index.html | 8:30 a.m. | no |
| ism-pmi | ISM | ISM PMI Reports | https://www.ismworld.org/supply-management-news-and-reports/reports/ism-report-on-business/ | 10:00 a.m. (mfg 1st business day, services 3rd) | no |
| umich-sentiment | University of Michigan | Surveys of Consumers | https://www.sca.isr.umich.edu/ | 10:00 a.m. | no |
| cb-confidence | Conference Board | Consumer Confidence | https://www.conference-board.org/topics/consumer-confidence | 10:00 a.m. | no |
| adp-employment | ADP | National Employment Report | https://www.adpemploymentreport.com/ | 8:15 a.m. | no |
| fred-FEDFUNDS | FRED | Federal Funds Effective Rate (monthly) | https://fred.stlouisfed.org/series/FEDFUNDS | — | yes |
| fred-DFF | FRED | Federal Funds Effective Rate (daily) | https://fred.stlouisfed.org/series/DFF | — | yes |
| fred-DGS10 | FRED | 10-Year Treasury Constant Maturity | https://fred.stlouisfed.org/series/DGS10 | — | yes |
| fred-DGS2 | FRED | 2-Year Treasury Constant Maturity | https://fred.stlouisfed.org/series/DGS2 | — | yes |
| fred-T10Y2Y | FRED | 10-Year minus 2-Year Treasury spread | https://fred.stlouisfed.org/series/T10Y2Y | — | yes |
| fred-T10YIE | FRED | 10-Year Breakeven Inflation Rate | https://fred.stlouisfed.org/series/T10YIE | — | yes |
| fred-UNRATE | FRED | Unemployment Rate | https://fred.stlouisfed.org/series/UNRATE | — | yes |
| fred-PAYEMS | FRED | All Employees, Total Nonfarm | https://fred.stlouisfed.org/series/PAYEMS | — | yes |
| fred-CIVPART | FRED | Labor Force Participation Rate | https://fred.stlouisfed.org/series/CIVPART | — | yes |
| fred-ICSA | FRED | Initial Claims | https://fred.stlouisfed.org/series/ICSA | — | yes |
| fred-JTSJOL | FRED | Job Openings: Total Nonfarm | https://fred.stlouisfed.org/series/JTSJOL | — | yes |
| fred-CPIAUCSL | FRED | CPI-U: All Items | https://fred.stlouisfed.org/series/CPIAUCSL | — | yes |
| fred-CPILFESL | FRED | CPI-U: All Items Less Food and Energy | https://fred.stlouisfed.org/series/CPILFESL | — | yes |
| fred-PCEPILFE | FRED | Core PCE Price Index | https://fred.stlouisfed.org/series/PCEPILFE | — | yes |
| fred-GDPC1 | FRED | Real GDP | https://fred.stlouisfed.org/series/GDPC1 | — | yes |
| fred-RSAFS | FRED | Advance Retail Sales | https://fred.stlouisfed.org/series/RSAFS | — | yes |
| fred-UMCSENT | FRED | UMich Consumer Sentiment | https://fred.stlouisfed.org/series/UMCSENT | — | yes |
| fred-HOUST | FRED | Housing Starts | https://fred.stlouisfed.org/series/HOUST | — | yes |
| fred-MORTGAGE30US | FRED | 30-Year Fixed Rate Mortgage Average | https://fred.stlouisfed.org/series/MORTGAGE30US | — | yes |
| fred-DTWEXBGS | FRED | Nominal Broad U.S. Dollar Index | https://fred.stlouisfed.org/series/DTWEXBGS | — | yes |

**Bot-blocked** = the host's CDN (Akamai) answers scripted `curl` with 403 / connection reset, from both the box and Weng's Mac, while a browser loads it. These need a dated manual verification row below; `npm run check:macro-sources` accepts their 403 only when that row exists. FRED series ids are additionally confirmed through the public `https://fred.stlouisfed.org/graph/fredgraph.csv?id=<ID>` header, which scripts can reach.

## Layout notes (what the look-alike copies — structure and public field names only)

- **Employment Situation:** embargo line + release number header; title "THE EMPLOYMENT SITUATION — <MONTH>"; lead paragraph (payroll change + unemployment rate); "Household Survey Data" and "Establishment Survey Data" sections; Summary table A (household: civilian labor force, participation rate, employed, unemployment rate…) and B (establishment: total nonfarm, total private, goods-producing, sectors, government, average hourly earnings, average weekly hours); revision paragraph ("revised down by X, from +A to +B"); next-release line.
- **CPI:** "Table A. Percent changes in CPI for All Urban Consumers (CPI-U)": rows All items, Food, Energy, All items less food and energy, Shelter…; columns = last 7 months SA MoM + "Unadjusted 12-mos. ended".
- **PPI:** "Table A": final demand, final demand less foods/energy/trade, goods, services; monthly SA % rows by month.
- **JOLTS:** openings, hires, quits, layoffs and discharges — levels (millions) and rates; prior-month revision paragraph.
- **Weekly claims (DOL):** "WEEK ENDING" columns; rows Initial Claims (SA), Initial Claims (NSA), 4-Wk Moving Average (SA), Insured Unemployment (SA), Insured Unemployment Rate.
- **FRED series page:** title "(SERIES_ID)"; Observations list (date: value, newest first, 5 rows); Units, Frequency; Updated / Next Release Date; line chart; Notes with Source and Release.
- **FOMC:** calendar of 8 meetings with Statement / Implementation Note / Press Conference / Projection Materials (asterisked meetings carry a Summary of Economic Projections); statement states the decision on the target range and the vote; dot plot = one dot per participant per year, plus longer run.
- **Freddie Mac PMMS:** "U.S. weekly mortgage rate averages as of <date>"; 30-year FRM and 15-year FRM cards; bullets with week change and year-ago value; released Thursdays 12 p.m. ET.
- **Treasury par yield curve:** date rows × tenors (1 Mo … 30 Yr).
- **BEA GDP / PCE:** headline "Real GDP increased X percent (annual rate)"; contributions to percent change (consumption, investment, net exports, government); PCE price index MoM and YoY, headline and excluding food and energy.
- **Census retail / housing:** advance estimate, % change from prior month and year ago, ±90% confidence interval; starts / permits / completions at SAAR.
- **ISM:** PMI headline vs 50; sub-indexes (New Orders, Production, Employment, Supplier Deliveries, Inventories, Prices); direction "Growing / Contracting" and "Faster / Slower".
- **Sentiment:** Index of Consumer Sentiment, Current Economic Conditions, Index of Consumer Expectations; year-ahead inflation expectations.

## Verification log

| Date (PT) | Method | Result |
|-----------|--------|--------|
| 2026-10-21 | `curl -L` with a browser UA from the box | 200: all bea.gov, federalreserve.gov, freddiemac.com, oui.doleta.gov, ismworld.org (redirects to SSO but resolves), conference-board.org, sca.isr.umich.edu, census.gov, home.treasury.gov, adpemploymentreport.com URLs. 403 / reset: bls.gov, fred.stlouisfed.org, dol.gov, cmegroup.com. |
| 2026-10-21 | Same curl from Weng's Mac | Same 403 / reset on bls.gov, fred.stlouisfed.org, dol.gov, cmegroup.com (CDN bot protection, not dead links). |
| 2026-10-21 | WebFetch (browser-class fetch) | Loaded with content: bls-empsit (Sept 2026 release), bls-cpi, bls-ppi, bls-jolts, bls-schedule, dol-claims PDF, cme-fedwatch, ism-pmi, fred-MORTGAGE30US, freddie-pmms, fed-fomc-calendar. |
| 2026-10-21 | `fredgraph.csv?id=` header from the box | 200 with data for FEDFUNDS, DFF, DGS10, DGS2, T10Y2Y, T10YIE, UNRATE, PAYEMS, CIVPART, ICSA, JTSJOL, CPIAUCSL, CPILFESL, PCEPILFE, GDPC1, RSAFS, UMCSENT, HOUST, MORTGAGE30US, DTWEXBGS. Series pages share one verified URL pattern (`/series/<ID>`, checked via MORTGAGE30US). |
