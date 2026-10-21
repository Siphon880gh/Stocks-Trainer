/**
 * Transmission rules (MF4.M1): how a release surprise travels to yields, the dollar, the index and sectors,
 * depending on the macro regime. Educational, hedged tendencies — real reactions vary and can reverse.
 */
import type { Direction, Instrument, ReactionArchetype, Regime, ReleaseKind, SurpriseLabel } from "./types";
import { surpriseZ, type ReleaseEvent } from "./releases";

export const INSTRUMENTS: Instrument[] = ["us2y", "us10y", "dollar", "index", "growth-tech", "homebuilders", "reits", "banks", "utilities", "small-caps", "bond-proxy", "mortgage30"];

export const INSTRUMENT_NAMES: Record<Instrument, string> = {
  us2y: "2-year yield",
  us10y: "10-year yield",
  dollar: "Dollar index",
  index: "Stock index",
  "growth-tech": "Growth / tech",
  homebuilders: "Homebuilders",
  reits: "REITs",
  banks: "Banks",
  utilities: "Utilities",
  "small-caps": "Small caps",
  "bond-proxy": "Long-bond price",
  mortgage30: "30-yr mortgage rate",
};

export const REGIME_NAMES: Record<Regime, string> = {
  overheating: "Overheating",
  "inflation-worry": "Inflation worry",
  "fed-pivot-watch": "Fed pivot watch",
  goldilocks: "Goldilocks / soft landing",
  "growth-scare": "Growth scare",
  "recession-fear": "Recession fear",
};

export const REGIME_BLURB: Record<Regime, string> = {
  overheating: "Demand is running hot and the Fed is still hiking. Strong data means more hikes — usually bad for stocks.",
  "inflation-worry": "Inflation is the market's main fear. Hot data lifts yields and tends to pressure stocks; cool data is a relief.",
  "fed-pivot-watch": "Markets are waiting for the first cut. Weak data pulls the cut closer, so bad news can be good news for stocks.",
  goldilocks: "Inflation is cooling without a recession. Good growth news is welcome; surprises tend to produce smaller moves.",
  "growth-scare": "Growth is the worry now. Strong data is a relief; weak data is simply bad — except hot inflation, which raises stagflation fears.",
  "recession-fear": "Recession risk dominates. Weak data hits stocks and lifts bonds; the Fed cutting is not enough on its own to calm markets.",
};

export type KindClass = "growth" | "inflation" | "policy" | "low-impact" | "mortgage-survey";
export const KIND_CLASS: Record<ReleaseKind, KindClass> = {
  payrolls: "growth", claims: "growth", jolts: "growth", gdp: "growth", retail: "growth", "ism-mfg": "growth", "ism-services": "growth",
  cpi: "inflation", ppi: "inflation", pce: "inflation",
  fomc: "policy",
  sentiment: "low-impact", "housing-starts": "low-impact",
  pmms: "mortgage-survey",
};

export interface Reaction {
  kind: ReleaseKind;
  label: SurpriseLabel;
  regime: Regime;
  archetype: ReactionArchetype;
  moves: Record<Instrument, Direction>;
  rationale: Record<Instrument, string>;
  /** Direction of the stock index in the first bars, when it differs from the final move. */
  initialIndex?: Direction;
  summary: string;
}

const rev = (d: Direction): Direction => (d === "up" ? "down" : d === "down" ? "up" : "muted");
const allMuted = (): Record<Instrument, Direction> => Object.fromEntries(INSTRUMENTS.map((i) => [i, "muted"])) as Record<Instrument, Direction>;

const isInflationRegime = (r: Regime) => r === "overheating" || r === "inflation-worry" || r === "fed-pivot-watch";
const isGrowthFearRegime = (r: Regime) => r === "growth-scare" || r === "recession-fear";

interface RuleOpts {
  /** FOMC: dovish surprise read as the Fed being worried (growth-fear regimes). */
  fomcScareCut?: boolean;
  /** PMMS: direction of the weekly mortgage change. */
  mortgageChange?: Direction;
}

