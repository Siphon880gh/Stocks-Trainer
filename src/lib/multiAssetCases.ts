/**
 * SAMPLE decide-and-reveal packs for futures / forex / crypto / options-context (E10).
 */
import type { OHLC } from "./ohlcData";
import type { CaseStudy } from "./caseStudies";

function bar(
  name: string,
  open: number,
  high: number,
  low: number,
  close: number,
): OHLC {
  return { name, open, high, low, close };
}

function withAftermath(pre: OHLC[], aftermath: OHLC[]): OHLC[] {
  return [...pre, ...aftermath];
}

const ES_PRE: OHLC[] = [
  bar("T-5", 5120, 5135, 5110, 5128),
  bar("T-4", 5128, 5142, 5120, 5136),
  bar("T-3", 5136, 5150, 5130, 5144),
  bar("T-2", 5144, 5158, 5138, 5150),
  bar("T-1", 5150, 5162, 5142, 5155),
  bar("T0", 5155, 5168, 5148, 5160),
];

const CL_PRE: OHLC[] = [
  bar("T-5", 78.2, 79.0, 77.8, 78.6),
  bar("T-4", 78.6, 79.4, 78.0, 78.9),
  bar("T-3", 78.9, 79.2, 77.5, 77.8),
  bar("T-2", 77.8, 78.4, 76.9, 77.2),
  bar("T-1", 77.2, 77.8, 76.4, 76.8),
  bar("T0", 76.8, 77.2, 75.9, 76.1),
];

const EUR_PRE: OHLC[] = [
  bar("T-5", 1.084, 1.087, 1.082, 1.085),
  bar("T-4", 1.085, 1.089, 1.083, 1.087),
  bar("T-3", 1.087, 1.09, 1.085, 1.088),
  bar("T-2", 1.088, 1.091, 1.086, 1.089),
  bar("T-1", 1.089, 1.092, 1.087, 1.09),
  bar("T0", 1.09, 1.093, 1.088, 1.091),
];

const JPY_PRE: OHLC[] = [
  bar("T-5", 148.2, 148.8, 147.9, 148.4),
  bar("T-4", 148.4, 149.1, 148.0, 148.7),
  bar("T-3", 148.7, 149.4, 148.5, 149.0),
  bar("T-2", 149.0, 149.6, 148.6, 148.9),
  bar("T-1", 148.9, 149.3, 148.2, 148.5),
  bar("T0", 148.5, 148.9, 147.8, 148.1),
];

const BTC_PRE: OHLC[] = [
  bar("T-5", 64200, 64800, 63800, 64500),
  bar("T-4", 64500, 65200, 64200, 64900),
  bar("T-3", 64900, 65800, 64600, 65500),
  bar("T-2", 65500, 66200, 65000, 65800),
  bar("T-1", 65800, 66500, 65400, 66100),
  bar("T0", 66100, 66800, 65800, 66400),
];

const ETH_PRE: OHLC[] = [
  bar("T-5", 3420, 3480, 3380, 3450),
  bar("T-4", 3450, 3510, 3410, 3480),
  bar("T-3", 3480, 3520, 3390, 3410),
  bar("T-2", 3410, 3440, 3320, 3350),
  bar("T-1", 3350, 3390, 3280, 3310),
  bar("T0", 3310, 3360, 3260, 3290),
];

const UND_PRE: OHLC[] = [
  bar("T-5", 186.0, 187.5, 185.2, 186.8),
  bar("T-4", 186.8, 188.2, 186.0, 187.4),
  bar("T-3", 187.4, 189.0, 186.8, 188.2),
  bar("T-2", 188.2, 189.6, 187.5, 188.8),
  bar("T-1", 188.8, 190.2, 188.0, 189.4),
  bar("T0", 189.4, 191.0, 188.6, 190.0),
];

const GC_PRE: OHLC[] = [
  bar("T-5", 2320, 2332, 2314, 2326),
  bar("T-4", 2326, 2338, 2320, 2330),
  bar("T-3", 2330, 2344, 2324, 2338),
  bar("T-2", 2338, 2350, 2332, 2344),
  bar("T-1", 2344, 2356, 2338, 2348),
  bar("T0", 2348, 2360, 2342, 2352),
];

const ZC_PRE: OHLC[] = [
  bar("T-5", 462, 468, 458, 464),
  bar("T-4", 464, 470, 460, 466),
  bar("T-3", 466, 469, 452, 454),
  bar("T-2", 454, 458, 448, 450),
  bar("T-1", 450, 455, 444, 448),
  bar("T0", 448, 452, 442, 445),
];

const NQ_PRE: OHLC[] = [
  bar("T-5", 17840, 17890, 17790, 17820),
  bar("T-4", 17820, 17870, 17760, 17790),
  bar("T-3", 17790, 17830, 17720, 17750),
  bar("T-2", 17750, 17800, 17680, 17710),
  bar("T-1", 17710, 17760, 17640, 17680),
  bar("T0", 17680, 17720, 17610, 17640),
];

/** SAMPLE nat-gas coil — not CL (76s) or ZC (440s). */
const NG_PRE: OHLC[] = [
  bar("T-5", 3.22, 3.28, 3.18, 3.24),
  bar("T-4", 3.24, 3.27, 3.19, 3.21),
  bar("T-3", 3.21, 3.25, 3.17, 3.2),
  bar("T-2", 3.2, 3.23, 3.16, 3.18),
  bar("T-1", 3.18, 3.21, 3.15, 3.17),
  bar("T0", 3.17, 3.2, 3.14, 3.16),
];

/** SAMPLE copper grind-then-stall — not NG coil (3.1s) or CL dump (76s). */
const HG_PRE: OHLC[] = [
  bar("T-5", 4.12, 4.16, 4.1, 4.14),
  bar("T-4", 4.14, 4.18, 4.12, 4.16),
  bar("T-3", 4.16, 4.21, 4.15, 4.19),
  bar("T-2", 4.19, 4.23, 4.17, 4.21),
  bar("T-1", 4.21, 4.24, 4.18, 4.2),
  bar("T0", 4.2, 4.23, 4.17, 4.19),
];

/** SAMPLE wheat air-pocket — not ZC already-weak 445s or HG grind-stall. */
const ZW_PRE: OHLC[] = [
  bar("T-5", 628, 632, 624, 630),
  bar("T-4", 630, 634, 622, 624),
  bar("T-3", 624, 628, 608, 612),
  bar("T-2", 612, 616, 598, 602),
  bar("T-1", 602, 608, 592, 596),
  bar("T0", 596, 602, 588, 592),
];

/** SAMPLE silver already ran — not GC 2350 grind, NG coil, or HG stall. */
const SI_PRE: OHLC[] = [
  bar("T-5", 28.8, 29.4, 28.6, 29.2),
  bar("T-4", 29.2, 29.9, 29.0, 29.7),
  bar("T-3", 29.7, 30.6, 29.5, 30.4),
  bar("T-2", 30.4, 31.2, 30.2, 31.0),
  bar("T-1", 31.0, 31.6, 30.8, 31.4),
  bar("T0", 31.4, 31.9, 31.1, 31.7),
];

/** SAMPLE small-cap index relief bounce — not NQ already-weak slide or ES grind. */
const RTY_PRE: OHLC[] = [
  bar("T-5", 1920, 1934, 1912, 1928),
  bar("T-4", 1928, 1948, 1922, 1942),
  bar("T-3", 1942, 1966, 1936, 1960),
  bar("T-2", 1960, 1980, 1954, 1974),
  bar("T-1", 1974, 1990, 1968, 1984),
  bar("T0", 1984, 2002, 1978, 1996),
];

/** SAMPLE soy already dumped — not ZC 445s weather, ZW 592 air-pocket, or RTY bounce. */
const ZS_PRE: OHLC[] = [
  bar("T-5", 1248, 1256, 1238, 1242),
  bar("T-4", 1242, 1250, 1220, 1226),
  bar("T-3", 1226, 1234, 1204, 1210),
  bar("T-2", 1210, 1218, 1190, 1196),
  bar("T-1", 1196, 1204, 1178, 1184),
  bar("T0", 1184, 1192, 1168, 1174),
];

/** SAMPLE heating oil already dumped — not NG 3.1s coil, CL 76s, or HG 4.2 stall. */
const HO_PRE: OHLC[] = [
  bar("T-5", 2.58, 2.62, 2.52, 2.54),
  bar("T-4", 2.54, 2.58, 2.46, 2.48),
  bar("T-3", 2.48, 2.52, 2.4, 2.42),
  bar("T-2", 2.42, 2.46, 2.34, 2.36),
  bar("T-1", 2.36, 2.4, 2.28, 2.3),
  bar("T0", 2.3, 2.34, 2.22, 2.24),
];

/** SAMPLE platinum already ran — not GC 2350 grind, SI 28-31 run, or HO dump. */
const PL_PRE: OHLC[] = [
  bar("T-5", 942, 952, 938, 948),
  bar("T-4", 948, 964, 944, 960),
  bar("T-3", 960, 978, 956, 974),
  bar("T-2", 974, 992, 970, 988),
  bar("T-1", 988, 1006, 984, 1002),
  bar("T0", 1002, 1018, 996, 1014),
];

/** SAMPLE coffee failed breakout — not ZC 445 weather dump, ZW 592 air-pocket, or PL 980 run. */
const KC_PRE: OHLC[] = [
  bar("T-5", 248.5, 251.0, 247.8, 250.4),
  bar("T-4", 250.4, 253.6, 249.8, 253.0),
  bar("T-3", 253.0, 256.2, 252.4, 255.6),
  bar("T-2", 255.6, 256.4, 252.8, 253.2),
  bar("T-1", 253.2, 254.0, 250.6, 251.2),
  bar("T0", 251.2, 252.0, 249.4, 249.8),
];

/** SAMPLE cotton round-top — not KC 248 fail-break, ZC 445 weather dump, or PL 980 run. */
const CT_PRE: OHLC[] = [
  bar("T-5", 71.2, 72.4, 71.0, 72.1),
  bar("T-4", 72.1, 73.6, 71.9, 73.2),
  bar("T-3", 73.2, 74.4, 72.8, 73.8),
  bar("T-2", 73.8, 74.2, 72.6, 73.0),
  bar("T-1", 73.0, 73.4, 71.8, 72.2),
  bar("T0", 72.2, 72.6, 71.2, 71.6),
];

/** SAMPLE sugar staircase — not CT 71 round-top, KC 248 fail-break, or ZC 445 dump. */
const SB_PRE: OHLC[] = [
  bar("T-5", 21.4, 21.55, 21.28, 21.48),
  bar("T-4", 21.48, 21.62, 21.4, 21.58),
  bar("T-3", 21.58, 21.74, 21.52, 21.7),
  bar("T-2", 21.7, 21.86, 21.64, 21.82),
  bar("T-1", 21.82, 21.98, 21.76, 21.94),
  bar("T0", 21.94, 22.08, 21.88, 22.04),
];

/** SAMPLE cocoa expanding range — not SB 22 staircase, CT 71 round-top, or KC 248 fail-break. */
const CC_PRE: OHLC[] = [
  bar("T-5", 3920, 4010, 3860, 3990),
  bar("T-4", 3990, 4020, 3840, 3870),
  bar("T-3", 3870, 4080, 3850, 4050),
  bar("T-2", 4050, 4120, 3900, 3930),
  bar("T-1", 3930, 4140, 3880, 4110),
  bar("T0", 4110, 4160, 3940, 3970),
];

/** SAMPLE live-cattle opening drive — not CC 3900 expanding, RTY 1920 bounce, or UND 186 coil. */
const LE_PRE: OHLC[] = [
  bar("T-5", 168.4, 168.9, 168.1, 168.6),
  bar("T-4", 168.6, 169.0, 168.3, 168.7),
  bar("T-3", 168.7, 169.1, 168.4, 168.8),
  bar("T-2", 168.8, 169.2, 168.5, 168.9),
  bar("T-1", 168.9, 169.2, 168.6, 169.0),
  bar("T0", 169.0, 169.3, 168.7, 169.1),
];

/** SAMPLE 10-year note double-bottom — not ES 5120 grind, LE 169 coil, or CC 3900 expanding. */
const ZN_PRE: OHLC[] = [
  bar("T-5", 111.22, 111.28, 110.84, 110.9),
  bar("T-4", 110.9, 111.12, 110.86, 111.06),
  bar("T-3", 111.06, 111.14, 110.82, 110.88),
  bar("T-2", 110.88, 111.08, 110.84, 111.02),
  bar("T-1", 111.02, 111.18, 110.98, 111.12),
  bar("T0", 111.12, 111.24, 111.06, 111.18),
];

/** SAMPLE lean-hogs outside bar — not ZN 111 double-bottom, LE 169 coil, or CT 71 round-top. */
const HE_PRE: OHLC[] = [
  bar("T-5", 97.4, 97.9, 97.1, 97.6),
  bar("T-4", 97.6, 98.1, 97.3, 97.8),
  bar("T-3", 97.8, 98.3, 97.5, 98.0),
  bar("T-2", 98.0, 98.4, 97.6, 98.1),
  bar("T-1", 98.1, 98.5, 97.8, 98.2),
  bar("T0", 98.2, 99.6, 96.8, 97.4),
];

/** SAMPLE Dow doji — not ES 5120 grind, NQ 17800 dump, or RTY 1920 bounce. */
const YM_PRE: OHLC[] = [
  bar("T-5", 39180, 39220, 39140, 39190),
  bar("T-4", 39190, 39230, 39150, 39200),
  bar("T-3", 39200, 39240, 39160, 39210),
  bar("T-2", 39210, 39250, 39170, 39220),
  bar("T-1", 39220, 39255, 39180, 39225),
  bar("T0", 39225, 39270, 39180, 39228),
];

/** SAMPLE RBOB dump-no-reclaim — not HO 2.2 dump, NG 3.1 coil, or CL 76 dump. */
const RB_PRE: OHLC[] = [
  bar("T-5", 1.92, 1.94, 1.88, 1.89),
  bar("T-4", 1.89, 1.91, 1.84, 1.85),
  bar("T-3", 1.85, 1.87, 1.8, 1.81),
  bar("T-2", 1.81, 1.83, 1.76, 1.77),
  bar("T-1", 1.77, 1.79, 1.72, 1.73),
  bar("T0", 1.73, 1.75, 1.68, 1.69),
];

/** SAMPLE lumber inside-bar — not ZC 445 weather, ZW 592 air-pocket, or LE 169 coil. */
const LB_PRE: OHLC[] = [
  bar("T-5", 498, 504, 496, 502),
  bar("T-4", 502, 510, 500, 508),
  bar("T-3", 508, 516, 506, 512),
  bar("T-2", 512, 518, 508, 514),
  bar("T-1", 510, 528, 496, 516),
  bar("T0", 512, 520, 506, 514),
];

/** SAMPLE orange-juice impulse-and-flag — not KC 248 fail-break, CT 71 round-top, or LB 498 inside-bar. */
const OJ_PRE: OHLC[] = [
  bar("T-5", 178, 184, 176, 182),
  bar("T-4", 182, 196, 181, 194),
  bar("T-3", 194, 210, 193, 208),
  bar("T-2", 208, 209, 202, 204),
  bar("T-1", 204, 206, 199, 201),
  bar("T0", 201, 203, 197, 199),
];

/** SAMPLE palladium rising-wedge — not PL 980 run, OJ 178 flag, or GC gold grind. */
const PA_PRE: OHLC[] = [
  bar("T-5", 1482, 1494, 1478, 1490),
  bar("T-4", 1490, 1508, 1486, 1504),
  bar("T-3", 1504, 1524, 1500, 1520),
  bar("T-2", 1520, 1534, 1516, 1530),
  bar("T-1", 1530, 1540, 1526, 1534),
  bar("T0", 1534, 1542, 1530, 1536),
];

/** SAMPLE dollar-index V-reclaim — not YM 39200 doji, RTY 1920 bounce-fail, or ES 5120 grind. */
const DX_PRE: OHLC[] = [
  bar("T-5", 105.4, 105.52, 105.28, 105.34),
  bar("T-4", 105.34, 105.4, 104.8, 104.88),
  bar("T-3", 104.88, 105.1, 104.7, 104.96),
  bar("T-2", 104.96, 105.04, 104.62, 104.7),
  bar("T-1", 104.7, 104.92, 104.64, 104.86),
  bar("T0", 104.86, 105.18, 104.82, 105.12),
];

/** SAMPLE soybean-oil round-top after a crush scare already ran — not CT 71 mill round, OJ 178 flag, or PA 1530 wedge. */
const ZL_PRE: OHLC[] = [
  bar("T-5", 46.2, 47.8, 46.0, 47.4),
  bar("T-4", 47.4, 50.6, 47.2, 50.2),
  bar("T-3", 50.2, 53.0, 50.0, 52.4),
  bar("T-2", 52.4, 52.8, 50.6, 51.0),
  bar("T-1", 51.0, 51.4, 49.6, 50.0),
  bar("T0", 50.0, 50.4, 48.8, 49.2),
];

/** Two equal highs then fail — not ZL round-top, ZN double-bottom, or CT mill saucer. */
const ZM_PRE: OHLC[] = [
  bar("T-5", 348, 354, 346, 352),
  bar("T-4", 352, 364, 351, 362),
  bar("T-3", 362, 363, 354, 356),
  bar("T-2", 356, 364.5, 355, 361),
  bar("T-1", 361, 362, 352, 354),
  bar("T0", 354, 358, 350, 352),
];

/** Three pushes into a high — not SB even staircase, ZM double-top, or LE one-bar opening drive. */
const ZO_PRE: OHLC[] = [
  bar("T-5", 3.28, 3.36, 3.24, 3.34),
  bar("T-4", 3.34, 3.52, 3.32, 3.5),
  bar("T-3", 3.5, 3.52, 3.4, 3.42),
  bar("T-2", 3.42, 3.62, 3.4, 3.58),
  bar("T-1", 3.58, 3.6, 3.48, 3.5),
  bar("T0", 3.5, 3.68, 3.48, 3.64),
];

/** Falling wedge (lower highs, higher lows) — not PA rising wedge, OJ flag, or ZO three-push. */
const ZR_PRE: OHLC[] = [
  bar("T-5", 18.4, 18.8, 18.2, 18.7),
  bar("T-4", 18.7, 18.75, 18.1, 18.2),
  bar("T-3", 18.2, 18.55, 18.15, 18.48),
  bar("T-2", 18.48, 18.52, 18.22, 18.28),
  bar("T-1", 18.28, 18.45, 18.26, 18.4),
  bar("T0", 18.4, 18.44, 18.32, 18.38),
];

const AUD_PRE: OHLC[] = [
  bar("T-5", 0.662, 0.665, 0.66, 0.663),
  bar("T-4", 0.663, 0.666, 0.661, 0.664),
  bar("T-3", 0.664, 0.667, 0.662, 0.665),
  bar("T-2", 0.665, 0.668, 0.663, 0.666),
  bar("T-1", 0.666, 0.669, 0.664, 0.667),
  bar("T0", 0.667, 0.67, 0.665, 0.668),
];

const GBP_PRE: OHLC[] = [
  bar("T-5", 1.268, 1.272, 1.265, 1.27),
  bar("T-4", 1.27, 1.274, 1.266, 1.269),
  bar("T-3", 1.269, 1.273, 1.264, 1.266),
  bar("T-2", 1.266, 1.27, 1.261, 1.263),
  bar("T-1", 1.263, 1.267, 1.258, 1.26),
  bar("T0", 1.26, 1.264, 1.256, 1.258),
];

const EURJPY_PRE: OHLC[] = [
  bar("T-5", 161.2, 161.8, 160.8, 161.4),
  bar("T-4", 161.4, 162.0, 161.0, 161.6),
  bar("T-3", 161.6, 162.4, 161.2, 162.0),
  bar("T-2", 162.0, 162.8, 161.6, 162.4),
  bar("T-1", 162.4, 163.0, 161.8, 162.2),
  bar("T0", 162.2, 162.6, 161.4, 161.8),
];

/** Range chop — not a EUR grind, GBP slide, or JPY dump. */
const CAD_PRE: OHLC[] = [
  bar("T-5", 1.362, 1.365, 1.359, 1.361),
  bar("T-4", 1.361, 1.364, 1.358, 1.363),
  bar("T-3", 1.363, 1.366, 1.36, 1.362),
  bar("T-2", 1.362, 1.365, 1.357, 1.359),
  bar("T-1", 1.359, 1.364, 1.356, 1.361),
  bar("T0", 1.361, 1.364, 1.358, 1.36),
];

/** Reclaim then stall — not an AUD grind or CAD chop. */
const NZD_PRE: OHLC[] = [
  bar("T-5", 0.598, 0.601, 0.594, 0.596),
  bar("T-4", 0.596, 0.599, 0.592, 0.597),
  bar("T-3", 0.597, 0.604, 0.596, 0.602),
  bar("T-2", 0.602, 0.606, 0.6, 0.605),
  bar("T-1", 0.605, 0.608, 0.603, 0.604),
  bar("T0", 0.604, 0.607, 0.601, 0.603),
];

/** Air-pocket then coil — not a GBP slide or NZD stall. */
const CHF_PRE: OHLC[] = [
  bar("T-5", 0.886, 0.888, 0.884, 0.887),
  bar("T-4", 0.887, 0.889, 0.885, 0.886),
  bar("T-3", 0.886, 0.887, 0.872, 0.874),
  bar("T-2", 0.874, 0.876, 0.87, 0.873),
  bar("T-1", 0.873, 0.877, 0.871, 0.875),
  bar("T0", 0.875, 0.878, 0.872, 0.874),
];

/** Tight squeeze on a cross — not a USD major grind or CHF air-pocket. */
const EURGBP_PRE: OHLC[] = [
  bar("T-5", 0.842, 0.848, 0.838, 0.844),
  bar("T-4", 0.844, 0.847, 0.84, 0.843),
  bar("T-3", 0.843, 0.846, 0.841, 0.844),
  bar("T-2", 0.844, 0.846, 0.842, 0.845),
  bar("T-1", 0.845, 0.847, 0.843, 0.846),
  bar("T0", 0.846, 0.847, 0.844, 0.845),
];

/** Round-top on USD/NOK — not an EUR grind or EURGBP squeeze. */
const NOK_PRE: OHLC[] = [
  bar("T-5", 10.48, 10.62, 10.46, 10.58),
  bar("T-4", 10.58, 10.72, 10.56, 10.68),
  bar("T-3", 10.68, 10.78, 10.64, 10.7),
  bar("T-2", 10.7, 10.76, 10.62, 10.66),
  bar("T-1", 10.66, 10.7, 10.58, 10.62),
  bar("T0", 10.62, 10.66, 10.56, 10.6),
];

/** Gap-and-go then stall — not a NOK round-top or NZD reclaim. */
const MXN_PRE: OHLC[] = [
  bar("T-5", 17.05, 17.12, 17.02, 17.08),
  bar("T-4", 17.08, 17.14, 17.06, 17.1),
  bar("T-3", 17.18, 17.28, 17.16, 17.26),
  bar("T-2", 17.26, 17.32, 17.22, 17.3),
  bar("T-1", 17.3, 17.34, 17.26, 17.28),
  bar("T0", 17.28, 17.32, 17.24, 17.26),
];

/** Quiet drift then a rumor spike — not an MXN gap or EURGBP squeeze. */
const SGD_PRE: OHLC[] = [
  bar("T-5", 1.338, 1.34, 1.337, 1.339),
  bar("T-4", 1.339, 1.341, 1.338, 1.34),
  bar("T-3", 1.34, 1.342, 1.339, 1.341),
  bar("T-2", 1.341, 1.343, 1.34, 1.342),
  bar("T-1", 1.342, 1.352, 1.341, 1.35),
  bar("T0", 1.35, 1.354, 1.348, 1.351),
];

/** Dump with a fake bounce — not a CHF air-pocket reclaim or GBP slide. */
const ZAR_PRE: OHLC[] = [
  bar("T-5", 18.55, 18.62, 18.48, 18.52),
  bar("T-4", 18.52, 18.58, 18.4, 18.42),
  bar("T-3", 18.42, 18.46, 18.22, 18.26),
  bar("T-2", 18.26, 18.32, 18.1, 18.14),
  bar("T-1", 18.14, 18.2, 18.02, 18.08),
  bar("T0", 18.08, 18.18, 18.04, 18.12),
];

/** Nested inside bars then expansion — not a EURGBP squeeze or CAD chop. */
const AUDNZD_PRE: OHLC[] = [
  bar("T-5", 1.088, 1.098, 1.084, 1.092),
  bar("T-4", 1.092, 1.096, 1.088, 1.09),
  bar("T-3", 1.09, 1.094, 1.089, 1.091),
  bar("T-2", 1.091, 1.093, 1.09, 1.092),
  bar("T-1", 1.092, 1.0935, 1.0905, 1.0918),
  bar("T0", 1.0918, 1.093, 1.0908, 1.0915),
];

/** Weekend gap then drift — not an MXN RTH gap-and-go. */
const CNH_PRE: OHLC[] = [
  bar("T-5", 7.172, 7.176, 7.168, 7.174),
  bar("T-4", 7.174, 7.178, 7.17, 7.175),
  bar("T-3", 7.188, 7.198, 7.186, 7.196),
  bar("T-2", 7.196, 7.202, 7.19, 7.194),
  bar("T-1", 7.194, 7.2, 7.188, 7.192),
  bar("T0", 7.192, 7.198, 7.186, 7.19),
];

/** Flush then V-reclaim — not a ZAR dump-no-reclaim or NZD stall. */
const GBPJPY_PRE: OHLC[] = [
  bar("T-5", 191.4, 191.9, 191.0, 191.2),
  bar("T-4", 191.2, 191.5, 189.0, 189.4),
  bar("T-3", 189.4, 189.8, 188.2, 188.6),
  bar("T-2", 188.6, 190.6, 188.4, 190.2),
  bar("T-1", 190.2, 191.4, 190.0, 191.0),
  bar("T0", 191.0, 191.6, 190.6, 191.2),
];

/** Failed rally under a ceiling — not a GBPJPY V or EUR grind. */
const EURCHF_PRE: OHLC[] = [
  bar("T-5", 0.932, 0.936, 0.928, 0.93),
  bar("T-4", 0.93, 0.942, 0.929, 0.94),
  bar("T-3", 0.94, 0.948, 0.938, 0.946),
  bar("T-2", 0.946, 0.95, 0.942, 0.944),
  bar("T-1", 0.944, 0.946, 0.938, 0.94),
  bar("T0", 0.94, 0.942, 0.934, 0.936),
];

