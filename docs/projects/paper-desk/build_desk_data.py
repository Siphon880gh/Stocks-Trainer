"""Builds src/lib/academy/paper/desk/history2024.ts from data fetched on 2026-11-11:
 - daily OHLCV: Yahoo Finance chart API v8 (query1.finance.yahoo.com/v8/finance/chart/<T>?period1=1704067200&period2=1735689600&interval=1d)
 - statements: SEC EDGAR XBRL companyfacts (data.sec.gov/api/xbrl/companyfacts/CIK##########.json), matched to each 10-Q / 10-K accession
 - filings + 8-K dates: SEC EDGAR submissions (data.sec.gov/submissions/CIK##########.json)
 - headlines: the Exhibit 99.1 press release (or 8-K) title on sec.gov, URL per item."""
import json, datetime as dt
SYMS = {"AAPL": ("Apple Inc.", "0000320193"), "MSFT": ("Microsoft Corp.", "0000789019"), "AMZN": ("Amazon.com, Inc.", "0001018724")}
dates = None; out_syms = {}
for t, (name, cik) in SYMS.items():
    d = json.load(open(f"px_{t}.json"))["chart"]["result"][0]
    ds = [dt.datetime.fromtimestamp(x, dt.timezone.utc).date().isoformat() for x in d["timestamp"]]
    if dates is None: dates = ds
    assert ds == dates, t
    q = d["indicators"]["quote"][0]
    c = lambda v: int(round(v * 100))
    bars = []
    for i in range(len(ds)):
        o, h, l, cl = c(q["open"][i]), c(q["high"][i]), c(q["low"][i]), c(q["close"][i])
        h = max(h, o, cl); l = min(l, o, cl)
        bars.append([o, h, l, cl, int(q["volume"][i])])
    out_syms[t] = {"name": name, "cik": str(int(cik)), "bars": bars}
fin = json.load(open("fin.json"))
E = "https://www.sec.gov/Archives/edgar/data/"
news = [
 # Apple (fiscal year ends late September)
 ("AAPL","2023-11-02","earnings","Apple reports fourth quarter results","iPhone revenue sets September quarter record; Services revenue reaches new all-time high.",E+"320193/000032019323000104/a8-kex991q4202309302023.htm"),
 ("AAPL","2024-02-01","earnings","Apple reports first quarter results","Services revenue reaches new all-time record; EPS up 16 percent to new all-time high.",E+"320193/000032019324000005/a8-kex991q1202412302023.htm"),
 ("AAPL","2024-05-02","earnings","Apple reports second quarter results","Services revenue reaches new all-time record; EPS sets March quarter record. The board authorized an additional $110 billion for share repurchases and raised the quarterly dividend.",E+"320193/000032019324000067/a8-kex991q2202403302024.htm"),
 ("AAPL","2024-05-03","company","Apple furnishes notice of a proposed settlement of a shareholder derivative lawsuit","Form 8-K, Item 7.01: notice of pendency and proposed settlement in the shareholder derivative litigation (N.D. Cal.).",E+"320193/000114036124024352/ef20028273_ex99-1.htm"),
 ("AAPL","2024-08-01","earnings","Apple reports third quarter results","June quarter records for revenue and EPS; Services revenue reaches new all-time high.",E+"320193/000032019324000080/a8-kex991q3202406292024.htm"),
 ("AAPL","2024-10-31","earnings","Apple reports fourth quarter results","iPhone drives record September quarter revenue; Services revenue reaches new all-time high.",E+"320193/000032019324000120/a8-kex991q4202409282024.htm"),
 # Microsoft (fiscal year ends June 30)
 ("MSFT","2023-10-13","company","Microsoft completes its acquisition of Activision Blizzard","Form 8-K, Item 2.01: the previously announced merger closed on October 13, 2023.",E+"789019/000119312523255762/d537928d8k.htm"),
 ("MSFT","2023-10-24","earnings","Microsoft Cloud strength fuels first quarter results","Revenue $56.5 billion, up 13%; diluted EPS $2.99, up 27%.",E+"789019/000095017023054848/msft-ex99_1.htm"),
 ("MSFT","2024-01-19","company","Microsoft actions following attack by nation state actor Midnight Blizzard","Form 8-K, Item 1.05: the security team detected a nation-state attack on corporate systems on January 12, 2024.",E+"789019/000119312524011295/d708866dex991.htm"),
 ("MSFT","2024-01-30","earnings","Microsoft Cloud strength drives second quarter results","Revenue $62.0 billion, up 18%; operating income $27.0 billion, up 33%.",E+"789019/000095017024008809/msft-ex99_1.htm"),
 ("MSFT","2024-04-25","earnings","Microsoft Cloud strength fuels third quarter results","Revenue $61.9 billion, up 17%; diluted EPS $2.94, up 20%.",E+"789019/000095017024048268/msft-ex99_1.htm"),
 ("MSFT","2024-07-30","earnings","Microsoft Cloud strength drives fourth quarter results","Revenue $64.7 billion, up 15%; diluted EPS $2.95, up 10%.",E+"789019/000095017024087835/msft-ex99_1.htm"),
 ("MSFT","2024-10-30","earnings","Microsoft Cloud strength drives first quarter results","Revenue $65.6 billion, up 16%; diluted EPS $3.30, up 10%.",E+"789019/000095017024118955/msft-ex99_1.htm"),
 # Amazon (calendar fiscal year)
 ("AMZN","2023-10-26","earnings","Amazon.com announces third quarter results","Net sales increased 13% to $143.1 billion in the third quarter.",E+"1018724/000101872423000016/amzn-20230930xex991.htm"),
 ("AMZN","2024-02-01","earnings","Amazon.com announces fourth quarter results","Net sales increased 14% to $170.0 billion in the fourth quarter.",E+"1018724/000101872424000006/amzn-20231231xex991.htm"),
 ("AMZN","2024-04-11","company","Amazon furnishes its annual letter to shareholders","Form 8-K, Item 7.01: the CEO's letter to shareholders, furnished as Exhibit 99.1.",E+"1018724/000110465924045915/tm246113d3_ex99-1.htm"),
 ("AMZN","2024-04-30","earnings","Amazon.com announces first quarter results","Net sales increased 13% to $143.3 billion in the first quarter.",E+"1018724/000101872424000081/amzn-20240331xex991.htm"),
 ("AMZN","2024-08-01","earnings","Amazon.com announces second quarter results","Net sales increased 10% to $148.0 billion in the second quarter.",E+"1018724/000101872424000128/amzn-20240630xex991.htm"),
 ("AMZN","2024-10-31","earnings","Amazon.com announces third quarter results","Net sales increased 11% to $158.9 billion in the third quarter.",E+"1018724/000101872424000158/amzn-20240930xex991.htm"),
]
items = [{"id": f"{s}-{d}-{k}", "symbol": s, "date": d, "kind": k, "headline": h, "summary": m, "source": "SEC EDGAR (company filing)", "url": u} for s, d, k, h, m, u in news]
for s, rows in fin.items():
    for r in rows:
        items.append({"id": f"{s}-{r['filed']}-filing", "symbol": s, "date": r["filed"], "kind": "filing", "headline": f"{SYMS[s][0]} files Form {r['form']} for the period ended {dt.date.fromisoformat(r['periodEnd']).strftime('%B %-d, %Y')}", "summary": "The full statements are now on the Financials tab.", "source": "SEC EDGAR", "url": r["url"]})