/** Core rule table. `label` is the effective read (details already applied). */
export function reactionFor(kind: ReleaseKind, label: SurpriseLabel, regime: Regime, opts: RuleOpts = {}): Reaction {
  const cls = KIND_CLASS[kind];
  const moves = allMuted();
  const why = {} as Record<Instrument, string>;
  const W = (i: Instrument, d: Direction, text: string) => {
    moves[i] = d;
    why[i] = text;
  };
  let summary = "";
  let initialIndex: Direction | undefined;
  const hot = label === "hot";
  const rates: Direction = label === "in-line" ? "muted" : hot ? "up" : "down";

  if (cls === "mortgage-survey") {
    const d = opts.mortgageChange ?? "muted";
    for (const i of INSTRUMENTS) why[i] = "The weekly mortgage survey summarizes moves the bond market already made, so other markets usually do not react to it.";
    W("mortgage30", d, "The survey rate tracks the prior days' 10-year yield plus the mortgage spread, so it moves in the direction rates already went.");
    summary = "Mostly a lagging read: it tells homebuyers where rates went, not where markets will go.";
    return { kind, label, regime, archetype: "follow-through", moves, rationale: why, summary };
  }

  if (label === "in-line") {
    for (const i of INSTRUMENTS) why[i] = "In line with expectations: the news was already in the price, so moves tend to be small and noisy.";
    summary = "An in-line print is usually a non-event: the market had already priced it.";
    return { kind, label, regime, archetype: "follow-through", moves, rationale: why, summary };
  }

  if (cls === "low-impact") {
    for (const i of INSTRUMENTS) why[i] = "A lower-impact release: surprises here rarely move the broad market or yields much on their own.";
    if (kind === "housing-starts") {
      W("homebuilders", rates, `Starts ${hot ? "above" : "below"} expectations are direct news for homebuilders' sales pipelines; the broad market usually shrugs.`);
      summary = "Housing starts are noisy and lower impact: homebuilders may react, the index usually does not.";
    } else {
      summary = "Sentiment levels rarely move markets; watch the inflation-expectations line instead.";
    }
    return { kind, label, regime, archetype: "follow-through", moves, rationale: why, summary };
  }

  // Rates, dollar, bond price: hot data / hawkish surprise → yields up across classes.
  const what = cls === "policy" ? (hot ? "A more hawkish decision than priced" : "A more dovish decision than priced") : cls === "inflation" ? (hot ? "Hotter inflation" : "Cooler inflation") : hot ? "Stronger data" : "Weaker data";
  W("us2y", rates, `${what} ${hot ? "raises" : "lowers"} the expected path of Fed policy; the 2-year reprices fastest.`);
  W("us10y", rates, `${what} ${hot ? "lifts" : "pulls down"} long yields too, usually by less than the 2-year${cls === "policy" && !hot ? " (a bull steepener)" : ""}.`);
  W("dollar", rates, `Higher (lower) US yields relative to other countries tend to ${hot ? "strengthen" : "weaken"} the dollar.`);
  W("bond-proxy", rev(rates), `Bond prices move opposite to yields: the 10-year yield ${hot ? "up" : "down"} means long-bond prices ${hot ? "down" : "up"}.`);
  W("mortgage30", rates, "Mortgage rates follow the 10-year with a lag of days; the weekly survey will show it next.");

  // Equities and sectors depend on the regime.
  const eq = (d: Direction, text: string) => W("index", d, text);
  if (cls === "inflation" || cls === "policy" || isInflationRegime(regime)) {
    // Rate channel dominates: higher yields = lower stocks (and vice versa).
    let d = rev(rates);
    let text =
      cls === "inflation" && isGrowthFearRegime(regime) && hot
        ? "Hot inflation during a growth scare is a stagflation worry: the Fed has less room to cut, so stocks tend to fall."
        : regime === "fed-pivot-watch" && cls === "growth"
          ? `Bad news is good news here: ${hot ? "strong data pushes the first cut further away" : "weak data pulls the first cut closer"}, so stocks tend to ${hot ? "fall" : "rise"}.`
          : `When ${cls === "policy" ? "the Fed path" : "inflation"} is the market's focus, ${hot ? "higher" : "lower"} yields tend to ${hot ? "weigh on" : "support"} stock valuations.`;
    if (cls === "policy" && !hot && opts.fomcScareCut) {
      d = "down";
      initialIndex = "up";
      text = "A bigger-than-priced cut during a growth scare can read as the Fed seeing trouble: stocks often pop on the headline, then fade as the market focuses on why.";
    }
    eq(d, text);
    W("growth-tech", d === "muted" ? "muted" : opts.fomcScareCut && !hot ? "down" : rev(rates), "Long-duration growth stocks are the most sensitive to the discount rate (real yields).");
    W("homebuilders", rev(rates), "Homebuilders live on mortgage rates: yields up is a headwind, yields down a tailwind.");
    W("reits", rev(rates), "REITs compete with bonds for income buyers and carry debt, so they tend to move opposite to yields.");
    W("utilities", rev(rates), "Utilities trade as bond proxies: higher yields make their dividends less attractive.");
    W("small-caps", opts.fomcScareCut && !hot ? "down" : rev(rates), "Small caps carry more floating-rate debt, so tighter (looser) financing conditions hit (help) them more.");
    W("banks", cls === "policy" && !hot && opts.fomcScareCut ? "down" : "muted", cls === "policy" && !hot && opts.fomcScareCut ? "Recession worries outweigh the steeper curve for bank stocks (credit risk)." : "Banks get offsetting forces — higher rates can help lending margins but hurt bond holdings and loan demand — so their reaction is often muted.");
    summary = initialIndex ? text : `${what}: yields ${rates}, dollar ${rates}, stocks ${d}. ${REGIME_NAMES[regime]} regime — the rate channel dominates.`;
    const archetype: ReactionArchetype = initialIndex ? "reversal" : "follow-through";
    return { kind, label, regime, archetype, moves, rationale: why, initialIndex, summary };
  }

  // Growth releases in goldilocks / growth-scare / recession-fear: the growth channel dominates.
  const g: Direction = hot ? "up" : "down";
  if (regime === "goldilocks") {
    eq(g, `In a soft-landing backdrop, ${hot ? "solid growth is welcome as long as inflation behaves" : "a weak print raises the question of whether the landing is still soft"}.`);
    W("growth-tech", "muted", "Better growth and higher yields roughly offset for long-duration tech, so the move tends to be small.");
    W("small-caps", g, "Small caps are more tied to the domestic economy, so they lean with growth news.");
    W("banks", g, "Banks benefit from stronger growth (loan demand, credit quality) and a steeper curve.");
  } else {
    eq(g, `When growth is the worry, ${hot ? "a strong print is relief — recession odds fall" : "a weak print adds to recession fears, and lower yields do not offset that"}.`);
    W("growth-tech", g, `Growth fears dominate the discount-rate effect, so tech tends to follow the index ${hot ? "up" : "down"}.`);
    W("small-caps", g, "Small caps are the most economically sensitive part of the index.");
    W("banks", g, "Banks are a recession-risk barometer: credit losses and loan demand dominate.");
  }
  W("homebuilders", rev(rates), "Homebuilders follow mortgage rates, which follow the 10-year.");
  W("reits", rev(rates), "REITs move opposite to yields (financing costs and bond competition).");
  W("utilities", hot ? "down" : "up", hot ? "Money rotates out of defensive bond-proxies when growth relief lifts yields." : "Defensive utilities attract money when growth worries rise and yields fall.");
  summary = `${what} in ${/^[aeiou]/i.test(REGIME_NAMES[regime]) ? "an" : "a"} ${REGIME_NAMES[regime].toLowerCase()} regime: the growth channel dominates — stocks ${g}, yields ${rates}.`;
  return { kind, label, regime, archetype: "follow-through", moves, rationale: why, summary };
}