/** Grind then tight pause — not an EURGBP squeeze or AUD grind-without-pause. */
const INR_PRE: OHLC[] = [
  bar("T-5", 82.88, 83.02, 82.82, 82.96),
  bar("T-4", 82.96, 83.14, 82.92, 83.1),
  bar("T-3", 83.1, 83.28, 83.06, 83.22),
  bar("T-2", 83.22, 83.28, 83.18, 83.24),
  bar("T-1", 83.24, 83.3, 83.2, 83.26),
  bar("T0", 83.26, 83.3, 83.22, 83.25),
];

/** Two equal lows then a bounce — not a V-reclaim or CAD chop. */
const BRL_PRE: OHLC[] = [
  bar("T-5", 5.12, 5.16, 5.08, 5.1),
  bar("T-4", 5.1, 5.13, 5.02, 5.04),
  bar("T-3", 5.04, 5.12, 5.03, 5.1),
  bar("T-2", 5.1, 5.14, 5.06, 5.08),
  bar("T-1", 5.08, 5.11, 5.02, 5.035),
  bar("T0", 5.035, 5.1, 5.03, 5.08),
];

/** Quiet grind then a wide opening bar — not an SGD rumor spike or CNH weekend gap. */
const KRW_PRE: OHLC[] = [
  bar("T-5", 1342, 1348, 1340, 1345),
  bar("T-4", 1345, 1350, 1343, 1347),
  bar("T-3", 1347, 1352, 1345, 1348),
  bar("T-2", 1348, 1354, 1346, 1350),
  bar("T-1", 1350, 1355, 1348, 1352),
  bar("T0", 1352, 1372, 1350, 1368),
];

/** Expanding two-way range — not CAD chop (tight) or KRW one-way drive. */
const EURSEK_PRE: OHLC[] = [
  bar("T-5", 11.38, 11.42, 11.36, 11.4),
  bar("T-4", 11.4, 11.48, 11.34, 11.36),
  bar("T-3", 11.36, 11.5, 11.3, 11.46),
  bar("T-2", 11.46, 11.56, 11.28, 11.32),
  bar("T-1", 11.32, 11.52, 11.24, 11.48),
  bar("T0", 11.48, 11.62, 11.22, 11.3),
];

/** Even staircase lower — not a GBP smooth slide or ZAR air-pocket dump. */
const THB_PRE: OHLC[] = [
  bar("T-5", 36.2, 36.28, 36.12, 36.16),
  bar("T-4", 36.16, 36.18, 35.98, 36.02),
  bar("T-3", 36.02, 36.06, 35.88, 35.92),
  bar("T-2", 35.92, 35.96, 35.78, 35.82),
  bar("T-1", 35.82, 35.88, 35.7, 35.74),
  bar("T0", 35.74, 35.8, 35.64, 35.68),
];

/** Gentle saucer top — slower than NOK’s round-over. */
const TWD_PRE: OHLC[] = [
  bar("T-5", 31.95, 32.08, 31.92, 32.04),
  bar("T-4", 32.04, 32.18, 32.0, 32.14),
  bar("T-3", 32.14, 32.22, 32.1, 32.16),
  bar("T-2", 32.16, 32.2, 32.08, 32.12),
  bar("T-1", 32.12, 32.16, 32.04, 32.08),
  bar("T0", 32.08, 32.12, 32.0, 32.04),
];

/** Tight doji cluster — not AUDNZD nested insides (those expanded) or CAD chop. */
const PHP_PRE: OHLC[] = [
  bar("T-5", 56.2, 56.35, 56.1, 56.22),
  bar("T-4", 56.22, 56.32, 56.14, 56.2),
  bar("T-3", 56.2, 56.28, 56.16, 56.21),
  bar("T-2", 56.21, 56.27, 56.17, 56.22),
  bar("T-1", 56.22, 56.3, 56.16, 56.19),
  bar("T0", 56.19, 56.26, 56.15, 56.2),
];

/** One bar engulfs the prior range — not a KRW opening drive (that was quiet then wide). */
const CLP_PRE: OHLC[] = [
  bar("T-5", 938, 942, 936, 940),
  bar("T-4", 940, 944, 938, 941),
  bar("T-3", 941, 945, 939, 942),
  bar("T-2", 942, 946, 940, 943),
  bar("T-1", 943, 947, 941, 944),
  bar("T0", 936, 952, 934, 948),
];

/** Impulse then a tight flag — not an INR pause after a grind or EURJPY chase run. */
const AUDJPY_PRE: OHLC[] = [
  bar("T-5", 96.2, 96.8, 96.0, 96.6),
  bar("T-4", 96.6, 97.4, 96.5, 97.2),
  bar("T-3", 97.2, 97.5, 97.0, 97.15),
  bar("T-2", 97.15, 97.35, 96.95, 97.05),
  bar("T-1", 97.05, 97.25, 96.9, 97.0),
  bar("T0", 97.0, 97.2, 96.85, 96.95),
];

/** Rising wedge (highs and lows squeeze up) — not an AUDJPY flag (impulse then pause). */
const TRY_PRE: OHLC[] = [
  bar("T-5", 32.05, 32.35, 31.95, 32.28),
  bar("T-4", 32.28, 32.55, 32.22, 32.48),
  bar("T-3", 32.48, 32.72, 32.44, 32.64),
  bar("T-2", 32.64, 32.85, 32.6, 32.76),
  bar("T-1", 32.76, 32.92, 32.72, 32.84),
  bar("T0", 32.84, 32.96, 32.8, 32.88),
];

/** Two equal highs then fail — not a BRL double-bottom, TWD saucer, or TRY rising wedge. */
const AUDCAD_PRE: OHLC[] = [
  bar("T-5", 0.902, 0.908, 0.9, 0.906),
  bar("T-4", 0.906, 0.915, 0.905, 0.913),
  bar("T-3", 0.913, 0.914, 0.904, 0.906),
  bar("T-2", 0.906, 0.9155, 0.905, 0.912),
  bar("T-1", 0.912, 0.913, 0.903, 0.905),
  bar("T0", 0.905, 0.908, 0.9, 0.902),
];

/** One wide mother bar then insides that hold — not AUDNZD nested-then-expand, PHP doji cluster, or EURGBP squeeze. */
const EURAUD_PRE: OHLC[] = [
  bar("T-5", 1.642, 1.648, 1.638, 1.644),
  bar("T-4", 1.644, 1.652, 1.64, 1.65),
  bar("T-3", 1.65, 1.668, 1.646, 1.662),
  bar("T-2", 1.662, 1.664, 1.654, 1.658),
  bar("T-1", 1.658, 1.663, 1.655, 1.659),
  bar("T0", 1.659, 1.664, 1.656, 1.66),
];

/** Three pushes into a high — not AUDCAD double-top, EURAUD inside, THB staircase, or AUDJPY flag. */
const GBPNZD_PRE: OHLC[] = [
  bar("T-5", 2.082, 2.088, 2.078, 2.086),
  bar("T-4", 2.086, 2.108, 2.084, 2.104),
  bar("T-3", 2.104, 2.106, 2.092, 2.094),
  bar("T-2", 2.094, 2.11, 2.09, 2.102),
  bar("T-1", 2.102, 2.105, 2.091, 2.094),
  bar("T0", 2.094, 2.112, 2.09, 2.106),
];

const SOL_PRE: OHLC[] = [
  bar("T-5", 142.0, 146.0, 140.0, 144.0),
  bar("T-4", 144.0, 148.0, 141.0, 147.0),
  bar("T-3", 147.0, 152.0, 145.0, 150.0),
  bar("T-2", 150.0, 156.0, 148.0, 154.0),
  bar("T-1", 154.0, 160.0, 152.0, 158.0),
  bar("T0", 158.0, 164.0, 156.0, 162.0),
];

const USDC_PRE: OHLC[] = [
  bar("T-5", 1.001, 1.002, 0.999, 1.0),
  bar("T-4", 1.0, 1.001, 0.998, 0.999),
  bar("T-3", 0.999, 1.0, 0.996, 0.997),
  bar("T-2", 0.997, 0.999, 0.994, 0.995),
  bar("T-1", 0.995, 0.998, 0.993, 0.996),
  bar("T0", 0.996, 0.999, 0.994, 0.997),
];

/** SAMPLE proof-of-work alt grind — not BTC 64k, ETH dump, SOL 142-162, or USDC peg. */
const POW_PRE: OHLC[] = [
  bar("T-5", 84.2, 85.1, 83.6, 84.6),
  bar("T-4", 84.6, 85.4, 84.0, 84.9),
  bar("T-3", 84.9, 85.6, 84.2, 84.7),
  bar("T-2", 84.7, 85.2, 83.8, 84.1),
  bar("T-1", 84.1, 84.6, 83.2, 83.6),
  bar("T0", 83.6, 84.2, 82.8, 83.2),
];

/** SAMPLE L2 grind-then-stall — not POW 84s, SOL 142-162, or ETH dump. */
const L2_PRE: OHLC[] = [
  bar("T-5", 18.4, 18.9, 18.2, 18.7),
  bar("T-4", 18.7, 19.2, 18.5, 19.0),
  bar("T-3", 19.0, 19.4, 18.8, 19.2),
  bar("T-2", 19.2, 19.5, 18.9, 19.15),
  bar("T-1", 19.15, 19.4, 18.95, 19.05),
  bar("T0", 19.05, 19.25, 18.85, 18.95),
];

/** SAMPLE bridge-token air-pocket — not L2 stall (18s), USDC peg, or POW 84s. */
const BRIDGE_PRE: OHLC[] = [
  bar("T-5", 7.12, 7.22, 7.04, 7.16),
  bar("T-4", 7.16, 7.24, 6.98, 7.02),
  bar("T-3", 7.02, 7.08, 6.64, 6.72),
  bar("T-2", 6.72, 6.8, 6.38, 6.46),
  bar("T-1", 6.46, 6.54, 6.22, 6.28),
  bar("T0", 6.28, 6.36, 6.12, 6.18),
];

/** SAMPLE high-beta alt relief bounce — not BTC 64k extend, SOL 142 chase, or L2 stall. */
const ALT_PRE: OHLC[] = [
  bar("T-5", 1.92, 1.98, 1.84, 1.88),
  bar("T-4", 1.88, 1.96, 1.82, 1.94),
  bar("T-3", 1.94, 2.08, 1.9, 2.04),
  bar("T-2", 2.04, 2.16, 2.0, 2.12),
  bar("T-1", 2.12, 2.22, 2.08, 2.18),
  bar("T0", 2.18, 2.28, 2.14, 2.24),
];

/** SAMPLE proof-of-stake already dumped — not POW 84s grind-over, ETH 3.2k dump, or ALT 2.x bounce. */
const POS_PRE: OHLC[] = [
  bar("T-5", 2680, 2710, 2640, 2660),
  bar("T-4", 2660, 2690, 2580, 2600),
  bar("T-3", 2600, 2630, 2520, 2540),
  bar("T-2", 2540, 2570, 2480, 2500),
  bar("T-1", 2500, 2530, 2440, 2460),
  bar("T0", 2460, 2490, 2410, 2430),
];

/** SAMPLE staking token already dumped — not L2 18s stall, POS 2.4k dump, or ALT 2.x bounce. */
const STAKE_PRE: OHLC[] = [
  bar("T-5", 5.42, 5.5, 5.28, 5.32),
  bar("T-4", 5.32, 5.4, 5.12, 5.16),
  bar("T-3", 5.16, 5.24, 4.96, 5.0),
  bar("T-2", 5.0, 5.08, 4.82, 4.86),
  bar("T-1", 4.86, 4.94, 4.7, 4.74),
  bar("T0", 4.74, 4.82, 4.58, 4.62),
];

/** SAMPLE listing-rumor run — not USDC peg, ALT 2.x bounce, L2 18s stall, or STAKE 4.6 dump. */
const LIST_PRE: OHLC[] = [
  bar("T-5", 0.318, 0.326, 0.312, 0.322),
  bar("T-4", 0.322, 0.338, 0.318, 0.334),
  bar("T-3", 0.334, 0.356, 0.328, 0.35),
  bar("T-2", 0.35, 0.372, 0.344, 0.366),
  bar("T-1", 0.366, 0.392, 0.36, 0.386),
  bar("T0", 0.386, 0.412, 0.38, 0.406),
];

/** SAMPLE DEX token into a thin weekend book — not L2 18s stall, BRIDGE 6s air-pocket, or LIST 0.3 run. */
const DEX_PRE: OHLC[] = [
  bar("T-5", 12.48, 12.58, 12.4, 12.52),
  bar("T-4", 12.52, 12.6, 12.44, 12.5),
  bar("T-3", 12.5, 12.56, 12.42, 12.46),
  bar("T-2", 12.46, 12.54, 12.38, 12.44),
  bar("T-1", 12.44, 12.5, 12.36, 12.42),
  bar("T0", 12.42, 12.48, 12.34, 12.38),
];

/** SAMPLE NFT marketplace token round-top — not DEX 12 weekend gap, L2 18s stall, or POW 84 grind-over. */
const NFT_PRE: OHLC[] = [
  bar("T-5", 36.2, 37.4, 36.0, 37.1),
  bar("T-4", 37.1, 38.6, 36.9, 38.2),
  bar("T-3", 38.2, 39.4, 37.8, 38.8),
  bar("T-2", 38.8, 39.2, 37.6, 38.0),
  bar("T-1", 38.0, 38.4, 36.8, 37.2),
  bar("T0", 37.2, 37.6, 36.2, 36.6),
];

/** SAMPLE privacy-coin failed breakout — not NFT 36 round-top, POW 84 grind-over, or DEX 12 weekend coil. */
const PRIV_PRE: OHLC[] = [
  bar("T-5", 54.2, 55.4, 53.8, 55.0),
  bar("T-4", 55.0, 56.6, 54.6, 56.2),
  bar("T-3", 56.2, 57.8, 55.8, 57.4),
  bar("T-2", 57.4, 57.9, 55.6, 56.0),
  bar("T-1", 56.0, 56.6, 54.4, 54.8),
  bar("T0", 54.8, 55.4, 53.6, 54.0),
];

/** SAMPLE oracle-token staircase — not DEX 12 weekend coil, BRIDGE 6 air-pocket, or NFT 36 round-top. */
const ORCL_PRE: OHLC[] = [
  bar("T-5", 8.12, 8.22, 8.06, 8.18),
  bar("T-4", 8.18, 8.3, 8.14, 8.26),
  bar("T-3", 8.26, 8.4, 8.22, 8.36),
  bar("T-2", 8.36, 8.5, 8.32, 8.46),
  bar("T-1", 8.46, 8.6, 8.42, 8.56),
  bar("T0", 8.56, 8.7, 8.52, 8.66),
];

/** SAMPLE DAO token expanding range — not ORCL 8 staircase, ALT 2.x bounce, or LIST 0.3 run. */
const DAO_PRE: OHLC[] = [
  bar("T-5", 0.704, 0.728, 0.692, 0.722),
  bar("T-4", 0.722, 0.73, 0.688, 0.696),
  bar("T-3", 0.696, 0.738, 0.69, 0.732),
  bar("T-2", 0.732, 0.744, 0.702, 0.708),
  bar("T-1", 0.708, 0.748, 0.698, 0.742),
  bar("T0", 0.742, 0.752, 0.712, 0.718),
];

/** SAMPLE restaking token opening drive — not DEX 12 weekend coil, L2 18 stall, or DAO 0.7 expanding. */
const RSTK_PRE: OHLC[] = [
  bar("T-5", 14.12, 14.22, 14.06, 14.16),
  bar("T-4", 14.16, 14.24, 14.1, 14.18),
  bar("T-3", 14.18, 14.26, 14.12, 14.2),
  bar("T-2", 14.2, 14.28, 14.14, 14.22),
  bar("T-1", 14.22, 14.28, 14.16, 14.24),
  bar("T0", 14.24, 14.3, 14.18, 14.26),
];

/** SAMPLE perp-DEX token double-bottom — not ALT 2.x bounce, STAKE 4.6 dump, or RSTK 14 coil. */
const PERP_PRE: OHLC[] = [
  bar("T-5", 3.62, 3.68, 3.28, 3.34),
  bar("T-4", 3.34, 3.52, 3.3, 3.48),
  bar("T-3", 3.48, 3.54, 3.26, 3.32),
  bar("T-2", 3.32, 3.48, 3.28, 3.44),
  bar("T-1", 3.44, 3.58, 3.4, 3.52),
  bar("T0", 3.52, 3.64, 3.48, 3.58),
];

/** SAMPLE AI-agent token outside bar — not PERP 3.4 double-bottom, LIST 0.3 run, or DAO 0.7 expanding. */
const AI_PRE: OHLC[] = [
  bar("T-5", 0.0482, 0.049, 0.0476, 0.0486),
  bar("T-4", 0.0486, 0.0494, 0.048, 0.049),
  bar("T-3", 0.049, 0.0496, 0.0484, 0.0492),
  bar("T-2", 0.0492, 0.0498, 0.0486, 0.0494),
  bar("T-1", 0.0494, 0.05, 0.0488, 0.0496),
  bar("T0", 0.0496, 0.0524, 0.0468, 0.0478),
];

/** SAMPLE RWA token doji — not L2 18 stall, RSTK 14 coil, or DAO 0.7 expanding. */
const RWA_PRE: OHLC[] = [
  bar("T-5", 22.14, 22.28, 22.04, 22.18),
  bar("T-4", 22.18, 22.32, 22.08, 22.22),
  bar("T-3", 22.22, 22.36, 22.12, 22.26),
  bar("T-2", 22.26, 22.4, 22.16, 22.3),
  bar("T-1", 22.3, 22.44, 22.2, 22.34),
  bar("T0", 22.34, 22.5, 22.18, 22.36),
];

/** SAMPLE gaming-token inside-bar — not RWA 22 doji, DEX 12 weekend coil, or ORCL 8 staircase. */
const GAME_PRE: OHLC[] = [
  bar("T-5", 9.22, 9.38, 9.16, 9.28),
  bar("T-4", 9.28, 9.44, 9.22, 9.36),
  bar("T-3", 9.36, 9.52, 9.3, 9.42),
  bar("T-2", 9.42, 9.5, 9.34, 9.4),
  bar("T-1", 9.38, 9.72, 9.08, 9.48),
  bar("T0", 9.42, 9.58, 9.28, 9.44),
];

/** SAMPLE DePIN storage dump-no-reclaim — not LIST 0.3 run, AI 0.048 outside, or DEX 12 weekend coil. */
const STOR_PRE: OHLC[] = [
  bar("T-5", 0.178, 0.182, 0.172, 0.174),
  bar("T-4", 0.174, 0.178, 0.166, 0.168),
  bar("T-3", 0.168, 0.172, 0.158, 0.16),
  bar("T-2", 0.16, 0.164, 0.15, 0.152),
  bar("T-1", 0.152, 0.156, 0.142, 0.144),
  bar("T0", 0.144, 0.148, 0.134, 0.136),
];

/** SAMPLE meme impulse-and-flag — not STOR 0.13 dump, SOL chase, or LIST 0.3 listing-run. */
const MEME_PRE: OHLC[] = [
  bar("T-5", 0.0068, 0.0074, 0.0066, 0.0072),
  bar("T-4", 0.0072, 0.0088, 0.0071, 0.0086),
  bar("T-3", 0.0086, 0.0108, 0.0085, 0.0104),
  bar("T-2", 0.0104, 0.0106, 0.0096, 0.0098),
  bar("T-1", 0.0098, 0.01, 0.0092, 0.0094),
  bar("T0", 0.0094, 0.0096, 0.0089, 0.0091),
];

/** SAMPLE GPU-render rising-wedge — not MEME 0.009 flag, AI 0.048 outside, or STOR 0.13 dump. */
const GPU_PRE: OHLC[] = [
  bar("T-5", 4.12, 4.28, 4.08, 4.24),
  bar("T-4", 4.24, 4.48, 4.2, 4.44),
  bar("T-3", 4.44, 4.72, 4.4, 4.68),
  bar("T-2", 4.68, 4.88, 4.64, 4.84),
  bar("T-1", 4.84, 4.98, 4.8, 4.92),
  bar("T0", 4.92, 5.02, 4.88, 4.94),
];

/** SAMPLE identity-token V-reclaim — not GPU 4.9 wedge, ALT bounce-fail, or RWA 22 doji. */
const DID_PRE: OHLC[] = [
  bar("T-5", 2.08, 2.12, 2.04, 2.06),
  bar("T-4", 2.06, 2.08, 1.88, 1.9),
  bar("T-3", 1.9, 1.98, 1.84, 1.94),
  bar("T-2", 1.94, 1.96, 1.82, 1.86),
  bar("T-1", 1.86, 1.94, 1.84, 1.92),
  bar("T0", 1.92, 2.02, 1.9, 2.0),
];

/** SAMPLE lending-token round-top after a TVL scare already ran — not NFT 36 volume round, MEME 0.009 flag, or GPU 4.9 wedge. */
const LEND_PRE: OHLC[] = [
  bar("T-5", 0.82, 0.86, 0.8, 0.84),
  bar("T-4", 0.84, 0.96, 0.83, 0.94),
  bar("T-3", 0.94, 1.08, 0.93, 1.04),
  bar("T-2", 1.04, 1.06, 0.96, 0.98),
  bar("T-1", 0.98, 1.0, 0.92, 0.94),
  bar("T0", 0.94, 0.96, 0.88, 0.9),
];

/** Two equal highs then fail — not PERP double-bottom, LEND round-top, or NFT volume saucer. */
const INS_PRE: OHLC[] = [
  bar("T-5", 6.12, 6.28, 6.08, 6.22),
  bar("T-4", 6.22, 6.48, 6.18, 6.44),
  bar("T-3", 6.44, 6.46, 6.22, 6.26),
  bar("T-2", 6.26, 6.49, 6.24, 6.42),
  bar("T-1", 6.42, 6.44, 6.18, 6.22),
  bar("T0", 6.22, 6.32, 6.12, 6.16),
];

/** Three pushes into a high — not ORCL staircase, RSTK one-bar drive, or INS double-top. */
const NAME_PRE: OHLC[] = [
  bar("T-5", 11.2, 11.6, 11.0, 11.5),
  bar("T-4", 11.5, 12.4, 11.4, 12.3),
  bar("T-3", 12.3, 12.4, 11.8, 11.9),
  bar("T-2", 11.9, 12.8, 11.8, 12.6),
  bar("T-1", 12.6, 12.7, 12.1, 12.2),
  bar("T0", 12.2, 13.0, 12.1, 12.8),
];

/** Falling wedge (lower highs, higher lows) — not GPU rising wedge, MEME flag, or NAME three-push. */
const CDN_PRE: OHLC[] = [
  bar("T-5", 4.4, 4.8, 4.2, 4.7),
  bar("T-4", 4.7, 4.75, 4.1, 4.2),
  bar("T-3", 4.2, 4.55, 4.15, 4.48),
  bar("T-2", 4.48, 4.52, 4.22, 4.28),
  bar("T-1", 4.28, 4.45, 4.26, 4.4),
  bar("T0", 4.4, 4.44, 4.32, 4.38),
];

const EVENT_COIL_PRE: OHLC[] = [
  bar("T-5", 74.2, 74.8, 73.9, 74.4),
  bar("T-4", 74.4, 74.9, 74.0, 74.3),
  bar("T-3", 74.3, 74.7, 73.8, 74.1),
  bar("T-2", 74.1, 74.6, 73.9, 74.4),
  bar("T-1", 74.4, 74.8, 74.0, 74.5),
  bar("T0", 74.5, 75.0, 74.2, 74.7),
];

const SETTLE_PRE: OHLC[] = [
  bar("T-5", 212.0, 218.0, 210.0, 216.0),
  bar("T-4", 216.0, 220.0, 214.0, 215.0),
  bar("T-3", 215.0, 217.0, 211.0, 212.5),
  bar("T-2", 212.5, 214.0, 209.0, 210.5),
  bar("T-1", 210.5, 213.0, 208.5, 211.0),
  bar("T0", 211.0, 214.5, 210.0, 213.2),
];

/** Rate-sensitive SAMPLE utility coiled into a scheduled print — not EVENT_COIL (74s) or UND_PRE (186s). */
const PRINT_COIL_PRE: OHLC[] = [
  bar("T-5", 41.8, 42.1, 41.6, 41.95),
  bar("T-4", 41.95, 42.2, 41.85, 42.05),
  bar("T-3", 42.05, 42.25, 41.9, 42.1),
  bar("T-2", 42.1, 42.28, 42.0, 42.15),
  bar("T-1", 42.15, 42.3, 42.05, 42.18),
  bar("T0", 42.18, 42.32, 42.08, 42.2),
];

/** SAMPLE importer coiled into a shipping-lane scare — not PRINT_COIL (42s) or EVENT_COIL (74s). */
const STRAIT_PRE: OHLC[] = [
  bar("T-5", 62.1, 62.6, 61.7, 62.0),
  bar("T-4", 62.0, 62.4, 61.6, 61.9),
  bar("T-3", 61.9, 62.3, 61.5, 61.85),
  bar("T-2", 61.85, 62.2, 61.55, 61.8),
  bar("T-1", 61.8, 62.1, 61.5, 61.75),
  bar("T0", 61.75, 62.05, 61.45, 61.7),
];

/** Event already gapped, then overlapping digest around 99 — not SETTLE_PRE (212s) or PRINT_COIL (42s). */
const POST_PRINT_PRE: OHLC[] = [
  bar("T-5", 96.0, 104.0, 95.0, 102.0),
  bar("T-4", 102.0, 103.5, 100.5, 101.2),
  bar("T-3", 101.2, 102.0, 99.8, 100.4),
  bar("T-2", 100.4, 101.2, 99.4, 99.8),
  bar("T-1", 99.8, 100.6, 99.0, 99.4),
  bar("T0", 99.4, 100.2, 98.8, 99.2),
];

/** Air-pocket dump around 51 — not POST_PRINT digest (99s) or STRAIT coil (62s). */
const RUMOR_GAP_PRE: OHLC[] = [
  bar("T-5", 54.2, 54.8, 53.9, 54.4),
  bar("T-4", 54.4, 54.7, 53.6, 53.9),
  bar("T-3", 53.9, 54.2, 52.4, 52.7),
  bar("T-2", 52.7, 53.0, 51.2, 51.5),
  bar("T-1", 51.5, 52.1, 50.6, 50.9),
  bar("T0", 50.9, 51.4, 50.2, 50.6),
];

