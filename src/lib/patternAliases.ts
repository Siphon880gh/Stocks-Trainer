/**
 * Other names the same pattern goes by on posters, cheat sheets and charting apps.
 * Shown as "Also called" in the Archive pattern card. Keys are PATTERNS ids.
 */
export const PATTERN_ALIASES: Record<string, readonly string[]> = {
  "bull-flag": ["Parallelogram (bullish)", "Pole & flag (bullish)"],
  "bear-flag": ["Parallelogram (bearish)", "Pole & flag (bearish)"],
  "broadening-top": ["Megaphone", "Expanding triangle"],
  "broadening-bottom": ["Megaphone", "Expanding triangle"],
  "measured-move-up": ["Three-stage pattern", "ABCD (bullish)"],
  "measured-move-down": ["Three-stage pattern", "ABCD (bearish)"],
  "neckline-retest-bullish": ["On neckline (ascending)", "Throwback"],
  "neckline-retest-bearish": ["On neckline (descending)", "Pullback to the neckline"],
  "rectangle-bottom": ["Square bottom"],
  "double-bottom": ["W shape", "W bottom"],
  "double-top": ["M shape", "M top"],
  "rounding-bottom": ["Round bottom", "Saucer bottom"],
  "rounding-top": ["Round top", "Saucer top"],
  "v-bottom": ["Spike reversal"],
  "runaway-gap": ["Measuring gap (bullish)"],
  "bearish-runaway-gap": ["Measuring gap (bearish)"],
  "bearish-breakaway-gap": ["Breakaway gap (descending)"],
  "bullish-counterattack": ["Bullish meeting lines"],
  "bearish-counterattack": ["Bearish meeting lines"],
  "bullish-opening-marubozu": ["Bullish belt hold"],
  "bearish-opening-marubozu": ["Bearish belt hold"],
  hammer: ["Umbrella line"],
  "hanging-man": ["Umbrella line"],
  "tweezer-star": ["Shooting star tweezers"],
  "step-top": ["Staircase down (first step)"],
  "step-bottom": ["Staircase up (first step)"],
  "trend-stage-bounce": ["Stage 2 pullback", "Trend-line bounce"],
  "bullish-three-pushes": ["3 push pattern (bullish)"],
  "three-pushes": ["3 push pattern (bearish)"],
  "complex-head-shoulders": ["H&S top variation"],
  "complex-inverse-head-shoulders": ["H&S bottom variation"],
  "rising-window": ["Gap up (window)"],
  "falling-window": ["Gap down (window)"],
};

export const aliasesFor = (id: string): readonly string[] => PATTERN_ALIASES[id] ?? [];
