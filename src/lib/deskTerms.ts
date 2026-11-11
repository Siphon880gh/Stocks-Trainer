/** Glossary terms the paper desk scenarios link to (corporate actions, deals, insiders, credit). */
import type { LiteracyTerm } from "./literacyTerms";

export const DESK_TERMS: LiteracyTerm[] = [
  {
    id: "dividend",
    name: "Dividend",
    category: "ownership",
    summary: "Cash a company pays its shareholders out of profits, usually quarterly; a special dividend is a one-off.",
    detail: "A dividend moves value from the company to the holder: the company's cash falls and the share price drops by about the payout on the ex-dividend date. Total return = price change + dividends. A high yield can signal a payout the business cannot sustain; check free cash flow covers it.",
  },
  {
    id: "ex-dividend-date",
    name: "Ex-dividend date",
    category: "process",
    summary: "The first day a share trades without its next dividend; buyers from that open do not receive it.",
    detail: "You must hold at the close of the day before the ex-date to be paid. The price usually opens lower by about the dividend on the ex-date, so buying just before and selling just after (dividend capture) does not create value, and costs and taxes make it worse.",
  },
  {
    id: "stock-split",
    name: "Stock split",
    category: "ownership",
    summary: "Each share becomes several (4-for-1: one $800 share becomes four $200 shares). The company's value does not change.",
    detail: "Share count multiplies and price, EPS and dividends per share divide by the ratio. Charts show split-adjusted history so there is no artificial cliff. A reverse split (1-for-10) does the opposite and is often a sign of a struggling stock trying to keep a listing.",
  },
  {
    id: "share-buyback",
    name: "Share buyback",
    category: "ownership",
    summary: "The company buys its own shares, reducing the share count so each remaining share owns more.",
    detail: "Buybacks show up as cash out in financing cash flow and a falling diluted share count. EPS can rise with flat net income. Funded from free cash flow they return cash to holders; funded with new debt they add risk. Compare the buyback with stock issued to employees: some only offset dilution.",
  },
  {
    id: "merger-arbitrage",
    name: "Merger arbitrage (deal spread)",
    category: "process",
    summary: "After a takeover is announced, the target trades a little below the offer price; the gap is the deal spread.",
    detail: "The spread pays for the risk that the deal fails (regulators, financing, a shareholder vote) and for the time until it closes. The upside is capped at the offer; if the deal breaks, the target can fall back to where it traded before. The acquirer often falls on announcement because it pays a premium.",
  },
  {
    id: "insider-buying",
    name: "Insider buying",
    category: "markets",
    summary: "Executives or directors buying their own company's shares in the open market, disclosed in a public filing.",
    detail: "Insiders sell for many reasons (taxes, houses, diversification) but usually buy because they think the shares are cheap. Clustered buying by several insiders is the stronger signal. It is context, not timing: prices can keep falling after insiders buy, so the stop still decides the exit.",
  },
  {
    id: "analyst-rating",
    name: "Analyst rating change",
    category: "markets",
    summary: "A research analyst moves a stock between buy, hold and sell, often with a new price target.",
    detail: "Upgrades and downgrades move prices for a day or two because many funds react at once. They tend to last when the reason (orders, subscribers, margins) shows up in the next report, and fade when they rest on valuation alone. Read the reason, not the label.",
  },
  {
    id: "going-concern",
    name: "Going-concern warning",
    category: "process",
    summary: "An auditor's note that there is substantial doubt the company can keep operating for the next twelve months.",
    detail: "It usually follows cash burn, losses and debt coming due with no clear way to refinance. Equity holders are paid last in a bankruptcy, after lenders and suppliers, so shares can go to nearly zero. A rescue rumour is not a reason to buy; check the filing for the debt maturity and cash.",
  },
  {
    id: "restatement",
    name: "Accounting restatement",
    category: "process",
    summary: "A company corrects financial statements it already published because they were wrong.",
    detail: "Often preceded by a late-filing notice. Revenue booked too early is a common cause. Traders sell first because the numbers they relied on were wrong and because trust is now in question; the gap is often slow to fill. Compare the original and restated figures line by line.",
  },
  {
    id: "sector-rotation",
    name: "Sector rotation",
    category: "markets",
    summary: "Money moving from one group of stocks to another as the economy, rates or commodity prices change.",
    detail: "Energy may rise on an oil shock while chip stocks fall on higher rates, with the broad index nearly flat. Comparing each stock's move with the others (relative strength) shows where money is flowing. Stocks in the same sector are correlated, so several of them are not much more diversified than one.",
  },
];