/** SAMPLE homebuilder already ran — not PRINT_COIL (42s tight) or SETTLE_PRE (212s gap digest). */
const BUILDER_PRE: OHLC[] = [
  bar("T-5", 108.0, 110.4, 107.4, 109.8),
  bar("T-4", 109.8, 112.6, 109.2, 112.0),
  bar("T-3", 112.0, 114.8, 111.4, 114.2),
  bar("T-2", 114.2, 116.6, 113.6, 116.0),
  bar("T-1", 116.0, 118.2, 115.4, 117.6),
  bar("T0", 117.6, 119.4, 116.8, 118.8),
];

/** SAMPLE energy producer already dumped — not STRAIT importer coil (62s) or BUILDER run (108-118). */
const PRODUCER_PRE: OHLC[] = [
  bar("T-5", 94.2, 95.0, 93.4, 93.8),
  bar("T-4", 93.8, 94.4, 91.6, 92.0),
  bar("T-3", 92.0, 92.6, 89.4, 89.8),
  bar("T-2", 89.8, 90.4, 87.2, 87.6),
  bar("T-1", 87.6, 88.4, 86.0, 86.6),
  bar("T0", 86.6, 87.4, 85.4, 86.0),
];

/** SAMPLE small-name already dumped — not POST_PRINT 99s digest, PRINT_COIL 42s, or PRODUCER 86-94 dump. */
const BEAT_CUT_PRE: OHLC[] = [
  bar("T-5", 26.8, 27.2, 26.1, 26.4),
  bar("T-4", 26.4, 26.7, 25.6, 25.9),
  bar("T-3", 25.9, 26.2, 25.1, 25.3),
  bar("T-2", 25.3, 25.6, 24.6, 24.8),
  bar("T-1", 24.8, 25.1, 24.2, 24.4),
  bar("T0", 24.4, 24.7, 23.9, 24.1),
];

/** SAMPLE takeover-rumor run — not RUMOR_GAP 51s dump, BUILDER 108-118, or STRAIT 62 coil. */
const TAKEOVER_PRE: OHLC[] = [
  bar("T-5", 142.0, 144.0, 141.2, 143.2),
  bar("T-4", 143.2, 146.4, 142.6, 145.8),
  bar("T-3", 145.8, 149.6, 145.0, 148.8),
  bar("T-2", 148.8, 152.4, 148.0, 151.6),
  bar("T-1", 151.6, 155.2, 150.8, 154.4),
  bar("T0", 154.4, 157.8, 153.6, 157.0),
];

/** SAMPLE failed breakout / chop around 81 — not EVENT_COIL 74s tight or UND 186 coil. */
const FAIL_BRK_PRE: OHLC[] = [
  bar("T-5", 81.2, 82.4, 80.8, 82.0),
  bar("T-4", 82.0, 83.6, 81.6, 83.2),
  bar("T-3", 83.2, 83.8, 82.4, 82.8),
  bar("T-2", 82.8, 83.4, 81.2, 81.6),
  bar("T-1", 81.6, 82.2, 80.6, 81.0),
  bar("T0", 81.0, 81.6, 80.2, 80.6),
];

/** SAMPLE retailer round-top into an event — not FAIL_BRK 81 poke, EVENT_COIL 74 tight, or PRINT_COIL 42s. */
const ROUND_TOP_PRE: OHLC[] = [
  bar("T-5", 33.4, 34.2, 33.2, 34.0),
  bar("T-4", 34.0, 34.8, 33.8, 34.6),
  bar("T-3", 34.6, 35.2, 34.4, 34.8),
  bar("T-2", 34.8, 35.0, 34.2, 34.4),
  bar("T-1", 34.4, 34.6, 33.8, 34.0),
  bar("T0", 34.0, 34.2, 33.4, 33.6),
];

/** SAMPLE software staircase into an event — not ROUND_TOP 33s, PRINT_COIL 42s, or BEAT_CUT 24 dump. */
const STAIR_PRE: OHLC[] = [
  bar("T-5", 17.4, 17.55, 17.28, 17.32),
  bar("T-4", 17.32, 17.4, 17.12, 17.16),
  bar("T-3", 17.16, 17.22, 16.96, 17.0),
  bar("T-2", 17.0, 17.08, 16.82, 16.86),
  bar("T-1", 16.86, 16.92, 16.68, 16.72),
  bar("T0", 16.72, 16.78, 16.54, 16.58),
];

/** SAMPLE biotech expanding range into an event — not STAIR 16s, FAIL_BRK 81 poke, or UND 186 coil. */
const EXPAND_PRE: OHLC[] = [
  bar("T-5", 126.4, 128.8, 124.2, 128.2),
  bar("T-4", 128.2, 129.0, 123.6, 124.4),
  bar("T-3", 124.4, 130.2, 123.8, 129.6),
  bar("T-2", 129.6, 131.4, 125.0, 125.8),
  bar("T-1", 125.8, 132.0, 124.6, 131.2),
  bar("T0", 131.2, 132.4, 126.8, 127.6),
];

/** SAMPLE airline opening drive after an event — not EXPAND 126 two-way, PRINT_COIL 42 tight, or SETTLE 212 digest. */
const DRIVE_PRE: OHLC[] = [
  bar("T-5", 46.8, 47.1, 46.6, 46.95),
  bar("T-4", 46.95, 47.15, 46.75, 47.0),
  bar("T-3", 47.0, 47.2, 46.8, 47.05),
  bar("T-2", 47.05, 47.25, 46.85, 47.1),
  bar("T-1", 47.1, 47.28, 46.9, 47.12),
  bar("T0", 47.12, 47.3, 46.92, 47.15),
];

/** SAMPLE hotel double-bottom into an event — not DRIVE 47 quiet coil, STRAIT 62 importer, or FAIL_BRK 81 poke. */
const DBL_PRE: OHLC[] = [
  bar("T-5", 69.4, 69.8, 67.2, 67.6),
  bar("T-4", 67.6, 68.8, 67.4, 68.4),
  bar("T-3", 68.4, 68.9, 67.3, 67.5),
  bar("T-2", 67.5, 68.6, 67.4, 68.2),
  bar("T-1", 68.2, 69.0, 68.0, 68.7),
  bar("T0", 68.7, 69.4, 68.4, 69.1),
];

/** SAMPLE regional-bank outside bar into an event — not DBL 67 hotel, ROUND_TOP 33, or BEAT_CUT 24 dump. */
const OUT_PRE: OHLC[] = [
  bar("T-5", 29.4, 29.7, 29.2, 29.5),
  bar("T-4", 29.5, 29.8, 29.3, 29.55),
  bar("T-3", 29.55, 29.85, 29.35, 29.6),
  bar("T-2", 29.6, 29.9, 29.4, 29.65),
  bar("T-1", 29.65, 29.95, 29.45, 29.7),
  bar("T0", 29.7, 30.6, 28.9, 29.2),
];

/** SAMPLE REIT doji into an event — not STAIR 16s, OUT 29 outside, or PRINT_COIL 42 tight. */
const DOJI_PRE: OHLC[] = [
  bar("T-5", 11.42, 11.5, 11.36, 11.44),
  bar("T-4", 11.44, 11.52, 11.38, 11.46),
  bar("T-3", 11.46, 11.54, 11.4, 11.48),
  bar("T-2", 11.48, 11.56, 11.42, 11.5),
  bar("T-1", 11.5, 11.58, 11.44, 11.52),
  bar("T0", 11.52, 11.58, 11.46, 11.53),
];

/** SAMPLE chip dump-no-reclaim after an event — not SETTLE 212 digest, UND 186 coil, or TAKEOVER 142-157 run. */
const DUMP_NR_PRE: OHLC[] = [
  bar("T-5", 246.0, 248.5, 243.0, 244.2),
  bar("T-4", 244.2, 245.8, 239.0, 240.4),
  bar("T-3", 240.4, 241.6, 234.0, 235.2),
  bar("T-2", 235.2, 236.8, 229.4, 230.6),
  bar("T-1", 230.6, 232.0, 225.0, 226.2),
  bar("T0", 226.2, 227.4, 221.0, 222.2),
];

/** SAMPLE insurer inside-bar into an event — not DOJI 11s, OUT 29, or STRAIT 62 coil. */
const INSIDE_PRE: OHLC[] = [
  bar("T-5", 57.2, 57.8, 56.9, 57.4),
  bar("T-4", 57.4, 58.2, 57.1, 57.9),
  bar("T-3", 57.9, 58.6, 57.5, 58.1),
  bar("T-2", 58.1, 58.4, 57.6, 57.8),
  bar("T-1", 57.8, 59.2, 56.8, 58.4),
  bar("T0", 58.2, 58.7, 57.6, 58.1),
];

/** SAMPLE railroad bull-flag into an event — not INSIDE 57, TAKEOVER 142-157 run, or UND 186 coil. */
const FLAG_PRE: OHLC[] = [
  bar("T-5", 166.2, 168.0, 165.6, 167.6),
  bar("T-4", 167.6, 170.2, 167.0, 169.8),
  bar("T-3", 169.8, 173.4, 169.2, 172.8),
  bar("T-2", 172.8, 173.6, 171.4, 171.8),
  bar("T-1", 171.8, 172.6, 170.8, 171.2),
  bar("T0", 171.2, 172.2, 170.6, 171.4),
];

/** SAMPLE defense rising-wedge into an event — not FLAG 172, DUMP_NR 222, or TAKEOVER 142-157 run. */
const WEDGE_PRE: OHLC[] = [
  bar("T-5", 308, 312, 306, 310),
  bar("T-4", 310, 316, 308, 314),
  bar("T-3", 314, 322, 312, 320),
  bar("T-2", 320, 326, 318, 324),
  bar("T-1", 324, 328, 322, 325),
  bar("T0", 325, 328, 323, 324),
];

/** SAMPLE hotel impulse-and-flag after an event already ran — not FLAG 172 railroad wait, WEDGE 324, or INSIDE 57. */
const HOTEL_PRE: OHLC[] = [
  bar("T-5", 82.4, 84.0, 82.0, 83.6),
  bar("T-4", 83.6, 87.2, 83.2, 86.8),
  bar("T-3", 86.8, 91.4, 86.4, 90.8),
  bar("T-2", 90.8, 91.2, 88.6, 89.0),
  bar("T-1", 89.0, 89.6, 87.8, 88.2),
  bar("T0", 88.2, 88.8, 87.2, 87.6),
];

/** SAMPLE casino rising-wedge after an event already ran — not HOTEL 82 flag, WEDGE 324 defense, or FLAG 172. */
const CASINO_PRE: OHLC[] = [
  bar("T-5", 41.2, 42.0, 41.0, 41.8),
  bar("T-4", 41.8, 43.2, 41.6, 43.0),
  bar("T-3", 43.0, 44.8, 42.8, 44.6),
  bar("T-2", 44.6, 45.8, 44.4, 45.6),
  bar("T-1", 45.6, 46.4, 45.4, 46.0),
  bar("T0", 46.0, 46.6, 45.8, 46.2),
];

/** SAMPLE payments V-reclaim after walked-back risk-off — not DBL 67 hotel, DUMP_NR 222 chip, or CASINO 46 wedge. */
const PAY_PRE: OHLC[] = [
  bar("T-5", 103.8, 104.4, 103.2, 103.6),
  bar("T-4", 103.6, 103.8, 98.4, 98.8),
  bar("T-3", 98.8, 101.2, 97.6, 100.4),
  bar("T-2", 100.4, 100.8, 96.2, 96.8),
  bar("T-1", 96.8, 99.4, 96.6, 99.0),
  bar("T0", 99.0, 102.2, 98.6, 101.6),
];

/** SAMPLE streaming round-top after an event already ran — not ROUND_TOP 33 retailer wait, HOTEL 82 flag, or PAY 103 V. */
const STREAM_PRE: OHLC[] = [
  bar("T-5", 18.2, 18.8, 18.0, 18.6),
  bar("T-4", 18.6, 20.4, 18.4, 20.2),
  bar("T-3", 20.2, 22.6, 20.0, 22.2),
  bar("T-2", 22.2, 22.4, 20.8, 21.2),
  bar("T-1", 21.2, 21.6, 20.2, 20.6),
  bar("T0", 20.6, 21.0, 19.6, 20.0),
];

/** Two equal highs then fail — not DBL 67 hotel bottom, STREAM 20 round, or ROUND_TOP 33 retailer. */
const AIRL_PRE: OHLC[] = [
  bar("T-5", 126.0, 128.4, 125.2, 127.8),
  bar("T-4", 127.8, 132.6, 127.2, 132.0),
  bar("T-3", 132.0, 132.4, 128.4, 129.0),
  bar("T-2", 129.0, 132.8, 128.6, 131.6),
  bar("T-1", 131.6, 132.0, 128.0, 128.6),
  bar("T0", 128.6, 130.2, 126.8, 127.4),
];

/** Three pushes into a high — not STAIR even steps, AIRL double-top, or OPEN-DRIVE one wide bar. */
const BIO_PRE: OHLC[] = [
  bar("T-5", 82.4, 83.2, 81.8, 83.0),
  bar("T-4", 83.0, 86.8, 82.6, 86.4),
  bar("T-3", 86.4, 86.8, 84.2, 84.6),
  bar("T-2", 84.6, 88.2, 84.4, 87.6),
  bar("T-1", 87.6, 88.0, 85.8, 86.2),
  bar("T0", 86.2, 89.4, 85.8, 88.8),
];