items.sort(key=lambda x: (x["date"], x["symbol"], x["kind"]))
statements = {s: [{"form": r["form"], "filed": r["filed"], "periodStart": r["periodStart"], "periodEnd": r["periodEnd"], "cashFlowMonths": r["cashFlowMonths"], "url": r["url"], "liabilitiesDerived": bool(r.get("liabilitiesDerived")), **{k: v for k, v in r["values"].items()}} for r in rows] for s, rows in fin.items()}
J = lambda x: json.dumps(x, separators=(",", ":"))
ts = f'''/**
 * HISTORICAL data for the paper desk (generated by docs/projects/paper-desk/build_desk_data.py on 2026-11-11; do not edit by hand).
 * Real past prices and real SEC filings, replayed day by day. Money in the desk is SIMULATED; nothing here is live.
 * - bars: daily [open, high, low, close] in cents + volume in shares, 2024-01-02 … 2024-12-31 (Yahoo Finance chart API)
 * - statements: SEC EDGAR XBRL companyfacts, one row per 10-Q / 10-K, revealed on its filing date
 * - news: SEC EDGAR 8-K / Exhibit 99.1 press-release headlines, revealed on their filing date
 * Sources: docs/projects/paper-desk/SOURCES.md
 */
import type {{ DeskNewsItem, DeskStatement }} from "./types";

export const HISTORY_2024_DATES: readonly string[] = {J(dates)};

export const HISTORY_2024_SYMBOLS: Record<string, {{ name: string; cik: string; bars: readonly (readonly [number, number, number, number, number])[] }}> = {J(out_syms)};

export const HISTORY_2024_NEWS: readonly DeskNewsItem[] = {json.dumps(items, indent=1)};

export const HISTORY_2024_STATEMENTS: Record<string, readonly DeskStatement[]> = {json.dumps(statements, indent=1)};
'''
open("history2024.ts", "w").write(ts)
print(len(ts), len(items))
