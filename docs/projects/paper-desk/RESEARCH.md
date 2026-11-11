# Paper trading competitor research (2026-11-11, fetched this session; all URLs returned HTTP 200)

## TradingView Paper Trading
- https://www.tradingview.com/support/solutions/43000516466-paper-trading-main-functionality/ — Connect via "Trade" button on Supercharts; three ways to trade: Order ticket (side, qty, market/limit/stop, SL/TP), Depth of market, Chart trading (drag orders on the chart).
- https://www.tradingview.com/support/solutions/43000784804-what-is-an-order-ticket/ — ticket on the RIGHT of the chart. Order types market/limit/stop. Qty in units, currency, % of balance, risk currency, risk % balance (risk sized from the stop). TP/SL in price, ticks, % of price, reward/risk currency or % balance. Multiple exits ("Add level"). Time in force. Order info → Position info (trade value, risk/reward).
- https://www.tradingview.com/support/solutions/43000786138-what-is-the-account-manager/ — account manager at the BOTTOM of the chart. Summary row: Account balance, Equity (= balance + unrealized), Realized PnL, Unrealized PnL, Account margin, Available funds, Orders margin, Margin buffer. Tabs: Positions, Orders, History (filled/rejected/cancelled, placement & closing times), Account history (closed positions w/ entry & close prices, realized PnL), Trading journal (text log of order events). Export CSV.
- https://www.tradingview.com/support/solutions/43000763362-positions-and-orders/ — setting to draw positions & orders on the chart; "Execution marks".
- https://www.tradingview.com/support/solutions/43000754946-order-history/ — order history timeline; execution history on the chart.

## Webull paperTrade
- https://www.webull.com/help/faq/11069-Paper-Trading — stocks/ETFs/options/crypto/futures; order types market, limit, stop, stop limit, trailing stop, conditional, algo, OCO/OTO/OTOCO. Paper order buttons are ORANGE to distinguish from live. Orders fill on last traded price; no volume → no fill.

## thinkorswim paperMoney (Schwab)
- https://www.schwab.com/trading/thinkorswim/paper-trading — $100,000 virtual buying power, P/L analysis.
- https://www.schwab.com/learn/story/4-reasons-to-try-paper-trading — toggle Live vs paperMoney; window is orange in paperMoney (blue live); "Reset All Balances and Positions".

## Interactive Brokers paper account
- https://www.interactivebrokers.com/campus/glossary-terms/paper-trading-account/ — $1,000,000 paper equity; simulator fills from top of book; stops always simulated; some order types unsupported.
- https://www.interactivebrokers.com/campus/trading-lessons/using-ibkrs-paper-trading-account/ — same layout as live: watchlists, hotkeys, bracket orders, Fundamentals Explorer, news, alerts; reset funds to $1M from settings.

## Moomoo Papertrade
- https://www.moomoo.com/us/papertrading — $1M virtual (stocks/options), $10M futures; analyst ratings, indicators, community leaderboard.
- https://www.moomoo.com/ca/manual/topic-14-285 — ticket: direction, order type, price, qty, amount, TIF → Buy/Sell. Account net assets + today's P/L at top; Assets (positions/orders), History (order history, funds details), Performance (P/L analysis).

## NinjaTrader Playback (market replay)
- https://static.ninjatrader.com/support/helpGuides/nt8/playback.htm — Playback control: start/end dates, play, slide control, speed control, Go To date; Playback101 account; moving the slider resets the playback account history; orders processed synchronously for reproducible results.

## Common layout to emulate (own look, no logos/trademarks)
1. Top: symbol header + replay clock (date) with play/step/speed controls (NinjaTrader playback).
2. Left: watchlist with last price & day change per symbol.
3. Center: chart with order/position lines AND execution markers (buy ▲ / sell ▼) (TradingView executions).
4. Right: order ticket — Buy/Sell toggle, type, qty in shares OR $ OR risk-from-stop, TP/SL bracket, TIF, order preview (value, risk/reward).
5. Bottom: account manager — summary row (balance, equity, realized, unrealized, buying power) + tabs Positions | Orders | History | Closed trades | Journal/Activity.
6. Side research tabs: News (time-stamped, only what was published by replay clock) and Financials (latest filed statement as of replay clock).
7. Reset account; paper-mode colour cue (orange-ish "sim" token already in app).
