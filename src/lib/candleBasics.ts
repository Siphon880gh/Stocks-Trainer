/** One candle, drawn as a possible path inside a single period. Prices are diagram units, not a market. */

export interface CandleMark {
  price: number;
  text: string;
  side: "left" | "right";
}

export interface CandleArrow {
  from: number;
  to: number;
  text: string;
}

export interface CandleLesson {
  id: string;
  title: string;
  /** The line the match check asks the learner to pair with this shape. */
  match: string;
  story: string;
  open: number;
  high: number;
  low: number;
  close: number;
  marks: CandleMark[];
  arrows: CandleArrow[];
}

export const CANDLE_LESSONS: CandleLesson[] = [
  {
    id: "green",
    title: "Close above the open",
    match: "Green body: the close finished above the open",
    story: "The close finished above the open, so the body is green. The arrow is one path that ends there: buyers kept paying higher prices from 1:00 to 1:05. The bottom of a green body is the open and the top is the close. The candle stores only the open, high, low and close, not every trade in between. It records what buyers did; it is not a reason to buy.",
    open: 38,
    close: 72,
    high: 78,
    low: 32,
    marks: [
      { price: 38, text: "1:00 open", side: "left" },
      { price: 72, text: "1:05 close", side: "right" },
      { price: 78, text: "high", side: "right" },
      { price: 32, text: "low", side: "left" },
    ],
    arrows: [{ from: 38, to: 72, text: "buyers kept buying" }],
  },
  {
    id: "red",
    title: "Close below the open",
    match: "Red body: the close finished below the open",
    story: "The close finished below the open, so the body is red. Sellers kept accepting lower prices through the five minutes. The top of a red body is the open and the bottom is the close; the wick stubs are the brief pushes past them. Red means the price fell, not that anything is on sale, and it is not a reason to sell.",
    open: 72,
    close: 38,
    high: 78,
    low: 32,
    marks: [
      { price: 72, text: "1:00 open", side: "left" },
      { price: 38, text: "1:05 close", side: "right" },
    ],
    arrows: [{ from: 72, to: 38, text: "sellers kept selling" }],
  },
  {
    id: "upper",
    title: "Long upper wick",
    match: "Long upper wick: price went up, then was sold back",
    story: "Buyers bought in and pushed the price up. Sellers sold it back before 1:05, and the close finished near the open. The long upper wick is that rejected high.",
    open: 46,
    close: 54,
    high: 90,
    low: 42,
    marks: [
      { price: 90, text: "high, then sold", side: "right" },
      { price: 46, text: "1:00 open", side: "left" },
      { price: 54, text: "1:05 close", side: "left" },
    ],
    arrows: [
      { from: 46, to: 90, text: "1:02 buyers buy in" },
      { from: 90, to: 54, text: "1:05 sellers sell it back" },
    ],
  },
  {
    id: "lower",
    title: "Long lower wick",
    match: "Long lower wick: price went down, then was bought back",
    story: "Sellers sold it down. Buyers bought it back, and the close finished above the open. The long lower wick is that rejected low.",
    open: 58,
    close: 68,
    high: 72,
    low: 18,
    marks: [
      { price: 18, text: "low, then bought", side: "left" },
      { price: 58, text: "1:00 open", side: "right" },
      { price: 68, text: "1:05 close", side: "right" },
    ],
    arrows: [
      { from: 58, to: 18, text: "1:02 sellers sell it down" },
      { from: 18, to: 68, text: "1:05 buyers buy it back" },
    ],
  },
  {
    id: "shaven",
    title: "No wicks at all",
    match: "No wicks: the open and close were the low and the high",
    story: "Buyers bought from the very first trade and the close was the highest price of the five minutes. Price never dipped below the open or rose above the close, so there is no wick at either end. That is a shaven candle, also called a marubozu. Strong for this period, not a forecast.",
    open: 20,
    close: 84,
    high: 84,
    low: 20,
    marks: [
      { price: 20, text: "1:00 open = low", side: "left" },
      { price: 84, text: "1:05 close = high", side: "right" },
    ],
    arrows: [{ from: 20, to: 84, text: "buyers from first trade to last" }],
  },
  {
    id: "short",
    title: "Short candle",
    match: "Short candle: neither side moved price far",
    story: "Open, high, low and close all sit close together. In this five minutes neither side moved the price far.",
    open: 48,
    close: 55,
    high: 60,
    low: 44,
    marks: [
      { price: 48, text: "1:00 open", side: "left" },
      { price: 55, text: "1:05 close", side: "right" },
    ],
    arrows: [{ from: 48, to: 55, text: "a small push" }],
  },
  {
    id: "tall",
    title: "Tall body, almost no wick",
    match: "Tall body: one side held the price the whole time",
    story: "Buyers bought from the open and the close stayed near the high. There is almost no wick, so the other side barely pushed back.",
    open: 22,
    close: 88,
    high: 92,
    low: 18,
    marks: [
      { price: 22, text: "1:00 open", side: "left" },
      { price: 88, text: "1:05 close", side: "right" },
    ],
    arrows: [{ from: 22, to: 88, text: "buyers bought and held" }],
  },
  {
    id: "both",
    title: "Wicks both ways",
    match: "Wicks both ways: each push was given back",
    story: "Buyers pushed up and sellers pushed down. Each push was given back, and the close ended near the open. The body stays small. The wicks are the two rejected extremes.",
    open: 48,
    close: 54,
    high: 88,
    low: 16,
    marks: [
      { price: 88, text: "rejected high", side: "right" },
      { price: 16, text: "rejected low", side: "left" },
      { price: 54, text: "1:05 close", side: "right" },
    ],
    arrows: [
      { from: 48, to: 88, text: "buyers pushed" },
      { from: 88, to: 16, text: "sellers pushed" },
      { from: 16, to: 54, text: "back near the open" },
    ],
  },
  {
    id: "doji",
    title: "Open and close together",
    match: "Open equals close: the period ended where it started",
    story: "The open and the close are the same price. Price traveled both ways, then the period ended where it started. That shape is called a doji.",
    open: 50,
    close: 50,
    high: 82,
    low: 20,
    marks: [
      { price: 50, text: "1:00 open and 1:05 close", side: "left" },
      { price: 82, text: "high", side: "right" },
      { price: 20, text: "low", side: "right" },
    ],
    arrows: [
      { from: 50, to: 82, text: "up, then back" },
      { from: 82, to: 20, text: "down, then back" },
    ],
  },
];

export const candleLesson = (id: string) => CANDLE_LESSONS.find((lesson) => lesson.id === id);

/** True when the chosen description belongs to that candle. */
export const matchIsCorrect = (lessonId: string, promptId: string) => lessonId === promptId;