/** Reaction for a concrete release event, including twists. */
export function reactionForEvent(e: ReleaseEvent): Reaction & { magnitude: number } {
  const fomcScareCut = e.kind === "fomc" && e.effectiveLabel === "cool" && isGrowthFearRegime(e.regime) && e.headline.actual <= -50;
  const mortgageChange: Direction = e.kind === "pmms" ? (e.headline.actual > (e.headline.prior ?? e.headline.actual) ? "up" : e.headline.actual < (e.headline.prior ?? e.headline.actual) ? "down" : "muted") : "muted";
  const r = reactionFor(e.kind, e.effectiveLabel, e.regime, { fomcScareCut, mortgageChange });
  const dom = e.details.find((d) => d.key === e.dominantDetail);
  const zEff = dom ? Math.min(3, Math.abs(dom.surprise / dom.stdev)) : Math.abs(surpriseZ(e));
  let archetype = r.archetype;
  let initialIndex = r.initialIndex;
  let summary = r.summary;
  if (e.twist === "details-reverse" && r.moves.index !== "muted") {
    archetype = "reversal";
    initialIndex = rev(r.moves.index);
    summary = `Knee-jerk on the headline, then the reversal: the ${dom?.name.toLowerCase() ?? "detail"} pointed the other way and decided the move. ${r.summary}`;
  } else if (e.twist === "mixed") {
    archetype = "whipsaw";
    summary = "Mixed signals: the first move follows one number, then traders weigh the other and the market ends roughly where it started.";
  }
  const magnitude = Object.values(r.moves).every((d) => d === "muted") ? 0.3 : Math.max(0.6, Math.min(3, zEff));
  return { ...r, archetype, initialIndex, summary, magnitude };
}

/** Regime × release-class matrix for the rules table (hot and cool reads). */
export function rulesMatrix() {
  const classes: { kind: ReleaseKind; name: string }[] = [
    { kind: "payrolls", name: "Growth / labor data" },
    { kind: "cpi", name: "Inflation data" },
    { kind: "fomc", name: "Fed decision vs pricing" },
  ];
  const regimes = Object.keys(REGIME_NAMES) as Regime[];
  return regimes.map((regime) => ({
    regime,
    cells: classes.flatMap((c) => (["hot", "cool"] as const).map((label) => ({ cls: c.name, label, reaction: reactionFor(c.kind, label, regime) }))),
  }));
}
