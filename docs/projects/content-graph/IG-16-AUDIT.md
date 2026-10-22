# IG "16 candlestick patterns every trader should know": audit against the app

Source: https://www.ig.com/en/trading-strategies/16-candlestick-patterns-every-trader-should-know-180615 (loaded 2026-10-22). No IG images are used; every chart is drawn by the app's own candle components from SIMULATED bars.

Audit date: 2026-10-22 (#18 + #20). "Before" is the state at tree N; "after" is what this item added or changed.

| Pattern | Present before? | Location (Archive id) | Lesson | Quiz | Drill | Change in #18 / #20 |
|---|---|---|---|---|---|---|
| Hammer | Yes | `hammer` | Core lesson tabs | `hammer`, `candle-pattern-book`, `equity-patterns`, `essential-candles` | Buy-or-Sell | Lower shadow ≥ 2× body, stop below the low, next-candle confirmation stated on `/practice/essential-candles`. |
| Hanging man | Yes | `hanging-man` | Generated tabs → **dedicated tabs** | `hanging-man`, `essential-candles` | Buy-or-Sell | Description: hammer shape after an uptrend, stop above the high. |
| Shooting star | Yes | `shooting-star` | Core lesson tabs | `shooting-star`, `essential-candles` | Buy-or-Sell | Description: upper shadow ≥ 2× body, stop above the high, distinct from inverted hammer. |
| Inverted hammer (distinct from shooting star) | Yes | `inverted-hammer` | Generated tabs → **dedicated tabs** | `inverted-hammer`, `essential-candles` | Buy-or-Sell | Description: same shape after a downtrend, bullish only after confirmation. |
| Doji (+ gravestone, dragonfly, long-legged) | Yes | `doji`, `gravestone-doji`, `dragonfly-doji`, `long-legged-doji` | Doji: generated → **dedicated tabs**; gravestone/dragonfly core | `doji`, `japanese-candles`, `essential-candles` | Buy-or-Sell (wait cases) | Single candle; variants listed in the lesson. |
| Bullish engulfing | Yes | `bullish-engulfing` (drill key `engulfing`) | Core lesson tabs | `engulfing`, `japanese-candles`, `essential-candles` | Buy-or-Sell | Body engulfs body; volume on the engulfing candle helps. |
| Bearish engulfing | Yes | `bearish-engulfing` | Core lesson tabs | `engulfing`, `essential-candles` | Buy-or-Sell | Same. |
| Tweezer top / bottom | Yes | `tweezer-top`, `tweezer-bottom` | Core lesson tabs | `tweezer-top`, `tweezer-bottom` | Buy-or-Sell | Matching highs / lows. |
| Morning star (+ doji star) | Yes | `morning-star`, `morning-doji-star` | Core lesson tabs | `morning-star`, `essential-candles` (50% rule, near-miss, candle order) | Buy-or-Sell + **valid-star drill** | #20: prominent takeaway, redrawn diagram in the correct order with a dashed 50% line, near-miss cases, scanner now enforces the midpoint rule. |
| Evening star (+ doji star) | Yes | `evening-star`, `evening-doji-star` | Core lesson tabs | `evening-star`, `essential-candles` | Buy-or-Sell + **valid-star drill** | Mirror rule (third closes below the first body's midpoint); description no longer a stub. |
| Three white soldiers | Yes | `three-white-soldiers` | Core lesson tabs | `three-white-soldiers`, `essential-candles` | Buy-or-Sell | Opens within the prior body, progressive closes, small wicks; oversized after an extended move = exhaustion. |
| Three black crows | Yes | `three-black-crows` | Core lesson tabs | `three-black-crows` | Buy-or-Sell | Mirror. |
| Inside bar (mother bar) | Added in #17 | `inside-bar` | Generated → **dedicated tabs** | `pattern-themes`, `essential-candles` | **Buy-or-Sell breakout case added** | TWO candles; containment on the full high-low range including wicks; buy stop above / sell stop below the mother bar. |
| Bullish / bearish harami | Yes | `harami`, `bearish-harami` | Generated → **dedicated tabs** | `harami`, `crypto-candles`, `essential-candles` | Buy-or-Sell | Early warning, not an entry; hesitation vs the engulfing's decisiveness. |
| Spinning top | Yes | `spinning-top` | Generated → **dedicated tabs** | `candle-pattern-book`, `essential-candles` | Buy-or-Sell (wait) | Single candle; a cluster after a directional move = waning momentum. |
| Marubozu | Yes | `white-marubozu`, `black-marubozu` | Generated tabs | `marubozu` | Buy-or-Sell | Listed on the essentials page. |

Context rules (trend, support/resistance, moving averages such as the 200-day, volume, oscillators, confirmation) are on `/practice/essential-candles` and in the glossary as `pattern-context-rules`.

Corrected silently in the app: the inside bar is a two-candle pattern (the source lists it with the three-candle patterns); the doji and the spinning top are single candles.

Tests: `src/lib/essentialCandles.test.ts` fails if any of the 16 lacks an Archive entry, a dedicated lesson, a drill or an essentials card, or if any star chart, diagram or the scanner breaks the 50% rule.