export const FUTURES_CASES: CaseStudy[] = [
  {
    id: "case-fut-trend-cont",
    title: "Index futures still grinding higher",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "An index futures contract has been grinding higher. Headlines are mildly positive. No shock in the brief. Buy, sell, or hold before the next session.",
    newsHeadline: "Risk appetite is steady. No new catalyst.",
    preOhlc: ES_PRE,
    postOhlc: withAftermath(ES_PRE, [
      bar("+1", 5160, 5180, 5152, 5172),
      bar("+2", 5172, 5190, 5164, 5184),
      bar("+3", 5184, 5200, 5175, 5192),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "With no bad news and a clean uptrend, blindly chasing is weaker than asking whether you still want to follow the trend for your time frame.",
      whyMarketMoved: "The grind continued. No shock headline.",
      evidence: "Uptrend plus a mildly positive brief. How you think about it matters more than guessing the next tick.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-risk-off",
    title: "Crude futures dump on fear",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This crude-oil futures contract was already weak. A sudden risk-off headline hits. Decide before the next session.",
    newsHeadline: "Sudden risk-off. Chatter about weaker demand.",
    preOhlc: CL_PRE,
    postOhlc: withAftermath(CL_PRE, [
      bar("+1", 76.1, 76.4, 73.8, 74.2),
      bar("+2", 74.2, 74.8, 72.9, 73.4),
      bar("+3", 73.4, 74.0, 72.5, 73.1),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A dump like this punishes late buyers. Hold only if your thesis survives a further slide. Short selling stays locked here.",
      whyMarketMoved: "The contract dumped on a demand scare.",
      evidence: "Already-weak chart plus a risk-off headline. Size the risk to your time frame.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-roll-literacy",
    title: "Front month richer than the next (contango)",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "This index future is near a roll to the next contract. The front month is richer than the next month (contango). This is a structure lesson, not a live calculator.",
    newsHeadline:
      "Front month trades at a premium to the next month. Roll window approaching.",
    preOhlc: ES_PRE,
    postOhlc: withAftermath(ES_PRE, [
      bar("+1", 5160, 5168, 5140, 5148),
      bar("+2", 5148, 5155, 5132, 5140),
      bar("+3", 5140, 5150, 5128, 5136),
    ]),
    correctActions: ["hold", "sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Contango is a cost to know about, not an automatic sell. Name the structure, then decide if your time frame cares.",
      whyMarketMoved: "The contract softened into roll chatter.",
      evidence: "Roll and contango brief. Know the structure before guessing ticks.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-gold-grind",
    title: "Gold futures still grinding with a calm brief",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "A SAMPLE gold futures contract has been grinding higher. The brief is calm, not a shock. Buy, sell, or hold before the next session.",
    newsHeadline: "Calm bid for gold futures. No shock in the brief.",
    preOhlc: GC_PRE,
    postOhlc: withAftermath(GC_PRE, [
      bar("+1", 2352, 2368, 2348, 2362),
      bar("+2", 2362, 2374, 2356, 2368),
      bar("+3", 2368, 2380, 2360, 2372),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A calm grind is a time-frame question, not an automatic chase. Hold if you already have the exposure you wanted.",
      whyMarketMoved: "The grind continued. No shock headline.",
      evidence: "Uptrend gold tape plus a calm SAMPLE brief.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-corn-weather",
    title: "Corn futures dump on a weather scare",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "This SAMPLE corn contract was already weak. A weather scare hits demand chatter, not a crop outage. Decide before the next session.",
    newsHeadline: "Weather scare. Demand chatter cools. Not a confirmed outage.",
    preOhlc: ZC_PRE,
    postOhlc: withAftermath(ZC_PRE, [
      bar("+1", 445, 448, 432, 436),
      bar("+2", 436, 440, 428, 432),
      bar("+3", 432, 436, 424, 428),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A demand scare on an already-weak grain tape is usually not a buy. Hold if you sized for more slide. This is SAMPLE weather copy, not a live crop report.",
      whyMarketMoved: "The contract kept sliding with the scare.",
      evidence: "Weak grain tape plus a weather/demand headline.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-nq-risk-off",
    title: "Nasdaq futures sold with risk appetite",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE Nasdaq-style index future was already sliding. A risk-off headline hits. Decide before the next session.",
    newsHeadline: "Risk-off. Index futures sold with growth names.",
    preOhlc: NQ_PRE,
    postOhlc: withAftermath(NQ_PRE, [
      bar("+1", 17640, 17680, 17480, 17520),
      bar("+2", 17520, 17580, 17390, 17440),
      bar("+3", 17440, 17500, 17320, 17380),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Index futures in a risk-off tape are about how much market risk you want. Adding into the slide is usually not process.",
      whyMarketMoved: "The slide continued with the risk-off brief.",
      evidence: "Already-weak NQ-style tape plus a market-wide headline.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-es-print",
    title: "Index futures into a hot data print",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "This SAMPLE index future was grinding higher into a data print. The print comes in hotter than hoped. Decide before you see the next session.",
    newsHeadline: "Hot data print. Rate-cut odds fall. Index futures in focus.",
    preOhlc: ES_PRE,
    postOhlc: withAftermath(ES_PRE, [
      bar("+1", 5148, 5155, 5110, 5122),
      bar("+2", 5122, 5134, 5098, 5108),
      bar("+3", 5108, 5120, 5088, 5096),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Hot data can reprice the whole index. A grind into the print is often already optimistic. Hold if you sized for a miss.",
      whyMarketMoved: "The grind reversed after the hot print.",
      evidence: "Uptrend ES-style tape plus a data-print brief.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-cl-supply",
    title: "Crude futures catch a bid on a supply headline",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "This SAMPLE crude contract was weak. A supply-outage headline hits. Producers can catch a bid on scary news. Decide before the next session.",
    newsHeadline: "Supply-outage chatter. Near-term crude prices jump.",
    preOhlc: CL_PRE,
    postOhlc: withAftermath(CL_PRE, [
      bar("+1", 76.8, 79.4, 76.4, 78.8),
      bar("+2", 78.8, 80.2, 78.2, 79.6),
      bar("+3", 79.6, 80.8, 78.8, 80.0),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Name whether this contract benefits from scarcity. A weak tape plus a real supply headline can be a buy or a hold, not an automatic dump.",
      whyMarketMoved: "The weak crude tape reversed with scarcity talk.",
      evidence: "Already-weak CL-style tape plus a supply headline.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-int-gold-fade",
    title: "Gold already extended into a calm print",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE gold future already ran. A calm data print lands with no shock. You have Indicators. Is the print a reason to add, or a reason for late buyers to exit?",
    newsHeadline: "Calm print. No new gold shock. Contract already extended.",
    preOhlc: GC_PRE,
    postOhlc: withAftermath(GC_PRE, [
      bar("+1", 2346, 2350, 2328, 2332),
      bar("+2", 2332, 2338, 2318, 2324),
      bar("+3", 2324, 2330, 2312, 2318),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "An extended contract plus a nothing-print is often fade-or-wait. Intermediate work is naming what is already in the price.",
      whyMarketMoved: "Late buyers exited when the print added nothing.",
      evidence: "Extended gold tape plus a calm print.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "intermediate",
    assetClass: "future",
  },
  {
    id: "case-fut-int-roll-backwardation",
    title: "Front month cheaper than the next (backwardation)",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "This SAMPLE crude contract is in backwardation: the front month is cheaper than the next. Roll is near. Structure lesson, not a live calculator. How do you treat the roll?",
    newsHeadline:
      "Front month cheaper than the next month. Roll window approaching.",
    preOhlc: CL_PRE,
    postOhlc: withAftermath(CL_PRE, [
      bar("+1", 76.4, 77.8, 76.0, 77.2),
      bar("+2", 77.2, 78.0, 76.8, 77.6),
      bar("+3", 77.6, 78.4, 77.0, 77.9),
    ]),
    correctActions: ["hold", "buy"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Backwardation is a structure to name, not an automatic buy. Ask whether your time frame cares about the roll.",
      whyMarketMoved: "The weak tape bounced a little into roll chatter.",
      evidence: "CL-style tape plus a backwardation brief.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "intermediate",
    assetClass: "future",
  },
  {
    id: "case-fut-int-nq-print",
    title: "Growth index futures after a soft print",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "This SAMPLE Nasdaq-style future was sliding. Growth data comes in soft, not a collapse. Soft-landing talk returns. Decide with the print and the already-weak tape.",
    newsHeadline: "Growth data soft, not collapsing. Soft-landing talk returns.",
    preOhlc: NQ_PRE,
    postOhlc: withAftermath(NQ_PRE, [
      bar("+1", 17680, 17840, 17650, 17800),
      bar("+2", 17800, 17920, 17760, 17880),
      bar("+3", 17880, 18000, 17820, 17940),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A soft print can reprice growth index futures that already sold off. Intermediate work is asking whether the slide already baked the print in.",
      whyMarketMoved: "The slide reversed as rate-cut hopes returned.",
      evidence: "Weak NQ-style tape plus a soft growth print.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "intermediate",
    assetClass: "future",
  },
  {
    id: "case-fut-ng-storage-note",
    title: "Nat-gas coiled, then a storage-operator note",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE natural-gas future has coiled. A named storage operator posts a surprise-build note. That is a company-style headline on a futures tape, not a CPI print. Practice data only. Buy, sell, or hold before the next session.",
    newsHeadline:
      "SAMPLE storage operator: unexpected injection / inventory build. Not a live EIA print.",
    preOhlc: NG_PRE,
    postOhlc: withAftermath(NG_PRE, [
      bar("+1", 3.16, 3.18, 2.98, 3.02),
      bar("+2", 3.02, 3.06, 2.92, 2.96),
      bar("+3", 2.96, 3.0, 2.88, 2.91),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A named operator note is a headline, not a scheduled macro print. Extra gas in storage usually weighs on this contract. Hold if you already sized for more slide. Do not chase the coil as a breakout.",
      whyMarketMoved: "The coil broke lower after the build note.",
      evidence: "Nat-gas coil tape plus a SAMPLE storage-operator headline.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-hg-print-headline",
    title: "Copper stocks print a draw, then a cancel headline",
    contextType: "combined",
    thinkingMode: "combined_earnings_headline",
    brief:
      "This SAMPLE copper future grinded, then stalled. The official warehouse-stock print shows a draw. Same window: a large consumer cancels forward orders. The print is the past. The headline is the path. Practice data only — not a live warehouse tape, not an income statement.",
    newsHeadline:
      "Warehouse print: stocks drawn. Same window: large consumer cancels forward orders.",
    preOhlc: HG_PRE,
    postOhlc: withAftermath(HG_PRE, [
      bar("+1", 4.19, 4.21, 4.08, 4.1),
      bar("+2", 4.1, 4.13, 4.04, 4.06),
      bar("+3", 4.06, 4.09, 4.01, 4.03),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    partialOnHorizonMismatch: true,
    debrief: {
      process:
        "Match the official print to the headline. A bullish stock draw can still fail if the cancel resets demand. Hold is fair if you sized for a longer tightness story and the print still holds. Do not map this to an income statement.",
      whyMarketMoved: "The stall broke lower as the cancel outweighed the draw.",
      evidence: "Copper grind-stall tape plus warehouse-print vs cancel-headline copy.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-zw-rumor-note",
    title: "Wheat dump on an export-ban rumor, then an official note",
    contextType: "combined",
    thinkingMode: "combined_rumor_filing",
    brief:
      "This SAMPLE wheat future already air-pocketed on chat that a major exporter banned shipments. Minutes later a scheduled official note says shipments are still moving. Chat volume vs the note. Practice data only — not a live crop desk.",
    newsHeadline:
      "Official note: shipments still moving. Denies an export-ban rumor.",
    preOhlc: ZW_PRE,
    postOhlc: withAftermath(ZW_PRE, [
      bar("+1", 592, 618, 590, 614),
      bar("+2", 614, 624, 608, 620),
      bar("+3", 620, 628, 614, 622),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    partialOnHorizonMismatch: true,
    debrief: {
      process:
        "Separate rumor volume from what the official note actually says. Panic-selling a bounded export-ban claim is often a mistake if shipments are still moving. Hold is fair if you wait for the dump to prove it. This is not a weather-demand scare and not an income statement.",
      whyMarketMoved: "The contract reclaimed once the note bounded the scare.",
      evidence: "Wheat air-pocket tape plus rumor vs a scheduled official note.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-int-si-miner-note",
    title: "Silver already ran, then a miner restores output",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE silver future already ran on tightness talk. You have Indicators. A named miner posts that production is restored. That is a company-style headline on a futures tape, not a CPI print and not the storage-build note. Practice data only.",
    newsHeadline:
      "SAMPLE miner: production restored. Tightness talk already in the run.",
    preOhlc: SI_PRE,
    postOhlc: withAftermath(SI_PRE, [
      bar("+1", 31.7, 31.85, 30.2, 30.4),
      bar("+2", 30.4, 30.7, 29.8, 30.0),
      bar("+3", 30.0, 30.3, 29.5, 29.7),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Intermediate work is naming what is already in the run. A named miner restoring output is a headline that removes the scarcity you already paid for. Hold if you sized for more tightness. Do not treat this as a scheduled macro print.",
      whyMarketMoved: "Late buyers exited when the miner note added supply.",
      evidence: "Extended silver tape plus a named-miner production headline.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "intermediate",
    assetClass: "future",
  },
  {
    id: "case-fut-int-rty-risk-off",
    title: "Small-cap futures bounce into a risk-off tape",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE small-cap index future already bounced off a dump. You have Indicators. A risk-off headline hits the whole risk complex. Is a two-session bounce a new regime, or just a relief squeeze? Practice data only.",
    newsHeadline: "Risk-off. Small-cap index futures sold with growth names.",
    preOhlc: RTY_PRE,
    postOhlc: withAftermath(RTY_PRE, [
      bar("+1", 1996, 2004, 1948, 1956),
      bar("+2", 1956, 1970, 1932, 1940),
      bar("+3", 1940, 1952, 1918, 1926),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Intermediate work is naming the bounce: relief is not a new risk-on regime. When the whole complex sells, you are deciding market risk, not a warehouse note. Hold if you sized for more dump. This is not the already-weak Nasdaq beginner tape.",
      whyMarketMoved: "The relief bounce failed as risk-off returned.",
      evidence: "Small-cap bounce tape plus a market-wide risk-off headline.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "intermediate",
    assetClass: "future",
  },
  {
    id: "case-fut-int-zs-harvest",
    title: "Soy already dumped into a harvest-outage scare",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "This SAMPLE soybean future already dumped. You have Indicators. A harvest-outage scare hits a competing growing region. Name which side this contract is on: remaining supply, not a demand scare. Practice data only — not a live crop desk.",
    newsHeadline:
      "Harvest-outage scare in a competing region. Remaining-supply beans in focus.",
    preOhlc: ZS_PRE,
    postOhlc: withAftermath(ZS_PRE, [
      bar("+1", 1174, 1228, 1168, 1218),
      bar("+2", 1218, 1244, 1208, 1236),
      bar("+3", 1236, 1258, 1226, 1248),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Supply geopolitics is naming the side. Intermediate work is seeing already-dumped remaining supply, not the corn demand-scare beginner tape. A harvest outage elsewhere can bid this contract. Hold if the dump already has your size. This is not an export-ban rumor.",
      whyMarketMoved: "The dump reversed as remaining-supply beans caught a scarcity bid.",
      evidence: "Already-weak soy tape plus a harvest-outage headline naming the side.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "intermediate",
    assetClass: "future",
  },
  {
    id: "case-fut-int-ho-print-headline",
    title: "Heating-oil stocks print a draw, then a warm-weather headline",
    contextType: "combined",
    thinkingMode: "combined_earnings_headline",
    brief:
      "This SAMPLE heating-oil future already dumped. You have Indicators. The official inventory print shows a draw. Same window: a warm-weather headline cuts heating demand. The print is the past. The headline is the path. Practice data only — not a live EIA tape, not an income statement.",
    newsHeadline:
      "Inventory print: stocks drawn. Same window: warm-weather demand cut.",
    preOhlc: HO_PRE,
    postOhlc: withAftermath(HO_PRE, [
      bar("+1", 2.24, 2.28, 2.1, 2.12),
      bar("+2", 2.12, 2.16, 2.04, 2.06),
      bar("+3", 2.06, 2.1, 1.98, 2.0),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    partialOnHorizonMismatch: true,
    debrief: {
      process:
        "Match the official print to the headline. Intermediate work is seeing that a bullish draw can still fail if weather resets demand, and the dump may already have the draw in. Hold is fair if you sized for a longer tightness story and the print still holds. This is not the beginner copper warehouse tape.",
      whyMarketMoved: "The dump continued as the warm-weather headline outweighed the draw.",
      evidence: "Already-weak heating-oil tape plus inventory-print vs weather-headline copy.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "intermediate",
    assetClass: "future",
  },
  {
    id: "case-fut-int-pl-rumor-note",
    title: "Platinum ran on a delivery-default rumor, then an official note",
    contextType: "combined",
    thinkingMode: "combined_rumor_filing",
    brief:
      "This SAMPLE platinum future already ran on chat that a vault missed a delivery. You have Indicators. Minutes later a scheduled exchange note says vault operations are normal. Chat volume vs the note. Practice data only — not a live metals desk.",
    newsHeadline:
      "Official note: vault operations normal. Denies a delivery-default rumor.",
    preOhlc: PL_PRE,
    postOhlc: withAftermath(PL_PRE, [
      bar("+1", 1014, 1020, 978, 984),
      bar("+2", 984, 994, 968, 974),
      bar("+3", 974, 984, 958, 964),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    partialOnHorizonMismatch: true,
    debrief: {
      process:
        "Separate rumor volume from what the official note actually says. Intermediate work is naming what is already in the run: chat is not a default. Hold is fair if you wait for the dump to prove it. This is not the beginner wheat export-ban reclaim tape.",
      whyMarketMoved: "The run faded once the note bounded the scare.",
      evidence: "Platinum impulse tape plus rumor vs a scheduled official note.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "intermediate",
    assetClass: "future",
  },
  {
    id: "case-fut-kc-fail-break",
    title: "Coffee futures poke a range, then fail",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE coffee future poked above a range, then slipped back. Crop-board chatter is thin. Chase the first green poke, wait, or take risk off? Practice data only — not a live coffee desk.",
    newsHeadline:
      "Thin chatter: range break must hold. Crop board quiet.",
    preOhlc: KC_PRE,
    postOhlc: withAftermath(KC_PRE, [
      bar("+1", 249.8, 250.4, 245.2, 245.8),
      bar("+2", 245.8, 246.6, 242.8, 243.4),
      bar("+3", 243.4, 244.2, 240.6, 241.2),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A failed poke is usually fade-or-wait, not a chase. Do not treat the first green bar as a breakout. HOLD if the slip already has your size. This is not a live coffee contract and not the gold grind.",
      whyMarketMoved: "The poke failed and the contract slipped back through the range.",
      evidence: "Coffee failed-breakout tape plus thin crop-board chatter.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-ct-round-top",
    title: "Cotton futures round over after a mill offtake note",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE cotton future already made a high, then a lower high. An official mill note says weekly offtake beat the plan. Named author, not chatter. Practice data only — not a live cotton desk. Chase the last high, wait, or take risk off?",
    newsHeadline:
      "Official mill note: weekly offtake beat the plan.",
    preOhlc: CT_PRE,
    postOhlc: withAftermath(CT_PRE, [
      bar("+1", 71.6, 71.9, 70.2, 70.6),
      bar("+2", 70.6, 71.0, 69.4, 69.8),
      bar("+3", 69.8, 70.2, 68.6, 69.0),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A named offtake beat can already be in a round-top. Do not chase the last high just because the note is official. HOLD if the slip already has your size. This is not a live cotton contract and not the coffee fail-break tape.",
      whyMarketMoved: "The lower-high structure continued lower after the mill note.",
      evidence: "Cotton round-top tape plus an official mill offtake headline.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-sb-staircase",
    title: "Sugar futures step higher on a port-strike scare",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "This SAMPLE sugar future has been stepping up, one higher close after another. A port-strike scare hits an export terminal. Name which side this contract is on: the export crop, not the importer. Practice data only — not a live sugar desk.",
    newsHeadline:
      "Port-strike scare at an export terminal. Sugar in the brief.",
    preOhlc: SB_PRE,
    postOhlc: withAftermath(SB_PRE, [
      bar("+1", 22.04, 22.22, 21.98, 22.16),
      bar("+2", 22.16, 22.32, 22.1, 22.26),
      bar("+3", 22.26, 22.4, 22.18, 22.34),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Supply geopolitics is naming the side. This contract is the export crop, so a port freeze can keep bidding it. Do not fade the stairs just because they already moved. HOLD if the stairs already have your size. This is not a live sugar contract and not the cotton round-top tape.",
      whyMarketMoved: "The staircase continued as the export crop bid the port scare.",
      evidence: "Sugar staircase tape plus an exporter-side port-strike headline.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-cc-expand-range",
    title: "Cocoa futures range is getting wider, not cleaner",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE cocoa future is swinging larger both ways. A risk-off headline is out, but crop chatter is mixed and the tape has not picked a side. Do you force a trade, or wait? Practice data only — not a live cocoa desk.",
    newsHeadline:
      "Risk-off tone. Crop chatter mixed. Tape is two-way.",
    preOhlc: CC_PRE,
    postOhlc: withAftermath(CC_PRE, [
      bar("+1", 3970, 4180, 3920, 4150),
      bar("+2", 4150, 4200, 3960, 3990),
      bar("+3", 3990, 4140, 3940, 3980),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["sell", "buy"],
    debrief: {
      process:
        "An expanding range is noise until a side holds. HOLD is the process answer. BUY or SELL is only partial if you already had a crop thesis and sized small. This is not a live cocoa contract and not the sugar staircase tape.",
      whyMarketMoved: "The two-way swings continued; no clean risk-off one-way tape.",
      evidence: "Expanding cocoa range plus a mixed risk-off headline.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-le-open-drive",
    title: "Live-cattle futures open with a wide drive after a packer note",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE live-cattle future coiled overnight. An official packer note says weekly slaughter beat the plan. Named author, not chatter. The next session opens with a wide drive. Practice data only — not a live livestock desk. Fade the first wide bar, wait, or follow it?",
    newsHeadline:
      "Official packer note: weekly slaughter beat the plan. Opening drive.",
    preOhlc: LE_PRE,
    postOhlc: withAftermath(LE_PRE, [
      bar("+1", 171.2, 172.4, 171.0, 172.1),
      bar("+2", 172.1, 173.0, 171.8, 172.7),
      bar("+3", 172.7, 173.6, 172.4, 173.2),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A first wide bar after a named packer beat is a time-frame question, not an automatic fade. Do not fade it just because it looks extended. HOLD if the drive already has your size. This is not a live cattle contract and not the cocoa expanding-range tape.",
      whyMarketMoved: "The opening drive continued as the packer note stayed in the tape.",
      evidence: "Quiet overnight cattle coil plus an official packer note and a wide opening drive.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-zn-double-bottom",
    title: "Ten-year note futures test the same low twice after a jobs scare",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "This SAMPLE 10-year note future dumped, bounced, then tested the same low again. The jobs scare was later walked back. Practice data only — not a live rates desk. Buy the second low, wait, or take risk off?",
    newsHeadline:
      "Jobs scare walked back. Second low held on the note.",
    preOhlc: ZN_PRE,
    postOhlc: withAftermath(ZN_PRE, [
      bar("+1", 111.18, 111.42, 111.14, 111.36),
      bar("+2", 111.36, 111.52, 111.3, 111.46),
      bar("+3", 111.46, 111.6, 111.4, 111.54),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A second low that holds after a walked-back jobs scare is a reclaim story, not a new dump. HOLD if the bounce already has your size. This is not a live Treasury contract and not the cattle opening-drive tape.",
      whyMarketMoved: "The second low held and the note reclaimed after the scare was walked back.",
      evidence: "Ten-year double-bottom tape plus a walked-back jobs scare.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-he-outside-bar",
    title: "Lean-hog futures print an outside bar that closes weak",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE lean-hog future printed a wide bar that took both sides, then closed weak. Packer chatter is thin. Practice data only — not a live livestock desk. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Outside bar on lean hogs. Thin packer chatter.",
    preOhlc: HE_PRE,
    postOhlc: withAftermath(HE_PRE, [
      bar("+1", 97.4, 97.8, 96.4, 96.8),
      bar("+2", 96.8, 97.2, 96.0, 96.4),
      bar("+3", 96.4, 96.8, 95.6, 96.0),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "An outside bar that closes weak is usually fade-or-wait, not a chase of the upper wick. HOLD if the slip already has your size. This is not a live hog contract and not the 10-year double-bottom tape.",
      whyMarketMoved: "The weak close continued lower.",
      evidence: "Lean-hog outside-bar tape plus thin packer chatter.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-ym-doji-hold",
    title: "Dow futures print a doji on mixed risk-off chatter",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE Dow index future printed a doji: open and close almost the same, wicks both ways. A risk-off headline is out, but the tape has not picked a side. Practice data only — not a live index desk. Do you force a trade, or wait?",
    newsHeadline:
      "Risk-off tone. Doji on the Dow. Tape is two-way.",
    preOhlc: YM_PRE,
    postOhlc: withAftermath(YM_PRE, [
      bar("+1", 39228, 39290, 39160, 39190),
      bar("+2", 39190, 39250, 39140, 39220),
      bar("+3", 39220, 39280, 39150, 39180),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["sell", "buy"],
    debrief: {
      process:
        "A doji on mixed risk-off chatter is indecision. HOLD is the process answer until a side holds. BUY or SELL is only partial if you already had a thesis and sized small. This is not a live Dow contract and not the lean-hog outside-bar tape.",
      whyMarketMoved: "The tape stayed two-way after the doji; no clean risk-off one-way move.",
      evidence: "Dow doji tape plus a mixed risk-off headline.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-rb-dump-no-reclaim",
    title: "Gasoline futures dump on a demand scare, no reclaim",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "This SAMPLE gasoline future already dumped. A driving-season demand scare hits. Name which side this contract is on: the refined product, not crude. The bounce has not shown up. Practice data only — not a live energy desk.",
    newsHeadline:
      "Driving-season demand scare. Gasoline in the brief, not crude.",
    preOhlc: RB_PRE,
    postOhlc: withAftermath(RB_PRE, [
      bar("+1", 1.69, 1.71, 1.64, 1.65),
      bar("+2", 1.65, 1.67, 1.6, 1.61),
      bar("+3", 1.61, 1.63, 1.56, 1.57),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Supply geopolitics is naming the side. This contract is the refined product, so a demand scare can keep pressure on. A dump with no reclaim is usually fade-or-wait, not a buy of the first red bar. HOLD if the dump already has your size. This is not a live gasoline contract and not the Dow doji tape.",
      whyMarketMoved: "The dump continued; no bounce showed up after the demand scare.",
      evidence: "RBOB dump-no-reclaim tape plus a product-side demand headline.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-lb-inside-bar",
    title: "Lumber prints an inside bar into a mill note",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE lumber contract printed a wide bar, then a smaller bar fully inside that range. A mill-curtailment note is still ahead. Thin chatter says the inside must break up. Practice data only — not a live lumber desk. Chase a break that has not printed, or wait?",
    newsHeadline:
      "Inside bar on lumber. Mill-curtailment note still ahead. Thin chatter: must break up.",
    preOhlc: LB_PRE,
    postOhlc: withAftermath(LB_PRE, [
      bar("+1", 514, 520, 508, 512),
      bar("+2", 512, 518, 506, 516),
      bar("+3", 516, 522, 510, 514),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["buy", "sell"],
    debrief: {
      process:
        "An inside bar into a mill note is a wait. HOLD is the process answer until a side actually breaks. BUY or SELL is only partial if you already had a thesis and sized small. This is not a live lumber contract and not the RBOB dump-no-reclaim tape.",
      whyMarketMoved: "The inside range held; no clean break through the mill-note window.",
      evidence: "Lumber inside-bar tape plus a mill-note-still-ahead headline.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-int-oj-flag",
    title: "Orange juice flags after a freeze scare already in the price",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE orange-juice future already ran on a freeze scare, then coiled in a tight flag. You have Indicators. Thin chatter says the flag must break higher. Ask whether the freeze is already in the impulse, or whether a second leg is still unpaid. Practice data only — not a live citrus desk.",
    newsHeadline:
      "Freeze scare already ran. Tight flag. Thin chatter: must break up.",
    preOhlc: OJ_PRE,
    postOhlc: withAftermath(OJ_PRE, [
      bar("+1", 199, 201, 192, 194),
      bar("+2", 194, 196, 188, 190),
      bar("+3", 190, 192, 184, 186),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Intermediate work is naming what is already in the price. An impulse-and-flag after a freeze scare is often late-chase, not a new path. Fade or wait; HOLD if the slip already has your size. This is not a live citrus contract, not the gold calm-print fade, and not the lumber inside-bar wait.",
      whyMarketMoved: "The flag broke down once the freeze-scare chase stalled.",
      evidence: "Orange-juice impulse-and-flag tape plus a freeze-already-ran headline.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "intermediate",
    assetClass: "future",
  },
  {
    id: "case-fut-int-pa-wedge",
    title: "Palladium rising wedge after a catalyst scare already in the price",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE palladium future has been making higher highs in a tightening wedge after an auto-catalyst supply scare. You have Indicators. Thin chatter says the squeeze must keep rising. Ask whether the scare is already in the highs. Practice data only — not a live PGM desk.",
    newsHeadline:
      "Catalyst scare already ran. Rising wedge. Thin chatter: squeeze must keep rising.",
    preOhlc: PA_PRE,
    postOhlc: withAftermath(PA_PRE, [
      bar("+1", 1536, 1540, 1512, 1516),
      bar("+2", 1516, 1520, 1494, 1498),
      bar("+3", 1498, 1502, 1478, 1482),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A rising wedge after a scare already in the highs is often late-chase, not a new path. Intermediate work is fading or waiting. HOLD if the slip already has your size. This is not a live palladium contract, not the orange-juice flag, and not a 10-Q.",
      whyMarketMoved: "The wedge broke down once the catalyst-scare chase stalled.",
      evidence: "Palladium rising-wedge tape plus a scare-already-ran headline.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "intermediate",
    assetClass: "future",
  },
  {
    id: "case-fut-int-dx-vreclaim",
    title: "Dollar-index futures V-reclaim after a walked-back risk-off scare",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE dollar-index future already dumped on a risk-off scare, then printed a second low that held. You have Indicators. The scare is walked back. Is the V a new dump, or a reclaim? Practice data only — not a live FX index desk.",
    newsHeadline:
      "Risk-off scare walked back. Dollar-index second low held.",
    preOhlc: DX_PRE,
    postOhlc: withAftermath(DX_PRE, [
      bar("+1", 105.12, 105.4, 105.08, 105.32),
      bar("+2", 105.32, 105.56, 105.26, 105.48),
      bar("+3", 105.48, 105.68, 105.4, 105.6),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Intermediate work is naming the V: a second low that holds after a walked-back scare is a reclaim, not a new dump. HOLD if the bounce already has your size. This is not the small-cap bounce that failed into more risk-off, not the palladium wedge, and not a 10-Q.",
      whyMarketMoved: "The second low held and the dollar index reclaimed after the scare was walked back.",
      evidence: "Dollar-index V-reclaim tape plus a walked-back risk-off headline.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "intermediate",
    assetClass: "future",
  },
  {
    id: "case-fut-int-zl-round",
    title: "Soybean-oil futures round over after a crush scare already in the highs",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE soybean-oil future already ran on a crush-capacity scare, then printed a lower high. You have Indicators. Thin chatter says the scare must keep the highs. Ask whether the scare is already in the round-top. Practice data only — not a live crush desk.",
    newsHeadline:
      "Crush scare already ran. Lower high on soybean oil. Thin chatter: highs must hold.",
    preOhlc: ZL_PRE,
    postOhlc: withAftermath(ZL_PRE, [
      bar("+1", 49.2, 49.6, 47.4, 47.8),
      bar("+2", 47.8, 48.2, 46.2, 46.6),
      bar("+3", 46.6, 47.0, 45.2, 45.6),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Intermediate work is naming what is already in the price. A round-top after a crush scare is often late-chase, not a new path. Fade or wait; HOLD if the slip already has your size. This is not the beginner cotton mill round-top, not the orange-juice flag, and not a 10-Q.",
      whyMarketMoved: "The lower-high structure continued lower once the crush-scare chase stalled.",
      evidence: "Soybean-oil round-top tape plus a scare-already-ran headline.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "intermediate",
    assetClass: "future",
  },
  {
    id: "case-fut-zm-double-top",
    title: "Soymeal tags the same high twice into chase chatter",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE soymeal future tagged nearly the same high twice and failed to break it. Thin chatter says the second tag must continue higher. Practice data only — not a live crush desk. Chase or wait?",
    newsHeadline:
      "Thin chatter: second soymeal tag must break higher. Highs are already equal.",
    preOhlc: ZM_PRE,
    postOhlc: withAftermath(ZM_PRE, [
      bar("+1", 352, 354, 344, 346),
      bar("+2", 346, 348, 338, 340),
      bar("+3", 340, 342, 332, 334),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Two equal highs that fail are late-chase, not a new path. Fade or wait; HOLD if you will not fade a SAMPLE meal contract. This is not the soybean-oil round-top, not the rates double-bottom, and not a live crush desk.",
      whyMarketMoved: "The second high failed and soymeal leaked lower.",
      evidence: "Soymeal double-top tape plus weak-source chase chatter.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-int-zo-three-push",
    title: "Oats three-push into a drought scare already in the highs",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE oats future already printed three successive pushes into the same high on a drought scare. You have Indicators. Thin chatter says the third push must break. Ask whether the scare is already in the three legs. Practice data only — not a live grain desk.",
    newsHeadline:
      "Drought scare already ran. Third oats push into the same high. Thin chatter: must break.",
    preOhlc: ZO_PRE,
    postOhlc: withAftermath(ZO_PRE, [
      bar("+1", 3.64, 3.66, 3.48, 3.5),
      bar("+2", 3.5, 3.52, 3.36, 3.38),
      bar("+3", 3.38, 3.4, 3.24, 3.26),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Intermediate work is naming what is already in the price. Three pushes into a drought scare are often late-chase, not a new path. Fade or wait; HOLD if the slip already has your size. This is not the beginner sugar staircase, not the soymeal double-top, and not a live oats contract.",
      whyMarketMoved: "The third push failed and oats leaked lower once the drought-scare chase stalled.",
      evidence: "Oats three-push tape plus a scare-already-ran headline.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "intermediate",
    assetClass: "future",
  },
  {
    id: "case-fut-zr-falling-wedge",
    title: "Rough rice falling wedge after a flood scare already in the tape",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "This SAMPLE rough-rice future coiled into a falling wedge after a flood-supply scare. A scheduled acreage note then says flooded acres were smaller than the scare. Name which side rice is on, then ask whether the scare is already in the wedge. Practice data only — not a live mill desk.",
    newsHeadline:
      "Acreage note: flooded rice acres smaller than the scare. Falling wedge still coiled.",
    preOhlc: ZR_PRE,
    postOhlc: withAftermath(ZR_PRE, [
      bar("+1", 18.38, 18.72, 18.36, 18.66),
      bar("+2", 18.66, 18.88, 18.6, 18.8),
      bar("+3", 18.8, 18.98, 18.74, 18.92),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A falling wedge after a flood scare that an official acreage note already bounded is often a wait-for-break, not a new shortage. Rice is on the supply-scare side; a smaller flood is less tight. HOLD if you will not buy a SAMPLE mill contract. This is not the palladium rising wedge, not the oats three-push, and not a live rice desk.",
      whyMarketMoved: "The wedge broke higher once the smaller-flood acreage note bounded the scare.",
      evidence: "Rough-rice falling-wedge tape plus a smaller-flood acreage note.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
];

export const FOREX_CASES: CaseStudy[] = [
  {
    id: "case-fx-risk-on",
    title: "EUR/USD firm while risk appetite is positive",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "EUR/USD has been firm while risk appetite is positive. Practice only, not a live FX desk.",
    newsHeadline: "Risk-on tone. Euro bid versus the dollar.",
    preOhlc: EUR_PRE,
    postOhlc: withAftermath(EUR_PRE, [
      bar("+1", 1.091, 1.096, 1.09, 1.094),
      bar("+2", 1.094, 1.098, 1.092, 1.096),
      bar("+3", 1.096, 1.099, 1.093, 1.097),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Ask whether the risk-on tone is new, or already in the grind. Your time frame still rules.",
      whyMarketMoved: "The pair kept grinding with a risk-on brief.",
      evidence: "Firm chart plus a risk-on headline. Practice only.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-data-print",
    title: "USD/JPY into a U.S. data print",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "USD/JPY is elevated going into a U.S. data print. Decide before you see the reaction.",
    newsHeadline: "Hot data print risk. Focus on the dollar.",
    preOhlc: JPY_PRE,
    postOhlc: withAftermath(JPY_PRE, [
      bar("+1", 148.1, 149.8, 147.9, 149.4),
      bar("+2", 149.4, 150.2, 149.0, 149.8),
      bar("+3", 149.8, 150.4, 149.2, 149.9),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Size for surprise into data. If the dollar strengthens on hot data, the yen often weakens, so this pair can rise.",
      whyMarketMoved: "The dollar bid after a hot print.",
      evidence: "Elevated chart plus a data-risk brief.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-fade-spike",
    title: "Euro spikes on a thin rumor",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "EUR/USD spikes on a thin rumor. The source looks weak. Decide before you see whether it fades.",
    newsHeadline: "Unconfirmed chatter. Euro spikes. Source quality is low.",
    preOhlc: EUR_PRE,
    postOhlc: withAftermath(EUR_PRE, [
      bar("+1", 1.091, 1.098, 1.088, 1.089),
      bar("+2", 1.089, 1.091, 1.085, 1.086),
      bar("+3", 1.086, 1.088, 1.083, 1.084),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Low-quality spikes invite waiting or fading, not chasing. Check the source first.",
      whyMarketMoved: "The spike faded after the rumor.",
      evidence: "Weak source plus a spike on the chart.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-aud-risk-on",
    title: "AUD/USD firm in a risk-on brief",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "AUD/USD has been grinding higher while risk appetite is positive. Practice only, not a live FX desk.",
    newsHeadline: "Risk-on tone. Aussie bid versus the dollar.",
    preOhlc: AUD_PRE,
    postOhlc: withAftermath(AUD_PRE, [
      bar("+1", 0.668, 0.672, 0.667, 0.67),
      bar("+2", 0.67, 0.674, 0.669, 0.672),
      bar("+3", 0.672, 0.675, 0.67, 0.673),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Ask whether the risk-on tone is new. Hold if the grind already has your size.",
      whyMarketMoved: "The pair kept grinding with a risk-on brief.",
      evidence: "Firm AUD tape plus a risk-on headline. Practice only.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-gbp-print",
    title: "GBP/USD into a UK data print",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "GBP/USD was already sliding into a UK data print. The print comes in soft. Decide before you see the next bars.",
    newsHeadline: "UK data softer than hoped. Sterling in focus.",
    preOhlc: GBP_PRE,
    postOhlc: withAftermath(GBP_PRE, [
      bar("+1", 1.256, 1.258, 1.248, 1.25),
      bar("+2", 1.25, 1.253, 1.244, 1.247),
      bar("+3", 1.247, 1.25, 1.242, 1.245),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Soft home data on an already-weak sterling tape is usually not a buy. Hold if you sized for more slide.",
      whyMarketMoved: "Sterling kept sliding after the soft print.",
      evidence: "Weak GBP tape plus a UK data brief.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-eurjpy-chase",
    title: "EUR/JPY already ran on thin chatter",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "EUR/JPY already ran. The headline is thin cross-market chatter. Decide whether to chase or wait.",
    newsHeadline: "Thin cross-market chatter. EUR/JPY already extended.",
    preOhlc: EURJPY_PRE,
    postOhlc: withAftermath(EURJPY_PRE, [
      bar("+1", 161.4, 161.8, 160.2, 160.6),
      bar("+2", 160.6, 161.0, 159.6, 160.0),
      bar("+3", 160.0, 160.4, 159.2, 159.6),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Thin chatter after a run is fade-or-wait. Do not treat a cross spike as a new fact.",
      whyMarketMoved: "The run faded when the chatter stayed thin.",
      evidence: "Extended EUR/JPY tape plus a weak-source headline.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-usd-jpy-risk-off",
    title: "USD/JPY sold as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "USD/JPY was elevated. Risk appetite fades. Some traders buy yen in a scare. Practice framing only.",
    newsHeadline: "Risk-off. Yen bid as a scare currency in this SAMPLE brief.",
    preOhlc: JPY_PRE,
    postOhlc: withAftermath(JPY_PRE, [
      bar("+1", 147.6, 147.9, 146.2, 146.6),
      bar("+2", 146.6, 147.0, 145.6, 146.0),
      bar("+3", 146.0, 146.4, 145.2, 145.6),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off yen bid can pull this pair down. That is a market-mood decision, not a company filing.",
      whyMarketMoved: "The elevated pair sold as yen caught a bid.",
      evidence: "Elevated USD/JPY tape plus a risk-off brief.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-eur-supply-energy",
    title: "EUR/USD wobbles on an energy-supply scare",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "EUR/USD had been firm. An energy-supply scare hits European cost talk. Decide before the next bars.",
    newsHeadline: "Energy-supply scare. European cost talk. Euro in focus.",
    preOhlc: EUR_PRE,
    postOhlc: withAftermath(EUR_PRE, [
      bar("+1", 1.088, 1.09, 1.082, 1.084),
      bar("+2", 1.084, 1.086, 1.079, 1.081),
      bar("+3", 1.081, 1.083, 1.077, 1.079),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A supply scare that raises European costs can hit the euro. Name the channel before you buy a dip.",
      whyMarketMoved: "The firm euro tape faded with the cost scare.",
      evidence: "Firm EUR tape plus an energy-supply headline.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-int-aud-print",
    title: "AUD/USD after a hot US print",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "AUD/USD had been grinding. A hot US data print lands. The dollar often firms. You have Indicators. How do you treat the carry pair?",
    newsHeadline: "Hot US print. Dollar firm. Aussie in focus.",
    preOhlc: AUD_PRE,
    postOhlc: withAftermath(AUD_PRE, [
      bar("+1", 0.665, 0.666, 0.658, 0.66),
      bar("+2", 0.66, 0.662, 0.655, 0.657),
      bar("+3", 0.657, 0.659, 0.653, 0.655),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A hot US print can reprice dollar pairs even if the Aussie story is unchanged. Intermediate work is naming whose data moved.",
      whyMarketMoved: "The grind reversed as the dollar firmed.",
      evidence: "AUD grind plus a US data-print brief.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "intermediate",
    assetClass: "forex",
  },
  {
    id: "case-fx-int-gbp-fade",
    title: "Sterling spike on a thin budget rumor",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "GBP/USD spikes on a thin budget rumor. Source quality is low. The pair had been sliding. Chase the spike, or wait?",
    newsHeadline: "Unconfirmed budget chatter. Sterling spikes. Source is weak.",
    preOhlc: GBP_PRE,
    postOhlc: withAftermath(GBP_PRE, [
      bar("+1", 1.268, 1.276, 1.257, 1.259),
      bar("+2", 1.259, 1.262, 1.252, 1.254),
      bar("+3", 1.254, 1.257, 1.248, 1.25),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Low-quality spikes on a sliding pair invite waiting or fading. Check the source before you treat it as a new path.",
      whyMarketMoved: "The spike faded after the rumor.",
      evidence: "Weak GBP tape plus a thin budget rumor.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "intermediate",
    assetClass: "forex",
  },
  {
    id: "case-fx-int-eurjpy-risk",
    title: "EUR/JPY as a risk-on cross after a scare",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "EUR/JPY had already run, then a scare hit. The scare is later walked back. Crosses like this often track risk appetite. Decide after the walk-back, not the first scare bar.",
    newsHeadline: "Scare later walked back. Risk appetite steadies.",
    preOhlc: EURJPY_PRE,
    postOhlc: withAftermath(EURJPY_PRE, [
      bar("+1", 162.4, 163.6, 162.0, 163.2),
      bar("+2", 163.2, 164.0, 162.8, 163.6),
      bar("+3", 163.6, 164.4, 163.0, 163.9),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "If the scare is walked back, ask whether the cross thesis broke or just flushed. Intermediate work is waiting for the walk-back, not buying the first red bar.",
      whyMarketMoved: "The cross reclaimed after the scare was walked back.",
      evidence: "EUR/JPY tape plus a walked-back scare headline.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "intermediate",
    assetClass: "forex",
  },
  {
    id: "case-fx-cad-headline",
    title: "USD/CAD after an official bank statement",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "USD/CAD has been stuck in a choppy range. Then the home central bank publishes a prepared statement: it will stay restrictive for longer. This is an official note, not a rumor and not a data print. Practice only, not a live FX desk.",
    newsHeadline:
      "Prepared statement: restrictive for longer. Official text, not chatter.",
    preOhlc: CAD_PRE,
    postOhlc: withAftermath(CAD_PRE, [
      bar("+1", 1.36, 1.361, 1.352, 1.354),
      bar("+2", 1.354, 1.356, 1.348, 1.35),
      bar("+3", 1.35, 1.353, 1.346, 1.348),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Treat an official statement as a headline with a named author. Map it to whose currency it is. A hawkish hold can bid the Canadian dollar, so this pair can fall. HOLD is fine if the range already has your size.",
      whyMarketMoved: "The range broke lower as the Canadian dollar caught a bid.",
      evidence: "Choppy USD/CAD tape plus a prepared-statement headline. Practice only.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-nzd-print-headline",
    title: "Kiwi print beats, dairy headline cuts",
    contextType: "combined",
    thinkingMode: "combined_earnings_headline",
    brief:
      "NZD/USD just reclaimed and stalled. The official trade-balance print is stronger than hoped. The same window’s headline is a large dairy buyer cutting orders. The print is the past. The headline is the path. Practice only, not a live FX desk.",
    newsHeadline:
      "Trade balance beats. Large dairy buyer cuts forward orders.",
    preOhlc: NZD_PRE,
    postOhlc: withAftermath(NZD_PRE, [
      bar("+1", 0.603, 0.604, 0.596, 0.597),
      bar("+2", 0.597, 0.599, 0.592, 0.594),
      bar("+3", 0.594, 0.596, 0.589, 0.591),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    partialOnHorizonMismatch: true,
    debrief: {
      process:
        "A beat can still fail a short-term thesis if the headline resets demand. HOLD is fair if you sized for a longer kiwi story and the print still holds. Do not use an income statement here — map print vs headline on the pair.",
      whyMarketMoved: "The stall broke lower as the dairy cut outweighed the beat.",
      evidence: "Official trade print plus a dairy-order headline on a stalled NZD tape.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-chf-rumor-note",
    title: "Intervention rumor, then an official note",
    contextType: "combined",
    thinkingMode: "combined_rumor_filing",
    brief:
      "USD/CHF already air-pocketed on chat that the Swiss bank will intervene. Minutes later a scheduled official note says it was a routine liquidity operation, not an intervention. Chat volume vs the note. Practice only, not a live FX desk.",
    newsHeadline:
      "Official note: routine liquidity operation. Denies an intervention rumor.",
    preOhlc: CHF_PRE,
    postOhlc: withAftermath(CHF_PRE, [
      bar("+1", 0.874, 0.882, 0.873, 0.88),
      bar("+2", 0.88, 0.885, 0.878, 0.883),
      bar("+3", 0.883, 0.887, 0.881, 0.885),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    partialOnHorizonMismatch: true,
    debrief: {
      process:
        "Separate rumor volume from what the official note actually says. Panic-selling a bounded liquidity operation is often a mistake if the intervention claim is gone. HOLD is fair if you wait for the coil to prove it.",
      whyMarketMoved: "The pair reclaimed once the note bounded the scare.",
      evidence: "Air-pocket USD/CHF tape plus rumor vs a scheduled official note.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-int-eurgbp-headline",
    title: "EUR/GBP coil into an official fiscal statement",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "EUR/GBP has coiled into a tight range. You have Indicators. Then the UK treasury publishes a prepared statement loosening a fiscal rule. Named author, not a data print and not chat. Ask whose currency the statement hits, and whether the coil already has your size. Practice only, not a live FX desk.",
    newsHeadline:
      "Prepared treasury statement: fiscal rule loosened. Official text.",
    preOhlc: EURGBP_PRE,
    postOhlc: withAftermath(EURGBP_PRE, [
      bar("+1", 0.845, 0.852, 0.844, 0.85),
      bar("+2", 0.85, 0.855, 0.848, 0.853),
      bar("+3", 0.853, 0.857, 0.851, 0.855),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "An official fiscal statement is a headline with an author. Loosening a UK rule can weigh on sterling, so this cross can rise. Intermediate work is naming the channel and not treating a coil as a CPI print. HOLD if the range already expressed your view.",
      whyMarketMoved: "The coil broke higher as sterling sold the statement.",
      evidence: "Tight EUR/GBP tape plus a prepared treasury headline.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "intermediate",
    assetClass: "forex",
  },
  {
    id: "case-fx-int-nok-supply",
    title: "USD/NOK rolls as an oil-supply scare hits",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "USD/NOK already rounded over after a long dollar grind. You have Indicators. Then a shipping/oil-supply scare hits. Norway is a producer in this SAMPLE brief. Name which side the krone is on before you buy a bounce. Practice only, not a live FX desk.",
    newsHeadline:
      "Oil-supply scare. Shipping disruption. Producer currencies in focus.",
    preOhlc: NOK_PRE,
    postOhlc: withAftermath(NOK_PRE, [
      bar("+1", 10.6, 10.62, 10.48, 10.52),
      bar("+2", 10.52, 10.55, 10.42, 10.46),
      bar("+3", 10.46, 10.5, 10.38, 10.42),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A supply scare can help a producer currency and hurt a buyer. Intermediate work is naming the side: here the krone is the producer, so this pair can fall. HOLD if the round-top already has your size. This is not a European-cost euro story.",
      whyMarketMoved: "The roll continued as the krone bid with the oil scare.",
      evidence: "Round-top USD/NOK tape plus a producer-side supply headline.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "intermediate",
    assetClass: "forex",
  },
  {
    id: "case-fx-int-mxn-print-headline",
    title: "Peso remittance beat, trade-rule headline",
    contextType: "combined",
    thinkingMode: "combined_earnings_headline",
    brief:
      "USD/MXN gapped and then stalled. You have Indicators. The official remittance print is stronger than hoped. The same window’s headline is an official trade-rule tightening. The print is the past. The headline is the path. Practice only, not a live FX desk.",
    newsHeadline:
      "Remittance print beats. Official trade-rule tightening in the same window.",
    preOhlc: MXN_PRE,
    postOhlc: withAftermath(MXN_PRE, [
      bar("+1", 17.26, 17.38, 17.24, 17.34),
      bar("+2", 17.34, 17.42, 17.32, 17.4),
      bar("+3", 17.4, 17.46, 17.36, 17.43),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    partialOnHorizonMismatch: true,
    debrief: {
      process:
        "A beat can still fail a short-term peso thesis if the trade-rule headline resets the path. Intermediate work is picking which clock you are on. HOLD is fair if you sized for a longer remittance story. Tightening can weigh on the peso, so this pair can rise.",
      whyMarketMoved: "The stall broke higher as the trade-rule headline outweighed the beat.",
      evidence: "Gap-then-stall USD/MXN tape plus remittance print vs a trade-rule headline.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "intermediate",
    assetClass: "forex",
  },
  {
    id: "case-fx-int-sgd-rumor-note",
    title: "Band-widen rumor, then a scheduled policy note",
    contextType: "combined",
    thinkingMode: "combined_rumor_filing",
    brief:
      "USD/SGD drifted quietly, then spiked on chat that the policy band will be widened. You have Indicators. A scheduled official note later says the stance is unchanged. Chat volume vs the note. Practice only, not a live FX desk.",
    newsHeadline:
      "Scheduled policy note: stance unchanged. Denies a band-widen rumor.",
    preOhlc: SGD_PRE,
    postOhlc: withAftermath(SGD_PRE, [
      bar("+1", 1.351, 1.352, 1.343, 1.345),
      bar("+2", 1.345, 1.347, 1.34, 1.342),
      bar("+3", 1.342, 1.344, 1.338, 1.34),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    partialOnHorizonMismatch: true,
    debrief: {
      process:
        "Separate rumor volume from what the scheduled note actually says. Intermediate work is fading a policy rumor once the official text bounds it, not treating the spike as a new path. HOLD if you wait for the drift to reassert.",
      whyMarketMoved: "The spike faded once the note left the band unchanged.",
      evidence: "Quiet-then-spike USD/SGD tape plus rumor vs a scheduled policy note.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "intermediate",
    assetClass: "forex",
  },
  {
    id: "case-fx-zar-spread-hold",
    title: "Rand dump, wide-spread session note",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "USD/ZAR has dumped hard. A tiny bounce shows up. A SAMPLE session note says spreads are unusually wide on this pair. Practice only, not a live FX desk. Is a 1-pip fade worth it, or do you wait?",
    newsHeadline:
      "Session note: liquidity thin, spreads wide on this SAMPLE pair. Not a live desk.",
    preOhlc: ZAR_PRE,
    postOhlc: withAftermath(ZAR_PRE, [
      bar("+1", 18.12, 18.16, 17.98, 18.02),
      bar("+2", 18.02, 18.08, 17.9, 17.94),
      bar("+3", 17.94, 18.0, 17.84, 17.88),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["sell"],
    debrief: {
      process:
        "Wide spreads eat a small bounce. HOLD is the process answer: do not treat a noisy dump as a tight trade. SELL is only partial if you already sized for more slide and ignored the bounce.",
      whyMarketMoved: "The fake bounce failed and the dump continued.",
      evidence: "Dump-no-reclaim USD/ZAR tape plus a wide-spread session note.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-audnzd-supply",
    title: "AUD/NZD coiled into a dairy-supply scare",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "AUD/NZD has nested into tiny inside bars. Then a dairy-supply scare hits New Zealand harder than Australia. Name which side of the cross you are on. Practice only, not a live FX desk.",
    newsHeadline:
      "Dairy-supply scare. New Zealand more exposed than Australia in this SAMPLE brief.",
    preOhlc: AUDNZD_PRE,
    postOhlc: withAftermath(AUDNZD_PRE, [
      bar("+1", 1.0915, 1.102, 1.091, 1.099),
      bar("+2", 1.099, 1.108, 1.097, 1.105),
      bar("+3", 1.105, 1.112, 1.102, 1.109),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A supply scare can help one commodity currency and hurt the other. Here the kiwi is the more exposed dairy side, so this cross can rise. HOLD if the coil already has your size.",
      whyMarketMoved: "The inside bars expanded higher as the kiwi sold the dairy scare.",
      evidence: "Nested AUD/NZD tape plus a dairy-supply headline naming the side.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-cnh-gap-note",
    title: "Yuan weekend gap on a devaluation rumor",
    contextType: "combined",
    thinkingMode: "combined_rumor_filing",
    brief:
      "USD/CNH gapped over the weekend on chat of a devaluation. A scheduled official note later says the fixing stance is unchanged. Chat vs the note. Practice only, not a live FX desk.",
    newsHeadline:
      "Scheduled note: fixing stance unchanged. Denies a devaluation rumor.",
    preOhlc: CNH_PRE,
    postOhlc: withAftermath(CNH_PRE, [
      bar("+1", 7.19, 7.192, 7.178, 7.182),
      bar("+2", 7.182, 7.186, 7.172, 7.176),
      bar("+3", 7.176, 7.18, 7.168, 7.172),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    partialOnHorizonMismatch: true,
    debrief: {
      process:
        "A weekend gap on chat is not the same as an official fixing change. Fade or wait once the scheduled note bounds the rumor. HOLD if you will not trade the first session after a gap.",
      whyMarketMoved: "The gap drifted back once the note left the stance unchanged.",
      evidence: "Weekend-gap USD/CNH tape plus rumor vs a scheduled official note.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-gbpjpy-v-reclaim",
    title: "GBP/JPY flushes, then a milder official print",
    contextType: "combined",
    thinkingMode: "combined_earnings_headline",
    brief:
      "GBP/JPY flushed, then carved a V. The official UK print is milder than the scare headline. The print is the fact. The scare was the path people feared. Practice only, not a live FX desk.",
    newsHeadline:
      "Official print milder than feared. Scare headline still circulating.",
    preOhlc: GBPJPY_PRE,
    postOhlc: withAftermath(GBPJPY_PRE, [
      bar("+1", 191.2, 192.4, 191.0, 192.0),
      bar("+2", 192.0, 192.8, 191.6, 192.4),
      bar("+3", 192.4, 193.0, 192.0, 192.7),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    partialOnHorizonMismatch: true,
    debrief: {
      process:
        "A milder official print can unwind a scare even if the headline stays loud. The V already shows buyers. HOLD if the reclaim already has your size.",
      whyMarketMoved: "The V continued as the print undercut the scare.",
      evidence: "Flush-then-V GBP/JPY tape plus official print vs a scare headline.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-eurchf-fail-rally",
    title: "EUR/CHF bounce fails under a ceiling",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "EUR/CHF bounced hard, then stalled under a clear ceiling and rolled. Thin chatter says the bounce will continue. Chase the bounce, or wait? Practice only, not a live FX desk.",
    newsHeadline:
      "Thin chatter: bounce will continue. Tape is already failing the ceiling.",
    preOhlc: EURCHF_PRE,
    postOhlc: withAftermath(EURCHF_PRE, [
      bar("+1", 0.936, 0.938, 0.928, 0.93),
      bar("+2", 0.93, 0.933, 0.924, 0.926),
      bar("+3", 0.926, 0.929, 0.92, 0.923),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bounce that fails a ceiling is fade-or-wait, not chase. Thin chatter does not rewrite a failed rally.",
      whyMarketMoved: "Sellers defended the ceiling and the bounce reversed.",
      evidence: "Failed-rally EUR/CHF tape plus weak-source chase chatter.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-inr-trend-pause",
    title: "USD/INR pauses into a US data print",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "USD/INR ground higher, then paused in a tight three-bar range into a US data print. The print comes in hot. The dollar often firms. Practice only, not a live FX desk.",
    newsHeadline: "Hot US print. Dollar firm. Rupee in focus.",
    preOhlc: INR_PRE,
    postOhlc: withAftermath(INR_PRE, [
      bar("+1", 83.25, 83.42, 83.22, 83.38),
      bar("+2", 83.38, 83.5, 83.34, 83.46),
      bar("+3", 83.46, 83.56, 83.4, 83.52),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A pause after a grind is not automatic reversal. Hot US data can restart the dollar leg. HOLD if the grind already has your size.",
      whyMarketMoved: "The pause broke higher as the dollar firmed on the print.",
      evidence: "Trend-pause USD/INR tape plus a hot US data brief.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-brl-double-bottom",
    title: "USD/BRL tests the same low twice into a fiscal vote",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "USD/BRL tagged nearly the same low twice and bounced. Then an official statement: the fiscal vote failed. Named author, not a rumor. Practice only, not a live FX desk.",
    newsHeadline:
      "Official statement: fiscal vote failed. Real in focus.",
    preOhlc: BRL_PRE,
    postOhlc: withAftermath(BRL_PRE, [
      bar("+1", 5.08, 5.16, 5.07, 5.14),
      bar("+2", 5.14, 5.2, 5.12, 5.18),
      bar("+3", 5.18, 5.24, 5.16, 5.22),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Two equal lows can be a pause, not a bottom, if the official vote fails. A failed fiscal vote can weigh on the real, so this pair can rise. HOLD if the bounce already has your size.",
      whyMarketMoved: "The second low held as a spring, then the pair lifted after the vote failed.",
      evidence: "Double-low USD/BRL tape plus an official fiscal-vote headline.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-krw-opening-drive",
    title: "USD/KRW opens with a wide drive on a shipping scare",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "USD/KRW was quiet, then the session opened with a wide drive. A shipping scare hits Korean exporters in this SAMPLE brief. Name which side the won is on. Practice only, not a live FX desk.",
    newsHeadline:
      "Shipping scare. Korean exporters in focus. Won in the brief.",
    preOhlc: KRW_PRE,
    postOhlc: withAftermath(KRW_PRE, [
      bar("+1", 1368, 1380, 1364, 1376),
      bar("+2", 1376, 1386, 1372, 1382),
      bar("+3", 1382, 1390, 1378, 1386),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A shipping freeze can hurt an exporter currency. Here the won is the exporter side, so this pair can rise. Do not fade the first wide bar just because it looks 'extended.' HOLD if the drive already has your size.",
      whyMarketMoved: "The opening drive continued as the won sold the shipping scare.",
      evidence: "Opening-drive USD/KRW tape plus an exporter-side shipping headline.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-eursek-expand-range",
    title: "EUR/SEK range is getting wider, not cleaner",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "EUR/SEK swings are getting larger both ways. A risk-off headline is out, but the tape has not picked a side. Do you force a trade, or wait? Practice only, not a live FX desk.",
    newsHeadline:
      "Risk-off tone. Krona and euro both in the chatter. Tape is two-way.",
    preOhlc: EURSEK_PRE,
    postOhlc: withAftermath(EURSEK_PRE, [
      bar("+1", 11.3, 11.58, 11.18, 11.5),
      bar("+2", 11.5, 11.66, 11.26, 11.34),
      bar("+3", 11.34, 11.48, 11.2, 11.28),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["sell", "buy"],
    debrief: {
      process:
        "An expanding range is noise until a side holds. HOLD is the process answer. BUY or SELL is only partial if you already had a krona-vs-euro thesis and sized small.",
      whyMarketMoved: "The two-way swings continued; no clean risk-off one-way tape.",
      evidence: "Expanding EUR/SEK range plus a mixed risk-off headline.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-thb-staircase",
    title: "USD/THB steps lower after a tourism statement",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "USD/THB has been stepping down, one lower close after another. Then an official tourism-board statement: visitor numbers beat the plan. Named author, not chatter. Practice only, not a live FX desk.",
    newsHeadline:
      "Official tourism statement: visitor numbers beat the plan. Baht in focus.",
    preOhlc: THB_PRE,
    postOhlc: withAftermath(THB_PRE, [
      bar("+1", 35.68, 35.72, 35.54, 35.58),
      bar("+2", 35.58, 35.64, 35.46, 35.5),
      bar("+3", 35.5, 35.56, 35.4, 35.44),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A staircase of lower closes plus an official tourism beat can keep bidding the baht, so this pair can fall. Do not fade it just because it 'already moved.' HOLD if the stairs already have your size.",
      whyMarketMoved: "The staircase continued as the baht bid the tourism statement.",
      evidence: "Staircase USD/THB tape plus an official tourism headline.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-twd-round-top",
    title: "USD/TWD rolls over after a foundry order statement",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "USD/TWD has been rounding over slowly. Then a SAMPLE foundry publishes an official statement: order books are full. Named author, not a rumor. Practice only, not a live FX desk.",
    newsHeadline:
      "Official foundry statement: order books full. Taiwan dollar in focus.",
    preOhlc: TWD_PRE,
    postOhlc: withAftermath(TWD_PRE, [
      bar("+1", 32.04, 32.06, 31.92, 31.96),
      bar("+2", 31.96, 32.0, 31.86, 31.9),
      bar("+3", 31.9, 31.94, 31.8, 31.84),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A slow round-over plus an official full-book statement can keep bidding the Taiwan dollar, so this pair can fall. HOLD if the saucer already has your size.",
      whyMarketMoved: "The saucer continued lower as the foundry statement bid the local currency.",
      evidence: "Gentle saucer-top USD/TWD tape plus an official foundry headline.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-php-doji-hold",
    title: "USD/PHP prints a cluster of indecision bars",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "USD/PHP has a cluster of tiny bodies with wicks both ways. Thin chatter says a breakout is coming. Chase the first poke, or wait? Practice only, not a live FX desk.",
    newsHeadline:
      "Thin chatter: breakout is coming. Tape is still indecision.",
    preOhlc: PHP_PRE,
    postOhlc: withAftermath(PHP_PRE, [
      bar("+1", 56.2, 56.38, 56.18, 56.34),
      bar("+2", 56.34, 56.36, 56.12, 56.16),
      bar("+3", 56.16, 56.22, 56.08, 56.14),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["sell"],
    debrief: {
      process:
        "A doji cluster is wait-not-chase. The first poke often fails. HOLD is the process answer. SELL is only partial if you faded the failed poke after it reversed, not on the chatter.",
      whyMarketMoved: "The poke failed and the cluster leaked lower.",
      evidence: "Doji-cluster USD/PHP tape plus weak-source breakout chatter.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-clp-outside-bar",
    title: "USD/CLP outside bar vs a strong copper print",
    contextType: "combined",
    thinkingMode: "combined_earnings_headline",
    brief:
      "USD/CLP just printed a wide outside bar to the upside. The official copper-export print is stronger than hoped. The tape looks like dollar strength. The print is a Chile-side fact. Practice only, not a live FX desk.",
    newsHeadline:
      "Copper-export print beats. Outside bar still looks like a dollar drive.",
    preOhlc: CLP_PRE,
    postOhlc: withAftermath(CLP_PRE, [
      bar("+1", 948, 950, 936, 940),
      bar("+2", 940, 944, 932, 936),
      bar("+3", 936, 940, 928, 932),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    partialOnHorizonMismatch: true,
    debrief: {
      process:
        "A strong copper print can bid the peso even if one bar looks like a dollar breakout. Map the print to whose currency it is. HOLD if you wait for the outside bar to fail first.",
      whyMarketMoved: "The outside bar reversed as the copper print bid the peso.",
      evidence: "Outside-bar USD/CLP tape plus an official copper print vs the dollar-looking bar.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-int-audjpy-flag",
    title: "AUD/JPY flags after an impulse into an AU print",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "AUD/JPY ran, then coiled in a tight downward flag. You have Indicators. An official Australian jobs-style print comes in firm. Ask whether the flag is a pause in the impulse or a reversal. Practice only, not a live FX desk.",
    newsHeadline:
      "Firm Australian print. Aussie-yen flag still tight.",
    preOhlc: AUDJPY_PRE,
    postOhlc: withAftermath(AUDJPY_PRE, [
      bar("+1", 96.95, 97.6, 96.9, 97.45),
      bar("+2", 97.45, 97.85, 97.3, 97.7),
      bar("+3", 97.7, 98.05, 97.55, 97.9),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Intermediate work is naming pause vs reversal. A firm home print after an impulse-and-flag often continues the first leg. HOLD if the impulse already has your size.",
      whyMarketMoved: "The flag broke in the impulse direction after the print.",
      evidence: "AUD/JPY impulse-and-flag tape plus a firm Australian data brief.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "intermediate",
    assetClass: "forex",
  },
  {
    id: "case-fx-int-try-wedge",
    title: "USD/TRY rising wedge into chase chatter",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "USD/TRY has been making higher highs and higher lows, but the range is squeezing. You have Indicators. Thin chatter says the squeeze must continue higher. SAMPLE pair only, not a live EM desk. Chase or wait?",
    newsHeadline:
      "Thin chatter: squeeze must keep rising. Wedge is already tight.",
    preOhlc: TRY_PRE,
    postOhlc: withAftermath(TRY_PRE, [
      bar("+1", 32.88, 32.92, 32.62, 32.68),
      bar("+2", 32.68, 32.74, 32.48, 32.54),
      bar("+3", 32.54, 32.6, 32.36, 32.42),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A rising wedge is often late-chase, not a new path. Intermediate work is fading or waiting when chatter and a squeeze line up. HOLD if you will not fade high-vol SAMPLE EM.",
      whyMarketMoved: "The wedge broke down once the chase stalled.",
      evidence: "Rising-wedge USD/TRY tape plus weak-source chase chatter. Practice only.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "intermediate",
    assetClass: "forex",
  },
  {
    id: "case-fx-int-audcad-double",
    title: "AUD/CAD double top vs chase chatter",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "AUD/CAD tagged nearly the same high twice and failed to break it. You have Indicators. Thin chatter says the second tag must continue higher. SAMPLE pair only, not a live FX desk. Chase or wait?",
    newsHeadline:
      "Thin chatter: second tag must break higher. Highs are already equal.",
    preOhlc: AUDCAD_PRE,
    postOhlc: withAftermath(AUDCAD_PRE, [
      bar("+1", 0.902, 0.904, 0.894, 0.896),
      bar("+2", 0.896, 0.898, 0.888, 0.89),
      bar("+3", 0.89, 0.892, 0.882, 0.884),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Two equal highs that fail are late-chase, not a new path. Intermediate work is fading or waiting when chatter ignores the second rejection. HOLD if you will not fade a SAMPLE commodity cross.",
      whyMarketMoved: "The second high failed and the cross leaked lower.",
      evidence: "AUD/CAD double-top tape plus weak-source chase chatter. Practice only.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "intermediate",
    assetClass: "forex",
  },
  {
    id: "case-fx-int-euraud-inside",
    title: "EUR/AUD inside bar vs chase chatter into an AU print",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "EUR/AUD printed a wide bar, then smaller bars fully inside that range. You have Indicators. Thin chatter says the inside must break higher into an Australian print still ahead. SAMPLE pair only, not a live FX desk. Chase a break that has not printed, or wait?",
    newsHeadline:
      "Inside bars on euro-Aussie. AU print still ahead. Thin chatter: must break up.",
    preOhlc: EURAUD_PRE,
    postOhlc: withAftermath(EURAUD_PRE, [
      bar("+1", 1.66, 1.666, 1.652, 1.656),
      bar("+2", 1.656, 1.662, 1.65, 1.658),
      bar("+3", 1.658, 1.664, 1.651, 1.654),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["buy", "sell"],
    debrief: {
      process:
        "An inside bar into a print still ahead is a wait. Intermediate work is not chasing chatter for a break that has not printed. HOLD is the process answer. BUY or SELL is only partial if you already had a thesis and sized small.",
      whyMarketMoved: "The mother-bar range held; no clean break through the print window.",
      evidence: "EUR/AUD inside-bar tape plus a print-still-ahead brief. Practice only.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "intermediate",
    assetClass: "forex",
  },
  {
    id: "case-fx-int-gbpnzd-three-push",
    title: "GBP/NZD three-push into a dairy scare already in the highs",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "GBP/NZD already printed three successive pushes into the same high on a New Zealand dairy-export scare. You have Indicators. Thin chatter says the third push must break. Ask whether the scare is already in the three legs. SAMPLE pair only, not a live FX desk.",
    newsHeadline:
      "Dairy scare already ran. Third sterling-kiwi push into the same high. Thin chatter: must break.",
    preOhlc: GBPNZD_PRE,
    postOhlc: withAftermath(GBPNZD_PRE, [
      bar("+1", 2.106, 2.11, 2.088, 2.092),
      bar("+2", 2.092, 2.096, 2.074, 2.078),
      bar("+3", 2.078, 2.082, 2.062, 2.066),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Intermediate work is naming what is already in the price. Three pushes into a dairy scare are often late-chase, not a new path. Fade or wait; HOLD if the slip already has your size. This is not the AUD/CAD double-top, not the EUR/AUD inside-bar wait, not the AUD/NZD supply grind, and not a live FX desk.",
      whyMarketMoved: "The third push failed and sterling-kiwi leaked lower once the dairy-scare chase stalled.",
      evidence: "GBP/NZD three-push tape plus a scare-already-ran headline. Practice only.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "intermediate",
    assetClass: "forex",
  },
];

export const CRYPTO_CASES: CaseStudy[] = [
  {
    id: "case-crypto-chase-fade",
    title: "Bitcoin already extended on social hype",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "Bitcoin has already extended after social hype. Decide before the next legs. Practice data only.",
    newsHeadline: "Influencer chase narrative. No company filing equivalent.",
    preOhlc: BTC_PRE,
    postOhlc: withAftermath(BTC_PRE, [
      bar("+1", 66400, 66600, 64800, 65100),
      bar("+2", 65100, 65500, 64200, 64600),
      bar("+3", 64600, 65000, 63800, 64100),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Hype without a durable catalyst often fades. Weigh evidence quality against FOMO.",
      whyMarketMoved: "The chase narrative pulled back.",
      evidence: "Extended chart plus a low-quality headline.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-dump-reclaim",
    title: "Ether dumps, then buyers step in",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "Ether dumped on a scare headline, then buyers showed up. The scare was later partly walked back.",
    newsHeadline: "Protocol scare chatter, later partly walked back.",
    preOhlc: ETH_PRE,
    postOhlc: withAftermath(ETH_PRE, [
      bar("+1", 3290, 3380, 3270, 3360),
      bar("+2", 3360, 3440, 3340, 3410),
      bar("+3", 3410, 3480, 3390, 3450),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "After a scare, ask if the thesis broke or if it was just a liquidity flush. Patience can beat a panic sell.",
      whyMarketMoved: "The move reclaimed after the scare was walked back.",
      evidence: "Flush on the chart plus a headline walk-back.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-chop-break",
    title: "Bitcoin breaks out of a range",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "Bitcoin coiled in a range. The catalyst is thin. Decide whether a break has follow-through.",
    newsHeadline: "Range-break interest. Thin catalyst.",
    preOhlc: [
      bar("T-5", 65000, 65200, 64800, 65050),
      bar("T-4", 65050, 65300, 64900, 65100),
      bar("T-3", 65100, 65250, 64950, 65080),
      bar("T-2", 65080, 65350, 65000, 65200),
      bar("T-1", 65200, 65400, 65100, 65300),
      bar("T0", 65300, 65550, 65250, 65480),
    ],
    postOhlc: withAftermath(
      [
        bar("T-5", 65000, 65200, 64800, 65050),
        bar("T-4", 65050, 65300, 64900, 65100),
        bar("T-3", 65100, 65250, 64950, 65080),
        bar("T-2", 65080, 65350, 65000, 65200),
        bar("T-1", 65200, 65400, 65100, 65300),
        bar("T0", 65300, 65550, 65250, 65480),
      ],
      [
        bar("+1", 65480, 66200, 65400, 66000),
        bar("+2", 66000, 66800, 65800, 66500),
        bar("+3", 66500, 67200, 66200, 66900),
      ],
    ),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Range breaks need follow-through. Confirm the structure, not just the first green bar.",
      whyMarketMoved: "Upside follow-through after the range.",
      evidence: "Coiled chart plus a thin catalyst.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-sol-chase",
    title: "Solana-style coin already extended on hype",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE Solana-style coin already extended after social hype. Practice data only. Chase, wait, or take risk off?",
    newsHeadline: "Influencer chase narrative. No protocol filing equivalent.",
    preOhlc: SOL_PRE,
    postOhlc: withAftermath(SOL_PRE, [
      bar("+1", 160.0, 162.0, 148.0, 150.0),
      bar("+2", 150.0, 154.0, 142.0, 146.0),
      bar("+3", 146.0, 150.0, 138.0, 141.0),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Hype without a durable catalyst often fades. Weigh evidence quality against FOMO.",
      whyMarketMoved: "The chase narrative pulled back.",
      evidence: "Extended SAMPLE alt tape plus a low-quality headline.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-usdc-depeg-scare",
    title: "Stablecoin wobble, then a walk-back",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE dollar-peg coin wobbles on a reserve scare, then the scare is partly walked back. Practice only.",
    newsHeadline: "Reserve scare chatter, later partly walked back.",
    preOhlc: USDC_PRE,
    postOhlc: withAftermath(USDC_PRE, [
      bar("+1", 0.997, 1.001, 0.996, 1.0),
      bar("+2", 1.0, 1.002, 0.998, 1.001),
      bar("+3", 1.001, 1.002, 0.999, 1.0),
    ]),
    correctActions: ["hold", "buy"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A peg wobble is a confidence story. Hold if the walk-back bounds the scare. This is SAMPLE copy, not a live stablecoin desk.",
      whyMarketMoved: "The wobble filled after the walk-back.",
      evidence: "Peg tape plus a walked-back reserve scare.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-btc-risk-off",
    title: "Bitcoin sold with risk appetite",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "Bitcoin had already extended. A risk-off headline hits. Decide before the next legs. Practice data only.",
    newsHeadline: "Risk-off. Bitcoin sold with other risky assets.",
    preOhlc: BTC_PRE,
    postOhlc: withAftermath(BTC_PRE, [
      bar("+1", 65800, 66100, 64200, 64600),
      bar("+2", 64600, 65000, 63400, 63800),
      bar("+3", 63800, 64200, 62800, 63200),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "When bitcoin sells with everything else, you are deciding market risk, not a company filing.",
      whyMarketMoved: "The extended tape sold with the risk-off brief.",
      evidence: "Extended BTC tape plus a market-wide headline.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-eth-print",
    title: "Ether into a hot macro print",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "Ether was already dumping. A hot macro print lands. Rate-cut hopes fade. Practice only.",
    newsHeadline: "Hot macro print. Rate-cut odds fall. Crypto in focus.",
    preOhlc: ETH_PRE,
    postOhlc: withAftermath(ETH_PRE, [
      bar("+1", 3260, 3280, 3180, 3210),
      bar("+2", 3210, 3240, 3140, 3170),
      bar("+3", 3170, 3200, 3120, 3140),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Hot data can hit risk assets that were already sliding. Hold if you sized for more dump.",
      whyMarketMoved: "The dump continued after the print.",
      evidence: "Weak ETH tape plus a macro-print brief.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-btc-supply-hack",
    title: "Exchange-hack headline on a coiled bitcoin tape",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "Bitcoin coiled in a range. An exchange-hack headline hits. This is a platform scare, not a protocol change. Practice only.",
    newsHeadline: "Exchange-hack chatter. Protocol unchanged in this SAMPLE brief.",
    preOhlc: [
      bar("T-5", 65000, 65200, 64800, 65050),
      bar("T-4", 65050, 65300, 64900, 65100),
      bar("T-3", 65100, 65250, 64950, 65080),
      bar("T-2", 65080, 65350, 65000, 65200),
      bar("T-1", 65200, 65400, 65100, 65300),
      bar("T0", 65300, 65550, 65250, 65480),
    ],
    postOhlc: withAftermath(
      [
        bar("T-5", 65000, 65200, 64800, 65050),
        bar("T-4", 65050, 65300, 64900, 65100),
        bar("T-3", 65100, 65250, 64950, 65080),
        bar("T-2", 65080, 65350, 65000, 65200),
        bar("T-1", 65200, 65400, 65100, 65300),
        bar("T0", 65300, 65550, 65250, 65480),
      ],
      [
        bar("+1", 64800, 65000, 63200, 63600),
        bar("+2", 63600, 64000, 62800, 63200),
        bar("+3", 63200, 63800, 62600, 63400),
      ],
    ),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A platform scare can flush a coiled tape even if the protocol is unchanged. Hold if you can sit through the flush. Buying the first red bar is usually not process.",
      whyMarketMoved: "The range broke lower on the scare, then chopped.",
      evidence: "Coiled BTC tape plus an exchange-hack headline.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-int-sol-fade",
    title: "Alt already ran into a nothing-catalyst",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE alt already ran. The 'catalyst' is a conference appearance. You have Indicators. Is that a new fact?",
    newsHeadline: "Conference appearance. No protocol change. Coin already extended.",
    preOhlc: SOL_PRE,
    postOhlc: withAftermath(SOL_PRE, [
      bar("+1", 158.0, 160.0, 146.0, 148.0),
      bar("+2", 148.0, 152.0, 140.0, 143.0),
      bar("+3", 143.0, 146.0, 136.0, 138.0),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A conference is often already in an extended tape. Intermediate work is naming the incremental fact before you add risk.",
      whyMarketMoved: "Late buyers exited when the catalyst stayed thin.",
      evidence: "Extended alt tape plus a conference-only headline.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "intermediate",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-int-eth-reclaim",
    title: "Ether scare walked back after a dump",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "Ether dumped on a protocol scare, then the scare was walked back. The tape is still below the prior range. You already know flush vs thesis-break. Decide.",
    newsHeadline: "Protocol scare later walked back. Ether still below the prior range.",
    preOhlc: ETH_PRE,
    postOhlc: withAftermath(ETH_PRE, [
      bar("+1", 3310, 3420, 3290, 3390),
      bar("+2", 3390, 3480, 3360, 3450),
      bar("+3", 3450, 3520, 3420, 3490),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "If the scare is walked back, ask whether the thesis broke. Intermediate work is buying a bounded scare, not averaging every dump.",
      whyMarketMoved: "The dump reclaimed after the walk-back.",
      evidence: "ETH dump tape plus a walked-back protocol scare.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "intermediate",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-int-btc-print",
    title: "Bitcoin after a soft landing print",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "Bitcoin had been selling with risk assets. A jobs print cools without collapsing. Soft-landing talk returns. Decide with the print and the already-weak tape.",
    newsHeadline: "Jobs cool without collapsing. Soft-landing odds rise.",
    preOhlc: BTC_PRE,
    postOhlc: withAftermath(BTC_PRE, [
      bar("+1", 66600, 67800, 66400, 67400),
      bar("+2", 67400, 68400, 67000, 68000),
      bar("+3", 68000, 68800, 67600, 68400),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Easier macro news can lift bitcoin that already sold off. Still ask whether you are early or late to that story.",
      whyMarketMoved: "Risk assets bid as rate-cut hopes returned.",
      evidence: "Extended-then-heavy BTC tape plus a cooling jobs print.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "intermediate",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-pow-grid",
    title: "Proof-of-work coin into a mining-grid scare",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "This SAMPLE proof-of-work coin has already rounded over. A grid/outage scare hits a mining region. Name which side this coin is on: energy-hungry hash, not a cheap L2. Practice data only. Not a live exchange.",
    newsHeadline:
      "Grid scare in a mining region. Energy-intensive proof-of-work coins in focus.",
    preOhlc: POW_PRE,
    postOhlc: withAftermath(POW_PRE, [
      bar("+1", 83.2, 83.6, 78.4, 79.2),
      bar("+2", 79.2, 80.1, 76.8, 77.6),
      bar("+3", 77.6, 78.4, 75.9, 76.4),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Supply geopolitics is naming the side. This coin is the energy-hungry miner, so a grid scare can flush it. Hold if you already sized for more slide. This is not an exchange-hack headline and not a live hash-rate feed.",
      whyMarketMoved: "The round-over broke lower as miners sold the scare.",
      evidence: "POW grind-over tape plus a mining-grid headline.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-l2-unlock-headline",
    title: "Unlock print is light, then a foundation dump headline",
    contextType: "combined",
    thinkingMode: "combined_earnings_headline",
    brief:
      "This SAMPLE L2 coin grinded, then stalled. The official unlock print is smaller than feared. Same window: a foundation wallet is said to send coins to an exchange. The print is the past. The headline is the path. Practice data only — not a live chain, not an income statement.",
    newsHeadline:
      "Official unlock print: smaller than feared. Same window: foundation-wallet-to-exchange chatter.",
    preOhlc: L2_PRE,
    postOhlc: withAftermath(L2_PRE, [
      bar("+1", 18.95, 19.1, 17.6, 17.85),
      bar("+2", 17.85, 18.1, 17.2, 17.4),
      bar("+3", 17.4, 17.65, 16.9, 17.1),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    partialOnHorizonMismatch: true,
    debrief: {
      process:
        "Match the official print to the headline. A light unlock can still fail if the dump chatter resets supply. Hold is fair if you sized for a longer unlock story and the print still holds. Do not map this to an income statement.",
      whyMarketMoved: "The stall broke lower as the dump headline outweighed the light print.",
      evidence: "L2 grind-stall tape plus unlock-print vs foundation-headline copy.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-bridge-rumor-note",
    title: "Bridge-drain rumor, then a scheduled official note",
    contextType: "combined",
    thinkingMode: "combined_rumor_filing",
    brief:
      "This SAMPLE bridge token already air-pocketed on chat that the bridge was drained. Minutes later a scheduled official note says it was a test transfer, not a drain. Chat volume vs the note. Practice data only — not a live chain.",
    newsHeadline:
      "Official note: test transfer. Denies a bridge-drain rumor.",
    preOhlc: BRIDGE_PRE,
    postOhlc: withAftermath(BRIDGE_PRE, [
      bar("+1", 6.18, 6.72, 6.14, 6.64),
      bar("+2", 6.64, 6.84, 6.56, 6.76),
      bar("+3", 6.76, 6.9, 6.68, 6.82),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    partialOnHorizonMismatch: true,
    debrief: {
      process:
        "Separate rumor volume from what the official note actually says. Panic-selling a bounded drain claim is often a mistake if the note names a test transfer. Hold is fair if you wait for the dump to prove it. This is not a peg wobble and not an income statement.",
      whyMarketMoved: "The token reclaimed once the note bounded the scare.",
      evidence: "Bridge-token air-pocket tape plus rumor vs a scheduled official note.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-int-alt-risk-off",
    title: "High-beta alt bounce into a risk-off tape",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE high-beta alt already bounced off a dump. You have Indicators. A risk-off headline hits the whole risk complex. Is a two-day bounce a new regime, or just a relief squeeze? Practice data only. Not a live exchange.",
    newsHeadline: "Risk-off. High-beta coins sold with other risky assets.",
    preOhlc: ALT_PRE,
    postOhlc: withAftermath(ALT_PRE, [
      bar("+1", 2.24, 2.26, 2.04, 2.08),
      bar("+2", 2.08, 2.12, 1.96, 2.0),
      bar("+3", 2.0, 2.04, 1.9, 1.94),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Intermediate work is naming the bounce: relief is not a new risk-on regime. When the whole complex sells, you are deciding market risk, not a protocol filing. Hold if you sized for more dump. This is not the bitcoin-already-extended beginner tape.",
      whyMarketMoved: "The relief bounce failed as risk-off returned.",
      evidence: "High-beta bounce tape plus a market-wide risk-off headline.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "intermediate",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-int-pos-grid",
    title: "Proof-of-stake already dumped into a mining-grid scare",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "This SAMPLE proof-of-stake coin already dumped. You have Indicators. A grid scare hits a mining region. Name which side this coin is on: low energy use, not the energy-hungry miner. Practice data only. Not a live exchange.",
    newsHeadline:
      "Grid scare in a mining region. Energy-intensive proof-of-work in focus; this SAMPLE coin is proof-of-stake.",
    preOhlc: POS_PRE,
    postOhlc: withAftermath(POS_PRE, [
      bar("+1", 2430, 2580, 2410, 2550),
      bar("+2", 2550, 2620, 2520, 2590),
      bar("+3", 2590, 2650, 2560, 2620),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Supply geopolitics is naming the side. Intermediate work is seeing the already-dumped proof-of-stake coin, not the miner. A grid scare can rotate away from hash-hungry coins. Hold if the dump already has your size. This is not the beginner proof-of-work sell tape.",
      whyMarketMoved: "The dump reversed as capital rotated toward the low-energy side.",
      evidence: "Already-weak PoS tape plus a mining-grid headline naming the side.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "intermediate",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-int-stake-print-exit",
    title: "Staking-yield print beats, then a validator-exit headline",
    contextType: "combined",
    thinkingMode: "combined_earnings_headline",
    brief:
      "This SAMPLE staking token already dumped. You have Indicators. The official staking-yield print is stronger than feared. Same window: a large validator set is exiting. The print is the past. The headline is the path. Practice data only — not a live chain, not an income statement.",
    newsHeadline:
      "Official staking-yield print: stronger than feared. Same window: large validator-exit chatter.",
    preOhlc: STAKE_PRE,
    postOhlc: withAftermath(STAKE_PRE, [
      bar("+1", 4.62, 4.7, 4.28, 4.34),
      bar("+2", 4.34, 4.42, 4.12, 4.18),
      bar("+3", 4.18, 4.26, 4.0, 4.06),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    partialOnHorizonMismatch: true,
    debrief: {
      process:
        "Match the official print to the headline. Intermediate work is seeing that a yield beat can still fail if exits reset supply, and the dump may already have the beat in. Hold is fair if you sized for a longer staking story and the print still holds. This is not the beginner L2 unlock tape.",
      whyMarketMoved: "The dump continued as validator exits outweighed the yield print.",
      evidence: "Already-weak staking tape plus yield-print vs exit-headline copy.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "intermediate",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-int-list-rumor-note",
    title: "Listing-chat run, then a scheduled exchange note",
    contextType: "combined",
    thinkingMode: "combined_rumor_filing",
    brief:
      "This SAMPLE alt already ran on listing chat. You have Indicators. Minutes later a scheduled exchange note says there is no listing. Chat volume vs the note. Practice data only — not a live exchange.",
    newsHeadline:
      "Official exchange note: no listing. Denies listing-chat.",
    preOhlc: LIST_PRE,
    postOhlc: withAftermath(LIST_PRE, [
      bar("+1", 0.406, 0.412, 0.352, 0.358),
      bar("+2", 0.358, 0.368, 0.336, 0.342),
      bar("+3", 0.342, 0.352, 0.322, 0.328),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    partialOnHorizonMismatch: true,
    debrief: {
      process:
        "Separate rumor volume from what the official note actually says. Intermediate work is naming what is already in the run: chat is not a listing. Hold is fair if you wait for the dump to prove it. This is not the beginner bridge-drain reclaim tape.",
      whyMarketMoved: "The run faded once the note denied a listing.",
      evidence: "Listing-run tape plus rumor vs a scheduled exchange note.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "intermediate",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-dex-weekend-gap",
    title: "DEX token gaps down on a thin weekend book",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE DEX token coiled into the weekend. Then the book thins and the next print gaps down. Funding chatter, no protocol change. Practice data only — not a live exchange. Chase the gap, wait, or take risk off?",
    newsHeadline:
      "Thin weekend book. Funding chatter. No protocol change.",
    preOhlc: DEX_PRE,
    postOhlc: withAftermath(DEX_PRE, [
      bar("+1", 11.72, 11.86, 11.58, 11.64),
      bar("+2", 11.64, 11.78, 11.42, 11.5),
      bar("+3", 11.5, 11.62, 11.28, 11.36),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A weekend gap with no protocol fact is often a thin book, not a new thesis. Do not buy the first print just because it already dumped. HOLD if the gap already has your size. This is not a live DEX and not the listing-chat run.",
      whyMarketMoved: "The gap did not reclaim; weekend liquidity stayed thin.",
      evidence: "Quiet DEX tape plus a weekend gap-down with no protocol change.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-nft-round-top",
    title: "NFT marketplace token rounds over after a volume note",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE NFT marketplace token already made a high, then a lower high. An official marketplace note says weekly volume beat the plan. Named author, not chatter. Practice data only — not a live exchange. Chase the last high, wait, or take risk off?",
    newsHeadline:
      "Official marketplace note: weekly volume beat the plan.",
    preOhlc: NFT_PRE,
    postOhlc: withAftermath(NFT_PRE, [
      bar("+1", 36.6, 36.9, 34.8, 35.2),
      bar("+2", 35.2, 35.6, 33.8, 34.2),
      bar("+3", 34.2, 34.6, 33.0, 33.4),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A named volume beat can already be in a round-top. Do not chase the last high just because the note is official. HOLD if the slip already has your size. This is not a live NFT desk and not the weekend-gap DEX tape.",
      whyMarketMoved: "The lower-high structure continued lower after the volume note.",
      evidence: "NFT round-top tape plus an official marketplace volume headline.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-priv-fail-break",
    title: "Privacy coin pokes a range, then fails",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE privacy coin poked above a range, then slipped back. Thin chatter says the break must hold. No protocol change. Practice data only — not a live exchange. Chase the first green poke, wait, or take risk off?",
    newsHeadline:
      "Thin chatter: range break must hold. No protocol change.",
    preOhlc: PRIV_PRE,
    postOhlc: withAftermath(PRIV_PRE, [
      bar("+1", 54.0, 54.4, 51.8, 52.2),
      bar("+2", 52.2, 52.8, 50.6, 51.0),
      bar("+3", 51.0, 51.6, 49.6, 50.0),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A failed poke is usually fade-or-wait, not a chase. Do not treat the first green bar as a breakout. HOLD if the slip already has your size. This is not a live privacy-coin desk and not the NFT round-top tape.",
      whyMarketMoved: "The poke failed and the coin slipped back through the range.",
      evidence: "Privacy-coin failed-breakout tape plus thin range-break chatter.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-oracle-staircase",
    title: "Oracle token steps higher on a feed-outage scare",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "This SAMPLE oracle token has been stepping up, one higher close after another. A regional data-feed / RPC outage scare hits. Name which side this coin is on: the oracle feed, not the L1. Practice data only — not a live exchange.",
    newsHeadline:
      "Regional data-feed outage scare. Oracle-feed coins in focus; this SAMPLE coin is the feed, not the L1.",
    preOhlc: ORCL_PRE,
    postOhlc: withAftermath(ORCL_PRE, [
      bar("+1", 8.66, 8.82, 8.62, 8.78),
      bar("+2", 8.78, 8.92, 8.74, 8.88),
      bar("+3", 8.88, 9.02, 8.84, 8.96),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Supply geopolitics is naming the side. This coin is the feed, so an outage scare can keep bidding it. Do not fade the stairs just because they already moved. HOLD if the stairs already have your size. This is not a live oracle desk and not the privacy-coin fail-break tape.",
      whyMarketMoved: "The staircase continued as the feed-side coin bid the outage scare.",
      evidence: "Oracle staircase tape plus a feed-side outage headline.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-dao-expand-range",
    title: "DAO token range is getting wider, not cleaner",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE DAO token is swinging larger both ways. A risk-off headline is out, but proposal chatter is mixed and the tape has not picked a side. Do you force a trade, or wait? Practice data only — not a live exchange.",
    newsHeadline:
      "Risk-off tone. Proposal chatter mixed. Tape is two-way.",
    preOhlc: DAO_PRE,
    postOhlc: withAftermath(DAO_PRE, [
      bar("+1", 0.718, 0.756, 0.706, 0.748),
      bar("+2", 0.748, 0.76, 0.714, 0.722),
      bar("+3", 0.722, 0.75, 0.708, 0.716),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["sell", "buy"],
    debrief: {
      process:
        "An expanding range is noise until a side holds. HOLD is the process answer. BUY or SELL is only partial if you already had a proposal thesis and sized small. This is not a live DAO desk and not the oracle staircase tape.",
      whyMarketMoved: "The two-way swings continued; no clean risk-off one-way tape.",
      evidence: "Expanding DAO range plus a mixed risk-off headline.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-rstk-open-drive",
    title: "Restaking token opens with a wide drive after a TVL note",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE restaking token coiled overnight. An official protocol note says TVL beat the plan. Named author, not chatter. The next session opens with a wide drive. Practice data only — not a live exchange. Fade the first wide bar, wait, or follow it?",
    newsHeadline:
      "Official protocol note: TVL beat the plan. Opening drive.",
    preOhlc: RSTK_PRE,
    postOhlc: withAftermath(RSTK_PRE, [
      bar("+1", 14.72, 14.96, 14.68, 14.9),
      bar("+2", 14.9, 15.08, 14.86, 15.02),
      bar("+3", 15.02, 15.18, 14.96, 15.12),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A first wide bar after a named TVL beat is a time-frame question, not an automatic fade. Do not fade it just because it looks extended. HOLD if the drive already has your size. This is not a live restaking desk and not the DAO expanding-range tape.",
      whyMarketMoved: "The opening drive continued as the TVL note stayed in the tape.",
      evidence: "Quiet overnight restaking coil plus an official TVL note and a wide opening drive.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-perp-double-bottom",
    title: "Perp-DEX token tests the same low twice after a fee scare",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE perp-DEX token dumped, bounced, then tested the same low again. The fee-volume scare was later walked back. Practice data only — not a live exchange. Buy the second low, wait, or take risk off?",
    newsHeadline:
      "Fee-volume scare walked back. Second low held.",
    preOhlc: PERP_PRE,
    postOhlc: withAftermath(PERP_PRE, [
      bar("+1", 3.58, 3.78, 3.54, 3.72),
      bar("+2", 3.72, 3.88, 3.68, 3.82),
      bar("+3", 3.82, 3.94, 3.76, 3.88),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A second low that holds after a walked-back fee scare is a reclaim story, not a new dump. HOLD if the bounce already has your size. This is not a live perp desk and not the restaking opening-drive tape.",
      whyMarketMoved: "The second low held and the token reclaimed after the scare was walked back.",
      evidence: "Perp-DEX double-bottom tape plus a walked-back fee-volume scare.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-ai-outside-bar",
    title: "AI-agent token prints an outside bar that closes weak",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE AI-agent token printed a wide bar that took both sides, then closed weak. Thin chatter says the wick must hold. No protocol change. Practice data only — not a live exchange. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Outside bar. Thin chatter: wick must hold. No protocol change.",
    preOhlc: AI_PRE,
    postOhlc: withAftermath(AI_PRE, [
      bar("+1", 0.0478, 0.0484, 0.0462, 0.0466),
      bar("+2", 0.0466, 0.0472, 0.0454, 0.0458),
      bar("+3", 0.0458, 0.0464, 0.0448, 0.0452),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "An outside bar that closes weak is usually fade-or-wait, not a chase of the upper wick. HOLD if the slip already has your size. This is not a live AI-token desk and not the perp-DEX double-bottom tape.",
      whyMarketMoved: "The weak close continued lower.",
      evidence: "AI-agent outside-bar tape plus thin wick-must-hold chatter.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-rwa-doji-hold",
    title: "RWA token prints a doji on mixed risk-off chatter",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE tokenized-treasury coin printed a doji: open and close almost the same, wicks both ways. A risk-off headline is out, but the tape has not picked a side. Practice data only — not a live exchange. Do you force a trade, or wait?",
    newsHeadline:
      "Risk-off tone. Doji on the RWA token. Tape is two-way.",
    preOhlc: RWA_PRE,
    postOhlc: withAftermath(RWA_PRE, [
      bar("+1", 22.36, 22.54, 22.16, 22.24),
      bar("+2", 22.24, 22.42, 22.1, 22.32),
      bar("+3", 22.32, 22.5, 22.14, 22.22),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["sell", "buy"],
    debrief: {
      process:
        "A doji on mixed risk-off chatter is indecision. HOLD is the process answer until a side holds. BUY or SELL is only partial if you already had a thesis and sized small. This is not a live RWA desk and not the AI-agent outside-bar tape.",
      whyMarketMoved: "The tape stayed two-way after the doji; no clean risk-off one-way move.",
      evidence: "RWA doji tape plus a mixed risk-off headline.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-game-inside-bar",
    title: "Gaming token prints an inside bar into a season drop",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE gaming token printed a wide bar, then a smaller bar fully inside that range. A season drop is still ahead. Thin chatter says the inside must break up. Practice data only — not a live exchange. Chase a break that has not printed, or wait?",
    newsHeadline:
      "Inside bar on the gaming token. Season drop still ahead. Thin chatter: must break up.",
    preOhlc: GAME_PRE,
    postOhlc: withAftermath(GAME_PRE, [
      bar("+1", 9.44, 9.56, 9.32, 9.4),
      bar("+2", 9.4, 9.54, 9.3, 9.46),
      bar("+3", 9.46, 9.58, 9.34, 9.42),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["buy", "sell"],
    debrief: {
      process:
        "An inside bar into a known drop is a wait. HOLD is the process answer until a side actually breaks. BUY or SELL is only partial if you already had a thesis and sized small. This is not a live gaming desk and not the RWA doji tape.",
      whyMarketMoved: "The inside range held; no clean break through the season-drop window.",
      evidence: "Gaming-token inside-bar tape plus a season-drop-still-ahead headline.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-stor-dump-no-reclaim",
    title: "DePIN storage token dumps on a capacity scare, no reclaim",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "This SAMPLE storage-network token already dumped. A capacity-outage scare hits. Name which side this coin is on: the storage supply, not a compute L2. The bounce has not shown up. Practice data only — not a live exchange.",
    newsHeadline:
      "Capacity-outage scare. Storage token in the brief, not an L2. Dump has not reclaimed.",
    preOhlc: STOR_PRE,
    postOhlc: withAftermath(STOR_PRE, [
      bar("+1", 0.136, 0.14, 0.126, 0.128),
      bar("+2", 0.128, 0.132, 0.118, 0.12),
      bar("+3", 0.12, 0.124, 0.11, 0.112),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Supply geopolitics is naming the side. This token is the storage network, so a capacity scare can keep pressure on. A dump with no reclaim is usually fade-or-wait, not a buy of the first red bar. HOLD if the dump already has your size. This is not a live DePIN desk and not the gaming-token inside-bar tape.",
      whyMarketMoved: "The dump continued; no bounce showed up after the capacity scare.",
      evidence: "DePIN storage dump-no-reclaim tape plus a supply-side outage headline.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-int-meme-flag",
    title: "Meme coin flags after influencer chase already in the price",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE meme coin already ran on influencer chat, then coiled in a tight flag. You have Indicators. Thin chatter says the flag must break higher. No protocol change. Ask whether the chase is already in the impulse, or whether a second leg is still unpaid. Practice data only — not a live exchange.",
    newsHeadline:
      "Influencer chase already ran. Tight flag. Thin chatter: must break up. No protocol change.",
    preOhlc: MEME_PRE,
    postOhlc: withAftermath(MEME_PRE, [
      bar("+1", 0.0091, 0.0093, 0.0082, 0.0084),
      bar("+2", 0.0084, 0.0086, 0.0076, 0.0078),
      bar("+3", 0.0078, 0.008, 0.007, 0.0072),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Intermediate work is naming what is already in the price. An impulse-and-flag after influencer volume is often late-chase, not a new path. Fade or wait; HOLD if the slip already has your size. This is not a live exchange, not the beginner BTC hype tape, and not the SOL extended-fade.",
      whyMarketMoved: "The flag broke down once the influencer chase stalled.",
      evidence: "Meme impulse-and-flag tape plus an influencer-already-ran headline.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "intermediate",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-int-gpu-wedge",
    title: "GPU-render token rising wedge after a compute scare already in the price",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE GPU-render token has been making higher highs in a tightening wedge after a compute-cluster outage scare. You have Indicators. Thin chatter says the squeeze must keep rising. No protocol change. Ask whether the scare is already in the highs. Practice data only — not a live exchange.",
    newsHeadline:
      "Compute-cluster scare already ran. Rising wedge. Thin chatter: squeeze must keep rising. No protocol change.",
    preOhlc: GPU_PRE,
    postOhlc: withAftermath(GPU_PRE, [
      bar("+1", 4.94, 4.98, 4.62, 4.68),
      bar("+2", 4.68, 4.74, 4.42, 4.48),
      bar("+3", 4.48, 4.54, 4.22, 4.28),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A rising wedge after a scare already in the highs is often late-chase, not a new path. Intermediate work is fading or waiting. HOLD if the slip already has your size. This is not a live GPU desk, not the meme flag, and not a 10-Q.",
      whyMarketMoved: "The wedge broke down once the compute-scare chase stalled.",
      evidence: "GPU-render rising-wedge tape plus a scare-already-ran headline.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "intermediate",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-int-did-vreclaim",
    title: "Identity token V-reclaim after a walked-back risk-off scare",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE identity token already dumped on a risk-off scare, then printed a second low that held. You have Indicators. The scare is walked back. No protocol change. Is the V a new dump, or a reclaim? Practice data only — not a live exchange.",
    newsHeadline:
      "Risk-off scare walked back. Identity-token second low held. No protocol change.",
    preOhlc: DID_PRE,
    postOhlc: withAftermath(DID_PRE, [
      bar("+1", 2.0, 2.08, 1.98, 2.06),
      bar("+2", 2.06, 2.14, 2.04, 2.12),
      bar("+3", 2.12, 2.18, 2.08, 2.16),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Intermediate work is naming the V: a second low that holds after a walked-back scare is a reclaim, not a new dump. HOLD if the bounce already has your size. This is not the high-beta alt bounce that failed into more risk-off, not the GPU wedge, and not a 10-Q.",
      whyMarketMoved: "The second low held and the identity token reclaimed after the scare was walked back.",
      evidence: "Identity-token V-reclaim tape plus a walked-back risk-off headline.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "intermediate",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-int-lend-round",
    title: "Lending token rounds over after a TVL scare already in the highs",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE lending token already ran on a TVL-outflow scare, then printed a lower high. You have Indicators. Thin chatter says the scare must keep the highs. No protocol change. Ask whether the scare is already in the round-top. Practice data only — not a live exchange.",
    newsHeadline:
      "TVL scare already ran. Lower high on the lending token. Thin chatter: highs must hold. No protocol change.",
    preOhlc: LEND_PRE,
    postOhlc: withAftermath(LEND_PRE, [
      bar("+1", 0.9, 0.92, 0.82, 0.84),
      bar("+2", 0.84, 0.86, 0.76, 0.78),
      bar("+3", 0.78, 0.8, 0.7, 0.72),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Intermediate work is naming what is already in the price. A round-top after a TVL scare is often late-chase, not a new path. Fade or wait; HOLD if the slip already has your size. This is not a live lending desk, not the beginner NFT volume round-top, not the meme flag, and not a 10-Q.",
      whyMarketMoved: "The lower-high structure continued lower once the TVL-scare chase stalled.",
      evidence: "Lending-token round-top tape plus a scare-already-ran headline.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "intermediate",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-ins-double-top",
    title: "Insurance token tags the same high twice into chase chatter",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE insurance token tagged nearly the same high twice and failed to break it. Thin chatter says the second tag must continue higher. No protocol change. Practice data only — not a live exchange. Chase or wait?",
    newsHeadline:
      "Thin chatter: second insurance-token tag must break higher. Highs are already equal. No protocol change.",
    preOhlc: INS_PRE,
    postOhlc: withAftermath(INS_PRE, [
      bar("+1", 6.16, 6.2, 5.92, 5.96),
      bar("+2", 5.96, 6.0, 5.74, 5.78),
      bar("+3", 5.78, 5.82, 5.56, 5.6),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Two equal highs that fail are late-chase, not a new path. Fade or wait; HOLD if you will not fade a SAMPLE insurance token. This is not the lending-token round-top, not the perp-DEX double-bottom, and not a live exchange.",
      whyMarketMoved: "The second high failed and the insurance token leaked lower.",
      evidence: "Insurance-token double-top tape plus weak-source chase chatter.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-int-name-three-push",
    title: "Naming-service token three-push into a registrar scare already in the highs",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE naming-service token already printed three successive pushes into the same high on a registrar-outage scare. You have Indicators. Thin chatter says the third push must break. No protocol change. Ask whether the scare is already in the three legs. Practice data only — not a live exchange.",
    newsHeadline:
      "Registrar scare already ran. Third naming-token push into the same high. Thin chatter: must break. No protocol change.",
    preOhlc: NAME_PRE,
    postOhlc: withAftermath(NAME_PRE, [
      bar("+1", 12.8, 12.9, 12.0, 12.1),
      bar("+2", 12.1, 12.2, 11.4, 11.5),
      bar("+3", 11.5, 11.6, 10.8, 10.9),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Intermediate work is naming what is already in the price. Three pushes into a registrar scare are often late-chase, not a new path. Fade or wait; HOLD if the slip already has your size. This is not the oracle staircase, not the insurance double-top, and not a live exchange.",
      whyMarketMoved: "The third push failed and the naming token leaked lower once the registrar-scare chase stalled.",
      evidence: "Naming-service three-push tape plus a scare-already-ran headline.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "intermediate",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-cdn-falling-wedge",
    title: "CDN token falling wedge after a peering scare already in the tape",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "This SAMPLE content-delivery token coiled into a falling wedge after a peering-outage scare. A scheduled operator note then says peering is restored and the outage was smaller than the scare. No protocol change. Name which side the token is on, then ask whether the scare is already in the wedge. Practice data only — not a live exchange.",
    newsHeadline:
      "Operator note: peering restored, outage smaller than the scare. Falling wedge still coiled. No protocol change.",
    preOhlc: CDN_PRE,
    postOhlc: withAftermath(CDN_PRE, [
      bar("+1", 4.38, 4.72, 4.36, 4.66),
      bar("+2", 4.66, 4.88, 4.6, 4.8),
      bar("+3", 4.8, 4.98, 4.74, 4.92),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A falling wedge after a peering scare that an operator note already bounded is often a wait-for-break, not a new shortage. The token is on the bandwidth-scare side; restored peering is less tight. HOLD if you will not buy a SAMPLE CDN token. This is not leftover protocol math, not the GPU rising wedge, not the naming-service three-push, and not a live exchange.",
      whyMarketMoved: "The wedge broke higher once the restored-peering note bounded the scare.",
      evidence: "CDN-token falling-wedge tape plus a smaller-outage operator note.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
];

export const OPTIONS_CONTEXT_CASES: CaseStudy[] = [
  {
    id: "case-optctx-into-event",
    title: "Stock coiled going into a known event",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "The stock is coiled going into a known event tomorrow. This is context for how options traders think. This app does not trade option chains.",
    newsHeadline: "Event tomorrow. Underlying coiled. Options context only.",
    preOhlc: UND_PRE,
    postOhlc: withAftermath(UND_PRE, [
      bar("+1", 190.0, 196.5, 189.2, 195.0),
      bar("+2", 195.0, 197.0, 192.0, 193.5),
      bar("+3", 193.5, 195.0, 191.0, 192.2),
    ]),
    correctActions: ["hold", "buy"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Event risk widens outcomes. We grade your stock decision. This app does not trade options.",
      whyMarketMoved: "The event gapped, then digested.",
      evidence: "Coiled stock plus an event brief. No live options chain.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-vol-spike",
    title: "After a high-volatility session",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "The stock just had a high-volatility session. That is why options can get expensive afterward. Still no chain trading here.",
    newsHeadline: "Volatility spike session. Fear premium. Context only.",
    preOhlc: [
      bar("T-5", 190.0, 191.0, 188.0, 189.0),
      bar("T-4", 189.0, 190.5, 186.0, 187.0),
      bar("T-3", 187.0, 188.5, 182.0, 183.5),
      bar("T-2", 183.5, 185.0, 178.0, 179.5),
      bar("T-1", 179.5, 184.0, 177.0, 182.0),
      bar("T0", 182.0, 186.0, 180.5, 184.5),
    ],
    postOhlc: withAftermath(
      [
        bar("T-5", 190.0, 191.0, 188.0, 189.0),
        bar("T-4", 189.0, 190.5, 186.0, 187.0),
        bar("T-3", 187.0, 188.5, 182.0, 183.5),
        bar("T-2", 183.5, 185.0, 178.0, 179.5),
        bar("T-1", 179.5, 184.0, 177.0, 182.0),
        bar("T0", 182.0, 186.0, 180.5, 184.5),
      ],
      [
        bar("+1", 184.5, 187.0, 183.0, 185.5),
        bar("+2", 185.5, 188.0, 184.0, 186.5),
        bar("+3", 186.5, 189.0, 185.0, 187.5),
      ],
    ),
    correctActions: ["hold"],
    acceptablePartial: ["buy", "sell"],
    debrief: {
      process:
        "After a volatility spike, the stock may chop. Hold is often the process answer when you have no clear edge. This app does not simulate options pricing.",
      whyMarketMoved: "The stock digested in a choppy range.",
      evidence: "Spike on the chart. Educational context only, no Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-event-coil-small",
    title: "Small-name coiled into a known event",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE small-name stock is coiled going into a known event tomorrow. Options traders care about the range. This app does not trade option chains.",
    newsHeadline: "Event tomorrow. Underlying coiled. Options context only.",
    preOhlc: EVENT_COIL_PRE,
    postOhlc: withAftermath(EVENT_COIL_PRE, [
      bar("+1", 74.7, 79.8, 74.2, 78.6),
      bar("+2", 78.6, 80.2, 76.4, 77.2),
      bar("+3", 77.2, 78.4, 75.8, 76.6),
    ]),
    correctActions: ["hold", "buy"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Event risk widens outcomes. We grade your stock decision. This app does not trade options.",
      whyMarketMoved: "The event expanded the range, then digested.",
      evidence: "Coiled small-name tape plus an event brief. No live chain.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-after-gap",
    title: "After the event gap, the stock settles",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "The known event already gapped this SAMPLE stock. Now it is settling. Chasing the first green bar after a gap is a different skill than sitting through the event. Still no chain here.",
    newsHeadline: "Event already printed. Gap is in. Settlement tape.",
    preOhlc: SETTLE_PRE,
    postOhlc: withAftermath(SETTLE_PRE, [
      bar("+1", 213.2, 214.8, 211.6, 212.4),
      bar("+2", 212.4, 213.6, 210.8, 211.6),
      bar("+3", 211.6, 212.8, 210.4, 211.2),
    ]),
    correctActions: ["hold", "sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "After a gap, wait for settlement unless you have a new fact. This app still does not simulate options prices.",
      whyMarketMoved: "The gap digested in a narrower range.",
      evidence: "Post-event settlement tape. Educational context only.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-vol-fail",
    title: "High-volatility session, then a failed bounce",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE stock had a high-volatility session. A bounce starts, then fails. That is why fear premium can stay high. Still no Greeks here.",
    newsHeadline: "Volatility spike, failed bounce. Fear premium context only.",
    preOhlc: [
      bar("T-5", 190.0, 191.0, 188.0, 189.0),
      bar("T-4", 189.0, 190.5, 186.0, 187.0),
      bar("T-3", 187.0, 188.5, 182.0, 183.5),
      bar("T-2", 183.5, 185.0, 178.0, 179.5),
      bar("T-1", 179.5, 184.0, 177.0, 182.0),
      bar("T0", 182.0, 186.0, 180.5, 184.5),
    ],
    postOhlc: withAftermath(
      [
        bar("T-5", 190.0, 191.0, 188.0, 189.0),
        bar("T-4", 189.0, 190.5, 186.0, 187.0),
        bar("T-3", 187.0, 188.5, 182.0, 183.5),
        bar("T-2", 183.5, 185.0, 178.0, 179.5),
        bar("T-1", 179.5, 184.0, 177.0, 182.0),
        bar("T0", 182.0, 186.0, 180.5, 184.5),
      ],
      [
        bar("+1", 185.5, 188.5, 184.8, 187.8),
        bar("+2", 187.8, 188.4, 183.2, 183.8),
        bar("+3", 183.8, 184.6, 181.4, 182.2),
      ],
    ),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A failed bounce after a volatility spike is a reason not to chase. Hold if you have no edge. This app does not price options.",
      whyMarketMoved: "The bounce failed and the stock slid again.",
      evidence: "Spike tape plus a failed bounce. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-headline-into-event",
    title: "Headline hits while the stock is coiled for an event",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "The stock is coiled for a known event. A separate product headline hits the same day. Two clocks: the event range and the headline. Still no chain.",
    newsHeadline: "Product headline the same day as a known event. Context only.",
    preOhlc: UND_PRE,
    postOhlc: withAftermath(UND_PRE, [
      bar("+1", 190.8, 194.0, 189.6, 193.2),
      bar("+2", 193.2, 194.4, 191.2, 192.0),
      bar("+3", 192.0, 193.0, 190.4, 191.2),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["buy", "sell"],
    debrief: {
      process:
        "A headline into a known event still widens outcomes. Hold is often process when you cannot separate the two clocks. No options trading here.",
      whyMarketMoved: "The coil expanded, then digested.",
      evidence: "Coiled underlying plus a same-day product headline.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-int-settle-fade",
    title: "Rich gap, thin new fact, settlement fade",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "The event already gapped this SAMPLE name. The follow-up headline is incremental. You have Indicators. Chase the leftover premium, or wait for settlement?",
    newsHeadline: "Incremental follow-up after a large gap. Settlement in focus.",
    preOhlc: SETTLE_PRE,
    postOhlc: withAftermath(SETTLE_PRE, [
      bar("+1", 212.0, 213.0, 206.4, 207.2),
      bar("+2", 207.2, 208.4, 204.8, 205.6),
      bar("+3", 205.6, 206.8, 203.6, 204.4),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "After a rich gap, incremental news is often a fade. Intermediate work is naming what is already in the gap. Still no chain.",
      whyMarketMoved: "Settlement sold as the follow-up added little.",
      evidence: "Post-gap tape plus an incremental headline.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "intermediate",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-int-coil-hold",
    title: "Coiled event, no edge on direction",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "The stock is coiled into a known event. You have no directional edge. Options traders might talk about buying range. This app still grades the stock choice only.",
    newsHeadline: "Event tomorrow. No directional edge in the brief. Context only.",
    preOhlc: EVENT_COIL_PRE,
    postOhlc: withAftermath(EVENT_COIL_PRE, [
      bar("+1", 74.2, 76.8, 71.4, 72.0),
      bar("+2", 72.0, 73.4, 70.6, 71.2),
      bar("+3", 71.2, 72.6, 70.2, 71.0),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["buy", "sell"],
    debrief: {
      process:
        "No edge into a binary event is a hold on the stock. Do not pretend a chain exists here.",
      whyMarketMoved: "The event broke the coil to the downside, then chopped.",
      evidence: "Tight coil plus an event brief with no directional fact.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "intermediate",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-int-vol-chop",
    title: "After the spike, implied fear vs a calm stock",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "Yesterday was a volatility spike. Today the SAMPLE stock is calmer. Fear in options-land can lag. You still cannot trade a chain here. What is the stock process?",
    newsHeadline: "Yesterday's spike. Today's stock is calmer. Context only.",
    preOhlc: [
      bar("T-5", 190.0, 191.0, 188.0, 189.0),
      bar("T-4", 189.0, 190.5, 186.0, 187.0),
      bar("T-3", 187.0, 188.5, 182.0, 183.5),
      bar("T-2", 183.5, 185.0, 178.0, 179.5),
      bar("T-1", 179.5, 184.0, 177.0, 182.0),
      bar("T0", 182.0, 186.0, 180.5, 184.5),
    ],
    postOhlc: withAftermath(
      [
        bar("T-5", 190.0, 191.0, 188.0, 189.0),
        bar("T-4", 189.0, 190.5, 186.0, 187.0),
        bar("T-3", 187.0, 188.5, 182.0, 183.5),
        bar("T-2", 183.5, 185.0, 178.0, 179.5),
        bar("T-1", 179.5, 184.0, 177.0, 182.0),
        bar("T0", 182.0, 186.0, 180.5, 184.5),
      ],
      [
        bar("+1", 184.2, 185.4, 183.6, 184.8),
        bar("+2", 184.8, 185.8, 184.0, 185.2),
        bar("+3", 185.2, 186.0, 184.4, 185.6),
      ],
    ),
    correctActions: ["hold"],
    acceptablePartial: ["buy", "sell"],
    debrief: {
      process:
        "A calmer stock after a spike is often a hold until you have a new fact. Do not invent an options trade.",
      whyMarketMoved: "The stock digested in a quiet range.",
      evidence: "Prior spike bars plus a calm follow-through. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "intermediate",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-print-coil",
    title: "Utility coiled into a scheduled inflation print",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "This SAMPLE rate-sensitive utility has coiled into a scheduled inflation print. Options traders talk about the range. This app grades the stock only — no chain, no Greeks. Buy, sell, or hold before the print hits.",
    newsHeadline:
      "Scheduled inflation print. Rate-sensitive SAMPLE utility coiled. Options context only.",
    preOhlc: PRINT_COIL_PRE,
    postOhlc: withAftermath(PRINT_COIL_PRE, [
      bar("+1", 42.2, 42.24, 40.8, 41.1),
      bar("+2", 41.1, 41.4, 40.4, 40.7),
      bar("+3", 40.7, 41.0, 40.1, 40.4),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["sell"],
    debrief: {
      process:
        "A tight coil into a known print is event risk, not a buy signal. Hold if you have no directional edge. Sell is only partial if you already treat this name as a rates loser and you sized for a miss. This app still does not price options.",
      whyMarketMoved: "The print came in hot and the rate-sensitive name dumped.",
      evidence: "Utility coil tape plus a scheduled inflation-print brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-strait-supply",
    title: "Importer coiled into a shipping-lane scare",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "This SAMPLE industrial imports through a named shipping lane. The stock has coiled. A strait-disruption scare hits. Options traders talk about the range. This app grades the stock only — name which side the name is on. No chain, no Greeks.",
    newsHeadline:
      "Shipping-lane disruption scare. SAMPLE importer in the brief. Options context only.",
    preOhlc: STRAIT_PRE,
    postOhlc: withAftermath(STRAIT_PRE, [
      bar("+1", 61.7, 61.85, 58.4, 58.9),
      bar("+2", 58.9, 59.4, 57.6, 58.1),
      bar("+3", 58.1, 58.6, 57.2, 57.5),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Supply geopolitics is naming the side. This name is the importer, so a lane scare can hurt the stock. Do not treat the coil as a cheap-vol buy. Hold if you already sized for more slide. Still no options chain here.",
      whyMarketMoved: "The coil broke lower as the importer sold the scare.",
      evidence: "Importer coil tape plus a shipping-lane headline. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-print-vs-headline",
    title: "Event already printed, then a product headline",
    contextType: "combined",
    thinkingMode: "combined_earnings_headline",
    brief:
      "The known event already printed and this SAMPLE name gapped. Same window: a product-safety headline hits. The print is the past. The headline is the path. Options traders talk leftover premium. This app grades the stock only — no chain, no income statement.",
    newsHeadline:
      "Event print already in. Product-safety headline the same window. Options context only.",
    preOhlc: POST_PRINT_PRE,
    postOhlc: withAftermath(POST_PRINT_PRE, [
      bar("+1", 99.2, 99.6, 94.4, 95.1),
      bar("+2", 95.1, 96.0, 93.2, 93.8),
      bar("+3", 93.8, 94.6, 92.4, 93.0),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    partialOnHorizonMismatch: true,
    debrief: {
      process:
        "Match the official print to the headline. A clean event print can still fail if the headline resets the path. Hold is fair if you sized for a longer event story and the print still holds. Do not invent an options trade or an income statement.",
      whyMarketMoved: "The post-gap digest broke lower as the product headline outweighed the print.",
      evidence: "Post-event digest tape plus print-vs-headline copy. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-rumor-note",
    title: "Event-cancel rumor, then a scheduled official note",
    contextType: "combined",
    thinkingMode: "combined_rumor_filing",
    brief:
      "This SAMPLE name already air-pocketed on chat that a known event was cancelled. Minutes later a scheduled official note says the event is still on track. Chat volume vs the note. Options traders talk the vol spike. This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Official note: event still on track. Denies a cancellation rumor. Options context only.",
    preOhlc: RUMOR_GAP_PRE,
    postOhlc: withAftermath(RUMOR_GAP_PRE, [
      bar("+1", 50.6, 53.2, 50.4, 52.8),
      bar("+2", 52.8, 53.8, 52.4, 53.4),
      bar("+3", 53.4, 54.0, 52.9, 53.6),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    partialOnHorizonMismatch: true,
    debrief: {
      process:
        "Separate rumor volume from what the official note actually says. Panic-selling a bounded cancellation claim is often a mistake if the event is still on. Hold is fair if you wait for the dump to prove it. Do not invent an options trade.",
      whyMarketMoved: "The stock reclaimed once the note bounded the scare.",
      evidence: "Air-pocket tape plus rumor vs a scheduled official note. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-int-jobs-run",
    title: "Homebuilder already ran into a jobs print",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "This SAMPLE homebuilder already ran into a scheduled jobs print. You have Indicators. Options traders talk leftover event premium. Map the print to rates, then to this name. This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Jobs print in focus. Rate-sensitive SAMPLE homebuilder already extended. Options context only.",
    preOhlc: BUILDER_PRE,
    postOhlc: withAftermath(BUILDER_PRE, [
      bar("+1", 118.8, 119.2, 112.4, 113.2),
      bar("+2", 113.2, 114.6, 110.8, 111.6),
      bar("+3", 111.6, 112.8, 109.4, 110.2),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Intermediate work is naming what is already in the run. A hot jobs print can reprice rates, and this name already paid up for easier policy. Do not chase leftover event premium as a buy. Hold if you sized for a miss. Still no options chain here.",
      whyMarketMoved: "The extended tape sold as the print came in hot.",
      evidence: "Homebuilder impulse tape plus a jobs-print brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "intermediate",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-int-producer-supply",
    title: "Energy producer already dumped into a supply scare",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "This SAMPLE energy producer already dumped. You have Indicators. A shipping/oil-supply scare hits. Name which side this name is on: producer, not the importer coil. Options traders talk the range. This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Supply-outage scare. SAMPLE producer in the brief, already dumped. Options context only.",
    preOhlc: PRODUCER_PRE,
    postOhlc: withAftermath(PRODUCER_PRE, [
      bar("+1", 86.0, 91.2, 85.6, 90.4),
      bar("+2", 90.4, 92.8, 89.6, 92.0),
      bar("+3", 92.0, 93.6, 91.2, 92.8),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Supply geopolitics is naming the side. Intermediate work is seeing the already-dumped producer, not the importer. A scarcity scare can bid this name. Hold if the dump already has your size. Do not invent an options trade.",
      whyMarketMoved: "The dump reversed as the producer caught a scarcity bid.",
      evidence: "Already-weak producer tape plus a supply-scare headline. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "intermediate",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-int-print-vs-cut",
    title: "Event print beats, then a contract-cut headline",
    contextType: "combined",
    thinkingMode: "combined_earnings_headline",
    brief:
      "This SAMPLE name already dumped into a known event. You have Indicators. The official event print beats. Same window: a large customer cuts the contract. The print is the past. The headline is the path. Options traders talk leftover premium. This app grades the stock only — no chain, no income statement.",
    newsHeadline:
      "Event print beats. Same window: large customer cuts the contract. Options context only.",
    preOhlc: BEAT_CUT_PRE,
    postOhlc: withAftermath(BEAT_CUT_PRE, [
      bar("+1", 24.1, 24.4, 22.4, 22.7),
      bar("+2", 22.7, 23.1, 21.8, 22.0),
      bar("+3", 22.0, 22.4, 21.4, 21.6),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    partialOnHorizonMismatch: true,
    debrief: {
      process:
        "Match the official print to the headline. Intermediate work is seeing that a beat can still fail if the cut resets demand, and the dump may already have the beat in. Hold is fair if you sized for a longer event story and the print still holds. Do not invent an options trade or an income statement.",
      whyMarketMoved: "The dump continued as the contract cut outweighed the beat.",
      evidence: "Already-weak tape plus print-vs-cut copy. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "intermediate",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-int-rumor-deny",
    title: "Takeover-chat run, then a scheduled official denial",
    contextType: "combined",
    thinkingMode: "combined_rumor_filing",
    brief:
      "This SAMPLE name already ran on takeover chat. You have Indicators. Minutes later a scheduled official note denies talks. Chat volume vs the note. Options traders talk leftover premium. This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Official note: no talks. Denies a takeover rumor. Options context only.",
    preOhlc: TAKEOVER_PRE,
    postOhlc: withAftermath(TAKEOVER_PRE, [
      bar("+1", 157.0, 157.8, 148.4, 149.2),
      bar("+2", 149.2, 150.6, 146.0, 146.8),
      bar("+3", 146.8, 148.0, 144.6, 145.4),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    partialOnHorizonMismatch: true,
    debrief: {
      process:
        "Separate rumor volume from what the official note actually says. Intermediate work is naming what is already in the run: chat is not a filed deal. Hold is fair if you wait for the dump to prove it. This is not the beginner cancel-rumor reclaim tape. Do not invent an options trade.",
      whyMarketMoved: "The run faded once the note denied talks.",
      evidence: "Takeover-run tape plus rumor vs a scheduled official denial. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "intermediate",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-fail-break",
    title: "Failed breakout on the underlying before an event",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE name poked above a range, then failed. A known event is still ahead. Options traders talk the range. Chasing the first green poke is a different skill than sitting through the event. This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Failed breakout on the underlying. Known event still ahead. Options context only.",
    preOhlc: FAIL_BRK_PRE,
    postOhlc: withAftermath(FAIL_BRK_PRE, [
      bar("+1", 80.6, 81.0, 78.8, 79.2),
      bar("+2", 79.2, 79.8, 78.2, 78.6),
      bar("+3", 78.6, 79.2, 77.8, 78.2),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A failed poke is usually fade-or-wait, not a chase. Hold if you have no edge into the event. Do not treat the first green bar as a breakout. Still no options chain here.",
      whyMarketMoved: "The poke failed and the stock slipped back through the range.",
      evidence: "Failed-breakout chop tape plus an event-still-ahead brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-round-top",
    title: "Round-top on the underlying into a known event",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE retailer already made a high, then a lower high. A known event is still ahead. Options traders talk leftover premium. Chasing the last high is a different skill than sitting through the event. This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Round-top on the underlying. Known event still ahead. Options context only.",
    preOhlc: ROUND_TOP_PRE,
    postOhlc: withAftermath(ROUND_TOP_PRE, [
      bar("+1", 33.6, 33.8, 32.4, 32.6),
      bar("+2", 32.6, 32.9, 32.0, 32.2),
      bar("+3", 32.2, 32.5, 31.6, 31.8),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A round-top into an event is usually fade-or-wait, not a chase of the last high. Hold if you have no edge into the event. Still no options chain here.",
      whyMarketMoved: "The lower-high structure continued lower through the event window.",
      evidence: "Retailer round-top tape plus an event-still-ahead brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-staircase",
    title: "Staircase of lower closes into a known event",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE software name has been stepping down, one lower close after another. A product-delay headline hits while a known event is still ahead. Options traders talk the range. This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Product-delay headline. Known event still ahead. Options context only.",
    preOhlc: STAIR_PRE,
    postOhlc: withAftermath(STAIR_PRE, [
      bar("+1", 16.58, 16.64, 16.32, 16.36),
      bar("+2", 16.36, 16.42, 16.14, 16.18),
      bar("+3", 16.18, 16.24, 15.98, 16.02),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A staircase of lower closes plus a delay headline can keep pressure on. Do not fade it just because it already moved. HOLD if the stairs already have your size. Still no options chain here.",
      whyMarketMoved: "The staircase continued as the delay headline kept the range one-way.",
      evidence: "Software staircase tape plus a product-delay brief into an event. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-expand-range",
    title: "Range on the underlying is getting wider into an event",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE biotech is swinging larger both ways into a known event. A risk-off headline is out, but the tape has not picked a side. Options traders talk the range. Do you force a trade, or wait? This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Risk-off tone. Known event still ahead. Tape is two-way. Options context only.",
    preOhlc: EXPAND_PRE,
    postOhlc: withAftermath(EXPAND_PRE, [
      bar("+1", 127.6, 133.8, 126.2, 132.8),
      bar("+2", 132.8, 134.0, 127.4, 128.2),
      bar("+3", 128.2, 133.2, 126.8, 127.4),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["sell", "buy"],
    debrief: {
      process:
        "An expanding range into an event is noise until a side holds. HOLD is the process answer. BUY or SELL is only partial if you already had a thesis and sized small. Still no options chain here.",
      whyMarketMoved: "The two-way swings continued; no clean one-way tape through the event window.",
      evidence: "Expanding biotech range plus a mixed risk-off brief into an event. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-open-drive",
    title: "Opening drive on the underlying after an overnight event",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE airline coiled overnight. The known event already printed. The next session opens with a wide drive. Options traders talk the range. Fade the first wide bar, wait, or follow it? This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Event already printed overnight. Opening drive on the underlying. Options context only.",
    preOhlc: DRIVE_PRE,
    postOhlc: withAftermath(DRIVE_PRE, [
      bar("+1", 48.6, 49.4, 48.4, 49.2),
      bar("+2", 49.2, 50.0, 49.0, 49.7),
      bar("+3", 49.7, 50.4, 49.4, 50.1),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A first wide bar after a printed event is a time-frame question, not an automatic fade. Do not fade it just because it looks extended. HOLD if the drive already has your size. Still no options chain here.",
      whyMarketMoved: "The opening drive continued as the overnight event stayed in the tape.",
      evidence: "Quiet overnight coil plus a wide opening-drive aftermath. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-double-bottom",
    title: "Double bottom on the underlying into a known event",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE hotel name dumped, bounced, then tested the same low again. The scare was later walked back. A known event is still ahead. Options traders talk the range. This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Scare walked back. Second low held. Known event still ahead. Options context only.",
    preOhlc: DBL_PRE,
    postOhlc: withAftermath(DBL_PRE, [
      bar("+1", 69.1, 70.8, 68.9, 70.4),
      bar("+2", 70.4, 71.6, 70.1, 71.2),
      bar("+3", 71.2, 72.0, 70.8, 71.6),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A second low that holds after a walked-back scare is a reclaim story, not a new dump. HOLD if the bounce already has your size. Still no options chain here.",
      whyMarketMoved: "The second low held and the stock reclaimed through the event window.",
      evidence: "Hotel double-bottom tape plus a walked-back scare into an event. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-outside-bar",
    title: "Outside bar on the underlying into a known event",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE regional bank printed a wide bar that took both sides, then closed weak. A known event is still ahead. Options traders talk the range. Chase the wick, wait, or take risk off? This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Outside bar on the underlying. Known event still ahead. Options context only.",
    preOhlc: OUT_PRE,
    postOhlc: withAftermath(OUT_PRE, [
      bar("+1", 29.2, 29.5, 28.6, 28.8),
      bar("+2", 28.8, 29.1, 28.4, 28.6),
      bar("+3", 28.6, 28.9, 28.2, 28.4),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "An outside bar that closes weak is usually fade-or-wait, not a chase of the upper wick. Hold if you have no edge into the event. Still no options chain here.",
      whyMarketMoved: "The weak close continued lower through the event window.",
      evidence: "Regional-bank outside-bar tape plus an event-still-ahead brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-doji-hold",
    title: "Doji on the underlying into a known event",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE REIT printed a doji: open and close almost the same, wicks both ways. A risk-off headline is out, but a known event is still ahead. Options traders talk the range. Do you force a trade, or wait? This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Doji on the underlying. Risk-off tone. Event still ahead. Options context only.",
    preOhlc: DOJI_PRE,
    postOhlc: withAftermath(DOJI_PRE, [
      bar("+1", 11.53, 11.62, 11.44, 11.48),
      bar("+2", 11.48, 11.58, 11.4, 11.54),
      bar("+3", 11.54, 11.64, 11.46, 11.5),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["sell", "buy"],
    debrief: {
      process:
        "A doji into an event is indecision. HOLD is the process answer until a side holds. BUY or SELL is only partial if you already had a thesis and sized small. Still no options chain here.",
      whyMarketMoved: "The tape stayed two-way after the doji; no clean one-way move through the event window.",
      evidence: "REIT doji tape plus a mixed risk-off brief into an event. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-dump-no-reclaim",
    title: "Dump on the underlying after the event, no reclaim",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE chip name already dumped after a known event printed. The bounce has not shown up. Options traders talk leftover premium. Buying the first red bar is a different skill than sitting out. This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Event already printed. Dump on the underlying has not reclaimed. Options context only.",
    preOhlc: DUMP_NR_PRE,
    postOhlc: withAftermath(DUMP_NR_PRE, [
      bar("+1", 222.2, 223.4, 216.0, 217.2),
      bar("+2", 217.2, 218.6, 212.4, 213.6),
      bar("+3", 213.6, 214.8, 209.0, 210.2),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A dump with no reclaim is usually fade-or-wait, not a buy of the first red bar. HOLD if the dump already has your size. Still no options chain here.",
      whyMarketMoved: "The dump continued; no bounce showed up after the event.",
      evidence: "Chip dump-no-reclaim tape plus a post-event brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-inside-bar",
    title: "Inside bar on the underlying into a known event",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE insurer printed a wide bar, then a smaller bar fully inside that range. A known event is still ahead. Options traders talk the coil. Chase a break that has not printed, or wait? This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Inside bar on the underlying. Known event still ahead. Options context only.",
    preOhlc: INSIDE_PRE,
    postOhlc: withAftermath(INSIDE_PRE, [
      bar("+1", 58.1, 58.6, 57.5, 57.8),
      bar("+2", 57.8, 58.4, 57.4, 58.0),
      bar("+3", 58.0, 58.5, 57.6, 57.9),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["buy", "sell"],
    debrief: {
      process:
        "An inside bar into an event is a wait. HOLD is the process answer until a side actually breaks. BUY or SELL is only partial if you already had a thesis and sized small. Still no options chain here.",
      whyMarketMoved: "The inside range held; no clean break through the event window.",
      evidence: "Insurer inside-bar tape plus an event-still-ahead brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-flag-hold",
    title: "Flag on the underlying into a known event",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE railroad ran, then coiled in a tight flag. A known event is still ahead. Thin chatter says the flag must break higher. Options traders talk the coil. Chase a break that has not printed, or wait? This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Flag on the underlying. Known event still ahead. Thin chatter: must break up. Options context only.",
    preOhlc: FLAG_PRE,
    postOhlc: withAftermath(FLAG_PRE, [
      bar("+1", 171.4, 172.4, 170.8, 171.0),
      bar("+2", 171.0, 172.0, 170.4, 171.6),
      bar("+3", 171.6, 172.6, 171.0, 171.2),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["buy", "sell"],
    debrief: {
      process:
        "A flag into an event is a wait until a side actually breaks. HOLD is the process answer. BUY or SELL is only partial if you already had a thesis and sized small. Still no options chain here.",
      whyMarketMoved: "The flag held; no clean break through the event window.",
      evidence: "Railroad flag tape plus an event-still-ahead brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-wedge-fade",
    title: "Rising wedge on the underlying into a known event",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE defense name has been making higher highs in a tightening wedge. A known event is still ahead. Thin chatter says the wedge must keep rising. Options traders talk leftover premium. Chase the squeeze, or wait? This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Rising wedge on the underlying. Known event still ahead. Thin chatter: must keep rising. Options context only.",
    preOhlc: WEDGE_PRE,
    postOhlc: withAftermath(WEDGE_PRE, [
      bar("+1", 324, 326, 316, 318),
      bar("+2", 318, 320, 310, 312),
      bar("+3", 312, 314, 304, 306),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A rising wedge into an event is often late-chase, not a new path. Fade or wait; do not buy the squeeze. HOLD if the slip already has your size. Still no options chain here.",
      whyMarketMoved: "The wedge broke down once the chase stalled.",
      evidence: "Defense rising-wedge tape plus an event-still-ahead brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-int-hotel-flag",
    title: "Hotel underlying flags after the event move is already in",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE hotel stock already ran through a known event, then coiled in a tight flag. You have Indicators. Thin chatter says leftover premium means the flag must break higher. Ask whether the event is already in the impulse. This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Event already printed. Tight flag on the hotel. Thin chatter: leftover premium must break up. Options context only.",
    preOhlc: HOTEL_PRE,
    postOhlc: withAftermath(HOTEL_PRE, [
      bar("+1", 87.6, 88.0, 84.8, 85.2),
      bar("+2", 85.2, 85.8, 83.0, 83.6),
      bar("+3", 83.6, 84.0, 81.4, 81.8),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Intermediate work is naming what is already in the price. An impulse-and-flag after the event has printed is often late-chase, not a new path. Fade or wait; HOLD if the slip already has your size. This is not the beginner railroad flag-wait (event still ahead), not leftover-premium math, and still no chain.",
      whyMarketMoved: "The flag broke down once the leftover-premium chase stalled.",
      evidence: "Hotel impulse-and-flag tape plus an event-already-printed brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "intermediate",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-int-casino-wedge",
    title: "Casino underlying rising wedge after the event move is already in",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE casino stock has been making higher highs in a tightening wedge after a known event already printed. You have Indicators. Thin chatter says leftover premium means the squeeze must keep rising. Ask whether the event is already in the highs. This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Event already printed. Rising wedge on the casino. Thin chatter: leftover premium must keep rising. Options context only.",
    preOhlc: CASINO_PRE,
    postOhlc: withAftermath(CASINO_PRE, [
      bar("+1", 46.2, 46.5, 44.6, 44.8),
      bar("+2", 44.8, 45.1, 43.4, 43.6),
      bar("+3", 43.6, 43.9, 42.2, 42.4),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A rising wedge after the event has printed is often late-chase, not a new path. Intermediate work is fading or waiting. HOLD if the slip already has your size. This is not the beginner defense wedge (event still ahead), not leftover-premium math, and still no chain.",
      whyMarketMoved: "The wedge broke down once the leftover-premium chase stalled.",
      evidence: "Casino rising-wedge tape plus an event-already-printed brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "intermediate",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-int-pay-vreclaim",
    title: "Payments underlying V-reclaim after a walked-back risk-off scare",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE payments processor already dumped on a risk-off scare, then printed a second low that held. You have Indicators. The scare is walked back. A known event already printed. Thin chatter talks leftover premium. Is the V a new dump, or a reclaim? This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Risk-off scare walked back. Payments second low held. Event already printed. Options context only.",
    preOhlc: PAY_PRE,
    postOhlc: withAftermath(PAY_PRE, [
      bar("+1", 101.6, 103.4, 101.2, 103.0),
      bar("+2", 103.0, 104.6, 102.6, 104.2),
      bar("+3", 104.2, 105.4, 103.8, 105.0),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Intermediate work is naming the V: a second low that holds after a walked-back scare is a reclaim, not a new dump. HOLD if the bounce already has your size. This is not the beginner hotel double-bottom (event still ahead), not the chip dump with no reclaim, not leftover-premium math, and still no chain.",
      whyMarketMoved: "The second low held and the payments name reclaimed after the scare was walked back.",
      evidence: "Payments V-reclaim tape plus a walked-back risk-off headline. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "intermediate",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-int-stream-round",
    title: "Streaming underlying rounds over after the event move is already in",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE streaming stock already ran through a known event, then printed a lower high. You have Indicators. Thin chatter says leftover premium means the highs must hold. Ask whether the event is already in the round-top. This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Event already printed. Lower high on the streamer. Thin chatter: leftover premium must hold the highs. Options context only.",
    preOhlc: STREAM_PRE,
    postOhlc: withAftermath(STREAM_PRE, [
      bar("+1", 20.0, 20.3, 18.6, 18.9),
      bar("+2", 18.9, 19.2, 17.6, 17.9),
      bar("+3", 17.9, 18.2, 16.8, 17.1),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Intermediate work is naming what is already in the price. A round-top after the event has printed is often late-chase, not a new path. Fade or wait; HOLD if the slip already has your size. This is not the beginner retailer round-top (event still ahead), not leftover-premium math, and still no chain.",
      whyMarketMoved: "The lower-high structure continued lower once the leftover-premium chase stalled.",
      evidence: "Streaming round-top tape plus an event-already-printed brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "intermediate",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-airl-double-top",
    title: "Airline underlying tags the same high twice into chase chatter",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE airline tagged nearly the same high twice and failed to break it. Thin chatter says leftover premium means the second tag must continue higher. A known event is still ahead. This app grades the stock only — no chain, no Greeks. Chase or wait?",
    newsHeadline:
      "Thin chatter: leftover premium, second tag must break higher. Highs are already equal. Known event still ahead. Options context only.",
    preOhlc: AIRL_PRE,
    postOhlc: withAftermath(AIRL_PRE, [
      bar("+1", 127.4, 128.0, 123.6, 124.2),
      bar("+2", 124.2, 124.8, 120.8, 121.4),
      bar("+3", 121.4, 122.0, 118.2, 118.8),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Two equal highs that fail are late-chase, not a new path. Fade or wait; HOLD if you will not fade a SAMPLE airline. This is not leftover-premium math, not the hotel double-bottom, not the streaming round-top, and still no chain.",
      whyMarketMoved: "The second high failed and the airline leaked lower through the event window.",
      evidence: "Airline double-top tape plus weak-source leftover-premium chatter. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-int-bio-three-push",
    title: "Biotech underlying three-push after the event move is already in",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE biotech already printed three successive pushes into the same high through a known readout. You have Indicators. Thin chatter says leftover premium means the third push must break. Ask whether the event is already in the three legs. This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Readout already printed. Third biotech push into the same high. Thin chatter: leftover premium must break it. Options context only.",
    preOhlc: BIO_PRE,
    postOhlc: withAftermath(BIO_PRE, [
      bar("+1", 88.8, 89.2, 85.4, 85.8),
      bar("+2", 85.8, 86.2, 82.6, 83.0),
      bar("+3", 83.0, 83.4, 80.2, 80.6),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Intermediate work is naming what is already in the price. Three pushes after the readout has printed are often late-chase, not a new path. Fade or wait; HOLD if the slip already has your size. This is not leftover-premium math, not the beginner airline double-top, not the staircase, and still no chain.",
      whyMarketMoved: "The third push failed and the biotech leaked lower once the leftover-premium chase stalled.",
      evidence: "Biotech three-push tape plus an event-already-printed brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "intermediate",
    assetClass: "option_context",
  },
];
