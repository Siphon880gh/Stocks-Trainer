/**
 * Second paragraph for every Academy card. The first paragraph stays as written so quiz citations
 * still match. Together they stay within MAX_CARD_WORDS. Original teaching, not a copied article.
 */
import type { Unit } from "../types";
import { BEFORE_YOU_TRADE_MORE } from "./beforeYouTrade";

export const CARD_MORE: Record<string, string> = {
  "l0-what-is-a-market::Buyers meet sellers":
    "The exchange does not own the shares and does not decide a fair value. It lists orders and matches them. The other side of your buy is another investor, a fund, or a market maker who is willing to sell at the ask and then lay that risk off. The company receives the cash only when it issues new shares, such as in an initial public offering. Ordinary trading just moves existing shares from one holder to another.",
  "l0-what-is-a-market::The price is the last trade":
    "A quote can sit still for minutes in a quiet stock and then jump on one print. That print is one agreement, not a vote on what the business is worth. If the next buyer will pay more, the new last price is higher even if nothing changed at the company. If sellers hit the bid, it is lower. Value and the last trade can disagree for a long time.",
  "l0-what-is-a-market::Bid and ask":
    "Suppose the bid is 20.00 for 500 shares and the ask is 20.05 for 200 shares. A market buy of 200 shares pays about 20.05. A market sell of 500 shares receives about 20.00. The 5 cents is the spread, and you pay it on the round trip. In a busy large stock the spread is often a penny. In a stock that trades a few thousand shares a day it can be several percent of the price, which is a real cost before the idea has a chance to work.",

  "l0-how-this-app-works::Short lessons, then practice":
    "The cards state the idea. The short check asks whether you can use it, not whether you memorised a phrase. The links after the check open the same idea on a chart, in a case, or on the simulated account. Skipping straight to a quiz is allowed if you already know the material. If you miss a question, the explanation points back at the card that taught it, and a later retry keeps your best score.",
  "l0-how-this-app-works::Four places to practise":
    "Learn is recognition: name the pattern or the term. Coach is a path: each choice changes the next prompt, and a wrong turn sends you back to the step you missed. Cases freeze a news or earnings setup and ask for one decision, then show what the tape did. Practice labs isolate one skill, such as marking a level or replaying bars one at a time. Use the place that matches the skill, not whichever screen is open.",
  "l0-how-this-app-works::Everything is labelled":
    "SAMPLE means the bars were built to show one teaching point. STYLIZED means the shape is simplified. SIMULATED means an engine, such as the paper account, stepped through those bars. None of them is a delayed copy of a live exchange. A ticker ending in .S will not appear on a broker's quote screen. Treat a clean sample chart as a drill, not as evidence that the same pattern will pay you in a real name tomorrow.",

  "l0-risk-first::Every trade can lose":
    "A stop is a plan, not a wall. In a quiet tape it often fills near the price you chose. On news the next trade can print far through it, so the loss is larger than the plan. That is why the amount you can afford to lose is decided from the account, before the chart looks tempting. If you only decide after the position is losing, the number tends to grow until the pain forces the exit.",
  "l0-risk-first::Small losses are survivable":
    "Start at 100. Lose 10% and you have 90; you need about 11% to get back to 100. Lose 50% and you have 50; you need to double, a 100% gain, just to be even. Three losses of 1% leave you near 97. Three losses of 20% leave you near 51. The 1% figure is a common ceiling per idea, not a target you must hit and not a promise that the next idea wins.",
  "l0-risk-first::Time horizon matters":
    "Money for rent next month does not belong in a stock that can drop 30% and take two years to recover. A retirement account measured in decades can sit through that drop if the business case is intact. A trader who planned to be out in three days cannot use the same patience. Write the horizon next to the idea. If a drop would force you to sell for a reason that is not in the plan, the position is too large or the horizon is wrong.",

  "l0-simulated-vs-real::What paper trading is":
    "The point of virtual cash is repetition without a bill. You can place a market, limit, stop, stop-limit, or trailing stop, watch it work or expire, and read the position math. The default account starts at $10,000 of virtual cash and charges no commission, so a small edge is not eaten by fees the way it might be at a small size in a real account. That missing friction is useful for learning the buttons and misleading if you treat the profit as a forecast.",
  "l0-simulated-vs-real::What it teaches well":
    "Order behaviour is the useful part. A limit that the next bar never touches stays open. A stop that the next bar gaps through fills at the worse price, not at the trigger. Buying power falls when a buy order is working, even before it fills. Average cost updates when you add shares. Those rules are the same ideas a cash account uses. Paper is a good place to see them once, slowly, before speed and size make them expensive.",
  "l0-simulated-vs-real::What it cannot show":
    "A real account pays commissions or spreads, may fill only part of a large order, and can slip several percent when everyone hits the same side after news. Taxes change the result after the year ends. The largest gap is emotional: a paper loss of $400 is a number, and the same loss in money you earned is a reason to abandon the plan. A month of paper profits is practice. It is not proof the method survives fees, slippage, or a bad week.",

  "l0-learning-plan::A little every day":
    "Ten minutes is enough for one card set, the check, and a look at the linked drill. A three-hour Sunday session feels productive and then fades, because the checks never get a second pass. The Today card picks one unit, one review question, and one glossary term so you are not choosing from the whole library. If you miss a day, start the next day with that card. Do not try to clear a backlog in one sitting.",
  "l0-learning-plan::Points are only a scoreboard":
    "Points mark that a unit was finished, a check was passed, or a paper rule was followed. They are not cash, not a discount, and not a credential a broker or an employer will read. A high score with skipped explanations is weaker than a lower score you reviewed. The badges work the same way: they record a habit inside this app and unlock nothing on a real account.",
  "l0-learning-plan::Review your mistakes":
    "A wrong answer names the idea you do not have yet. Read the explanation before you tap again, or you will memorise the letter instead of the reason. Then leave the unit and come back later, when the sentence is no longer on the screen. The stored score stays at your best, so a worse retry does not punish you. The useful record is which explanations you still need.",

  "l1-what-is-a-share::A slice of a company":
    "Shareholders are paid last. Lenders and other creditors are ahead of them if the company is wound up, which is why equity is called a residual claim. In exchange, owners keep what is left when the business does well: a higher price, a dividend, or both. One thousand shares of a company with one million shares is 0.1%, a real slice, and still far too small to direct the company. You are an owner of the results, not the manager.",
  "l1-what-is-a-share::Why companies sell shares":
    "The first sale of new shares, an offering, sends cash to the company to fund growth, pay down debt, or let early owners sell. After those shares are outstanding, the exchange is a secondhand market. Your purchase pays the person or fund who sold, the way a used car payment goes to the previous owner and not to the factory. A rising price helps the company later if it wants to sell more shares, but today's trade did not send it today's cash.",
  "l1-what-is-a-share::Value comes from the business":
    "Over many years, prices tend to follow earnings and what investors think those earnings will become. A business that earns more, with a durable way of earning it, can support a higher price. Over days, the same stock moves because a headline surprised people, because a large fund is buying or selling, or because the whole market is repricing interest rates. Both clocks are real. Mixing them, such as judging a ten-year business by one afternoon, is how plans get abandoned.",

  "l1-quotes-and-spreads::Last, bid, ask":
    "Last is history: the most recent agreement. Bid and ask are the live auction. If you need to buy this second, you lift the ask. If you need to sell this second, you hit the bid. A last price of 50.00 with an ask of 50.20 means the screen you remember is already behind the price you would actually pay. Always read the side you are about to trade, not only the big number.",
  "l1-quotes-and-spreads::The spread is a cost":
    "Bid 49.98 and ask 50.02 is 4 cents of spread. On 100 shares, buying and selling immediately loses about $4 before any idea has worked. On 1,000 shares it is about $40. In a stock with a 50 cent spread the same round trip costs far more, which is common in names that trade lightly. That cost is why a one-minute scalp in a wide-spread stock can be a loss even when the last price ticks your way.",
  "l1-quotes-and-spreads::Volume shows activity":
    "Volume counts shares that changed hands, not how many people felt bullish. A stock can rise 6% on three times its usual volume, which means many participants agreed to trade at the new prices. The same 6% on a tiny fraction of normal volume can be a few orders in a thin book, and the next decent sell order can give it back. High volume also tends to come with tighter spreads, because more people are competing to be the best bid and ask.",

  "l1-why-prices-move::Company news":
    "A product launch, a lawsuit, a change of chief executive, or an earnings report moves one company because it changes what that business might earn. The size of the move depends on the gap between the news and what was already expected. A good headline that everyone already assumed can be a small move or a drop. Read the surprise, not the adjective in the headline.",
  "l1-why-prices-move::Market-wide news":
    "A jobs report, an inflation print, or a change in interest-rate expectations is about the economy, not one firm. On those days most stocks can fall together even if the company had no announcement. That is why a stock you like can be red on a morning you cannot find any company news. Separate 'the business changed' from 'the price of money changed' before you decide the thesis is broken.",
  "l1-why-prices-move::Already priced in":
    "If the crowd expected $2 of earnings and the company reports $2, the new information is roughly zero, so the price may not rise. If the crowd expected $2.20, then $2 is a disappointment even though the business grew. Prices are a forecast. The useful question on every headline is: what did people already believe, and what is different now?",

  "l1-long-vs-short::Going long":
    "Long is the ordinary position: you paid for shares, you own them, and you profit if you later sell higher. If the price falls to zero, the shares are worthless and the loss stops at what you paid, ignoring any money you borrowed to buy them. Dividends, if the company pays them, come to you while you hold. Nothing in a long position requires you to buy more if the price rises.",
  "l1-long-vs-short::Selling is not shorting":
    "Selling shares you already own closes a long. You are out. Shorting starts a new position: you borrow shares, sell them, and you must buy them back later to return them. The cash from that sale is not profit yet. Profit or loss appears when you buy the shares back. People mix the words because both involve a sell ticket. The risk and the intent are different, and the Academy's paper account only lets you sell what you already hold.",
  "l1-long-vs-short::Short risk is open-ended":
    "A share price has a floor at zero and no ceiling. A long can lose 100% of what was paid. A short loses more as the price rises, and a squeeze or a takeover bid can double or triple a stock in a short time. You may also owe the dividend while the borrow is open, and the lender can recall the shares. That open-ended loss is why this app's paper account does not offer shorts. Learn the difference here before you meet the ticket at a broker.",

  "l1-investing-vs-trading::Two horizons":
    "An investor's question survives a 20% drop if the business still earns what they thought it would earn over years. A trader's question is about the next days or weeks: is the entry still valid, and is the exit still the one they wrote down? The same stock can be an investment for one person and a trade for another. The chart, the stop, and the attention it needs all follow from that choice.",
  "l1-investing-vs-trading::Different questions":
    "An investor reads the business: sales, cash, debt, and whether the price is sensible against those earnings. A trader reads the plan: entry, the price that proves them wrong, and the price where they take profit. The common mix-up is a trade that goes wrong and is quietly relabelled an investment so the loss does not have to be taken. That is a new decision, and it deserves a new written reason, not a new name for the old one.",
  "l1-investing-vs-trading::Pick before you buy":
    "Write the horizon in the same place as the order. It tells you which drop is noise and which drop breaks the idea. A three-day trade does not get a 'give it a year' speech after it fails. A five-year holding does not get sold because one red day felt loud. The horizon also sets position size: money you cannot leave alone should not be sized like money you can.",

  "l1-diversification::One stock, one big risk":
    "One company can gap down 40% on a single report, a fraud finding, or a lost customer. If that name is the whole account, the account gaps with it. Five positions of equal size mean the same event hurts about a fifth of the account, if the other four are not the same story. Diversification does not stop a market-wide decline. It cuts the damage from one firm's bad day.",
  "l1-diversification::Correlation":
    "Correlation is whether prices tend to move together. Five oil producers, or five banks, often fall on the same headline because the business risk is shared. That is concentration wearing a diversified label. Holdings that do not share a customer, a commodity, or a rate sensitivity give the spread its value. You do not need them to move in opposite directions every day. You need one disaster not to be five disasters.",
  "l1-diversification::Funds do it for you":
    "An exchange-traded fund holds a list of securities and trades like a share. A broad stock-index fund spreads one purchase across hundreds of companies, which is the simplest way to avoid a single-name blow-up. You still own the market's ups and downs. Read what the fund actually holds: two funds with similar names can be a whole market or a single industry. Level 7 goes further into costs and holdings.",

  "l2-reading-a-candle::Four prices in one shape":
    "Open is the first trade of the period. Close is the last. High and low are the extremes in between, drawn as wicks. A daily candle hides everything that happened at 10:15 and only keeps those four prints. That is why a calm daily bar can contain a violent morning. If you need the path inside the day, change the period. Do not invent it from the daily shape.",
  "l2-reading-a-candle::Green and red":
    "Colour compares close with open inside this candle, not with yesterday's close. A green candle can still be below yesterday if it opened down and only recovered part of the way. A red candle can still be a higher high in an uptrend. Read the body for who won the period, then read where that candle sits against the ones before it. Colour alone is not the trend.",
  "l2-reading-a-candle::Bars and sessions":
    "On a daily chart the open is the morning auction and the close is the end of the regular session, for a stock. In the paper account each candle is one session on purpose: an order you place after a candle closes is tested against the next candle's range, the way a real order placed after the close waits for the next session. Practise that timing here before you assume an order fills at the price you were looking at.",
  "l2-reading-a-candle::Which end is the open":
    "A quick check: find the colour first, then read the body from the end where the period started. A green body from 48 to 52 opened at 48 and closed at 52. A red body over the same prices opened at 52 and closed at 48. Same shape, opposite story. If a chart draws hollow and filled bodies instead of colours, the rule is the same: hollow is up, filled is down.",
  "l2-reading-a-candle::Colour is a record, not an order":
    "Red says sellers had the upper hand in that window; green says buyers did. A one-minute candle and a weekly candle can point opposite ways at the same moment, because they cover different windows. Colours are also just a setting. Many charting apps let you pick your own, and charts in some markets use red for up and green for down, so check the legend before reading a chart from a new source.",

  "l2-wicks-and-bodies::Long wicks show rejection":
    "A long lower wick means the low was visited and not kept. Sellers pushed, buyers closed the period back up, and the low is a price the market refused to settle at. A long upper wick is the mirror: the high was rejected. Rejection is information about that period. It is not, by itself, an order to buy or sell. The next candles have to show whether anyone still cares about that rejected price.",
  "l2-wicks-and-bodies::Full bodies show control":
    "A wide body and tiny wicks means the period opened near one extreme and closed near the other. One side did not give the price back. On a daily chart that is a day of control, often accompanied by news or by a break of a level. The useful follow-up is whether the next period holds that close or immediately retraces it. A strong body that is fully reversed the next bar was control for one session, not a new trend.",
  "l2-wicks-and-bodies::Small bodies show indecision":
    "A doji, or any candle with a very small body, closed near where it opened. Buyers and sellers both had turns, and neither kept the close. In the middle of a quiet range that is ordinary noise. After a long run in one direction it can mean the push is tiring, because the same effort no longer moves the close. Wait for the next close to see which side actually takes over. The small body is a question, not an answer.",
  "l2-wicks-and-bodies::No wicks: a shaven candle":
    "A green one opened at its low and closed at its high: buyers held control from the first trade to the last. A red one opened at its high and closed at its low. That is a strong record for one period, not a forecast for the next. Real charts often leave a wick of a cent or two, which reads the same. The missing-wicks lab shows how one shaven hourly candle can hide different paths inside the hour.",
  "l2-wicks-and-bodies::Long wicks, short wicks":
    "Compare wicks with the candles around them, not with a fixed size. A day whose wicks are three times longer than the last ten days had unusual swings, often around news. A run of candles with short wicks is an orderly move. Neither tells you the next direction. A long wick matters most at a level the market already watches, which is where the support and resistance unit picks up.",

  "l2-trend-vs-range::Uptrend":
    "Higher highs and higher lows mean each dip found buyers above the prior dip. The last higher low is the line in the plan: a close under it says the pattern of higher lows has broken. Buying a pullback toward that low, with the stop just beyond it, is the classic way to join the trend without paying the high of the spike. If you cannot point at the last higher low, you do not have the structure yet, only a feeling that it is going up.",
  "l2-trend-vs-range::Downtrend":
    "Lower highs and lower lows mean rallies are being sold before they reach the prior high. A stock that has fallen a long way can look cheap and still be in that pattern. Buying only because the price is lower than last month is arguing with the structure. The change to watch for is a higher low and then a break of the last lower high. Until that prints, the trend's plan is still down, and waiting is a position.",
  "l2-trend-vs-range::Range":
    "A range has a ceiling that has rejected price more than once and a floor that has caught it. There is no series of higher highs or lower lows. Breakouts from ranges fail often on the first push, because both sides have been active at the edges and the first close outside can be a poke. Many traders stand aside until a close holds outside the box and a pullback respects the old edge. Trading every touch of the box is how ranges grind down a plan.",

  "l2-support-resistance::Floors and ceilings":
    "Support is an area where declines have stopped before, not a single price to the penny. Resistance is an area where rallies have stopped. Draw it as a zone that covers the wicks, not a hairline through one extreme. The more times the area has held, and the more recently, the more orders tend to sit there. A level from two years ago that has been sliced through since then is history, not a floor.",
  "l2-support-resistance::Breaks and retests":
    "A close through resistance, not just a wick, is the break. Traders who sold there are now wrong, and the old ceiling often gets retested as a floor: price comes back, and buyers who missed the break try to enter. If price falls straight back inside the old range and stays there, the break failed. Failed breaks are common. Treat the retest as the check, not as a formality.",
  "l2-support-resistance::Levels place stops":
    "A long taken because support held is wrong if price closes through that support. The stop belongs just beyond the zone, where the reason is gone, not at a round number that feels tidy. The distance from entry to that stop is the risk per share. If that distance is large, you buy fewer shares so the money at risk stays the amount you already accepted. A stop with no level behind it is just a pain threshold.",
  "l2-support-resistance::Wicks mark the edges":
    "Draw the zone across the wick tips, not through a single extreme. A wick above the zone that closes back inside is a test, not a break: the close is what counts. The more often a level rejects price, the more traders watch it, and the more a clean close through it means. Check the volume on that close too; the volume unit shows why a heavy-volume break is easier to trust.",

  "l2-volume-confirms::Volume bars":
    "Each volume bar is the share count for that same period as the candle above it. Compare it with the recent typical bar, not with a memory of a busier stock. A push that is well above that typical bar had many participants. A push on a stub of volume had few. This app's sample charts are stylized, so use the volume you are shown as part of the drill, and do not assume a live tape would print the same number.",
  "l2-volume-confirms::Breakouts want volume":
    "A break of resistance means price went to a place it had not settled before. Heavy volume says many traders accepted the new prices. Light volume says a few orders poked through, and the next ordinary sell can push it back. Light-volume breaks fail more often for that reason. Volume does not make the break correct. It tells you whether the break had company.",
  "l2-volume-confirms::Spikes after news":
    "An earnings day or a major headline often prints the biggest volume bar in months. That candle's high, low, and any gap away from the prior close become reference prices, because a huge fraction of holders established a position there. Later pullbacks are judged against that day: did price hold the gap, or fill it? The spike is the event. The following bars tell you whether the event stuck.",
  "l2-volume-confirms::Volume behind a candle":
    "Read volume against the stock's own recent average, which many charts show as a line or a relative-volume figure. A breakout bar on twice the average, followed by quiet pullbacks, is a supported move. A rally on shrinking volume, or a breakdown nobody joined, deserves more doubt. Volume never says the move must continue. It says whether the crowd showed up for it.",

  "l2-patterns-need-context::Location first":
    "A hammer is a small body with a long lower wick. At the end of a decline, sitting on support, it can be buyers rejecting a low. The same shape in the middle of a sideways chop is just a candle. Catalogues that list a shape as bullish or bearish without saying where it appears are incomplete. Ask where it is in the trend, and what level it is reacting to, before you name the trade.",
  "l2-patterns-need-context::Wait for confirmation":
    "The pattern candle is a hint that control might be changing. Confirmation, for many traders, is the next candle closing in the new direction: for a bullish reversal, a close above the pattern's body. Acting on the hint alone means you are early every time the next bar continues the old trend, which is often. Waiting gives up a little of the move and avoids a lot of the false starts.",
  "l2-patterns-need-context::Practise finding them":
    "The hunt lab puts a full chart in front of you and asks you to find the pattern that matters, which trains location instead of flashcard shapes. Lookalike asks you to tell similar shapes apart. Buy or Sell then forces a decision, and one of the honest answers is to wait. Use those labs after this unit. Recognising a name is not the same as knowing whether this chart is the place to act.",

  "l3-market-vs-limit::Market: fill now":
    "A market order says fill me at the best price available now. In a tight, busy stock that is close to the last trade. In a thin stock, or in the seconds after news, the best available price can be far from the number on your screen, because the nearby shares were already taken. In this paper account the fill is the next candle's open, a simulated rule you can see. The lesson transfers: you are sure to trade, and you are not sure of the price.",
  "l3-market-vs-limit::Limit: your price or better":
    "A buy limit at 50 will not pay more than 50. If the stock never trades there, you get no shares, and the move you wanted can happen without you. If the next candle opens at 48, through your 50 limit, you are filled at the better open, not at 50. A sell limit at 55 works the other way: 55 or higher, or no sale. The limit is a price decision. It is also a decision to accept missing the trade.",
  "l3-market-vs-limit::Which one when":
    "Use a market order when being in or being out matters more than a few cents, such as exiting because the plan is broken and the stock is liquid. Use a limit when you have a price that makes the idea work and you are willing to keep your cash if it is not reached. Chasing with a market order after a vertical candle is how a good idea becomes a bad fill. A limit that is so far from the market that it will never trade is not a plan either.",

  "l3-stop-orders::A trigger, then a market order":
    "The stop price is not the fill. It is the alarm. A sell stop at 45 does nothing while the stock trades at 50. When a trade prints at or through 45, the order becomes a market order and takes the next available price. A buy stop above the market is the entry version: you want in only if price shows strength through a level. Until the trigger, a stop is invisible to the auction.",
  "l3-stop-orders::Gaps fill worse":
    "Stops do not reach into a gap and pull the price back to the trigger. If the stock closes at 46 and opens at 41, a sell stop at 45 is already through, and the market order sells near 41. Your planned loss was 45. The actual loss is 41. That is gap risk, and it is largest on news and on thin names. Size the position knowing the fill can be worse than the line you drew.",
  "l3-stop-orders::Where the stop goes":
    "Put the stop where the reason for the trade is false. Under support, or under the last higher low, a close means the structure you bought is gone. A round number, or a fixed 2% below entry, does not know that structure. Once the price is chosen, convert the distance into shares: a wider, more honest stop means fewer shares so the money lost stays the amount you accepted. Do not tighten the stop onto a meaningless price just to buy more.",

  "l3-stop-limit::Stop plus limit":
    "Two prices, two jobs. The stop is when the order wakes up. The limit is the worst price you will then accept. A sell stop at 45 with a limit at 44 becomes a sell limit at 44 after 45 prints. It will not sell at 43. A plain stop would have become a market order and sold at whatever was there. You added a floor under the exit, and you gave up the certainty of getting out.",
  "l3-stop-limit::Price control, fill risk":
    "If the stock gaps from 46 to 40, the stop at 45 has triggered and the limit at 44 is above the new market. The order can sit working while the shares keep falling. You still own them. That is the failure mode of a protective stop-limit: the moment you most want out is the moment the limit refuses to trade. A plain stop would have sold near 40 and ended the position at a known bad price instead of an unknown worse one.",
  "l3-stop-limit::When people use it":
    "A stop-limit fits an entry you refuse to chase. A buy stop at 51 with a limit at 51.20 gets you the breakout only if you can still pay 51.20 or better. If the breakout gaps to 55, you are not filled, and that can be the right miss. For a protective exit, many traders prefer the plain stop, because not selling is worse than selling badly. Match the tool to which risk you hate more: a terrible price, or no fill.",

  "l3-trailing-stop::A stop that follows price":
    "A trailing sell stop is measured from the highest price since you placed it, not from your entry. A $3 trail or a 5% trail both ratchet up when that high rises, and they do not ratchet down when price falls. The stop can only get closer to the market or stay put. It never widens to give back extra room. That one-way behaviour is the whole point: lock in more of a gain without having to pick the top.",
  "l3-trailing-stop::An example":
    "You buy at 50 with a $3 trail, so the stop starts at 47 while the high is 50. The stock rises to 58. The stop follows to 55 and stays there when price eases. A print at 55 sells you out, and you keep most of the move from 50 even though you did not sell the exact high at 58. If the stock had gone straight from 50 to 47, you would be out near 47 with a small loss. The trail did not know the future. It only followed the high you actually got.",
  "l3-trailing-stop::Choose the distance":
    "A trail inside the normal noise of the stock will stop you out on an ordinary dip and miss the rest of the trend. A trail wider than the last pullback gives back a large piece of the gain before it acts. A practical alternative is to trail under structure: move the stop up under each new higher low, rather than a fixed dollar amount. Either way, decide the distance when you enter, not after the first red candle scares you.",

  "l3-time-in-force::Day orders":
    "A day order is alive for one session. At the close, if it has not filled, it is gone and you must choose again tomorrow. That is the right lifetime when the idea was about today: a level that matters in this session, or a news reaction you do not want working overnight. In the paper account one bar is one session, so a day order is tested on the next candle and then expires. You will see the expiry instead of wondering where the order went.",
  "l3-time-in-force::Good 'til cancelled":
    "Good 'til cancelled means the order keeps working across sessions until it fills or you cancel it. Real brokers often expire these after weeks or months anyway, so 'cancelled' is not forever. A protective stop is usually GTC because the risk does not end at the closing bell. A patient limit, the price you are willing to pay on a pullback, is the other common use. Both need a review date, or they outlive the reason you placed them.",
  "l3-time-in-force::Clean up":
    "An old GTC buy can fill on a morning you are no longer following the stock, at a price that made sense last month and does not make sense after new news. An old stop can fire after you have already decided to hold for a different reason. Whenever the plan changes, open the order list and cancel what no longer matches. The dangerous order is the one you forgot, not the one on the ticket in front of you.",

  "l3-position-sizing::Start from the loss":
    "Size starts from money, not from how many shares feel serious. One percent of a $10,000 account is $100. That $100 is what you are willing to lose if the stop is hit, not what you are willing to spend. Spending and risking are different. You might spend $2,500 to buy shares and still only have $100 at risk if the stop is close. Write the dollar loss first. The share count comes second.",
  "l3-position-sizing::Divide by the stop distance":
    "Entry 50 and stop 48 is $2 of risk per share. $100 divided by $2 is 50 shares. If the honest stop is at 45, the distance is $5, and the same $100 buys only 20 shares. A wider stop does not mean you should lose more dollars. It means each share carries more risk, so you hold fewer of them. People do the opposite, buying a full lot and then tightening the stop to fit, which puts the exit on a price the trade did not earn.",
  "l3-position-sizing::Check the position size":
    "Fifty shares at $50 is $2,500, a quarter of a $10,000 account. The risk is still about $100 if the stop is $2 away, but a gap through the stop can lose much more than $100 because you own $2,500 of stock. A second cap, such as 25% of the account in one name, limits that gap damage. The paper challenges score both the risk-per-idea rule and the position cap. Passing one and ignoring the other is an incomplete size.",

  "l3-trade-plan::Four numbers":
    "Entry is where you get in and why that price. Stop is where the idea is wrong. Target is where you will take profit, at least in part. Size is how many shares put the stop distance inside your dollar limit. If one of the four is 'I'll see,' you are negotiating with a moving price. Fill them in before the order, on paper if you have to. A plan you cannot say out loud is a hope.",
  "l3-trade-plan::Reward vs risk":
    "From 50, a stop at 48 risks 2. A target at 56 makes 6. That is 3 units of possible gain for 1 unit of possible loss, written 3 to 1. A target at 51 makes 1 against the same 2 of risk, so you need to be right much more often than you are wrong just to break even after the losers. The ratio is not a promise the target will print. It is a check that the payoff is worth the times you will be stopped.",
  "l3-trade-plan::Measure results in R":
    "R is the dollars you planned to risk on that trade. Lose the planned amount and the result is −1R, whether the account is small or large. Make three times that amount and it is +3R. Adding up R, instead of dollars, shows whether the winners are paying for the losers. A few huge-share trades will dominate a dollar tally and hide a method that is actually poor. R keeps the method visible.",

  "l4-three-statements::Income statement":
    "Revenue is what customers were billed in the period. Subtract the cost of producing those sales, then operating costs, interest, and tax, and you reach net income. Divide net income by the share count and you have earnings per share. A single quarter can be distorted by a one-time gain or a one-time legal charge. Read at least a few periods, and notice whether the profit is coming from the main business or from a line that will not repeat.",
  "l4-three-statements::Balance sheet":
    "The income statement is a film of a quarter. The balance sheet is a photograph on the last day: cash, inventory, buildings, and money customers still owe, against loans, unpaid bills, and other liabilities. Equity is the plug that makes assets equal liabilities plus equity. It is the residual belonging to owners. A company can show a profit in the quarter and still have a fragile photograph if debt is high and cash is thin.",
  "l4-three-statements::Cash flow statement":
    "Profit uses accrual rules. Cash flow counts the money that actually moved. Operating cash is what the business collected and paid in its ordinary work. Investing cash is equipment, acquisitions, and sales of assets. Financing cash is borrowing, repayments, new shares, and dividends. A healthy firm usually shows operating cash that can fund the investing it needs. If operating cash is weak and financing cash is a constant inflow of new debt, the business is being carried by lenders.",

  "l4-profit-vs-cash::Accrual accounting":
    "A sale signed today can sit in revenue now and in cash sixty days later, as a receivable. Profit rises on the signature. Cash rises when the customer pays. If customers pay slower, or if the company builds inventory that has not sold, profit and cash move apart. That gap is not always trouble. A growing firm often consumes cash. It is a question: is the gap a timing lag you can explain, or a sign that reported earnings are not being collected?",
  "l4-profit-vs-cash::Free cash flow":
    "Operating cash flow minus the spending required to maintain and grow the asset base is a common definition of free cash flow. It is cash the company could use to repay debt, pay a dividend, or buy back shares. Years of accounting profit with negative free cash flow mean the firm must raise money, by borrowing or by selling new shares, to keep going. Those raises dilute owners or add interest. Profit that never becomes spare cash is an incomplete result.",
  "l4-profit-vs-cash::Watch the gap":
    "Lay net income next to operating cash flow for several quarters. If they track, the earnings are mostly collecting. If income rises and operating cash falls, look at receivables, inventory, and one-off gains. The Statements lab in this app is built for that comparison on fictional companies whose numbers tie out. Use it until the gap is a habit to check, not a surprise you notice after the stock has already moved.",

  "l4-margins-and-pe::Margins":
    "Net margin is net income divided by revenue. Fifteen of profit on 100 of sales is 15%. A rising margin means the firm keeps more of each sale, from pricing, mix, or costs. A falling margin with rising sales can mean growth that is getting more expensive to deliver. Gross margin, before operating costs, tells you about the product itself. Net margin tells you what is left after the whole company has been paid for. Watch the direction over several periods, not one quarter in isolation.",
  "l4-margins-and-pe::P/E ratio":
    "Price divided by earnings per share is how many dollars investors are paying for one dollar of recent earnings. A $60 share earning $3 is 20 times earnings. A high multiple means the price assumes earnings will grow, or that the earnings are unusually depressed. A low multiple can mean a bargain or a business the market thinks will earn less soon. The ratio is a question about expectations. It is not a verdict that the stock is cheap or expensive on its own.",
  "l4-margins-and-pe::Compare like with like":
    "A grocery chain can be healthy at a few percent of net margin because it turns inventory quickly and uses little capital per sale. A software firm at the same margin may be failing a model that usually keeps much more. P/E ratios cluster by industry for the same reason. Compare the company with its own history and with peers that sell the same kind of thing. A multiple that looks high next to a bank can be ordinary next to a faster-growing peer.",

  "l4-earnings-expectations::The consensus":
    "Before the report, analysts publish revenue and earnings estimates. The average of those estimates is the consensus the headline will be judged against. A beat is a result above that average. A miss is below. Beating last year's number is a different comparison, and it can still be a miss if the consensus was higher than last year. Always ask which bar the stock was priced against.",
  "l4-earnings-expectations::Guidance often matters more":
    "Guidance is management's own forecast for the next quarter or the year. The quarter just ended is already over. The forecast is what holders will live with next. A company can beat the quarter and cut the forecast, and the stock often falls, because the market reprices the path ahead. Read the outlook with the same care as the earnings line. A raised outlook with a small miss can be the stronger report.",
  "l4-earnings-expectations::The implied move":
    "Option prices before a known report embed how large a move traders are paying for, up or down. If the options imply about an 8% move and the stock opens up 4%, the result was inside what was already priced, even if the headline says beat. Read the Print in this app drills that comparison on fictional reports. The size of the surprise relative to the expected move matters more than the adjective in the title.",

  "l4-earnings-reactions::Gaps":
    "A gap is a jump from the prior close to the next open, with no trades in between, usually because the report landed while the market was shut. A gap that holds means later trading stays on the new side of the old close. A gap that fills means price trades back to that close, and the opening emotion did not stick. The first fifteen minutes are not the verdict. The next few closes are.",
  "l4-earnings-reactions::Drift":
    "Large surprises have, in market history, tended to keep moving in the same direction for days or weeks. That tendency is called post-earnings drift. It is an average across many stocks, not a schedule for the one you are watching. Some gaps reverse the next day. Use drift as a reason not to assume the first print is the whole story, and not as a reason to buy every beat.",
  "l4-earnings-reactions::Sell the news":
    "If a stock has already risen for weeks into the report, many of the buyers who wanted the good news are already in. When the news arrives, they sell to lock the gain, and the stock can fall on a beat. Positioning, who already owns it and who is left to buy, is part of the reaction. A cheap-looking beat after a long run is not the same setup as a beat nobody had chased.",

  "l4-balance-sheet-risk::Net debt":
    "Add up interest-bearing debt and subtract cash and short-term investments. That is net debt. Five hundred of debt and two hundred of cash is three hundred of net debt. If cash exceeds debt, net debt is negative, sometimes called a net cash position. Gross debt alone can make a cash-rich firm look more burdened than it is. Net debt is the figure to put next to earnings when you ask whether the balance sheet can absorb a bad year.",
  "l4-balance-sheet-risk::Leverage":
    "Net debt divided by a year's EBITDA, a measure of earnings before interest, tax, and non-cash charges, is a common leverage ratio. Around one times, the debt could be paid from about a year of that earnings stream. Around four times or more, a down year leaves little room before lenders get nervous. The right level depends on how steady the earnings are. A utility and a cyclical manufacturer do not carry the same multiple with the same safety.",
  "l4-balance-sheet-risk::Covenants":
    "Loan agreements often require the borrower to stay under a leverage ceiling or above an interest-coverage floor. Breaking a covenant can let the lender demand repayment or charge more. Stocks often fall as the ratio approaches the line, before any formal breach, because the risk of a forced deal becomes visible in the statements. Read the debt note, not only the headline earnings, when leverage is already high.",

  "l5-jobs-and-inflation::The jobs report":
    "Nonfarm payrolls are the monthly change in jobs outside farming, private households, and a few other categories. The unemployment rate is the share of the labour force without a job and looking. Strong hiring can mean demand is healthy. It can also mean wages will rise and keep inflation up, which is why a very strong report is not automatically good for stock prices. Markets compare the payroll number with the estimate published beforehand.",
  "l5-jobs-and-inflation::Inflation (CPI)":
    "The consumer price index tracks a basket of things households buy. The headline number includes food and energy, which jump with oil and crops. Core CPI leaves those out so the trend in other prices is easier to see. A hot core reading, above what economists expected, tells the central bank that inflation is not cooling on the schedule they had in mind. The month-over-month change is what the hour of the release usually trades.",
  "l5-jobs-and-inflation::Surprise moves markets":
    "A number that matches the consensus is often a quiet release. A number hotter than expected tends to push bond yields up, because traders mark a higher path for interest rates, and stocks can fall as borrowing costs and discount rates rise. A cooler surprise often does the reverse. The direction is about the surprise, not about whether the economy added jobs or prices rose at all. Almost every release shows some rise or some hiring.",

  "l5-the-fed::The policy rate":
    "The federal funds rate is what banks charge each other for overnight loans of reserves. The Federal Reserve sets a target range for it and steers the market rate into that range. When the range rises, the cost of short-term borrowing in the economy rises with it: credit cards, business lines, and eventually mortgages and corporate bonds feel it. The Fed is not setting the stock market. It is setting the price of short-term money, and other prices adjust.",
  "l5-the-fed::Meetings and statements":
    "The Federal Open Market Committee meets about eight times a year. The decision on the target range is only part of the event. The statement's adjectives, and the chair's answers afterward, tell traders whether the next meetings are more likely to raise, hold, or cut. A decision that was fully expected, delivered with unchanged language, can be a small market move. A new phrase about inflation or the labour market is often the part that reprices bonds and stocks.",
  "l5-the-fed::Priced-in decisions":
    "Futures on the policy rate show what traders already believe will happen at the next meeting. If they imply a cut with high confidence and the cut arrives, stocks may barely react. If the same cut arrives with language that the committee is done cutting, the outlook change is the news. Read the expectation before you read the decision. Otherwise every announcement looks like a surprise, and you will not understand why the tape was quiet or violent.",

  "l5-yield-curve::Treasury yields":
    "A Treasury yield is the annualised return if you buy that government note or bond and hold it, ignoring price swings in between. The two-year yield moves closely with where traders think the Fed's policy rate will sit over the next couple of years. The ten-year also includes a longer view of growth, inflation, and the extra return investors demand for locking money up. When you hear 'yields rose,' ask which maturity. They do not always move together.",
  "l5-yield-curve::The curve":
    "Plot yield against maturity and you have the curve. In ordinary times it slopes up: a ten-year loan pays more than a two-year loan because more can go wrong over a decade. When the two-year yields more than the ten-year, the curve is inverted. Inversions have often appeared before economic slowdowns, sometimes many months earlier, and sometimes without a recession on the schedule people expected. It is a warning light, not a date.",
  "l5-yield-curve::Why stocks care":
    "A higher yield is a higher discount rate on future profits and a more attractive bond for money that might have bought stocks. Companies whose earnings are expected far in the future, often faster-growing firms, tend to fall more when long yields jump. Banks, homebuilders, and utilities each react for their own reasons, through lending spreads, mortgage demand, or dividend competition with bonds. 'Rates up, stocks down' is a tendency, and it is not uniform across the market.",

  "l5-macro-reactions::Hot vs cool":
    "Hotter than expected inflation or hiring usually means traders mark interest rates higher. Bond yields rise, the dollar often rises with them, and stocks can fall because future profits are discounted more harshly and borrowing costs more. Cooler than expected data often pushes yields and the dollar down and can lift stocks. Learn the pair as a default, then ask whether the market is currently hoping for strong growth or hoping for easier policy. The same print does not mean the same trade in every year.",
  "l5-macro-reactions::Bad news can be good news":
    "When inflation is the fear, weak growth can be welcomed because it makes rate cuts more likely. Stocks rise on a soft jobs number. When recession is the fear, the same soft number is bad news and stocks fall. The regime is the missing variable. Before you fade or join the first spike, name which fear is in charge this month. The Macro Desk lessons in this app are built around that switch.",
  "l5-macro-reactions::Practise it":
    "The macro play screen shows a simulated release, the number economists expected, and the number that printed. You call the reaction in yields and stocks before the chart is revealed. The point is the mapping, not a score you can spend. After a few rounds the hot-versus-cool default should be automatic, and the bad-news-is-good-news exception should be a question you ask instead of a surprise.",

  "l5-housing-and-rates::Mortgages follow the 10-year":
    "A 30-year US mortgage rate is not the Fed's overnight rate. It tends to track the ten-year Treasury yield plus a spread that covers the lender's costs and the risk of the loan. When the ten-year jumps half a percentage point, mortgage offers reprice within days, and the monthly payment on a new loan rises with them. Watching only the Fed meeting and ignoring the ten-year misses the rate that actually shows up on a home purchase.",
  "l5-housing-and-rates::Housing activity":
    "More expensive mortgages price some buyers out, so existing-home sales and new construction usually cool, with a lag of months rather than minutes. Housing starts count homes begun. Building permits are the applications ahead of those starts, so permits often turn first. A single month is noisy, especially in winter. The direction over several months is the signal that the rate move has reached the real economy.",
  "l5-housing-and-rates::Rate-sensitive sectors":
    "Homebuilders feel mortgage demand directly. Real estate firms feel property values and their own debt costs. Utilities often trade like bond substitutes, so higher yields can pull money out of their dividends. Banks feel both sides: they earn more on some loans and suffer if borrowers struggle or if long rates and short rates squeeze their margin. Calling a sector rate-sensitive means its stocks regularly reprice when yields move, not that every name in it moves the same percent.",

  "l6-what-is-an-option::A right, not an obligation":
    "A call is the right to buy. A put is the right to sell. The strike is the price in that right. Expiration is the last day the right exists. One standard equity contract covers 100 shares. The buyer pays a premium and can walk away, losing at most that premium. The seller receives the premium and must perform if the buyer exercises. You are not choosing a side until you know whether you are buying the right or selling the obligation.",
  "l6-what-is-an-option::Premium and contracts":
    "Quotes are per share, and the contract multiplies by 100. A premium of 2.00 is $200 of cash for one contract. A premium of 0.50 is $50. Sellers collect that cash on day one and live with the obligation until expiration or until they buy the option back. Buyers pay it up front. Forgetting the hundred-share multiplier is how a small-looking quote becomes a much larger position than the account can carry.",
  "l6-what-is-an-option::Expiration":
    "At expiration the right is worth only what exercise would pay, or zero. A call with strike 50 on a stock at 48 is not exercised, and the premium is gone. There is no refund for being close. Time left before that date has value of its own, which is why the same strike costs more with three months left than with three days left. Short-dated options can go from expensive to worthless in a single session if the stock does not get there in time.",

  "l6-payoff-at-expiration::Long call":
    "Buy the 50 call for 2.00, which is $200. At expiration the call is worth the greater of the stock price minus 50, or zero. At 60 that value is 10, so the profit per share is 10 minus the 2 you paid, times 100 shares: $800. At 52 you break even. Below 50 the call is worth zero and the loss is the whole $200, no matter how far the stock falls. The loss is capped. The gain rises as the stock rises. That shape is the reason people buy calls, and the reason the premium has to be earned back before any profit exists.",
  "l6-payoff-at-expiration::Long put":
    "Buy the 50 put for 1.50, which is $150. At expiration it is worth the greater of 50 minus the stock, or zero. At 40 that value is 10, so profit per share is 10 minus 1.50. Breakeven is 48.50. Above 50 the put expires worthless and the loss is the $150. If the stock went to zero the put would be worth 50, and the profit would be 50 minus 1.50, times 100. Puts profit when the stock falls far enough to cover what you paid. A small dip that never reaches the breakeven is still a loss of premium.",
  "l6-payoff-at-expiration::Charts show it":
    "A payoff chart puts stock price on the horizontal axis and profit on the vertical, at expiration only. The line kinks at the strike, because that is where the option switches from worthless to in the money. Before expiration the live value is a curve above that line, because time and volatility still have a price. The options ladder in this app draws the expiration picture from the formulas, with the premium given as a number. It is not a live chain and it does not approve you to trade.",

  "l6-covered-call-and-csp::Covered call":
    "You already own 100 shares. You sell one call, often at a strike above the current price, and you keep the premium. If the stock stays below the strike, the call expires and you still have the shares plus the cash. If it rises through the strike, the buyer can take your shares at the strike, so most of the upside above that price is no longer yours. The downside of owning the stock is still yours. The premium only cushions it. This is not a hedge that caps a crash.",
  "l6-covered-call-and-csp::Cash-secured put":
    "You sell a put and you set aside enough cash to buy 100 shares at the strike if you are assigned. If the stock stays above the strike, you keep the premium and never buy. If it falls below, you may be required to buy at the strike, which will be above the new market price. The honest test before you sell: would you be willing to own this company at the strike minus the premium, even if the stock is lower still? If the answer is no, the premium is not a reason to sell the put.",
  "l6-covered-call-and-csp::Assignment":
    "The buyer of an option chooses whether to exercise. When they do, the seller is assigned and must sell shares at the strike, for a call, or buy shares at the strike, for a put. American-style equity options can be exercised before expiration, not only on the last day. Plan the cash and the shares before you sell. Hoping you will not be assigned is not a plan. Buying the option back before expiration is the way out, and that buyback can cost more than the premium you received if the stock has moved.",

  "l6-options-risk::Losing it all":
    "The most a long option can lose is the premium, and that loss can arrive quickly. If the stock moves the right way too late, or not far enough to cover what you paid, the option can expire worthless even though your direction was roughly correct. Short-dated options leave little time for the move, so a quiet week is enough to erase them. Treat the premium as money you can lose entirely, and size it that way, not as a small fee attached to a sure direction.",
  "l6-options-risk::Events and volatility":
    "Before earnings, implied volatility is often high because the report can move the stock a lot, so premiums are expensive. After the report, that extra volatility is no longer needed and premiums can fall sharply even if the stock moves in your direction. Buyers who paid the event price can lose money on a correct guess about the headline. Know whether you are paying for time, for a move, or for the event itself. The options ladder's event notes exist for this reason.",
  "l6-options-risk::Real approval is separate":
    "A brokerage account is approved for options in levels, through the firm's application, the customer's experience, and the rules that firm follows. Passing quizzes in this app, including the options ladder, does not submit that application and does not authorise a single live contract. The ladder teaches payoff shapes at expiration. A real ticket adds margin, assignment, early exercise, and a chain of live prices this app does not have.",

  "l7-etfs::A basket in one share":
    "The fund holds the securities. You hold a share of the fund, which you buy and sell on an exchange through the day, unlike a traditional mutual fund that prices once after the close. One share of a broad index fund is a claim on a slice of hundreds of companies. You do not pick them, and you do not avoid the ones you dislike. Read the holdings list. The name on the fund is marketing. The list is the position.",
  "l7-etfs::Check three things":
    "Holdings tell you the bet: a whole market, a sector, or a narrow theme. The expense ratio is the annual fee taken from the fund, so 0.03% and 0.75% are not the same product even when the names rhyme. Volume and the bid-ask spread tell you what it costs to get in and out. A fund that trades a few thousand shares a day can cost more in spread than a year of the management fee. Two funds that both say they track large US stocks can still differ in fees, in lending, and in how tightly they follow the index.",
  "l7-etfs::Diversified is not riskless":
    "A fund of 500 stocks falls when those 500 stocks fall together, which is what broad markets do in a scare. Diversification removed the risk that one company fails. It did not remove the risk of owning stocks. A sector fund concentrates that risk again, into banks or energy or one country. Own it because you want that bet, not because the word fund sounds safer than the word stock.",

  "l7-futures::An agreement for later":
    "A futures contract obliges the long side to buy, and the short side to sell, a specified amount of an index, a commodity, or another underlier at a set price on a set date. Most traders never take delivery. They buy or sell the offsetting contract and close out before that date. The price you see is today's price of that future delivery, and it moves all session as expectations change. This app's futures tapes are stylized samples for reading the chart, not live contracts.",
  "l7-futures::Leverage":
    "You post margin, a good-faith deposit that is a fraction of the contract's full value. A small percentage move in the underlier is a large percentage move on that deposit, in either direction. That is the leverage. It is not free extra return. It is the same price change on a bigger position than the cash you posted. A move against you can require more margin quickly. Size from the full contract's swing, not from the deposit that made it feel small.",
  "l7-futures::The roll":
    "Each contract expires. A position you want to keep is closed in the expiring month and reopened in a later month. That switch is the roll. The later month can be more expensive than the front month, called contango, or cheaper, called backwardation. Rolling is not free when those prices differ, and a fund that rolls every month can lag the spot price of the commodity for that reason. Different months are different instruments. Do not treat them as one continuous price without checking the gap.",

  "l7-forex::Pairs":
    "Every forex price is a ratio. EUR/USD at 1.0800 means one euro costs 1.08 US dollars. If the quote rises, the euro bought more dollars: the base currency, the one named first, strengthened. You are always long one currency and short the other. There is no 'the euro went up' without saying against which currency. This app's forex charts are sample tapes for that reading, not a live dealing desk.",
  "l7-forex::Pips":
    "For most major pairs a pip is the fourth decimal place, 0.0001. EUR/USD from 1.0800 to 1.0850 is 50 pips. Pairs quoted in yen are usually measured to the second decimal. The spread, in pips, is the cost of crossing from bid to ask, the same idea as in stocks. A strategy that aims to make a few pips can be consumed by the spread before it has a result. Know the pip value of the size you are imagining before you call a small wiggle a profit.",
  "l7-forex::Rates drive currencies":
    "Money tends to move toward currencies whose interest rates are higher, and away when that gap is expected to shrink. A surprise central-bank decision can reprice a pair in minutes because the interest differential is the carrying cost of holding one currency against the other. Inflation and growth reports matter because they change what traders think the bank will do next. The chart is the result. The rate expectation is often the cause.",

  "l7-crypto::Always open":
    "Equity exchanges close. Crypto markets do not. A large move can print on a Saturday night, when stock traders are not at a desk and when the order book is often thinner than on a weekday afternoon. Thinner books mean the same size order moves the price more. A weekend gap in a sample tape is still a chase-versus-wait decision. Hours being open is not a reason you must be in.",
  "l7-crypto::Large swings":
    "Daily moves of several percent are ordinary in the largest coins, and much larger moves are ordinary in small ones. The same dollar risk you would take in a stock therefore requires a smaller position, because the distance to a sensible exit is wider. A position sized as if the coin moved like a large stock will hit a full loss on a routine day. Volatility is a sizing input, not a reason the asset is more attractive.",
  "l7-crypto::Headlines and hype":
    "Listing rumours, exchange outages, hacks, and worries about a stablecoin losing its peg can move prices before any official note exists. The stock rule still applies: separate chatter from a filing, an issuer statement, or an exchange notice, and ask what was already expected. A rally on a rumour that is then denied is a classic give-back. This app's crypto tapes are samples for that drill. They are not a live exchange and not a reason to treat chat as confirmation.",
  ...BEFORE_YOU_TRADE_MORE,
};

export function deepenUnits(units: Unit[]): Unit[] {
  return units.map((u) => ({
    ...u,
    cards: u.cards.map((c) => {
      const more = CARD_MORE[`${u.id}::${c.title}`];
      if (!more) throw new Error(`missing lesson depth for ${u.id} / ${c.title}`);
      return { ...c, body: `${c.body}\n\n${more}` };
    }),
  }));
}
