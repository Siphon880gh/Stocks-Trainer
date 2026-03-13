# Stock Trainer - Candle and Indicator Line

![Last Commit](https://img.shields.io/github/last-commit/Siphon880gh/Stocks-Trainer/main)
<a target="_blank" href="https://github.com/Siphon880gh" rel="nofollow"><img src="https://img.shields.io/badge/GitHub--blue?style=social&logo=GitHub" alt="Github" data-canonical-src="https://img.shields.io/badge/GitHub--blue?style=social&logo=GitHub" style="max-width:8.5ch;"></a>
<a target="_blank" href="https://www.linkedin.com/in/weng-fung/" rel="nofollow"><img src="https://img.shields.io/badge/LinkedIn-blue?style=flat&logo=linkedin&labelColor=blue" alt="Linked-In" data-canonical-src="https://img.shields.io/badge/LinkedIn-blue?style=flat&amp;logo=linkedin&amp;labelColor=blue" style="max-width:10ch;"></a>
<a target="_blank" href="https://www.youtube.com/@WayneTeachesCode/" rel="nofollow"><img src="https://img.shields.io/badge/Youtube-red?style=flat&logo=youtube&labelColor=red" alt="Youtube" data-canonical-src="https://img.shields.io/badge/Youtube-red?style=flat&amp;logo=youtube&amp;labelColor=red" style="max-width:10ch;"></a>

A technical analysis learning app for practicing **candlestick patterns** and **technical indicators** (the lines on charts: SMA, EMA, RSI, MACD, Bollinger Bands). Built with React, TypeScript, and Vite.

**Author:** Weng Fei Fung (Weng)

---

## Features

- **Dashboard** — Market feed summary, progress tracking, and quick navigation to modules
- **Market** — Interactive candlestick charts with technical indicator overlays (SMA, EMA, RSI, MACD, Bollinger Bands), pattern scanning, and financials panel
- **Training** — Quiz center to identify both candlestick patterns and technical indicators (the lines) on historical chart snapshots
- **Archive** — Reference library of candlestick patterns (Doji, Hammer, Engulfing, Morning Star, Head & Shoulders, Falling Wedge, etc.) and indicator definitions
- **Practice Draw** — Canvas for sketching patterns (coming soon)

---

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4
- Recharts
- React Router
- Motion (animations)
- Lucide React icons

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Runs at [http://localhost:3000](http://localhost:3000) (host `0.0.0.0` for LAN access).

### Build

```bash
npm run build
```

Output in `dist/`.

### Preview

```bash
npm run preview
```

### Scripts

| Script   | Description              |
|----------|--------------------------|
| `dev`    | Start dev server (port 3000) |
| `build`  | Production build        |
| `preview`| Preview production build|
| `clean`  | Remove `dist/`          |
| `lint`   | TypeScript check        |

---

## Project Structure

```
trainer/
├── src/
│   ├── components/     # CandlestickChart, MarketChart, QuizModal, etc.
│   ├── lib/            # patterns, indicators, quizData, overlays, markets
│   ├── pages/          # Dashboard, Market, Training, Archive, PracticeDraw
│   ├── App.tsx
│   └── index.css
├── public/
│   └── patterns/       # SVG pattern references
├── index.html
└── package.json
```
