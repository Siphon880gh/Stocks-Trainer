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

/** Head and shoulders (higher head, weaker right shoulder) — not ZM double-top, ZO three-push, or ZR falling wedge. */
const RS_PRE: OHLC[] = [
  bar("T-5", 598, 604, 594, 602),
  bar("T-4", 602, 618, 600, 616),
  bar("T-3", 616, 618, 604, 608),
  bar("T-2", 608, 636, 606, 632),
  bar("T-1", 632, 634, 610, 614),
  bar("T0", 614, 626, 612, 622),
];

/** Head and shoulders on feeders — not RS canola H&S, LE opening drive, or HE outside bar. */
const GF_PRE: OHLC[] = [
  bar("T-5", 248, 252, 246, 250),
  bar("T-4", 250, 262, 249, 260),
  bar("T-3", 260, 262, 252, 254),
  bar("T-2", 254, 276, 253, 272),
  bar("T-1", 272, 274, 256, 258),
  bar("T0", 258, 268, 257, 264),
];

/** Tweezer top (two matching highs after a rally) — not ZW wheat air-pocket, RS canola H&S, or GF feeder H&S. */
const KE_PRE: OHLC[] = [
  bar("T-5", 548, 554, 544, 552),
  bar("T-4", 552, 568, 550, 566),
  bar("T-3", 566, 578, 564, 576),
  bar("T-2", 576, 588, 574, 584),
  bar("T-1", 584, 588, 572, 574),
  bar("T0", 574, 578, 564, 566),
];

/** Evening star (long green, small star, red close back) — not KE tweezer, ZR rice 18s wedge, or LE cattle drive. */
const DC_PRE: OHLC[] = [
  bar("T-5", 17.12, 17.18, 17.08, 17.16),
  bar("T-4", 17.16, 17.28, 17.14, 17.26),
  bar("T-3", 17.26, 17.4, 17.24, 17.38),
  bar("T-2", 17.38, 17.54, 17.36, 17.52),
  bar("T-1", 17.52, 17.56, 17.5, 17.51),
  bar("T0", 17.51, 17.53, 17.36, 17.38),
];

/** Opening drive higher on long bonds (flight-to-duration) — not ZN 111 double-bottom, LE cattle drive, or KE tweezer. */
const ZB_PRE: OHLC[] = [
  bar("T-5", 124.12, 124.22, 124.04, 124.16),
  bar("T-4", 124.16, 124.26, 124.08, 124.2),
  bar("T-3", 124.2, 124.28, 124.12, 124.22),
  bar("T-2", 124.22, 124.3, 124.14, 124.24),
  bar("T-1", 124.24, 124.32, 124.16, 124.26),
  bar("T0", 124.26, 125.8, 124.22, 125.62),
];

/** Tight coil into a scheduled print — not ZB 124 opening drive, ZN 111 double-bottom, or LE cattle drive. */
const ZF_PRE: OHLC[] = [
  bar("T-5", 106.42, 106.52, 106.36, 106.48),
  bar("T-4", 106.48, 106.56, 106.4, 106.5),
  bar("T-3", 106.5, 106.58, 106.42, 106.52),
  bar("T-2", 106.52, 106.58, 106.44, 106.54),
  bar("T-1", 106.54, 106.6, 106.46, 106.56),
  bar("T0", 106.56, 106.62, 106.48, 106.58),
];

/** Mild grind then a smelter-outage scare — not ZB 124 opening drive, ZF 106 coil, or CL weak-then-bid. */
const ALI_PRE: OHLC[] = [
  bar("T-5", 2484, 2492, 2478, 2488),
  bar("T-4", 2488, 2498, 2482, 2494),
  bar("T-3", 2494, 2504, 2488, 2500),
  bar("T-2", 2500, 2510, 2494, 2506),
  bar("T-1", 2506, 2516, 2500, 2512),
  bar("T0", 2512, 2522, 2506, 2518),
];

/** Dump with no reclaim — not ZB 124 opening drive, ZF 106 coil, ALI 2484 grind, NQ 17680 slide, or NKD 32840 dump. */
const HRC_PRE: OHLC[] = [
  bar("T-5", 842, 848, 828, 832),
  bar("T-4", 832, 838, 818, 822),
  bar("T-3", 822, 828, 808, 812),
  bar("T-2", 812, 818, 798, 802),
  bar("T-1", 802, 808, 788, 792),
  bar("T0", 792, 798, 778, 782),
];

/** Evening star (long green, small star, red close back) — not DC milk evening star, ZB duration drive, ZF CPI coil, ALI smelter grind, HRC dump, NQ 17680 slide, or NKD dump. */
const EMD_PRE: OHLC[] = [
  bar("T-5", 2812, 2820, 2806, 2818),
  bar("T-4", 2818, 2834, 2814, 2830),
  bar("T-3", 2830, 2852, 2826, 2848),
  bar("T-2", 2848, 2878, 2844, 2874),
  bar("T-1", 2874, 2882, 2870, 2876),
  bar("T0", 2876, 2880, 2848, 2852),
];

/** Outside bar that closes weak — not ZB duration drive, ZF CPI coil, ALI smelter grind, HRC dump, EMD evening star, HE hog outside, ZT tape outside, or AUD/USD 0.66 risk-on grind. */
const A6_PRE: OHLC[] = [
  bar("T-5", 0.6714, 0.6722, 0.6706, 0.6718),
  bar("T-4", 0.6718, 0.6726, 0.671, 0.6722),
  bar("T-3", 0.6722, 0.6732, 0.6714, 0.6728),
  bar("T-2", 0.6728, 0.6738, 0.672, 0.6734),
  bar("T-1", 0.6734, 0.6744, 0.6726, 0.674),
  bar("T0", 0.674, 0.6776, 0.6708, 0.6716),
];

/** Failed range poke — not ZB duration drive, ZF CPI coil, ALI smelter grind, HRC dump, EMD evening star, 6A outside, 6B tape fail, KC coffee fail, or HG 4.x copper stall. */
const NI_PRE: OHLC[] = [
  bar("T-5", 16212, 16248, 16188, 16236),
  bar("T-4", 16236, 16272, 16212, 16264),
  bar("T-3", 16264, 16348, 16248, 16328),
  bar("T-2", 16328, 16372, 16256, 16272),
  bar("T-1", 16272, 16296, 16208, 16224),
  bar("T0", 16224, 16248, 16172, 16188),
];

/** Bearish engulfing (T0 body swallows T-1; high stays inside T-1) — not ZB duration drive, ZF CPI coil, ALI smelter grind, HRC dump, EMD evening star, 6A outside, NI fail, 6C tape engulf, or EUR/USD 1.08 risk-on grind. */
const E6_PRE: OHLC[] = [
  bar("T-5", 1.1124, 1.1148, 1.1112, 1.1142),
  bar("T-4", 1.1142, 1.1166, 1.1134, 1.116),
  bar("T-3", 1.116, 1.1178, 1.1152, 1.1172),
  bar("T-2", 1.1172, 1.1186, 1.1164, 1.1168),
  bar("T-1", 1.1168, 1.1192, 1.1162, 1.1186),
  bar("T0", 1.1188, 1.119, 1.1104, 1.1112),
];

/** Quiet then a wide opening drive — not KE tweezer, DC evening star, LE 169 cattle coil, or CL 76 weak dump. */
const BZ_PRE: OHLC[] = [
  bar("T-5", 84.12, 84.22, 84.04, 84.16),
  bar("T-4", 84.16, 84.26, 84.08, 84.2),
  bar("T-3", 84.2, 84.28, 84.12, 84.22),
  bar("T-2", 84.22, 84.3, 84.14, 84.24),
  bar("T-1", 84.24, 84.32, 84.16, 84.26),
  bar("T0", 84.26, 86.4, 84.22, 86.18),
];

/** Dump with no reclaim — not KE tweezer, DC evening star, BZ opening drive, or RB 1.7 gasoline dump. */
const NKD_PRE: OHLC[] = [
  bar("T-5", 32840, 32880, 32720, 32740),
  bar("T-4", 32740, 32780, 32620, 32640),
  bar("T-3", 32640, 32680, 32520, 32540),
  bar("T-2", 32540, 32580, 32420, 32440),
  bar("T-1", 32440, 32480, 32320, 32340),
  bar("T0", 32340, 32380, 32200, 32220),
];

/** Wide mother bar then insides that hold — not KE tweezer, DC evening star, BZ opening drive, NKD dump, ZW wheat air-pocket, or LB lumber inside. */
const MW_PRE: OHLC[] = [
  bar("T-5", 682, 686, 680, 684),
  bar("T-4", 684, 688, 682, 686),
  bar("T-3", 686, 698, 684, 696),
  bar("T-2", 694, 697, 690, 693),
  bar("T-1", 693, 696, 689, 692),
  bar("T0", 692, 695, 688, 691),
];

/** Outside bar that closes weak — not KE tweezer, DC evening star, BZ opening drive, NKD dump, MW inside, HE hog outside, ZB duration drive, or ZF CPI coil. */
const ZT_PRE: OHLC[] = [
  bar("T-5", 103.12, 103.18, 103.08, 103.14),
  bar("T-4", 103.14, 103.2, 103.1, 103.16),
  bar("T-3", 103.16, 103.22, 103.12, 103.18),
  bar("T-2", 103.18, 103.24, 103.14, 103.2),
  bar("T-1", 103.2, 103.26, 103.16, 103.22),
  bar("T0", 103.22, 103.48, 102.96, 103.08),
];

/** Failed range poke — not KE tweezer, DC evening star, BZ opening drive, NKD dump, MW inside, ZT outside, KC 248 coffee fail, or GBP/USD 1.26 dump. */
const B6_PRE: OHLC[] = [
  bar("T-5", 1.2814, 1.2836, 1.2806, 1.2832),
  bar("T-4", 1.2832, 1.2854, 1.2824, 1.2848),
  bar("T-3", 1.2848, 1.2892, 1.2842, 1.2884),
  bar("T-2", 1.2884, 1.2898, 1.2846, 1.2852),
  bar("T-1", 1.2852, 1.2864, 1.2822, 1.2828),
  bar("T0", 1.2828, 1.2838, 1.2804, 1.2812),
];

/** Bearish engulfing (T0 body swallows T-1; high stays inside T-1) — not KE tweezer, DC evening star, BZ opening drive, NKD dump, MW inside, ZT outside, 6B fail, 6A outside, HE hog outside, or EUR/NZD 1.80 engulf. */
const C6_PRE: OHLC[] = [
  bar("T-5", 0.7284, 0.7308, 0.7272, 0.7302),
  bar("T-4", 0.7302, 0.7326, 0.7294, 0.732),
  bar("T-3", 0.732, 0.7338, 0.7312, 0.7332),
  bar("T-2", 0.7332, 0.7346, 0.7324, 0.7328),
  bar("T-1", 0.7328, 0.7352, 0.7322, 0.7346),
  bar("T0", 0.7348, 0.735, 0.7264, 0.7272),
];

/** Shooting star (T0 small body near the lows, long upper wick; low stays inside T-1) — not KE tweezer, DC evening star, BZ opening drive, NKD dump, MW inside, ZT outside, 6B fail, 6C engulf, A6 0.67 outside, JPY 148s spot, or GBPNOK 13.6 tape star. */
const J6_PRE: OHLC[] = [
  bar("T-5", 0.006912, 0.006928, 0.006902, 0.006924),
  bar("T-4", 0.006924, 0.006942, 0.006916, 0.006938),
  bar("T-3", 0.006938, 0.006956, 0.00693, 0.006952),
  bar("T-2", 0.006952, 0.006968, 0.006944, 0.006964),
  bar("T-1", 0.006964, 0.006982, 0.006956, 0.006976),
  bar("T0", 0.006978, 0.007048, 0.00696, 0.006982),
];

/** Dark-cloud cover (T0 opens above T-1 close, closes in lower half of T-1 body but above T-1 open; low stays inside T-1) — not KE tweezer, DC evening star, BZ opening drive, NKD dump, MW inside, ZT outside, 6B fail, 6C engulf, 6J shooting star, NZDNOK 6.24 tape cloud, NZD_PRE 0.598 stall, or A6 0.67 outside. */
const N6_PRE: OHLC[] = [
  bar("T-5", 0.53842, 0.54086, 0.53718, 0.54024),
  bar("T-4", 0.54024, 0.54268, 0.53936, 0.54212),
  bar("T-3", 0.54212, 0.54486, 0.54104, 0.54428),
  bar("T-2", 0.54428, 0.54652, 0.54316, 0.54586),
  bar("T-1", 0.54586, 0.55092, 0.54472, 0.55004),
  bar("T0", 0.55018, 0.55146, 0.54524, 0.54708),
];

/** Three black crows (three falling red bodies after a grind; not one engulfing bar) — not KE tweezer, DC evening star, BZ opening drive, NKD dump, MW inside, ZT outside, 6B fail, 6C engulf, 6J shooting star, 6N dark-cloud, M6 0.048 macro cloud, or BRL_PRE 5.1 spot. */
const L6_PRE: OHLC[] = [
  bar("T-5", 0.18384, 0.18408, 0.18372, 0.18402),
  bar("T-4", 0.18402, 0.18432, 0.18394, 0.18426),
  bar("T-3", 0.18426, 0.18458, 0.18418, 0.18452),
  bar("T-2", 0.18448, 0.18454, 0.18398, 0.18406),
  bar("T-1", 0.18408, 0.18414, 0.18358, 0.18366),
  bar("T0", 0.18368, 0.18374, 0.18318, 0.18326),
];

/** Hanging man (T0 small body near the highs, long lower wick; high stays inside T-1) — not KE tweezer, DC evening star, BZ opening drive, NKD dump, MW inside, ZT outside, 6B fail, 6C engulf, 6J 0.0069 shooting star, 6N dark-cloud, L6 0.184 crows, GBPSEK 12.8 tape hanging man, or Z6 0.056 macro crows. */
const H6_PRE: OHLC[] = [
  bar("T-5", 0.12718, 0.12742, 0.12706, 0.12736),
  bar("T-4", 0.12736, 0.12768, 0.12728, 0.12762),
  bar("T-3", 0.12762, 0.12798, 0.12754, 0.12792),
  bar("T-2", 0.12792, 0.12828, 0.12784, 0.12822),
  bar("T-1", 0.12822, 0.12858, 0.12814, 0.12852),
  bar("T0", 0.12846, 0.12854, 0.12738, 0.12838),
];

/** Bearish harami (T-1 tall green, T0 small body inside T-1 body) — not MW inside-bar still-ahead, H6 hanging man, EURPLN 4.628 tape harami, P6 0.248 zloty hanging man, J6 0.0069 star, or L6 0.184 crows. */
const R6_PRE: OHLC[] = [
  bar("T-5", 0.011218, 0.011248, 0.011206, 0.011242),
  bar("T-4", 0.011242, 0.011278, 0.011228, 0.011272),
  bar("T-3", 0.011272, 0.011312, 0.011258, 0.011306),
  bar("T-2", 0.011306, 0.011348, 0.011292, 0.011342),
  bar("T-1", 0.011342, 0.011428, 0.011328, 0.011418),
  bar("T0", 0.011378, 0.011394, 0.011362, 0.011368),
];

/** Bearish marubozu after a grind (T0 long red, open near high, close near low, tiny wicks) — not 6C engulf, R6 0.0114 harami, H6 hanging man, 6J star, L6 crows, 6N cloud, T6 0.0315, EURCZK 25.4, or C6 0.73. */
const K6_PRE: OHLC[] = [
  bar("T-5", 0.09418, 0.09438, 0.09408, 0.09432),
  bar("T-4", 0.09432, 0.09458, 0.09422, 0.09452),
  bar("T-3", 0.09452, 0.09486, 0.09442, 0.09478),
  bar("T-2", 0.09478, 0.09518, 0.09468, 0.09508),
  bar("T-1", 0.09508, 0.09558, 0.09496, 0.09548),
  bar("T0", 0.09538, 0.09548, 0.09418, 0.09428),
];

/** Gravestone doji after a grind (T0 open≈close≈low, long upper wick; low stays inside T-1) — not 6J shooting star (small real body), K6 0.0948 marubozu, EURHUF 392 forex gravestone, H6 0.128 hanging man, R6 0.0114 harami, or INR_PRE 83 pause. */
const I6_PRE: OHLC[] = [
  bar("T-5", 0.21386, 0.21418, 0.21364, 0.21408),
  bar("T-4", 0.21408, 0.21448, 0.21392, 0.21438),
  bar("T-3", 0.21438, 0.21486, 0.21422, 0.21474),
  bar("T-2", 0.21474, 0.21528, 0.21456, 0.21516),
  bar("T-1", 0.21516, 0.21578, 0.21502, 0.21564),
  bar("T0", 0.21566, 0.21686, 0.21564, 0.21566),
];

/** Harami cross after a grind (T-1 tall green, T0 doji fully inside T-1 body) — not R6 harami (small real body), I6 gravestone, MW inside-bar still-ahead, GBPHUF 467 tape harami-cross, INR_PRE 83, or THB_PRE staircase. */
const IDR6_PRE: OHLC[] = [
  bar("T-5", 16186.4, 16198.2, 16174.8, 16194.6),
  bar("T-4", 16194.6, 16212.8, 16186.2, 16208.4),
  bar("T-3", 16208.4, 16232.6, 16198.4, 16226.8),
  bar("T-2", 16226.8, 16258.4, 16214.2, 16248.6),
  bar("T-1", 16248.6, 16296.8, 16236.4, 16284.2),
  bar("T0", 16264.8, 16268.4, 16261.2, 16265.2),
];

/** Spinning top after a grind (T0 small real body near the middle, similar upper and lower wicks) — not H6 hanging man, 6J shooting star, IDR harami-cross, I6 gravestone, W6 0.00073 won, PHP6 0.01753, or CLP_PRE 938 USD/CLP spot. */
const CLP6_PRE: OHLC[] = [
  bar("T-5", 0.0010482, 0.0010518, 0.0010464, 0.0010508),
  bar("T-4", 0.0010508, 0.0010552, 0.0010492, 0.0010544),
  bar("T-3", 0.0010544, 0.0010598, 0.0010526, 0.0010586),
  bar("T-2", 0.0010586, 0.0010654, 0.0010564, 0.0010642),
  bar("T-1", 0.0010642, 0.0010728, 0.0010618, 0.0010708),
  bar("T0", 0.0010686, 0.0010774, 0.0010616, 0.0010704),
];

/** Shooting star (T0 small body near the lows, long upper wick; low stays inside T-1) — not ZB duration drive, ZF CPI coil, ALI smelter grind, HRC dump, EMD evening star, 6A outside, NI fail, 6E engulf, 6J 0.0069 tape star, E6 1.11 engulf, or GBPCHF 1.12 evening star. */
const S6_PRE: OHLC[] = [
  bar("T-5", 1.2412, 1.2436, 1.2398, 1.2428),
  bar("T-4", 1.2428, 1.2458, 1.2414, 1.2452),
  bar("T-3", 1.2452, 1.2484, 1.2438, 1.2476),
  bar("T-2", 1.2476, 1.2504, 1.2462, 1.2496),
  bar("T-1", 1.2496, 1.2532, 1.2478, 1.2524),
  bar("T0", 1.2516, 1.2628, 1.2502, 1.2532),
];

/** Dark-cloud cover (T0 opens above T-1 close, closes in lower half of T-1 body but above T-1 open; low stays inside T-1) — not ZB duration drive, ZF CPI coil, ALI smelter grind, HRC dump, EMD evening star, 6A outside, NI fail, 6E engulf, 6S 1.24 macro star, N6 0.548 tape cloud, or CADNOK 7.66 macro cloud. */
const M6_PRE: OHLC[] = [
  bar("T-5", 0.04784, 0.04808, 0.04772, 0.04802),
  bar("T-4", 0.04802, 0.04828, 0.0479, 0.04822),
  bar("T-3", 0.04822, 0.04852, 0.0481, 0.04846),
  bar("T-2", 0.04846, 0.04868, 0.04834, 0.04862),
  bar("T-1", 0.04862, 0.04912, 0.04852, 0.04904),
  bar("T0", 0.0491, 0.04922, 0.04858, 0.04874),
];

/** Three black crows (three falling red bodies after a grind; not one engulfing bar) — not ZB duration drive, ZF CPI coil, ALI smelter grind, HRC dump, EMD evening star, 6A outside, NI fail, 6E engulf, 6S 1.24 macro star, M6 0.048 peso cloud, L6 0.184 tape crows, or ZAR_PRE 18.5 spot dump. */
const Z6_PRE: OHLC[] = [
  bar("T-5", 0.05584, 0.05608, 0.05572, 0.05602),
  bar("T-4", 0.05602, 0.05632, 0.05594, 0.05626),
  bar("T-3", 0.05626, 0.05658, 0.05618, 0.05652),
  bar("T-2", 0.05648, 0.05654, 0.05598, 0.05606),
  bar("T-1", 0.05608, 0.05614, 0.05558, 0.05566),
  bar("T0", 0.05568, 0.05574, 0.05518, 0.05526),
];

/** Hanging man (T0 small body near the highs, long lower wick; high stays inside T-1) — not ZB duration drive, ZF CPI coil, ALI smelter grind, HRC dump, EMD evening star, 6A outside, NI fail, 6E engulf, 6S 1.24 macro star, M6 0.048 peso cloud, Z6 0.0558 rand crows, H6 0.128 tape hanging man, or CADSEK 8.26 macro hanging man. */
const P6_PRE: OHLC[] = [
  bar("T-5", 0.24712, 0.24738, 0.24698, 0.24732),
  bar("T-4", 0.24732, 0.24764, 0.24722, 0.24758),
  bar("T-3", 0.24758, 0.24796, 0.24748, 0.24788),
  bar("T-2", 0.24788, 0.24828, 0.24778, 0.24818),
  bar("T-1", 0.24818, 0.24862, 0.24808, 0.24852),
  bar("T0", 0.24838, 0.24854, 0.24718, 0.24828),
];

/** Bearish harami after a grind (T-1 tall green, T0 small body inside T-1 body) — not ZB duration drive, ZF CPI coil, ALI smelter, HRC dump, EMD evening, 6A outside, NI fail, 6E engulf, 6S 1.24 star, M6 0.048 cloud, Z6 0.0558 crows, P6 0.248 hanging man, R6 0.0114 tape harami, GBPPLN 5.086, or TRY_PRE 32 spot wedge. */
const T6_PRE: OHLC[] = [
  bar("T-5", 0.031218, 0.031258, 0.031196, 0.031248),
  bar("T-4", 0.031248, 0.031298, 0.031226, 0.031286),
  bar("T-3", 0.031286, 0.031348, 0.031264, 0.031336),
  bar("T-2", 0.031336, 0.031408, 0.031314, 0.031394),
  bar("T-1", 0.031394, 0.031508, 0.031378, 0.031488),
  bar("T0", 0.031438, 0.031458, 0.031412, 0.031424),
];

/** Bearish marubozu after a grind (T0 long red, open near high, close near low, tiny wicks) — not 6E engulf, T6 0.0315 harami, P6 hanging man, 6S star, Z6 crows, M6 cloud, K6 0.0948 tape marubozu, KRW_PRE 1340 spot drive, or GBPCZK 30.2. */
const W6_PRE: OHLC[] = [
  bar("T-5", 0.0007186, 0.0007218, 0.0007164, 0.0007208),
  bar("T-4", 0.0007208, 0.0007246, 0.0007192, 0.0007238),
  bar("T-3", 0.0007238, 0.0007284, 0.0007222, 0.0007274),
  bar("T-2", 0.0007274, 0.0007328, 0.0007258, 0.0007316),
  bar("T-1", 0.0007316, 0.0007388, 0.0007298, 0.0007372),
  bar("T0", 0.0007358, 0.0007372, 0.0007186, 0.0007202),
];

/** Gravestone doji after a grind (T0 open≈close≈low, long upper wick; low stays inside T-1) — not 6S shooting star (small real body), W6 0.00073 marubozu, I6 0.215 tape gravestone, AUDPLN 2.67, H6 0.128 hanging man, M6 0.048 cloud, or T6 0.0315 harami. */
const DKK6_PRE: OHLC[] = [
  bar("T-5", 0.14418, 0.14462, 0.14396, 0.14448),
  bar("T-4", 0.14448, 0.14502, 0.14428, 0.14486),
  bar("T-3", 0.14486, 0.14552, 0.14464, 0.14536),
  bar("T-2", 0.14536, 0.14612, 0.14512, 0.14594),
  bar("T-1", 0.14594, 0.14688, 0.14568, 0.14672),
  bar("T0", 0.14674, 0.14858, 0.14668, 0.14674),
];

/** Harami cross after a grind (T-1 tall green, T0 doji fully inside T-1 body) — not T6 harami (small real body), DKK gravestone, IDR6 16265 tape harami-cross, R6 0.0114 ruble harami, PHP_PRE 56 USD/PHP cluster, or M6 0.048 Mexican-peso cloud. */
const PHP6_PRE: OHLC[] = [
  bar("T-5", 0.017186, 0.017248, 0.017142, 0.017228),
  bar("T-4", 0.017228, 0.017308, 0.017186, 0.017286),
  bar("T-3", 0.017286, 0.017386, 0.017238, 0.017362),
  bar("T-2", 0.017362, 0.017488, 0.017308, 0.017462),
  bar("T-1", 0.017462, 0.017628, 0.017408, 0.017598),
  bar("T0", 0.017528, 0.017548, 0.017508, 0.017532),
];

/** Spinning top after a grind (T0 small real body near the middle, similar upper and lower wicks) — not P6 hanging man, 6S shooting star, PHP harami-cross, DKK gravestone, CLP6 0.00107 tape spinning top, W6 0.00073, or EURHUF 392 spot. */
const HUF6_PRE: OHLC[] = [
  bar("T-5", 0.0024186, 0.0024268, 0.0024124, 0.0024248),
  bar("T-4", 0.0024248, 0.0024352, 0.0024196, 0.0024326),
  bar("T-3", 0.0024326, 0.0024468, 0.0024268, 0.0024438),
  bar("T-2", 0.0024438, 0.0024614, 0.0024368, 0.0024576),
  bar("T-1", 0.0024576, 0.0024798, 0.0024492, 0.0024748),
  bar("T0", 0.0024664, 0.0024928, 0.002448, 0.0024744),
];

/** Long-legged doji after a grind (T0 open≈close with long upper AND lower wicks of similar length) — not CLP spinning top (small real body), I6 gravestone, IDR harami-cross, HUF 0.00247 macro spinning top, W6 0.00073 won, or P6 0.248 zloty. */
const COP6_PRE: OHLC[] = [
  bar("T-5", 0.00025618, 0.00025742, 0.00025564, 0.00025708),
  bar("T-4", 0.00025708, 0.00025864, 0.00025642, 0.00025828),
  bar("T-3", 0.00025828, 0.00026018, 0.00025764, 0.00025972),
  bar("T-2", 0.00025972, 0.00026186, 0.00025896, 0.00026138),
  bar("T-1", 0.00026138, 0.00026392, 0.00026054, 0.00026328),
  bar("T0", 0.00026328, 0.00026614, 0.00026042, 0.00026328),
];

/** Long-legged doji after a grind (T0 open≈close with long upper AND lower wicks of similar length) — not HUF spinning top (small real body), DKK gravestone, PHP harami-cross, COP 0.000263 tape doji, CLP 0.00107 tape spinning top, P6 0.248 zloty, or NZDRON 3.13. */
const ILS6_PRE: OHLC[] = [
  bar("T-5", 0.30864, 0.31028, 0.30742, 0.30986),
  bar("T-4", 0.30986, 0.31218, 0.30868, 0.31164),
  bar("T-3", 0.31164, 0.31486, 0.31042, 0.31408),
  bar("T-2", 0.31408, 0.31824, 0.31286, 0.31728),
  bar("T-1", 0.31728, 0.32264, 0.31586, 0.32148),
  bar("T0", 0.32186, 0.32864, 0.31508, 0.32186),
];

/** Dragonfly doji after a grind (T0 open≈close≈high with a long lower wick only) — not P6 hanging man (small real body near the highs), DKK gravestone, ILS long-legged (wicks both ways), HUF spinning top, PEN 0.419 tape dragonfly, CNH_PRE 7.17 USD/CNH gap, PHP 0.01753 harami-cross, or AUD 0.66. */
const CNH6_PRE: OHLC[] = [
  bar("T-5", 0.13618, 0.13664, 0.13586, 0.13648),
  bar("T-4", 0.13648, 0.13708, 0.13618, 0.13686),
  bar("T-3", 0.13686, 0.13764, 0.13648, 0.13742),
  bar("T-2", 0.13742, 0.13828, 0.13708, 0.13808),
  bar("T-1", 0.13808, 0.13948, 0.13764, 0.13918),
  bar("T0", 0.13928, 0.13942, 0.13718, 0.13928),
];

/** Matching high after a grind (T-1 tall green, T0 small green sharing nearly the same high; T0 closes weak under that high) — not KE tweezer (not opposite-color bodies), 6S shooting star, CNH dragonfly, SGD 0.748 tape matching high, T6 0.0315 lira harami, THB_PRE 35 USD/THB staircase, PHP 0.01753, or NZDPLN 2.38. */
const THB6_PRE: OHLC[] = [
  bar("T-5", 0.026864, 0.026928, 0.026812, 0.026906),
  bar("T-4", 0.026906, 0.026998, 0.026858, 0.026972),
  bar("T-3", 0.026972, 0.027118, 0.026918, 0.027086),
  bar("T-2", 0.027086, 0.027286, 0.027028, 0.027248),
  bar("T-1", 0.027248, 0.027648, 0.027186, 0.027568),
  bar("T0", 0.027486, 0.027642, 0.027418, 0.027528),
];

/** Bearish belt hold after a grind (T0 opens at the high with no upper wick and sells off; lower wick allowed) — not W6 0.00073 marubozu (tiny wicks both ends), R6 0.0114 ruble harami, TWD6 0.033 tape belt hold, INR_PRE 83 USD/INR pause, THB6 0.0276 matching high, or CADCZK 22.42. */
const INR6_PRE: OHLC[] = [
  bar("T-5", 0.012086, 0.012164, 0.012018, 0.012128),
  bar("T-4", 0.012128, 0.012248, 0.012064, 0.012208),
  bar("T-3", 0.012208, 0.012386, 0.012148, 0.012338),
  bar("T-2", 0.012338, 0.012568, 0.012268, 0.012508),
  bar("T-1", 0.012508, 0.013248, 0.012418, 0.013086),
  bar("T0", 0.013168, 0.013168, 0.012586, 0.012848),
];

/** Dragonfly doji after a grind (T0 open≈close≈high with a long lower wick only) — not H6 hanging man (small real body near the highs), I6 gravestone, COP long-legged (wicks both ways), CLP spinning top, P6 0.248 zloty hanging man, ILS 0.322 macro doji, or AUDRON 3.35. */
const PEN6_PRE: OHLC[] = [
  bar("T-5", 0.40186, 0.40428, 0.39964, 0.40348),
  bar("T-4", 0.40348, 0.40664, 0.40128, 0.40586),
  bar("T-3", 0.40586, 0.41028, 0.40364, 0.40918),
  bar("T-2", 0.40918, 0.41464, 0.40686, 0.41328),
  bar("T-1", 0.41328, 0.42086, 0.41064, 0.41864),
  bar("T0", 0.41928, 0.41986, 0.40618, 0.41928),
];

/** Matching high after a grind (T-1 tall green, T0 small green sharing nearly the same high; T0 closes weak under that high) — not KE tweezer (not opposite-color bodies), 6J shooting star, PEN dragonfly, SGD_PRE 1.34 USD/SGD rumor, AUD 0.66, CNH 0.139 macro dragonfly, or A6 0.67 outside. */
const SGD6_PRE: OHLC[] = [
  bar("T-5", 0.73186, 0.73348, 0.73064, 0.73286),
  bar("T-4", 0.73286, 0.73518, 0.73168, 0.73468),
  bar("T-3", 0.73468, 0.73786, 0.73328, 0.73718),
  bar("T-2", 0.73718, 0.74168, 0.73568, 0.74086),
  bar("T-1", 0.74086, 0.74848, 0.73948, 0.74718),
  bar("T0", 0.74618, 0.74842, 0.74528, 0.74686),
];

/** Bearish belt hold after a grind (T0 opens at the high with no upper wick and sells off; lower wick allowed) — not K6 0.0948 marubozu (tiny wicks both ends), T6 0.0315 lira harami, THB6 0.0276 matching high, TWD_PRE 32 USD/TWD saucer, SGD 0.748 tape matching, or AUDCZK 15.62. */
const TWD6_PRE: OHLC[] = [
  bar("T-5", 0.032186, 0.032248, 0.032142, 0.032228),
  bar("T-4", 0.032228, 0.032318, 0.032186, 0.032298),
  bar("T-3", 0.032298, 0.032428, 0.032248, 0.032398),
  bar("T-2", 0.032398, 0.032586, 0.032348, 0.032548),
  bar("T-1", 0.032548, 0.033186, 0.032486, 0.033086),
  bar("T0", 0.033118, 0.033118, 0.032648, 0.032818),
];

/** Bearish separating lines after a grind (T-1 tall green, T0 long red that opens at nearly the same open as T-1 and sells off) — not TWD6 0.033 belt hold (opens at T0 high), K6 0.0948 marubozu, SGD 0.748 matching high, THB6 0.0276, INR6 0.0132, Z6 0.0558 rand crows, or NZDCZK 27.20 spot tape. */
const CZK6_PRE: OHLC[] = [
  bar("T-5", 0.15428, 0.15586, 0.15364, 0.15518),
  bar("T-4", 0.15518, 0.15748, 0.15486, 0.15686),
  bar("T-3", 0.15686, 0.16028, 0.15618, 0.15948),
  bar("T-2", 0.15948, 0.16486, 0.15864, 0.16386),
  bar("T-1", 0.16386, 0.17648, 0.16218, 0.17428),
  bar("T0", 0.16408, 0.16686, 0.15248, 0.15568),
];

/** Bearish separating lines after a grind (T-1 tall green, T0 long red that opens at nearly the same open as T-1 and sells off) — not INR6 0.0132 belt hold (opens at T0 high), CZK6 0.164 tape separating lines, TWD6 0.033, ILS 0.322, PEN 0.419, P6 0.248, or CADRON 3.63 spot. */
const RON6_PRE: OHLC[] = [
  bar("T-5", 0.48618, 0.48964, 0.48386, 0.48828),
  bar("T-4", 0.48828, 0.49386, 0.48564, 0.49218),
  bar("T-3", 0.49218, 0.49948, 0.48928, 0.49764),
  bar("T-2", 0.49764, 0.50886, 0.49418, 0.50628),
  bar("T-1", 0.50628, 0.52864, 0.50286, 0.52418),
  bar("T0", 0.50718, 0.51286, 0.48864, 0.49428),
];

/** Bearish on-neck after a grind (T-1 tall green, T0 long red opens above T-1 close and closes at nearly the T-1 low) — not CZK6 0.164 separating lines (those share T-1 open), N6 0.550 kiwi dark-cloud, DKK6 0.146 gravestone, K6 0.0948 marubozu, EURDKK 7.41 spot on-neck, or H6 0.128 hanging man. */
const NOK6_PRE: OHLC[] = [
  bar("T-5", 0.11286, 0.11348, 0.11228, 0.11318),
  bar("T-4", 0.11318, 0.11396, 0.11264, 0.11368),
  bar("T-3", 0.11368, 0.11486, 0.11318, 0.11448),
  bar("T-2", 0.11448, 0.11628, 0.11386, 0.11586),
  bar("T-1", 0.11586, 0.11948, 0.11518, 0.11864),
  bar("T0", 0.11918, 0.11986, 0.11486, 0.11528),
];

/** Bearish on-neck after a grind (T-1 tall green, T0 long red opens above T-1 close and closes at nearly the T-1 low) — not RON6 0.507 separating lines (those share T-1 open), NOK6 0.119 tape on-neck, INR6 0.0132 belt hold, W6 0.00073 won marubozu, DKK6 0.146 gravestone, or AUDDKK 4.55 spot. */
const ISK6_PRE: OHLC[] = [
  bar("T-5", 0.006848, 0.006886, 0.006812, 0.006872),
  bar("T-4", 0.006872, 0.006928, 0.006848, 0.006908),
  bar("T-3", 0.006908, 0.006986, 0.006868, 0.006958),
  bar("T-2", 0.006958, 0.007086, 0.006918, 0.007048),
  bar("T-1", 0.007048, 0.007286, 0.006986, 0.007218),
  bar("T0", 0.007258, 0.007312, 0.007002, 0.007018),
];

/** Bearish in-neck after a grind (T-1 tall green, T0 long red opens above T-1 close and closes at nearly the T-1 close, not the T-1 low) — not NOK6 0.119 on-neck (that closes at T-1 low), N6 0.550 kiwi dark-cloud, RON6 0.507 separating, SGD 0.748 matching, AUD 0.66, or GBPDKK 8.62 spot in-neck. */
const BGN6_PRE: OHLC[] = [
  bar("T-5", 0.8864, 0.8928, 0.8786, 0.8908),
  bar("T-4", 0.8908, 0.8986, 0.8848, 0.8964),
  bar("T-3", 0.8964, 0.9086, 0.8908, 0.9048),
  bar("T-2", 0.9048, 0.9228, 0.8986, 0.9186),
  bar("T-1", 0.9186, 0.9564, 0.9086, 0.9428),
  bar("T0", 0.9686, 0.9784, 0.9286, 0.9448),
];

/** Bearish thrusting after a grind (T-1 tall green, T0 long red opens above T-1 close and closes into the T-1 body above the midpoint) — not BGN 0.94 in-neck (closes at T-1 close), NOK6 0.119 on-neck, THB6 0.0276 matching, PHP6 0.0175 harami-cross, INR6 0.0132 belt, GEL 0.368 macro in-neck, or MEME 0.009. */
const UAH6_PRE: OHLC[] = [
  bar("T-5", 0.020186, 0.020428, 0.019968, 0.020348),
  bar("T-4", 0.020348, 0.020686, 0.020148, 0.020586),
  bar("T-3", 0.020586, 0.021048, 0.020368, 0.020918),
  bar("T-2", 0.020918, 0.021486, 0.020686, 0.021368),
  bar("T-1", 0.021368, 0.023248, 0.021086, 0.022648),
  bar("T0", 0.022948, 0.023186, 0.021668, 0.022268),
];

/** Bearish in-neck after a grind (T-1 tall green, T0 long red opens above T-1 close and closes at nearly the T-1 close, not the T-1 low) — not ISK6 0.0072 on-neck (that closes at T-1 low), ILS 0.322 long-legged, PEN 0.419 dragonfly, BGN 0.94 tape in-neck, P6 0.248 hanging, or NZDDKK 3.83 spot in-neck. */
const GEL6_PRE: OHLC[] = [
  bar("T-5", 0.33864, 0.34228, 0.33642, 0.34118),
  bar("T-4", 0.34118, 0.34586, 0.33868, 0.34464),
  bar("T-3", 0.34464, 0.35128, 0.34218, 0.34986),
  bar("T-2", 0.34986, 0.35864, 0.34728, 0.35648),
  bar("T-1", 0.35648, 0.37864, 0.35286, 0.36848),
  bar("T0", 0.38648, 0.39286, 0.35864, 0.37028),
];

/** Bearish thrusting after a grind (T-1 tall green, T0 long red opens above T-1 close and closes into the T-1 body above the midpoint) — not GEL 0.368 in-neck (closes at T-1 close), K6 0.0948 marubozu, NOK6 0.119 on-neck, UAH 0.0228 tape thrusting, BGN 0.94 tape in-neck, or H6 0.128 hanging. */
const MAD6_PRE: OHLC[] = [
  bar("T-5", 0.09864, 0.09928, 0.09818, 0.09908),
  bar("T-4", 0.09908, 0.10028, 0.09864, 0.09986),
  bar("T-3", 0.09986, 0.10148, 0.09928, 0.10108),
  bar("T-2", 0.10108, 0.10348, 0.10028, 0.10286),
  bar("T-1", 0.10286, 0.10648, 0.10218, 0.10528),
  bar("T0", 0.10618, 0.10686, 0.10348, 0.10448),
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

/** Falling wedge (lower highs, higher lows) — not TRY rising wedge, AUDJPY flag, or GBPNZD three-push. */
const EURCAD_PRE: OHLC[] = [
  bar("T-5", 1.492, 1.498, 1.488, 1.496),
  bar("T-4", 1.496, 1.497, 1.478, 1.48),
  bar("T-3", 1.48, 1.49, 1.479, 1.487),
  bar("T-2", 1.487, 1.489, 1.481, 1.483),
  bar("T-1", 1.483, 1.488, 1.482, 1.486),
  bar("T0", 1.486, 1.488, 1.484, 1.485),
];

/** Head and shoulders (higher head, weaker right shoulder) — not AUDCAD double-top, GBPNZD three-push, or EURCAD falling wedge. */
const NZDJPY_PRE: OHLC[] = [
  bar("T-5", 89.4, 89.8, 89.2, 89.6),
  bar("T-4", 89.6, 90.8, 89.5, 90.6),
  bar("T-3", 90.6, 90.8, 89.8, 90.0),
  bar("T-2", 90.0, 92.0, 89.9, 91.7),
  bar("T-1", 91.7, 91.8, 90.1, 90.3),
  bar("T0", 90.3, 91.2, 90.2, 90.8),
];

/** Tweezer top (two matching highs after a rally) — not NZDJPY H&S, EURCAD falling wedge, or EURJPY spike-fade. */
const GBPCAD_PRE: OHLC[] = [
  bar("T-5", 1.742, 1.748, 1.738, 1.746),
  bar("T-4", 1.746, 1.758, 1.744, 1.756),
  bar("T-3", 1.756, 1.768, 1.754, 1.766),
  bar("T-2", 1.766, 1.778, 1.764, 1.774),
  bar("T-1", 1.774, 1.778, 1.762, 1.764),
  bar("T0", 1.764, 1.768, 1.754, 1.756),
];

/** Evening star (long green, small star, red close back) — not GBPCAD tweezer, CADJPY harami, or EURJPY spike-fade. */
const GBPCHF_PRE: OHLC[] = [
  bar("T-5", 1.108, 1.114, 1.106, 1.112),
  bar("T-4", 1.112, 1.122, 1.11, 1.12),
  bar("T-3", 1.12, 1.132, 1.118, 1.13),
  bar("T-2", 1.13, 1.142, 1.128, 1.14),
  bar("T-1", 1.14, 1.144, 1.138, 1.139),
  bar("T0", 1.139, 1.141, 1.126, 1.128),
];

/** Quiet then a wide opening drive — not GBPCAD tweezer, GBPCHF evening star, or KRW 1340 shipping drive. */
const NZDCHF_PRE: OHLC[] = [
  bar("T-5", 0.5124, 0.5132, 0.5118, 0.5128),
  bar("T-4", 0.5128, 0.5136, 0.5122, 0.5132),
  bar("T-3", 0.5132, 0.514, 0.5126, 0.5136),
  bar("T-2", 0.5136, 0.5144, 0.513, 0.514),
  bar("T-1", 0.514, 0.5148, 0.5134, 0.5144),
  bar("T0", 0.5144, 0.5188, 0.5142, 0.5182),
];

/** Dump with no reclaim — not GBPCAD tweezer, GBPCHF evening star, NZDCHF opening drive, or CADJPY dump-harami. */
const CHFJPY_PRE: OHLC[] = [
  bar("T-5", 171.84, 171.96, 171.42, 171.48),
  bar("T-4", 171.48, 171.58, 170.92, 170.98),
  bar("T-3", 170.98, 171.08, 170.42, 170.48),
  bar("T-2", 170.48, 170.58, 169.92, 169.98),
  bar("T-1", 169.98, 170.08, 169.42, 169.48),
  bar("T0", 169.48, 169.58, 168.82, 168.88),
];

/** Wide mother bar then insides that hold — not GBPCAD tweezer, GBPCHF evening star, NZDCHF opening drive, CHFJPY dump, or CADJPY dump-harami. */
const CADCHF_PRE: OHLC[] = [
  bar("T-5", 0.6224, 0.6232, 0.6216, 0.6228),
  bar("T-4", 0.6228, 0.6238, 0.622, 0.6234),
  bar("T-3", 0.6234, 0.6262, 0.623, 0.6258),
  bar("T-2", 0.6254, 0.626, 0.6246, 0.6252),
  bar("T-1", 0.6252, 0.6258, 0.6244, 0.625),
  bar("T0", 0.625, 0.6256, 0.6242, 0.6248),
];

/** Outside bar that closes weak — not GBPCAD tweezer, GBPCHF evening star, NZDCHF opening drive, CHFJPY dump, CADCHF inside, or USD/CLP copper outside. */
const GBPAUD_PRE: OHLC[] = [
  bar("T-5", 1.918, 1.924, 1.914, 1.922),
  bar("T-4", 1.922, 1.928, 1.918, 1.926),
  bar("T-3", 1.926, 1.932, 1.922, 1.93),
  bar("T-2", 1.93, 1.936, 1.926, 1.932),
  bar("T-1", 1.932, 1.938, 1.928, 1.934),
  bar("T0", 1.934, 1.952, 1.916, 1.922),
];

/** Failed range poke — not GBPCAD tweezer, GBPCHF evening star, NZDCHF opening drive, CHFJPY dump, CADCHF inside, GBPAUD outside, EURCHF ceiling fail, or AUD/CAD double-top. */
const NZDCAD_PRE: OHLC[] = [
  bar("T-5", 0.8184, 0.8212, 0.8176, 0.8206),
  bar("T-4", 0.8206, 0.8238, 0.8198, 0.8232),
  bar("T-3", 0.8232, 0.8286, 0.8224, 0.8278),
  bar("T-2", 0.8278, 0.8292, 0.8236, 0.8244),
  bar("T-1", 0.8244, 0.8256, 0.8212, 0.8218),
  bar("T0", 0.8218, 0.8228, 0.8188, 0.8194),
];

/** Bearish engulfing (T0 body swallows T-1; high stays inside T-1) — not GBPCAD tweezer, GBPCHF evening star, NZDCHF opening drive, CHFJPY dump, CADCHF inside, GBPAUD outside, NZDCAD fail, or USD/CLP copper outside. */
const EURNZD_PRE: OHLC[] = [
  bar("T-5", 1.8024, 1.8048, 1.8012, 1.8042),
  bar("T-4", 1.8042, 1.8066, 1.8034, 1.806),
  bar("T-3", 1.806, 1.8078, 1.8052, 1.8072),
  bar("T-2", 1.8072, 1.8086, 1.8064, 1.8068),
  bar("T-1", 1.8068, 1.8092, 1.8062, 1.8086),
  bar("T0", 1.8088, 1.809, 1.8004, 1.8012),
];

/** Shooting star (T0 small body near the lows, long upper wick; low stays inside T-1) — not GBPCAD tweezer, GBPCHF evening star, NZDCHF opening drive, CHFJPY dump, CADCHF inside, GBPAUD outside, NZDCAD fail, EURNZD engulf, EURNOK 12 oil grind, or RENT 13 coil. */
const GBPNOK_PRE: OHLC[] = [
  bar("T-5", 13.624, 13.648, 13.612, 13.642),
  bar("T-4", 13.642, 13.666, 13.634, 13.66),
  bar("T-3", 13.66, 13.682, 13.652, 13.676),
  bar("T-2", 13.676, 13.698, 13.668, 13.692),
  bar("T-1", 13.692, 13.718, 13.684, 13.712),
  bar("T0", 13.714, 13.794, 13.698, 13.718),
];

/** Dark-cloud cover (T0 opens above T-1 close, closes in lower half of T-1 body but above T-1 open; low stays inside T-1) — not GBPCAD tweezer, GBPCHF evening star, NZDCHF opening drive, CHFJPY dump, CADCHF inside, GBPAUD outside, NZDCAD fail, EURNZD engulf, GBPNOK shooting star, AUDNOK 6.8 macro star, or EURNOK 12 oil grind. */
const NZDNOK_PRE: OHLC[] = [
  bar("T-5", 6.184, 6.208, 6.172, 6.202),
  bar("T-4", 6.202, 6.228, 6.19, 6.222),
  bar("T-3", 6.222, 6.252, 6.21, 6.246),
  bar("T-2", 6.246, 6.268, 6.234, 6.262),
  bar("T-1", 6.262, 6.312, 6.252, 6.304),
  bar("T0", 6.31, 6.322, 6.258, 6.274),
];

/** Three black crows (three falling red bodies after a grind; not one engulfing bar) — not GBPCAD tweezer, GBPCHF evening star, NZDCHF opening drive, CHFJPY dump, CADCHF inside, GBPAUD outside, NZDCAD fail, EURNZD engulf, GBPNOK shooting star, NZDNOK dark-cloud, EURSEK 11 expand, or AUDNOK 6.8 macro star. */
const NZDSEK_PRE: OHLC[] = [
  bar("T-5", 5.784, 5.808, 5.772, 5.802),
  bar("T-4", 5.802, 5.832, 5.794, 5.826),
  bar("T-3", 5.826, 5.858, 5.818, 5.852),
  bar("T-2", 5.848, 5.854, 5.798, 5.806),
  bar("T-1", 5.808, 5.814, 5.758, 5.766),
  bar("T0", 5.768, 5.774, 5.718, 5.726),
];

/** Hanging man (T0 small body near the highs, long lower wick; high stays inside T-1) — not GBPCAD tweezer, GBPCHF evening star, NZDCHF opening drive, CHFJPY dump, CADCHF inside, GBPAUD outside, NZDCAD fail, EURNZD engulf, GBPNOK 13.6 shooting star, NZDNOK dark-cloud, NZDSEK three-crows, EURSEK 11 expand, or EURNOK 12 oil grind. */
const GBPSEK_PRE: OHLC[] = [
  bar("T-5", 12.864, 12.888, 12.852, 12.882),
  bar("T-4", 12.882, 12.912, 12.874, 12.906),
  bar("T-3", 12.906, 12.938, 12.898, 12.932),
  bar("T-2", 12.932, 12.962, 12.924, 12.956),
  bar("T-1", 12.956, 12.988, 12.948, 12.982),
  bar("T0", 12.978, 12.984, 12.888, 12.972),
];

/** Bearish harami (T-1 tall green, T0 small body inside T-1 body) — not CADCHF inside-bar still-ahead, GBPSEK hanging man, CADJPY dump-harami, EURNZD engulf, NZDSEK crows, or NODE 4.18 tape crows. */
const EURPLN_PRE: OHLC[] = [
  bar("T-5", 4.518, 4.548, 4.506, 4.542),
  bar("T-4", 4.542, 4.576, 4.528, 4.568),
  bar("T-3", 4.568, 4.608, 4.554, 4.598),
  bar("T-2", 4.598, 4.638, 4.586, 4.628),
  bar("T-1", 4.628, 4.718, 4.618, 4.708),
  bar("T0", 4.672, 4.688, 4.658, 4.664),
];

/** Bearish marubozu after a grind (T0 long red, open near high, close near low, tiny wicks) — not EURNZD engulf, EURPLN 4.628 harami, GBPSEK hanging man, GBPNOK star, NZDSEK crows, NZDNOK cloud, GBPPLN 5.086, CABLE 68.5, or TILE 24.18. */
const EURCZK_PRE: OHLC[] = [
  bar("T-5", 25.186, 25.228, 25.164, 25.218),
  bar("T-4", 25.218, 25.268, 25.196, 25.258),
  bar("T-3", 25.258, 25.318, 25.236, 25.306),
  bar("T-2", 25.306, 25.378, 25.284, 25.364),
  bar("T-1", 25.364, 25.458, 25.348, 25.442),
  bar("T0", 25.428, 25.446, 25.186, 25.204),
];

/** Gravestone doji after a grind (T0 open≈close≈low, long upper wick; low stays inside T-1) — not GBPNOK shooting star (that has a small real body), EURCZK 25.4 marubozu, EURPLN 4.628 harami, GBPSEK hanging man, or LINTEL 74.2. */
const EURHUF_PRE: OHLC[] = [
  bar("T-5", 391.86, 392.18, 391.64, 392.08),
  bar("T-4", 392.08, 392.48, 391.92, 392.38),
  bar("T-3", 392.38, 392.86, 392.22, 392.74),
  bar("T-2", 392.74, 393.28, 392.56, 393.16),
  bar("T-1", 393.16, 393.78, 393.02, 393.64),
  bar("T0", 393.66, 394.86, 393.64, 393.66),
];

/** Harami cross after a grind (T-1 tall green, T0 doji fully inside T-1 body) — not EURPLN harami (small real body), EURHUF gravestone (open≈close≈low, long upper wick), CADCHF inside-bar still-ahead, GBPSEK hanging man, or GBPCZK 30.2. */
const GBPHUF_PRE: OHLC[] = [
  bar("T-5", 466.18, 466.48, 465.92, 466.36),
  bar("T-4", 466.36, 466.78, 466.14, 466.64),
  bar("T-3", 466.64, 467.18, 466.42, 467.02),
  bar("T-2", 467.02, 467.68, 466.78, 467.52),
  bar("T-1", 467.52, 468.48, 467.38, 468.28),
  bar("T0", 467.88, 467.96, 467.8, 467.89),
];

/** Spinning top after a grind (T0 small real body near the middle, similar upper and lower wicks) — not GBPSEK hanging man, GBPNOK shooting star, GBPHUF harami-cross, EURPLN harami, EURHUF gravestone, or CADCHF inside-bar still-ahead. */
const EURRON_PRE: OHLC[] = [
  bar("T-5", 4.914, 4.938, 4.898, 4.928),
  bar("T-4", 4.928, 4.958, 4.912, 4.948),
  bar("T-3", 4.948, 4.986, 4.928, 4.974),
  bar("T-2", 4.974, 5.018, 4.952, 5.006),
  bar("T-1", 5.006, 5.058, 4.986, 5.042),
  bar("T0", 5.036, 5.092, 4.992, 5.048),
];

/** Long-legged doji after a grind (T0 open≈close with long upper AND lower wicks of similar length) — not EURRON spinning top (small real body), EURHUF gravestone (open≈close≈low), GBPHUF harami-cross (doji inside T-1 body), CADRON 3.63 macro spinning top, or NZDSEK 5.86 crows. */
const GBPRON_PRE: OHLC[] = [
  bar("T-5", 5.614, 5.638, 5.598, 5.628),
  bar("T-4", 5.628, 5.658, 5.612, 5.648),
  bar("T-3", 5.648, 5.686, 5.628, 5.674),
  bar("T-2", 5.674, 5.718, 5.652, 5.706),
  bar("T-1", 5.706, 5.758, 5.686, 5.742),
  bar("T0", 5.748, 5.812, 5.684, 5.748),
];

/** Dragonfly doji after a grind (T0 open≈close≈high with a long lower wick only) — not GBPSEK hanging man (small real body near the highs), EURHUF gravestone (open≈close≈low), GBPRON long-legged (wicks both ways), EURRON spinning top, CADRON 3.63, or NZDRON 3.13. */
const AUDRON_PRE: OHLC[] = [
  bar("T-5", 3.1864, 3.2148, 3.1686, 3.2068),
  bar("T-4", 3.2068, 3.2386, 3.1924, 3.2284),
  bar("T-3", 3.2284, 3.2684, 3.2146, 3.2568),
  bar("T-2", 3.2568, 3.3086, 3.2418, 3.2942),
  bar("T-1", 3.2942, 3.3586, 3.2784, 3.3428),
  bar("T0", 3.3486, 3.3518, 3.2486, 3.3486),
];

/** Matching high after a grind (T-1 tall green, T0 small green sharing nearly the same high; T0 closes weak under that high) — not GBPCAD tweezer (not opposite-color bodies), GBPNOK shooting star, AUDRON dragonfly, EURHUF 392 gravestone, GBPHUF 467 harami-cross, NZDHUF 228 macro harami-cross, or CADHUF 268 macro dragonfly. */
const AUDHUF_PRE: OHLC[] = [
  bar("T-5", 211.18, 211.64, 210.86, 211.48),
  bar("T-4", 211.48, 212.18, 211.28, 211.96),
  bar("T-3", 211.96, 212.86, 211.68, 212.64),
  bar("T-2", 212.64, 213.68, 212.38, 213.42),
  bar("T-1", 213.42, 215.48, 213.18, 215.18),
  bar("T0", 214.86, 215.46, 214.58, 215.08),
];

/** Bearish belt hold after a grind (T0 opens at the high with no upper wick and sells off; lower wick allowed) — not EURCZK 25.4 marubozu (tiny wicks both ends), GBPCZK 30.2, AUDHUF 215 matching high, GBPSEK hanging man, GBPNOK shooting star, or AUDSEK 7.18. */
const AUDCZK_PRE: OHLC[] = [
  bar("T-5", 14.864, 14.928, 14.812, 14.906),
  bar("T-4", 14.906, 15.018, 14.858, 14.972),
  bar("T-3", 14.972, 15.148, 14.918, 15.086),
  bar("T-2", 15.086, 15.348, 15.028, 15.286),
  bar("T-1", 15.286, 15.686, 15.218, 15.568),
  bar("T0", 15.618, 15.618, 15.186, 15.328),
];

/** Bearish separating lines after a grind (T-1 tall green, T0 long red that opens at nearly the same open as T-1 and sells off) — not AUDCZK 15.62 belt hold (opens at T0 high), EURCZK 25.4 marubozu, GBPCZK 30.2, CADCZK 22.42, AUDHUF 215 matching high, or WITNESS 13.63. */
const NZDCZK_PRE: OHLC[] = [
  bar("T-5", 26.418, 26.568, 26.348, 26.528),
  bar("T-4", 26.528, 26.748, 26.468, 26.686),
  bar("T-3", 26.686, 26.948, 26.618, 26.868),
  bar("T-2", 26.868, 27.248, 26.798, 27.186),
  bar("T-1", 27.186, 28.748, 27.048, 28.486),
  bar("T0", 27.198, 27.368, 26.418, 26.748),
];

/** Bearish on-neck after a grind (T-1 tall green, T0 long red opens above T-1 close and closes at nearly the T-1 low) — not NZDCZK 27.20 separating lines (those share T-1 open), NZDNOK 6.31 dark-cloud (closes in lower half of T-1 body, not at T-1 low), AUDCZK 15.62 belt hold, AUDSEK 7.18 crows, or EURSEK 11 expand. */
const EURDKK_PRE: OHLC[] = [
  bar("T-5", 7.1864, 7.2086, 7.1648, 7.1986),
  bar("T-4", 7.1986, 7.2284, 7.1786, 7.2186),
  bar("T-3", 7.2186, 7.2648, 7.1984, 7.2486),
  bar("T-2", 7.2486, 7.3186, 7.2284, 7.2986),
  bar("T-1", 7.2986, 7.4186, 7.2684, 7.3864),
  bar("T0", 7.4128, 7.4386, 7.2486, 7.2728),
];

/** Bearish in-neck after a grind (T-1 tall green, T0 long red opens above T-1 close and closes at nearly the T-1 close, not the T-1 low) — not EURDKK 7.41 on-neck (that closes at T-1 low), AUDDKK 4.55 macro on-neck, NZDNOK 6.31 dark-cloud, NZDCZK 27.20 separating lines, GBPNOK 13.6 star, or EURSEK 11 expand. */
const GBPDKK_PRE: OHLC[] = [
  bar("T-5", 8.2864, 8.3128, 8.2648, 8.3048),
  bar("T-4", 8.3048, 8.3486, 8.2864, 8.3364),
  bar("T-3", 8.3364, 8.3986, 8.3128, 8.3786),
  bar("T-2", 8.3786, 8.4686, 8.3486, 8.4486),
  bar("T-1", 8.4486, 8.7286, 8.3986, 8.6186),
  bar("T0", 8.8486, 8.8864, 8.5486, 8.6228),
];

/** Bearish thrusting after a grind (T-1 tall green, T0 long red opens above T-1 close and closes into the T-1 body above the midpoint) — not GBPDKK 8.62 in-neck (closes at T-1 close), EURDKK 7.41 on-neck (closes at T-1 low), AUDSEK 7.18 crows, CADSEK 8.22 hanging, NZDNOK 6.31 dark-cloud, or AUDDKK 4.55. */
const CHFDKK_PRE: OHLC[] = [
  bar("T-5", 7.6486, 7.6684, 7.6286, 7.6628),
  bar("T-4", 7.6628, 7.6986, 7.6486, 7.6864),
  bar("T-3", 7.6864, 7.7486, 7.6684, 7.7286),
  bar("T-2", 7.7286, 7.8186, 7.6986, 7.7986),
  bar("T-1", 7.7986, 7.9684, 7.7686, 7.8986),
  bar("T0", 7.9486, 7.9784, 7.8186, 7.8686),
];

/** Harami after a dump (small inside bar, not a reclaim) — not GBPCAD tweezer, NZDJPY H&S, or JPY elevated dump. */
const CADJPY_PRE: OHLC[] = [
  bar("T-5", 108.4, 108.8, 108.2, 108.6),
  bar("T-4", 108.6, 108.9, 107.4, 107.6),
  bar("T-3", 107.6, 107.8, 106.2, 106.4),
  bar("T-2", 106.4, 106.6, 105.0, 105.2),
  bar("T-1", 105.2, 105.45, 105.08, 105.18),
  bar("T0", 105.18, 105.4, 104.6, 104.8),
];

/** Tight coil into a scheduled print — not CADJPY dump-harami, AUD 0.66 grind, or GBPCHF evening star. */
const AUDCHF_PRE: OHLC[] = [
  bar("T-5", 0.5724, 0.5732, 0.5718, 0.5728),
  bar("T-4", 0.5728, 0.5736, 0.5722, 0.573),
  bar("T-3", 0.573, 0.5738, 0.5724, 0.5732),
  bar("T-2", 0.5732, 0.5738, 0.5726, 0.5734),
  bar("T-1", 0.5734, 0.574, 0.5728, 0.5736),
  bar("T0", 0.5736, 0.5742, 0.573, 0.5738),
];

/** Mild grind then a supply scare — not CADJPY dump-harami, AUDCHF jobs coil, or KRW opening drive. */
const EURNOK_PRE: OHLC[] = [
  bar("T-5", 12.14, 12.22, 12.1, 12.18),
  bar("T-4", 12.18, 12.26, 12.14, 12.22),
  bar("T-3", 12.22, 12.3, 12.18, 12.26),
  bar("T-2", 12.26, 12.34, 12.22, 12.3),
  bar("T-1", 12.3, 12.38, 12.26, 12.34),
  bar("T0", 12.34, 12.42, 12.3, 12.38),
];

/** Dump with no reclaim — not CADJPY dump-harami, AUDCHF jobs coil, EURNOK oil grind, or USD/SGD 1.34 rumor coil. */
const AUDSGD_PRE: OHLC[] = [
  bar("T-5", 0.8784, 0.8792, 0.8768, 0.8772),
  bar("T-4", 0.8772, 0.878, 0.8754, 0.8758),
  bar("T-3", 0.8758, 0.8766, 0.874, 0.8744),
  bar("T-2", 0.8744, 0.8752, 0.8726, 0.873),
  bar("T-1", 0.873, 0.8738, 0.8712, 0.8716),
  bar("T0", 0.8716, 0.8724, 0.8698, 0.8702),
];

/** Evening star (long green, small star, red close back) — not GBPCHF Swiss evening star, CADJPY dump-harami, AUDCHF jobs coil, EURNOK oil grind, or AUDSGD dump. */
const NZDSGD_PRE: OHLC[] = [
  bar("T-5", 0.8084, 0.8096, 0.8078, 0.8092),
  bar("T-4", 0.8092, 0.8112, 0.8088, 0.8108),
  bar("T-3", 0.8108, 0.8134, 0.8104, 0.813),
  bar("T-2", 0.813, 0.8158, 0.8126, 0.8154),
  bar("T-1", 0.8154, 0.8162, 0.815, 0.8156),
  bar("T0", 0.8156, 0.816, 0.8128, 0.8132),
];

/** Outside bar that closes weak — not CADJPY harami, AUDCHF jobs coil, EURNOK oil grind, AUDSGD dump, NZDSGD evening star, GBPAUD tape outside, or USD/CLP copper outside. */
const EURSGD_PRE: OHLC[] = [
  bar("T-5", 1.4612, 1.4622, 1.4604, 1.4618),
  bar("T-4", 1.4618, 1.4628, 1.461, 1.4624),
  bar("T-3", 1.4624, 1.4634, 1.4616, 1.463),
  bar("T-2", 1.463, 1.464, 1.4622, 1.4636),
  bar("T-1", 1.4636, 1.4646, 1.4628, 1.4642),
  bar("T0", 1.4642, 1.4678, 1.4608, 1.4616),
];

/** Failed range poke — not CADJPY harami, AUDCHF jobs coil, EURNOK oil grind, AUDSGD dump, NZDSGD evening star, EURSGD outside, NZDCAD tape fail, or EURCHF ceiling fail. */
const GBPSGD_PRE: OHLC[] = [
  bar("T-5", 1.7124, 1.7152, 1.7112, 1.7146),
  bar("T-4", 1.7146, 1.7174, 1.7134, 1.7168),
  bar("T-3", 1.7168, 1.7224, 1.7158, 1.7212),
  bar("T-2", 1.7212, 1.7232, 1.7166, 1.7174),
  bar("T-1", 1.7174, 1.7188, 1.7138, 1.7146),
  bar("T0", 1.7146, 1.7158, 1.7112, 1.712),
];

/** Bearish engulfing (T0 body swallows T-1; high stays inside T-1) — not CADJPY harami, AUDCHF jobs coil, EURNOK oil grind, AUDSGD dump, NZDSGD evening star, EURSGD outside, GBPSGD fail, EUR/NZD 1.80 tape engulf, or USD/SGD 1.34 rumor. */
const CADSGD_PRE: OHLC[] = [
  bar("T-5", 0.9584, 0.9608, 0.9572, 0.9602),
  bar("T-4", 0.9602, 0.9626, 0.9594, 0.962),
  bar("T-3", 0.962, 0.9638, 0.9612, 0.9632),
  bar("T-2", 0.9632, 0.9646, 0.9624, 0.9628),
  bar("T-1", 0.9628, 0.9652, 0.9622, 0.9646),
  bar("T0", 0.9648, 0.965, 0.9564, 0.9572),
];

/** Shooting star (T0 small body near the lows, long upper wick; low stays inside T-1) — not CADJPY harami, AUDCHF jobs coil, EURNOK 12 oil grind, AUDSGD dump, NZDSGD evening star, EURSGD outside, GBPSGD fail, CADSGD engulf, GBPNOK 13.6 tape star, GATE 7.4 tape star, or TILE 24 tape star. */
const AUDNOK_PRE: OHLC[] = [
  bar("T-5", 6.812, 6.828, 6.798, 6.822),
  bar("T-4", 6.822, 6.842, 6.808, 6.836),
  bar("T-3", 6.836, 6.858, 6.824, 6.852),
  bar("T-2", 6.852, 6.872, 6.84, 6.866),
  bar("T-1", 6.866, 6.892, 6.854, 6.884),
  bar("T0", 6.878, 6.948, 6.862, 6.886),
];

/** Dark-cloud cover (T0 opens above T-1 close, closes in lower half of T-1 body but above T-1 open; low stays inside T-1) — not CADJPY harami, AUDCHF jobs coil, EURNOK 12 oil grind, AUDSGD dump, NZDSGD evening star, EURSGD outside, GBPSGD fail, CADSGD engulf, AUDNOK 6.8 macro star, NZDNOK 6.24 tape cloud, or GBPNOK 13.6 tape star. */
const CADNOK_PRE: OHLC[] = [
  bar("T-5", 7.584, 7.608, 7.572, 7.602),
  bar("T-4", 7.602, 7.628, 7.59, 7.622),
  bar("T-3", 7.622, 7.652, 7.61, 7.646),
  bar("T-2", 7.646, 7.668, 7.634, 7.662),
  bar("T-1", 7.662, 7.712, 7.652, 7.704),
  bar("T0", 7.71, 7.722, 7.658, 7.674),
];

/** Three black crows (three falling red bodies after a grind; not one engulfing bar) — not CADJPY harami, AUDCHF jobs coil, EURNOK 12 oil grind, AUDSGD dump, NZDSGD evening star, EURSGD outside, GBPSGD fail, CADSGD engulf, AUDNOK 6.8 macro star, CADNOK 7.66 dark-cloud, NZDSEK 5.86 tape crows, or EURSEK 11 expand. */
const AUDSEK_PRE: OHLC[] = [
  bar("T-5", 7.184, 7.208, 7.172, 7.202),
  bar("T-4", 7.202, 7.232, 7.194, 7.226),
  bar("T-3", 7.226, 7.258, 7.218, 7.252),
  bar("T-2", 7.248, 7.254, 7.198, 7.206),
  bar("T-1", 7.208, 7.214, 7.158, 7.166),
  bar("T0", 7.168, 7.174, 7.118, 7.126),
];

/** Hanging man (T0 small body near the highs, long lower wick; high stays inside T-1) — not CADJPY harami, AUDCHF jobs coil, EURNOK 12 oil grind, AUDSGD dump, NZDSGD evening star, EURSGD outside, GBPSGD fail, CADSGD engulf, AUDNOK 6.8 macro star, CADNOK 7.66 dark-cloud, AUDSEK 7.18 crows, or GBPSEK 12.8 tape hanging man. */
const CADSEK_PRE: OHLC[] = [
  bar("T-5", 8.216, 8.258, 8.194, 8.248),
  bar("T-4", 8.248, 8.302, 8.226, 8.288),
  bar("T-3", 8.288, 8.348, 8.266, 8.334),
  bar("T-2", 8.334, 8.398, 8.312, 8.384),
  bar("T-1", 8.384, 8.452, 8.362, 8.438),
  bar("T0", 8.422, 8.442, 8.248, 8.406),
];

/** Bearish harami after a grind (T-1 tall green, T0 small body inside T-1 body) — not CADJPY dump-harami, EURPLN 4.628 tape harami, CADSEK 8.26 hanging man, CADCHF still-ahead, or P6 0.248 zloty hanging man. */
const GBPPLN_PRE: OHLC[] = [
  bar("T-5", 5.018, 5.048, 5.006, 5.042),
  bar("T-4", 5.042, 5.078, 5.028, 5.072),
  bar("T-3", 5.072, 5.118, 5.058, 5.108),
  bar("T-2", 5.108, 5.158, 5.094, 5.148),
  bar("T-1", 5.148, 5.248, 5.136, 5.228),
  bar("T0", 5.186, 5.204, 5.168, 5.176),
];

/** Bearish marubozu after a grind (T0 long red, open near high, close near low, tiny wicks) — not CADSGD engulf, GBPPLN 5.086 harami, CADSEK hanging man, AUDNOK star, AUDSEK crows, CADNOK cloud, EURCZK 25.4 tape marubozu, or JOIST 43.7. */
const GBPCZK_PRE: OHLC[] = [
  bar("T-5", 29.864, 29.918, 29.838, 29.902),
  bar("T-4", 29.902, 29.968, 29.886, 29.954),
  bar("T-3", 29.954, 30.038, 29.936, 30.022),
  bar("T-2", 30.022, 30.118, 30.002, 30.098),
  bar("T-1", 30.098, 30.218, 30.078, 30.196),
  bar("T0", 30.178, 30.196, 29.928, 29.946),
];

/** Gravestone doji after a grind (T0 open≈close≈low, long upper wick; low stays inside T-1) — not AUDNOK shooting star (small real body), GBPCZK 30.2 marubozu, EURHUF 392 tape gravestone, PURLIN 63.4, GBPPLN 5.086 harami, or EURPLN 4.628. */
const AUDPLN_PRE: OHLC[] = [
  bar("T-5", 2.6418, 2.6472, 2.6386, 2.6458),
  bar("T-4", 2.6458, 2.6524, 2.6432, 2.6508),
  bar("T-3", 2.6508, 2.6586, 2.6482, 2.6568),
  bar("T-2", 2.6568, 2.6658, 2.6542, 2.6638),
  bar("T-1", 2.6638, 2.6758, 2.6612, 2.6736),
  bar("T0", 2.6738, 2.6924, 2.6734, 2.6738),
];

/** Harami cross after a grind (T-1 tall green, T0 doji fully inside T-1 body) — not GBPPLN harami (small real body), AUDPLN gravestone, GBPHUF 467 tape harami-cross, EURHUF 392, EURPLN 4.628, or CADCHF still-ahead. */
const NZDHUF_PRE: OHLC[] = [
  bar("T-5", 226.64, 226.98, 226.42, 226.86),
  bar("T-4", 226.86, 227.32, 226.68, 227.18),
  bar("T-3", 227.18, 227.74, 226.96, 227.58),
  bar("T-2", 227.58, 228.26, 227.34, 228.08),
  bar("T-1", 228.08, 229.02, 227.86, 228.84),
  bar("T0", 228.44, 228.52, 228.36, 228.46),
];

/** Spinning top after a grind (T0 small real body near the middle, similar upper and lower wicks) — not CADSEK hanging man, AUDNOK shooting star, NZDHUF harami-cross, AUDPLN gravestone, EURRON 5.05 tape spinning top, or CADCHF inside-bar still-ahead. */
const CADRON_PRE: OHLC[] = [
  bar("T-5", 3.5864, 3.5928, 3.5812, 3.5906),
  bar("T-4", 3.5906, 3.5984, 3.5858, 3.5968),
  bar("T-3", 3.5968, 3.6086, 3.5914, 3.6062),
  bar("T-2", 3.6062, 3.6218, 3.6004, 3.6186),
  bar("T-1", 3.6186, 3.6384, 3.6128, 3.6342),
  bar("T0", 3.6264, 3.6488, 3.6084, 3.6308),
];

/** Long-legged doji after a grind (T0 open≈close with long upper AND lower wicks of similar length) — not CADRON spinning top (small real body), AUDPLN gravestone, NZDHUF harami-cross, EURRON 5.05 tape spinning top, GBPRON 5.75 tape doji, or AUDPLN 2.67. */
const NZDRON_PRE: OHLC[] = [
  bar("T-5", 3.0428, 3.0564, 3.0318, 3.0512),
  bar("T-4", 3.0512, 3.0686, 3.0442, 3.0638),
  bar("T-3", 3.0638, 3.0864, 3.0568, 3.0796),
  bar("T-2", 3.0796, 3.1082, 3.0714, 3.0988),
  bar("T-1", 3.0988, 3.1364, 3.0896, 3.1246),
  bar("T0", 3.1288, 3.1684, 3.0892, 3.1288),
];

/** Dragonfly doji after a grind (T0 open≈close≈high with a long lower wick only) — not CADSEK hanging man (small real body near the highs), AUDPLN gravestone, NZDRON long-legged (wicks both ways), CADRON spinning top, NZDHUF 228 harami-cross, EURHUF 392 tape gravestone, GBPHUF 467 tape harami-cross, AUDRON 3.35 tape dragonfly, or HUF6 0.00247. */
const CADHUF_PRE: OHLC[] = [
  bar("T-5", 264.18, 264.86, 263.64, 264.62),
  bar("T-4", 264.62, 265.48, 264.28, 265.18),
  bar("T-3", 265.18, 266.24, 264.86, 265.96),
  bar("T-2", 265.96, 267.18, 265.64, 266.86),
  bar("T-1", 266.86, 268.48, 266.42, 268.12),
  bar("T0", 268.18, 268.42, 265.68, 268.18),
];

/** Matching high after a grind (T-1 tall green, T0 small green sharing nearly the same high; T0 closes weak under that high) — not GBPCAD tweezer (not opposite-color bodies), AUDNOK shooting star, CADHUF dragonfly, AUDHUF 215 tape matching high, AUDPLN 2.67 gravestone, GBPPLN 5.086 harami, EURPLN 4.628, NZDHUF 228, or P6 0.248 zloty. */
const NZDPLN_PRE: OHLC[] = [
  bar("T-5", 2.3186, 2.3248, 2.3142, 2.3228),
  bar("T-4", 2.3228, 2.3318, 2.3196, 2.3296),
  bar("T-3", 2.3296, 2.3428, 2.3264, 2.3408),
  bar("T-2", 2.3408, 2.3586, 2.3368, 2.3548),
  bar("T-1", 2.3548, 2.3848, 2.3518, 2.3786),
  bar("T0", 2.3728, 2.3842, 2.3686, 2.3764),
];

/** Bearish belt hold after a grind (T0 opens at the high with no upper wick and sells off; lower wick allowed) — not GBPCZK 30.2 marubozu (tiny wicks both ends), AUDCZK 15.62 tape belt hold, EURCZK 25.4 tape marubozu, NZDPLN 2.38 matching high, CADHUF 268 dragonfly, or GUTTER 18.82. */
const CADCZK_PRE: OHLC[] = [
  bar("T-5", 21.186, 21.268, 21.124, 21.248),
  bar("T-4", 21.248, 21.368, 21.186, 21.328),
  bar("T-3", 21.328, 21.518, 21.268, 21.472),
  bar("T-2", 21.472, 21.748, 21.398, 21.686),
  bar("T-1", 21.686, 22.486, 21.598, 22.318),
  bar("T0", 22.418, 22.418, 21.768, 22.018),
];

/** Bearish separating lines after a grind (T-1 tall green, T0 long red that opens at nearly the same open as T-1 and sells off) — not CADCZK 22.42 belt hold (opens at T0 high), NZDPLN 2.38 matching high, AUDPLN 2.67 gravestone, GBPPLN 5.086 harami, EURPLN 4.628, NZDCZK 27.20 tape, or CADRON 3.63. */
const CADPLN_PRE: OHLC[] = [
  bar("T-5", 2.6818, 2.7048, 2.6686, 2.6964),
  bar("T-4", 2.6964, 2.7286, 2.6848, 2.7186),
  bar("T-3", 2.7186, 2.7648, 2.7042, 2.7486),
  bar("T-2", 2.7486, 2.8186, 2.7284, 2.7986),
  bar("T-1", 2.7986, 2.9684, 2.7686, 2.9286),
  bar("T0", 2.8048, 2.8486, 2.6684, 2.7186),
];

/** Bearish on-neck after a grind (T-1 tall green, T0 long red opens above T-1 close and closes at nearly the T-1 low) — not CADPLN 2.80 separating lines (those share T-1 open), CADNOK 7.66 dark-cloud, CADCZK 22.42 belt hold, NZDPLN 2.38 matching high, EURDKK 7.41 tape on-neck, AUDNOK 6.8 star, or AUDSEK 7.18 crows. */
const AUDDKK_PRE: OHLC[] = [
  bar("T-5", 4.3286, 4.3484, 4.3128, 4.3428),
  bar("T-4", 4.3428, 4.3686, 4.3284, 4.3586),
  bar("T-3", 4.3586, 4.3984, 4.3426, 4.3864),
  bar("T-2", 4.3864, 4.4486, 4.3684, 4.4286),
  bar("T-1", 4.4286, 4.5686, 4.3986, 4.5186),
  bar("T0", 4.5486, 4.5864, 4.4086, 4.4128),
];

/** Bearish in-neck after a grind (T-1 tall green, T0 long red opens above T-1 close and closes at nearly the T-1 close, not the T-1 low) — not AUDDKK 4.55 on-neck (that closes at T-1 low), GBPDKK 8.62 tape in-neck, EURDKK 7.41 tape on-neck, CADNOK 7.66 dark-cloud, CADRON 3.63 spinning, NZDNOK 6.31 cloud, or NZDSEK 5.86 crows. */
const NZDDKK_PRE: OHLC[] = [
  bar("T-5", 3.6486, 3.6728, 3.6286, 3.6648),
  bar("T-4", 3.6648, 3.6986, 3.6486, 3.6864),
  bar("T-3", 3.6864, 3.7386, 3.6684, 3.7186),
  bar("T-2", 3.7186, 3.7986, 3.6986, 3.7686),
  bar("T-1", 3.7686, 3.9486, 3.7286, 3.8286),
  bar("T0", 3.9686, 4.0084, 3.7686, 3.8328),
];

/** Bearish thrusting after a grind (T-1 tall green, T0 long red opens above T-1 close and closes into the T-1 body above the midpoint) — not NZDDKK 3.83 in-neck (closes at T-1 close), AUDDKK 4.55 on-neck, EURPLN 4.628 harami, GBPPLN 5.086 harami, EURRON 5.05 spinning, or CHFDKK 7.87 tape thrusting. */
const CADDKK_PRE: OHLC[] = [
  bar("T-5", 4.7686, 4.7884, 4.7486, 4.7828),
  bar("T-4", 4.7828, 4.8186, 4.7686, 4.8084),
  bar("T-3", 4.8084, 4.8586, 4.7884, 4.8428),
  bar("T-2", 4.8428, 4.9086, 4.8186, 4.8886),
  bar("T-1", 4.8886, 4.9684, 4.8586, 4.9286),
  bar("T0", 4.9586, 4.9784, 4.8986, 4.9186),
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

/** Head and shoulders (higher head, weaker right shoulder) — not INS double-top, NAME three-push, or CDN falling wedge. */
const PRED_PRE: OHLC[] = [
  bar("T-5", 2.18, 2.24, 2.14, 2.22),
  bar("T-4", 2.22, 2.38, 2.2, 2.36),
  bar("T-3", 2.36, 2.38, 2.24, 2.28),
  bar("T-2", 2.28, 2.56, 2.26, 2.52),
  bar("T-1", 2.52, 2.54, 2.3, 2.34),
  bar("T0", 2.34, 2.46, 2.32, 2.42),
];

/** Head and shoulders on a royalty token — not PRED H&S, NFT round-top, or GAME inside bar. */
const ROYL_PRE: OHLC[] = [
  bar("T-5", 0.62, 0.65, 0.6, 0.64),
  bar("T-4", 0.64, 0.72, 0.63, 0.71),
  bar("T-3", 0.71, 0.72, 0.65, 0.66),
  bar("T-2", 0.66, 0.82, 0.65, 0.8),
  bar("T-1", 0.8, 0.81, 0.67, 0.68),
  bar("T0", 0.68, 0.76, 0.67, 0.74),
];

/** Tweezer top (two matching highs after a rally) — not ROYL H&S, CDN falling wedge, or PRED H&S. */
const ORBT_PRE: OHLC[] = [
  bar("T-5", 6.42, 6.48, 6.38, 6.46),
  bar("T-4", 6.46, 6.62, 6.44, 6.6),
  bar("T-3", 6.6, 6.74, 6.58, 6.72),
  bar("T-2", 6.72, 6.88, 6.7, 6.84),
  bar("T-1", 6.84, 6.88, 6.7, 6.72),
  bar("T0", 6.72, 6.76, 6.62, 6.64),
];

/** Evening star (long green, small star, red close back) — not ORBT tweezer, CARB harami, or L2 18s stall. */
const MESH_PRE: OHLC[] = [
  bar("T-5", 15.42, 15.58, 15.36, 15.54),
  bar("T-4", 15.54, 15.86, 15.48, 15.82),
  bar("T-3", 15.82, 16.18, 15.76, 16.14),
  bar("T-2", 16.14, 16.62, 16.08, 16.56),
  bar("T-1", 16.56, 16.64, 16.52, 16.58),
  bar("T0", 16.58, 16.62, 16.12, 16.18),
];

/** Harami after a dump (small inside bar, not a reclaim) — not ORBT tweezer, BTC risk-off dump, or RWA doji. */
const CARB_PRE: OHLC[] = [
  bar("T-5", 21.4, 21.8, 21.2, 21.6),
  bar("T-4", 21.6, 21.9, 20.4, 20.6),
  bar("T-3", 20.6, 20.8, 19.2, 19.4),
  bar("T-2", 19.4, 19.6, 18.0, 18.2),
  bar("T-1", 18.2, 18.45, 18.08, 18.18),
  bar("T0", 18.18, 18.4, 17.6, 17.8),
];

/** Tight coil into a scheduled print — not CARB dump-harami, MESH evening star, or L2 18s stall. */
const RENT_PRE: OHLC[] = [
  bar("T-5", 13.24, 13.32, 13.18, 13.28),
  bar("T-4", 13.28, 13.36, 13.22, 13.3),
  bar("T-3", 13.3, 13.38, 13.24, 13.32),
  bar("T-2", 13.32, 13.38, 13.26, 13.34),
  bar("T-1", 13.34, 13.4, 13.28, 13.36),
  bar("T0", 13.36, 13.42, 13.3, 13.38),
];

/** Mild grind then a brine-freeze scare — not CARB dump-harami, RENT CPI coil, or POW 84 grind-over. */
const LITH_PRE: OHLC[] = [
  bar("T-5", 0.424, 0.428, 0.421, 0.426),
  bar("T-4", 0.426, 0.431, 0.423, 0.429),
  bar("T-3", 0.429, 0.434, 0.426, 0.432),
  bar("T-2", 0.432, 0.437, 0.429, 0.435),
  bar("T-1", 0.435, 0.44, 0.432, 0.438),
  bar("T0", 0.438, 0.443, 0.435, 0.441),
];

/** Quiet then a wide opening drive — not ORBT tweezer, MESH evening star, RSTK 14 coil, or USDC peg wobble. */
const CUST_PRE: OHLC[] = [
  bar("T-5", 27.12, 27.22, 27.04, 27.16),
  bar("T-4", 27.16, 27.26, 27.08, 27.2),
  bar("T-3", 27.2, 27.28, 27.12, 27.22),
  bar("T-2", 27.22, 27.3, 27.14, 27.24),
  bar("T-1", 27.24, 27.32, 27.16, 27.26),
  bar("T0", 27.26, 28.48, 27.22, 28.32),
];

/** Dump with no reclaim — not ORBT tweezer, MESH evening star, CUST opening drive, or STOR 0.13 DePIN dump. */
const BAND_PRE: OHLC[] = [
  bar("T-5", 41.84, 41.96, 41.22, 41.28),
  bar("T-4", 41.28, 41.4, 40.62, 40.68),
  bar("T-3", 40.68, 40.8, 40.02, 40.08),
  bar("T-2", 40.08, 40.2, 39.42, 39.48),
  bar("T-1", 39.48, 39.6, 38.82, 38.88),
  bar("T0", 38.88, 39.0, 38.12, 38.18),
];

/** Dump with no reclaim — not CARB dump-harami, RENT CPI coil, LITH brine grind, BAND 41 dump, or BTC risk-off. */
const HIVE_PRE: OHLC[] = [
  bar("T-5", 52.84, 52.96, 52.22, 52.28),
  bar("T-4", 52.28, 52.4, 51.62, 51.68),
  bar("T-3", 51.68, 51.8, 51.02, 51.08),
  bar("T-2", 51.08, 51.2, 50.42, 50.48),
  bar("T-1", 50.48, 50.6, 49.82, 49.88),
  bar("T0", 49.88, 50.0, 49.12, 49.18),
];

/** Wide mother bar then insides that hold — not ORBT tweezer, MESH evening star, CUST opening drive, BAND dump, GAME gaming inside, or CARB dump-harami. */
const RELAY_PRE: OHLC[] = [
  bar("T-5", 3.24, 3.28, 3.22, 3.26),
  bar("T-4", 3.26, 3.32, 3.24, 3.3),
  bar("T-3", 3.3, 3.48, 3.28, 3.44),
  bar("T-2", 3.4, 3.46, 3.34, 3.38),
  bar("T-1", 3.38, 3.44, 3.32, 3.36),
  bar("T0", 3.36, 3.42, 3.3, 3.34),
];

/** Evening star (long green, small star, red close back) — not MESH treasury evening star, CARB dump-harami, RENT CPI coil, LITH brine grind, HIVE dump, or ORBT tweezer. */
const POOL_PRE: OHLC[] = [
  bar("T-5", 7.42, 7.48, 7.38, 7.46),
  bar("T-4", 7.46, 7.58, 7.44, 7.56),
  bar("T-3", 7.56, 7.72, 7.54, 7.7),
  bar("T-2", 7.7, 7.92, 7.68, 7.88),
  bar("T-1", 7.88, 7.94, 7.86, 7.9),
  bar("T0", 7.9, 7.93, 7.7, 7.74),
];

/** Outside bar that closes weak — not ORBT tweezer, MESH evening star, CUST opening drive, BAND dump, RELAY inside, POOL evening star, or AI-agent 0.05 outside. */
const FARM_PRE: OHLC[] = [
  bar("T-5", 11.12, 11.18, 11.08, 11.14),
  bar("T-4", 11.14, 11.2, 11.1, 11.16),
  bar("T-3", 11.16, 11.22, 11.12, 11.18),
  bar("T-2", 11.18, 11.24, 11.14, 11.2),
  bar("T-1", 11.2, 11.26, 11.16, 11.22),
  bar("T0", 11.22, 11.48, 10.96, 11.08),
];

/** Outside bar that closes weak — not CARB harami, RENT CPI coil, LITH brine grind, HIVE dump, POOL evening star, FARM 11 tape outside, or AI-agent 0.05 outside. */
const WRAP_PRE: OHLC[] = [
  bar("T-5", 4.812, 4.828, 4.798, 4.82),
  bar("T-4", 4.82, 4.838, 4.808, 4.83),
  bar("T-3", 4.83, 4.852, 4.818, 4.844),
  bar("T-2", 4.844, 4.864, 4.832, 4.856),
  bar("T-1", 4.856, 4.876, 4.844, 4.868),
  bar("T0", 4.868, 4.938, 4.792, 4.814),
];

/** Failed range poke — not CARB harami, RENT CPI coil, LITH brine grind, HIVE dump, POOL evening star, WRAP outside, BLOB tape fail, PRIV 54 privacy fail, or L2 18s stall. */
const SEQ_PRE: OHLC[] = [
  bar("T-5", 0.8612, 0.8648, 0.8588, 0.8636),
  bar("T-4", 0.8636, 0.8672, 0.8612, 0.8664),
  bar("T-3", 0.8664, 0.8748, 0.8648, 0.8728),
  bar("T-2", 0.8728, 0.8772, 0.8656, 0.8672),
  bar("T-1", 0.8672, 0.8696, 0.8608, 0.8624),
  bar("T0", 0.8624, 0.8648, 0.8572, 0.8588),
];

/** Bearish engulfing (T0 body swallows T-1; high stays inside T-1) — not CARB harami, RENT CPI coil, LITH brine grind, HIVE dump, POOL evening star, WRAP outside, SEQ fail, VAULT 9 tape engulf, PRIV 54 fail, or FARM 11 tape outside. */
const KEEPER_PRE: OHLC[] = [
  bar("T-5", 5.624, 5.648, 5.612, 5.642),
  bar("T-4", 5.642, 5.666, 5.634, 5.66),
  bar("T-3", 5.66, 5.678, 5.652, 5.672),
  bar("T-2", 5.672, 5.686, 5.664, 5.668),
  bar("T-1", 5.668, 5.692, 5.662, 5.686),
  bar("T0", 5.688, 5.69, 5.604, 5.612),
];

/** Failed range poke — not ORBT tweezer, MESH evening star, CUST opening drive, BAND dump, RELAY inside, FARM outside, or PRIV 54 privacy fail. */
const BLOB_PRE: OHLC[] = [
  bar("T-5", 2.142, 2.168, 2.134, 2.162),
  bar("T-4", 2.162, 2.188, 2.154, 2.182),
  bar("T-3", 2.182, 2.236, 2.174, 2.224),
  bar("T-2", 2.224, 2.242, 2.186, 2.194),
  bar("T-1", 2.194, 2.208, 2.162, 2.168),
  bar("T0", 2.168, 2.182, 2.138, 2.146),
];

/** Bearish engulfing (T0 body swallows T-1; high stays inside T-1) — not ORBT tweezer, MESH evening star, CUST opening drive, BAND dump, RELAY inside, FARM outside, BLOB fail, SEQ 0.86 fail, PRIV 54 fail, or AI-agent 0.05 outside. */
const VAULT_PRE: OHLC[] = [
  bar("T-5", 9.124, 9.148, 9.112, 9.142),
  bar("T-4", 9.142, 9.166, 9.134, 9.16),
  bar("T-3", 9.16, 9.178, 9.152, 9.172),
  bar("T-2", 9.172, 9.186, 9.164, 9.168),
  bar("T-1", 9.168, 9.192, 9.162, 9.186),
  bar("T0", 9.188, 9.19, 9.104, 9.112),
];

/** Shooting star (T0 small body near the lows, long upper wick; low stays inside T-1) — not ORBT tweezer, MESH evening star, CUST opening drive, BAND dump, RELAY inside, FARM outside, BLOB fail, VAULT engulf, SEQ 0.86 fail, PRIV 54 fail, or GBPNOK 13.6 tape star. */
const GATE_PRE: OHLC[] = [
  bar("T-5", 7.412, 7.428, 7.402, 7.424),
  bar("T-4", 7.424, 7.442, 7.416, 7.438),
  bar("T-3", 7.438, 7.456, 7.43, 7.452),
  bar("T-2", 7.452, 7.468, 7.444, 7.464),
  bar("T-1", 7.464, 7.482, 7.456, 7.476),
  bar("T0", 7.478, 7.548, 7.46, 7.482),
];

/** Dark-cloud cover (T0 opens above T-1 close, closes in lower half of T-1 body but above T-1 open; low stays inside T-1) — not ORBT tweezer, MESH evening star, CUST opening drive, BAND dump, RELAY inside, FARM outside, BLOB fail, VAULT engulf, GATE shooting star, ATTEST 3.6 macro star, N6 0.548 kiwi cloud, or NZDNOK 6.24 tape cloud. */
const DOCK_PRE: OHLC[] = [
  bar("T-5", 11.284, 11.308, 11.272, 11.302),
  bar("T-4", 11.302, 11.328, 11.29, 11.322),
  bar("T-3", 11.322, 11.352, 11.31, 11.346),
  bar("T-2", 11.346, 11.368, 11.334, 11.362),
  bar("T-1", 11.362, 11.412, 11.352, 11.404),
  bar("T0", 11.41, 11.422, 11.358, 11.374),
];

/** Three black crows (three falling red bodies after a grind; not one engulfing bar) — not ORBT tweezer, MESH evening star, CUST opening drive, BAND dump, RELAY inside, FARM outside, BLOB fail, VAULT engulf, GATE shooting star, DOCK dark-cloud, LANE 8.2 macro cloud, or ATTEST 3.6 macro star. */
const NODE_PRE: OHLC[] = [
  bar("T-5", 4.184, 4.208, 4.172, 4.202),
  bar("T-4", 4.202, 4.232, 4.194, 4.226),
  bar("T-3", 4.226, 4.258, 4.218, 4.252),
  bar("T-2", 4.248, 4.254, 4.198, 4.206),
  bar("T-1", 4.208, 4.214, 4.158, 4.166),
  bar("T0", 4.168, 4.174, 4.118, 4.126),
];

/** Hanging man (T0 small body near the highs, long lower wick; high stays inside T-1) — not ORBT tweezer, MESH evening star, CUST opening drive, BAND dump, RELAY inside, FARM outside, BLOB fail, VAULT 9 engulf, GATE 7.4 shooting star, DOCK dark-cloud, NODE 4.18 crows, PEER 2.86 macro crows, or H6 0.128 hanging man. */
const SLOT_PRE: OHLC[] = [
  bar("T-5", 15.214, 15.248, 15.198, 15.242),
  bar("T-4", 15.242, 15.286, 15.226, 15.278),
  bar("T-3", 15.278, 15.328, 15.262, 15.318),
  bar("T-2", 15.318, 15.372, 15.302, 15.362),
  bar("T-1", 15.362, 15.418, 15.348, 15.408),
  bar("T0", 15.398, 15.412, 15.248, 15.386),
];

/** Bearish harami (T-1 tall green, T0 small body inside T-1 body) — not RELAY inside-bar still-ahead, SLOT hanging man, CARB dump-harami, EURPLN 4.628 tape harami, R6 0.0114 ruble harami, QUORUM 19.42 hanging man, or NODE 4.18 crows. */
const EPOCH_PRE: OHLC[] = [
  bar("T-5", 22.614, 22.658, 22.596, 22.648),
  bar("T-4", 22.648, 22.698, 22.628, 22.688),
  bar("T-3", 22.688, 22.748, 22.668, 22.736),
  bar("T-2", 22.736, 22.808, 22.716, 22.792),
  bar("T-1", 22.792, 22.918, 22.778, 22.898),
  bar("T0", 22.842, 22.862, 22.822, 22.832),
];

/** Bearish marubozu after a grind (T0 long red, open near high, close near low, tiny wicks) — not VAULT engulf, EPOCH 22.86 harami, SLOT hanging man, GATE star, NODE crows, DOCK cloud, SHARD 6.14, PEER 2.86, or K6 0.0948. */
const NONCE_PRE: OHLC[] = [
  bar("T-5", 1.814, 1.838, 1.802, 1.832),
  bar("T-4", 1.832, 1.862, 1.82, 1.856),
  bar("T-3", 1.856, 1.896, 1.844, 1.888),
  bar("T-2", 1.888, 1.938, 1.876, 1.928),
  bar("T-1", 1.928, 1.988, 1.916, 1.972),
  bar("T0", 1.958, 1.972, 1.814, 1.826),
];

/** Gravestone doji after a grind (T0 open≈close≈low, long upper wick; low stays inside T-1) — not GATE shooting star (small real body), NONCE 1.86 marubozu, I6 0.215 ringgit gravestone, EURHUF 392, SLOT hanging man, or SEQ 0.86 fail. */
const GOSS_PRE: OHLC[] = [
  bar("T-5", 0.38186, 0.38228, 0.38164, 0.38218),
  bar("T-4", 0.38218, 0.38268, 0.38196, 0.38258),
  bar("T-3", 0.38258, 0.38318, 0.38236, 0.38306),
  bar("T-2", 0.38306, 0.38372, 0.38284, 0.38358),
  bar("T-1", 0.38358, 0.38438, 0.38338, 0.38422),
  bar("T0", 0.38424, 0.38586, 0.38422, 0.38424),
];

/** Harami cross after a grind (T-1 tall green, T0 doji fully inside T-1 body) — not EPOCH harami (small real body), GOSS gravestone, RELAY inside-bar still-ahead, SHARD 6.14 macro harami, GBPHUF 467, or IDR6 16265. */
const WITNESS_PRE: OHLC[] = [
  bar("T-5", 13.286, 13.348, 13.248, 13.332),
  bar("T-4", 13.332, 13.412, 13.298, 13.394),
  bar("T-3", 13.394, 13.492, 13.356, 13.472),
  bar("T-2", 13.472, 13.588, 13.428, 13.564),
  bar("T-1", 13.564, 13.728, 13.518, 13.698),
  bar("T0", 13.628, 13.642, 13.616, 13.63),
];

/** Spinning top after a grind (T0 small real body near the middle, similar upper and lower wicks) — not SLOT hanging man, GATE shooting star, WITNESS harami-cross, GOSS gravestone, SEQ 0.86 fail-break, NONCE 1.86 marubozu, or EURRON 5.05 tape spinning top. */
const COMMIT_PRE: OHLC[] = [
  bar("T-5", 0.5864, 0.5898, 0.5842, 0.5886),
  bar("T-4", 0.5886, 0.5932, 0.5868, 0.5924),
  bar("T-3", 0.5924, 0.5986, 0.5902, 0.5972),
  bar("T-2", 0.5972, 0.6048, 0.5946, 0.6034),
  bar("T-1", 0.6034, 0.6128, 0.6008, 0.6106),
  bar("T0", 0.6078, 0.6184, 0.5996, 0.6102),
];

/** Long-legged doji after a grind (T0 open≈close with long upper AND lower wicks of similar length) — not COMMIT spinning top (small real body), GOSS gravestone, WITNESS harami-cross, SLOT 15.28 hanging man, REVEAL 10.73 macro spinning top, or GBPRON 5.75 tape doji. */
const HINT_PRE: OHLC[] = [
  bar("T-5", 17.186, 17.248, 17.148, 17.228),
  bar("T-4", 17.228, 17.308, 17.186, 17.286),
  bar("T-3", 17.286, 17.392, 17.248, 17.368),
  bar("T-2", 17.368, 17.498, 17.328, 17.468),
  bar("T-1", 17.468, 17.628, 17.438, 17.586),
  bar("T0", 17.598, 17.764, 17.432, 17.598),
];

/** Dragonfly doji after a grind (T0 open≈close≈high with a long lower wick only) — not SLOT hanging man (small real body near the highs), GOSS gravestone, HINT long-legged (wicks both ways), COMMIT spinning top, GATE 7.41 star, LANE 8.26 cloud, VAULT 9.12, or PEN 0.419. */
const BATCH_PRE: OHLC[] = [
  bar("T-5", 8.6186, 8.6484, 8.5928, 8.6364),
  bar("T-4", 8.6364, 8.6786, 8.6142, 8.6648),
  bar("T-3", 8.6648, 8.7284, 8.6426, 8.7128),
  bar("T-2", 8.7128, 8.7986, 8.6884, 8.7786),
  bar("T-1", 8.7786, 8.8984, 8.7528, 8.8648),
  bar("T0", 8.8728, 8.8786, 8.7186, 8.8728),
];

/** Matching high after a grind (T-1 tall green, T0 small green sharing nearly the same high; T0 closes weak under that high) — not ORBT tweezer (not opposite-color bodies), GATE shooting star, BATCH dragonfly, SLOT 15.28 hanging man, HINT 17.64 long-legged, INK 14.86 macro dragonfly, WITNESS 13.63, or MERKLE 12.38. */
const QUILL_PRE: OHLC[] = [
  bar("T-5", 15.418, 15.486, 15.364, 15.468),
  bar("T-4", 15.468, 15.564, 15.418, 15.542),
  bar("T-3", 15.542, 15.686, 15.486, 15.658),
  bar("T-2", 15.658, 15.848, 15.598, 15.812),
  bar("T-1", 15.812, 16.248, 15.748, 16.168),
  bar("T0", 16.086, 16.242, 16.018, 16.128),
];

/** Bearish belt hold after a grind (T0 opens at the high with no upper wick and sells off; lower wick allowed) — not NONCE 1.86 marubozu (tiny wicks both ends), QUILL 16.18 matching high, WAX 24.18 macro matching, EPOCH 22.86 harami, SLOT hanging man, GATE shooting star, or AUDCZK 15.62. */
const SIGIL_PRE: OHLC[] = [
  bar("T-5", 25.364, 25.428, 25.312, 25.406),
  bar("T-4", 25.406, 25.518, 25.358, 25.472),
  bar("T-3", 25.472, 25.648, 25.418, 25.586),
  bar("T-2", 25.586, 25.848, 25.528, 25.786),
  bar("T-1", 25.786, 26.486, 25.718, 26.348),
  bar("T0", 26.418, 26.418, 25.868, 26.068),
];

/** Bearish separating lines after a grind (T-1 tall green, T0 long red that opens at nearly the same open as T-1 and sells off) — not SIGIL 26.42 belt hold (opens at T0 high), NONCE 1.86 marubozu, QUILL 16.18 matching high, WAX 24.18, FORGE 37.62, JOIST 43.7, or CZK6 0.164. */
const GLYPH_PRE: OHLC[] = [
  bar("T-5", 42.186, 42.648, 41.864, 42.428),
  bar("T-4", 42.428, 43.186, 42.248, 42.968),
  bar("T-3", 42.968, 43.868, 42.748, 43.648),
  bar("T-2", 43.648, 44.986, 43.418, 44.748),
  bar("T-1", 44.748, 47.186, 44.286, 46.648),
  bar("T0", 44.786, 45.248, 42.186, 42.868),
];

/** Bearish on-neck after a grind (T-1 tall green, T0 long red opens above T-1 close and closes at nearly the T-1 low) — not GLYPH 44.79 separating lines (those share T-1 open), DOCK 11.36 dark-cloud, SIGIL 26.42 belt hold, QUILL 16.18 matching high, SHARD 6.14, KEEPER 5.64, or EURDKK 7.41. */
const CIPHER_PRE: OHLC[] = [
  bar("T-5", 6.4186, 6.4484, 6.3928, 6.4364),
  bar("T-4", 6.4364, 6.4786, 6.4142, 6.4648),
  bar("T-3", 6.4648, 6.5284, 6.4426, 6.5128),
  bar("T-2", 6.5128, 6.5986, 6.4884, 6.5786),
  bar("T-1", 6.5786, 6.7486, 6.5486, 6.6986),
  bar("T0", 6.7286, 6.7684, 6.5186, 6.5528),
];

/** Bearish in-neck after a grind (T-1 tall green, T0 long red opens above T-1 close and closes at nearly the T-1 close, not the T-1 low) — not CIPHER 6.73 on-neck (that closes at T-1 low), DOCK 11.36 dark-cloud, GLYPH 44.79 separating, SIGIL 26.42 belt hold, EPOCH 22.86 harami, WAX 24.18 matching, or TOME 73.55 macro on-neck. */
const SCROLL_PRE: OHLC[] = [
  bar("T-5", 19.828, 19.968, 19.648, 19.918),
  bar("T-4", 19.918, 20.186, 19.748, 20.086),
  bar("T-3", 20.086, 20.486, 19.918, 20.348),
  bar("T-2", 20.348, 20.848, 20.186, 20.686),
  bar("T-1", 20.686, 22.448, 20.286, 21.268),
  bar("T0", 21.748, 21.886, 20.848, 21.286),
];

/** Bearish thrusting after a grind (T-1 tall green, T0 long red opens above T-1 close and closes into the T-1 body above the midpoint) — not SCROLL 21.75 in-neck (closes at T-1 close), CIPHER 6.73 on-neck, COMMIT 0.61 spinning, SEQ 0.86 fail-break, BGN 0.94 lev in-neck, or CODEX 32.85 macro in-neck. */
const RUNE_PRE: OHLC[] = [
  bar("T-5", 0.7286, 0.7348, 0.7228, 0.7324),
  bar("T-4", 0.7324, 0.7428, 0.7286, 0.7396),
  bar("T-3", 0.7396, 0.7564, 0.7348, 0.7518),
  bar("T-2", 0.7518, 0.7748, 0.7448, 0.7686),
  bar("T-1", 0.7686, 0.8186, 0.7586, 0.7986),
  bar("T0", 0.8128, 0.8184, 0.7748, 0.7886),
];

/** Shooting star (T0 small body near the lows, long upper wick; low stays inside T-1) — not CARB harami, RENT CPI coil, LITH brine grind, HIVE dump, POOL evening star, WRAP outside, SEQ fail, KEEPER engulf, GATE 7.4 tape star, VAULT 9 tape engulf, or AUDNOK 6.8 macro star. */
const ATTEST_PRE: OHLC[] = [
  bar("T-5", 3.618, 3.642, 3.602, 3.636),
  bar("T-4", 3.636, 3.664, 3.622, 3.658),
  bar("T-3", 3.658, 3.692, 3.644, 3.684),
  bar("T-2", 3.684, 3.716, 3.67, 3.708),
  bar("T-1", 3.708, 3.748, 3.692, 3.736),
  bar("T0", 3.728, 3.828, 3.712, 3.742),
];

/** Dark-cloud cover (T0 opens above T-1 close, closes in lower half of T-1 body but above T-1 open; low stays inside T-1) — not CARB harami, RENT CPI coil, LITH brine grind, HIVE dump, POOL evening star, WRAP outside, SEQ fail, KEEPER engulf, ATTEST 3.6 macro star, DOCK 11 tape cloud, GATE 7.4 tape star, or RELAY inside. */
const LANE_PRE: OHLC[] = [
  bar("T-5", 8.184, 8.208, 8.172, 8.202),
  bar("T-4", 8.202, 8.228, 8.19, 8.222),
  bar("T-3", 8.222, 8.252, 8.21, 8.246),
  bar("T-2", 8.246, 8.268, 8.234, 8.262),
  bar("T-1", 8.262, 8.312, 8.252, 8.304),
  bar("T0", 8.31, 8.322, 8.258, 8.274),
];

/** Three black crows (three falling red bodies after a grind; not one engulfing bar) — not CARB harami, RENT CPI coil, LITH brine grind, HIVE dump, POOL evening star, WRAP outside, SEQ fail, KEEPER engulf, ATTEST 3.6 macro star, LANE 8.2 dark-cloud, NODE 4.18 tape crows, or KEEPER 5.6 engulf. */
const PEER_PRE: OHLC[] = [
  bar("T-5", 2.864, 2.888, 2.852, 2.882),
  bar("T-4", 2.882, 2.912, 2.874, 2.906),
  bar("T-3", 2.906, 2.938, 2.898, 2.932),
  bar("T-2", 2.928, 2.934, 2.878, 2.886),
  bar("T-1", 2.888, 2.894, 2.838, 2.846),
  bar("T0", 2.848, 2.854, 2.798, 2.806),
];

/** Hanging man (T0 small body near the highs, long lower wick; high stays inside T-1) — not CARB harami, RENT CPI coil, LITH brine grind, HIVE dump, POOL evening star, WRAP outside, SEQ fail, KEEPER engulf, ATTEST 3.6 macro star, LANE 8.2 dark-cloud, PEER 2.86 crows, SLOT 15.28 tape hanging man, or P6 0.248 zloty hanging man. */
const QUORUM_PRE: OHLC[] = [
  bar("T-5", 19.186, 19.228, 19.164, 19.218),
  bar("T-4", 19.218, 19.268, 19.196, 19.258),
  bar("T-3", 19.258, 19.318, 19.236, 19.306),
  bar("T-2", 19.306, 19.372, 19.284, 19.358),
  bar("T-1", 19.358, 19.438, 19.338, 19.422),
  bar("T0", 19.408, 19.426, 19.218, 19.392),
];

/** Bearish harami after a grind (T-1 tall green, T0 small body inside T-1 body) — not CARB dump-harami, RELAY inside-bar still-ahead, QUORUM hanging man, EPOCH 22.86 tape harami, T6 0.0315 lira harami, GBPPLN 5.086, KEEPER 5.64 engulf, POOL 7.7 evening, or GATE 7.41 tape star. */
const SHARD_PRE: OHLC[] = [
  bar("T-5", 6.086, 6.118, 6.072, 6.112),
  bar("T-4", 6.112, 6.148, 6.098, 6.142),
  bar("T-3", 6.142, 6.186, 6.128, 6.178),
  bar("T-2", 6.178, 6.228, 6.164, 6.218),
  bar("T-1", 6.218, 6.318, 6.204, 6.298),
  bar("T0", 6.258, 6.268, 6.246, 6.252),
];

/** Bearish marubozu after a grind (T0 long red, open near high, close near low, tiny wicks) — not KEEPER engulf, SHARD 6.14 harami, QUORUM hanging man, ATTEST star, PEER crows, LANE cloud, NONCE 1.86 tape marubozu, W6 0.00073, or GBPCZK 30.2. */
const PROVER_PRE: OHLC[] = [
  bar("T-5", 28.186, 28.228, 28.164, 28.218),
  bar("T-4", 28.218, 28.268, 28.196, 28.258),
  bar("T-3", 28.258, 28.318, 28.236, 28.306),
  bar("T-2", 28.306, 28.372, 28.284, 28.358),
  bar("T-1", 28.358, 28.438, 28.338, 28.422),
  bar("T0", 28.406, 28.422, 28.186, 28.198),
];

/** Gravestone doji after a grind (T0 open≈close≈low, long upper wick; low stays inside T-1) — not ATTEST shooting star (small real body), PROVER 28.2 marubozu, GOSS 0.384 tape gravestone, DKK 0.146, PURLIN 63.4, BRCK 33 engulf, or CLAY 37 crows. */
const BUNDLE_PRE: OHLC[] = [
  bar("T-5", 34.364, 34.428, 34.318, 34.412),
  bar("T-4", 34.412, 34.502, 34.378, 34.486),
  bar("T-3", 34.486, 34.592, 34.448, 34.574),
  bar("T-2", 34.574, 34.698, 34.532, 34.676),
  bar("T-1", 34.676, 34.828, 34.638, 34.802),
  bar("T0", 34.806, 35.086, 34.798, 34.806),
];

/** Harami cross after a grind (T-1 tall green, T0 doji fully inside T-1 body) — not SHARD harami (small real body), BUNDLE gravestone, WITNESS 13.63 tape harami-cross, EPOCH 22.86, RELAY inside-bar still-ahead, or VAULT 9 engulf. */
const MERKLE_PRE: OHLC[] = [
  bar("T-5", 12.064, 12.128, 12.018, 12.108),
  bar("T-4", 12.108, 12.186, 12.068, 12.164),
  bar("T-3", 12.164, 12.258, 12.118, 12.232),
  bar("T-2", 12.232, 12.348, 12.178, 12.318),
  bar("T-1", 12.318, 12.468, 12.268, 12.438),
  bar("T0", 12.374, 12.392, 12.356, 12.378),
];

/** Spinning top after a grind (T0 small real body near the middle, similar upper and lower wicks) — not QUORUM hanging man, ATTEST shooting star, MERKLE harami-cross, BUNDLE gravestone, COMMIT 0.61 tape spinning top, VAULT 9 engulf, or DOCK 11 cloud. */
const REVEAL_PRE: OHLC[] = [
  bar("T-5", 10.314, 10.368, 10.286, 10.352),
  bar("T-4", 10.352, 10.428, 10.324, 10.412),
  bar("T-3", 10.412, 10.518, 10.386, 10.498),
  bar("T-2", 10.498, 10.636, 10.468, 10.612),
  bar("T-1", 10.612, 10.786, 10.578, 10.748),
  bar("T0", 10.686, 10.878, 10.538, 10.73),
];

/** Long-legged doji after a grind (T0 open≈close with long upper AND lower wicks of similar length) — not REVEAL spinning top (small real body), BUNDLE gravestone, MERKLE harami-cross, HINT 17.64 tape doji, COMMIT 0.61 tape spinning top, or NONCE 1.86 marubozu. */
const SEAL_PRE: OHLC[] = [
  bar("T-5", 1.3486, 1.3564, 1.3418, 1.3538),
  bar("T-4", 1.3538, 1.3648, 1.3472, 1.3616),
  bar("T-3", 1.3616, 1.3786, 1.3548, 1.3742),
  bar("T-2", 1.3742, 1.3984, 1.3668, 1.3928),
  bar("T-1", 1.3928, 1.4264, 1.3886, 1.4186),
  bar("T0", 1.4228, 1.4586, 1.387, 1.4228),
];

/** Dragonfly doji after a grind (T0 open≈close≈high with a long lower wick only) — not QUORUM hanging man (small real body near the highs), BUNDLE gravestone, SEAL long-legged (wicks both ways), REVEAL spinning top, BATCH 8.87 tape dragonfly, SLOT 15.28 hanging man, WITNESS 13.63 harami-cross, or HINT 17.64. */
const INK_PRE: OHLC[] = [
  bar("T-5", 14.218, 14.286, 14.164, 14.268),
  bar("T-4", 14.268, 14.364, 14.218, 14.342),
  bar("T-3", 14.342, 14.486, 14.286, 14.458),
  bar("T-2", 14.458, 14.648, 14.398, 14.612),
  bar("T-1", 14.612, 14.918, 14.548, 14.848),
  bar("T0", 14.868, 14.898, 14.418, 14.868),
];

/** Matching high after a grind (T-1 tall green, T0 small green sharing nearly the same high; T0 closes weak under that high) — not ORBT tweezer (not opposite-color bodies), ATTEST shooting star, INK dragonfly, QUILL 16.18 tape matching high, SEAL 1.42 long-legged, EPOCH 22.86 tape harami, NODE 4.18, or BATCH 8.87. */
const WAX_PRE: OHLC[] = [
  bar("T-5", 23.186, 23.248, 23.142, 23.228),
  bar("T-4", 23.228, 23.318, 23.186, 23.298),
  bar("T-3", 23.298, 23.428, 23.248, 23.398),
  bar("T-2", 23.398, 23.586, 23.348, 23.548),
  bar("T-1", 23.548, 24.186, 23.486, 24.086),
  bar("T0", 23.968, 24.178, 23.898, 24.048),
];

/** Bearish belt hold after a grind (T0 opens at the high with no upper wick and sells off; lower wick allowed) — not PROVER 28.2 marubozu (tiny wicks both ends), WAX 24.18 matching high, SIGIL 26.42 tape belt hold, DOCK 11.36 dark-cloud, MERKLE 12.38 harami-cross, BUNDLE 34.8 gravestone, or CADCZK 22.42. */
const FORGE_PRE: OHLC[] = [
  bar("T-5", 36.186, 36.268, 36.064, 36.228),
  bar("T-4", 36.228, 36.368, 36.148, 36.318),
  bar("T-3", 36.318, 36.548, 36.248, 36.486),
  bar("T-2", 36.486, 36.848, 36.398, 36.768),
  bar("T-1", 36.768, 37.686, 36.648, 37.486),
  bar("T0", 37.618, 37.618, 36.918, 37.218),
];

/** Bearish separating lines after a grind (T-1 tall green, T0 long red that opens at nearly the same open as T-1 and sells off) — not FORGE 37.62 belt hold (opens at T0 high), GLYPH 44.79 tape separating lines, SIGIL 26.42, WAX 24.18, PROVER 28.2, BUNDLE 34.8, or GABLE 52.7. */
const CREST_PRE: OHLC[] = [
  bar("T-5", 53.186, 53.428, 52.864, 53.286),
  bar("T-4", 53.286, 53.648, 53.048, 53.518),
  bar("T-3", 53.518, 54.018, 53.248, 53.868),
  bar("T-2", 53.868, 54.648, 53.586, 54.428),
  bar("T-1", 54.428, 59.186, 53.968, 58.286),
  bar("T0", 54.518, 55.486, 50.648, 51.868),
];

/** Bearish on-neck after a grind (T-1 tall green, T0 long red opens above T-1 close and closes at nearly the T-1 low) — not CREST 54.52 separating lines (those share T-1 open), CIPHER 6.73 tape on-neck, FORGE 37.62 belt hold, GLYPH 44.79, SIGIL 26.42, LANE 8.27 dark-cloud, or CABLE 68.5. */
const TOME_PRE: OHLC[] = [
  bar("T-5", 68.428, 68.868, 68.186, 68.748),
  bar("T-4", 68.748, 69.286, 68.548, 69.148),
  bar("T-3", 69.148, 69.868, 68.918, 69.748),
  bar("T-2", 69.748, 70.648, 69.486, 70.486),
  bar("T-1", 70.486, 73.848, 70.086, 73.268),
  bar("T0", 73.548, 73.918, 70.148, 70.186),
];

/** Bearish in-neck after a grind (T-1 tall green, T0 long red opens above T-1 close and closes at nearly the T-1 close, not the T-1 low) — not TOME 73.55 on-neck (that closes at T-1 low), SCROLL 21.75 tape in-neck, CIPHER 6.73 tape on-neck, DORMER 31.17 matching, BUNDLE 34.8 gravestone, or PROVER 28.2 marubozu. */
const CODEX_PRE: OHLC[] = [
  bar("T-5", 31.428, 31.568, 31.286, 31.518),
  bar("T-4", 31.518, 31.748, 31.364, 31.686),
  bar("T-3", 31.686, 32.048, 31.548, 31.948),
  bar("T-2", 31.948, 32.486, 31.818, 32.368),
  bar("T-1", 32.368, 33.648, 32.186, 32.848),
  bar("T0", 33.286, 33.428, 32.448, 32.868),
];

/** Bearish thrusting after a grind (T-1 tall green, T0 long red opens above T-1 close and closes into the T-1 body above the midpoint) — not CODEX 32.85 in-neck (closes at T-1 close), MERKLE 12.38 harami-cross, WITNESS 13.63 tape harami-cross, RUNE 0.79 tape thrusting, TOME 73.55 on-neck, or GATE 7.4 tape star. */
const WARD_PRE: OHLC[] = [
  bar("T-5", 12.5486, 12.5684, 12.5286, 12.5628),
  bar("T-4", 12.5628, 12.5986, 12.5486, 12.5864),
  bar("T-3", 12.5864, 12.6486, 12.5684, 12.6286),
  bar("T-2", 12.6286, 12.7186, 12.5986, 12.6986),
  bar("T-1", 12.6986, 12.8684, 12.6686, 12.7986),
  bar("T0", 12.8486, 12.8784, 12.7186, 12.7686),
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

/** Falling wedge (lower highs, higher lows) — not CASINO rising wedge, HOTEL flag, or BIO three-push. */
const GROC_PRE: OHLC[] = [
  bar("T-5", 42.4, 42.8, 42.0, 42.7),
  bar("T-4", 42.7, 42.75, 41.6, 41.8),
  bar("T-3", 41.8, 42.35, 41.7, 42.22),
  bar("T-2", 42.22, 42.28, 41.85, 41.95),
  bar("T-1", 41.95, 42.18, 41.9, 42.1),
  bar("T0", 42.1, 42.16, 42.0, 42.06),
];

/** Head and shoulders (higher head, weaker right shoulder) — not AIRL double-top, BIO three-push, or GROC falling wedge. */
const SLR_PRE: OHLC[] = [
  bar("T-5", 24.8, 25.4, 24.4, 25.2),
  bar("T-4", 25.2, 26.8, 25.0, 26.6),
  bar("T-3", 26.6, 26.8, 25.4, 25.8),
  bar("T-2", 25.8, 28.6, 25.6, 28.2),
  bar("T-1", 28.2, 28.4, 26.0, 26.4),
  bar("T0", 26.4, 27.6, 26.2, 27.2),
];

/** Head and shoulders on a tower name — not SLR solar H&S, AIRL double-top, or BIO three-push. */
const TOWR_PRE: OHLC[] = [
  bar("T-5", 102.0, 104.0, 101.0, 103.5),
  bar("T-4", 103.5, 108.0, 103.0, 107.5),
  bar("T-3", 107.5, 108.0, 104.0, 104.8),
  bar("T-2", 104.8, 116.0, 104.4, 114.5),
  bar("T-1", 114.5, 115.0, 105.2, 106.0),
  bar("T0", 106.0, 111.0, 105.4, 109.5),
];

/** Tweezer top (two matching highs after a rally) — not TOWR H&S, SLR H&S, or AIRL double-top. */
const RAIL_PRE: OHLC[] = [
  bar("T-5", 67.2, 67.8, 66.8, 67.6),
  bar("T-4", 67.6, 69.4, 67.4, 69.2),
  bar("T-3", 69.2, 70.8, 69.0, 70.6),
  bar("T-2", 70.6, 72.4, 70.4, 72.0),
  bar("T-1", 72.0, 72.4, 70.2, 70.4),
  bar("T0", 70.4, 70.8, 69.2, 69.4),
];

/** Evening star (long green, small star, red close back) — not RAIL tweezer, WSTE harami, or TOWR H&S. */
const CEMT_PRE: OHLC[] = [
  bar("T-5", 88.12, 88.38, 88.04, 88.32),
  bar("T-4", 88.32, 88.86, 88.24, 88.8),
  bar("T-3", 88.8, 89.42, 88.72, 89.36),
  bar("T-2", 89.36, 90.18, 89.28, 90.1),
  bar("T-1", 90.1, 90.22, 90.04, 90.12),
  bar("T0", 90.12, 90.18, 89.32, 89.4),
];

/** Harami after a dump (small inside bar, not a reclaim) — not RAIL tweezer, GROC falling wedge, or TOWR H&S. */
const WSTE_PRE: OHLC[] = [
  bar("T-5", 63.4, 63.8, 63.2, 63.6),
  bar("T-4", 63.6, 63.9, 62.4, 62.6),
  bar("T-3", 62.6, 62.8, 61.2, 61.4),
  bar("T-2", 61.4, 61.6, 60.0, 60.2),
  bar("T-1", 60.2, 60.45, 60.08, 60.18),
  bar("T0", 60.18, 60.4, 59.6, 59.8),
];

/** Tight coil into a scheduled print — not WSTE dump-harami, PRINT_COIL 42s utility, or CEMT evening star. */
const DEAL_PRE: OHLC[] = [
  bar("T-5", 23.64, 23.72, 23.58, 23.68),
  bar("T-4", 23.68, 23.76, 23.62, 23.7),
  bar("T-3", 23.7, 23.78, 23.64, 23.72),
  bar("T-2", 23.72, 23.78, 23.66, 23.74),
  bar("T-1", 23.74, 23.8, 23.68, 23.76),
  bar("T0", 23.76, 23.82, 23.7, 23.78),
];

/** Mild grind then a potash-export freeze — not WSTE dump-harami, DEAL CPI coil, or STRAIT 62 importer coil. */
const FERT_PRE: OHLC[] = [
  bar("T-5", 48.14, 48.28, 48.06, 48.22),
  bar("T-4", 48.22, 48.36, 48.14, 48.3),
  bar("T-3", 48.3, 48.44, 48.22, 48.38),
  bar("T-2", 48.38, 48.52, 48.3, 48.46),
  bar("T-1", 48.46, 48.6, 48.38, 48.54),
  bar("T0", 48.54, 48.68, 48.46, 48.62),
];

/** Quiet then a wide opening drive — not RAIL tweezer, CEMT evening star, DRIVE 47 airline coil, or STRAIT 62 importer. */
const PORT_PRE: OHLC[] = [
  bar("T-5", 34.12, 34.22, 34.04, 34.16),
  bar("T-4", 34.16, 34.26, 34.08, 34.2),
  bar("T-3", 34.2, 34.28, 34.12, 34.22),
  bar("T-2", 34.22, 34.3, 34.14, 34.24),
  bar("T-1", 34.24, 34.32, 34.16, 34.26),
  bar("T0", 34.26, 35.48, 34.22, 35.32),
];

/** Dump with no reclaim — not RAIL tweezer, CEMT evening star, PORT opening drive, or DUMP_NR 222 chip dump. */
const BREW_PRE: OHLC[] = [
  bar("T-5", 54.84, 54.96, 54.22, 54.28),
  bar("T-4", 54.28, 54.4, 53.62, 53.68),
  bar("T-3", 53.68, 53.8, 53.02, 53.08),
  bar("T-2", 53.08, 53.2, 52.42, 52.48),
  bar("T-1", 52.48, 52.6, 51.82, 51.88),
  bar("T0", 51.88, 52.0, 51.12, 51.18),
];

/** Dump with no reclaim — not WSTE dump-harami, DEAL CPI coil, FERT potash grind, BREW 54 tax dump, or PRINT_COIL 42s. */
const STAFF_PRE: OHLC[] = [
  bar("T-5", 16.84, 16.96, 16.22, 16.28),
  bar("T-4", 16.28, 16.4, 15.62, 15.68),
  bar("T-3", 15.68, 15.8, 15.02, 15.08),
  bar("T-2", 15.08, 15.2, 14.42, 14.48),
  bar("T-1", 14.48, 14.6, 13.82, 13.88),
  bar("T0", 13.88, 14.0, 13.12, 13.18),
];

/** Wide mother bar then insides that hold — not RAIL tweezer, CEMT evening star, PORT opening drive, BREW dump, INSIDE insurer inside, or WSTE dump-harami. */
const LIME_PRE: OHLC[] = [
  bar("T-5", 41.24, 41.32, 41.16, 41.28),
  bar("T-4", 41.28, 41.38, 41.22, 41.34),
  bar("T-3", 41.34, 41.62, 41.28, 41.56),
  bar("T-2", 41.5, 41.58, 41.4, 41.48),
  bar("T-1", 41.48, 41.56, 41.38, 41.46),
  bar("T0", 41.46, 41.54, 41.36, 41.44),
];

/** Evening star (long green, small star, red close back) — not CEMT quarry evening star, WSTE dump-harami, DEAL CPI coil, FERT potash grind, STAFF dump, or LIME inside. */
const MILL_PRE: OHLC[] = [
  bar("T-5", 28.12, 28.22, 28.04, 28.18),
  bar("T-4", 28.18, 28.42, 28.12, 28.38),
  bar("T-3", 28.38, 28.72, 28.32, 28.68),
  bar("T-2", 28.68, 29.18, 28.62, 29.12),
  bar("T-1", 29.12, 29.22, 29.08, 29.14),
  bar("T0", 29.14, 29.2, 28.68, 28.74),
];

/** Outside bar that closes weak — not RAIL tweezer, CEMT evening star, PORT opening drive, BREW dump, LIME inside, MILL evening star, or OUT 29 regional-bank outside. */
const GLSS_PRE: OHLC[] = [
  bar("T-5", 76.18, 76.28, 76.08, 76.22),
  bar("T-4", 76.22, 76.34, 76.14, 76.28),
  bar("T-3", 76.28, 76.42, 76.2, 76.36),
  bar("T-2", 76.36, 76.48, 76.28, 76.42),
  bar("T-1", 76.42, 76.54, 76.34, 76.48),
  bar("T0", 76.48, 76.92, 76.02, 76.18),
];

/** Outside bar that closes weak — not WSTE harami, DEAL CPI coil, FERT potash grind, STAFF dump, MILL evening star, GLSS 76 tape outside, or OUT 29 regional-bank outside. */
const SALT_PRE: OHLC[] = [
  bar("T-5", 91.14, 91.28, 91.02, 91.22),
  bar("T-4", 91.22, 91.36, 91.1, 91.3),
  bar("T-3", 91.3, 91.46, 91.18, 91.4),
  bar("T-2", 91.4, 91.56, 91.28, 91.5),
  bar("T-1", 91.5, 91.66, 91.38, 91.58),
  bar("T0", 91.58, 92.18, 91.04, 91.22),
];

/** Failed range poke — not WSTE harami, DEAL CPI coil, FERT potash grind, STAFF dump, MILL evening star, SALT outside, TANK tape fail, or FAIL_BRK 81 event poke. */
const ASPH_PRE: OHLC[] = [
  bar("T-5", 12.42, 12.68, 12.28, 12.62),
  bar("T-4", 12.62, 12.88, 12.48, 12.82),
  bar("T-3", 12.82, 13.36, 12.74, 13.24),
  bar("T-2", 13.24, 13.42, 12.86, 12.94),
  bar("T-1", 12.94, 13.08, 12.58, 12.64),
  bar("T0", 12.64, 12.78, 12.32, 12.38),
];

/** Failed range poke — not RAIL tweezer, CEMT evening star, PORT opening drive, BREW dump, LIME inside, GLSS outside, or FAIL_BRK 81 event poke. */
const TANK_PRE: OHLC[] = [
  bar("T-5", 37.42, 37.68, 37.28, 37.62),
  bar("T-4", 37.62, 37.88, 37.48, 37.82),
  bar("T-3", 37.82, 38.36, 37.74, 38.24),
  bar("T-2", 38.24, 38.42, 37.86, 37.94),
  bar("T-1", 37.94, 38.08, 37.58, 37.64),
  bar("T0", 37.64, 37.78, 37.32, 37.38),
];

/** Bearish engulfing (T0 body swallows T-1; high stays inside T-1) — not RAIL tweezer, CEMT evening star, PORT opening drive, BREW dump, LIME inside, GLSS outside, TANK fail, ASPH 12 fail, FAIL_BRK 81, or OUT 29 regional-bank outside. */
const ROOF_PRE: OHLC[] = [
  bar("T-5", 19.124, 19.148, 19.112, 19.142),
  bar("T-4", 19.142, 19.166, 19.134, 19.16),
  bar("T-3", 19.16, 19.178, 19.152, 19.172),
  bar("T-2", 19.172, 19.186, 19.164, 19.168),
  bar("T-1", 19.168, 19.192, 19.162, 19.186),
  bar("T0", 19.188, 19.19, 19.104, 19.112),
];

/** Bearish engulfing (T0 body swallows T-1; high stays inside T-1) — not WSTE harami, DEAL CPI coil, FERT potash grind, STAFF dump, MILL evening star, SALT outside, ASPH fail, ROOF 19 tape engulf, FAIL_BRK 81, or OUT 29 regional-bank outside. */
const BRCK_PRE: OHLC[] = [
  bar("T-5", 33.124, 33.148, 33.112, 33.142),
  bar("T-4", 33.142, 33.166, 33.134, 33.16),
  bar("T-3", 33.16, 33.178, 33.152, 33.172),
  bar("T-2", 33.172, 33.186, 33.164, 33.168),
  bar("T-1", 33.168, 33.192, 33.162, 33.186),
  bar("T0", 33.188, 33.19, 33.104, 33.112),
];

/** Shooting star (T0 small body near the lows, long upper wick; low stays inside T-1) — not RAIL tweezer, CEMT evening star, PORT opening drive, BREW dump, LIME inside, GLSS outside, TANK fail, ROOF engulf, BRCK 33 macro engulf, GATE 7.4 tape star, or GBPNOK 13.6 tape star. */
const TILE_PRE: OHLC[] = [
  bar("T-5", 24.18, 24.26, 24.12, 24.24),
  bar("T-4", 24.24, 24.34, 24.2, 24.32),
  bar("T-3", 24.32, 24.44, 24.28, 24.4),
  bar("T-2", 24.4, 24.5, 24.36, 24.46),
  bar("T-1", 24.46, 24.58, 24.42, 24.54),
  bar("T0", 24.52, 24.88, 24.48, 24.56),
];

/** Dark-cloud cover (T0 opens above T-1 close, closes in lower half of T-1 body but above T-1 open; low stays inside T-1) — not RAIL tweezer, CEMT evening star, PORT opening drive, BREW dump, LIME inside, GLSS outside, TANK fail, ROOF engulf, TILE shooting star, GYPS 16 macro star, DOCK 11 crypto cloud, or CYC_PIPE 101 pipeline. */
const PIPE_PRE: OHLC[] = [
  bar("T-5", 27.184, 27.208, 27.172, 27.202),
  bar("T-4", 27.202, 27.228, 27.19, 27.222),
  bar("T-3", 27.222, 27.252, 27.21, 27.246),
  bar("T-2", 27.246, 27.268, 27.234, 27.262),
  bar("T-1", 27.262, 27.312, 27.252, 27.304),
  bar("T0", 27.31, 27.322, 27.258, 27.274),
];

/** Three black crows (three falling red bodies after a grind; not one engulfing bar) — not RAIL tweezer, CEMT evening star, PORT opening drive, BREW dump, LIME inside, GLSS outside, TANK fail, ROOF engulf, TILE shooting star, PIPE dark-cloud, SLAB 21 macro cloud, or GYPS 16 macro star. */
const SAND_PRE: OHLC[] = [
  bar("T-5", 14.184, 14.208, 14.172, 14.202),
  bar("T-4", 14.202, 14.232, 14.194, 14.226),
  bar("T-3", 14.226, 14.258, 14.218, 14.252),
  bar("T-2", 14.248, 14.254, 14.198, 14.206),
  bar("T-1", 14.208, 14.214, 14.158, 14.166),
  bar("T0", 14.168, 14.174, 14.118, 14.126),
];

/** Hanging man (T0 small body near the highs, long lower wick; high stays inside T-1) — not RAIL tweezer, CEMT evening star, PORT opening drive, BREW dump, LIME inside, GLSS outside, TANK fail, ROOF engulf, TILE 24 shooting star, PIPE dark-cloud, SAND 14 crows, CLAY 37 macro crows, or SLOT 15 hanging man. */
const GROUT_PRE: OHLC[] = [
  bar("T-5", 29.518, 29.562, 29.496, 29.554),
  bar("T-4", 29.554, 29.608, 29.532, 29.598),
  bar("T-3", 29.598, 29.658, 29.576, 29.646),
  bar("T-2", 29.646, 29.712, 29.624, 29.698),
  bar("T-1", 29.698, 29.768, 29.676, 29.754),
  bar("T0", 29.742, 29.758, 29.548, 29.726),
];

/** Bearish harami (T-1 tall green, T0 small body inside T-1 body) — not LIME inside-bar still-ahead, GROUT hanging man, WSTE dump-harami, REBAR 46.28 hanging man, EPOCH 22.86 crypto harami, or EURPLN 4.628 tape harami. */
const STUCCO_PRE: OHLC[] = [
  bar("T-5", 51.418, 51.468, 51.396, 51.456),
  bar("T-4", 51.456, 51.518, 51.434, 51.506),
  bar("T-3", 51.506, 51.578, 51.484, 51.564),
  bar("T-2", 51.564, 51.648, 51.542, 51.632),
  bar("T-1", 51.632, 51.778, 51.618, 51.758),
  bar("T0", 51.688, 51.712, 51.662, 51.676),
];

/** Shooting star (T0 small body near the lows, long upper wick; low stays inside T-1) — not WSTE harami, DEAL CPI coil, FERT potash grind, STAFF dump, MILL evening star, SALT outside, ASPH fail, BRCK engulf, TILE 24 tape star, ROOF 19 tape engulf, or ATTEST 3.6 macro star. */
const GYPS_PRE: OHLC[] = [
  bar("T-5", 16.42, 16.54, 16.34, 16.5),
  bar("T-4", 16.5, 16.64, 16.42, 16.6),
  bar("T-3", 16.6, 16.76, 16.52, 16.72),
  bar("T-2", 16.72, 16.86, 16.64, 16.82),
  bar("T-1", 16.82, 17.02, 16.74, 16.96),
  bar("T0", 16.9, 17.42, 16.84, 16.98),
];

/** Dark-cloud cover (T0 opens above T-1 close, closes in lower half of T-1 body but above T-1 open; low stays inside T-1) — not WSTE harami, DEAL CPI coil, FERT potash grind, STAFF dump, MILL evening star, SALT outside, ASPH fail, BRCK engulf, GYPS 16 macro star, PIPE 27 tape cloud, TILE 24 tape star, or ROOF 19 tape engulf. */
const SLAB_PRE: OHLC[] = [
  bar("T-5", 21.184, 21.208, 21.172, 21.202),
  bar("T-4", 21.202, 21.228, 21.19, 21.222),
  bar("T-3", 21.222, 21.252, 21.21, 21.246),
  bar("T-2", 21.246, 21.268, 21.234, 21.262),
  bar("T-1", 21.262, 21.312, 21.252, 21.304),
  bar("T0", 21.31, 21.322, 21.258, 21.274),
];

/** Three black crows (three falling red bodies after a grind; not one engulfing bar) — not WSTE harami, DEAL CPI coil, FERT potash grind, STAFF dump, MILL evening star, SALT outside, ASPH fail, BRCK 33 engulf, GYPS 16 macro star, SLAB 21 dark-cloud, SAND 14 tape crows, or LIME 41 inside. */
const CLAY_PRE: OHLC[] = [
  bar("T-5", 37.184, 37.208, 37.172, 37.202),
  bar("T-4", 37.202, 37.232, 37.194, 37.226),
  bar("T-3", 37.226, 37.258, 37.218, 37.252),
  bar("T-2", 37.248, 37.254, 37.198, 37.206),
  bar("T-1", 37.208, 37.214, 37.158, 37.166),
  bar("T0", 37.168, 37.174, 37.118, 37.126),
];

/** Hanging man (T0 small body near the highs, long lower wick; high stays inside T-1) — not WSTE harami, DEAL CPI coil, FERT potash grind, STAFF dump, MILL evening star, SALT outside, ASPH fail, BRCK 33 engulf, GYPS 16 macro star, SLAB 21 dark-cloud, CLAY 37 crows, GROUT 29.56 tape hanging man, or QUORUM 19.42 crypto hanging man. */
const REBAR_PRE: OHLC[] = [
  bar("T-5", 46.086, 46.142, 46.054, 46.128),
  bar("T-4", 46.128, 46.198, 46.096, 46.184),
  bar("T-3", 46.184, 46.268, 46.152, 46.252),
  bar("T-2", 46.252, 46.348, 46.218, 46.328),
  bar("T-1", 46.328, 46.438, 46.296, 46.418),
  bar("T0", 46.398, 46.422, 46.148, 46.382),
];

/** Bearish harami after a grind (T-1 tall green, T0 small body inside T-1 body) — not WSTE dump-harami, LIME inside-bar still-ahead, REBAR hanging man, STUCCO 51.86 tape harami, SHARD 6.14 crypto harami, CLAY 37 crows, or GYPS 16 star. */
const CABLE_PRE: OHLC[] = [
  bar("T-5", 67.86, 68.04, 67.72, 67.98),
  bar("T-4", 67.98, 68.22, 67.86, 68.16),
  bar("T-3", 68.16, 68.48, 68.02, 68.42),
  bar("T-2", 68.42, 68.78, 68.28, 68.72),
  bar("T-1", 68.72, 69.18, 68.64, 69.08),
  bar("T0", 68.88, 68.96, 68.82, 68.86),
];

/** Bearish marubozu after a grind (T0 long red, open near high, close near low, tiny wicks) — not ROOF engulf, STUCCO 51.86 harami, GROUT hanging man, TILE star, SAND crows, PIPE cloud, CABLE 68.5, NONCE 1.86, or REBAR 46.28. */
const JOIST_PRE: OHLC[] = [
  bar("T-5", 43.186, 43.228, 43.164, 43.218),
  bar("T-4", 43.218, 43.268, 43.196, 43.258),
  bar("T-3", 43.258, 43.318, 43.236, 43.306),
  bar("T-2", 43.306, 43.378, 43.284, 43.364),
  bar("T-1", 43.364, 43.458, 43.348, 43.442),
  bar("T0", 43.428, 43.446, 43.186, 43.204),
];

/** Bearish marubozu after a grind (T0 long red, open near high, close near low, tiny wicks) — not BRCK engulf, CABLE 68.5 harami, REBAR hanging man, GYPS star, CLAY crows, SLAB cloud, JOIST 43.7 tape marubozu, PROVER 28.2, or STUCCO 51.86. */
const LINTEL_PRE: OHLC[] = [
  bar("T-5", 74.214, 74.268, 74.186, 74.252),
  bar("T-4", 74.252, 74.318, 74.228, 74.306),
  bar("T-3", 74.306, 74.388, 74.278, 74.372),
  bar("T-2", 74.372, 74.468, 74.342, 74.452),
  bar("T-1", 74.452, 74.568, 74.428, 74.548),
  bar("T0", 74.528, 74.548, 74.214, 74.232),
];

/** Gravestone doji after a grind (T0 open≈close≈low, long upper wick; low stays inside T-1) — not TILE shooting star (small real body), JOIST 43.7 marubozu, GOSS 0.384 crypto gravestone, EURHUF 392, LINTEL 74.2, CABLE 68.5, or WSTE 59.8. */
const PURLIN_PRE: OHLC[] = [
  bar("T-5", 63.086, 63.148, 63.054, 63.132),
  bar("T-4", 63.132, 63.208, 63.108, 63.192),
  bar("T-3", 63.192, 63.286, 63.164, 63.268),
  bar("T-2", 63.268, 63.378, 63.236, 63.358),
  bar("T-1", 63.358, 63.498, 63.328, 63.472),
  bar("T0", 63.476, 63.718, 63.468, 63.476),
];

/** Gravestone doji after a grind (T0 open≈close≈low, long upper wick; low stays inside T-1) — not GYPS shooting star (small real body), LINTEL 74.2 marubozu, PURLIN 63.48 tape gravestone, BUNDLE 34.8 crypto gravestone, STUCCO 51.86, CABLE 68.5, or JOIST 43.7. */
const SOFFIT_PRE: OHLC[] = [
  bar("T-5", 57.286, 57.364, 57.218, 57.338),
  bar("T-4", 57.338, 57.442, 57.286, 57.414),
  bar("T-3", 57.414, 57.548, 57.356, 57.516),
  bar("T-2", 57.516, 57.678, 57.448, 57.642),
  bar("T-1", 57.642, 57.838, 57.578, 57.804),
  bar("T0", 57.808, 58.186, 57.798, 57.808),
];

/** Harami cross after a grind (T-1 tall green, T0 doji fully inside T-1 body) — not STUCCO harami (small real body), PURLIN gravestone, LIME inside-bar still-ahead, CABLE 68.5, SOFFIT 57.8, WITNESS 13.63, or LINTEL 74.2. */
const TRUSS_PRE: OHLC[] = [
  bar("T-5", 81.186, 81.268, 81.124, 81.248),
  bar("T-4", 81.248, 81.352, 81.196, 81.328),
  bar("T-3", 81.328, 81.458, 81.268, 81.432),
  bar("T-2", 81.432, 81.588, 81.364, 81.556),
  bar("T-1", 81.556, 81.748, 81.492, 81.712),
  bar("T0", 81.628, 81.646, 81.612, 81.632),
];

/** Spinning top after a grind (T0 small real body near the middle, similar upper and lower wicks) — not GROUT hanging man, TILE shooting star, TRUSS harami-cross, PURLIN gravestone, REBAR 46.28 hanging man, CLAY 37 crows, or COMMIT 0.61 crypto spinning top. */
const RIDGE_PRE: OHLC[] = [
  bar("T-5", 47.186, 47.248, 47.124, 47.228),
  bar("T-4", 47.228, 47.318, 47.168, 47.296),
  bar("T-3", 47.296, 47.428, 47.236, 47.402),
  bar("T-2", 47.402, 47.568, 47.348, 47.542),
  bar("T-1", 47.542, 47.748, 47.486, 47.712),
  bar("T0", 47.648, 47.864, 47.468, 47.684),
];

/** Long-legged doji after a grind (T0 open≈close with long upper AND lower wicks of similar length) — not RIDGE spinning top (small real body), PURLIN gravestone, TRUSS harami-cross, GABLE 52.7 macro spinning top, CLAY 37 crows, or HINT 17.64 crypto doji. */
const EAVE_PRE: OHLC[] = [
  bar("T-5", 32.614, 32.748, 32.548, 32.698),
  bar("T-4", 32.698, 32.868, 32.628, 32.818),
  bar("T-3", 32.818, 33.048, 32.748, 32.986),
  bar("T-2", 32.986, 33.268, 32.918, 33.198),
  bar("T-1", 33.198, 33.498, 33.168, 33.428),
  bar("T0", 33.448, 33.748, 33.148, 33.448),
];

/** Dragonfly doji after a grind (T0 open≈close≈high with a long lower wick only) — not GROUT hanging man (small real body near the highs), PURLIN gravestone, EAVE long-legged (wicks both ways), RIDGE spinning top, TILE 24.18 star, HIP 39.3 macro doji, or BATCH 8.87 crypto dragonfly. */
const FLASH_PRE: OHLC[] = [
  bar("T-5", 19.618, 19.748, 19.528, 19.698),
  bar("T-4", 19.698, 19.868, 19.614, 19.818),
  bar("T-3", 19.818, 20.048, 19.728, 19.986),
  bar("T-2", 19.986, 20.268, 19.898, 20.198),
  bar("T-1", 20.198, 20.548, 20.086, 20.428),
  bar("T0", 20.448, 20.486, 20.018, 20.448),
];

/** Matching high after a grind (T-1 tall green, T0 small green sharing nearly the same high; T0 closes weak under that high) — not RAIL tweezer (not opposite-color bodies), TILE shooting star, FLASH dragonfly, GROUT 29.56 hanging man, EAVE 33.45 long-legged, SILL 70.86 macro dragonfly, QUILL 16.18 crypto matching high, or JOIST 43.7. */
const DORMER_PRE: OHLC[] = [
  bar("T-5", 30.418, 30.486, 30.364, 30.468),
  bar("T-4", 30.468, 30.564, 30.418, 30.542),
  bar("T-3", 30.542, 30.686, 30.486, 30.658),
  bar("T-2", 30.658, 30.848, 30.598, 30.812),
  bar("T-1", 30.812, 31.248, 30.748, 31.168),
  bar("T0", 31.086, 31.242, 31.018, 31.128),
];

/** Bearish belt hold after a grind (T0 opens at the high with no upper wick and sells off; lower wick allowed) — not JOIST 43.7 marubozu (tiny wicks both ends), DORMER 31.86 matching high, FLASH 20.45 dragonfly, GYPS 16.48 shooting star, RAFTER 77.18 macro matching, SIGIL 26.42 crypto belt hold, or SAND 14.18. */
const GUTTER_PRE: OHLC[] = [
  bar("T-5", 17.864, 17.928, 17.812, 17.906),
  bar("T-4", 17.906, 18.018, 17.858, 17.972),
  bar("T-3", 17.972, 18.148, 17.918, 18.086),
  bar("T-2", 18.086, 18.348, 18.028, 18.286),
  bar("T-1", 18.286, 18.886, 18.218, 18.748),
  bar("T0", 18.818, 18.818, 18.286, 18.468),
];

/** Bearish separating lines after a grind (T-1 tall green, T0 long red that opens at nearly the same open as T-1 and sells off) — not GUTTER 18.82 belt hold (opens at T0 high), JOIST 43.7 marubozu, DORMER 31.86 matching high, PURLIN 63.48, CABLE 68.5, MULLION 9.62, or GLYPH 44.79. */
const STUD_PRE: OHLC[] = [
  bar("T-5", 61.286, 61.868, 60.948, 61.648),
  bar("T-4", 61.648, 62.486, 61.418, 62.186),
  bar("T-3", 62.186, 63.248, 61.868, 62.968),
  bar("T-2", 62.968, 64.486, 62.648, 64.186),
  bar("T-1", 64.186, 67.648, 63.748, 67.186),
  bar("T0", 64.248, 64.868, 61.186, 61.848),
];

/** Bearish on-neck after a grind (T-1 tall green, T0 long red opens above T-1 close and closes at nearly the T-1 low) — not STUD 64.25 separating lines (those share T-1 open), PIPE 27.31 dark-cloud, GUTTER 18.82 belt hold, DORMER 31.86 matching high, SASH 134.82, MULLION 9.62, CIPHER 6.73, or FASCIA 87.7. */
const JAMB_PRE: OHLC[] = [
  bar("T-5", 96.428, 96.868, 96.186, 96.748),
  bar("T-4", 96.748, 97.286, 96.548, 97.148),
  bar("T-3", 97.148, 97.868, 96.918, 97.748),
  bar("T-2", 97.748, 98.648, 97.486, 98.486),
  bar("T-1", 98.486, 101.848, 98.086, 101.268),
  bar("T0", 101.648, 102.186, 98.148, 98.186),
];

/** Bearish in-neck after a grind (T-1 tall green, T0 long red opens above T-1 close and closes at nearly the T-1 close, not the T-1 low) — not JAMB 101.65 on-neck (that closes at T-1 low), PIPE 27.31 dark-cloud, STUD 64.25 separating, GUTTER 18.82 belt hold, SOFFIT 57.8 gravestone, WSTE 59.8 dump, LATH 50.55 macro on-neck, or SCROLL 21.75 crypto in-neck. */
const NEWEL_PRE: OHLC[] = [
  bar("T-5", 55.428, 55.648, 55.186, 55.548),
  bar("T-4", 55.548, 55.868, 55.348, 55.748),
  bar("T-3", 55.748, 56.186, 55.548, 56.048),
  bar("T-2", 56.048, 56.648, 55.848, 56.486),
  bar("T-1", 56.486, 58.848, 56.086, 58.268),
  bar("T0", 58.748, 58.918, 56.848, 58.286),
];

/** Bearish thrusting after a grind (T-1 tall green, T0 long red opens above T-1 close and closes into the T-1 body above the midpoint) — not NEWEL 58.75 in-neck (closes at T-1 close), JAMB 101.65 on-neck, BALUSTER 206 macro in-neck, UND 190 coil, FLAG 172, CHFJPY 172 dump, or SASH 134.82. */
const SPANDREL_PRE: OHLC[] = [
  bar("T-5", 174.428, 175.186, 173.648, 174.868),
  bar("T-4", 174.868, 176.248, 174.186, 175.848),
  bar("T-3", 175.848, 177.186, 175.248, 176.648),
  bar("T-2", 176.648, 178.486, 175.868, 177.868),
  bar("T-1", 177.868, 181.648, 177.186, 180.248),
  bar("T0", 181.148, 181.686, 178.448, 179.468),
];

/** Harami cross after a grind (T-1 tall green, T0 doji fully inside T-1 body) — not CABLE harami (small real body), SOFFIT gravestone, TRUSS 81.6 tape harami-cross, STUCCO 51.86, LINTEL 74.2, MERKLE 12.38, or LIME inside-bar still-ahead. */
const FASCIA_PRE: OHLC[] = [
  bar("T-5", 87.214, 87.318, 87.086, 87.286),
  bar("T-4", 87.286, 87.418, 87.168, 87.384),
  bar("T-3", 87.384, 87.548, 87.248, 87.508),
  bar("T-2", 87.508, 87.708, 87.358, 87.662),
  bar("T-1", 87.662, 87.918, 87.508, 87.848),
  bar("T0", 87.748, 87.772, 87.724, 87.752),
];

/** Spinning top after a grind (T0 small real body near the middle, similar upper and lower wicks) — not REBAR hanging man, GYPS shooting star, FASCIA harami-cross, SOFFIT gravestone, RIDGE 47.7 tape spinning top, STUCCO 51.86 harami, or CLAY 37 crows. */
const GABLE_PRE: OHLC[] = [
  bar("T-5", 52.186, 52.268, 52.114, 52.248),
  bar("T-4", 52.248, 52.358, 52.186, 52.336),
  bar("T-3", 52.336, 52.478, 52.268, 52.452),
  bar("T-2", 52.452, 52.628, 52.386, 52.598),
  bar("T-1", 52.598, 52.818, 52.528, 52.772),
  bar("T0", 52.686, 52.918, 52.498, 52.73),
];

/** Long-legged doji after a grind (T0 open≈close with long upper AND lower wicks of similar length) — not GABLE spinning top (small real body), SOFFIT gravestone, FASCIA harami-cross, EAVE 33.45 tape doji, RIDGE 47.7 tape spinning top, CLAY 37 crows, or SEAL 1.42 crypto doji. */
const HIP_PRE: OHLC[] = [
  bar("T-5", 38.186, 38.328, 38.064, 38.286),
  bar("T-4", 38.286, 38.468, 38.168, 38.428),
  bar("T-3", 38.428, 38.686, 38.308, 38.638),
  bar("T-2", 38.638, 38.968, 38.518, 38.908),
  bar("T-1", 38.908, 39.348, 38.898, 39.268),
  bar("T0", 39.308, 39.748, 38.868, 39.308),
];

/** Dragonfly doji after a grind (T0 open≈close≈high with a long lower wick only) — not REBAR hanging man (small real body near the highs), SOFFIT gravestone, HIP long-legged (wicks both ways), GABLE spinning top, FLASH 20.45 tape dragonfly, EAVE 33.45 tape doji, LINTEL 74.2 marubozu, CABLE 68.5 harami, or INK 14.86 crypto dragonfly. */
const SILL_PRE: OHLC[] = [
  bar("T-5", 69.186, 69.348, 69.064, 69.286),
  bar("T-4", 69.286, 69.518, 69.168, 69.468),
  bar("T-3", 69.468, 69.786, 69.328, 69.718),
  bar("T-2", 69.718, 70.168, 69.568, 70.086),
  bar("T-1", 70.086, 70.918, 69.948, 70.748),
  bar("T0", 70.768, 70.818, 69.618, 70.768),
];

/** Matching high after a grind (T-1 tall green, T0 small green sharing nearly the same high; T0 closes weak under that high) — not RAIL tweezer (not opposite-color bodies), GYPS shooting star, SILL dragonfly, DORMER 31.86 tape matching high, JOIST 43.7 marubozu, LINTEL 74.2, TRUSS 81.6 harami-cross, WAX 24.18 crypto matching high, or CABLE 68.5. */
const RAFTER_PRE: OHLC[] = [
  bar("T-5", 75.864, 75.928, 75.812, 75.906),
  bar("T-4", 75.906, 76.018, 75.858, 75.972),
  bar("T-3", 75.972, 76.148, 75.918, 76.086),
  bar("T-2", 76.086, 76.348, 76.028, 76.286),
  bar("T-1", 76.286, 77.186, 76.218, 77.048),
  bar("T0", 76.868, 77.178, 76.798, 77.028),
];

/** Bearish belt hold after a grind (T0 opens at the high with no upper wick and sells off; lower wick allowed) — not LINTEL 74.2 marubozu (tiny wicks both ends), RAFTER 77.18 matching high, GUTTER 18.82 tape belt hold, PURLIN 63.48 gravestone, CABLE 68.5 harami, FORGE 37.62 crypto belt hold, or GABLE 52.7 spinning top. */
const MULLION_PRE: OHLC[] = [
  bar("T-5", 8.186, 8.268, 8.064, 8.228),
  bar("T-4", 8.228, 8.368, 8.148, 8.318),
  bar("T-3", 8.318, 8.548, 8.248, 8.486),
  bar("T-2", 8.486, 8.848, 8.398, 8.768),
  bar("T-1", 8.768, 9.686, 8.648, 9.486),
  bar("T0", 9.618, 9.618, 8.918, 9.218),
];

/** Bearish separating lines after a grind (T-1 tall green, T0 long red that opens at nearly the same open as T-1 and sells off) — not MULLION 9.62 belt hold (opens at T0 high), STUD 64.25 tape separating lines, GUTTER 18.82, LINTEL 74.2, RAFTER 77.18, TRUSS 81.6, CREST 54.52, or FASCIA 87.7. */
const SASH_PRE: OHLC[] = [
  bar("T-5", 128.186, 130.648, 127.448, 129.868),
  bar("T-4", 129.868, 132.486, 128.648, 131.748),
  bar("T-3", 131.748, 134.186, 130.448, 133.248),
  bar("T-2", 133.248, 135.868, 132.186, 134.748),
  bar("T-1", 134.748, 139.186, 133.648, 137.868),
  bar("T0", 134.818, 135.648, 129.186, 130.448),
];

/** Bearish on-neck after a grind (T-1 tall green, T0 long red opens above T-1 close and closes at nearly the T-1 low) — not SASH 134.82 separating lines (those share T-1 open), JAMB 101.65 tape on-neck, SLAB 21.31 dark-cloud, MULLION 9.62 belt hold, JOIST 43.7 marubozu, RIDGE 47.7, HIP 39.3, or LIME 41 inside. */
const LATH_PRE: OHLC[] = [
  bar("T-5", 47.428, 47.648, 47.186, 47.548),
  bar("T-4", 47.548, 47.868, 47.348, 47.748),
  bar("T-3", 47.748, 48.186, 47.548, 48.048),
  bar("T-2", 48.048, 48.648, 47.848, 48.486),
  bar("T-1", 48.486, 50.848, 48.086, 50.268),
  bar("T0", 50.548, 50.918, 48.148, 48.186),
];

/** Bearish in-neck after a grind (T-1 tall green, T0 long red opens above T-1 close and closes at nearly the T-1 close, not the T-1 low) — not LATH 50.55 on-neck (that closes at T-1 low), NEWEL 58.75 tape in-neck, JAMB 101.65 tape on-neck, SASH 134.82 separating, UND 190 coil, SETTLE 212 digest, or FASCIA 87.7. */
const BALUSTER_PRE: OHLC[] = [
  bar("T-5", 197.428, 198.186, 196.648, 197.868),
  bar("T-4", 197.868, 199.248, 197.186, 198.848),
  bar("T-3", 198.848, 201.186, 198.248, 200.648),
  bar("T-2", 200.648, 203.486, 199.868, 202.868),
  bar("T-1", 202.868, 207.648, 202.186, 206.248),
  bar("T0", 207.548, 208.186, 203.448, 206.268),
];

/** Bearish thrusting after a grind (T-1 tall green, T0 long red opens above T-1 close and closes into the T-1 body above the midpoint) — not BALUSTER 206 in-neck (closes at T-1 close), SPANDREL 179 tape thrusting, LATH 50.55 on-neck, NEWEL 58.75 tape in-neck, JAMB 101.65 tape on-neck, SASH 134.82, UND 190, SETTLE 212, or FLAG 172. */
const TRANSOM_PRE: OHLC[] = [
  bar("T-5", 307.186, 307.648, 306.848, 307.486),
  bar("T-4", 307.486, 308.186, 307.248, 307.968),
  bar("T-3", 307.968, 308.848, 307.748, 308.628),
  bar("T-2", 308.628, 309.748, 308.286, 309.486),
  bar("T-1", 309.486, 312.186, 309.186, 311.368),
  bar("T0", 311.748, 312.048, 309.868, 310.686),
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
  {
    id: "case-fut-rs-head-shoulders",
    title: "Canola head-and-shoulders into crush-export chase chatter",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE canola future printed a left shoulder, a higher head, then a weaker right shoulder on a crush-export scare. Thin chatter says the right shoulder must make a new high. Practice data only — not a live oilseed desk. Chase or wait?",
    newsHeadline:
      "Thin chatter: canola right shoulder must break the head. Head is already the high.",
    preOhlc: RS_PRE,
    postOhlc: withAftermath(RS_PRE, [
      bar("+1", 622, 624, 606, 608),
      bar("+2", 608, 610, 594, 596),
      bar("+3", 596, 598, 582, 584),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A weaker right shoulder after a higher head is late-chase, not a new path. Fade or wait; HOLD if you will not fade a SAMPLE canola contract. This is not the soymeal double-top, not the oats three equal pushes, not the rice falling wedge, and not a live oilseed desk.",
      whyMarketMoved: "The right shoulder failed and canola leaked through the neckline once the crush-scare chase stalled.",
      evidence: "Canola head-and-shoulders tape plus weak-source chase chatter.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-int-gf-head-shoulders",
    title: "Feeder-cattle head-and-shoulders into a herd scare already in the highs",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE feeder-cattle future printed a left shoulder, a higher head, then a weaker right shoulder on a drought-herd scare. You have Indicators. Thin chatter says the right shoulder must break the head. Ask whether the scare is already in the head. Practice data only — not a live cattle desk.",
    newsHeadline:
      "Herd scare already ran. Thin chatter: feeder right shoulder must break the head.",
    preOhlc: GF_PRE,
    postOhlc: withAftermath(GF_PRE, [
      bar("+1", 264, 266, 252, 254),
      bar("+2", 254, 256, 242, 244),
      bar("+3", 244, 246, 232, 234),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Intermediate work is naming what is already in the price. A weaker right shoulder after a higher head is late-chase, not a new path. Fade or wait; HOLD if the slip already has your size. This is not the beginner canola H&S, not the live-cattle opening drive, not the oats three-push, and not a live feeder desk.",
      whyMarketMoved: "The right shoulder failed and feeders leaked through the neckline once the herd-scare chase stalled.",
      evidence: "Feeder-cattle head-and-shoulders tape plus a scare-already-ran headline.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "intermediate",
    assetClass: "future",
  },
  {
    id: "case-fut-tape-ke-tweezer",
    title: "Hard-red wheat tweezer top into a freeze scare already in the highs",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE Kansas hard-red wheat future rallied into two bars that share the same high after a Plains freeze scare already ran. Thin chatter says the tweezer must break. Ask whether the scare is already in those matching highs. Practice data only — not a live crop desk.",
    newsHeadline:
      "Freeze scare already ran. Thin chatter: hard-red wheat tweezer must break the match.",
    preOhlc: KE_PRE,
    postOhlc: withAftermath(KE_PRE, [
      bar("+1", 566, 568, 552, 554),
      bar("+2", 554, 556, 540, 542),
      bar("+3", 542, 544, 528, 530),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Two matching highs after a scare already ran is late-chase, not a new path. Fade or wait; HOLD if the slip already has your size. This is not the Chicago-wheat export-ban air-pocket, not the canola head-and-shoulders, not the feeder H&S, and not a live crop desk.",
      whyMarketMoved: "The matched high held and hard-red wheat leaked once the freeze-scare chase stalled.",
      evidence: "Hard-red wheat tweezer-top tape plus a scare-already-ran headline. Practice only.",
    },
    allowShort: false,
    packId: "futures-tape",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-tape-dc-evening-star",
    title: "Class-III milk evening star into an official inventory note",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE Class-III milk future rallied into a long green bar, a small star at the highs, then a red close back into that body. Then a scheduled dairy-board inventory note says supplies are larger than hoped. Official text, not chatter and not a freeze scare. Practice data only — not a live dairy desk.",
    newsHeadline:
      "Prepared inventory note: milk supplies larger than hoped. Official text, not chatter.",
    preOhlc: DC_PRE,
    postOhlc: withAftermath(DC_PRE, [
      bar("+1", 17.38, 17.4, 17.22, 17.24),
      bar("+2", 17.24, 17.26, 17.08, 17.1),
      bar("+3", 17.1, 17.12, 16.94, 16.96),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Treat an official inventory note as a headline with a named author. Larger milk supplies can weigh on this contract. The evening star is already a pause, not a new shortage path. HOLD if the slip already has your size. This is not the hard-red wheat tweezer, not the rice falling wedge, not the live-cattle packer-note drive, and not a live dairy desk.",
      whyMarketMoved: "The red close held and Class-III milk leaked once the larger-supply note printed.",
      evidence: "Class-III milk evening-star tape plus a prepared inventory headline. Practice only.",
    },
    allowShort: false,
    packId: "futures-tape",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-tape-bz-open-drive",
    title: "Brent futures open with a wide drive after an official OPEC statement",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE Brent crude future sat quiet, then opened with a wide drive higher after OPEC published a prepared statement: it will not raise output as soon as markets hoped. Official text, not chatter and not a data print. Practice data only — not a live energy desk.",
    newsHeadline:
      "Prepared statement: will not raise output as soon as hoped. Official OPEC text, not chatter.",
    preOhlc: BZ_PRE,
    postOhlc: withAftermath(BZ_PRE, [
      bar("+1", 86.18, 86.72, 86.08, 86.58),
      bar("+2", 86.58, 87.04, 86.48, 86.9),
      bar("+3", 86.9, 87.32, 86.8, 87.18),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Treat an official statement as a headline with a named author. A hold on extra output can bid this contract. The wide opening drive is often the story, not a fade. HOLD if the drive already has your size. This is not the hard-red wheat tweezer, not the Class-III milk evening star, not the live-cattle packer-note drive, not the WTI weak-tape supply chatter, and not a live energy desk.",
      whyMarketMoved: "The opening drive held and Brent kept grinding as the output-hold statement stayed in the tape.",
      evidence: "Brent opening-drive tape plus a prepared OPEC headline. Practice only.",
    },
    allowShort: false,
    packId: "futures-tape",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-tape-nkd-dump-no-reclaim",
    title: "Nikkei futures dump on a hike scare, no reclaim",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE Nikkei future already dumped after a BOJ hike scare ran through the tape. Thin chatter says the first bounce must reclaim. The bounce has not shown up. Ask whether the scare is already in the dump. Practice data only — not a live index desk.",
    newsHeadline:
      "Hike scare already ran. Thin chatter: Nikkei dump must reclaim. No bounce yet.",
    preOhlc: NKD_PRE,
    postOhlc: withAftermath(NKD_PRE, [
      bar("+1", 32220, 32260, 32080, 32100),
      bar("+2", 32100, 32140, 31960, 31980),
      bar("+3", 31980, 32020, 31840, 31860),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A dump with no reclaim is late-chase, not a new bounce path. Fade or wait; HOLD if the slip already has your size. This is not the hard-red wheat tweezer, not the Class-III milk evening star, not the Brent opening drive, not the gasoline demand dump, not the already-weak Nasdaq risk-off tape, and not a live index desk.",
      whyMarketMoved: "The dump continued; no bounce showed up after the hike scare.",
      evidence: "Nikkei dump-no-reclaim tape plus a scare-already-ran headline. Practice only.",
    },
    allowShort: false,
    packId: "futures-tape",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-tape-mw-inside-bar",
    title: "Spring wheat inside bar into an official USDA crop note still ahead",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE Minneapolis spring-wheat future printed a wide bar, then smaller bars fully inside that range. A scheduled USDA crop-progress note is still ahead. Thin chatter says the inside must break up. Practice data only — not a live crop desk. Chase a break that has not printed, or wait?",
    newsHeadline:
      "Inside bars on spring wheat. Official USDA crop-progress note still ahead. Thin chatter: must break up.",
    preOhlc: MW_PRE,
    postOhlc: withAftermath(MW_PRE, [
      bar("+1", 691, 696, 686, 690),
      bar("+2", 690, 695, 685, 689),
      bar("+3", 689, 694, 684, 688),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["buy", "sell"],
    debrief: {
      process:
        "An inside bar into an official statement still ahead is a wait. HOLD is the process answer until a side actually breaks. BUY or SELL is only partial if you already had a thesis and sized small. This is not the hard-red wheat tweezer, not the Class-III milk evening star, not the Brent opening drive, not the Nikkei dump, not the lumber mill-note inside bar, not the Chicago-wheat export-ban air-pocket, and not a live crop desk.",
      whyMarketMoved: "The mother-bar range held; no clean break through the crop-note window.",
      evidence: "Spring-wheat inside-bar tape plus a USDA-note-still-ahead headline. Practice only.",
    },
    allowShort: false,
    packId: "futures-tape",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-tape-zt-outside-bar",
    title: "Two-year note futures print an outside bar that closes weak",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE 2-year note future printed a wide bar that took both sides, then closed weak. Thin chatter says the upper wick must hold. Practice data only — not a live rates desk. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Outside bar on two-year notes. Thin chatter: wick must hold.",
    preOhlc: ZT_PRE,
    postOhlc: withAftermath(ZT_PRE, [
      bar("+1", 103.08, 103.12, 102.88, 102.92),
      bar("+2", 102.92, 102.96, 102.72, 102.76),
      bar("+3", 102.76, 102.8, 102.56, 102.6),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "An outside bar that closes weak is usually fade-or-wait, not a chase of the upper wick. HOLD if the slip already has your size. This is not the hard-red wheat tweezer, not the Class-III milk evening star, not the Brent opening drive, not the Nikkei dump, not the spring-wheat inside bar, not the lean-hog outside bar, not the long-bond risk-off opening drive, not the five-year CPI coil, not the ten-year double-bottom, and not a live rates desk.",
      whyMarketMoved: "The weak close continued lower; the upper wick did not hold.",
      evidence: "Two-year outside-bar tape plus thin wick-must-hold chatter. Practice only.",
    },
    allowShort: false,
    packId: "futures-tape",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-tape-6b-fail-break",
    title: "Sterling futures poke a range, then fail",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE British-pound future poked above a range, then slipped back. Thin chatter says the break must hold. Practice data only — not a live FX-futures desk. Chase the first green poke, wait, or take risk off?",
    newsHeadline:
      "Thin chatter: sterling-futures range break must hold.",
    preOhlc: B6_PRE,
    postOhlc: withAftermath(B6_PRE, [
      bar("+1", 1.2812, 1.2822, 1.2786, 1.2792),
      bar("+2", 1.2792, 1.2802, 1.2766, 1.2772),
      bar("+3", 1.2772, 1.2782, 1.2746, 1.2752),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A failed poke is usually fade-or-wait, not a chase. Do not treat the first green bar as a breakout. HOLD if the slip already has your size. This is not the hard-red wheat tweezer, not the Class-III milk evening star, not the Brent opening drive, not the Nikkei dump, not the spring-wheat inside bar, not the two-year outside bar, not the coffee fail-break, not the Aussie-dollar risk-off outside bar, not the GBP/USD dump tape, and not a live FX-futures desk.",
      whyMarketMoved: "The poke failed and sterling futures slipped back through the range.",
      evidence: "Sterling-futures failed-breakout tape plus thin range-break chatter. Practice only.",
    },
    allowShort: false,
    packId: "futures-tape",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-tape-6c-engulf",
    title: "Canadian-dollar futures print a bearish engulfing after a small green bar",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE Canadian-dollar future printed a small green bar, then a red bar whose body swallowed that green body. Thin chatter says the first green must resume. Practice data only — not a live FX-futures desk. Chase the swallowed green, wait, or take risk off?",
    newsHeadline:
      "Bearish engulfing on Canadian-dollar futures. Thin chatter: first green must resume.",
    preOhlc: C6_PRE,
    postOhlc: withAftermath(C6_PRE, [
      bar("+1", 0.7272, 0.7284, 0.7236, 0.7248),
      bar("+2", 0.7248, 0.726, 0.7212, 0.7224),
      bar("+3", 0.7224, 0.7236, 0.7188, 0.72),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish engulfing is usually fade-or-wait, not a chase of the swallowed green bar. This is not an outside bar: the red high stayed inside the prior high. HOLD if the slip already has your size. This is not the hard-red wheat tweezer, not the Class-III milk evening star, not the Brent opening drive, not the Nikkei dump, not the spring-wheat inside bar, not the two-year outside bar, not the sterling-futures fail-break, not the Aussie-dollar outside bar, not the lean-hog outside bar, not the EUR/NZD engulfing tape, and not a live FX-futures desk.",
      whyMarketMoved: "The engulfing close held and Canadian-dollar futures leaked; the small green bar did not resume.",
      evidence: "Canadian-dollar bearish-engulfing tape plus thin first-green-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "futures-tape",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-tape-6j-shooting-star",
    title: "Yen futures print a shooting star after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE yen future ground higher, then printed a shooting star: a small body near the lows with a long upper wick. Thin chatter says the wick must continue. Practice data only — not a live FX-futures desk. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Shooting star on yen futures. Thin chatter: upper wick must continue.",
    preOhlc: J6_PRE,
    postOhlc: withAftermath(J6_PRE, [
      bar("+1", 0.006982, 0.00699, 0.006948, 0.006954),
      bar("+2", 0.006954, 0.006962, 0.00692, 0.006926),
      bar("+3", 0.006926, 0.006934, 0.006892, 0.006898),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A shooting star after a grind is usually fade-or-wait, not a chase of the upper wick. This is not an outside bar: the low stayed inside the prior low. This is not an evening star (that is three bars) and not a bearish engulfing (the body did not swallow the prior body). HOLD if the slip already has your size. This is not the hard-red wheat tweezer, not the Class-III milk evening star, not the Brent opening drive, not the Nikkei dump, not the spring-wheat inside bar, not the two-year outside bar, not the sterling-futures fail-break, not the Canadian-dollar engulfing, not the Aussie-dollar outside bar, not the USD/JPY 148s spot tape, not the GBP/NOK shooting star, and not a live FX-futures desk.",
      whyMarketMoved: "The shooting-star close held and yen futures leaked; the upper wick did not continue.",
      evidence: "Yen-futures shooting-star tape plus thin wick-must-continue chatter. Practice only.",
    },
    allowShort: false,
    packId: "futures-tape",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-tape-6n-dark-cloud",
    title: "Kiwi futures print a dark-cloud cover after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE kiwi future printed a green bar, then a red bar that opened above that close and finished in the lower half of that body without swallowing it. Thin chatter says the gap-up open must continue. Practice data only — not a live FX-futures desk. Chase the gap-up, wait, or take risk off?",
    newsHeadline:
      "Dark-cloud cover on kiwi futures. Thin chatter: gap-up open must continue.",
    preOhlc: N6_PRE,
    postOhlc: withAftermath(N6_PRE, [
      bar("+1", 0.54708, 0.54782, 0.54346, 0.54412),
      bar("+2", 0.54412, 0.54486, 0.54048, 0.54114),
      bar("+3", 0.54114, 0.54188, 0.53752, 0.53818),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A dark-cloud cover is usually fade-or-wait, not a chase of the gap-up open. The red close is inside the prior body, so this is not a bearish engulfing. This is not an outside bar: the low stayed inside the prior low. This is not a shooting star (that is one long upper wick) and not an evening star (that is three bars). HOLD if the slip already has your size. This is not the hard-red wheat tweezer, not the Class-III milk evening star, not the Brent opening drive, not the Nikkei dump, not the spring-wheat inside bar, not the two-year outside bar, not the sterling-futures fail-break, not the Canadian-dollar engulfing, not the yen-futures shooting star, not the NZD/NOK dark-cloud tape, not the kiwi-spot stall, and not a live FX-futures desk.",
      whyMarketMoved: "The dark-cloud close held and kiwi futures leaked; the gap-up open did not continue.",
      evidence: "Kiwi-futures dark-cloud tape plus thin gap-up-must-continue chatter. Practice only.",
    },
    allowShort: false,
    packId: "futures-tape",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-tape-6l-three-crows",
    title: "Real futures print three black crows after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE real future ground higher, then printed three falling red bodies in a row. Thin chatter says the first red is a dip to buy. Practice data only — not a live FX-futures desk. Chase the dip, wait, or take risk off?",
    newsHeadline:
      "Three black crows on real futures. Thin chatter: first red is a dip to buy.",
    preOhlc: L6_PRE,
    postOhlc: withAftermath(L6_PRE, [
      bar("+1", 0.18326, 0.18334, 0.18288, 0.18296),
      bar("+2", 0.18296, 0.18304, 0.18258, 0.18266),
      bar("+3", 0.18266, 0.18274, 0.18228, 0.18236),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Three black crows after a grind are usually fade-or-wait, not a chase of the first red as a dip. This is not one bearish engulfing bar: three similar red bodies stepped lower. This is not an evening star (that is a small middle bar) and not a dark-cloud cover (that is two bars). HOLD if the slip already has your size. This is not the hard-red wheat tweezer, not the Class-III milk evening star, not the Brent opening drive, not the Nikkei dump, not the spring-wheat inside bar, not the two-year outside bar, not the sterling-futures fail-break, not the Canadian-dollar engulfing, not the yen-futures shooting star, not the kiwi-futures dark-cloud, not the NZD/SEK three-crows tape, not the USD/BRL spot double-bottom, and not a live FX-futures desk.",
      whyMarketMoved: "The third crow held and real futures leaked; the first red was not a dip to buy.",
      evidence: "Real-futures three-black-crows tape plus thin dip-to-buy chatter. Practice only.",
    },
    allowShort: false,
    packId: "futures-tape",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-tape-6h-hanging-man",
    title: "Hong Kong dollar futures print a hanging man after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE Hong Kong dollar future ground higher, then printed a hanging man: a small body near the highs with a long lower wick. Thin chatter says the lower wick must hold. Practice data only — not a live FX-futures desk. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Hanging man on Hong Kong dollar futures. Thin chatter: lower wick must hold.",
    preOhlc: H6_PRE,
    postOhlc: withAftermath(H6_PRE, [
      bar("+1", 0.12838, 0.12846, 0.12772, 0.12782),
      bar("+2", 0.12782, 0.1279, 0.12716, 0.12726),
      bar("+3", 0.12726, 0.12734, 0.1266, 0.1267),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A hanging man after a grind is usually fade-or-wait, not a chase of the lower wick as a dip. This is not a shooting star: that is a long upper wick. This is not a hammer: a hammer shows up after a decline, not after a grind. This is not a doji and not three black crows. This is not an outside bar: the high stayed inside the prior high. HOLD if the slip already has your size. This is not the hard-red wheat tweezer, not the Class-III milk evening star, not the Brent opening drive, not the Nikkei dump, not the spring-wheat inside bar, not the two-year outside bar, not the sterling-futures fail-break, not the Canadian-dollar engulfing, not the yen-futures shooting star, not the kiwi-futures dark-cloud, not the real-futures three-crows, not the GBP/SEK hanging-man tape, and not a live FX-futures desk.",
      whyMarketMoved: "The hanging-man close held and Hong Kong dollar futures leaked; the lower wick did not hold.",
      evidence: "Hong Kong dollar futures hanging-man tape plus thin lower-wick-must-hold chatter. Practice only.",
    },
    allowShort: false,
    packId: "futures-tape",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-tape-6r-harami",
    title: "Ruble futures print a bearish harami after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE ruble future ground higher into a tall green bar, then printed a small body fully inside that green body. Thin chatter says the small inside body means the grind must resume. Practice data only — not a live FX-futures desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Bearish harami on ruble futures. Thin chatter: small inside body means the grind must resume.",
    preOhlc: R6_PRE,
    postOhlc: withAftermath(R6_PRE, [
      bar("+1", 0.011368, 0.011382, 0.011318, 0.011328),
      bar("+2", 0.011328, 0.011342, 0.011268, 0.011282),
      bar("+3", 0.011282, 0.011296, 0.011218, 0.011232),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish harami after a grind is usually fade-or-wait, not a chase of the small inside body as a resume. The small body sits inside the prior body; this is not a bearish engulfing. This is not a hanging man (no long lower wick) and not a shooting star (no long upper wick). This is not the spring-wheat inside-bar-still-ahead HOLD: there is no official USDA note still ahead, and the process here is fade-or-wait, not wait-for-the-print. HOLD if the slip already has your size. This is not the hard-red wheat tweezer, not the Class-III milk evening star, not the Brent opening drive, not the Nikkei dump, not the spring-wheat inside bar, not the two-year outside bar, not the sterling-futures fail-break, not the Canadian-dollar engulfing, not the yen-futures shooting star, not the kiwi-futures dark-cloud, not the real-futures three-crows, not the Hong Kong dollar hanging man, not the EUR/PLN harami tape, and not a live FX-futures desk.",
      whyMarketMoved: "The harami close held and ruble futures leaked; the small inside body was not a resume of the grind.",
      evidence: "Ruble-futures bearish-harami tape plus thin grind-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "futures-tape",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-tape-6k-marubozu",
    title: "Krona futures print a bearish marubozu after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE krona future ground higher, then printed a long red bar that opened near its high and closed near its low, with almost no wicks. Thin chatter says the long red close must bounce. Practice data only — not a live FX-futures desk. Chase the red as a dip, wait, or take risk off?",
    newsHeadline:
      "Bearish marubozu on krona futures. Thin chatter: long red close must bounce.",
    preOhlc: K6_PRE,
    postOhlc: withAftermath(K6_PRE, [
      bar("+1", 0.09428, 0.09438, 0.09388, 0.09398),
      bar("+2", 0.09398, 0.09408, 0.09348, 0.09358),
      bar("+3", 0.09358, 0.09368, 0.09308, 0.09318),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish marubozu after a grind is usually fade-or-wait, not a chase of the long red close as a bounce. The bar opened near the high and closed near the low with tiny wicks; this is not a hanging man (no long lower wick) and not a shooting star (no long upper wick). This is not a bearish engulfing: the red body does not swallow the prior green body. This is not three black crows (one bar, not three) and not a dark-cloud cover (that opens above the prior close and stays inside the prior body). This is not a harami: the last bar is large, not a small body inside the prior body. HOLD if the slip already has your size. This is not the hard-red wheat tweezer, not the Class-III milk evening star, not the Brent opening drive, not the Nikkei dump, not the spring-wheat inside bar, not the two-year outside bar, not the sterling-futures fail-break, not the Canadian-dollar engulfing, not the yen-futures shooting star, not the kiwi-futures dark-cloud, not the real-futures three-crows, not the Hong Kong dollar hanging man, not the ruble-futures harami, not the EUR/CZK marubozu tape, and not a live FX-futures desk.",
      whyMarketMoved: "The marubozu close held and krona futures leaked; the long red close was not a bounce.",
      evidence: "Krona-futures bearish-marubozu tape plus thin long-red-must-bounce chatter. Practice only.",
    },
    allowShort: false,
    packId: "futures-tape",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-tape-i6-gravestone",
    title: "Ringgit futures print a gravestone doji after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE ringgit future ground higher, then printed a gravestone doji: open and close sit on the lows with a long upper wick and almost no body. Thin chatter says the wick must continue. Practice data only — not a live FX-futures desk. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Gravestone doji on ringgit futures. Thin chatter: upper wick must continue.",
    preOhlc: I6_PRE,
    postOhlc: withAftermath(I6_PRE, [
      bar("+1", 0.21566, 0.21578, 0.21486, 0.21498),
      bar("+2", 0.21498, 0.21508, 0.21412, 0.21424),
      bar("+3", 0.21424, 0.21434, 0.21348, 0.21358),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A gravestone doji after a grind is usually fade-or-wait, not a chase of the upper wick. Open and close sit on the lows with almost no body; this is not a shooting star (that has a small real body near the lows). This is not a hanging man (no long lower wick) and not a marubozu (this bar has a long upper wick). This is not an outside bar: the low stayed inside the prior low. This is not a harami (the last bar is not a small body inside the prior body). HOLD if the slip already has your size. This is not the hard-red wheat tweezer, not the Class-III milk evening star, not the Brent opening drive, not the Nikkei dump, not the spring-wheat inside bar, not the two-year outside bar, not the sterling-futures fail-break, not the Canadian-dollar engulfing, not the yen-futures shooting star, not the kiwi-futures dark-cloud, not the real-futures three-crows, not the Hong Kong dollar hanging man, not the ruble-futures harami, not the krona-futures marubozu, not the EUR/HUF gravestone tape, and not a live FX-futures desk.",
      whyMarketMoved: "The gravestone close held and ringgit futures leaked; the upper wick did not continue.",
      evidence: "Ringgit-futures gravestone-doji tape plus thin wick-must-continue chatter. Practice only.",
    },
    allowShort: false,
    packId: "futures-tape",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-tape-idr-harami-cross",
    title: "Rupiah futures print a harami cross after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE rupiah future ground higher into a tall green bar, then printed a doji fully inside that green body. Thin chatter says the doji means the grind must resume. Practice data only — not a live FX-futures desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Harami cross on rupiah futures. Thin chatter: the doji means the grind must resume.",
    preOhlc: IDR6_PRE,
    postOhlc: withAftermath(IDR6_PRE, [
      bar("+1", 16265.2, 16272.4, 16218.6, 16228.8),
      bar("+2", 16228.8, 16236.2, 16174.4, 16186.6),
      bar("+3", 16186.6, 16194.2, 16128.4, 16140.8),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A harami cross after a grind is usually fade-or-wait, not a chase of the inside doji as a resume. The doji sits inside the prior body; this is not a bearish harami with a small real body, and not a gravestone (open and close are not pinned to the lows with a long upper wick). This is not a hanging man (no long lower wick) and not a shooting star (no long upper wick from the lows). This is not the spring-wheat inside-bar-still-ahead HOLD: there is no official USDA note still ahead, and the process here is fade-or-wait, not wait-for-the-print. HOLD if the slip already has your size. This is not the hard-red wheat tweezer, not the Class-III milk evening star, not the Brent opening drive, not the Nikkei dump, not the spring-wheat inside bar, not the two-year outside bar, not the sterling-futures fail-break, not the Canadian-dollar engulfing, not the yen-futures shooting star, not the kiwi-futures dark-cloud, not the real-futures three-crows, not the Hong Kong dollar hanging man, not the ruble-futures harami, not the krona-futures marubozu, not the ringgit-futures gravestone, not the GBP/HUF harami-cross tape, and not a live FX-futures desk.",
      whyMarketMoved: "The harami-cross close held and rupiah futures leaked; the inside doji was not a resume of the grind.",
      evidence: "Rupiah-futures harami-cross tape plus thin doji-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "futures-tape",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-tape-clp-spinning-top",
    title: "Chilean-peso futures print a spinning top after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE Chilean-peso future ground higher, then printed a spinning top: a small real body near the middle of the bar with upper and lower wicks of similar length. Thin chatter says the pause means the grind must resume. Practice data only — not a live FX-futures desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Spinning top on Chilean-peso futures. Thin chatter: the pause means the grind must resume.",
    preOhlc: CLP6_PRE,
    postOhlc: withAftermath(CLP6_PRE, [
      bar("+1", 0.0010704, 0.0010728, 0.0010586, 0.0010602),
      bar("+2", 0.0010602, 0.0010624, 0.0010468, 0.0010486),
      bar("+3", 0.0010486, 0.0010508, 0.0010348, 0.0010366),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A spinning top after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar has a small real body near the middle with wicks both ways; this is not a hanging man (that sits near the highs with a long lower wick only) and not a shooting star (that sits near the lows with a long upper wick only). This is not a harami cross: the last bar is not a doji sitting inside the prior body. This is not a gravestone (open and close are not pinned to the lows). This is not the spring-wheat inside-bar-still-ahead HOLD: there is no official USDA note still ahead, and the process here is fade-or-wait, not wait-for-the-print. HOLD if the slip already has your size. This is not the hard-red wheat tweezer, not the Class-III milk evening star, not the Brent opening drive, not the Nikkei dump, not the spring-wheat inside bar, not the two-year outside bar, not the sterling-futures fail-break, not the Canadian-dollar engulfing, not the yen-futures shooting star, not the kiwi-futures dark-cloud, not the real-futures three-crows, not the Hong Kong dollar hanging man, not the ruble-futures harami, not the krona-futures marubozu, not the ringgit-futures gravestone, not the rupiah-futures harami-cross, not the EUR/RON spinning-top tape, not the USD/CLP 938 spot outside-bar, not the Mexican-peso dark-cloud, not the won-futures marubozu, and not a live FX-futures desk.",
      whyMarketMoved: "The spinning-top close held and Chilean-peso futures leaked; the pause was not a resume of the grind.",
      evidence: "Chilean-peso-futures spinning-top tape plus thin pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "futures-tape",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-tape-cop-long-legged-doji",
    title: "Colombian-peso futures print a long-legged doji after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE Colombian-peso future ground higher, then printed a long-legged doji: open and close sit together with long upper and lower wicks of similar length. Thin chatter says the long-legged pause means the grind must resume. Practice data only — not a live FX-futures desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Long-legged doji on Colombian-peso futures. Thin chatter: the long-legged pause means the grind must resume.",
    preOhlc: COP6_PRE,
    postOhlc: withAftermath(COP6_PRE, [
      bar("+1", 0.00026328, 0.00026372, 0.00026054, 0.00026098),
      bar("+2", 0.00026098, 0.00026138, 0.00025764, 0.00025808),
      bar("+3", 0.00025808, 0.00025848, 0.00025486, 0.00025528),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A long-legged doji after a grind is usually fade-or-wait, not a chase of the pause as a resume. Open and close sit together with long wicks both ways; this is not a spinning top (that has a small real body). This is not a gravestone (open and close are not pinned to the lows with a long upper wick only). This is not a harami cross: the doji is not sitting inside the prior body. This is not a hanging man (no long lower wick only) and not a shooting star (no long upper wick from the lows). This is not the spring-wheat inside-bar-still-ahead HOLD: there is no official USDA note still ahead, and the process here is fade-or-wait, not wait-for-the-print. HOLD if the slip already has your size. This is not the hard-red wheat tweezer, not the Class-III milk evening star, not the Brent opening drive, not the Nikkei dump, not the spring-wheat inside bar, not the two-year outside bar, not the sterling-futures fail-break, not the Canadian-dollar engulfing, not the yen-futures shooting star, not the kiwi-futures dark-cloud, not the real-futures three-crows, not the Hong Kong dollar hanging man, not the ruble-futures harami, not the krona-futures marubozu, not the ringgit-futures gravestone, not the rupiah-futures harami-cross, not the Chilean-peso spinning top, not the forint-futures spinning-top macro, not the zloty-futures hanging man, not the GBP/RON long-legged-doji tape, and not a live FX-futures desk.",
      whyMarketMoved: "The long-legged-doji close held and Colombian-peso futures leaked; the pause was not a resume of the grind.",
      evidence: "Colombian-peso-futures long-legged-doji tape plus thin long-legged-pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "futures-tape",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-tape-pen-dragonfly",
    title: "Peruvian-sol futures print a dragonfly doji after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE Peruvian-sol future ground higher, then printed a dragonfly doji: open and close sit together at the highs with a long lower wick only. The sol is grouped with risk currencies in this SAMPLE brief, not a haven bid. Thin chatter says the dragonfly pause means the grind must resume. Practice data only — not a live FX-futures desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Dragonfly doji on Peruvian-sol futures. Thin chatter: the dragonfly pause means the grind must resume.",
    preOhlc: PEN6_PRE,
    postOhlc: withAftermath(PEN6_PRE, [
      bar("+1", 0.41928, 0.42064, 0.41064, 0.41218),
      bar("+2", 0.41218, 0.41348, 0.40364, 0.40528),
      bar("+3", 0.40528, 0.40664, 0.39618, 0.39786),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A dragonfly doji after a grind is usually fade-or-wait, not a chase of the pause as a resume. Open and close sit together at the highs with a long lower wick; this is not a hanging man (that has a small real body near the highs). This is not a gravestone (open and close are not pinned to the lows with a long upper wick). This is not a long-legged doji (no long upper wick). This is not a spinning top (no small real body in the middle). This is not a harami cross: the doji is not sitting inside the prior body. This is not the spring-wheat inside-bar-still-ahead HOLD: there is no official USDA note still ahead, and the process here is fade-or-wait, not wait-for-the-print. HOLD if the slip already has your size. This is not the hard-red wheat tweezer, not the Class-III milk evening star, not the Brent opening drive, not the Nikkei dump, not the spring-wheat inside bar, not the two-year outside bar, not the sterling-futures fail-break, not the Canadian-dollar engulfing, not the yen-futures shooting star, not the kiwi-futures dark-cloud, not the real-futures three-crows, not the Hong Kong dollar hanging man, not the ruble-futures harami, not the krona-futures marubozu, not the ringgit-futures gravestone, not the rupiah-futures harami-cross, not the Chilean-peso spinning top, not the Colombian-peso long-legged doji, not the forint-futures spinning-top macro, not the shekel-futures long-legged-doji macro, not the zloty-futures hanging man, not the AUD/RON dragonfly tape, and not a live FX-futures desk.",
      whyMarketMoved: "The dragonfly-doji close held and Peruvian-sol futures leaked; the pause was not a resume of the grind.",
      evidence: "Peruvian-sol-futures dragonfly-doji tape plus thin dragonfly-pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "futures-tape",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-tape-sgd-matching-high",
    title: "Singapore-dollar futures print a matching high after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE Singapore-dollar future ground higher into a tall green bar, then printed a small green bar that tags nearly the same high and closes weak under it. Thin chatter says the matching-high pause means the grind must resume. Practice data only — not a live FX-futures desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Matching high on Singapore-dollar futures. Thin chatter: the matching-high pause means the grind must resume.",
    preOhlc: SGD6_PRE,
    postOhlc: withAftermath(SGD6_PRE, [
      bar("+1", 0.74686, 0.74718, 0.74086, 0.74148),
      bar("+2", 0.74148, 0.74186, 0.73528, 0.73586),
      bar("+3", 0.73586, 0.73628, 0.72864, 0.72948),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A matching high after a grind is usually fade-or-wait, not a chase of the pause as a resume. Both bars are green and share nearly the same high; the last close sits weak under that high. This is not a tweezer: a tweezer tags the high with opposite-color bodies. This is not a shooting star (the last body is not sitting near the lows with a long upper wick only). This is not a dragonfly (open and close are not pinned to the highs with a long lower wick). This is not a harami: the last high pokes to the prior high, not a small body fully inside the prior body. This is not the spring-wheat inside-bar-still-ahead HOLD: there is no official USDA note still ahead, and the process here is fade-or-wait, not wait-for-the-print. HOLD if the slip already has your size. This is not the hard-red wheat tweezer, not the Class-III milk evening star, not the Brent opening drive, not the Nikkei dump, not the spring-wheat inside bar, not the two-year outside bar, not the sterling-futures fail-break, not the Canadian-dollar engulfing, not the yen-futures shooting star, not the kiwi-futures dark-cloud, not the real-futures three-crows, not the Hong Kong dollar hanging man, not the ruble-futures harami, not the krona-futures marubozu, not the ringgit-futures gravestone, not the rupiah-futures harami-cross, not the Chilean-peso spinning top, not the Colombian-peso long-legged doji, not the Peruvian-sol dragonfly, not the offshore-yuan dragonfly macro, not the USD/SGD rumor-spike tape, and not a live FX-futures desk.",
      whyMarketMoved: "The matching-high close held and Singapore-dollar futures leaked; the pause was not a resume of the grind.",
      evidence: "Singapore-dollar-futures matching-high tape plus thin matching-high-pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "futures-tape",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-tape-twd-belt-hold",
    title: "Taiwan-dollar futures print a bearish belt hold after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE Taiwan-dollar future ground higher, then printed a bearish belt hold: the last bar opens at its high with no upper wick and sells off, closing weak with a real body and a lower wick. Thin chatter says the belt-hold pause means the grind must resume. Practice data only — not a live FX-futures desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Bearish belt hold on Taiwan-dollar futures. Thin chatter: the belt-hold pause means the grind must resume.",
    preOhlc: TWD6_PRE,
    postOhlc: withAftermath(TWD6_PRE, [
      bar("+1", 0.032818, 0.032858, 0.032486, 0.032528),
      bar("+2", 0.032528, 0.032568, 0.032148, 0.032186),
      bar("+3", 0.032186, 0.032228, 0.031648, 0.031698),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish belt hold after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar opens at the high with no upper wick and sells off into a real body; a lower wick is allowed. This is not a marubozu: a marubozu has tiny wicks at both ends and closes near the low. This is not a matching high: both of those bars are green and share nearly the same high. This is not a hanging man (the body is not a small real body near the highs with a long lower wick). This is not a shooting star (there is no long upper wick from the lows). HOLD if the slip already has your size. This is not the hard-red wheat tweezer, not the Class-III milk evening star, not the Brent opening drive, not the Nikkei dump, not the spring-wheat inside bar, not the two-year outside bar, not the sterling-futures fail-break, not the Canadian-dollar engulfing, not the yen-futures shooting star, not the kiwi-futures dark-cloud, not the real-futures three-crows, not the Hong Kong dollar hanging man, not the ruble-futures harami, not the krona-futures marubozu, not the ringgit-futures gravestone, not the rupiah-futures harami-cross, not the Chilean-peso spinning top, not the Colombian-peso long-legged doji, not the Peruvian-sol dragonfly, not the Singapore-dollar matching high, not the lira-futures harami, not the USD/TWD foundry-order staircase, and not a live FX-futures desk.",
      whyMarketMoved: "The belt-hold close held and Taiwan-dollar futures leaked; the pause was not a resume of the grind.",
      evidence: "Taiwan-dollar-futures bearish-belt-hold tape plus thin belt-hold-pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "futures-tape",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-tape-czk-separating-lines",
    title: "Czech-koruna futures print bearish separating lines after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE Czech-koruna future ground higher into a tall green bar, then printed a long red bar that opens at nearly the same open as that green bar and sells off. Thin chatter says the separating-lines pause means the grind must resume. Practice data only — not a live FX-futures desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Bearish separating lines on Czech-koruna futures. Thin chatter: the separating-lines pause means the grind must resume.",
    preOhlc: CZK6_PRE,
    postOhlc: withAftermath(CZK6_PRE, [
      bar("+1", 0.15568, 0.15648, 0.14886, 0.14968),
      bar("+2", 0.14968, 0.15048, 0.14218, 0.14308),
      bar("+3", 0.14308, 0.14386, 0.13486, 0.13568),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Bearish separating lines after a grind are usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens at nearly the same open as the prior tall green and sells off. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick, usually after the prior close, not back at the prior open. This is not a marubozu: a marubozu has tiny wicks at both ends and closes near the low. This is not a matching high: both of those bars are green and share nearly the same high. This is not a hanging man (the body is not a small real body near the highs with a long lower wick). This is not a shooting star (there is no long upper wick from the lows). HOLD if the slip already has your size. This is not the hard-red wheat tweezer, not the Class-III milk evening star, not the Brent opening drive, not the Nikkei dump, not the spring-wheat inside bar, not the two-year outside bar, not the sterling-futures fail-break, not the Canadian-dollar engulfing, not the yen-futures shooting star, not the kiwi-futures dark-cloud, not the real-futures three-crows, not the Hong Kong dollar hanging man, not the ruble-futures harami, not the krona-futures marubozu, not the ringgit-futures gravestone, not the rupiah-futures harami-cross, not the Chilean-peso spinning top, not the Colombian-peso long-legged doji, not the Peruvian-sol dragonfly, not the Singapore-dollar matching high, not the Taiwan-dollar belt hold, not the USD/TWD foundry-order staircase, not the AUD/CZK belt-hold spot tape, not the NZD/CZK separating-lines spot tape, and not a live FX-futures desk.",
      whyMarketMoved: "The separating-lines close held and Czech-koruna futures leaked; the pause was not a resume of the grind.",
      evidence: "Czech-koruna-futures bearish-separating-lines tape plus thin separating-lines-pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "futures-tape",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-tape-nok-on-neck",
    title: "Norwegian-krone futures print a bearish on-neck after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE Norwegian-krone future ground higher into a tall green bar, then printed a long red bar that opens above that green close and closes at nearly the prior low. Thin chatter says the on-neck pause means the grind must resume. Practice data only — not a live FX-futures desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Bearish on-neck on Norwegian-krone futures. Thin chatter: the on-neck pause means the grind must resume.",
    preOhlc: NOK6_PRE,
    postOhlc: withAftermath(NOK6_PRE, [
      bar("+1", 0.11528, 0.11564, 0.11286, 0.11318),
      bar("+2", 0.11318, 0.11348, 0.11048, 0.11086),
      bar("+3", 0.11086, 0.11118, 0.10786, 0.10828),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish on-neck after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens above the prior close and closes at nearly the prior low. This is not separating lines: those share nearly the same open as the prior tall green. This is not a dark-cloud: a dark-cloud closes in the lower half of the prior body, still above that prior open, not at the prior low. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick. This is not a matching high: both of those bars are green and share nearly the same high. This is not a hanging man (the body is not a small real body near the highs with a long lower wick). HOLD if the slip already has your size. This is not the hard-red wheat tweezer, not the Class-III milk evening star, not the Brent opening drive, not the Nikkei dump, not the spring-wheat inside bar, not the two-year outside bar, not the sterling-futures fail-break, not the Canadian-dollar engulfing, not the yen-futures shooting star, not the kiwi-futures dark-cloud, not the real-futures three-crows, not the Hong Kong dollar hanging man, not the ruble-futures harami, not the krona-futures marubozu, not the ringgit-futures gravestone, not the rupiah-futures harami-cross, not the Chilean-peso spinning top, not the Colombian-peso long-legged doji, not the Peruvian-sol dragonfly, not the Singapore-dollar matching high, not the Taiwan-dollar belt hold, not the Czech-koruna separating lines, not the Danish-krone gravestone macro, not the EUR/DKK on-neck spot tape, not the GBP/NOK shooting-star spot tape, not the NZD/NOK dark-cloud spot tape, and not a live FX-futures desk.",
      whyMarketMoved: "The on-neck close held and Norwegian-krone futures leaked; the pause was not a resume of the grind.",
      evidence: "Norwegian-krone-futures bearish-on-neck tape plus thin on-neck-pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "futures-tape",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-tape-bgn-in-neck",
    title: "Bulgarian-lev futures print a bearish in-neck after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE Bulgarian-lev future ground higher into a tall green bar, then printed a long red bar that opens above that green close and closes at nearly that same close, not the prior low. Thin chatter says the in-neck pause means the grind must resume. Practice data only — not a live FX-futures desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Bearish in-neck on Bulgarian-lev futures. Thin chatter: the in-neck pause means the grind must resume.",
    preOhlc: BGN6_PRE,
    postOhlc: withAftermath(BGN6_PRE, [
      bar("+1", 0.9448, 0.9528, 0.9186, 0.9264),
      bar("+2", 0.9264, 0.9348, 0.8864, 0.8948),
      bar("+3", 0.8948, 0.9028, 0.8486, 0.8564),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish in-neck after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens above the prior close and closes at nearly that same close, not the prior low. This is not on-neck: on-neck closes at nearly the prior low. This is not a dark-cloud: a dark-cloud closes in the lower half of the prior body, still above that prior open, not back at the prior close. This is not separating lines: those share nearly the same open as the prior tall green. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick. This is not a matching high: both of those bars are green and share nearly the same high. This is not kiwi-futures: 6N is the dark-cloud near 0.550, not this lev in-neck. HOLD if the slip already has your size. This is not the hard-red wheat tweezer, not the Class-III milk evening star, not the Brent opening drive, not the Nikkei dump, not the spring-wheat inside bar, not the two-year outside bar, not the sterling-futures fail-break, not the Canadian-dollar engulfing, not the yen-futures shooting star, not the kiwi-futures dark-cloud, not the real-futures three-crows, not the Hong Kong dollar hanging man, not the ruble-futures harami, not the krona-futures marubozu, not the ringgit-futures gravestone, not the rupiah-futures harami-cross, not the Chilean-peso spinning top, not the Colombian-peso long-legged doji, not the Peruvian-sol dragonfly, not the Singapore-dollar matching high, not the Taiwan-dollar belt hold, not the Czech-koruna separating lines, not the Norwegian-krone on-neck, not the Icelandic-krona on-neck macro, not the GBP/DKK in-neck spot tape, and not a live FX-futures desk.",
      whyMarketMoved: "The in-neck close held and Bulgarian-lev futures leaked; the pause was not a resume of the grind.",
      evidence: "Bulgarian-lev-futures bearish-in-neck tape plus thin in-neck-pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "futures-tape",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-tape-uah-thrusting",
    title: "Ukrainian-hryvnia futures print a bearish thrusting line after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE Ukrainian-hryvnia future ground higher into a tall green bar, then printed a long red bar that opens above that green close and closes into that prior body, still above the midpoint. Thin chatter says the thrusting pause means the grind must resume. Practice data only — not a live FX-futures desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Bearish thrusting line on Ukrainian-hryvnia futures. Thin chatter: the thrusting pause means the grind must resume.",
    preOhlc: UAH6_PRE,
    postOhlc: withAftermath(UAH6_PRE, [
      bar("+1", 0.022268, 0.022486, 0.020918, 0.021148),
      bar("+2", 0.021148, 0.021368, 0.019648, 0.019868),
      bar("+3", 0.019868, 0.020086, 0.018248, 0.018468),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish thrusting line after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens above the prior close and closes into that prior body, still above the midpoint. This is not in-neck: in-neck closes at nearly the prior close. This is not on-neck: on-neck closes at nearly the prior low. This is not a dark-cloud: a dark-cloud closes in the lower half of the prior body, still above that prior open. This is not separating lines: those share nearly the same open as the prior tall green. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick. This is not a matching high: both of those bars are green and share nearly the same high. This is not Bulgarian-lev: that in-neck sits near 0.94, not this hryvnia thrusting line. This is not Thai-baht: that matching high sits near 0.0276. HOLD if the slip already has your size. This is not the hard-red wheat tweezer, not the Class-III milk evening star, not the Brent opening drive, not the Nikkei dump, not the spring-wheat inside bar, not the two-year outside bar, not the sterling-futures fail-break, not the Canadian-dollar engulfing, not the yen-futures shooting star, not the kiwi-futures dark-cloud, not the real-futures three-crows, not the Hong Kong dollar hanging man, not the ruble-futures harami, not the krona-futures marubozu, not the ringgit-futures gravestone, not the rupiah-futures harami-cross, not the Chilean-peso spinning top, not the Colombian-peso long-legged doji, not the Peruvian-sol dragonfly, not the Singapore-dollar matching high, not the Taiwan-dollar belt hold, not the Czech-koruna separating lines, not the Norwegian-krone on-neck, not the Bulgarian-lev in-neck, not the Georgian-lari in-neck macro, not the CHF/DKK thrusting spot tape, and not a live FX-futures desk.",
      whyMarketMoved: "The thrusting close held and Ukrainian-hryvnia futures leaked; the pause was not a resume of the grind.",
      evidence: "Ukrainian-hryvnia-futures bearish-thrusting tape plus thin thrusting-pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "futures-tape",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-macro-zb-open-drive",
    title: "Long-bond futures open with a wide drive as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE 30-year bond future sat quiet, then opened with a wide drive higher as risk appetite faded. Some traders buy duration in a scare. Ask whether that drive already has your size. Practice data only — not a live rates desk.",
    newsHeadline:
      "Risk-off. Duration bid as a scare asset in this SAMPLE brief. Long-bond futures opened with a wide drive.",
    preOhlc: ZB_PRE,
    postOhlc: withAftermath(ZB_PRE, [
      bar("+1", 125.62, 126.2, 125.5, 125.96),
      bar("+2", 125.96, 126.4, 125.8, 126.18),
      bar("+3", 126.18, 126.6, 126.0, 126.38),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off duration bid can lift this contract. The wide opening drive is often the story, not a fade. BUY if you still have room; HOLD if the drive already has your size. This is not the ten-year double-bottom after a jobs scare, not the live-cattle packer-note drive, not the hard-red wheat tweezer, and not a live bond desk.",
      whyMarketMoved: "The opening drive held and long bonds kept grinding as duration stayed bid.",
      evidence: "30-year opening-drive tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "futures-macro",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-macro-zf-cpi-print",
    title: "Five-year note futures coiled into a hot CPI print",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "This SAMPLE 5-year note future has been coiled in a tight range into a scheduled CPI print. The print comes in hot. Duration often sells when inflation reprints firmer. Ask whether the coil is a pause or already your size. Practice data only — not a live rates desk.",
    newsHeadline: "Hot CPI print. Rate-cut odds fall. Five-year note futures in focus.",
    preOhlc: ZF_PRE,
    postOhlc: withAftermath(ZF_PRE, [
      bar("+1", 106.58, 106.6, 106.28, 106.32),
      bar("+2", 106.32, 106.36, 106.04, 106.08),
      bar("+3", 106.08, 106.12, 105.8, 105.84),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Size for surprise into data. A hot CPI print can reprice duration, so this contract can fall. HOLD if the coil already has your size. This is not the long-bond risk-off opening drive, not the ten-year double-bottom after a jobs scare, not the index-futures hot-print grind, and not a live rates desk.",
      whyMarketMoved: "The coil broke lower as five-year notes sold the hot CPI print.",
      evidence: "Five-year coil tape plus a CPI-print brief. Practice only.",
    },
    allowShort: false,
    packId: "futures-macro",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-macro-ali-smelter-supply",
    title: "Aluminum futures grind into a smelter-power outage",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "This SAMPLE aluminum future has been grinding higher. Then a smelter-power outage hits. Name which side this contract is on: the metal, not the power plant. Practice data only — not a live metals desk.",
    newsHeadline:
      "Smelter-power outage. Aluminum supply tight in this SAMPLE brief.",
    preOhlc: ALI_PRE,
    postOhlc: withAftermath(ALI_PRE, [
      bar("+1", 2518, 2558, 2514, 2548),
      bar("+2", 2548, 2582, 2542, 2574),
      bar("+3", 2574, 2604, 2568, 2596),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A supply scare can bid the metal that is actually short. Here aluminum is the tight side, so this contract can rise. HOLD if the grind already has your size. This is not the crude weak-tape-then-bid, not the sugar export-port staircase, not the long-bond risk-off drive, not the five-year CPI coil, and not a live metals desk.",
      whyMarketMoved: "The grind continued as aluminum bid the smelter outage.",
      evidence: "Aluminum grind tape plus a metal-side smelter-outage headline. Practice only.",
    },
    allowShort: false,
    packId: "futures-macro",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-macro-hrc-dump-no-reclaim",
    title: "Steel-coil futures dump as risk appetite fades, no reclaim",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE hot-rolled coil steel future already dumped as risk appetite faded. Steel is the cyclical industrial in this SAMPLE brief, not duration. Thin chatter says the first bounce must reclaim. The bounce has not shown up. Practice data only — not a live metals desk.",
    newsHeadline:
      "Risk-off. Steel-coil sold with cyclicals. Thin chatter: dump must reclaim. No bounce yet.",
    preOhlc: HRC_PRE,
    postOhlc: withAftermath(HRC_PRE, [
      bar("+1", 782, 788, 768, 772),
      bar("+2", 772, 778, 758, 762),
      bar("+3", 762, 768, 748, 752),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this contract falling when steel is the cyclical side. A dump with no reclaim is late-chase, not a new bounce path. Fade or wait; HOLD if the slip already has your size. This is not the long-bond duration opening drive, not the five-year CPI coil, not the aluminum smelter grind, not the already-weak Nasdaq slide, not the Nikkei hike-scare dump, and not a live metals desk.",
      whyMarketMoved: "The dump continued; no bounce showed up as steel stayed offered with risk.",
      evidence: "Steel-coil dump-no-reclaim tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "futures-macro",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-macro-emd-evening-star",
    title: "Midcap futures evening star as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE S&P MidCap future rallied into a long green bar, a small star at the highs, then a red close back into that body as risk appetite faded. Midcaps are the cyclical equity side in this SAMPLE brief, not duration. Ask whether that evening star is a pause or a new bid. Practice data only — not a live index desk.",
    newsHeadline:
      "Risk-off. Midcap futures sold with cyclicals. Evening star at the highs, not a reclaim.",
    preOhlc: EMD_PRE,
    postOhlc: withAftermath(EMD_PRE, [
      bar("+1", 2852, 2858, 2824, 2828),
      bar("+2", 2828, 2834, 2800, 2804),
      bar("+3", 2804, 2810, 2776, 2780),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this contract falling when midcaps are the cyclical side. The evening star is already a pause, not a new bid path. Fade or wait; HOLD if the slip already has your size. This is not the Class-III milk evening star, not the long-bond duration opening drive, not the five-year CPI coil, not the aluminum smelter grind, not the steel-coil dump-no-reclaim, not the already-weak Nasdaq slide, not the Nikkei hike-scare dump, and not a live index desk.",
      whyMarketMoved: "The red close held and midcaps leaked as cyclicals stayed offered with risk.",
      evidence: "Midcap evening-star tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "futures-macro",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-macro-6a-outside-bar",
    title: "Aussie-dollar futures print an outside bar that closes weak as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE Australian-dollar future printed a wide bar that took both sides, then closed weak as risk appetite faded. The Aussie is the risk currency in this SAMPLE brief, not duration. Thin chatter says the upper wick must hold. Practice data only — not a live FX-futures desk. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Aussie-dollar futures sold with risk currencies. Outside bar. Thin chatter: wick must hold.",
    preOhlc: A6_PRE,
    postOhlc: withAftermath(A6_PRE, [
      bar("+1", 0.6716, 0.6722, 0.6692, 0.6698),
      bar("+2", 0.6698, 0.6704, 0.6674, 0.668),
      bar("+3", 0.668, 0.6686, 0.6656, 0.6662),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this contract falling when the Aussie is the risk side. An outside bar that closes weak is usually fade-or-wait, not a chase of the upper wick. HOLD if the slip already has your size. This is not the long-bond duration opening drive, not the five-year CPI coil, not the aluminum smelter grind, not the steel-coil dump-no-reclaim, not the midcap evening star, not the lean-hog outside bar, not the two-year tape outside bar, not the AUD/USD risk-on grind, and not a live FX-futures desk.",
      whyMarketMoved: "The weak close continued lower; the upper wick did not hold as the Aussie stayed offered with risk.",
      evidence: "Aussie-dollar outside-bar tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "futures-macro",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-macro-ni-fail-break",
    title: "Nickel futures poke a range, then fail as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE nickel future poked above a range, then slipped back as risk appetite faded. Nickel is the cyclical industrial metal in this SAMPLE brief, not duration. Thin chatter says the break must hold. Practice data only — not a live metals desk. Chase the first green poke, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Nickel sold with cyclicals. Thin chatter: range break must hold.",
    preOhlc: NI_PRE,
    postOhlc: withAftermath(NI_PRE, [
      bar("+1", 16188, 16212, 16132, 16144),
      bar("+2", 16144, 16168, 16088, 16100),
      bar("+3", 16100, 16124, 16044, 16056),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this contract falling when nickel is the cyclical industrial side. A failed poke is usually fade-or-wait, not a chase. Do not treat the first green bar as a breakout. HOLD if the slip already has your size. This is not the long-bond duration opening drive, not the five-year CPI coil, not the aluminum smelter grind, not the steel-coil dump-no-reclaim, not the midcap evening star, not the Aussie-dollar outside bar, not the sterling-futures tape fail-break, not the coffee fail-break, not the copper grind-stall, and not a live metals desk.",
      whyMarketMoved: "The poke failed and nickel slipped back through the range as cyclicals stayed offered with risk.",
      evidence: "Nickel failed-breakout tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "futures-macro",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-macro-6e-engulf",
    title: "Euro futures print a bearish engulfing as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE euro future printed a small green bar, then a red bar whose body swallowed that green body as risk appetite faded. The euro is the risk currency in this SAMPLE brief, not duration. Thin chatter says the first green must resume. Practice data only — not a live FX-futures desk. Chase the swallowed green, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Euro futures sold with risk currencies. Bearish engulfing. Thin chatter: first green must resume.",
    preOhlc: E6_PRE,
    postOhlc: withAftermath(E6_PRE, [
      bar("+1", 1.1112, 1.1124, 1.1076, 1.1088),
      bar("+2", 1.1088, 1.11, 1.1052, 1.1064),
      bar("+3", 1.1064, 1.1076, 1.1028, 1.104),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this contract falling when the euro is the risk side. A bearish engulfing is usually fade-or-wait, not a chase of the swallowed green bar. This is not an outside bar: the red high stayed inside the prior high. HOLD if the slip already has your size. This is not the long-bond duration opening drive, not the five-year CPI coil, not the aluminum smelter grind, not the steel-coil dump-no-reclaim, not the midcap evening star, not the Aussie-dollar outside bar, not the nickel fail-break, not the Canadian-dollar tape engulfing, not the EUR/USD risk-on grind, and not a live FX-futures desk.",
      whyMarketMoved: "The engulfing close held and euro futures leaked as the euro stayed offered with risk.",
      evidence: "Euro-futures bearish-engulfing tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "futures-macro",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-macro-6s-shooting-star",
    title: "Swiss-franc futures print a shooting star as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE swiss-franc future ground higher, then printed a shooting star: a small body near the lows with a long upper wick as risk appetite faded. The franc is grouped with risk currencies in this SAMPLE brief, not duration and not a haven bid. Thin chatter says the wick must continue. Practice data only — not a live FX-futures desk. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Swiss-franc futures sold with risk currencies. Shooting star. Thin chatter: upper wick must continue.",
    preOhlc: S6_PRE,
    postOhlc: withAftermath(S6_PRE, [
      bar("+1", 1.2532, 1.2544, 1.2478, 1.2488),
      bar("+2", 1.2488, 1.25, 1.2434, 1.2444),
      bar("+3", 1.2444, 1.2456, 1.239, 1.24),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this contract falling when the franc is grouped with risk currencies. A shooting star after a grind is usually fade-or-wait, not a chase of the upper wick. This is not an outside bar: the low stayed inside the prior low. This is not an evening star (that is three bars) and not a bearish engulfing (the body did not swallow the prior body). HOLD if the slip already has your size. This is not the long-bond duration opening drive, not the five-year CPI coil, not the aluminum smelter grind, not the steel-coil dump-no-reclaim, not the midcap evening star, not the Aussie-dollar outside bar, not the nickel fail-break, not the euro-futures engulfing, not the yen-futures tape shooting star, not the GBP/CHF evening star, and not a live FX-futures desk.",
      whyMarketMoved: "The shooting-star close held and swiss-franc futures leaked as risk currencies stayed offered.",
      evidence: "Swiss-franc futures shooting-star tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "futures-macro",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-macro-6m-dark-cloud",
    title: "Peso futures print a dark-cloud cover as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE peso future printed a green bar, then a red bar that opened above that close and finished in the lower half of that body without swallowing it as risk appetite faded. The peso is a risk currency in this SAMPLE brief. Thin chatter says the gap-up open must continue. Practice data only — not a live FX-futures desk. Chase the gap-up, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Peso futures sold with risk currencies. Dark-cloud cover. Thin chatter: gap-up open must continue.",
    preOhlc: M6_PRE,
    postOhlc: withAftermath(M6_PRE, [
      bar("+1", 0.04874, 0.04882, 0.04838, 0.04844),
      bar("+2", 0.04844, 0.04852, 0.04808, 0.04814),
      bar("+3", 0.04814, 0.04822, 0.04778, 0.04784),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this contract falling when the peso is a risk currency. A dark-cloud cover is usually fade-or-wait, not a chase of the gap-up open. The red close is inside the prior body, so this is not a bearish engulfing. This is not an outside bar: the low stayed inside the prior low. This is not a shooting star (that is one long upper wick) and not an evening star (that is three bars). HOLD if the slip already has your size. This is not the long-bond duration opening drive, not the five-year CPI coil, not the aluminum smelter grind, not the steel-coil dump-no-reclaim, not the midcap evening star, not the Aussie-dollar outside bar, not the nickel fail-break, not the euro-futures engulfing, not the swiss-franc shooting star, not the kiwi-futures tape dark-cloud, not the CAD/NOK macro dark-cloud, and not a live FX-futures desk.",
      whyMarketMoved: "The dark-cloud close held and peso futures leaked as risk currencies stayed offered.",
      evidence: "Peso-futures dark-cloud tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "futures-macro",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-macro-6z-three-crows",
    title: "Rand futures print three black crows as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE rand future ground higher, then printed three falling red bodies in a row as risk appetite faded. The rand is a risk currency in this SAMPLE brief. Thin chatter says the first red is a dip to buy. Practice data only — not a live FX-futures desk. Chase the dip, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Rand futures sold with risk currencies. Three black crows. Thin chatter: first red is a dip to buy.",
    preOhlc: Z6_PRE,
    postOhlc: withAftermath(Z6_PRE, [
      bar("+1", 0.05526, 0.05534, 0.05488, 0.05496),
      bar("+2", 0.05496, 0.05504, 0.05458, 0.05466),
      bar("+3", 0.05466, 0.05474, 0.05418, 0.05426),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this contract falling when the rand is a risk currency. Three black crows after a grind are usually fade-or-wait, not a chase of the first red as a dip. This is not one bearish engulfing bar: three similar red bodies stepped lower. This is not an evening star (that is a small middle bar) and not a dark-cloud cover (that is two bars). HOLD if the slip already has your size. This is not the long-bond duration opening drive, not the five-year CPI coil, not the aluminum smelter grind, not the steel-coil dump-no-reclaim, not the midcap evening star, not the Aussie-dollar outside bar, not the nickel fail-break, not the euro-futures engulfing, not the swiss-franc shooting star, not the peso-futures dark-cloud, not the real-futures tape three-crows, not the USD/ZAR spot dump, and not a live FX-futures desk.",
      whyMarketMoved: "The third crow held and rand futures leaked as risk currencies stayed offered.",
      evidence: "Rand-futures three-black-crows tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "futures-macro",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-macro-6p-hanging-man",
    title: "Zloty futures print a hanging man as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE zloty future ground higher, then printed a hanging man: a small body near the highs with a long lower wick as risk appetite faded. The zloty is a risk currency in this SAMPLE brief. Thin chatter says the lower wick must hold. Practice data only — not a live FX-futures desk. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Zloty futures sold with risk currencies. Hanging man. Thin chatter: lower wick must hold.",
    preOhlc: P6_PRE,
    postOhlc: withAftermath(P6_PRE, [
      bar("+1", 0.24828, 0.24842, 0.24742, 0.24756),
      bar("+2", 0.24756, 0.24768, 0.24668, 0.24682),
      bar("+3", 0.24682, 0.24694, 0.24594, 0.24608),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this contract falling when the zloty is a risk currency. A hanging man after a grind is usually fade-or-wait, not a chase of the lower wick as a dip. This is not a shooting star: that is a long upper wick. This is not a hammer: a hammer shows up after a decline, not after a grind. This is not a doji and not three black crows. This is not an outside bar: the high stayed inside the prior high. HOLD if the slip already has your size. This is not the long-bond duration opening drive, not the five-year CPI coil, not the aluminum smelter grind, not the steel-coil dump-no-reclaim, not the midcap evening star, not the Aussie-dollar outside bar, not the nickel fail-break, not the euro-futures engulfing, not the swiss-franc shooting star, not the peso-futures dark-cloud, not the rand-futures three-crows, not the Hong Kong dollar tape hanging man, and not a live FX-futures desk.",
      whyMarketMoved: "The hanging-man close held and zloty futures leaked as risk currencies stayed offered.",
      evidence: "Zloty-futures hanging-man tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "futures-macro",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-macro-6t-harami",
    title: "Lira futures print a bearish harami as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE lira future ground higher into a tall green bar, then printed a small body fully inside that green body as risk appetite faded. The lira is a risk currency in this SAMPLE brief. Thin chatter says the small inside body means the grind must resume. Practice data only — not a live FX-futures desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Lira futures sold with risk currencies. Bearish harami. Thin chatter: small inside body means the grind must resume.",
    preOhlc: T6_PRE,
    postOhlc: withAftermath(T6_PRE, [
      bar("+1", 0.031424, 0.031442, 0.031358, 0.031372),
      bar("+2", 0.031372, 0.031388, 0.031298, 0.031312),
      bar("+3", 0.031312, 0.031328, 0.031238, 0.031252),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this contract falling when the lira is a risk currency. A bearish harami after a grind is usually fade-or-wait, not a chase of the small inside body as a resume. The small body sits inside the prior body; this is not a bearish engulfing. This is not a hanging man (no long lower wick) and not a shooting star (no long upper wick). This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. HOLD if the slip already has your size. This is not the long-bond duration opening drive, not the five-year CPI coil, not the aluminum smelter grind, not the steel-coil dump-no-reclaim, not the midcap evening star, not the Aussie-dollar outside bar, not the nickel fail-break, not the euro-futures engulfing, not the swiss-franc shooting star, not the peso-futures dark-cloud, not the rand-futures three-crows, not the zloty-futures hanging man, not the ruble-futures tape harami, not the GBP/PLN macro harami, not the USD/TRY rising-wedge spot, and not a live FX-futures desk.",
      whyMarketMoved: "The harami close held and lira futures leaked as risk currencies stayed offered.",
      evidence: "Lira-futures bearish-harami tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "futures-macro",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-macro-6w-marubozu",
    title: "Won futures print a bearish marubozu as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE won future ground higher, then printed a long red bar that opened near its high and closed near its low, with almost no wicks, as risk appetite faded. The won is a risk currency in this SAMPLE brief. Thin chatter says the long red close must bounce. Practice data only — not a live FX-futures desk. Chase the red as a dip, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Won futures sold with risk currencies. Bearish marubozu. Thin chatter: long red close must bounce.",
    preOhlc: W6_PRE,
    postOhlc: withAftermath(W6_PRE, [
      bar("+1", 0.0007202, 0.0007218, 0.0007124, 0.0007138),
      bar("+2", 0.0007138, 0.0007152, 0.0007058, 0.0007072),
      bar("+3", 0.0007072, 0.0007086, 0.0006992, 0.0007006),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this contract falling when the won is a risk currency. A bearish marubozu after a grind is usually fade-or-wait, not a chase of the long red close as a bounce. The bar opened near the high and closed near the low with tiny wicks; this is not a hanging man (no long lower wick) and not a shooting star (no long upper wick). This is not a bearish engulfing: the red body does not swallow the prior green body. This is not three black crows (one bar, not three) and not a dark-cloud cover (that opens above the prior close and stays inside the prior body). This is not a harami: the last bar is large, not a small body inside the prior body. HOLD if the slip already has your size. This is not the long-bond duration opening drive, not the five-year CPI coil, not the aluminum smelter grind, not the steel-coil dump-no-reclaim, not the midcap evening star, not the Aussie-dollar outside bar, not the nickel fail-break, not the euro-futures engulfing, not the swiss-franc shooting star, not the peso-futures dark-cloud, not the rand-futures three-crows, not the zloty-futures hanging man, not the lira-futures harami, not the krona-futures tape marubozu, not the USD/KRW shipping opening drive, and not a live FX-futures desk.",
      whyMarketMoved: "The marubozu close held and won futures leaked as risk currencies stayed offered.",
      evidence: "Won-futures bearish-marubozu tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "futures-macro",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-macro-dkk-gravestone",
    title: "Danish-krone futures print a gravestone doji as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE Danish-krone future ground higher, then printed a gravestone doji: open and close sit on the lows with a long upper wick and almost no body, as risk appetite faded. The krone is grouped with risk currencies in this SAMPLE brief, not a euro-peg story. Thin chatter says the wick must continue. Practice data only — not a live FX-futures desk. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Danish-krone futures sold with risk currencies. Gravestone doji. Thin chatter: upper wick must continue.",
    preOhlc: DKK6_PRE,
    postOhlc: withAftermath(DKK6_PRE, [
      bar("+1", 0.14674, 0.14688, 0.14586, 0.14598),
      bar("+2", 0.14598, 0.1461, 0.14504, 0.14516),
      bar("+3", 0.14516, 0.14528, 0.14422, 0.14434),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this contract falling when the krone is grouped with risk currencies. A gravestone doji after a grind is usually fade-or-wait, not a chase of the upper wick. Open and close sit on the lows with almost no body; this is not a shooting star (that has a small real body near the lows). This is not a hanging man (no long lower wick) and not a marubozu (this bar has a long upper wick). This is not an outside bar: the low stayed inside the prior low. This is not a harami (the last bar is not a small body inside the prior body). HOLD if the slip already has your size. This is not the long-bond duration opening drive, not the five-year CPI coil, not the aluminum smelter grind, not the steel-coil dump-no-reclaim, not the midcap evening star, not the Aussie-dollar outside bar, not the nickel fail-break, not the euro-futures engulfing, not the swiss-franc shooting star, not the peso-futures dark-cloud, not the rand-futures three-crows, not the zloty-futures hanging man, not the lira-futures harami, not the won-futures marubozu, not the ringgit-futures tape gravestone, and not a live FX-futures desk.",
      whyMarketMoved: "The gravestone close held and Danish-krone futures leaked as risk currencies stayed offered.",
      evidence: "Danish-krone futures gravestone-doji tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "futures-macro",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-macro-php-harami-cross",
    title: "Philippine-peso futures print a harami cross as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE Philippine-peso future ground higher into a tall green bar, then printed a doji fully inside that green body as risk appetite faded. The peso is a risk currency in this SAMPLE brief. Thin chatter says the doji means the grind must resume. Practice data only — not a live FX-futures desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Philippine-peso futures sold with risk currencies. Harami cross. Thin chatter: the doji means the grind must resume.",
    preOhlc: PHP6_PRE,
    postOhlc: withAftermath(PHP6_PRE, [
      bar("+1", 0.017532, 0.017548, 0.017408, 0.017424),
      bar("+2", 0.017424, 0.017438, 0.017286, 0.017302),
      bar("+3", 0.017302, 0.017316, 0.017158, 0.017174),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this contract falling when the peso is a risk currency. A harami cross after a grind is usually fade-or-wait, not a chase of the inside doji as a resume. The doji sits inside the prior body; this is not a bearish harami with a small real body, and not a gravestone (open and close are not pinned to the lows with a long upper wick). This is not a hanging man (no long lower wick) and not a shooting star (no long upper wick from the lows). This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. This is not the Mexican-peso dark-cloud cover. HOLD if the slip already has your size. This is not the long-bond duration opening drive, not the five-year CPI coil, not the aluminum smelter grind, not the steel-coil dump-no-reclaim, not the midcap evening star, not the Aussie-dollar outside bar, not the nickel fail-break, not the euro-futures engulfing, not the swiss-franc shooting star, not the peso-futures dark-cloud, not the rand-futures three-crows, not the zloty-futures hanging man, not the lira-futures harami, not the won-futures marubozu, not the Danish-krone gravestone, not the rupiah-futures tape harami-cross, and not a live FX-futures desk.",
      whyMarketMoved: "The harami-cross close held and Philippine-peso futures leaked as risk currencies stayed offered.",
      evidence: "Philippine-peso futures harami-cross tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "futures-macro",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-macro-huf-spinning-top",
    title: "Forint futures print a spinning top as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE Hungarian-forint future ground higher, then printed a spinning top: a small real body near the middle of the bar with upper and lower wicks of similar length as risk appetite faded. The forint is grouped with risk currencies in this SAMPLE brief, not a euro-peg story. Thin chatter says the pause means the grind must resume. Practice data only — not a live FX-futures desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Forint futures sold with risk currencies. Spinning top. Thin chatter: the pause means the grind must resume.",
    preOhlc: HUF6_PRE,
    postOhlc: withAftermath(HUF6_PRE, [
      bar("+1", 0.0024744, 0.0024786, 0.0024492, 0.0024528),
      bar("+2", 0.0024528, 0.0024568, 0.0024268, 0.0024306),
      bar("+3", 0.0024306, 0.0024348, 0.0024028, 0.0024064),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this contract falling when the forint is grouped with risk currencies. A spinning top after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar has a small real body near the middle with wicks both ways; this is not a hanging man (that sits near the highs with a long lower wick only) and not a shooting star (that sits near the lows with a long upper wick only). This is not a harami cross: the last bar is not a doji sitting inside the prior body. This is not a gravestone (open and close are not pinned to the lows). This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. HOLD if the slip already has your size. This is not the long-bond duration opening drive, not the five-year CPI coil, not the aluminum smelter grind, not the steel-coil dump-no-reclaim, not the midcap evening star, not the Aussie-dollar outside bar, not the nickel fail-break, not the euro-futures engulfing, not the swiss-franc shooting star, not the peso-futures dark-cloud, not the rand-futures three-crows, not the zloty-futures hanging man, not the lira-futures harami, not the won-futures marubozu, not the Danish-krone gravestone, not the Philippine-peso harami-cross, not the Chilean-peso tape spinning top, not the EUR/HUF gravestone tape, not the Hong Kong dollar hanging man, and not a live FX-futures desk.",
      whyMarketMoved: "The spinning-top close held and forint futures leaked as risk currencies stayed offered.",
      evidence: "Forint-futures spinning-top tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "futures-macro",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-macro-ils-long-legged-doji",
    title: "Shekel futures print a long-legged doji as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE Israeli-shekel future ground higher, then printed a long-legged doji: open and close sit together with long upper and lower wicks of similar length as risk appetite faded. The shekel is grouped with risk currencies in this SAMPLE brief, not a haven bid. Thin chatter says the long-legged pause means the grind must resume. Practice data only — not a live FX-futures desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Shekel futures sold with risk currencies. Long-legged doji. Thin chatter: the long-legged pause means the grind must resume.",
    preOhlc: ILS6_PRE,
    postOhlc: withAftermath(ILS6_PRE, [
      bar("+1", 0.32186, 0.32328, 0.31586, 0.31708),
      bar("+2", 0.31708, 0.31842, 0.31042, 0.31186),
      bar("+3", 0.31186, 0.31318, 0.30486, 0.30628),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this contract falling when the shekel is grouped with risk currencies. A long-legged doji after a grind is usually fade-or-wait, not a chase of the pause as a resume. Open and close sit together with long wicks both ways; this is not a spinning top (that has a small real body). This is not a gravestone (open and close are not pinned to the lows with a long upper wick only). This is not a harami cross: the doji is not sitting inside the prior body. This is not a hanging man (no long lower wick only) and not a shooting star (no long upper wick from the lows). This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. HOLD if the slip already has your size. This is not the long-bond duration opening drive, not the five-year CPI coil, not the aluminum smelter grind, not the steel-coil dump-no-reclaim, not the midcap evening star, not the Aussie-dollar outside bar, not the nickel fail-break, not the euro-futures engulfing, not the swiss-franc shooting star, not the peso-futures dark-cloud, not the rand-futures three-crows, not the zloty-futures hanging man, not the lira-futures harami, not the won-futures marubozu, not the Danish-krone gravestone, not the Philippine-peso harami-cross, not the forint-futures spinning top, not the Colombian-peso tape long-legged doji, not the Chilean-peso tape spinning top, and not a live FX-futures desk.",
      whyMarketMoved: "The long-legged-doji close held and shekel futures leaked as risk currencies stayed offered.",
      evidence: "Shekel-futures long-legged-doji tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "futures-macro",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-macro-cnh-dragonfly",
    title: "Offshore-yuan futures print a dragonfly doji as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE offshore-yuan future ground higher, then printed a dragonfly doji: open and close sit together at the highs with a long lower wick only as risk appetite faded. The yuan is grouped with risk currencies in this SAMPLE brief, not a fixing story. Thin chatter says the dragonfly pause means the grind must resume. Practice data only — not a live FX-futures desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Offshore-yuan futures sold with risk currencies. Dragonfly doji. Thin chatter: the dragonfly pause means the grind must resume.",
    preOhlc: CNH6_PRE,
    postOhlc: withAftermath(CNH6_PRE, [
      bar("+1", 0.13928, 0.13948, 0.13764, 0.13786),
      bar("+2", 0.13786, 0.13808, 0.13618, 0.13642),
      bar("+3", 0.13642, 0.13664, 0.13468, 0.13492),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this contract falling when the yuan is grouped with risk currencies. A dragonfly doji after a grind is usually fade-or-wait, not a chase of the pause as a resume. Open and close sit together at the highs with a long lower wick; this is not a hanging man (that has a small real body near the highs). This is not a gravestone (open and close are not pinned to the lows with a long upper wick). This is not a long-legged doji (no long upper wick). This is not a spinning top (no small real body in the middle). This is not a harami cross: the doji is not sitting inside the prior body. This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. HOLD if the slip already has your size. This is not the long-bond duration opening drive, not the five-year CPI coil, not the aluminum smelter grind, not the steel-coil dump-no-reclaim, not the midcap evening star, not the Aussie-dollar outside bar, not the nickel fail-break, not the euro-futures engulfing, not the swiss-franc shooting star, not the peso-futures dark-cloud, not the rand-futures three-crows, not the zloty-futures hanging man, not the lira-futures harami, not the won-futures marubozu, not the Danish-krone gravestone, not the Philippine-peso harami-cross, not the forint-futures spinning top, not the shekel-futures long-legged doji, not the Peruvian-sol tape dragonfly, not the USD/CNH weekend-gap tape, and not a live FX-futures desk.",
      whyMarketMoved: "The dragonfly-doji close held and offshore-yuan futures leaked as risk currencies stayed offered.",
      evidence: "Offshore-yuan-futures dragonfly-doji tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "futures-macro",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-macro-thb-matching-high",
    title: "Thai-baht futures print a matching high as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE Thai-baht future ground higher into a tall green bar, then printed a small green bar that tags nearly the same high and closes weak under it as risk appetite faded. The baht is grouped with risk currencies in this SAMPLE brief, not a tourism-staircase story. Thin chatter says the matching-high pause means the grind must resume. Practice data only — not a live FX-futures desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Thai-baht futures sold with risk currencies. Matching high. Thin chatter: the matching-high pause means the grind must resume.",
    preOhlc: THB6_PRE,
    postOhlc: withAftermath(THB6_PRE, [
      bar("+1", 0.027528, 0.027568, 0.027186, 0.027228),
      bar("+2", 0.027228, 0.027268, 0.026818, 0.026864),
      bar("+3", 0.026864, 0.026906, 0.026418, 0.026468),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this contract falling when the baht is grouped with risk currencies. A matching high after a grind is usually fade-or-wait, not a chase of the pause as a resume. Both bars are green and share nearly the same high; the last close sits weak under that high. This is not a tweezer: a tweezer tags the high with opposite-color bodies. This is not a shooting star (the last body is not sitting near the lows with a long upper wick only). This is not a dragonfly (open and close are not pinned to the highs with a long lower wick). This is not a harami: the last high pokes to the prior high, not a small body fully inside the prior body. This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. HOLD if the slip already has your size. This is not the long-bond duration opening drive, not the five-year CPI coil, not the aluminum smelter grind, not the steel-coil dump-no-reclaim, not the midcap evening star, not the Aussie-dollar outside bar, not the nickel fail-break, not the euro-futures engulfing, not the swiss-franc shooting star, not the peso-futures dark-cloud, not the rand-futures three-crows, not the zloty-futures hanging man, not the lira-futures harami, not the won-futures marubozu, not the Danish-krone gravestone, not the Philippine-peso harami-cross, not the forint-futures spinning top, not the shekel-futures long-legged doji, not the offshore-yuan dragonfly, not the Singapore-dollar matching-high tape, not the USD/THB tourism staircase, and not a live FX-futures desk.",
      whyMarketMoved: "The matching-high close held and Thai-baht futures leaked as risk currencies stayed offered.",
      evidence: "Thai-baht-futures matching-high tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "futures-macro",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-macro-inr-belt-hold",
    title: "Indian-rupee futures print a bearish belt hold as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE Indian-rupee future ground higher, then printed a bearish belt hold: the last bar opens at its high with no upper wick and sells off, closing weak with a real body and a lower wick as risk appetite faded. The rupee is grouped with risk currencies in this SAMPLE brief, not a RBI-fixing story. Thin chatter says the belt-hold pause means the grind must resume. Practice data only — not a live FX-futures desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Indian-rupee futures sold with risk currencies. Bearish belt hold. Thin chatter: the belt-hold pause means the grind must resume.",
    preOhlc: INR6_PRE,
    postOhlc: withAftermath(INR6_PRE, [
      bar("+1", 0.012848, 0.012888, 0.012448, 0.012488),
      bar("+2", 0.012488, 0.012528, 0.012086, 0.012128),
      bar("+3", 0.012128, 0.012168, 0.011648, 0.011698),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this contract falling when the rupee is grouped with risk currencies. A bearish belt hold after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar opens at the high with no upper wick and sells off into a real body; a lower wick is allowed. This is not a marubozu: a marubozu has tiny wicks at both ends and closes near the low. This is not a matching high: both of those bars are green and share nearly the same high. This is not a hanging man (the body is not a small real body near the highs with a long lower wick). This is not a shooting star (there is no long upper wick from the lows). This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. HOLD if the slip already has your size. This is not the long-bond duration opening drive, not the five-year CPI coil, not the aluminum smelter grind, not the steel-coil dump-no-reclaim, not the midcap evening star, not the Aussie-dollar outside bar, not the nickel fail-break, not the euro-futures engulfing, not the swiss-franc shooting star, not the peso-futures dark-cloud, not the rand-futures three-crows, not the zloty-futures hanging man, not the lira-futures harami, not the won-futures marubozu, not the Danish-krone gravestone, not the Philippine-peso harami-cross, not the forint-futures spinning top, not the shekel-futures long-legged doji, not the offshore-yuan dragonfly, not the Thai-baht matching high, not the Taiwan-dollar tape belt hold, not the ruble-futures harami tape, not the USD/INR pause tape, and not a live FX-futures desk.",
      whyMarketMoved: "The belt-hold close held and Indian-rupee futures leaked as risk currencies stayed offered.",
      evidence: "Indian-rupee-futures bearish-belt-hold tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "futures-macro",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-macro-ron-separating-lines",
    title: "Romanian-leu futures print bearish separating lines as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE Romanian-leu future ground higher into a tall green bar, then printed a long red bar that opens at nearly the same open as that green bar and sells off as risk appetite faded. The leu is grouped with risk currencies in this SAMPLE brief, not an NBR-fixing story. Thin chatter says the separating-lines pause means the grind must resume. Practice data only — not a live FX-futures desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Romanian-leu futures sold with risk currencies. Bearish separating lines. Thin chatter: the separating-lines pause means the grind must resume.",
    preOhlc: RON6_PRE,
    postOhlc: withAftermath(RON6_PRE, [
      bar("+1", 0.49428, 0.49864, 0.47886, 0.48248),
      bar("+2", 0.48248, 0.48618, 0.46486, 0.46828),
      bar("+3", 0.46828, 0.47186, 0.44864, 0.45218),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this contract falling when the leu is grouped with risk currencies. Bearish separating lines after a grind are usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens at nearly the same open as the prior tall green and sells off. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick, usually after the prior close, not back at the prior open. This is not a marubozu: a marubozu has tiny wicks at both ends and closes near the low. This is not a matching high: both of those bars are green and share nearly the same high. This is not a hanging man (the body is not a small real body near the highs with a long lower wick). This is not a shooting star (there is no long upper wick from the lows). This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. HOLD if the slip already has your size. This is not the long-bond duration opening drive, not the five-year CPI coil, not the aluminum smelter grind, not the steel-coil dump-no-reclaim, not the midcap evening star, not the Aussie-dollar outside bar, not the nickel fail-break, not the euro-futures engulfing, not the swiss-franc shooting star, not the peso-futures dark-cloud, not the rand-futures three-crows, not the zloty-futures hanging man, not the lira-futures harami, not the won-futures marubozu, not the Danish-krone gravestone, not the Philippine-peso harami-cross, not the forint-futures spinning top, not the shekel-futures long-legged doji, not the offshore-yuan dragonfly, not the Thai-baht matching high, not the Indian-rupee belt hold, not the Czech-koruna tape separating lines, not the CAD/PLN separating-lines spot tape, not the CAD/RON spinning-top spot tape, and not a live FX-futures desk.",
      whyMarketMoved: "The separating-lines close held and Romanian-leu futures leaked as risk currencies stayed offered.",
      evidence: "Romanian-leu-futures bearish-separating-lines tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "futures-macro",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-macro-isk-on-neck",
    title: "Icelandic-krona futures print a bearish on-neck as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE Icelandic-krona future ground higher into a tall green bar, then printed a long red bar that opens above that green close and closes at nearly the prior low as risk appetite faded. The krona is grouped with risk currencies in this SAMPLE brief, not a CBI-fixing story. Thin chatter says the on-neck pause means the grind must resume. Practice data only — not a live FX-futures desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Icelandic-krona futures sold with risk currencies. Bearish on-neck. Thin chatter: the on-neck pause means the grind must resume.",
    preOhlc: ISK6_PRE,
    postOhlc: withAftermath(ISK6_PRE, [
      bar("+1", 0.007018, 0.007048, 0.006848, 0.006878),
      bar("+2", 0.006878, 0.006908, 0.006648, 0.006678),
      bar("+3", 0.006678, 0.006708, 0.006428, 0.006458),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this contract falling when the krona is grouped with risk currencies. A bearish on-neck after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens above the prior close and closes at nearly the prior low. This is not separating lines: those share nearly the same open as the prior tall green. This is not a dark-cloud: a dark-cloud closes in the lower half of the prior body, still above that prior open, not at the prior low. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick. This is not a matching high: both of those bars are green and share nearly the same high. This is not a hanging man (the body is not a small real body near the highs with a long lower wick). This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. This is not Norwegian-krone tape: that on-neck sits near 0.119, not this Icelandic-krona contract. HOLD if the slip already has your size. This is not the long-bond duration opening drive, not the five-year CPI coil, not the aluminum smelter grind, not the steel-coil dump-no-reclaim, not the midcap evening star, not the Aussie-dollar outside bar, not the nickel fail-break, not the euro-futures engulfing, not the swiss-franc shooting star, not the peso-futures dark-cloud, not the rand-futures three-crows, not the zloty-futures hanging man, not the lira-futures harami, not the won-futures marubozu, not the Danish-krone gravestone, not the Philippine-peso harami-cross, not the forint-futures spinning top, not the shekel-futures long-legged doji, not the offshore-yuan dragonfly, not the Thai-baht matching high, not the Indian-rupee belt hold, not the Romanian-leu separating lines, not the Norwegian-krone tape on-neck, not the AUD/DKK on-neck spot tape, and not a live FX-futures desk.",
      whyMarketMoved: "The on-neck close held and Icelandic-krona futures leaked as risk currencies stayed offered.",
      evidence: "Icelandic-krona-futures bearish-on-neck tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "futures-macro",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-macro-gel-in-neck",
    title: "Georgian-lari futures print a bearish in-neck as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE Georgian-lari future ground higher into a tall green bar, then printed a long red bar that opens above that green close and closes at nearly that same close, not the prior low, as risk appetite faded. The lari is grouped with risk currencies in this SAMPLE brief, not an NBG-fixing story. Thin chatter says the in-neck pause means the grind must resume. Practice data only — not a live FX-futures desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Georgian-lari futures sold with risk currencies. Bearish in-neck. Thin chatter: the in-neck pause means the grind must resume.",
    preOhlc: GEL6_PRE,
    postOhlc: withAftermath(GEL6_PRE, [
      bar("+1", 0.37028, 0.37486, 0.35286, 0.35648),
      bar("+2", 0.35648, 0.36028, 0.33864, 0.34228),
      bar("+3", 0.34228, 0.34618, 0.31864, 0.32286),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this contract falling when the lari is grouped with risk currencies. A bearish in-neck after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens above the prior close and closes at nearly that same close, not the prior low. This is not on-neck: on-neck closes at nearly the prior low. This is not a dark-cloud: a dark-cloud closes in the lower half of the prior body, still above that prior open, not back at the prior close. This is not separating lines: those share nearly the same open as the prior tall green. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick. This is not a matching high: both of those bars are green and share nearly the same high. This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. This is not Icelandic-krona: that on-neck sits near 0.0072, not this lari in-neck. This is not Bulgarian-lev tape: that in-neck sits near 0.94. HOLD if the slip already has your size. This is not the long-bond duration opening drive, not the five-year CPI coil, not the aluminum smelter grind, not the steel-coil dump-no-reclaim, not the midcap evening star, not the Aussie-dollar outside bar, not the nickel fail-break, not the euro-futures engulfing, not the swiss-franc shooting star, not the peso-futures dark-cloud, not the rand-futures three-crows, not the zloty-futures hanging man, not the lira-futures harami, not the won-futures marubozu, not the Danish-krone gravestone, not the Philippine-peso harami-cross, not the forint-futures spinning top, not the shekel-futures long-legged doji, not the offshore-yuan dragonfly, not the Thai-baht matching high, not the Indian-rupee belt hold, not the Romanian-leu separating lines, not the Icelandic-krona on-neck, not the Bulgarian-lev tape in-neck, not the NZD/DKK in-neck spot tape, and not a live FX-futures desk.",
      whyMarketMoved: "The in-neck close held and Georgian-lari futures leaked as risk currencies stayed offered.",
      evidence: "Georgian-lari-futures bearish-in-neck tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "futures-macro",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-macro-mad-thrusting",
    title: "Moroccan-dirham futures print a bearish thrusting line as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE Moroccan-dirham future ground higher into a tall green bar, then printed a long red bar that opens above that green close and closes into that prior body, still above the midpoint, as risk appetite faded. The dirham is grouped with risk currencies in this SAMPLE brief, not a BAM-fixing story. Thin chatter says the thrusting pause means the grind must resume. Practice data only — not a live FX-futures desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Moroccan-dirham futures sold with risk currencies. Bearish thrusting line. Thin chatter: the thrusting pause means the grind must resume.",
    preOhlc: MAD6_PRE,
    postOhlc: withAftermath(MAD6_PRE, [
      bar("+1", 0.10448, 0.10518, 0.10218, 0.10286),
      bar("+2", 0.10286, 0.10348, 0.09986, 0.10048),
      bar("+3", 0.10048, 0.10108, 0.09686, 0.09748),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this contract falling when the dirham is grouped with risk currencies. A bearish thrusting line after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens above the prior close and closes into that prior body, still above the midpoint. This is not in-neck: in-neck closes at nearly the prior close. This is not on-neck: on-neck closes at nearly the prior low. This is not a dark-cloud: a dark-cloud closes in the lower half of the prior body, still above that prior open. This is not separating lines: those share nearly the same open as the prior tall green. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick. This is not a matching high: both of those bars are green and share nearly the same high. This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. This is not Georgian-lari: that in-neck sits near 0.368, not this dirham thrusting line. This is not krona-futures: that marubozu sits near 0.0948. This is not Norwegian-krone: that on-neck sits near 0.119. HOLD if the slip already has your size. This is not the long-bond duration opening drive, not the five-year CPI coil, not the aluminum smelter grind, not the steel-coil dump-no-reclaim, not the midcap evening star, not the Aussie-dollar outside bar, not the nickel fail-break, not the euro-futures engulfing, not the swiss-franc shooting star, not the peso-futures dark-cloud, not the rand-futures three-crows, not the zloty-futures hanging man, not the lira-futures harami, not the won-futures marubozu, not the Danish-krone gravestone, not the Philippine-peso harami-cross, not the forint-futures spinning top, not the shekel-futures long-legged doji, not the offshore-yuan dragonfly, not the Thai-baht matching high, not the Indian-rupee belt hold, not the Romanian-leu separating lines, not the Icelandic-krona on-neck, not the Georgian-lari in-neck, not the Ukrainian-hryvnia tape thrusting, not the CAD/DKK thrusting spot tape, and not a live FX-futures desk.",
      whyMarketMoved: "The thrusting close held and Moroccan-dirham futures leaked as risk currencies stayed offered.",
      evidence: "Moroccan-dirham-futures bearish-thrusting tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "futures-macro",
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
  {
    id: "case-fx-int-eurcad-falling-wedge",
    title: "EUR/CAD falling wedge after an oil scare already in the tape",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "EUR/CAD coiled into a falling wedge after a Canadian oil-supply scare. You have Indicators. A scheduled inventory note then says the shortage was smaller than the scare. Name which side the loonie is on, then ask whether the scare is already in the wedge. SAMPLE pair only, not a live FX desk.",
    newsHeadline:
      "Inventory note: oil shortage smaller than the scare. EUR/CAD still in a falling wedge.",
    preOhlc: EURCAD_PRE,
    postOhlc: withAftermath(EURCAD_PRE, [
      bar("+1", 1.485, 1.494, 1.484, 1.492),
      bar("+2", 1.492, 1.498, 1.49, 1.496),
      bar("+3", 1.496, 1.502, 1.494, 1.5),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Intermediate work is naming what is already in the price. A falling wedge after an oil scare that an inventory note already bounded is often a wait-for-break, not a new shortage. CAD is on the oil-supply side; a smaller shortage is less CAD bid. HOLD if you will not buy a SAMPLE euro-loonie cross. This is not the GBP/NZD three-push, not the NOK supply fade, not the EUR/USD energy wobble, and not a live FX desk.",
      whyMarketMoved: "The wedge broke higher once the smaller-shortage inventory note bounded the scare.",
      evidence: "EUR/CAD falling-wedge tape plus a smaller-shortage inventory note. Practice only.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "intermediate",
    assetClass: "forex",
  },
  {
    id: "case-fx-int-nzdjpy-head-shoulders",
    title: "NZD/JPY head-and-shoulders into a dairy scare already in the highs",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "NZD/JPY printed a left shoulder, a higher head, then a weaker right shoulder on a New Zealand dairy-export scare. You have Indicators. Thin chatter says the right shoulder must break the head. Ask whether the scare is already in the head. SAMPLE pair only, not a live FX desk.",
    newsHeadline:
      "Dairy scare already ran. Thin chatter: kiwi-yen right shoulder must break the head.",
    preOhlc: NZDJPY_PRE,
    postOhlc: withAftermath(NZDJPY_PRE, [
      bar("+1", 90.8, 91.0, 89.6, 89.8),
      bar("+2", 89.8, 90.0, 88.6, 88.8),
      bar("+3", 88.8, 89.0, 87.6, 87.8),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Intermediate work is naming what is already in the price. A weaker right shoulder after a higher head is late-chase, not a new path. Fade or wait; HOLD if the slip already has your size. This is not the GBP/NZD three equal pushes, not the EUR/CAD falling wedge, not the AUD/JPY flag, and not a live FX desk.",
      whyMarketMoved: "The right shoulder failed and kiwi-yen leaked through the neckline once the dairy-scare chase stalled.",
      evidence: "NZD/JPY head-and-shoulders tape plus a scare-already-ran headline. Practice only.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "intermediate",
    assetClass: "forex",
  },
  {
    id: "case-fx-tape-gbpcad-tweezer",
    title: "GBP/CAD tweezer top into a hike scare already in the highs",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "GBP/CAD rallied into two bars that share the same high after a Bank of England hike scare already ran. Thin chatter says the tweezer must break. Ask whether the scare is already in those matching highs. SAMPLE pair only, not a live FX desk.",
    newsHeadline:
      "Hike scare already ran. Thin chatter: sterling-loonie tweezer must break the match.",
    preOhlc: GBPCAD_PRE,
    postOhlc: withAftermath(GBPCAD_PRE, [
      bar("+1", 1.756, 1.758, 1.742, 1.744),
      bar("+2", 1.744, 1.746, 1.73, 1.732),
      bar("+3", 1.732, 1.734, 1.718, 1.72),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Two matching highs after a scare already ran is late-chase, not a new path. Fade or wait; HOLD if the slip already has your size. This is not the EUR/JPY spike-fade, not the NZD/JPY head-and-shoulders, not the EUR/CAD falling wedge, and not a live FX desk.",
      whyMarketMoved: "The matched high held and sterling-loonie leaked once the hike-scare chase stalled.",
      evidence: "GBP/CAD tweezer-top tape plus a scare-already-ran headline. Practice only.",
    },
    allowShort: false,
    packId: "forex-tape",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-tape-gbpchf-evening-star",
    title: "GBP/CHF evening star into an official Swiss bank statement",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "GBP/CHF rallied into a long green bar, a small star at the highs, then a red close back into that body. Then the Swiss home bank publishes a prepared statement: it will stay restrictive for longer. Official text, not chatter and not a data print. SAMPLE pair only, not a live FX desk.",
    newsHeadline:
      "Prepared statement: restrictive for longer. Official Swiss text, not chatter.",
    preOhlc: GBPCHF_PRE,
    postOhlc: withAftermath(GBPCHF_PRE, [
      bar("+1", 1.128, 1.13, 1.116, 1.118),
      bar("+2", 1.118, 1.12, 1.106, 1.108),
      bar("+3", 1.108, 1.11, 1.096, 1.098),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Treat an official statement as a headline with a named author. A hawkish Swiss hold can bid the franc, so this pair can fall. The evening star is already a pause, not a new sterling path. HOLD if the slip already has your size. This is not the USD/CAD hawkish-hold chop, not the GBP/CAD tweezer, not the CAD/JPY harami, and not a live FX desk.",
      whyMarketMoved: "The red close held and sterling-franc leaked as the franc caught a bid on the statement.",
      evidence: "GBP/CHF evening-star tape plus a prepared-statement headline. Practice only.",
    },
    allowShort: false,
    packId: "forex-tape",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-tape-nzdchf-open-drive",
    title: "NZD/CHF opens with a wide drive after an official RBNZ statement",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "NZD/CHF sat quiet, then opened with a wide drive higher after the Reserve Bank of New Zealand published a prepared statement: it will not ease as soon as markets hoped. Official text, not chatter and not a data print. SAMPLE pair only, not a live FX desk.",
    newsHeadline:
      "Prepared statement: will not ease as soon as hoped. Official RBNZ text, not chatter.",
    preOhlc: NZDCHF_PRE,
    postOhlc: withAftermath(NZDCHF_PRE, [
      bar("+1", 0.5182, 0.5204, 0.5178, 0.5198),
      bar("+2", 0.5198, 0.5216, 0.5194, 0.521),
      bar("+3", 0.521, 0.5226, 0.5206, 0.5222),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Treat an official statement as a headline with a named author. A hawkish RBNZ hold can bid the kiwi, so this pair can rise. The wide opening drive is often the story, not a fade. HOLD if the drive already has your size. This is not the USD/CAD hawkish-hold chop, not the GBP/CHF Swiss evening star, not the GBP/CAD tweezer, not the USD/KRW shipping drive, and not a live FX desk.",
      whyMarketMoved: "The opening drive held and kiwi-franc kept grinding as the kiwi caught a bid on the statement.",
      evidence: "NZD/CHF opening-drive tape plus a prepared RBNZ headline. Practice only.",
    },
    allowShort: false,
    packId: "forex-tape",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-tape-chfjpy-dump-no-reclaim",
    title: "CHF/JPY dumps on a hike scare, no reclaim",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "CHF/JPY already dumped after a Swiss hike scare ran through the tape. Thin chatter says the first bounce must reclaim. The bounce has not shown up. Ask whether the scare is already in the dump. SAMPLE pair only, not a live FX desk.",
    newsHeadline:
      "Hike scare already ran. Thin chatter: franc-yen dump must reclaim. No bounce yet.",
    preOhlc: CHFJPY_PRE,
    postOhlc: withAftermath(CHFJPY_PRE, [
      bar("+1", 168.88, 169.02, 168.18, 168.24),
      bar("+2", 168.24, 168.38, 167.54, 167.6),
      bar("+3", 167.6, 167.74, 166.92, 166.98),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A dump with no reclaim is late-chase, not a new bounce path. Fade or wait; HOLD if the slip already has your size. This is not the GBP/CAD tweezer, not the GBP/CHF evening star, not the NZD/CHF opening drive, not the CAD/JPY dump-then-harami, not the GBP/JPY V-reclaim, and not a live FX desk.",
      whyMarketMoved: "The dump continued; no bounce showed up after the hike scare.",
      evidence: "CHF/JPY dump-no-reclaim tape plus a scare-already-ran headline. Practice only.",
    },
    allowShort: false,
    packId: "forex-tape",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-tape-cadchf-inside-bar",
    title: "CAD/CHF inside bar into an official Bank of Canada note still ahead",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "CAD/CHF printed a wide bar, then smaller bars fully inside that range. A scheduled Bank of Canada prepared statement is still ahead. Thin chatter says the inside must break up. SAMPLE pair only, not a live FX desk. Chase a break that has not printed, or wait?",
    newsHeadline:
      "Inside bars on loonie-franc. Official BoC statement still ahead. Thin chatter: must break up.",
    preOhlc: CADCHF_PRE,
    postOhlc: withAftermath(CADCHF_PRE, [
      bar("+1", 0.6248, 0.6258, 0.6238, 0.6246),
      bar("+2", 0.6246, 0.6256, 0.6236, 0.6244),
      bar("+3", 0.6244, 0.6254, 0.6234, 0.6242),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["buy", "sell"],
    debrief: {
      process:
        "An inside bar into an official statement still ahead is a wait. HOLD is the process answer until a side actually breaks. BUY or SELL is only partial if you already had a thesis and sized small. This is not the GBP/CAD tweezer, not the GBP/CHF Swiss evening star, not the NZD/CHF opening drive, not the CHF/JPY dump, not the CAD/JPY dump-then-harami, not the EUR/AUD inside-into-print tape, and not a live FX desk.",
      whyMarketMoved: "The mother-bar range held; no clean break through the statement window.",
      evidence: "CAD/CHF inside-bar tape plus a BoC-note-still-ahead headline. Practice only.",
    },
    allowShort: false,
    packId: "forex-tape",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-tape-gbpaud-outside-bar",
    title: "GBP/AUD outside bar that closes weak",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "GBP/AUD printed a wide bar that took both sides, then closed weak. Thin chatter says the upper wick must hold. SAMPLE pair only, not a live FX desk. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Outside bar on sterling-Aussie. Thin chatter: wick must hold.",
    preOhlc: GBPAUD_PRE,
    postOhlc: withAftermath(GBPAUD_PRE, [
      bar("+1", 1.922, 1.926, 1.91, 1.914),
      bar("+2", 1.914, 1.918, 1.902, 1.906),
      bar("+3", 1.906, 1.91, 1.894, 1.898),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "An outside bar that closes weak is usually fade-or-wait, not a chase of the upper wick. HOLD if the slip already has your size. This is not the GBP/CAD tweezer, not the GBP/CHF Swiss evening star, not the NZD/CHF opening drive, not the CHF/JPY dump, not the CAD/CHF inside bar, not the USD/CLP copper-print outside bar, not the GBP/NZD three-push, and not a live FX desk.",
      whyMarketMoved: "The weak close continued lower; the upper wick did not hold.",
      evidence: "GBP/AUD outside-bar tape plus thin wick-must-hold chatter. Practice only.",
    },
    allowShort: false,
    packId: "forex-tape",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-tape-nzdcad-fail-break",
    title: "NZD/CAD pokes a range, then fails",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "NZD/CAD poked above a range, then slipped back. Thin chatter says the break must hold. SAMPLE pair only, not a live FX desk. Chase the first green poke, wait, or take risk off?",
    newsHeadline:
      "Thin chatter: kiwi-loonie range break must hold.",
    preOhlc: NZDCAD_PRE,
    postOhlc: withAftermath(NZDCAD_PRE, [
      bar("+1", 0.8194, 0.8204, 0.8168, 0.8174),
      bar("+2", 0.8174, 0.8184, 0.8148, 0.8154),
      bar("+3", 0.8154, 0.8164, 0.8128, 0.8134),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A failed poke is usually fade-or-wait, not a chase. Do not treat the first green bar as a breakout. HOLD if the slip already has your size. This is not the GBP/CAD tweezer, not the GBP/CHF Swiss evening star, not the NZD/CHF opening drive, not the CHF/JPY dump, not the CAD/CHF inside bar, not the GBP/AUD outside bar, not the EUR/CHF ceiling fail-rally, not the AUD/CAD double-top, and not a live FX desk.",
      whyMarketMoved: "The poke failed and kiwi-loonie slipped back through the range.",
      evidence: "NZD/CAD failed-breakout tape plus thin range-break chatter. Practice only.",
    },
    allowShort: false,
    packId: "forex-tape",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-tape-eurnzd-engulf",
    title: "EUR/NZD prints a bearish engulfing after a small green bar",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "EUR/NZD printed a small green bar, then a red bar whose body swallowed that green body. Thin chatter says the first green must resume. SAMPLE pair only, not a live FX desk. Chase the swallowed green, wait, or take risk off?",
    newsHeadline:
      "Bearish engulfing on euro-kiwi. Thin chatter: first green must resume.",
    preOhlc: EURNZD_PRE,
    postOhlc: withAftermath(EURNZD_PRE, [
      bar("+1", 1.8012, 1.8024, 1.7976, 1.7988),
      bar("+2", 1.7988, 1.8, 1.7952, 1.7964),
      bar("+3", 1.7964, 1.7976, 1.7928, 1.794),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish engulfing is usually fade-or-wait, not a chase of the swallowed green bar. This is not an outside bar: the red high stayed inside the prior high. HOLD if the slip already has your size. This is not the GBP/CAD tweezer, not the GBP/CHF Swiss evening star, not the NZD/CHF opening drive, not the CHF/JPY dump, not the CAD/CHF inside bar, not the GBP/AUD outside bar, not the NZD/CAD fail-break, not the USD/CLP copper-print outside bar, and not a live FX desk.",
      whyMarketMoved: "The engulfing close held and euro-kiwi leaked; the small green bar did not resume.",
      evidence: "EUR/NZD bearish-engulfing tape plus thin first-green-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "forex-tape",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-tape-gbpnok-shooting-star",
    title: "GBP/NOK prints a shooting star after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "GBP/NOK ground higher, then printed a shooting star: a small body near the lows with a long upper wick. Thin chatter says the wick must continue. SAMPLE pair only, not a live FX desk. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Shooting star on sterling-krone. Thin chatter: upper wick must continue.",
    preOhlc: GBPNOK_PRE,
    postOhlc: withAftermath(GBPNOK_PRE, [
      bar("+1", 13.718, 13.728, 13.682, 13.688),
      bar("+2", 13.688, 13.698, 13.652, 13.658),
      bar("+3", 13.658, 13.668, 13.622, 13.628),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A shooting star after a grind is usually fade-or-wait, not a chase of the upper wick. This is not an outside bar: the low stayed inside the prior low. This is not an evening star (that is three bars) and not a bearish engulfing (the body did not swallow the prior body). HOLD if the slip already has your size. This is not the GBP/CAD tweezer, not the GBP/CHF Swiss evening star, not the NZD/CHF opening drive, not the CHF/JPY dump, not the CAD/CHF inside bar, not the GBP/AUD outside bar, not the NZD/CAD fail-break, not the EUR/NZD engulfing, not the EUR/NOK oil grind, and not a live FX desk.",
      whyMarketMoved: "The shooting-star close held and sterling-krone leaked; the upper wick did not continue.",
      evidence: "GBP/NOK shooting-star tape plus thin wick-must-continue chatter. Practice only.",
    },
    allowShort: false,
    packId: "forex-tape",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-tape-nzdnok-dark-cloud",
    title: "NZD/NOK prints a dark-cloud cover after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "NZD/NOK printed a green bar, then a red bar that opened above that close and finished in the lower half of that body without swallowing it. Thin chatter says the gap-up open must continue. SAMPLE pair only, not a live FX desk. Chase the gap-up, wait, or take risk off?",
    newsHeadline:
      "Dark-cloud cover on kiwi-krone. Thin chatter: gap-up open must continue.",
    preOhlc: NZDNOK_PRE,
    postOhlc: withAftermath(NZDNOK_PRE, [
      bar("+1", 6.274, 6.282, 6.238, 6.244),
      bar("+2", 6.244, 6.252, 6.208, 6.214),
      bar("+3", 6.214, 6.222, 6.178, 6.184),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A dark-cloud cover is usually fade-or-wait, not a chase of the gap-up open. The red close is inside the prior body, so this is not a bearish engulfing. This is not an outside bar: the low stayed inside the prior low. This is not a shooting star (that is one long upper wick) and not an evening star (that is three bars). HOLD if the slip already has your size. This is not the GBP/CAD tweezer, not the GBP/CHF Swiss evening star, not the NZD/CHF opening drive, not the CHF/JPY dump, not the CAD/CHF inside bar, not the GBP/AUD outside bar, not the NZD/CAD fail-break, not the EUR/NZD engulfing, not the GBP/NOK shooting star, not the AUD/NOK macro shooting star, not the EUR/NOK oil grind, and not a live FX desk.",
      whyMarketMoved: "The dark-cloud close held and kiwi-krone leaked; the gap-up open did not continue.",
      evidence: "NZD/NOK dark-cloud tape plus thin gap-up-must-continue chatter. Practice only.",
    },
    allowShort: false,
    packId: "forex-tape",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-tape-nzdsek-three-crows",
    title: "NZD/SEK prints three black crows after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "NZD/SEK ground higher, then printed three falling red bodies in a row. Thin chatter says the first red is a dip to buy. SAMPLE pair only, not a live FX desk. Chase the dip, wait, or take risk off?",
    newsHeadline:
      "Three black crows on kiwi-krona. Thin chatter: first red is a dip to buy.",
    preOhlc: NZDSEK_PRE,
    postOhlc: withAftermath(NZDSEK_PRE, [
      bar("+1", 5.726, 5.734, 5.688, 5.696),
      bar("+2", 5.696, 5.704, 5.658, 5.666),
      bar("+3", 5.666, 5.674, 5.628, 5.636),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Three black crows after a grind are usually fade-or-wait, not a chase of the first red as a dip. This is not one bearish engulfing bar: three similar red bodies stepped lower. This is not an evening star (that is a small middle bar) and not a dark-cloud cover (that is two bars). HOLD if the slip already has your size. This is not the GBP/CAD tweezer, not the GBP/CHF Swiss evening star, not the NZD/CHF opening drive, not the CHF/JPY dump, not the CAD/CHF inside bar, not the GBP/AUD outside bar, not the NZD/CAD fail-break, not the EUR/NZD engulfing, not the GBP/NOK shooting star, not the NZD/NOK dark-cloud, not the EUR/SEK expanding range, and not a live FX desk.",
      whyMarketMoved: "The third crow held and kiwi-krona leaked; the first red was not a dip to buy.",
      evidence: "NZD/SEK three-black-crows tape plus thin dip-to-buy chatter. Practice only.",
    },
    allowShort: false,
    packId: "forex-tape",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-tape-gbpsek-hanging-man",
    title: "GBP/SEK prints a hanging man after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "GBP/SEK ground higher, then printed a hanging man: a small body near the highs with a long lower wick. Thin chatter says the lower wick must hold. SAMPLE pair only, not a live FX desk. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Hanging man on sterling-krona. Thin chatter: lower wick must hold.",
    preOhlc: GBPSEK_PRE,
    postOhlc: withAftermath(GBPSEK_PRE, [
      bar("+1", 12.972, 12.98, 12.918, 12.926),
      bar("+2", 12.926, 12.934, 12.872, 12.88),
      bar("+3", 12.88, 12.888, 12.826, 12.834),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A hanging man after a grind is usually fade-or-wait, not a chase of the lower wick as a dip. This is not a shooting star: that is a long upper wick. This is not a hammer: a hammer shows up after a decline, not after a grind. This is not a doji and not three black crows. This is not an outside bar: the high stayed inside the prior high. HOLD if the slip already has your size. This is not the GBP/CAD tweezer, not the GBP/CHF Swiss evening star, not the NZD/CHF opening drive, not the CHF/JPY dump, not the CAD/CHF inside bar, not the GBP/AUD outside bar, not the NZD/CAD fail-break, not the EUR/NZD engulfing, not the GBP/NOK shooting star, not the NZD/NOK dark-cloud, not the NZD/SEK three-crows, not the EUR/SEK expanding range, and not a live FX desk.",
      whyMarketMoved: "The hanging-man close held and sterling-krona leaked; the lower wick did not hold.",
      evidence: "GBP/SEK hanging-man tape plus thin lower-wick-must-hold chatter. Practice only.",
    },
    allowShort: false,
    packId: "forex-tape",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-tape-eurpln-harami",
    title: "EUR/PLN prints a bearish harami after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "EUR/PLN ground higher into a tall green bar, then printed a small body fully inside that green body. Thin chatter says the small inside body means the grind must resume. SAMPLE pair only, not a live FX desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Bearish harami on euro-zloty. Thin chatter: small inside body means the grind must resume.",
    preOhlc: EURPLN_PRE,
    postOhlc: withAftermath(EURPLN_PRE, [
      bar("+1", 4.664, 4.678, 4.618, 4.628),
      bar("+2", 4.628, 4.642, 4.568, 4.582),
      bar("+3", 4.582, 4.596, 4.518, 4.532),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish harami after a grind is usually fade-or-wait, not a chase of the small inside body as a resume. The small body sits inside the prior body; this is not a bearish engulfing. This is not a hanging man (no long lower wick) and not a shooting star (no long upper wick). This is not the CAD/CHF inside-bar-still-ahead HOLD: there is no official note still ahead, and the process here is fade-or-wait, not wait-for-the-print. HOLD if the slip already has your size. This is not the GBP/CAD tweezer, not the GBP/CHF Swiss evening star, not the NZD/CHF opening drive, not the CHF/JPY dump, not the CAD/CHF inside bar, not the GBP/AUD outside bar, not the NZD/CAD fail-break, not the EUR/NZD engulfing, not the GBP/NOK shooting star, not the NZD/NOK dark-cloud, not the NZD/SEK three-crows, not the GBP/SEK hanging man, not the CAD/JPY dump-then-harami, and not a live FX desk.",
      whyMarketMoved: "The harami close held and euro-zloty leaked; the small inside body was not a resume of the grind.",
      evidence: "EUR/PLN bearish-harami tape plus thin grind-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "forex-tape",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-tape-eurczk-marubozu",
    title: "EUR/CZK prints a bearish marubozu after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "EUR/CZK ground higher, then printed a long red bar that opened near its high and closed near its low, with almost no wicks. Thin chatter says the long red close must bounce. SAMPLE pair only, not a live FX desk. Chase the red as a dip, wait, or take risk off?",
    newsHeadline:
      "Bearish marubozu on euro-koruna. Thin chatter: long red close must bounce.",
    preOhlc: EURCZK_PRE,
    postOhlc: withAftermath(EURCZK_PRE, [
      bar("+1", 25.204, 25.218, 25.118, 25.132),
      bar("+2", 25.132, 25.146, 25.046, 25.058),
      bar("+3", 25.058, 25.072, 24.972, 24.986),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish marubozu after a grind is usually fade-or-wait, not a chase of the long red close as a bounce. The bar opened near the high and closed near the low with tiny wicks; this is not a hanging man (no long lower wick) and not a shooting star (no long upper wick). This is not a bearish engulfing: the red body does not swallow the prior green body. This is not three black crows (one bar, not three) and not a dark-cloud cover (that opens above the prior close and stays inside the prior body). This is not a harami: the last bar is large, not a small body inside the prior body. HOLD if the slip already has your size. This is not the GBP/CAD tweezer, not the GBP/CHF Swiss evening star, not the NZD/CHF opening drive, not the CHF/JPY dump, not the CAD/CHF inside bar, not the GBP/AUD outside bar, not the NZD/CAD fail-break, not the EUR/NZD engulfing, not the GBP/NOK shooting star, not the NZD/NOK dark-cloud, not the NZD/SEK three-crows, not the GBP/SEK hanging man, not the EUR/PLN harami, and not a live FX desk.",
      whyMarketMoved: "The marubozu close held and euro-koruna leaked; the long red close was not a bounce.",
      evidence: "EUR/CZK bearish-marubozu tape plus thin long-red-must-bounce chatter. Practice only.",
    },
    allowShort: false,
    packId: "forex-tape",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-tape-eurhuf-gravestone",
    title: "EUR/HUF prints a gravestone doji after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "EUR/HUF ground higher, then printed a gravestone doji: open and close sit on the lows with a long upper wick and almost no body. Thin chatter says the wick must continue. SAMPLE pair only, not a live FX desk. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Gravestone doji on euro-forint. Thin chatter: upper wick must continue.",
    preOhlc: EURHUF_PRE,
    postOhlc: withAftermath(EURHUF_PRE, [
      bar("+1", 393.66, 393.78, 392.86, 392.98),
      bar("+2", 392.98, 393.08, 392.12, 392.24),
      bar("+3", 392.24, 392.34, 391.48, 391.58),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A gravestone doji after a grind is usually fade-or-wait, not a chase of the upper wick. Open and close sit on the lows with almost no body; this is not a shooting star (that has a small real body near the lows). This is not a hanging man (no long lower wick) and not a marubozu (this bar has a long upper wick). This is not an outside bar: the low stayed inside the prior low. This is not a harami (the last bar is not a small body inside the prior body). HOLD if the slip already has your size. This is not the GBP/CAD tweezer, not the GBP/CHF Swiss evening star, not the NZD/CHF opening drive, not the CHF/JPY dump, not the CAD/CHF inside bar, not the GBP/AUD outside bar, not the NZD/CAD fail-break, not the EUR/NZD engulfing, not the GBP/NOK shooting star, not the NZD/NOK dark-cloud, not the NZD/SEK three-crows, not the GBP/SEK hanging man, not the EUR/PLN harami, not the EUR/CZK marubozu, and not a live FX desk.",
      whyMarketMoved: "The gravestone close held and euro-forint leaked; the upper wick did not continue.",
      evidence: "EUR/HUF gravestone-doji tape plus thin wick-must-continue chatter. Practice only.",
    },
    allowShort: false,
    packId: "forex-tape",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-tape-gbphuf-harami-cross",
    title: "GBP/HUF prints a harami cross after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "GBP/HUF ground higher into a tall green bar, then printed a doji fully inside that green body. Thin chatter says the doji means the grind must resume. SAMPLE pair only, not a live FX desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Harami cross on sterling-forint. Thin chatter: the doji means the grind must resume.",
    preOhlc: GBPHUF_PRE,
    postOhlc: withAftermath(GBPHUF_PRE, [
      bar("+1", 467.89, 468.02, 467.18, 467.32),
      bar("+2", 467.32, 467.44, 466.48, 466.62),
      bar("+3", 466.62, 466.74, 465.78, 465.92),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A harami cross after a grind is usually fade-or-wait, not a chase of the inside doji as a resume. The doji sits inside the prior body; this is not a bearish harami with a small real body, and not a gravestone (open and close are not pinned to the lows with a long upper wick). This is not a hanging man (no long lower wick) and not a shooting star (no long upper wick from the lows). This is not the CAD/CHF inside-bar-still-ahead HOLD: there is no official note still ahead, and the process here is fade-or-wait, not wait-for-the-print. HOLD if the slip already has your size. This is not the GBP/CAD tweezer, not the GBP/CHF Swiss evening star, not the NZD/CHF opening drive, not the CHF/JPY dump, not the CAD/CHF inside bar, not the GBP/AUD outside bar, not the NZD/CAD fail-break, not the EUR/NZD engulfing, not the GBP/NOK shooting star, not the NZD/NOK dark-cloud, not the NZD/SEK three-crows, not the GBP/SEK hanging man, not the EUR/PLN harami, not the EUR/CZK marubozu, not the EUR/HUF gravestone, and not a live FX desk.",
      whyMarketMoved: "The harami-cross close held and sterling-forint leaked; the inside doji was not a resume of the grind.",
      evidence: "GBP/HUF harami-cross tape plus thin doji-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "forex-tape",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-tape-eurron-spinning-top",
    title: "EUR/RON prints a spinning top after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "EUR/RON ground higher, then printed a spinning top: a small real body near the middle of the bar with upper and lower wicks of similar length. Thin chatter says the pause means the grind must resume. SAMPLE pair only, not a live FX desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Spinning top on euro-leu. Thin chatter: the pause means the grind must resume.",
    preOhlc: EURRON_PRE,
    postOhlc: withAftermath(EURRON_PRE, [
      bar("+1", 5.048, 5.062, 4.968, 4.982),
      bar("+2", 4.982, 4.996, 4.898, 4.912),
      bar("+3", 4.912, 4.926, 4.828, 4.842),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A spinning top after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar has a small real body near the middle with wicks both ways; this is not a hanging man (that sits near the highs with a long lower wick only) and not a shooting star (that sits near the lows with a long upper wick only). This is not a harami cross: the last bar is not a doji sitting inside the prior body. This is not a gravestone (open and close are not pinned to the lows). This is not the CAD/CHF inside-bar-still-ahead HOLD: there is no official note still ahead, and the process here is fade-or-wait, not wait-for-the-print. HOLD if the slip already has your size. This is not the GBP/CAD tweezer, not the GBP/CHF Swiss evening star, not the NZD/CHF opening drive, not the CHF/JPY dump, not the CAD/CHF inside bar, not the GBP/AUD outside bar, not the NZD/CAD fail-break, not the EUR/NZD engulfing, not the GBP/NOK shooting star, not the NZD/NOK dark-cloud, not the NZD/SEK three-crows, not the GBP/SEK hanging man, not the EUR/PLN harami, not the EUR/CZK marubozu, not the EUR/HUF gravestone, not the GBP/HUF harami-cross, and not a live FX desk.",
      whyMarketMoved: "The spinning-top close held and euro-leu leaked; the pause was not a resume of the grind.",
      evidence: "EUR/RON spinning-top tape plus thin pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "forex-tape",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-tape-gbpron-long-legged-doji",
    title: "GBP/RON prints a long-legged doji after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "GBP/RON ground higher, then printed a long-legged doji: open and close sit together with long upper and lower wicks of similar length. Thin chatter says the long-legged pause means the grind must resume. SAMPLE pair only, not a live FX desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Long-legged doji on sterling-leu. Thin chatter: the long-legged pause means the grind must resume.",
    preOhlc: GBPRON_PRE,
    postOhlc: withAftermath(GBPRON_PRE, [
      bar("+1", 5.748, 5.762, 5.668, 5.682),
      bar("+2", 5.682, 5.696, 5.598, 5.612),
      bar("+3", 5.612, 5.626, 5.528, 5.542),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A long-legged doji after a grind is usually fade-or-wait, not a chase of the pause as a resume. Open and close sit together with long wicks both ways; this is not a spinning top (that has a small real body). This is not a gravestone (open and close are not pinned to the lows with a long upper wick only). This is not a harami cross: the doji is not sitting inside the prior body. This is not a hanging man (no long lower wick only) and not a shooting star (no long upper wick from the lows). This is not the CAD/CHF inside-bar-still-ahead HOLD: there is no official note still ahead, and the process here is fade-or-wait, not wait-for-the-print. HOLD if the slip already has your size. This is not the GBP/CAD tweezer, not the GBP/CHF Swiss evening star, not the NZD/CHF opening drive, not the CHF/JPY dump, not the CAD/CHF inside bar, not the GBP/AUD outside bar, not the NZD/CAD fail-break, not the EUR/NZD engulfing, not the GBP/NOK shooting star, not the NZD/NOK dark-cloud, not the NZD/SEK three-crows, not the GBP/SEK hanging man, not the EUR/PLN harami, not the EUR/CZK marubozu, not the EUR/HUF gravestone, not the GBP/HUF harami-cross, not the EUR/RON spinning top, not the CAD/RON spinning-top macro, and not a live FX desk.",
      whyMarketMoved: "The long-legged-doji close held and sterling-leu leaked; the pause was not a resume of the grind.",
      evidence: "GBP/RON long-legged-doji tape plus thin long-legged-pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "forex-tape",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-tape-audron-dragonfly",
    title: "AUD/RON prints a dragonfly doji after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "AUD/RON ground higher, then printed a dragonfly doji: open and close sit together at the highs with a long lower wick only. Thin chatter says the dragonfly pause means the grind must resume. SAMPLE pair only, not a live FX desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Dragonfly doji on Aussie-leu. Thin chatter: the dragonfly pause means the grind must resume.",
    preOhlc: AUDRON_PRE,
    postOhlc: withAftermath(AUDRON_PRE, [
      bar("+1", 3.3486, 3.3568, 3.2784, 3.2864),
      bar("+2", 3.2864, 3.2942, 3.2146, 3.2228),
      bar("+3", 3.2228, 3.2306, 3.1486, 3.1568),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A dragonfly doji after a grind is usually fade-or-wait, not a chase of the pause as a resume. Open and close sit together at the highs with a long lower wick; this is not a hanging man (that has a small real body near the highs). This is not a gravestone (open and close are not pinned to the lows with a long upper wick). This is not a long-legged doji (no long upper wick). This is not a spinning top (no small real body in the middle). This is not a harami cross: the doji is not sitting inside the prior body. This is not the CAD/CHF inside-bar-still-ahead HOLD: there is no official note still ahead, and the process here is fade-or-wait, not wait-for-the-print. HOLD if the slip already has your size. This is not the GBP/CAD tweezer, not the GBP/CHF Swiss evening star, not the NZD/CHF opening drive, not the CHF/JPY dump, not the CAD/CHF inside bar, not the GBP/AUD outside bar, not the NZD/CAD fail-break, not the EUR/NZD engulfing, not the GBP/NOK shooting star, not the NZD/NOK dark-cloud, not the NZD/SEK three-crows, not the GBP/SEK hanging man, not the EUR/PLN harami, not the EUR/CZK marubozu, not the EUR/HUF gravestone, not the GBP/HUF harami-cross, not the EUR/RON spinning top, not the GBP/RON long-legged doji, not the CAD/RON spinning-top macro, not the NZD/RON long-legged-doji macro, and not a live FX desk.",
      whyMarketMoved: "The dragonfly-doji close held and Aussie-leu leaked; the pause was not a resume of the grind.",
      evidence: "AUD/RON dragonfly-doji tape plus thin dragonfly-pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "forex-tape",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-tape-audhuf-matching-high",
    title: "AUD/HUF prints a matching high after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "AUD/HUF ground higher into a tall green bar, then printed a small green bar that tags nearly the same high and closes weak under it. Thin chatter says the matching-high pause means the grind must resume. SAMPLE pair only, not a live FX desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Matching high on Aussie-forint. Thin chatter: the matching-high pause means the grind must resume.",
    preOhlc: AUDHUF_PRE,
    postOhlc: withAftermath(AUDHUF_PRE, [
      bar("+1", 215.08, 215.18, 213.68, 213.86),
      bar("+2", 213.86, 214.02, 212.48, 212.68),
      bar("+3", 212.68, 212.86, 211.18, 211.42),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A matching high after a grind is usually fade-or-wait, not a chase of the pause as a resume. Both bars are green and share nearly the same high; the last close sits weak under that high. This is not a tweezer: a tweezer tags the high with opposite-color bodies. This is not a shooting star (the last body is not sitting near the lows with a long upper wick only). This is not a dragonfly (open and close are not pinned to the highs with a long lower wick). This is not a harami: the last high pokes to the prior high, not a small body fully inside the prior body. This is not the CAD/CHF inside-bar-still-ahead HOLD: there is no official note still ahead, and the process here is fade-or-wait, not wait-for-the-print. HOLD if the slip already has your size. This is not the GBP/CAD tweezer, not the GBP/CHF Swiss evening star, not the NZD/CHF opening drive, not the CHF/JPY dump, not the CAD/CHF inside bar, not the GBP/AUD outside bar, not the NZD/CAD fail-break, not the EUR/NZD engulfing, not the GBP/NOK shooting star, not the NZD/NOK dark-cloud, not the NZD/SEK three-crows, not the GBP/SEK hanging man, not the EUR/PLN harami, not the EUR/CZK marubozu, not the EUR/HUF gravestone, not the GBP/HUF harami-cross, not the EUR/RON spinning top, not the GBP/RON long-legged doji, not the AUD/RON dragonfly, not the CAD/HUF dragonfly macro, not the NZD/HUF harami-cross macro, and not a live FX desk.",
      whyMarketMoved: "The matching-high close held and Aussie-forint leaked; the pause was not a resume of the grind.",
      evidence: "AUD/HUF matching-high tape plus thin matching-high-pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "forex-tape",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-tape-audczk-belt-hold",
    title: "AUD/CZK prints a bearish belt hold after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "AUD/CZK ground higher, then printed a bearish belt hold: the last bar opens at its high with no upper wick and sells off, closing weak with a real body and a lower wick. Thin chatter says the belt-hold pause means the grind must resume. SAMPLE pair only, not a live FX desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Bearish belt hold on Aussie-koruna. Thin chatter: the belt-hold pause means the grind must resume.",
    preOhlc: AUDCZK_PRE,
    postOhlc: withAftermath(AUDCZK_PRE, [
      bar("+1", 15.328, 15.368, 15.018, 15.068),
      bar("+2", 15.068, 15.118, 14.718, 14.768),
      bar("+3", 14.768, 14.818, 14.318, 14.368),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish belt hold after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar opens at the high with no upper wick and sells off into a real body; a lower wick is allowed. This is not a marubozu: a marubozu has tiny wicks at both ends and closes near the low. This is not a matching high: both of those bars are green and share nearly the same high. This is not a hanging man (the body is not a small real body near the highs with a long lower wick). This is not a shooting star (there is no long upper wick from the lows). HOLD if the slip already has your size. This is not the GBP/CAD tweezer, not the GBP/CHF Swiss evening star, not the NZD/CHF opening drive, not the CHF/JPY dump, not the CAD/CHF inside bar, not the GBP/AUD outside bar, not the NZD/CAD fail-break, not the EUR/NZD engulfing, not the GBP/NOK shooting star, not the NZD/NOK dark-cloud, not the NZD/SEK three-crows, not the GBP/SEK hanging man, not the EUR/PLN harami, not the EUR/CZK marubozu, not the EUR/HUF gravestone, not the GBP/HUF harami-cross, not the EUR/RON spinning top, not the GBP/RON long-legged doji, not the AUD/RON dragonfly, not the AUD/HUF matching high, not the GBP/CZK marubozu macro, and not a live FX desk.",
      whyMarketMoved: "The belt-hold close held and Aussie-koruna leaked; the pause was not a resume of the grind.",
      evidence: "AUD/CZK bearish-belt-hold tape plus thin belt-hold-pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "forex-tape",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-tape-nzdczk-separating-lines",
    title: "NZD/CZK prints bearish separating lines after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "NZD/CZK ground higher into a tall green bar, then printed a long red bar that opens at nearly the same open as that green bar and sells off. Thin chatter says the separating-lines pause means the grind must resume. SAMPLE pair only, not a live FX desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Bearish separating lines on kiwi-koruna. Thin chatter: the separating-lines pause means the grind must resume.",
    preOhlc: NZDCZK_PRE,
    postOhlc: withAftermath(NZDCZK_PRE, [
      bar("+1", 26.748, 26.818, 26.186, 26.248),
      bar("+2", 26.248, 26.318, 25.648, 25.718),
      bar("+3", 25.718, 25.786, 24.986, 25.068),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Bearish separating lines after a grind are usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens at nearly the same open as the prior tall green and sells off. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick, usually after the prior close, not back at the prior open. This is not a marubozu: a marubozu has tiny wicks at both ends and closes near the low. This is not a matching high: both of those bars are green and share nearly the same high. This is not a hanging man (the body is not a small real body near the highs with a long lower wick). This is not a shooting star (there is no long upper wick from the lows). HOLD if the slip already has your size. This is not the GBP/CAD tweezer, not the GBP/CHF Swiss evening star, not the NZD/CHF opening drive, not the CHF/JPY dump, not the CAD/CHF inside bar, not the GBP/AUD outside bar, not the NZD/CAD fail-break, not the EUR/NZD engulfing, not the GBP/NOK shooting star, not the NZD/NOK dark-cloud, not the NZD/SEK three-crows, not the GBP/SEK hanging man, not the EUR/PLN harami, not the EUR/CZK marubozu, not the EUR/HUF gravestone, not the GBP/HUF harami-cross, not the EUR/RON spinning top, not the GBP/RON long-legged doji, not the AUD/RON dragonfly, not the AUD/HUF matching high, not the AUD/CZK belt hold, not the GBP/CZK marubozu macro, not the CAD/CZK belt hold macro, and not a live FX desk.",
      whyMarketMoved: "The separating-lines close held and kiwi-koruna leaked; the pause was not a resume of the grind.",
      evidence: "NZD/CZK bearish-separating-lines tape plus thin separating-lines-pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "forex-tape",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-tape-eurdkk-on-neck",
    title: "EUR/DKK prints a bearish on-neck after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "EUR/DKK ground higher into a tall green bar, then printed a long red bar that opens above that green close and closes at nearly the prior low. Thin chatter says the on-neck pause means the grind must resume. SAMPLE pair only, not a live FX desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Bearish on-neck on euro-krone. Thin chatter: the on-neck pause means the grind must resume.",
    preOhlc: EURDKK_PRE,
    postOhlc: withAftermath(EURDKK_PRE, [
      bar("+1", 7.2728, 7.2864, 7.1486, 7.1628),
      bar("+2", 7.1628, 7.1786, 7.0286, 7.0448),
      bar("+3", 7.0448, 7.0618, 6.8986, 6.9186),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish on-neck after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens above the prior close and closes at nearly the prior low. This is not separating lines: those share nearly the same open as the prior tall green. This is not a dark-cloud: a dark-cloud closes in the lower half of the prior body, still above that prior open, not at the prior low. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick. This is not a matching high: both of those bars are green and share nearly the same high. This is not a hanging man (the body is not a small real body near the highs with a long lower wick). HOLD if the slip already has your size. This is not the GBP/CAD tweezer, not the GBP/CHF Swiss evening star, not the NZD/CHF opening drive, not the CHF/JPY dump, not the CAD/CHF inside bar, not the GBP/AUD outside bar, not the NZD/CAD fail-break, not the EUR/NZD engulfing, not the GBP/NOK shooting star, not the NZD/NOK dark-cloud, not the NZD/SEK three-crows, not the GBP/SEK hanging man, not the EUR/PLN harami, not the EUR/CZK marubozu, not the EUR/HUF gravestone, not the GBP/HUF harami-cross, not the EUR/RON spinning top, not the GBP/RON long-legged doji, not the AUD/RON dragonfly, not the AUD/HUF matching high, not the AUD/CZK belt hold, not the NZD/CZK separating lines, not the AUD/SEK three-crows macro, not the EUR/SEK expanding range, not the Danish-krone futures gravestone, and not a live FX desk.",
      whyMarketMoved: "The on-neck close held and euro-krone leaked; the pause was not a resume of the grind.",
      evidence: "EUR/DKK bearish-on-neck tape plus thin on-neck-pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "forex-tape",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-tape-gbpdkk-in-neck",
    title: "GBP/DKK prints a bearish in-neck after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "GBP/DKK ground higher into a tall green bar, then printed a long red bar that opens above that green close and closes at nearly that same close, not the prior low. Thin chatter says the in-neck pause means the grind must resume. SAMPLE pair only, not a live FX desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Bearish in-neck on sterling-krone. Thin chatter: the in-neck pause means the grind must resume.",
    preOhlc: GBPDKK_PRE,
    postOhlc: withAftermath(GBPDKK_PRE, [
      bar("+1", 8.6228, 8.6486, 8.4486, 8.4686),
      bar("+2", 8.4686, 8.4928, 8.2486, 8.2686),
      bar("+3", 8.2686, 8.2928, 8.0186, 8.0486),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish in-neck after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens above the prior close and closes at nearly that same close, not the prior low. This is not on-neck: on-neck closes at nearly the prior low. This is not a dark-cloud: a dark-cloud closes in the lower half of the prior body, still above that prior open, not back at the prior close. This is not separating lines: those share nearly the same open as the prior tall green. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick. This is not a matching high: both of those bars are green and share nearly the same high. This is not euro-krone: EUR/DKK is the ERM2 on-neck tape, not this sterling-krone in-neck. HOLD if the slip already has your size. This is not the GBP/CAD tweezer, not the GBP/CHF Swiss evening star, not the NZD/CHF opening drive, not the CHF/JPY dump, not the CAD/CHF inside bar, not the GBP/AUD outside bar, not the NZD/CAD fail-break, not the EUR/NZD engulfing, not the GBP/NOK shooting star, not the NZD/NOK dark-cloud, not the NZD/SEK three-crows, not the GBP/SEK hanging man, not the EUR/PLN harami, not the EUR/CZK marubozu, not the EUR/HUF gravestone, not the GBP/HUF harami-cross, not the EUR/RON spinning top, not the GBP/RON long-legged doji, not the AUD/RON dragonfly, not the AUD/HUF matching high, not the AUD/CZK belt hold, not the NZD/CZK separating lines, not the EUR/DKK on-neck, not the AUD/DKK on-neck macro, and not a live FX desk.",
      whyMarketMoved: "The in-neck close held and sterling-krone leaked; the pause was not a resume of the grind.",
      evidence: "GBP/DKK bearish-in-neck tape plus thin in-neck-pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "forex-tape",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-tape-chfdkk-thrusting",
    title: "CHF/DKK prints a bearish thrusting line after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "CHF/DKK ground higher into a tall green bar, then printed a long red bar that opens above that green close and closes into that prior body, still above the midpoint. Thin chatter says the thrusting pause means the grind must resume. SAMPLE pair only, not a live FX desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Bearish thrusting line on franc-krone. Thin chatter: the thrusting pause means the grind must resume.",
    preOhlc: CHFDKK_PRE,
    postOhlc: withAftermath(CHFDKK_PRE, [
      bar("+1", 7.8686, 7.8884, 7.7286, 7.7486),
      bar("+2", 7.7486, 7.7684, 7.5986, 7.6186),
      bar("+3", 7.6186, 7.6384, 7.4486, 7.4686),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish thrusting line after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens above the prior close and closes into that prior body, still above the midpoint. This is not in-neck: in-neck closes at nearly the prior close. This is not on-neck: on-neck closes at nearly the prior low. This is not a dark-cloud: a dark-cloud closes in the lower half of the prior body, still above that prior open. This is not separating lines: those share nearly the same open as the prior tall green. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick. This is not a matching high: both of those bars are green and share nearly the same high. This is not euro-krone: EUR/DKK is the ERM2 on-neck tape, not this franc-krone thrusting line. This is not sterling-krone: GBP/DKK is the in-neck tape near 8.62. HOLD if the slip already has your size. This is not the GBP/CAD tweezer, not the GBP/CHF Swiss evening star, not the NZD/CHF opening drive, not the CHF/JPY dump, not the CAD/CHF inside bar, not the GBP/AUD outside bar, not the NZD/CAD fail-break, not the EUR/NZD engulfing, not the GBP/NOK shooting star, not the NZD/NOK dark-cloud, not the NZD/SEK three-crows, not the GBP/SEK hanging man, not the EUR/PLN harami, not the EUR/CZK marubozu, not the EUR/HUF gravestone, not the GBP/HUF harami-cross, not the EUR/RON spinning top, not the GBP/RON long-legged doji, not the AUD/RON dragonfly, not the AUD/HUF matching high, not the AUD/CZK belt hold, not the NZD/CZK separating lines, not the EUR/DKK on-neck, not the GBP/DKK in-neck, not the AUD/DKK on-neck macro, and not a live FX desk.",
      whyMarketMoved: "The thrusting close held and franc-krone leaked; the pause was not a resume of the grind.",
      evidence: "CHF/DKK bearish-thrusting tape plus thin thrusting-pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "forex-tape",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-macro-cadjpy-harami",
    title: "CAD/JPY harami after a dump as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "CAD/JPY already dumped as risk appetite faded. The last full bar is a small inside candle, not a reclaim. Some traders buy yen in a scare. Ask whether that inside bar is a pause or a new bid. SAMPLE pair only, not a live FX desk.",
    newsHeadline:
      "Risk-off. Yen bid as a scare currency in this SAMPLE brief. Loonie-yen dumped, then printed a small inside bar.",
    preOhlc: CADJPY_PRE,
    postOhlc: withAftermath(CADJPY_PRE, [
      bar("+1", 104.8, 105.0, 103.6, 103.8),
      bar("+2", 103.8, 104.0, 102.6, 102.8),
      bar("+3", 102.8, 103.0, 101.6, 101.8),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off yen bid can keep this pair falling. A small inside bar after a dump is often a pause, not a reclaim. Fade or wait; HOLD if the slip already has your size. This is not the USD/JPY elevated dump, not the GBP/CAD tweezer, not the NZD/JPY head-and-shoulders, and not a live FX desk.",
      whyMarketMoved: "The inside bar failed and loonie-yen leaked as yen stayed bid.",
      evidence: "CAD/JPY dump-then-harami tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "forex-macro",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-macro-audchf-jobs-print",
    title: "AUD/CHF coiled into a hot Australian jobs print",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "AUD/CHF has been coiled in a tight range into a scheduled Australian jobs print. The print comes in hot. The Aussie often firms versus the franc. Ask whether the coil is a pause or already your size. SAMPLE pair only, not a live FX desk.",
    newsHeadline: "Hot Australian jobs print. Aussie in focus versus the franc.",
    preOhlc: AUDCHF_PRE,
    postOhlc: withAftermath(AUDCHF_PRE, [
      bar("+1", 0.5738, 0.5764, 0.5736, 0.5758),
      bar("+2", 0.5758, 0.5778, 0.5754, 0.5772),
      bar("+3", 0.5772, 0.579, 0.5768, 0.5784),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Size for surprise into data. A hot home jobs print can bid the Aussie, so this pair can rise. HOLD if the coil already has your size. This is not the USD/JPY hot-US print, not the AUD/USD hot-US fade, not the CAD/JPY risk-off harami, not the GBP/CHF Swiss statement, and not a live FX desk.",
      whyMarketMoved: "The coil broke higher as the Aussie firmed on the jobs print.",
      evidence: "AUD/CHF coil tape plus an Australian jobs-print brief. Practice only.",
    },
    allowShort: false,
    packId: "forex-macro",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-macro-eurnok-oil-supply",
    title: "EUR/NOK grinds into an oil-supply scare",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "EUR/NOK has been grinding higher. Then an oil-supply scare hits. Norway is a producer in this SAMPLE brief; Europe is on the cost side. Name which side the krone is on. SAMPLE pair only, not a live FX desk.",
    newsHeadline:
      "Oil-supply scare. Shipping disruption. Producer krone versus euro costs in this SAMPLE brief.",
    preOhlc: EURNOK_PRE,
    postOhlc: withAftermath(EURNOK_PRE, [
      bar("+1", 12.38, 12.4, 12.18, 12.22),
      bar("+2", 12.22, 12.26, 12.02, 12.06),
      bar("+3", 12.06, 12.1, 11.86, 11.9),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A supply scare can help a producer currency and hurt a buyer. Here the krone is the producer, so this pair can fall. HOLD if the grind already has your size. This is not the EUR/USD energy wobble, not the USD/NOK producer fade, not the CAD/JPY risk-off harami, not the AUD/CHF jobs coil, and not a live FX desk.",
      whyMarketMoved: "The grind reversed as the krone bid with the oil scare.",
      evidence: "EUR/NOK grind tape plus a producer-side oil-supply headline. Practice only.",
    },
    allowShort: false,
    packId: "forex-macro",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-macro-audsgd-dump-no-reclaim",
    title: "AUD/SGD dumps as risk appetite fades, no reclaim",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "AUD/SGD already dumped as risk appetite faded. The Singapore dollar is the more defensive side in this SAMPLE brief. Thin chatter says the first bounce must reclaim. The bounce has not shown up. Ask whether the scare is already in the dump. SAMPLE pair only, not a live FX desk.",
    newsHeadline:
      "Risk-off. Aussie sold versus a defensive Singapore dollar. Thin chatter: dump must reclaim. No bounce yet.",
    preOhlc: AUDSGD_PRE,
    postOhlc: withAftermath(AUDSGD_PRE, [
      bar("+1", 0.8702, 0.871, 0.8684, 0.8688),
      bar("+2", 0.8688, 0.8696, 0.867, 0.8674),
      bar("+3", 0.8674, 0.8682, 0.8656, 0.866),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this pair falling when the Aussie is the risk side. A dump with no reclaim is late-chase, not a new bounce path. Fade or wait; HOLD if the slip already has your size. This is not the CAD/JPY dump-then-harami, not the AUD/CHF jobs coil, not the EUR/NOK oil grind, not the USD/SGD intervention-rumor tape, and not a live FX desk.",
      whyMarketMoved: "The dump continued; no bounce showed up as the Aussie stayed offered versus the Singapore dollar.",
      evidence: "AUD/SGD dump-no-reclaim tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "forex-macro",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-macro-nzdsgd-evening-star",
    title: "NZD/SGD evening star as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "NZD/SGD rallied into a long green bar, a small star at the highs, then a red close back into that body as risk appetite faded. The Singapore dollar is the more defensive side in this SAMPLE brief. Ask whether that evening star is a pause or a new kiwi bid. SAMPLE pair only, not a live FX desk.",
    newsHeadline:
      "Risk-off. Kiwi sold versus a defensive Singapore dollar. Evening star at the highs, not a reclaim.",
    preOhlc: NZDSGD_PRE,
    postOhlc: withAftermath(NZDSGD_PRE, [
      bar("+1", 0.8132, 0.8138, 0.8108, 0.8112),
      bar("+2", 0.8112, 0.8118, 0.8088, 0.8092),
      bar("+3", 0.8092, 0.8098, 0.8068, 0.8072),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this pair falling when the kiwi is the risk side. The evening star is already a pause, not a new kiwi path. Fade or wait; HOLD if the slip already has your size. This is not the GBP/CHF Swiss evening star, not the CAD/JPY dump-then-harami, not the AUD/CHF jobs coil, not the EUR/NOK oil grind, not the AUD/SGD dump-no-reclaim, not the NZD/CHF RBNZ opening drive, and not a live FX desk.",
      whyMarketMoved: "The red close held and kiwi-Singapore leaked as the kiwi stayed offered versus the Singapore dollar.",
      evidence: "NZD/SGD evening-star tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "forex-macro",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-macro-eursgd-outside-bar",
    title: "EUR/SGD outside bar that closes weak as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "EUR/SGD printed a wide bar that took both sides, then closed weak as risk appetite faded. The Singapore dollar is the more defensive side in this SAMPLE brief. Thin chatter says the upper wick must hold. SAMPLE pair only, not a live FX desk. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Euro sold versus a defensive Singapore dollar. Outside bar. Thin chatter: wick must hold.",
    preOhlc: EURSGD_PRE,
    postOhlc: withAftermath(EURSGD_PRE, [
      bar("+1", 1.4616, 1.4622, 1.4592, 1.4598),
      bar("+2", 1.4598, 1.4604, 1.4574, 1.458),
      bar("+3", 1.458, 1.4586, 1.4556, 1.4562),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this pair falling when the euro is the risk side versus a defensive Singapore dollar. An outside bar that closes weak is usually fade-or-wait, not a chase of the upper wick. HOLD if the slip already has your size. This is not the CAD/JPY dump-then-harami, not the AUD/CHF jobs coil, not the EUR/NOK oil grind, not the AUD/SGD dump-no-reclaim, not the NZD/SGD evening star, not the GBP/AUD tape outside bar, not the USD/CLP copper-print outside bar, and not a live FX desk.",
      whyMarketMoved: "The weak close continued lower; the upper wick did not hold as the euro stayed offered versus the Singapore dollar.",
      evidence: "EUR/SGD outside-bar tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "forex-macro",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-macro-gbpsgd-fail-break",
    title: "GBP/SGD pokes a range, then fails as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "GBP/SGD poked above a range, then slipped back as risk appetite faded. The Singapore dollar is the more defensive side in this SAMPLE brief. Thin chatter says the break must hold. SAMPLE pair only, not a live FX desk. Chase the first green poke, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Sterling sold versus a defensive Singapore dollar. Thin chatter: range break must hold.",
    preOhlc: GBPSGD_PRE,
    postOhlc: withAftermath(GBPSGD_PRE, [
      bar("+1", 1.712, 1.7132, 1.7088, 1.7096),
      bar("+2", 1.7096, 1.7108, 1.7064, 1.7072),
      bar("+3", 1.7072, 1.7084, 1.704, 1.7048),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this pair falling when sterling is the risk side versus a defensive Singapore dollar. A failed poke is usually fade-or-wait, not a chase. Do not treat the first green bar as a breakout. HOLD if the slip already has your size. This is not the CAD/JPY dump-then-harami, not the AUD/CHF jobs coil, not the EUR/NOK oil grind, not the AUD/SGD dump-no-reclaim, not the NZD/SGD evening star, not the EUR/SGD outside bar, not the NZD/CAD tape fail-break, not the EUR/CHF ceiling fail-rally, and not a live FX desk.",
      whyMarketMoved: "The poke failed and sterling-Singapore slipped back through the range as sterling stayed offered versus the Singapore dollar.",
      evidence: "GBP/SGD failed-breakout tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "forex-macro",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-macro-cadsgd-engulf",
    title: "CAD/SGD prints a bearish engulfing as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "CAD/SGD printed a small green bar, then a red bar whose body swallowed that green body as risk appetite faded. The Singapore dollar is the more defensive side in this SAMPLE brief. Thin chatter says the first green must resume. SAMPLE pair only, not a live FX desk. Chase the swallowed green, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Loonie sold versus a defensive Singapore dollar. Bearish engulfing. Thin chatter: first green must resume.",
    preOhlc: CADSGD_PRE,
    postOhlc: withAftermath(CADSGD_PRE, [
      bar("+1", 0.9572, 0.9584, 0.9536, 0.9548),
      bar("+2", 0.9548, 0.956, 0.9512, 0.9524),
      bar("+3", 0.9524, 0.9536, 0.9488, 0.95),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this pair falling when the loonie is the risk side versus a defensive Singapore dollar. A bearish engulfing is usually fade-or-wait, not a chase of the swallowed green bar. This is not an outside bar: the red high stayed inside the prior high. HOLD if the slip already has your size. This is not the CAD/JPY dump-then-harami, not the AUD/CHF jobs coil, not the EUR/NOK oil grind, not the AUD/SGD dump-no-reclaim, not the NZD/SGD evening star, not the EUR/SGD outside bar, not the GBP/SGD fail-break, not the EUR/NZD tape engulfing, not the USD/SGD intervention-rumor tape, and not a live FX desk.",
      whyMarketMoved: "The engulfing close held and loonie-Singapore leaked as the loonie stayed offered versus the Singapore dollar.",
      evidence: "CAD/SGD bearish-engulfing tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "forex-macro",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-macro-audnok-shooting-star",
    title: "AUD/NOK prints a shooting star as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "AUD/NOK ground higher, then printed a shooting star: a small body near the lows with a long upper wick as risk appetite faded. The Aussie is the risk side versus the krone in this SAMPLE brief. Thin chatter says the wick must continue. SAMPLE pair only, not a live FX desk. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Aussie sold versus the krone. Shooting star. Thin chatter: upper wick must continue.",
    preOhlc: AUDNOK_PRE,
    postOhlc: withAftermath(AUDNOK_PRE, [
      bar("+1", 6.886, 6.896, 6.848, 6.854),
      bar("+2", 6.854, 6.864, 6.816, 6.822),
      bar("+3", 6.822, 6.832, 6.784, 6.79),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this pair falling when the Aussie is the risk side versus the krone. A shooting star after a grind is usually fade-or-wait, not a chase of the upper wick. This is not an outside bar: the low stayed inside the prior low. This is not an evening star (that is three bars) and not a bearish engulfing (the body did not swallow the prior body). HOLD if the slip already has your size. This is not the CAD/JPY dump-then-harami, not the AUD/CHF jobs coil, not the EUR/NOK oil grind, not the AUD/SGD dump-no-reclaim, not the NZD/SGD evening star, not the EUR/SGD outside bar, not the GBP/SGD fail-break, not the CAD/SGD engulfing, not the GBP/NOK tape shooting star, and not a live FX desk.",
      whyMarketMoved: "The shooting-star close held and Aussie-krone leaked as the Aussie stayed offered with risk.",
      evidence: "AUD/NOK shooting-star tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "forex-macro",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-macro-cadnok-dark-cloud",
    title: "CAD/NOK prints a dark-cloud cover as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "CAD/NOK printed a green bar, then a red bar that opened above that close and finished in the lower half of that body without swallowing it as risk appetite faded. The loonie is the risk side versus the krone in this SAMPLE brief. Thin chatter says the gap-up open must continue. SAMPLE pair only, not a live FX desk. Chase the gap-up, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Loonie sold versus the krone. Dark-cloud cover. Thin chatter: gap-up open must continue.",
    preOhlc: CADNOK_PRE,
    postOhlc: withAftermath(CADNOK_PRE, [
      bar("+1", 7.674, 7.682, 7.638, 7.644),
      bar("+2", 7.644, 7.652, 7.608, 7.614),
      bar("+3", 7.614, 7.622, 7.578, 7.584),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this pair falling when the loonie is the risk side versus the krone. A dark-cloud cover is usually fade-or-wait, not a chase of the gap-up open. The red close is inside the prior body, so this is not a bearish engulfing. This is not an outside bar: the low stayed inside the prior low. This is not a shooting star (that is one long upper wick) and not an evening star (that is three bars). HOLD if the slip already has your size. This is not the CAD/JPY dump-then-harami, not the AUD/CHF jobs coil, not the EUR/NOK oil grind, not the AUD/SGD dump-no-reclaim, not the NZD/SGD evening star, not the EUR/SGD outside bar, not the GBP/SGD fail-break, not the CAD/SGD engulfing, not the AUD/NOK shooting star, not the NZD/NOK tape dark-cloud, and not a live FX desk.",
      whyMarketMoved: "The dark-cloud close held and loonie-krone leaked as the loonie stayed offered with risk.",
      evidence: "CAD/NOK dark-cloud tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "forex-macro",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-macro-audsek-three-crows",
    title: "AUD/SEK prints three black crows as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "AUD/SEK ground higher, then printed three falling red bodies in a row as risk appetite faded. The Aussie is the risk side versus the krona in this SAMPLE brief. Thin chatter says the first red is a dip to buy. SAMPLE pair only, not a live FX desk. Chase the dip, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Aussie sold versus the krona. Three black crows. Thin chatter: first red is a dip to buy.",
    preOhlc: AUDSEK_PRE,
    postOhlc: withAftermath(AUDSEK_PRE, [
      bar("+1", 7.126, 7.134, 7.088, 7.096),
      bar("+2", 7.096, 7.104, 7.058, 7.066),
      bar("+3", 7.066, 7.074, 7.028, 7.036),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this pair falling when the Aussie is the risk side versus the krona. Three black crows after a grind are usually fade-or-wait, not a chase of the first red as a dip. This is not one bearish engulfing bar: three similar red bodies stepped lower. This is not an evening star (that is a small middle bar) and not a dark-cloud cover (that is two bars). HOLD if the slip already has your size. This is not the CAD/JPY dump-then-harami, not the AUD/CHF jobs coil, not the EUR/NOK oil grind, not the AUD/SGD dump-no-reclaim, not the NZD/SGD evening star, not the EUR/SGD outside bar, not the GBP/SGD fail-break, not the CAD/SGD engulfing, not the AUD/NOK shooting star, not the CAD/NOK dark-cloud, not the NZD/SEK tape three-crows, not the EUR/SEK expanding range, and not a live FX desk.",
      whyMarketMoved: "The third crow held and Aussie-krona leaked as the Aussie stayed offered with risk.",
      evidence: "AUD/SEK three-black-crows tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "forex-macro",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-macro-cadsek-hanging-man",
    title: "CAD/SEK prints a hanging man as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "CAD/SEK ground higher, then printed a hanging man: a small body near the highs with a long lower wick as risk appetite faded. The loonie is the risk side versus the krona in this SAMPLE brief. Thin chatter says the lower wick must hold. SAMPLE pair only, not a live FX desk. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Loonie sold versus the krona. Hanging man. Thin chatter: lower wick must hold.",
    preOhlc: CADSEK_PRE,
    postOhlc: withAftermath(CADSEK_PRE, [
      bar("+1", 8.406, 8.422, 8.268, 8.286),
      bar("+2", 8.286, 8.302, 8.148, 8.166),
      bar("+3", 8.166, 8.182, 8.028, 8.046),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this pair falling when the loonie is the risk side versus the krona. A hanging man after a grind is usually fade-or-wait, not a chase of the lower wick as a dip. This is not a shooting star: that is a long upper wick. This is not a hammer: a hammer shows up after a decline, not after a grind. This is not a doji and not three black crows. This is not an outside bar: the high stayed inside the prior high. HOLD if the slip already has your size. This is not the CAD/JPY dump-then-harami, not the AUD/CHF jobs coil, not the EUR/NOK oil grind, not the AUD/SGD dump-no-reclaim, not the NZD/SGD evening star, not the EUR/SGD outside bar, not the GBP/SGD fail-break, not the CAD/SGD engulfing, not the AUD/NOK shooting star, not the CAD/NOK dark-cloud, not the AUD/SEK three-crows, not the GBP/SEK tape hanging man, and not a live FX desk.",
      whyMarketMoved: "The hanging-man close held and loonie-krona leaked as the loonie stayed offered with risk.",
      evidence: "CAD/SEK hanging-man tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "forex-macro",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-macro-gbppln-harami",
    title: "GBP/PLN prints a bearish harami as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "GBP/PLN ground higher into a tall green bar, then printed a small body fully inside that green body as risk appetite faded. Sterling is the risk side versus the zloty in this SAMPLE brief. Thin chatter says the small inside body means the grind must resume. SAMPLE pair only, not a live FX desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Sterling sold versus the zloty. Bearish harami. Thin chatter: small inside body means the grind must resume.",
    preOhlc: GBPPLN_PRE,
    postOhlc: withAftermath(GBPPLN_PRE, [
      bar("+1", 5.176, 5.192, 5.118, 5.132),
      bar("+2", 5.132, 5.148, 5.058, 5.072),
      bar("+3", 5.072, 5.088, 4.998, 5.012),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this pair falling when sterling is the risk side versus the zloty. A bearish harami after a grind is usually fade-or-wait, not a chase of the small inside body as a resume. The small body sits inside the prior body; this is not a bearish engulfing. This is not a hanging man (no long lower wick) and not a shooting star (no long upper wick). This is not the CAD/JPY dump-then-harami: that pattern shows up after a decline, not after a grind. HOLD if the slip already has your size. This is not the CAD/JPY dump-then-harami, not the AUD/CHF jobs coil, not the EUR/NOK oil grind, not the AUD/SGD dump-no-reclaim, not the NZD/SGD evening star, not the EUR/SGD outside bar, not the GBP/SGD fail-break, not the CAD/SGD engulfing, not the AUD/NOK shooting star, not the CAD/NOK dark-cloud, not the AUD/SEK three-crows, not the CAD/SEK hanging man, not the EUR/PLN tape harami, and not a live FX desk.",
      whyMarketMoved: "The harami close held and sterling-zloty leaked as sterling stayed offered with risk.",
      evidence: "GBP/PLN bearish-harami tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "forex-macro",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-macro-gbpczk-marubozu",
    title: "GBP/CZK prints a bearish marubozu as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "GBP/CZK ground higher, then printed a long red bar that opened near its high and closed near its low, with almost no wicks, as risk appetite faded. Sterling is the risk side versus the koruna in this SAMPLE brief. Thin chatter says the long red close must bounce. SAMPLE pair only, not a live FX desk. Chase the red as a dip, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Sterling sold versus the koruna. Bearish marubozu. Thin chatter: long red close must bounce.",
    preOhlc: GBPCZK_PRE,
    postOhlc: withAftermath(GBPCZK_PRE, [
      bar("+1", 29.946, 29.962, 29.838, 29.852),
      bar("+2", 29.852, 29.868, 29.738, 29.752),
      bar("+3", 29.752, 29.768, 29.638, 29.652),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this pair falling when sterling is the risk side versus the koruna. A bearish marubozu after a grind is usually fade-or-wait, not a chase of the long red close as a bounce. The bar opened near the high and closed near the low with tiny wicks; this is not a hanging man (no long lower wick) and not a shooting star (no long upper wick). This is not a bearish engulfing: the red body does not swallow the prior green body. This is not three black crows (one bar, not three) and not a dark-cloud cover (that opens above the prior close and stays inside the prior body). This is not a harami: the last bar is large, not a small body inside the prior body. HOLD if the slip already has your size. This is not the CAD/JPY dump-then-harami, not the AUD/CHF jobs coil, not the EUR/NOK oil grind, not the AUD/SGD dump-no-reclaim, not the NZD/SGD evening star, not the EUR/SGD outside bar, not the GBP/SGD fail-break, not the CAD/SGD engulfing, not the AUD/NOK shooting star, not the CAD/NOK dark-cloud, not the AUD/SEK three-crows, not the CAD/SEK hanging man, not the GBP/PLN harami, not the EUR/CZK tape marubozu, and not a live FX desk.",
      whyMarketMoved: "The marubozu close held and sterling-koruna leaked as sterling stayed offered with risk.",
      evidence: "GBP/CZK bearish-marubozu tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "forex-macro",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-macro-audpln-gravestone",
    title: "AUD/PLN prints a gravestone doji as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "AUD/PLN ground higher, then printed a gravestone doji: open and close sit on the lows with a long upper wick and almost no body, as risk appetite faded. The Aussie is the risk side versus the zloty in this SAMPLE brief. Thin chatter says the wick must continue. SAMPLE pair only, not a live FX desk. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Aussie sold versus the zloty. Gravestone doji. Thin chatter: upper wick must continue.",
    preOhlc: AUDPLN_PRE,
    postOhlc: withAftermath(AUDPLN_PRE, [
      bar("+1", 2.6738, 2.6752, 2.6618, 2.6632),
      bar("+2", 2.6632, 2.6644, 2.6506, 2.6518),
      bar("+3", 2.6518, 2.653, 2.6392, 2.6404),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this pair falling when the Aussie is the risk side versus the zloty. A gravestone doji after a grind is usually fade-or-wait, not a chase of the upper wick. Open and close sit on the lows with almost no body; this is not a shooting star (that has a small real body near the lows). This is not a hanging man (no long lower wick) and not a marubozu (this bar has a long upper wick). This is not an outside bar: the low stayed inside the prior low. This is not a harami (the last bar is not a small body inside the prior body). HOLD if the slip already has your size. This is not the CAD/JPY dump-then-harami, not the AUD/CHF jobs coil, not the EUR/NOK oil grind, not the AUD/SGD dump-no-reclaim, not the NZD/SGD evening star, not the EUR/SGD outside bar, not the GBP/SGD fail-break, not the CAD/SGD engulfing, not the AUD/NOK shooting star, not the CAD/NOK dark-cloud, not the AUD/SEK three-crows, not the CAD/SEK hanging man, not the GBP/PLN harami, not the GBP/CZK marubozu, not the EUR/HUF gravestone tape, and not a live FX desk.",
      whyMarketMoved: "The gravestone close held and Aussie-zloty leaked as the Aussie stayed offered with risk.",
      evidence: "AUD/PLN gravestone-doji tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "forex-macro",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-macro-nzdhuf-harami-cross",
    title: "NZD/HUF prints a harami cross as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "NZD/HUF ground higher into a tall green bar, then printed a doji fully inside that green body as risk appetite faded. The kiwi is the risk side versus the forint in this SAMPLE brief. Thin chatter says the doji means the grind must resume. SAMPLE pair only, not a live FX desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Kiwi sold versus the forint. Harami cross. Thin chatter: the doji means the grind must resume.",
    preOhlc: NZDHUF_PRE,
    postOhlc: withAftermath(NZDHUF_PRE, [
      bar("+1", 228.46, 228.58, 227.68, 227.82),
      bar("+2", 227.82, 227.94, 226.92, 227.06),
      bar("+3", 227.06, 227.18, 226.14, 226.28),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this pair falling when the kiwi is the risk side versus the forint. A harami cross after a grind is usually fade-or-wait, not a chase of the inside doji as a resume. The doji sits inside the prior body; this is not a bearish harami with a small real body, and not a gravestone (open and close are not pinned to the lows with a long upper wick). This is not a hanging man (no long lower wick) and not a shooting star (no long upper wick from the lows). This is not the CAD/JPY dump-then-harami: that pattern shows up after a decline, not after a grind. HOLD if the slip already has your size. This is not the CAD/JPY dump-then-harami, not the AUD/CHF jobs coil, not the EUR/NOK oil grind, not the AUD/SGD dump-no-reclaim, not the NZD/SGD evening star, not the EUR/SGD outside bar, not the GBP/SGD fail-break, not the CAD/SGD engulfing, not the AUD/NOK shooting star, not the CAD/NOK dark-cloud, not the AUD/SEK three-crows, not the CAD/SEK hanging man, not the GBP/PLN harami, not the GBP/CZK marubozu, not the AUD/PLN gravestone, not the GBP/HUF harami-cross tape, and not a live FX desk.",
      whyMarketMoved: "The harami-cross close held and kiwi-forint leaked as the kiwi stayed offered with risk.",
      evidence: "NZD/HUF harami-cross tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "forex-macro",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-macro-cadron-spinning-top",
    title: "CAD/RON prints a spinning top as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "CAD/RON ground higher, then printed a spinning top: a small real body near the middle of the bar with upper and lower wicks of similar length as risk appetite faded. The loonie is the risk side versus the leu in this SAMPLE brief. Thin chatter says the pause means the grind must resume. SAMPLE pair only, not a live FX desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Loonie sold versus the leu. Spinning top. Thin chatter: the pause means the grind must resume.",
    preOhlc: CADRON_PRE,
    postOhlc: withAftermath(CADRON_PRE, [
      bar("+1", 3.6308, 3.6342, 3.6086, 3.6124),
      bar("+2", 3.6124, 3.6162, 3.5868, 3.5906),
      bar("+3", 3.5906, 3.5942, 3.5628, 3.5664),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this pair falling when the loonie is the risk side versus the leu. A spinning top after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar has a small real body near the middle with wicks both ways; this is not a hanging man (that sits near the highs with a long lower wick only) and not a shooting star (that sits near the lows with a long upper wick only). This is not a harami cross: the last bar is not a doji sitting inside the prior body. This is not a gravestone (open and close are not pinned to the lows). This is not the CAD/JPY dump-then-harami: that pattern shows up after a decline, not after a grind. HOLD if the slip already has your size. This is not the CAD/JPY dump-then-harami, not the AUD/CHF jobs coil, not the EUR/NOK oil grind, not the AUD/SGD dump-no-reclaim, not the NZD/SGD evening star, not the EUR/SGD outside bar, not the GBP/SGD fail-break, not the CAD/SGD engulfing, not the AUD/NOK shooting star, not the CAD/NOK dark-cloud, not the AUD/SEK three-crows, not the CAD/SEK hanging man, not the GBP/PLN harami, not the GBP/CZK marubozu, not the AUD/PLN gravestone, not the NZD/HUF harami-cross, not the EUR/RON spinning-top tape, and not a live FX desk.",
      whyMarketMoved: "The spinning-top close held and loonie-leu leaked as the loonie stayed offered with risk.",
      evidence: "CAD/RON spinning-top tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "forex-macro",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-macro-nzdron-long-legged-doji",
    title: "NZD/RON prints a long-legged doji as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "NZD/RON ground higher, then printed a long-legged doji: open and close sit together with long upper and lower wicks of similar length as risk appetite faded. The kiwi is the risk side versus the leu in this SAMPLE brief. Thin chatter says the long-legged pause means the grind must resume. SAMPLE pair only, not a live FX desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Kiwi sold versus the leu. Long-legged doji. Thin chatter: the long-legged pause means the grind must resume.",
    preOhlc: NZDRON_PRE,
    postOhlc: withAftermath(NZDRON_PRE, [
      bar("+1", 3.1288, 3.1364, 3.0986, 3.1042),
      bar("+2", 3.1042, 3.1118, 3.0684, 3.0746),
      bar("+3", 3.0746, 3.0822, 3.0368, 3.0432),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this pair falling when the kiwi is the risk side versus the leu. A long-legged doji after a grind is usually fade-or-wait, not a chase of the pause as a resume. Open and close sit together with long wicks both ways; this is not a spinning top (that has a small real body). This is not a gravestone (open and close are not pinned to the lows with a long upper wick only). This is not a harami cross: the doji is not sitting inside the prior body. This is not a hanging man (no long lower wick only) and not a shooting star (no long upper wick from the lows). This is not the CAD/JPY dump-then-harami: that pattern shows up after a decline, not after a grind. HOLD if the slip already has your size. This is not the CAD/JPY dump-then-harami, not the AUD/CHF jobs coil, not the EUR/NOK oil grind, not the AUD/SGD dump-no-reclaim, not the NZD/SGD evening star, not the EUR/SGD outside bar, not the GBP/SGD fail-break, not the CAD/SGD engulfing, not the AUD/NOK shooting star, not the CAD/NOK dark-cloud, not the AUD/SEK three-crows, not the CAD/SEK hanging man, not the GBP/PLN harami, not the GBP/CZK marubozu, not the AUD/PLN gravestone, not the NZD/HUF harami-cross, not the CAD/RON spinning top, not the EUR/RON spinning-top tape, not the GBP/RON long-legged-doji tape, and not a live FX desk.",
      whyMarketMoved: "The long-legged-doji close held and kiwi-leu leaked as the kiwi stayed offered with risk.",
      evidence: "NZD/RON long-legged-doji tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "forex-macro",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-macro-cadhuf-dragonfly",
    title: "CAD/HUF prints a dragonfly doji as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "CAD/HUF ground higher, then printed a dragonfly doji: open and close sit together at the highs with a long lower wick only as risk appetite faded. The loonie is the risk side versus the forint in this SAMPLE brief. Thin chatter says the dragonfly pause means the grind must resume. SAMPLE pair only, not a live FX desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Loonie sold versus the forint. Dragonfly doji. Thin chatter: the dragonfly pause means the grind must resume.",
    preOhlc: CADHUF_PRE,
    postOhlc: withAftermath(CADHUF_PRE, [
      bar("+1", 268.18, 268.36, 266.48, 266.72),
      bar("+2", 266.72, 266.94, 264.86, 265.12),
      bar("+3", 265.12, 265.34, 263.18, 263.46),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this pair falling when the loonie is the risk side versus the forint. A dragonfly doji after a grind is usually fade-or-wait, not a chase of the pause as a resume. Open and close sit together at the highs with a long lower wick; this is not a hanging man (that has a small real body near the highs). This is not a gravestone (open and close are not pinned to the lows with a long upper wick). This is not a long-legged doji (no long upper wick). This is not a spinning top (no small real body in the middle). This is not a harami cross: the doji is not sitting inside the prior body. This is not the CAD/JPY dump-then-harami: that pattern shows up after a decline, not after a grind. HOLD if the slip already has your size. This is not the CAD/JPY dump-then-harami, not the AUD/CHF jobs coil, not the EUR/NOK oil grind, not the AUD/SGD dump-no-reclaim, not the NZD/SGD evening star, not the EUR/SGD outside bar, not the GBP/SGD fail-break, not the CAD/SGD engulfing, not the AUD/NOK shooting star, not the CAD/NOK dark-cloud, not the AUD/SEK three-crows, not the CAD/SEK hanging man, not the GBP/PLN harami, not the GBP/CZK marubozu, not the AUD/PLN gravestone, not the NZD/HUF harami-cross, not the CAD/RON spinning top, not the NZD/RON long-legged doji, not the AUD/RON dragonfly tape, not the EUR/HUF gravestone tape, not the GBP/HUF harami-cross tape, and not a live FX desk.",
      whyMarketMoved: "The dragonfly-doji close held and loonie-forint leaked as the loonie stayed offered with risk.",
      evidence: "CAD/HUF dragonfly-doji tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "forex-macro",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-macro-nzdpln-matching-high",
    title: "NZD/PLN prints a matching high as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "NZD/PLN ground higher into a tall green bar, then printed a small green bar that tags nearly the same high and closes weak under it as risk appetite faded. The kiwi is the risk side versus the zloty in this SAMPLE brief. Thin chatter says the matching-high pause means the grind must resume. SAMPLE pair only, not a live FX desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Kiwi sold versus the zloty. Matching high. Thin chatter: the matching-high pause means the grind must resume.",
    preOhlc: NZDPLN_PRE,
    postOhlc: withAftermath(NZDPLN_PRE, [
      bar("+1", 2.3764, 2.3786, 2.3518, 2.3542),
      bar("+2", 2.3542, 2.3568, 2.3264, 2.3296),
      bar("+3", 2.3296, 2.3324, 2.2986, 2.3028),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this pair falling when the kiwi is the risk side versus the zloty. A matching high after a grind is usually fade-or-wait, not a chase of the pause as a resume. Both bars are green and share nearly the same high; the last close sits weak under that high. This is not a tweezer: a tweezer tags the high with opposite-color bodies. This is not a shooting star (the last body is not sitting near the lows with a long upper wick only). This is not a dragonfly (open and close are not pinned to the highs with a long lower wick). This is not a harami: the last high pokes to the prior high, not a small body fully inside the prior body. This is not the CAD/JPY dump-then-harami: that pattern shows up after a decline, not after a grind. HOLD if the slip already has your size. This is not the CAD/JPY dump-then-harami, not the AUD/CHF jobs coil, not the EUR/NOK oil grind, not the AUD/SGD dump-no-reclaim, not the NZD/SGD evening star, not the EUR/SGD outside bar, not the GBP/SGD fail-break, not the CAD/SGD engulfing, not the AUD/NOK shooting star, not the CAD/NOK dark-cloud, not the AUD/SEK three-crows, not the CAD/SEK hanging man, not the GBP/PLN harami, not the GBP/CZK marubozu, not the AUD/PLN gravestone, not the NZD/HUF harami-cross, not the CAD/RON spinning top, not the NZD/RON long-legged doji, not the CAD/HUF dragonfly, not the AUD/HUF matching-high tape, not the EUR/PLN harami tape, and not a live FX desk.",
      whyMarketMoved: "The matching-high close held and kiwi-zloty leaked as the kiwi stayed offered with risk.",
      evidence: "NZD/PLN matching-high tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "forex-macro",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-macro-cadczk-belt-hold",
    title: "CAD/CZK prints a bearish belt hold as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "CAD/CZK ground higher, then printed a bearish belt hold: the last bar opens at its high with no upper wick and sells off, closing weak with a real body and a lower wick as risk appetite faded. The loonie is the risk side versus the koruna in this SAMPLE brief, not a euro-peg story. Thin chatter says the belt-hold pause means the grind must resume. SAMPLE pair only, not a live FX desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Loonie sold versus the koruna. Bearish belt hold. Thin chatter: the belt-hold pause means the grind must resume.",
    preOhlc: CADCZK_PRE,
    postOhlc: withAftermath(CADCZK_PRE, [
      bar("+1", 22.018, 22.068, 21.548, 21.598),
      bar("+2", 21.598, 21.648, 21.086, 21.136),
      bar("+3", 21.136, 21.186, 20.486, 20.548),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this pair falling when the loonie is the risk side versus the koruna. A bearish belt hold after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar opens at the high with no upper wick and sells off into a real body; a lower wick is allowed. This is not a marubozu: a marubozu has tiny wicks at both ends and closes near the low. This is not a matching high: both of those bars are green and share nearly the same high. This is not a hanging man (the body is not a small real body near the highs with a long lower wick). This is not a shooting star (there is no long upper wick from the lows). This is not the CAD/JPY dump-then-harami: that pattern shows up after a decline, not after a grind. HOLD if the slip already has your size. This is not the CAD/JPY dump-then-harami, not the AUD/CHF jobs coil, not the EUR/NOK oil grind, not the AUD/SGD dump-no-reclaim, not the NZD/SGD evening star, not the EUR/SGD outside bar, not the GBP/SGD fail-break, not the CAD/SGD engulfing, not the AUD/NOK shooting star, not the CAD/NOK dark-cloud, not the AUD/SEK three-crows, not the CAD/SEK hanging man, not the GBP/PLN harami, not the GBP/CZK marubozu, not the AUD/PLN gravestone, not the NZD/HUF harami-cross, not the CAD/RON spinning top, not the NZD/RON long-legged doji, not the CAD/HUF dragonfly, not the NZD/PLN matching high, not the AUD/CZK tape belt hold, and not a live FX desk.",
      whyMarketMoved: "The belt-hold close held and loonie-koruna leaked as the loonie stayed offered with risk.",
      evidence: "CAD/CZK bearish-belt-hold tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "forex-macro",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-macro-cadpln-separating-lines",
    title: "CAD/PLN prints bearish separating lines as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "CAD/PLN ground higher into a tall green bar, then printed a long red bar that opens at nearly the same open as that green bar and sells off as risk appetite faded. The loonie is the risk side versus the zloty in this SAMPLE brief, not a euro-peg story. Thin chatter says the separating-lines pause means the grind must resume. SAMPLE pair only, not a live FX desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Loonie sold versus the zloty. Bearish separating lines. Thin chatter: the separating-lines pause means the grind must resume.",
    preOhlc: CADPLN_PRE,
    postOhlc: withAftermath(CADPLN_PRE, [
      bar("+1", 2.7186, 2.7348, 2.6486, 2.6628),
      bar("+2", 2.6628, 2.6784, 2.5848, 2.5986),
      bar("+3", 2.5986, 2.6148, 2.5086, 2.5248),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this pair falling when the loonie is the risk side versus the zloty. Bearish separating lines after a grind are usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens at nearly the same open as the prior tall green and sells off. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick, usually after the prior close, not back at the prior open. This is not a marubozu: a marubozu has tiny wicks at both ends and closes near the low. This is not a matching high: both of those bars are green and share nearly the same high. This is not a hanging man (the body is not a small real body near the highs with a long lower wick). This is not a shooting star (there is no long upper wick from the lows). This is not the CAD/JPY dump-then-harami: that pattern shows up after a decline, not after a grind. HOLD if the slip already has your size. This is not the CAD/JPY dump-then-harami, not the AUD/CHF jobs coil, not the EUR/NOK oil grind, not the AUD/SGD dump-no-reclaim, not the NZD/SGD evening star, not the EUR/SGD outside bar, not the GBP/SGD fail-break, not the CAD/SGD engulfing, not the AUD/NOK shooting star, not the CAD/NOK dark-cloud, not the AUD/SEK three-crows, not the CAD/SEK hanging man, not the GBP/PLN harami, not the GBP/CZK marubozu, not the AUD/PLN gravestone, not the NZD/HUF harami-cross, not the CAD/RON spinning top, not the NZD/RON long-legged doji, not the CAD/HUF dragonfly, not the NZD/PLN matching high, not the CAD/CZK belt hold, not the NZD/CZK tape separating lines, not the AUD/CZK tape belt hold, and not a live FX desk.",
      whyMarketMoved: "The separating-lines close held and loonie-zloty leaked as the loonie stayed offered with risk.",
      evidence: "CAD/PLN bearish-separating-lines tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "forex-macro",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-macro-auddkk-on-neck",
    title: "AUD/DKK prints a bearish on-neck as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "AUD/DKK ground higher into a tall green bar, then printed a long red bar that opens above that green close and closes at nearly the prior low as risk appetite faded. The Aussie is the risk side versus the krone in this SAMPLE brief, not an ERM2 or euro-peg story. Thin chatter says the on-neck pause means the grind must resume. SAMPLE pair only, not a live FX desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Aussie sold versus the krone. Bearish on-neck. Thin chatter: the on-neck pause means the grind must resume.",
    preOhlc: AUDDKK_PRE,
    postOhlc: withAftermath(AUDDKK_PRE, [
      bar("+1", 4.4128, 4.4286, 4.3486, 4.3628),
      bar("+2", 4.3628, 4.3786, 4.2886, 4.3048),
      bar("+3", 4.3048, 4.3218, 4.2086, 4.2248),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this pair falling when the Aussie is the risk side versus the krone. A bearish on-neck after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens above the prior close and closes at nearly the prior low. This is not separating lines: those share nearly the same open as the prior tall green. This is not a dark-cloud: a dark-cloud closes in the lower half of the prior body, still above that prior open, not at the prior low. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick. This is not a matching high: both of those bars are green and share nearly the same high. This is not a hanging man (the body is not a small real body near the highs with a long lower wick). This is not the CAD/JPY dump-then-harami: that pattern shows up after a decline, not after a grind. This is not euro-krone: EUR/DKK is the ERM2 tape, not this Aussie-krone risk-off. HOLD if the slip already has your size. This is not the CAD/JPY dump-then-harami, not the AUD/CHF jobs coil, not the EUR/NOK oil grind, not the AUD/SGD dump-no-reclaim, not the NZD/SGD evening star, not the EUR/SGD outside bar, not the GBP/SGD fail-break, not the CAD/SGD engulfing, not the AUD/NOK shooting star, not the CAD/NOK dark-cloud, not the AUD/SEK three-crows, not the CAD/SEK hanging man, not the GBP/PLN harami, not the GBP/CZK marubozu, not the AUD/PLN gravestone, not the NZD/HUF harami-cross, not the CAD/RON spinning top, not the NZD/RON long-legged doji, not the CAD/HUF dragonfly, not the NZD/PLN matching high, not the CAD/CZK belt hold, not the CAD/PLN separating lines, not the EUR/DKK tape on-neck, and not a live FX desk.",
      whyMarketMoved: "The on-neck close held and Aussie-krone leaked as the Aussie stayed offered with risk.",
      evidence: "AUD/DKK bearish-on-neck tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "forex-macro",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-macro-nzddkk-in-neck",
    title: "NZD/DKK prints a bearish in-neck as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "NZD/DKK ground higher into a tall green bar, then printed a long red bar that opens above that green close and closes at nearly that same close, not the prior low, as risk appetite faded. The kiwi is the risk side versus the krone in this SAMPLE brief, not an ERM2 or euro-peg story. Thin chatter says the in-neck pause means the grind must resume. SAMPLE pair only, not a live FX desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Kiwi sold versus the krone. Bearish in-neck. Thin chatter: the in-neck pause means the grind must resume.",
    preOhlc: NZDDKK_PRE,
    postOhlc: withAftermath(NZDDKK_PRE, [
      bar("+1", 3.8328, 3.8486, 3.7286, 3.7486),
      bar("+2", 3.7486, 3.7684, 3.6186, 3.6386),
      bar("+3", 3.6386, 3.6584, 3.4886, 3.5086),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this pair falling when the kiwi is the risk side versus the krone. A bearish in-neck after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens above the prior close and closes at nearly that same close, not the prior low. This is not on-neck: on-neck closes at nearly the prior low. This is not a dark-cloud: a dark-cloud closes in the lower half of the prior body, still above that prior open, not back at the prior close. This is not separating lines: those share nearly the same open as the prior tall green. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick. This is not a matching high: both of those bars are green and share nearly the same high. This is not the CAD/JPY dump-then-harami: that pattern shows up after a decline, not after a grind. This is not euro-krone: EUR/DKK is the ERM2 on-neck tape, not this kiwi-krone risk-off. This is not Aussie-krone: AUD/DKK is the on-neck macro near 4.55. This is not sterling-krone: GBP/DKK is the in-neck tape near 8.62. HOLD if the slip already has your size. This is not the CAD/JPY dump-then-harami, not the AUD/CHF jobs coil, not the EUR/NOK oil grind, not the AUD/SGD dump-no-reclaim, not the NZD/SGD evening star, not the EUR/SGD outside bar, not the GBP/SGD fail-break, not the CAD/SGD engulfing, not the AUD/NOK shooting star, not the CAD/NOK dark-cloud, not the AUD/SEK three-crows, not the CAD/SEK hanging man, not the GBP/PLN harami, not the GBP/CZK marubozu, not the AUD/PLN gravestone, not the NZD/HUF harami-cross, not the CAD/RON spinning top, not the NZD/RON long-legged doji, not the CAD/HUF dragonfly, not the NZD/PLN matching high, not the CAD/CZK belt hold, not the CAD/PLN separating lines, not the AUD/DKK on-neck, not the EUR/DKK tape on-neck, not the GBP/DKK tape in-neck, and not a live FX desk.",
      whyMarketMoved: "The in-neck close held and kiwi-krone leaked as the kiwi stayed offered with risk.",
      evidence: "NZD/DKK bearish-in-neck tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "forex-macro",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-macro-caddkk-thrusting",
    title: "CAD/DKK prints a bearish thrusting line as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "CAD/DKK ground higher into a tall green bar, then printed a long red bar that opens above that green close and closes into that prior body, still above the midpoint, as risk appetite faded. The loonie is the risk side versus the krone in this SAMPLE brief, not an ERM2 or euro-peg story. Thin chatter says the thrusting pause means the grind must resume. SAMPLE pair only, not a live FX desk. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Loonie sold versus the krone. Bearish thrusting line. Thin chatter: the thrusting pause means the grind must resume.",
    preOhlc: CADDKK_PRE,
    postOhlc: withAftermath(CADDKK_PRE, [
      bar("+1", 4.9186, 4.9384, 4.8186, 4.8386),
      bar("+2", 4.8386, 4.8584, 4.7286, 4.7486),
      bar("+3", 4.7486, 4.7684, 4.6186, 4.6386),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this pair falling when the loonie is the risk side versus the krone. A bearish thrusting line after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens above the prior close and closes into that prior body, still above the midpoint. This is not in-neck: in-neck closes at nearly the prior close. This is not on-neck: on-neck closes at nearly the prior low. This is not a dark-cloud: a dark-cloud closes in the lower half of the prior body, still above that prior open. This is not separating lines: those share nearly the same open as the prior tall green. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick. This is not a matching high: both of those bars are green and share nearly the same high. This is not the CAD/JPY dump-then-harami: that pattern shows up after a decline, not after a grind. This is not euro-krone: EUR/DKK is the ERM2 on-neck tape, not this loonie-krone risk-off. This is not Aussie-krone: AUD/DKK is the on-neck macro near 4.55. This is not kiwi-krone: NZD/DKK is the in-neck macro near 3.83. This is not sterling-zloty: GBP/PLN is the harami near 5.086, not this thrusting line. HOLD if the slip already has your size. This is not the CAD/JPY dump-then-harami, not the AUD/CHF jobs coil, not the EUR/NOK oil grind, not the AUD/SGD dump-no-reclaim, not the NZD/SGD evening star, not the EUR/SGD outside bar, not the GBP/SGD fail-break, not the CAD/SGD engulfing, not the AUD/NOK shooting star, not the CAD/NOK dark-cloud, not the AUD/SEK three-crows, not the CAD/SEK hanging man, not the GBP/PLN harami, not the GBP/CZK marubozu, not the AUD/PLN gravestone, not the NZD/HUF harami-cross, not the CAD/RON spinning top, not the NZD/RON long-legged doji, not the CAD/HUF dragonfly, not the NZD/PLN matching high, not the CAD/CZK belt hold, not the CAD/PLN separating lines, not the AUD/DKK on-neck, not the NZD/DKK in-neck, not the EUR/DKK tape on-neck, not the GBP/DKK tape in-neck, not the CHF/DKK tape thrusting, and not a live FX desk.",
      whyMarketMoved: "The thrusting close held and loonie-krone leaked as the loonie stayed offered with risk.",
      evidence: "CAD/DKK bearish-thrusting tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "forex-macro",
    difficulty: "beginner",
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
  {
    id: "case-crypto-int-pred-head-shoulders",
    title: "Prediction-market token head-and-shoulders into a venue-fee scare already in the highs",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE prediction-market token printed a left shoulder, a higher head, then a weaker right shoulder on a venue-fee scare. You have Indicators. Thin chatter says the right shoulder must make a new high. No protocol change. Ask whether the scare is already in the head. Practice data only — not a live exchange.",
    newsHeadline:
      "Venue-fee scare already ran. Thin chatter: right shoulder must break the head. No protocol change.",
    preOhlc: PRED_PRE,
    postOhlc: withAftermath(PRED_PRE, [
      bar("+1", 2.42, 2.44, 2.26, 2.28),
      bar("+2", 2.28, 2.3, 2.14, 2.16),
      bar("+3", 2.16, 2.18, 2.02, 2.04),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Intermediate work is naming what is already in the price. A weaker right shoulder after a higher head is late-chase, not a new path. Fade or wait; HOLD if the slip already has your size. This is not leftover protocol math, not the insurance double-top, not the naming-service three-push, not the CDN falling wedge, and not a live exchange.",
      whyMarketMoved: "The right shoulder failed and the prediction token leaked through the neckline once the fee-scare chase stalled.",
      evidence: "Prediction-market head-and-shoulders tape plus a scare-already-ran headline.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "intermediate",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-int-royl-head-shoulders",
    title: "Royalty token head-and-shoulders into a catalog-license scare already in the highs",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE music-royalty token printed a left shoulder, a higher head, then a weaker right shoulder on a catalog-license scare. You have Indicators. Thin chatter says the right shoulder must make a new high. No protocol change. Ask whether the scare is already in the head. Practice data only — not a live exchange.",
    newsHeadline:
      "License scare already ran. Thin chatter: royalty right shoulder must break the head. No protocol change.",
    preOhlc: ROYL_PRE,
    postOhlc: withAftermath(ROYL_PRE, [
      bar("+1", 0.74, 0.75, 0.66, 0.67),
      bar("+2", 0.67, 0.68, 0.59, 0.6),
      bar("+3", 0.6, 0.61, 0.52, 0.53),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Intermediate work is naming what is already in the price. A weaker right shoulder after a higher head is late-chase, not a new path. Fade or wait; HOLD if the slip already has your size. This is not leftover protocol math, not the prediction-market H&S, not the NFT round-top, not the gaming inside bar, and not a live exchange.",
      whyMarketMoved: "The right shoulder failed and the royalty token leaked through the neckline once the license-scare chase stalled.",
      evidence: "Royalty-token head-and-shoulders tape plus a scare-already-ran headline.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "intermediate",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-tape-orbt-tweezer",
    title: "Orbital-data token tweezer top into a launch-window scare already in the highs",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE orbital-data token rallied into two bars that share the same high after a launch-window weather scare already ran. Thin chatter says the tweezer must break. No protocol change. Ask whether the scare is already in those matching highs. Practice data only — not a live exchange.",
    newsHeadline:
      "Launch-window scare already ran. Thin chatter: orbital tweezer must break the match. No protocol change.",
    preOhlc: ORBT_PRE,
    postOhlc: withAftermath(ORBT_PRE, [
      bar("+1", 6.64, 6.66, 6.48, 6.5),
      bar("+2", 6.5, 6.52, 6.34, 6.36),
      bar("+3", 6.36, 6.38, 6.2, 6.22),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Two matching highs after a scare already ran is late-chase, not a new path. Fade or wait; HOLD if the slip already has your size. This is not leftover protocol math, not the royalty H&S, not the prediction-market H&S, not the CDN falling wedge, and not a live exchange.",
      whyMarketMoved: "The matched high held and the orbital-data token leaked once the launch-window chase stalled.",
      evidence: "Orbital-data tweezer-top tape plus a scare-already-ran headline. Practice only.",
    },
    allowShort: false,
    packId: "crypto-tape",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-tape-mesh-evening-star",
    title: "Mesh-network token evening star into an official treasury note",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE mesh-network token rallied into a long green bar, a small star at the highs, then a red close back into that body. Then a scheduled foundation treasury note says a token sale is larger than hoped. Official text, not chatter and not a protocol change. Practice data only — not a live exchange.",
    newsHeadline:
      "Prepared treasury note: scheduled token sale larger than hoped. Official text, not chatter.",
    preOhlc: MESH_PRE,
    postOhlc: withAftermath(MESH_PRE, [
      bar("+1", 16.18, 16.22, 15.84, 15.88),
      bar("+2", 15.88, 15.92, 15.54, 15.58),
      bar("+3", 15.58, 15.62, 15.24, 15.28),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Treat an official treasury note as a headline with a named author. A larger scheduled sale can weigh on this token. The evening star is already a pause, not a new demand path. HOLD if the slip already has your size. This is not leftover protocol math, not the orbital tweezer, not the carbon-credit harami, not the L2 unlock-plus-dump combined brief, and not a live exchange.",
      whyMarketMoved: "The red close held and the mesh-network token leaked once the larger-sale note printed.",
      evidence: "Mesh-network evening-star tape plus a prepared treasury headline. Practice only.",
    },
    allowShort: false,
    packId: "crypto-tape",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-tape-cust-open-drive",
    title: "Custody token opens with a wide drive after an official foundation statement",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE custody token sat quiet, then opened with a wide drive higher after the foundation published a prepared statement: it will not unlock treasury as soon as markets hoped. Official text, not chatter and not a protocol change. Practice data only — not a live exchange.",
    newsHeadline:
      "Prepared statement: will not unlock treasury as soon as hoped. Official foundation text, not chatter.",
    preOhlc: CUST_PRE,
    postOhlc: withAftermath(CUST_PRE, [
      bar("+1", 28.32, 28.74, 28.24, 28.62),
      bar("+2", 28.62, 28.98, 28.54, 28.86),
      bar("+3", 28.86, 29.18, 28.78, 29.08),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Treat an official statement as a headline with a named author. A delayed treasury unlock can bid this token. The wide opening drive is often the story, not a fade. HOLD if the drive already has your size. This is not leftover protocol math, not the orbital tweezer, not the mesh-network evening star, not the restaking TVL opening drive, not the stablecoin peg wobble, and not a live exchange.",
      whyMarketMoved: "The opening drive held and the custody token kept grinding as the delayed-unlock statement stayed in the tape.",
      evidence: "Custody-token opening-drive tape plus a prepared foundation headline. Practice only.",
    },
    allowShort: false,
    packId: "crypto-tape",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-tape-band-dump-no-reclaim",
    title: "Bandwidth token dumps on a spectrum scare, no reclaim",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE bandwidth-marketplace token already dumped after a spectrum-lease scare ran through the tape. Thin chatter says the first bounce must reclaim. The bounce has not shown up. No protocol change. Ask whether the scare is already in the dump. Practice data only — not a live exchange.",
    newsHeadline:
      "Spectrum scare already ran. Thin chatter: bandwidth dump must reclaim. No bounce yet. No protocol change.",
    preOhlc: BAND_PRE,
    postOhlc: withAftermath(BAND_PRE, [
      bar("+1", 38.18, 38.32, 37.48, 37.54),
      bar("+2", 37.54, 37.68, 36.84, 36.9),
      bar("+3", 36.9, 37.04, 36.22, 36.28),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A dump with no reclaim is late-chase, not a new bounce path. Fade or wait; HOLD if the slip already has your size. This is not leftover protocol math, not the orbital tweezer, not the mesh-network evening star, not the custody opening drive, not the DePIN storage dump, and not a live exchange.",
      whyMarketMoved: "The dump continued; no bounce showed up after the spectrum scare.",
      evidence: "Bandwidth-token dump-no-reclaim tape plus a scare-already-ran headline. Practice only.",
    },
    allowShort: false,
    packId: "crypto-tape",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-tape-relay-inside-bar",
    title: "MEV-relay token inside bar into an official operator note still ahead",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE MEV-relay token printed a wide bar, then smaller bars fully inside that range. A scheduled relay-operator attestation is still ahead. Thin chatter says the inside must break up. No protocol change. Practice data only — not a live exchange. Chase a break that has not printed, or wait?",
    newsHeadline:
      "Inside bars on the relay token. Official operator attestation still ahead. Thin chatter: must break up. No protocol change.",
    preOhlc: RELAY_PRE,
    postOhlc: withAftermath(RELAY_PRE, [
      bar("+1", 3.34, 3.42, 3.3, 3.32),
      bar("+2", 3.32, 3.4, 3.3, 3.31),
      bar("+3", 3.31, 3.38, 3.29, 3.3),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["buy", "sell"],
    debrief: {
      process:
        "An inside bar into an official statement still ahead is a wait. HOLD is the process answer until a side actually breaks. BUY or SELL is only partial if you already had a thesis and sized small. This is not leftover protocol math, not the orbital tweezer, not the mesh-network evening star, not the custody opening drive, not the bandwidth dump, not the gaming-token season-drop inside bar, and not a live exchange.",
      whyMarketMoved: "The mother-bar range held; no clean break through the attestation window.",
      evidence: "MEV-relay inside-bar tape plus an operator-note-still-ahead headline. Practice only.",
    },
    allowShort: false,
    packId: "crypto-tape",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-tape-farm-outside-bar",
    title: "Yield-farm token prints an outside bar that closes weak",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE yield-farm token printed a wide bar that took both sides, then closed weak. Thin chatter says the upper wick must hold. No protocol change. Practice data only — not a live exchange. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Outside bar on the farm token. Thin chatter: wick must hold. No protocol change.",
    preOhlc: FARM_PRE,
    postOhlc: withAftermath(FARM_PRE, [
      bar("+1", 11.08, 11.12, 10.88, 10.92),
      bar("+2", 10.92, 10.96, 10.72, 10.76),
      bar("+3", 10.76, 10.8, 10.56, 10.6),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "An outside bar that closes weak is usually fade-or-wait, not a chase of the upper wick. HOLD if the slip already has your size. This is not leftover protocol math, not the orbital tweezer, not the mesh-network evening star, not the custody opening drive, not the bandwidth dump, not the MEV-relay inside bar, not the liquidity-pool evening star, not the AI-agent outside bar, and not a live exchange.",
      whyMarketMoved: "The weak close continued lower; the upper wick did not hold.",
      evidence: "Yield-farm outside-bar tape plus thin wick-must-hold chatter. Practice only.",
    },
    allowShort: false,
    packId: "crypto-tape",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-tape-blob-fail-break",
    title: "Data-availability blob token pokes a range, then fails",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE data-availability blob token poked above a range, then slipped back. Thin chatter says the break must hold. No protocol change. Practice data only — not a live exchange. Chase the first green poke, wait, or take risk off?",
    newsHeadline:
      "Thin chatter: blob-token range break must hold. No protocol change.",
    preOhlc: BLOB_PRE,
    postOhlc: withAftermath(BLOB_PRE, [
      bar("+1", 2.146, 2.158, 2.118, 2.126),
      bar("+2", 2.126, 2.138, 2.098, 2.106),
      bar("+3", 2.106, 2.118, 2.078, 2.086),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A failed poke is usually fade-or-wait, not a chase. Do not treat the first green bar as a breakout. HOLD if the slip already has your size. This is not leftover protocol math, not the orbital tweezer, not the mesh-network evening star, not the custody opening drive, not the bandwidth dump, not the MEV-relay inside bar, not the yield-farm outside bar, not the privacy-coin fail-break, and not a live exchange.",
      whyMarketMoved: "The poke failed and the blob token slipped back through the range.",
      evidence: "Data-availability failed-breakout tape plus thin range-break chatter. Practice only.",
    },
    allowShort: false,
    packId: "crypto-tape",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-tape-vault-engulf",
    title: "Vault token prints a bearish engulfing after a small green bar",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE vault token printed a small green bar, then a red bar whose body swallowed that green body. Thin chatter says the first green must resume. No protocol change. Practice data only — not a live exchange. Chase the swallowed green, wait, or take risk off?",
    newsHeadline:
      "Bearish engulfing on the vault token. Thin chatter: first green must resume. No protocol change.",
    preOhlc: VAULT_PRE,
    postOhlc: withAftermath(VAULT_PRE, [
      bar("+1", 9.112, 9.124, 9.076, 9.088),
      bar("+2", 9.088, 9.1, 9.052, 9.064),
      bar("+3", 9.064, 9.076, 9.028, 9.04),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish engulfing is usually fade-or-wait, not a chase of the swallowed green bar. This is not an outside bar: the red high stayed inside the prior high. HOLD if the slip already has your size. This is not leftover protocol math, not the orbital tweezer, not the mesh-network evening star, not the custody opening drive, not the bandwidth dump, not the MEV-relay inside bar, not the yield-farm outside bar, not the blob-token fail-break, not the sequencer-token fail-break, not the privacy-coin fail-break, not the AI-agent outside bar, and not a live exchange.",
      whyMarketMoved: "The engulfing close held and the vault token leaked; the small green bar did not resume.",
      evidence: "Vault-token bearish-engulfing tape plus thin first-green-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "crypto-tape",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-tape-gate-shooting-star",
    title: "Gate token prints a shooting star after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE gate token ground higher, then printed a shooting star: a small body near the lows with a long upper wick. Gate tokens are the cross-chain beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the wick must continue. Practice data only — not a live exchange. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Shooting star on the gate token. Thin chatter: upper wick must continue. No protocol change.",
    preOhlc: GATE_PRE,
    postOhlc: withAftermath(GATE_PRE, [
      bar("+1", 7.482, 7.49, 7.448, 7.454),
      bar("+2", 7.454, 7.462, 7.42, 7.426),
      bar("+3", 7.426, 7.434, 7.392, 7.398),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A shooting star after a grind is usually fade-or-wait, not a chase of the upper wick. This is not an outside bar: the low stayed inside the prior low. This is not an evening star (that is three bars) and not a bearish engulfing (the body did not swallow the prior body). HOLD if the slip already has your size. This is not leftover protocol math, not the orbital tweezer, not the mesh-network evening star, not the custody opening drive, not the bandwidth dump, not the MEV-relay inside bar, not the yield-farm outside bar, not the blob-token fail-break, not the vault-token engulfing, not the sequencer-token fail-break, not the privacy-coin fail-break, not the GBP/NOK shooting star, and not a live exchange.",
      whyMarketMoved: "The shooting-star close held and the gate token leaked; the upper wick did not continue.",
      evidence: "Gate-token shooting-star tape plus thin wick-must-continue chatter. Practice only.",
    },
    allowShort: false,
    packId: "crypto-tape",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-tape-dock-dark-cloud",
    title: "Dock token prints a dark-cloud cover after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE dock token printed a green bar, then a red bar that opened above that close and finished in the lower half of that body without swallowing it. Dock tokens are the inbound-bridge beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the gap-up open must continue. Practice data only — not a live exchange. Chase the gap-up, wait, or take risk off?",
    newsHeadline:
      "Dark-cloud cover on the dock token. Thin chatter: gap-up open must continue. No protocol change.",
    preOhlc: DOCK_PRE,
    postOhlc: withAftermath(DOCK_PRE, [
      bar("+1", 11.374, 11.382, 11.338, 11.344),
      bar("+2", 11.344, 11.352, 11.308, 11.314),
      bar("+3", 11.314, 11.322, 11.278, 11.284),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A dark-cloud cover is usually fade-or-wait, not a chase of the gap-up open. The red close is inside the prior body, so this is not a bearish engulfing. This is not an outside bar: the low stayed inside the prior low. This is not a shooting star (that is one long upper wick) and not an evening star (that is three bars). HOLD if the slip already has your size. This is not leftover protocol math, not the orbital tweezer, not the mesh-network evening star, not the custody opening drive, not the bandwidth dump, not the MEV-relay inside bar, not the yield-farm outside bar, not the blob-token fail-break, not the vault-token engulfing, not the gate-token shooting star, not the kiwi-futures dark-cloud tape, and not a live exchange.",
      whyMarketMoved: "The dark-cloud close held and the dock token leaked; the gap-up open did not continue.",
      evidence: "Dock-token dark-cloud tape plus thin gap-up-must-continue chatter. Practice only.",
    },
    allowShort: false,
    packId: "crypto-tape",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-tape-node-three-crows",
    title: "Node token prints three black crows after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE node token ground higher, then printed three falling red bodies in a row. Node tokens are the validator-ops beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the first red is a dip to buy. Practice data only — not a live exchange. Chase the dip, wait, or take risk off?",
    newsHeadline:
      "Three black crows on the node token. Thin chatter: first red is a dip to buy. No protocol change.",
    preOhlc: NODE_PRE,
    postOhlc: withAftermath(NODE_PRE, [
      bar("+1", 4.126, 4.134, 4.088, 4.096),
      bar("+2", 4.096, 4.104, 4.058, 4.066),
      bar("+3", 4.066, 4.074, 4.028, 4.036),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Three black crows after a grind are usually fade-or-wait, not a chase of the first red as a dip. This is not one bearish engulfing bar: three similar red bodies stepped lower. This is not an evening star (that is a small middle bar) and not a dark-cloud cover (that is two bars). HOLD if the slip already has your size. This is not leftover protocol math, not the orbital tweezer, not the mesh-network evening star, not the custody opening drive, not the bandwidth dump, not the MEV-relay inside bar, not the yield-farm outside bar, not the blob-token fail-break, not the vault-token engulfing, not the gate-token shooting star, not the dock-token dark-cloud, not the real-futures three-crows tape, and not a live exchange.",
      whyMarketMoved: "The third crow held and the node token leaked; the first red was not a dip to buy.",
      evidence: "Node-token three-black-crows tape plus thin dip-to-buy chatter. Practice only.",
    },
    allowShort: false,
    packId: "crypto-tape",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-tape-slot-hanging-man",
    title: "Slot token prints a hanging man after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE slot token ground higher, then printed a hanging man: a small body near the highs with a long lower wick. Slot tokens are the auction-slot beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the lower wick must hold. Practice data only — not a live exchange. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Hanging man on the slot token. Thin chatter: lower wick must hold. No protocol change.",
    preOhlc: SLOT_PRE,
    postOhlc: withAftermath(SLOT_PRE, [
      bar("+1", 15.386, 15.398, 15.268, 15.282),
      bar("+2", 15.282, 15.294, 15.164, 15.178),
      bar("+3", 15.178, 15.19, 15.06, 15.074),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A hanging man after a grind is usually fade-or-wait, not a chase of the lower wick as a dip. This is not a shooting star: that is a long upper wick. This is not a hammer: a hammer shows up after a decline, not after a grind. This is not a doji and not three black crows. This is not an outside bar: the high stayed inside the prior high. HOLD if the slip already has your size. This is not leftover protocol math, not the orbital tweezer, not the mesh-network evening star, not the custody opening drive, not the bandwidth dump, not the MEV-relay inside bar, not the yield-farm outside bar, not the blob-token fail-break, not the vault-token engulfing, not the gate-token shooting star, not the dock-token dark-cloud, not the node-token three-crows, not the Hong Kong dollar hanging-man tape, and not a live exchange.",
      whyMarketMoved: "The hanging-man close held and the slot token leaked; the lower wick did not hold.",
      evidence: "Slot-token hanging-man tape plus thin lower-wick-must-hold chatter. Practice only.",
    },
    allowShort: false,
    packId: "crypto-tape",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-tape-epoch-harami",
    title: "Epoch token prints a bearish harami after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE epoch token ground higher into a tall green bar, then printed a small body fully inside that green body. Epoch tokens are the epoch-boundary beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the small inside body means the grind must resume. Practice data only — not a live exchange. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Bearish harami on the epoch token. Thin chatter: small inside body means the grind must resume. No protocol change.",
    preOhlc: EPOCH_PRE,
    postOhlc: withAftermath(EPOCH_PRE, [
      bar("+1", 22.832, 22.848, 22.768, 22.782),
      bar("+2", 22.782, 22.798, 22.708, 22.722),
      bar("+3", 22.722, 22.738, 22.648, 22.662),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish harami after a grind is usually fade-or-wait, not a chase of the small inside body as a resume. The small body sits inside the prior body; this is not a bearish engulfing. This is not a hanging man (no long lower wick) and not a shooting star (no long upper wick). This is not the MEV-relay inside-bar-still-ahead HOLD: there is no official operator note still ahead, and the process here is fade-or-wait, not wait-for-the-print. HOLD if the slip already has your size. This is not leftover protocol math, not the orbital tweezer, not the mesh-network evening star, not the custody opening drive, not the bandwidth dump, not the MEV-relay inside bar, not the yield-farm outside bar, not the blob-token fail-break, not the vault-token engulfing, not the gate-token shooting star, not the dock-token dark-cloud, not the node-token three-crows, not the slot-token hanging man, not the EUR/PLN harami tape, not the ruble-futures harami tape, and not a live exchange.",
      whyMarketMoved: "The harami close held and the epoch token leaked; the small inside body was not a resume of the grind.",
      evidence: "Epoch-token bearish-harami tape plus thin grind-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "crypto-tape",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-tape-nonce-marubozu",
    title: "Nonce token prints a bearish marubozu after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE nonce token ground higher, then printed a long red bar that opened near its high and closed near its low, with almost no wicks. Nonce tokens are the mempool-nonce beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the long red close must bounce. Practice data only — not a live exchange. Chase the red as a dip, wait, or take risk off?",
    newsHeadline:
      "Bearish marubozu on the nonce token. Thin chatter: long red close must bounce. No protocol change.",
    preOhlc: NONCE_PRE,
    postOhlc: withAftermath(NONCE_PRE, [
      bar("+1", 1.826, 1.838, 1.768, 1.778),
      bar("+2", 1.778, 1.79, 1.718, 1.728),
      bar("+3", 1.728, 1.74, 1.668, 1.678),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish marubozu after a grind is usually fade-or-wait, not a chase of the long red close as a bounce. The bar opened near the high and closed near the low with tiny wicks; this is not a hanging man (no long lower wick) and not a shooting star (no long upper wick). This is not a bearish engulfing: the red body does not swallow the prior green body. This is not three black crows (one bar, not three) and not a dark-cloud cover (that opens above the prior close and stays inside the prior body). This is not a harami: the last bar is large, not a small body inside the prior body. HOLD if the slip already has your size. This is not leftover protocol math, not the orbital tweezer, not the mesh-network evening star, not the custody opening drive, not the bandwidth dump, not the MEV-relay inside bar, not the yield-farm outside bar, not the blob-token fail-break, not the vault-token engulfing, not the gate-token shooting star, not the dock-token dark-cloud, not the node-token three-crows, not the slot-token hanging man, not the epoch-token harami, not the krona-futures marubozu tape, and not a live exchange.",
      whyMarketMoved: "The marubozu close held and the nonce token leaked; the long red close was not a bounce.",
      evidence: "Nonce-token bearish-marubozu tape plus thin long-red-must-bounce chatter. Practice only.",
    },
    allowShort: false,
    packId: "crypto-tape",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-tape-goss-gravestone",
    title: "Gossip token prints a gravestone doji after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE gossip token ground higher, then printed a gravestone doji: open and close sit on the lows with a long upper wick and almost no body. Gossip tokens are the p2p-gossip beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the wick must continue. Practice data only — not a live exchange. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Gravestone doji on the gossip token. Thin chatter: upper wick must continue. No protocol change.",
    preOhlc: GOSS_PRE,
    postOhlc: withAftermath(GOSS_PRE, [
      bar("+1", 0.38424, 0.38438, 0.38346, 0.38358),
      bar("+2", 0.38358, 0.38368, 0.38272, 0.38284),
      bar("+3", 0.38284, 0.38294, 0.38198, 0.38208),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A gravestone doji after a grind is usually fade-or-wait, not a chase of the upper wick. Open and close sit on the lows with almost no body; this is not a shooting star (that has a small real body near the lows). This is not a hanging man (no long lower wick) and not a marubozu (this bar has a long upper wick). This is not an outside bar: the low stayed inside the prior low. This is not a harami (the last bar is not a small body inside the prior body). HOLD if the slip already has your size. This is not leftover protocol math, not the orbital tweezer, not the mesh-network evening star, not the custody opening drive, not the bandwidth dump, not the MEV-relay inside bar, not the yield-farm outside bar, not the blob-token fail-break, not the vault-token engulfing, not the gate-token shooting star, not the dock-token dark-cloud, not the node-token three-crows, not the slot-token hanging man, not the epoch-token harami, not the nonce-token marubozu, not the ringgit-futures gravestone tape, and not a live exchange.",
      whyMarketMoved: "The gravestone close held and the gossip token leaked; the upper wick did not continue.",
      evidence: "Gossip-token gravestone-doji tape plus thin wick-must-continue chatter. Practice only.",
    },
    allowShort: false,
    packId: "crypto-tape",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-tape-witness-harami-cross",
    title: "Witness token prints a harami cross after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE witness token ground higher into a tall green bar, then printed a doji fully inside that green body. Witness tokens are the zk-witness beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the doji means the grind must resume. Practice data only — not a live exchange. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Harami cross on the witness token. Thin chatter: the doji means the grind must resume. No protocol change.",
    preOhlc: WITNESS_PRE,
    postOhlc: withAftermath(WITNESS_PRE, [
      bar("+1", 13.63, 13.646, 13.518, 13.534),
      bar("+2", 13.534, 13.548, 13.398, 13.414),
      bar("+3", 13.414, 13.428, 13.268, 13.284),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A harami cross after a grind is usually fade-or-wait, not a chase of the inside doji as a resume. The doji sits inside the prior body; this is not a bearish harami with a small real body, and not a gravestone (open and close are not pinned to the lows with a long upper wick). This is not a hanging man (no long lower wick) and not a shooting star (no long upper wick from the lows). This is not the MEV-relay inside-bar-still-ahead HOLD: there is no official operator note still ahead, and the process here is fade-or-wait, not wait-for-the-print. HOLD if the slip already has your size. This is not leftover protocol math, not the orbital tweezer, not the mesh-network evening star, not the custody opening drive, not the bandwidth dump, not the MEV-relay inside bar, not the yield-farm outside bar, not the blob-token fail-break, not the vault-token engulfing, not the gate-token shooting star, not the dock-token dark-cloud, not the node-token three-crows, not the slot-token hanging man, not the epoch-token harami, not the nonce-token marubozu, not the gossip-token gravestone, not the GBP/HUF harami-cross tape, and not a live exchange.",
      whyMarketMoved: "The harami-cross close held and the witness token leaked; the inside doji was not a resume of the grind.",
      evidence: "Witness-token harami-cross tape plus thin doji-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "crypto-tape",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-tape-commit-spinning-top",
    title: "Commit token prints a spinning top after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE commit token ground higher, then printed a spinning top: a small real body near the middle of the bar with upper and lower wicks of similar length. Commit tokens are the commit-reveal beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the pause means the grind must resume. Practice data only — not a live exchange. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Spinning top on the commit token. Thin chatter: the pause means the grind must resume. No protocol change.",
    preOhlc: COMMIT_PRE,
    postOhlc: withAftermath(COMMIT_PRE, [
      bar("+1", 0.6102, 0.6124, 0.5968, 0.5984),
      bar("+2", 0.5984, 0.6002, 0.5846, 0.5862),
      bar("+3", 0.5862, 0.588, 0.5718, 0.5736),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A spinning top after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar has a small real body near the middle with wicks both ways; this is not a hanging man (that sits near the highs with a long lower wick only) and not a shooting star (that sits near the lows with a long upper wick only). This is not a harami cross: the last bar is not a doji sitting inside the prior body. This is not a gravestone (open and close are not pinned to the lows). This is not the MEV-relay inside-bar-still-ahead HOLD: there is no official operator note still ahead, and the process here is fade-or-wait, not wait-for-the-print. HOLD if the slip already has your size. This is not leftover protocol math, not the orbital tweezer, not the mesh-network evening star, not the custody opening drive, not the bandwidth dump, not the MEV-relay inside bar, not the yield-farm outside bar, not the blob-token fail-break, not the vault-token engulfing, not the gate-token shooting star, not the dock-token dark-cloud, not the node-token three-crows, not the slot-token hanging man, not the epoch-token harami, not the nonce-token marubozu, not the gossip-token gravestone, not the witness-token harami-cross, not the sequencer-token fail-break at 0.86, not the EUR/RON spinning-top tape, and not a live exchange.",
      whyMarketMoved: "The spinning-top close held and the commit token leaked; the pause was not a resume of the grind.",
      evidence: "Commit-token spinning-top tape plus thin pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "crypto-tape",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-tape-hint-long-legged-doji",
    title: "Hint token prints a long-legged doji after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE hint token ground higher, then printed a long-legged doji: open and close sit together with long upper and lower wicks of similar length. Hint tokens are the hint-and-lock beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the long-legged pause means the grind must resume. Practice data only — not a live exchange. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Long-legged doji on the hint token. Thin chatter: the long-legged pause means the grind must resume. No protocol change.",
    preOhlc: HINT_PRE,
    postOhlc: withAftermath(HINT_PRE, [
      bar("+1", 17.598, 17.628, 17.418, 17.438),
      bar("+2", 17.438, 17.468, 17.248, 17.268),
      bar("+3", 17.268, 17.298, 17.068, 17.088),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A long-legged doji after a grind is usually fade-or-wait, not a chase of the pause as a resume. Open and close sit together with long wicks both ways; this is not a spinning top (that has a small real body). This is not a gravestone (open and close are not pinned to the lows with a long upper wick only). This is not a harami cross: the doji is not sitting inside the prior body. This is not a hanging man (no long lower wick only) and not a shooting star (no long upper wick from the lows). This is not the MEV-relay inside-bar-still-ahead HOLD: there is no official operator note still ahead, and the process here is fade-or-wait, not wait-for-the-print. HOLD if the slip already has your size. This is not leftover protocol math, not the orbital tweezer, not the mesh-network evening star, not the custody opening drive, not the bandwidth dump, not the MEV-relay inside bar, not the yield-farm outside bar, not the blob-token fail-break, not the vault-token engulfing, not the gate-token shooting star, not the dock-token dark-cloud, not the node-token three-crows, not the slot-token hanging man, not the epoch-token harami, not the nonce-token marubozu, not the gossip-token gravestone, not the witness-token harami-cross, not the commit-token spinning top, not the reveal-token spinning-top macro, not the GBP/RON long-legged-doji tape, and not a live exchange.",
      whyMarketMoved: "The long-legged-doji close held and the hint token leaked; the pause was not a resume of the grind.",
      evidence: "Hint-token long-legged-doji tape plus thin long-legged-pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "crypto-tape",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-tape-batch-dragonfly",
    title: "Batch token prints a dragonfly doji after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE batch token ground higher, then printed a dragonfly doji: open and close sit together at the highs with a long lower wick only. Batch tokens are the batch-inclusion beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the dragonfly pause means the grind must resume. Practice data only — not a live exchange. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Dragonfly doji on the batch token. Thin chatter: the dragonfly pause means the grind must resume. No protocol change.",
    preOhlc: BATCH_PRE,
    postOhlc: withAftermath(BATCH_PRE, [
      bar("+1", 8.8728, 8.8864, 8.7528, 8.7686),
      bar("+2", 8.7686, 8.7824, 8.6426, 8.6584),
      bar("+3", 8.6584, 8.6728, 8.5186, 8.5348),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A dragonfly doji after a grind is usually fade-or-wait, not a chase of the pause as a resume. Open and close sit together at the highs with a long lower wick; this is not a hanging man (that has a small real body near the highs). This is not a gravestone (open and close are not pinned to the lows with a long upper wick). This is not a long-legged doji (no long upper wick). This is not a spinning top (no small real body in the middle). This is not a harami cross: the doji is not sitting inside the prior body. This is not the MEV-relay inside-bar-still-ahead HOLD: there is no official operator note still ahead, and the process here is fade-or-wait, not wait-for-the-print. HOLD if the slip already has your size. This is not leftover protocol math, not the orbital tweezer, not the mesh-network evening star, not the custody opening drive, not the bandwidth dump, not the MEV-relay inside bar, not the yield-farm outside bar, not the blob-token fail-break, not the vault-token engulfing, not the gate-token shooting star, not the dock-token dark-cloud, not the node-token three-crows, not the slot-token hanging man, not the epoch-token harami, not the nonce-token marubozu, not the gossip-token gravestone, not the witness-token harami-cross, not the commit-token spinning top, not the hint-token long-legged doji, not the reveal-token spinning-top macro, not the seal-token long-legged-doji macro, not the AUD/RON dragonfly tape, and not a live exchange.",
      whyMarketMoved: "The dragonfly-doji close held and the batch token leaked; the pause was not a resume of the grind.",
      evidence: "Batch-token dragonfly-doji tape plus thin dragonfly-pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "crypto-tape",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-tape-quill-matching-high",
    title: "Quill token prints a matching high after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE quill token ground higher into a tall green bar, then printed a small green bar that tags nearly the same high and closes weak under it. Quill tokens are the quill-and-sign beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the matching-high pause means the grind must resume. Practice data only — not a live exchange. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Matching high on the quill token. Thin chatter: the matching-high pause means the grind must resume. No protocol change.",
    preOhlc: QUILL_PRE,
    postOhlc: withAftermath(QUILL_PRE, [
      bar("+1", 16.128, 16.168, 15.748, 15.798),
      bar("+2", 15.798, 15.838, 15.386, 15.442),
      bar("+3", 15.442, 15.486, 14.918, 14.968),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A matching high after a grind is usually fade-or-wait, not a chase of the pause as a resume. Both bars are green and share nearly the same high; the last close sits weak under that high. This is not a tweezer: a tweezer tags the high with opposite-color bodies. This is not a shooting star (the last body is not sitting near the lows with a long upper wick only). This is not a dragonfly (open and close are not pinned to the highs with a long lower wick). This is not a harami: the last high pokes to the prior high, not a small body fully inside the prior body. This is not the MEV-relay inside-bar-still-ahead HOLD: there is no official operator note still ahead, and the process here is fade-or-wait, not wait-for-the-print. HOLD if the slip already has your size. This is not leftover protocol math, not the orbital tweezer, not the mesh-network evening star, not the custody opening drive, not the bandwidth dump, not the MEV-relay inside bar, not the yield-farm outside bar, not the blob-token fail-break, not the vault-token engulfing, not the gate-token shooting star, not the dock-token dark-cloud, not the node-token three-crows, not the slot-token hanging man, not the epoch-token harami, not the nonce-token marubozu, not the gossip-token gravestone, not the witness-token harami-cross, not the commit-token spinning top, not the hint-token long-legged doji, not the batch-token dragonfly, not the ink-token dragonfly macro, and not a live exchange.",
      whyMarketMoved: "The matching-high close held and the quill token leaked; the pause was not a resume of the grind.",
      evidence: "Quill-token matching-high tape plus thin matching-high-pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "crypto-tape",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-tape-sigil-belt-hold",
    title: "Sigil token prints a bearish belt hold after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE sigil token ground higher, then printed a bearish belt hold: the last bar opens at its high with no upper wick and sells off, closing weak with a real body and a lower wick. Sigil tokens are the sigil-and-seal beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the belt-hold pause means the grind must resume. Practice data only — not a live exchange. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Bearish belt hold on the sigil token. Thin chatter: the belt-hold pause means the grind must resume. No protocol change.",
    preOhlc: SIGIL_PRE,
    postOhlc: withAftermath(SIGIL_PRE, [
      bar("+1", 26.068, 26.118, 25.648, 25.698),
      bar("+2", 25.698, 25.748, 25.218, 25.268),
      bar("+3", 25.268, 25.318, 24.648, 24.698),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish belt hold after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar opens at the high with no upper wick and sells off into a real body; a lower wick is allowed. This is not a marubozu: a marubozu has tiny wicks at both ends and closes near the low. This is not a matching high: both of those bars are green and share nearly the same high. This is not a hanging man (the body is not a small real body near the highs with a long lower wick). This is not a shooting star (there is no long upper wick from the lows). HOLD if the slip already has your size. This is not leftover protocol math, not the orbital tweezer, not the mesh-network evening star, not the custody opening drive, not the bandwidth dump, not the MEV-relay inside bar, not the yield-farm outside bar, not the blob-token fail-break, not the vault-token engulfing, not the gate-token shooting star, not the dock-token dark-cloud, not the node-token three-crows, not the slot-token hanging man, not the epoch-token harami, not the nonce-token marubozu, not the gossip-token gravestone, not the witness-token harami-cross, not the commit-token spinning top, not the hint-token long-legged doji, not the batch-token dragonfly, not the quill-token matching high, not the wax-token matching-high macro, and not a live exchange.",
      whyMarketMoved: "The belt-hold close held and the sigil token leaked; the pause was not a resume of the grind.",
      evidence: "Sigil-token bearish-belt-hold tape plus thin belt-hold-pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "crypto-tape",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-tape-glyph-separating-lines",
    title: "Glyph token prints bearish separating lines after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE glyph token ground higher into a tall green bar, then printed a long red bar that opens at nearly the same open as that green bar and sells off. Glyph tokens are the glyph-and-mark beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the separating-lines pause means the grind must resume. Practice data only — not a live exchange. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Bearish separating lines on the glyph token. Thin chatter: the separating-lines pause means the grind must resume. No protocol change.",
    preOhlc: GLYPH_PRE,
    postOhlc: withAftermath(GLYPH_PRE, [
      bar("+1", 42.868, 43.148, 41.286, 41.548),
      bar("+2", 41.548, 41.818, 39.648, 39.918),
      bar("+3", 39.918, 40.186, 37.848, 38.148),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Bearish separating lines after a grind are usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens at nearly the same open as the prior tall green and sells off. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick, usually after the prior close, not back at the prior open. This is not a marubozu: a marubozu has tiny wicks at both ends and closes near the low. This is not a matching high: both of those bars are green and share nearly the same high. This is not a hanging man (the body is not a small real body near the highs with a long lower wick). This is not a shooting star (there is no long upper wick from the lows). HOLD if the slip already has your size. This is not leftover protocol math, not the orbital tweezer, not the mesh-network evening star, not the custody opening drive, not the bandwidth dump, not the MEV-relay inside bar, not the yield-farm outside bar, not the blob-token fail-break, not the vault-token engulfing, not the gate-token shooting star, not the dock-token dark-cloud, not the node-token three-crows, not the slot-token hanging man, not the epoch-token harami, not the nonce-token marubozu, not the gossip-token gravestone, not the witness-token harami-cross, not the commit-token spinning top, not the hint-token long-legged doji, not the batch-token dragonfly, not the quill-token matching high, not the sigil-token belt hold, not the wax-token matching-high macro, not the forge-token belt-hold macro, and not a live exchange.",
      whyMarketMoved: "The separating-lines close held and the glyph token leaked; the pause was not a resume of the grind.",
      evidence: "Glyph-token bearish-separating-lines tape plus thin separating-lines-pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "crypto-tape",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-tape-cipher-on-neck",
    title: "Cipher token prints a bearish on-neck after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE cipher token ground higher into a tall green bar, then printed a long red bar that opens above that green close and closes at nearly the prior low. Cipher tokens are the cipher-and-key beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the on-neck pause means the grind must resume. Practice data only — not a live exchange. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Bearish on-neck on the cipher token. Thin chatter: the on-neck pause means the grind must resume. No protocol change.",
    preOhlc: CIPHER_PRE,
    postOhlc: withAftermath(CIPHER_PRE, [
      bar("+1", 6.5528, 6.5786, 6.3864, 6.4128),
      bar("+2", 6.4128, 6.4386, 6.2186, 6.2486),
      bar("+3", 6.2486, 6.2748, 6.0186, 6.0486),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish on-neck after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens above the prior close and closes at nearly the prior low. This is not separating lines: those share nearly the same open as the prior tall green. This is not a dark-cloud: a dark-cloud closes in the lower half of the prior body, still above that prior open, not at the prior low. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick. This is not a matching high: both of those bars are green and share nearly the same high. This is not a hanging man (the body is not a small real body near the highs with a long lower wick). HOLD if the slip already has your size. This is not leftover protocol math, not the orbital tweezer, not the mesh-network evening star, not the custody opening drive, not the bandwidth dump, not the MEV-relay inside bar, not the yield-farm outside bar, not the blob-token fail-break, not the vault-token engulfing, not the gate-token shooting star, not the dock-token dark-cloud, not the node-token three-crows, not the slot-token hanging man, not the epoch-token harami, not the nonce-token marubozu, not the gossip-token gravestone, not the witness-token harami-cross, not the commit-token spinning top, not the hint-token long-legged doji, not the batch-token dragonfly, not the quill-token matching high, not the sigil-token belt hold, not the glyph-token separating lines, not the crest-token separating-lines macro, not the shard-token harami macro, and not a live exchange.",
      whyMarketMoved: "The on-neck close held and the cipher token leaked; the pause was not a resume of the grind.",
      evidence: "Cipher-token bearish-on-neck tape plus thin on-neck-pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "crypto-tape",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-tape-scroll-in-neck",
    title: "Scroll token prints a bearish in-neck after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE scroll token ground higher into a tall green bar, then printed a long red bar that opens above that green close and closes at nearly that same close, not the prior low. Scroll tokens are the scroll-and-roll beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the in-neck pause means the grind must resume. Practice data only — not a live exchange. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Bearish in-neck on the scroll token. Thin chatter: the in-neck pause means the grind must resume. No protocol change.",
    preOhlc: SCROLL_PRE,
    postOhlc: withAftermath(SCROLL_PRE, [
      bar("+1", 21.286, 21.448, 20.486, 20.648),
      bar("+2", 20.648, 20.818, 19.486, 19.668),
      bar("+3", 19.668, 19.848, 18.286, 18.468),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish in-neck after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens above the prior close and closes at nearly that same close, not the prior low. This is not on-neck: on-neck closes at nearly the prior low. This is not a dark-cloud: a dark-cloud closes in the lower half of the prior body, still above that prior open, not back at the prior close. This is not separating lines: those share nearly the same open as the prior tall green. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick. This is not a matching high: both of those bars are green and share nearly the same high. This is not the cipher-token tape: that on-neck sits near 6.73, not this scroll-and-roll beta. HOLD if the slip already has your size. This is not leftover protocol math, not the orbital tweezer, not the mesh-network evening star, not the custody opening drive, not the bandwidth dump, not the MEV-relay inside bar, not the yield-farm outside bar, not the blob-token fail-break, not the vault-token engulfing, not the gate-token shooting star, not the dock-token dark-cloud, not the node-token three-crows, not the slot-token hanging man, not the epoch-token harami, not the nonce-token marubozu, not the gossip-token gravestone, not the witness-token harami-cross, not the commit-token spinning top, not the hint-token long-legged doji, not the batch-token dragonfly, not the quill-token matching high, not the sigil-token belt hold, not the glyph-token separating lines, not the cipher-token on-neck, not the tome-token on-neck macro, and not a live exchange.",
      whyMarketMoved: "The in-neck close held and the scroll token leaked; the pause was not a resume of the grind.",
      evidence: "Scroll-token bearish-in-neck tape plus thin in-neck-pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "crypto-tape",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-tape-rune-thrusting",
    title: "Rune token prints a bearish thrusting line after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE rune token ground higher into a tall green bar, then printed a long red bar that opens above that green close and closes into that prior body, still above the midpoint. Rune tokens are the rune-and-mark beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the thrusting pause means the grind must resume. Practice data only — not a live exchange. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Bearish thrusting line on the rune token. Thin chatter: the thrusting pause means the grind must resume. No protocol change.",
    preOhlc: RUNE_PRE,
    postOhlc: withAftermath(RUNE_PRE, [
      bar("+1", 0.7886, 0.7948, 0.7586, 0.7648),
      bar("+2", 0.7648, 0.7718, 0.7348, 0.7418),
      bar("+3", 0.7418, 0.7486, 0.7086, 0.7148),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish thrusting line after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens above the prior close and closes into that prior body, still above the midpoint. This is not in-neck: in-neck closes at nearly the prior close. This is not on-neck: on-neck closes at nearly the prior low. This is not a dark-cloud: a dark-cloud closes in the lower half of the prior body, still above that prior open. This is not separating lines: those share nearly the same open as the prior tall green. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick. This is not a matching high: both of those bars are green and share nearly the same high. This is not leftover protocol math. This is not the scroll-token tape: that in-neck sits near 21.75, not this rune-and-mark beta. This is not the cipher-token tape: that on-neck sits near 6.73. HOLD if the slip already has your size. This is not leftover protocol math, not the orbital tweezer, not the mesh-network evening star, not the custody opening drive, not the bandwidth dump, not the MEV-relay inside bar, not the yield-farm outside bar, not the blob-token fail-break, not the vault-token engulfing, not the gate-token shooting star, not the dock-token dark-cloud, not the node-token three-crows, not the slot-token hanging man, not the epoch-token harami, not the nonce-token marubozu, not the gossip-token gravestone, not the witness-token harami-cross, not the commit-token spinning top, not the hint-token long-legged doji, not the batch-token dragonfly, not the quill-token matching high, not the sigil-token belt hold, not the glyph-token separating lines, not the cipher-token on-neck, not the scroll-token in-neck, not the codex-token in-neck macro, and not a live exchange.",
      whyMarketMoved: "The thrusting close held and the rune token leaked; the pause was not a resume of the grind.",
      evidence: "Rune-token bearish-thrusting tape plus thin thrusting-pause-must-resume chatter. Practice only.",
    },
    allowShort: false,
    packId: "crypto-tape",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-macro-carb-harami",
    title: "Carbon-credit token harami after a dump as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE carbon-credit token already dumped as risk appetite faded. The last full bar is a small inside candle, not a reclaim. No protocol change. Ask whether that inside bar is a pause or a new bid. Practice data only — not a live exchange.",
    newsHeadline:
      "Risk-off. Carbon-credit token dumped with risk appetite, then printed a small inside bar. No protocol change.",
    preOhlc: CARB_PRE,
    postOhlc: withAftermath(CARB_PRE, [
      bar("+1", 17.8, 18.0, 16.6, 16.8),
      bar("+2", 16.8, 17.0, 15.6, 15.8),
      bar("+3", 15.8, 16.0, 14.6, 14.8),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this token falling. A small inside bar after a dump is often a pause, not a reclaim. Fade or wait; HOLD if the slip already has your size. This is not leftover protocol math, not the bitcoin risk-off dump, not the orbital tweezer, not the RWA doji, and not a live exchange.",
      whyMarketMoved: "The inside bar failed and the carbon-credit token leaked as risk stayed offered.",
      evidence: "Carbon-credit dump-then-harami tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "crypto-macro",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-macro-rent-cpi-print",
    title: "Compute-rental token coiled into a hot CPI print",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "This SAMPLE compute-rental token has been coiled in a tight range into a scheduled CPI print. The print comes in hot. Rate-cut hopes fade, and risk tokens often sell. No protocol change. Ask whether the coil is a pause or already your size. Practice data only — not a live exchange.",
    newsHeadline:
      "Hot CPI print. Rate-cut odds fall. Compute-rental token in focus. No protocol change.",
    preOhlc: RENT_PRE,
    postOhlc: withAftermath(RENT_PRE, [
      bar("+1", 13.38, 13.4, 13.08, 13.12),
      bar("+2", 13.12, 13.16, 12.82, 12.86),
      bar("+3", 12.86, 12.9, 12.56, 12.6),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Size for surprise into data. A hot CPI print can hit risk tokens, so this name can fall. HOLD if the coil already has your size. This is not leftover protocol math, not the carbon-credit risk-off harami, not the ether already-dumping print, not the bitcoin soft-landing print, and not a live exchange.",
      whyMarketMoved: "The coil broke lower as the compute-rental token sold the hot CPI print.",
      evidence: "Compute-rental coil tape plus a CPI-print brief. Practice only.",
    },
    allowShort: false,
    packId: "crypto-macro",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-macro-lith-brine-supply",
    title: "Lithium token grinds into a brine-pond freeze",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "This SAMPLE lithium token has been grinding higher. Then a brine-pond freeze hits a mining region. Name which side this coin is on: the lithium supply, not a compute L2. No protocol change. Practice data only — not a live exchange.",
    newsHeadline:
      "Brine-pond freeze. Lithium supply tight in this SAMPLE brief. No protocol change.",
    preOhlc: LITH_PRE,
    postOhlc: withAftermath(LITH_PRE, [
      bar("+1", 0.441, 0.458, 0.439, 0.454),
      bar("+2", 0.454, 0.468, 0.451, 0.464),
      bar("+3", 0.464, 0.478, 0.461, 0.474),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A supply scare can bid the token that is actually short. Here lithium is the tight side, so this name can rise. HOLD if the grind already has your size. This is not leftover protocol math, not the proof-of-work mining-grid flush, not the storage-token dump, not the carbon-credit risk-off harami, not the compute-rental CPI coil, and not a live exchange.",
      whyMarketMoved: "The grind continued as the lithium token bid the brine freeze.",
      evidence: "Lithium grind tape plus a supply-side freeze headline. Practice only.",
    },
    allowShort: false,
    packId: "crypto-macro",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-macro-hive-dump-no-reclaim",
    title: "Social token dumps as risk appetite fades, no reclaim",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE social token already dumped as risk appetite faded. The last bars keep making lower closes, not an inside pause. No protocol change. Thin chatter says the first bounce must reclaim. The bounce has not shown up. Practice data only — not a live exchange.",
    newsHeadline:
      "Risk-off. Social token sold with beta. Thin chatter: dump must reclaim. No bounce yet. No protocol change.",
    preOhlc: HIVE_PRE,
    postOhlc: withAftermath(HIVE_PRE, [
      bar("+1", 49.18, 49.32, 48.48, 48.54),
      bar("+2", 48.54, 48.68, 47.84, 47.9),
      bar("+3", 47.9, 48.04, 47.22, 47.28),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this token falling when it is the beta side. A dump with no reclaim is late-chase, not a new bounce path. Fade or wait; HOLD if the slip already has your size. This is not leftover protocol math, not the carbon-credit dump-then-harami, not the compute-rental CPI coil, not the lithium brine grind, not the bandwidth spectrum dump, not the bitcoin risk-off slide, and not a live exchange.",
      whyMarketMoved: "The dump continued; no bounce showed up as the social token stayed offered with risk.",
      evidence: "Social-token dump-no-reclaim tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "crypto-macro",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-macro-pool-evening-star",
    title: "Liquidity-pool token evening star as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE liquidity-pool token rallied into a long green bar, a small star at the highs, then a red close back into that body as risk appetite faded. Pool tokens are the DeFi beta side in this SAMPLE brief, not a stablecoin. No protocol change. Ask whether that evening star is a pause or a new bid. Practice data only — not a live exchange.",
    newsHeadline:
      "Risk-off. Liquidity-pool token sold with beta. Evening star at the highs, not a reclaim. No protocol change.",
    preOhlc: POOL_PRE,
    postOhlc: withAftermath(POOL_PRE, [
      bar("+1", 7.74, 7.78, 7.52, 7.56),
      bar("+2", 7.56, 7.6, 7.34, 7.38),
      bar("+3", 7.38, 7.42, 7.16, 7.2),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this token falling when it is the DeFi beta side. The evening star is already a pause, not a new bid path. Fade or wait; HOLD if the slip already has your size. This is not leftover protocol math, not the mesh-network treasury evening star, not the carbon-credit dump-then-harami, not the compute-rental CPI coil, not the lithium brine grind, not the social-token dump-no-reclaim, not the orbital tweezer, and not a live exchange.",
      whyMarketMoved: "The red close held and the pool token leaked as DeFi beta stayed offered with risk.",
      evidence: "Liquidity-pool evening-star tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "crypto-macro",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-macro-wrap-outside-bar",
    title: "Wrapped-asset token prints an outside bar that closes weak as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE wrapped-asset token printed a wide bar that took both sides, then closed weak as risk appetite faded. Wrap tokens are the beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the upper wick must hold. Practice data only — not a live exchange. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Wrapped-asset token sold with beta. Outside bar. Thin chatter: wick must hold. No protocol change.",
    preOhlc: WRAP_PRE,
    postOhlc: withAftermath(WRAP_PRE, [
      bar("+1", 4.814, 4.828, 4.772, 4.786),
      bar("+2", 4.786, 4.8, 4.744, 4.758),
      bar("+3", 4.758, 4.772, 4.716, 4.73),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this token falling when it is the beta side. An outside bar that closes weak is usually fade-or-wait, not a chase of the upper wick. HOLD if the slip already has your size. This is not leftover protocol math, not the carbon-credit dump-then-harami, not the compute-rental CPI coil, not the lithium brine grind, not the social-token dump-no-reclaim, not the liquidity-pool evening star, not the yield-farm tape outside bar, not the AI-agent outside bar, and not a live exchange.",
      whyMarketMoved: "The weak close continued lower; the upper wick did not hold as the wrap token stayed offered with risk.",
      evidence: "Wrapped-asset outside-bar tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "crypto-macro",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-macro-seq-fail-break",
    title: "Sequencer token pokes a range, then fails as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE sequencer token poked above a range, then slipped back as risk appetite faded. Sequencer tokens are the L2 beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the break must hold. Practice data only — not a live exchange. Chase the first green poke, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Sequencer token sold with L2 beta. Thin chatter: range break must hold. No protocol change.",
    preOhlc: SEQ_PRE,
    postOhlc: withAftermath(SEQ_PRE, [
      bar("+1", 0.8588, 0.8612, 0.8532, 0.8544),
      bar("+2", 0.8544, 0.8568, 0.8488, 0.85),
      bar("+3", 0.85, 0.8524, 0.8444, 0.8456),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this token falling when it is the L2 beta side. A failed poke is usually fade-or-wait, not a chase. Do not treat the first green bar as a breakout. HOLD if the slip already has your size. This is not leftover protocol math, not the carbon-credit dump-then-harami, not the compute-rental CPI coil, not the lithium brine grind, not the social-token dump-no-reclaim, not the liquidity-pool evening star, not the wrapped-asset outside bar, not the blob-token tape fail-break, not the privacy-coin fail-break, not the L2 grind-then-stall, and not a live exchange.",
      whyMarketMoved: "The poke failed and the sequencer token slipped back through the range as L2 beta stayed offered with risk.",
      evidence: "Sequencer-token failed-breakout tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "crypto-macro",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-macro-keeper-engulf",
    title: "Keeper token prints a bearish engulfing as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE keeper token printed a small green bar, then a red bar whose body swallowed that green body as risk appetite faded. Keeper tokens are the DeFi beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the first green must resume. Practice data only — not a live exchange. Chase the swallowed green, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Keeper token sold with DeFi beta. Bearish engulfing. Thin chatter: first green must resume. No protocol change.",
    preOhlc: KEEPER_PRE,
    postOhlc: withAftermath(KEEPER_PRE, [
      bar("+1", 5.612, 5.624, 5.576, 5.588),
      bar("+2", 5.588, 5.6, 5.552, 5.564),
      bar("+3", 5.564, 5.576, 5.528, 5.54),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this token falling when it is the DeFi beta side. A bearish engulfing is usually fade-or-wait, not a chase of the swallowed green bar. This is not an outside bar: the red high stayed inside the prior high. HOLD if the slip already has your size. This is not leftover protocol math, not the carbon-credit dump-then-harami, not the compute-rental CPI coil, not the lithium brine grind, not the social-token dump-no-reclaim, not the liquidity-pool evening star, not the wrapped-asset outside bar, not the sequencer-token fail-break, not the vault-token tape engulfing, not the privacy-coin fail-break, not the yield-farm tape outside bar, and not a live exchange.",
      whyMarketMoved: "The engulfing close held and the keeper token leaked as DeFi beta stayed offered with risk.",
      evidence: "Keeper-token bearish-engulfing tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "crypto-macro",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-macro-attest-shooting-star",
    title: "Attest token prints a shooting star as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE attest token ground higher, then printed a shooting star: a small body near the lows with a long upper wick as risk appetite faded. Attest tokens are the identity-beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the wick must continue. Practice data only — not a live exchange. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Attest token sold with identity beta. Shooting star. Thin chatter: upper wick must continue. No protocol change.",
    preOhlc: ATTEST_PRE,
    postOhlc: withAftermath(ATTEST_PRE, [
      bar("+1", 3.742, 3.756, 3.688, 3.698),
      bar("+2", 3.698, 3.712, 3.644, 3.654),
      bar("+3", 3.654, 3.668, 3.6, 3.61),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this token falling when it is the identity-beta side. A shooting star after a grind is usually fade-or-wait, not a chase of the upper wick. This is not an outside bar: the low stayed inside the prior low. This is not an evening star (that is three bars) and not a bearish engulfing (the body did not swallow the prior body). HOLD if the slip already has your size. This is not leftover protocol math, not the carbon-credit dump-then-harami, not the compute-rental CPI coil, not the lithium brine grind, not the social-token dump-no-reclaim, not the liquidity-pool evening star, not the wrapped-asset outside bar, not the sequencer-token fail-break, not the keeper-token engulfing, not the gate-token tape shooting star, not the vault-token tape engulfing, and not a live exchange.",
      whyMarketMoved: "The shooting-star close held and the attest token leaked as identity beta stayed offered with risk.",
      evidence: "Attest-token shooting-star tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "crypto-macro",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-macro-lane-dark-cloud",
    title: "Lane token prints a dark-cloud cover as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE lane token printed a green bar, then a red bar that opened above that close and finished in the lower half of that body without swallowing it as risk appetite faded. Lane tokens are the mempool-ordering beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the gap-up open must continue. Practice data only — not a live exchange. Chase the gap-up, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Lane token sold with mempool-ordering beta. Dark-cloud cover. Thin chatter: gap-up open must continue. No protocol change.",
    preOhlc: LANE_PRE,
    postOhlc: withAftermath(LANE_PRE, [
      bar("+1", 8.274, 8.282, 8.238, 8.244),
      bar("+2", 8.244, 8.252, 8.208, 8.214),
      bar("+3", 8.214, 8.222, 8.178, 8.184),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this token falling when it is the mempool-ordering beta side. A dark-cloud cover is usually fade-or-wait, not a chase of the gap-up open. The red close is inside the prior body, so this is not a bearish engulfing. This is not an outside bar: the low stayed inside the prior low. This is not a shooting star (that is one long upper wick) and not an evening star (that is three bars). HOLD if the slip already has your size. This is not leftover protocol math, not the carbon-credit dump-then-harami, not the compute-rental CPI coil, not the lithium brine grind, not the social-token dump-no-reclaim, not the liquidity-pool evening star, not the wrapped-asset outside bar, not the sequencer-token fail-break, not the keeper-token engulfing, not the attest-token shooting star, not the dock-token tape dark-cloud, not the MEV-relay inside bar, and not a live exchange.",
      whyMarketMoved: "The dark-cloud close held and the lane token leaked as mempool-ordering beta stayed offered with risk.",
      evidence: "Lane-token dark-cloud tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "crypto-macro",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-macro-peer-three-crows",
    title: "Peer token prints three black crows as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE peer token ground higher, then printed three falling red bodies in a row as risk appetite faded. Peer tokens are the DHT-routing beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the first red is a dip to buy. Practice data only — not a live exchange. Chase the dip, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Peer token sold with DHT-routing beta. Three black crows. Thin chatter: first red is a dip to buy. No protocol change.",
    preOhlc: PEER_PRE,
    postOhlc: withAftermath(PEER_PRE, [
      bar("+1", 2.806, 2.814, 2.768, 2.776),
      bar("+2", 2.776, 2.784, 2.738, 2.746),
      bar("+3", 2.746, 2.754, 2.708, 2.716),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this token falling when it is the DHT-routing beta side. Three black crows after a grind are usually fade-or-wait, not a chase of the first red as a dip. This is not one bearish engulfing bar: three similar red bodies stepped lower. This is not an evening star (that is a small middle bar) and not a dark-cloud cover (that is two bars). HOLD if the slip already has your size. This is not leftover protocol math, not the carbon-credit dump-then-harami, not the compute-rental CPI coil, not the lithium brine grind, not the social-token dump-no-reclaim, not the liquidity-pool evening star, not the wrapped-asset outside bar, not the sequencer-token fail-break, not the keeper-token engulfing, not the attest-token shooting star, not the lane-token dark-cloud, not the node-token tape three-crows, and not a live exchange.",
      whyMarketMoved: "The third crow held and the peer token leaked as DHT-routing beta stayed offered with risk.",
      evidence: "Peer-token three-black-crows tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "crypto-macro",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-macro-quorum-hanging-man",
    title: "Quorum token prints a hanging man as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE quorum token ground higher, then printed a hanging man: a small body near the highs with a long lower wick as risk appetite faded. Quorum tokens are the validator-quorum beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the lower wick must hold. Practice data only — not a live exchange. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Quorum token sold with validator-quorum beta. Hanging man. Thin chatter: lower wick must hold. No protocol change.",
    preOhlc: QUORUM_PRE,
    postOhlc: withAftermath(QUORUM_PRE, [
      bar("+1", 19.392, 19.412, 19.248, 19.268),
      bar("+2", 19.268, 19.288, 19.124, 19.144),
      bar("+3", 19.144, 19.164, 19.0, 19.02),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this token falling when it is the validator-quorum beta side. A hanging man after a grind is usually fade-or-wait, not a chase of the lower wick as a dip. This is not a shooting star: that is a long upper wick. This is not a hammer: a hammer shows up after a decline, not after a grind. This is not a doji and not three black crows. This is not an outside bar: the high stayed inside the prior high. HOLD if the slip already has your size. This is not leftover protocol math, not the carbon-credit dump-then-harami, not the compute-rental CPI coil, not the lithium brine grind, not the social-token dump-no-reclaim, not the liquidity-pool evening star, not the wrapped-asset outside bar, not the sequencer-token fail-break, not the keeper-token engulfing, not the attest-token shooting star, not the lane-token dark-cloud, not the peer-token three-crows, not the slot-token tape hanging man, and not a live exchange.",
      whyMarketMoved: "The hanging-man close held and the quorum token leaked as validator-quorum beta stayed offered with risk.",
      evidence: "Quorum-token hanging-man tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "crypto-macro",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-macro-shard-harami",
    title: "Shard token prints a bearish harami as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE shard token ground higher into a tall green bar, then printed a small body fully inside that green body as risk appetite faded. Shard tokens are the data-availability shard beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the small inside body means the grind must resume. Practice data only — not a live exchange. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Shard token sold with data-availability shard beta. Bearish harami. Thin chatter: small inside body means the grind must resume. No protocol change.",
    preOhlc: SHARD_PRE,
    postOhlc: withAftermath(SHARD_PRE, [
      bar("+1", 6.252, 6.266, 6.188, 6.198),
      bar("+2", 6.198, 6.212, 6.128, 6.142),
      bar("+3", 6.142, 6.156, 6.072, 6.086),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this token falling when it is the data-availability shard beta side. A bearish harami after a grind is usually fade-or-wait, not a chase of the small inside body as a resume. The small body sits inside the prior body; this is not a bearish engulfing. This is not a hanging man (no long lower wick) and not a shooting star (no long upper wick). This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. This is not the MEV-relay inside-bar-still-ahead HOLD: there is no official operator note still ahead. HOLD if the slip already has your size. This is not leftover protocol math, not the carbon-credit dump-then-harami, not the compute-rental CPI coil, not the lithium brine grind, not the social-token dump-no-reclaim, not the liquidity-pool evening star, not the wrapped-asset outside bar, not the sequencer-token fail-break, not the keeper-token engulfing, not the attest-token shooting star, not the lane-token dark-cloud, not the peer-token three-crows, not the quorum-token hanging man, not the epoch-token tape harami, and not a live exchange.",
      whyMarketMoved: "The harami close held and the shard token leaked as data-availability shard beta stayed offered with risk.",
      evidence: "Shard-token bearish-harami tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "crypto-macro",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-macro-prover-marubozu",
    title: "Prover token prints a bearish marubozu as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE prover token ground higher, then printed a long red bar that opened near its high and closed near its low, with almost no wicks, as risk appetite faded. Prover tokens are the zk-prover beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the long red close must bounce. Practice data only — not a live exchange. Chase the red as a dip, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Prover token sold with zk-prover beta. Bearish marubozu. Thin chatter: long red close must bounce. No protocol change.",
    preOhlc: PROVER_PRE,
    postOhlc: withAftermath(PROVER_PRE, [
      bar("+1", 28.198, 28.214, 28.086, 28.098),
      bar("+2", 28.098, 28.114, 27.986, 27.998),
      bar("+3", 27.998, 28.014, 27.886, 27.898),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this token falling when it is the zk-prover beta side. A bearish marubozu after a grind is usually fade-or-wait, not a chase of the long red close as a bounce. The bar opened near the high and closed near the low with tiny wicks; this is not a hanging man (no long lower wick) and not a shooting star (no long upper wick). This is not a bearish engulfing: the red body does not swallow the prior green body. This is not three black crows (one bar, not three) and not a dark-cloud cover (that opens above the prior close and stays inside the prior body). This is not a harami: the last bar is large, not a small body inside the prior body. HOLD if the slip already has your size. This is not leftover protocol math, not the carbon-credit dump-then-harami, not the compute-rental CPI coil, not the lithium brine grind, not the social-token dump-no-reclaim, not the liquidity-pool evening star, not the wrapped-asset outside bar, not the sequencer-token fail-break, not the keeper-token engulfing, not the attest-token shooting star, not the lane-token dark-cloud, not the peer-token three-crows, not the quorum-token hanging man, not the shard-token harami, not the nonce-token tape marubozu, and not a live exchange.",
      whyMarketMoved: "The marubozu close held and the prover token leaked as zk-prover beta stayed offered with risk.",
      evidence: "Prover-token bearish-marubozu tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "crypto-macro",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-macro-bundle-gravestone",
    title: "Bundle token prints a gravestone doji as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE bundle token ground higher, then printed a gravestone doji: open and close sit on the lows with a long upper wick and almost no body, as risk appetite faded. Bundle tokens are the block-builder bundle beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the wick must continue. Practice data only — not a live exchange. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Bundle token sold with block-builder bundle beta. Gravestone doji. Thin chatter: upper wick must continue. No protocol change.",
    preOhlc: BUNDLE_PRE,
    postOhlc: withAftermath(BUNDLE_PRE, [
      bar("+1", 34.806, 34.824, 34.648, 34.666),
      bar("+2", 34.666, 34.682, 34.498, 34.516),
      bar("+3", 34.516, 34.532, 34.348, 34.366),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this token falling when it is the block-builder bundle beta side. A gravestone doji after a grind is usually fade-or-wait, not a chase of the upper wick. Open and close sit on the lows with almost no body; this is not a shooting star (that has a small real body near the lows). This is not a hanging man (no long lower wick) and not a marubozu (this bar has a long upper wick). This is not an outside bar: the low stayed inside the prior low. This is not a harami (the last bar is not a small body inside the prior body). HOLD if the slip already has your size. This is not leftover protocol math, not the carbon-credit dump-then-harami, not the compute-rental CPI coil, not the lithium brine grind, not the social-token dump-no-reclaim, not the liquidity-pool evening star, not the wrapped-asset outside bar, not the sequencer-token fail-break, not the keeper-token engulfing, not the attest-token shooting star, not the lane-token dark-cloud, not the peer-token three-crows, not the quorum-token hanging man, not the shard-token harami, not the prover-token marubozu, not the gossip-token tape gravestone, and not a live exchange.",
      whyMarketMoved: "The gravestone close held and the bundle token leaked as block-builder bundle beta stayed offered with risk.",
      evidence: "Bundle-token gravestone-doji tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "crypto-macro",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-macro-merkle-harami-cross",
    title: "Merkle token prints a harami cross as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE merkle token ground higher into a tall green bar, then printed a doji fully inside that green body as risk appetite faded. Merkle tokens are the inclusion-proof beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the doji means the grind must resume. Practice data only — not a live exchange. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Merkle token sold with inclusion-proof beta. Harami cross. Thin chatter: the doji means the grind must resume. No protocol change.",
    preOhlc: MERKLE_PRE,
    postOhlc: withAftermath(MERKLE_PRE, [
      bar("+1", 12.378, 12.394, 12.248, 12.264),
      bar("+2", 12.264, 12.278, 12.118, 12.134),
      bar("+3", 12.134, 12.148, 11.988, 12.004),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this token falling when it is the inclusion-proof beta side. A harami cross after a grind is usually fade-or-wait, not a chase of the inside doji as a resume. The doji sits inside the prior body; this is not a bearish harami with a small real body, and not a gravestone (open and close are not pinned to the lows with a long upper wick). This is not a hanging man (no long lower wick) and not a shooting star (no long upper wick from the lows). This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. This is not the MEV-relay inside-bar-still-ahead HOLD: there is no official operator note still ahead. HOLD if the slip already has your size. This is not leftover protocol math, not the carbon-credit dump-then-harami, not the compute-rental CPI coil, not the lithium brine grind, not the social-token dump-no-reclaim, not the liquidity-pool evening star, not the wrapped-asset outside bar, not the sequencer-token fail-break, not the keeper-token engulfing, not the attest-token shooting star, not the lane-token dark-cloud, not the peer-token three-crows, not the quorum-token hanging man, not the shard-token harami, not the prover-token marubozu, not the bundle-token gravestone, not the witness-token tape harami-cross, and not a live exchange.",
      whyMarketMoved: "The harami-cross close held and the merkle token leaked as inclusion-proof beta stayed offered with risk.",
      evidence: "Merkle-token harami-cross tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "crypto-macro",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-macro-reveal-spinning-top",
    title: "Reveal token prints a spinning top as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE reveal token ground higher, then printed a spinning top: a small real body near the middle of the bar with upper and lower wicks of similar length as risk appetite faded. Reveal tokens are the reveal-phase beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the pause means the grind must resume. Practice data only — not a live exchange. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Reveal token sold with reveal-phase beta. Spinning top. Thin chatter: the pause means the grind must resume. No protocol change.",
    preOhlc: REVEAL_PRE,
    postOhlc: withAftermath(REVEAL_PRE, [
      bar("+1", 10.73, 10.768, 10.548, 10.582),
      bar("+2", 10.582, 10.618, 10.386, 10.422),
      bar("+3", 10.422, 10.458, 10.214, 10.248),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this token falling when it is the reveal-phase beta side. A spinning top after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar has a small real body near the middle with wicks both ways; this is not a hanging man (that sits near the highs with a long lower wick only) and not a shooting star (that sits near the lows with a long upper wick only). This is not a harami cross: the last bar is not a doji sitting inside the prior body. This is not a gravestone (open and close are not pinned to the lows). This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. This is not the MEV-relay inside-bar-still-ahead HOLD: there is no official operator note still ahead. HOLD if the slip already has your size. This is not leftover protocol math, not the carbon-credit dump-then-harami, not the compute-rental CPI coil, not the lithium brine grind, not the social-token dump-no-reclaim, not the liquidity-pool evening star, not the wrapped-asset outside bar, not the sequencer-token fail-break, not the keeper-token engulfing, not the attest-token shooting star, not the lane-token dark-cloud, not the peer-token three-crows, not the quorum-token hanging man, not the shard-token harami, not the prover-token marubozu, not the bundle-token gravestone, not the merkle-token harami-cross, not the commit-token spinning-top tape, and not a live exchange.",
      whyMarketMoved: "The spinning-top close held and the reveal token leaked as reveal-phase beta stayed offered with risk.",
      evidence: "Reveal-token spinning-top tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "crypto-macro",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-macro-seal-long-legged-doji",
    title: "Seal token prints a long-legged doji as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE seal token ground higher, then printed a long-legged doji: open and close sit together with long upper and lower wicks of similar length as risk appetite faded. Seal tokens are the sealed-bid auction beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the long-legged pause means the grind must resume. Practice data only — not a live exchange. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Seal token sold with sealed-bid beta. Long-legged doji. Thin chatter: the long-legged pause means the grind must resume. No protocol change.",
    preOhlc: SEAL_PRE,
    postOhlc: withAftermath(SEAL_PRE, [
      bar("+1", 1.4228, 1.4286, 1.3886, 1.3942),
      bar("+2", 1.3942, 1.3998, 1.3548, 1.3616),
      bar("+3", 1.3616, 1.3672, 1.3186, 1.3258),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this token falling when it is the sealed-bid auction beta side. A long-legged doji after a grind is usually fade-or-wait, not a chase of the pause as a resume. Open and close sit together with long wicks both ways; this is not a spinning top (that has a small real body). This is not a gravestone (open and close are not pinned to the lows with a long upper wick only). This is not a harami cross: the doji is not sitting inside the prior body. This is not a hanging man (no long lower wick only) and not a shooting star (no long upper wick from the lows). This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. This is not the MEV-relay inside-bar-still-ahead HOLD: there is no official operator note still ahead. HOLD if the slip already has your size. This is not leftover protocol math, not the carbon-credit dump-then-harami, not the compute-rental CPI coil, not the lithium brine grind, not the social-token dump-no-reclaim, not the liquidity-pool evening star, not the wrapped-asset outside bar, not the sequencer-token fail-break, not the keeper-token engulfing, not the attest-token shooting star, not the lane-token dark-cloud, not the peer-token three-crows, not the quorum-token hanging man, not the shard-token harami, not the prover-token marubozu, not the bundle-token gravestone, not the merkle-token harami-cross, not the reveal-token spinning top, not the hint-token tape long-legged doji, not the commit-token spinning-top tape, and not a live exchange.",
      whyMarketMoved: "The long-legged-doji close held and the seal token leaked as sealed-bid beta stayed offered with risk.",
      evidence: "Seal-token long-legged-doji tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "crypto-macro",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-macro-ink-dragonfly",
    title: "Ink token prints a dragonfly doji as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE ink token ground higher, then printed a dragonfly doji: open and close sit together at the highs with a long lower wick only as risk appetite faded. Ink tokens are the preimage-ink beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the dragonfly pause means the grind must resume. Practice data only — not a live exchange. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Ink token sold with preimage-ink beta. Dragonfly doji. Thin chatter: the dragonfly pause means the grind must resume. No protocol change.",
    preOhlc: INK_PRE,
    postOhlc: withAftermath(INK_PRE, [
      bar("+1", 14.868, 14.898, 14.548, 14.586),
      bar("+2", 14.586, 14.618, 14.218, 14.264),
      bar("+3", 14.264, 14.298, 13.848, 13.892),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this token falling when it is the preimage-ink beta side. A dragonfly doji after a grind is usually fade-or-wait, not a chase of the pause as a resume. Open and close sit together at the highs with a long lower wick; this is not a hanging man (that has a small real body near the highs). This is not a gravestone (open and close are not pinned to the lows with a long upper wick). This is not a long-legged doji (no long upper wick). This is not a spinning top (no small real body in the middle). This is not a harami cross: the doji is not sitting inside the prior body. This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. This is not the MEV-relay inside-bar-still-ahead HOLD: there is no official operator note still ahead. HOLD if the slip already has your size. This is not leftover protocol math, not the carbon-credit dump-then-harami, not the compute-rental CPI coil, not the lithium brine grind, not the social-token dump-no-reclaim, not the liquidity-pool evening star, not the wrapped-asset outside bar, not the sequencer-token fail-break, not the keeper-token engulfing, not the attest-token shooting star, not the lane-token dark-cloud, not the peer-token three-crows, not the quorum-token hanging man, not the shard-token harami, not the prover-token marubozu, not the bundle-token gravestone, not the merkle-token harami-cross, not the reveal-token spinning top, not the seal-token long-legged doji, not the batch-token tape dragonfly, not the slot-token hanging man, and not a live exchange.",
      whyMarketMoved: "The dragonfly-doji close held and the ink token leaked as preimage-ink beta stayed offered with risk.",
      evidence: "Ink-token dragonfly-doji tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "crypto-macro",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-macro-wax-matching-high",
    title: "Wax token prints a matching high as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE wax token ground higher into a tall green bar, then printed a small green bar that tags nearly the same high and closes weak under it as risk appetite faded. Wax tokens are the wax-seal beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the matching-high pause means the grind must resume. Practice data only — not a live exchange. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Wax token sold with wax-seal beta. Matching high. Thin chatter: the matching-high pause means the grind must resume. No protocol change.",
    preOhlc: WAX_PRE,
    postOhlc: withAftermath(WAX_PRE, [
      bar("+1", 24.048, 24.086, 23.648, 23.698),
      bar("+2", 23.698, 23.748, 23.218, 23.268),
      bar("+3", 23.268, 23.318, 22.648, 22.698),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this token falling when it is the wax-seal beta side. A matching high after a grind is usually fade-or-wait, not a chase of the pause as a resume. Both bars are green and share nearly the same high; the last close sits weak under that high. This is not a tweezer: a tweezer tags the high with opposite-color bodies. This is not a shooting star (the last body is not sitting near the lows with a long upper wick only). This is not a dragonfly (open and close are not pinned to the highs with a long lower wick). This is not a harami: the last high pokes to the prior high, not a small body fully inside the prior body. This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. This is not the MEV-relay inside-bar-still-ahead HOLD: there is no official operator note still ahead. HOLD if the slip already has your size. This is not leftover protocol math, not the carbon-credit dump-then-harami, not the compute-rental CPI coil, not the lithium brine grind, not the social-token dump-no-reclaim, not the liquidity-pool evening star, not the wrapped-asset outside bar, not the sequencer-token fail-break, not the keeper-token engulfing, not the attest-token shooting star, not the lane-token dark-cloud, not the peer-token three-crows, not the quorum-token hanging man, not the shard-token harami, not the prover-token marubozu, not the bundle-token gravestone, not the merkle-token harami-cross, not the reveal-token spinning top, not the seal-token long-legged doji, not the ink-token dragonfly, not the quill-token matching-high tape, and not a live exchange.",
      whyMarketMoved: "The matching-high close held and the wax token leaked as wax-seal beta stayed offered with risk.",
      evidence: "Wax-token matching-high tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "crypto-macro",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-macro-forge-belt-hold",
    title: "Forge token prints a bearish belt hold as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE forge token ground higher, then printed a bearish belt hold: the last bar opens at its high with no upper wick and sells off, closing weak with a real body and a lower wick as risk appetite faded. Forge tokens are the forge-and-anvil beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the belt-hold pause means the grind must resume. Practice data only — not a live exchange. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Forge token sold with forge-and-anvil beta. Bearish belt hold. Thin chatter: the belt-hold pause means the grind must resume. No protocol change.",
    preOhlc: FORGE_PRE,
    postOhlc: withAftermath(FORGE_PRE, [
      bar("+1", 37.218, 37.268, 36.648, 36.698),
      bar("+2", 36.698, 36.748, 36.086, 36.136),
      bar("+3", 36.136, 36.186, 35.418, 35.468),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this token falling when it is the forge-and-anvil beta side. A bearish belt hold after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar opens at the high with no upper wick and sells off into a real body; a lower wick is allowed. This is not a marubozu: a marubozu has tiny wicks at both ends and closes near the low. This is not a matching high: both of those bars are green and share nearly the same high. This is not a hanging man (the body is not a small real body near the highs with a long lower wick). This is not a shooting star (there is no long upper wick from the lows). This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. This is not the MEV-relay inside-bar-still-ahead HOLD: there is no official operator note still ahead. HOLD if the slip already has your size. This is not leftover protocol math, not the carbon-credit dump-then-harami, not the compute-rental CPI coil, not the lithium brine grind, not the social-token dump-no-reclaim, not the liquidity-pool evening star, not the wrapped-asset outside bar, not the sequencer-token fail-break, not the keeper-token engulfing, not the attest-token shooting star, not the lane-token dark-cloud, not the peer-token three-crows, not the quorum-token hanging man, not the shard-token harami, not the prover-token marubozu, not the bundle-token gravestone, not the merkle-token harami-cross, not the reveal-token spinning top, not the seal-token long-legged doji, not the ink-token dragonfly, not the wax-token matching high, not the sigil-token tape belt hold, and not a live exchange.",
      whyMarketMoved: "The belt-hold close held and the forge token leaked as forge-and-anvil beta stayed offered with risk.",
      evidence: "Forge-token bearish-belt-hold tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "crypto-macro",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-macro-crest-separating-lines",
    title: "Crest token prints bearish separating lines as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE crest token ground higher into a tall green bar, then printed a long red bar that opens at nearly the same open as that green bar and sells off as risk appetite faded. Crest tokens are the crest-and-banner beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the separating-lines pause means the grind must resume. Practice data only — not a live exchange. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Crest token sold with crest-and-banner beta. Bearish separating lines. Thin chatter: the separating-lines pause means the grind must resume. No protocol change.",
    preOhlc: CREST_PRE,
    postOhlc: withAftermath(CREST_PRE, [
      bar("+1", 51.868, 52.248, 49.186, 49.648),
      bar("+2", 49.648, 50.018, 46.486, 46.918),
      bar("+3", 46.918, 47.286, 43.648, 44.186),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this token falling when it is the crest-and-banner beta side. Bearish separating lines after a grind are usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens at nearly the same open as the prior tall green and sells off. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick, usually after the prior close, not back at the prior open. This is not a marubozu: a marubozu has tiny wicks at both ends and closes near the low. This is not a matching high: both of those bars are green and share nearly the same high. This is not a hanging man (the body is not a small real body near the highs with a long lower wick). This is not a shooting star (there is no long upper wick from the lows). This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. This is not the MEV-relay inside-bar-still-ahead HOLD: there is no official operator note still ahead. HOLD if the slip already has your size. This is not leftover protocol math, not the carbon-credit dump-then-harami, not the compute-rental CPI coil, not the lithium brine grind, not the social-token dump-no-reclaim, not the liquidity-pool evening star, not the wrapped-asset outside bar, not the sequencer-token fail-break, not the keeper-token engulfing, not the attest-token shooting star, not the lane-token dark-cloud, not the peer-token three-crows, not the quorum-token hanging man, not the shard-token harami, not the prover-token marubozu, not the bundle-token gravestone, not the merkle-token harami-cross, not the reveal-token spinning top, not the seal-token long-legged doji, not the ink-token dragonfly, not the wax-token matching high, not the forge-token belt hold, not the glyph-token tape separating lines, not the sigil-token tape belt hold, and not a live exchange.",
      whyMarketMoved: "The separating-lines close held and the crest token leaked as crest-and-banner beta stayed offered with risk.",
      evidence: "Crest-token bearish-separating-lines tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "crypto-macro",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-macro-tome-on-neck",
    title: "Tome token prints a bearish on-neck as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE tome token ground higher into a tall green bar, then printed a long red bar that opens above that green close and closes at nearly the prior low as risk appetite faded. Tome tokens are the tome-and-script beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the on-neck pause means the grind must resume. Practice data only — not a live exchange. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Tome token sold with tome-and-script beta. Bearish on-neck. Thin chatter: the on-neck pause means the grind must resume. No protocol change.",
    preOhlc: TOME_PRE,
    postOhlc: withAftermath(TOME_PRE, [
      bar("+1", 70.186, 70.548, 67.286, 67.648),
      bar("+2", 67.648, 67.918, 64.486, 64.868),
      bar("+3", 64.868, 65.148, 61.286, 61.648),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this token falling when it is the tome-and-script beta side. A bearish on-neck after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens above the prior close and closes at nearly the prior low. This is not separating lines: those share nearly the same open as the prior tall green. This is not a dark-cloud: a dark-cloud closes in the lower half of the prior body, still above that prior open, not at the prior low. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick. This is not a matching high: both of those bars are green and share nearly the same high. This is not a hanging man (the body is not a small real body near the highs with a long lower wick). This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. This is not the MEV-relay inside-bar-still-ahead HOLD: there is no official operator note still ahead. This is not the cipher-token tape: that on-neck sits near 6.73, not this tome-and-script beta. HOLD if the slip already has your size. This is not leftover protocol math, not the carbon-credit dump-then-harami, not the compute-rental CPI coil, not the lithium brine grind, not the social-token dump-no-reclaim, not the liquidity-pool evening star, not the wrapped-asset outside bar, not the sequencer-token fail-break, not the keeper-token engulfing, not the attest-token shooting star, not the lane-token dark-cloud, not the peer-token three-crows, not the quorum-token hanging man, not the shard-token harami, not the prover-token marubozu, not the bundle-token gravestone, not the merkle-token harami-cross, not the reveal-token spinning top, not the seal-token long-legged doji, not the ink-token dragonfly, not the wax-token matching high, not the forge-token belt hold, not the crest-token separating lines, not the cipher-token tape on-neck, not the glyph-token tape separating lines, and not a live exchange.",
      whyMarketMoved: "The on-neck close held and the tome token leaked as tome-and-script beta stayed offered with risk.",
      evidence: "Tome-token bearish-on-neck tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "crypto-macro",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-macro-codex-in-neck",
    title: "Codex token prints a bearish in-neck as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE codex token ground higher into a tall green bar, then printed a long red bar that opens above that green close and closes at nearly that same close, not the prior low, as risk appetite faded. Codex tokens are the codex-and-index beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the in-neck pause means the grind must resume. Practice data only — not a live exchange. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Codex token sold with codex-and-index beta. Bearish in-neck. Thin chatter: the in-neck pause means the grind must resume. No protocol change.",
    preOhlc: CODEX_PRE,
    postOhlc: withAftermath(CODEX_PRE, [
      bar("+1", 32.868, 33.048, 32.186, 32.368),
      bar("+2", 32.368, 32.548, 31.486, 31.668),
      bar("+3", 31.668, 31.848, 30.486, 30.668),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this token falling when it is the codex-and-index beta side. A bearish in-neck after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens above the prior close and closes at nearly that same close, not the prior low. This is not on-neck: on-neck closes at nearly the prior low. This is not a dark-cloud: a dark-cloud closes in the lower half of the prior body, still above that prior open, not back at the prior close. This is not separating lines: those share nearly the same open as the prior tall green. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick. This is not a matching high: both of those bars are green and share nearly the same high. This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. This is not leftover protocol math. This is not the tome-token: that on-neck sits near 73.55, not this codex-and-index beta. This is not the scroll-token tape: that in-neck sits near 21.75. HOLD if the slip already has your size. This is not leftover protocol math, not the carbon-credit dump-then-harami, not the compute-rental CPI coil, not the lithium brine grind, not the social-token dump-no-reclaim, not the liquidity-pool evening star, not the wrapped-asset outside bar, not the sequencer-token fail-break, not the keeper-token engulfing, not the attest-token shooting star, not the lane-token dark-cloud, not the peer-token three-crows, not the quorum-token hanging man, not the shard-token harami, not the prover-token marubozu, not the bundle-token gravestone, not the merkle-token harami-cross, not the reveal-token spinning top, not the seal-token long-legged doji, not the ink-token dragonfly, not the wax-token matching high, not the forge-token belt hold, not the crest-token separating lines, not the tome-token on-neck, not the cipher-token tape on-neck, not the scroll-token tape in-neck, and not a live exchange.",
      whyMarketMoved: "The in-neck close held and the codex token leaked as codex-and-index beta stayed offered with risk.",
      evidence: "Codex-token bearish-in-neck tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "crypto-macro",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-macro-ward-thrusting",
    title: "Ward token prints a bearish thrusting line as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE ward token ground higher into a tall green bar, then printed a long red bar that opens above that green close and closes into that prior body, still above the midpoint, as risk appetite faded. Ward tokens are the ward-and-watch beta side in this SAMPLE brief, not a stablecoin. No protocol change. Thin chatter says the thrusting pause means the grind must resume. Practice data only — not a live exchange. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Ward token sold with ward-and-watch beta. Bearish thrusting line. Thin chatter: the thrusting pause means the grind must resume. No protocol change.",
    preOhlc: WARD_PRE,
    postOhlc: withAftermath(WARD_PRE, [
      bar("+1", 12.7686, 12.7884, 12.6286, 12.6486),
      bar("+2", 12.6486, 12.6684, 12.4986, 12.5186),
      bar("+3", 12.5186, 12.5384, 12.3486, 12.3686),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this token falling when it is the ward-and-watch beta side. A bearish thrusting line after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens above the prior close and closes into that prior body, still above the midpoint. This is not in-neck: in-neck closes at nearly the prior close. This is not on-neck: on-neck closes at nearly the prior low. This is not a dark-cloud: a dark-cloud closes in the lower half of the prior body, still above that prior open. This is not separating lines: those share nearly the same open as the prior tall green. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick. This is not a matching high: both of those bars are green and share nearly the same high. This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. This is not leftover protocol math. This is not the codex-token: that in-neck sits near 32.85, not this ward-and-watch beta. This is not the rune-token tape: that thrusting line sits near 0.79. This is not the merkle-token: that harami-cross sits near 12.38. HOLD if the slip already has your size. This is not leftover protocol math, not the carbon-credit dump-then-harami, not the compute-rental CPI coil, not the lithium brine grind, not the social-token dump-no-reclaim, not the liquidity-pool evening star, not the wrapped-asset outside bar, not the sequencer-token fail-break, not the keeper-token engulfing, not the attest-token shooting star, not the lane-token dark-cloud, not the peer-token three-crows, not the quorum-token hanging man, not the shard-token harami, not the prover-token marubozu, not the bundle-token gravestone, not the merkle-token harami-cross, not the reveal-token spinning top, not the seal-token long-legged doji, not the ink-token dragonfly, not the wax-token matching high, not the forge-token belt hold, not the crest-token separating lines, not the tome-token on-neck, not the codex-token in-neck, not the rune-token tape thrusting, and not a live exchange.",
      whyMarketMoved: "The thrusting close held and the ward token leaked as ward-and-watch beta stayed offered with risk.",
      evidence: "Ward-token bearish-thrusting tape plus a risk-off brief. Practice only.",
    },
    allowShort: false,
    packId: "crypto-macro",
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
  {
    id: "case-optctx-groc-falling-wedge",
    title: "Grocery underlying falling wedge after a trucking scare already in the tape",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "This SAMPLE grocer coiled into a falling wedge after a trucking-strike scare. A scheduled union note then says the strike is shorter than the scare. Thin leftover-premium chatter says you must be in. Name which side the grocer is on, then ask whether the scare is already in the wedge. This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Union note: strike shorter than the scare. Falling wedge still coiled. Leftover-premium chatter: must be in. Options context only.",
    preOhlc: GROC_PRE,
    postOhlc: withAftermath(GROC_PRE, [
      bar("+1", 42.06, 42.52, 42.02, 42.44),
      bar("+2", 42.44, 42.78, 42.36, 42.68),
      bar("+3", 42.68, 42.96, 42.58, 42.86),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A falling wedge after a trucking scare that a union note already bounded is often a wait-for-break, not a new shortage. The grocer is on the freight-scare side; a shorter strike is less tight. Leftover premium is not a stock fill. HOLD if you will not buy a SAMPLE grocer. This is not leftover-premium math, not the casino rising wedge, not the biotech three-push, and still no chain.",
      whyMarketMoved: "The wedge broke higher once the shorter-strike note bounded the scare.",
      evidence: "Grocery falling-wedge tape plus a shorter-strike union note. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-int-solar-head-shoulders",
    title: "Solar installer head-and-shoulders after the rebate move is already in",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE solar installer printed a left shoulder, a higher head, then a weaker right shoulder through a known rebate print. You have Indicators. Thin chatter says leftover premium means the right shoulder must break the head. Ask whether the event is already in the head. This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Rebate print already in. Thin chatter: leftover premium, right shoulder must break the head. Options context only.",
    preOhlc: SLR_PRE,
    postOhlc: withAftermath(SLR_PRE, [
      bar("+1", 27.2, 27.4, 25.6, 25.8),
      bar("+2", 25.8, 26.0, 24.4, 24.6),
      bar("+3", 24.6, 24.8, 23.2, 23.4),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Intermediate work is naming what is already in the price. A weaker right shoulder after a higher head is late-chase, not a new path. Leftover premium is not a stock fill. Fade or wait; HOLD if the slip already has your size. This is not leftover-premium math, not the grocery falling wedge, not the airline double-top, not the biotech three-push, and still no chain.",
      whyMarketMoved: "The right shoulder failed and the installer leaked through the neckline once the leftover-premium chase stalled.",
      evidence: "Solar-installer head-and-shoulders tape plus an event-already-printed brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "intermediate",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-int-towr-head-shoulders",
    title: "Tower underlying head-and-shoulders after the spectrum print is already in",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE tower operator printed a left shoulder, a higher head, then a weaker right shoulder through a known spectrum-auction print. You have Indicators. Thin chatter says leftover premium means the right shoulder must break the head. Ask whether the event is already in the head. This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Spectrum print already in. Thin chatter: leftover premium, right shoulder must break the head. Options context only.",
    preOhlc: TOWR_PRE,
    postOhlc: withAftermath(TOWR_PRE, [
      bar("+1", 109.5, 110.0, 104.0, 104.6),
      bar("+2", 104.6, 105.2, 99.8, 100.4),
      bar("+3", 100.4, 101.0, 96.2, 96.8),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Intermediate work is naming what is already in the price. A weaker right shoulder after a higher head is late-chase, not a new path. Leftover premium is not a stock fill. Fade or wait; HOLD if the slip already has your size. This is not leftover-premium math, not the solar-installer H&S, not the airline double-top, not the biotech three-push, and still no chain.",
      whyMarketMoved: "The right shoulder failed and the tower leaked through the neckline once the leftover-premium chase stalled.",
      evidence: "Tower head-and-shoulders tape plus an event-already-printed brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "intermediate",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-tape-rail-tweezer",
    title: "Railroad tweezer top after the merger print is already in",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE railroad rallied into two bars that share the same high after a known merger-clearance print. Thin chatter says leftover premium means the tweezer must break. Ask whether the event is already in those matching highs. This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Merger print already in. Thin chatter: leftover premium, railroad tweezer must break the match. Options context only.",
    preOhlc: RAIL_PRE,
    postOhlc: withAftermath(RAIL_PRE, [
      bar("+1", 69.4, 69.6, 67.8, 68.0),
      bar("+2", 68.0, 68.2, 66.4, 66.6),
      bar("+3", 66.6, 66.8, 65.0, 65.2),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Two matching highs after an event already printed is late-chase, not a new path. Leftover premium is not a stock fill. Fade or wait; HOLD if the slip already has your size. This is not leftover-premium math, not the tower H&S, not the solar-installer H&S, not the airline double-top, and still no chain.",
      whyMarketMoved: "The matched high held and the railroad leaked once the leftover-premium chase stalled.",
      evidence: "Railroad tweezer-top tape plus an event-already-printed brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-tape",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-tape-cemt-evening-star",
    title: "Cement evening star into an official quarry-permit note",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE cement producer rallied into a long green bar, a small star at the highs, then a red close back into that body. Then a scheduled permit note says the quarry expansion is delayed. Official text, not chatter. Thin leftover-premium talk is not the fill. This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Prepared permit note: quarry expansion delayed. Official text, not chatter. Options context only.",
    preOhlc: CEMT_PRE,
    postOhlc: withAftermath(CEMT_PRE, [
      bar("+1", 89.4, 89.48, 88.72, 88.8),
      bar("+2", 88.8, 88.88, 88.12, 88.2),
      bar("+3", 88.2, 88.28, 87.52, 87.6),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Treat an official permit note as a headline with a named author. A delayed quarry expansion can weigh on this stock. The evening star is already a pause, not a new volume path. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the railroad tweezer, not the waste-hauler harami, not the tower H&S, and still no chain.",
      whyMarketMoved: "The red close held and the cement name leaked once the delayed-permit note printed.",
      evidence: "Cement evening-star tape plus a prepared permit headline. No Greeks.",
    },
    allowShort: false,
    packId: "options-tape",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-tape-port-open-drive",
    title: "Port operator opens with a wide drive after an official harbor statement",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE port operator sat quiet, then opened with a wide drive higher after the harbor authority published a prepared statement: it will not delay the new berth as soon as markets hoped. Official text, not chatter. Thin leftover-premium talk is not the fill. This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Prepared statement: will not delay the new berth as soon as hoped. Official harbor text, not chatter. Options context only.",
    preOhlc: PORT_PRE,
    postOhlc: withAftermath(PORT_PRE, [
      bar("+1", 35.32, 35.74, 35.24, 35.62),
      bar("+2", 35.62, 35.98, 35.54, 35.86),
      bar("+3", 35.86, 36.18, 35.78, 36.08),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Treat an official statement as a headline with a named author. A berth that stays on schedule can bid this stock. The wide opening drive is often the story, not a fade. Leftover premium is not a stock fill. HOLD if the drive already has your size. This is not leftover-premium math, not the railroad tweezer, not the cement evening star, not the airline overnight-event drive, not the strait-importer coil, and still no chain.",
      whyMarketMoved: "The opening drive held and the port operator kept grinding as the on-schedule berth statement stayed in the tape.",
      evidence: "Port-operator opening-drive tape plus a prepared harbor headline. No Greeks.",
    },
    allowShort: false,
    packId: "options-tape",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-tape-brew-dump-no-reclaim",
    title: "Beverage dump on a tax scare, no reclaim",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE beverage maker already dumped after an excise-tax scare ran through the tape. Thin leftover-premium chatter says the first bounce must reclaim. The bounce has not shown up. Ask whether the scare is already in the dump. This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Tax scare already ran. Thin chatter: leftover premium, beverage dump must reclaim. No bounce yet. Options context only.",
    preOhlc: BREW_PRE,
    postOhlc: withAftermath(BREW_PRE, [
      bar("+1", 51.18, 51.32, 50.48, 50.54),
      bar("+2", 50.54, 50.68, 49.84, 49.9),
      bar("+3", 49.9, 50.04, 49.22, 49.28),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A dump with no reclaim is late-chase, not a new bounce path. Leftover premium is not a stock fill. Fade or wait; HOLD if the slip already has your size. This is not leftover-premium math, not the railroad tweezer, not the cement evening star, not the port opening drive, not the chip dump after the event, and still no chain.",
      whyMarketMoved: "The dump continued; no bounce showed up after the tax scare.",
      evidence: "Beverage dump-no-reclaim tape plus a scare-already-ran leftover-premium brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-tape",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-tape-lime-inside-bar",
    title: "Lime kiln inside bar into an official air-permit note still ahead",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE lime producer printed a wide bar, then smaller bars fully inside that range. A scheduled air-permit note is still ahead. Thin leftover-premium chatter says the inside must break up. This app grades the stock only — no chain, no Greeks. Chase a break that has not printed, or wait?",
    newsHeadline:
      "Inside bars on the lime kiln. Official air-permit note still ahead. Thin chatter: leftover premium must break up. Options context only.",
    preOhlc: LIME_PRE,
    postOhlc: withAftermath(LIME_PRE, [
      bar("+1", 41.44, 41.54, 41.32, 41.42),
      bar("+2", 41.42, 41.52, 41.3, 41.4),
      bar("+3", 41.4, 41.5, 41.3, 41.38),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["buy", "sell"],
    debrief: {
      process:
        "An inside bar into an official statement still ahead is a wait. HOLD is the process answer until a side actually breaks. BUY or SELL is only partial if you already had a thesis and sized small. Leftover premium is not a stock fill. This is not leftover-premium math, not the railroad tweezer, not the cement evening star, not the port opening drive, not the beverage dump, not the insurer inside-bar event wait, and still no chain.",
      whyMarketMoved: "The mother-bar range held; no clean break through the permit-note window.",
      evidence: "Lime-kiln inside-bar tape plus a permit-note-still-ahead leftover-premium brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-tape",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-tape-glss-outside-bar",
    title: "Glass-container maker prints an outside bar that closes weak",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE glass-container maker printed a wide bar that took both sides, then closed weak. Thin leftover-premium chatter says the upper wick must hold. This app grades the stock only — no chain, no Greeks. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Outside bar on the glass maker. Thin chatter: leftover premium, wick must hold. Options context only.",
    preOhlc: GLSS_PRE,
    postOhlc: withAftermath(GLSS_PRE, [
      bar("+1", 76.18, 76.26, 75.88, 75.94),
      bar("+2", 75.94, 76.02, 75.64, 75.7),
      bar("+3", 75.7, 75.78, 75.4, 75.46),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "An outside bar that closes weak is usually fade-or-wait, not a chase of the upper wick. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the railroad tweezer, not the cement evening star, not the port opening drive, not the beverage dump, not the lime-kiln inside bar, not the regional-bank outside bar, and still no chain.",
      whyMarketMoved: "The weak close continued lower; the upper wick did not hold.",
      evidence: "Glass-container outside-bar tape plus thin leftover-premium wick-must-hold chatter. No Greeks.",
    },
    allowShort: false,
    packId: "options-tape",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-tape-tank-fail-break",
    title: "Tank-farm operator pokes a range, then fails",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE tank-farm operator poked above a range, then slipped back. Thin leftover-premium chatter says the break must hold. This app grades the stock only — no chain, no Greeks. Chase the first green poke, wait, or take risk off?",
    newsHeadline:
      "Thin chatter: leftover premium, tank-farm range break must hold. Options context only.",
    preOhlc: TANK_PRE,
    postOhlc: withAftermath(TANK_PRE, [
      bar("+1", 37.38, 37.52, 37.08, 37.14),
      bar("+2", 37.14, 37.28, 36.84, 36.9),
      bar("+3", 36.9, 37.04, 36.6, 36.66),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A failed poke is usually fade-or-wait, not a chase. Do not treat the first green bar as a breakout. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the railroad tweezer, not the cement evening star, not the port opening drive, not the beverage dump, not the lime-kiln inside bar, not the glass-container outside bar, not the event-still-ahead fail-break, and still no chain.",
      whyMarketMoved: "The poke failed and the tank-farm operator slipped back through the range.",
      evidence: "Tank-farm failed-breakout tape plus thin leftover-premium range-break chatter. No Greeks.",
    },
    allowShort: false,
    packId: "options-tape",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-tape-roof-engulf",
    title: "Roofing maker prints a bearish engulfing after a small green bar",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE roofing maker printed a small green bar, then a red bar whose body swallowed that green body. Thin leftover-premium chatter says the first green must resume. This app grades the stock only — no chain, no Greeks. Chase the swallowed green, wait, or take risk off?",
    newsHeadline:
      "Bearish engulfing on the roofing maker. Thin chatter: leftover premium, first green must resume. Options context only.",
    preOhlc: ROOF_PRE,
    postOhlc: withAftermath(ROOF_PRE, [
      bar("+1", 19.112, 19.124, 19.076, 19.088),
      bar("+2", 19.088, 19.1, 19.052, 19.064),
      bar("+3", 19.064, 19.076, 19.028, 19.04),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish engulfing is usually fade-or-wait, not a chase of the swallowed green bar. This is not an outside bar: the red high stayed inside the prior high. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the railroad tweezer, not the cement evening star, not the port opening drive, not the beverage dump, not the lime-kiln inside bar, not the glass-container outside bar, not the tank-farm fail-break, not the asphalt-paver fail-break, not the event-still-ahead fail-break, not the regional-bank outside bar, and still no chain.",
      whyMarketMoved: "The engulfing close held and the roofing maker leaked; the small green bar did not resume.",
      evidence: "Roofing-maker bearish-engulfing tape plus thin leftover-premium first-green-must-resume chatter. No Greeks.",
    },
    allowShort: false,
    packId: "options-tape",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-tape-tile-shooting-star",
    title: "Tile kiln prints a shooting star after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE tile kiln ground higher, then printed a shooting star: a small body near the lows with a long upper wick. Thin leftover-premium chatter says the wick must continue. This app grades the stock only — no chain, no Greeks. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Shooting star on the tile kiln. Thin chatter: leftover premium, upper wick must continue. Options context only.",
    preOhlc: TILE_PRE,
    postOhlc: withAftermath(TILE_PRE, [
      bar("+1", 24.56, 24.62, 24.38, 24.42),
      bar("+2", 24.42, 24.48, 24.24, 24.28),
      bar("+3", 24.28, 24.34, 24.1, 24.14),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A shooting star after a grind is usually fade-or-wait, not a chase of the upper wick. This is not an outside bar: the low stayed inside the prior low. This is not an evening star (that is three bars) and not a bearish engulfing (the body did not swallow the prior body). Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the railroad tweezer, not the cement evening star, not the port opening drive, not the beverage dump, not the lime-kiln inside bar, not the glass-container outside bar, not the tank-farm fail-break, not the roofing-maker engulfing, not the brick-kiln macro engulfing, not the event-still-ahead fail-break, not the regional-bank outside bar, and still no chain.",
      whyMarketMoved: "The shooting-star close held and the tile kiln leaked; the upper wick did not continue.",
      evidence: "Tile-kiln shooting-star tape plus thin leftover-premium wick-must-continue chatter. No Greeks.",
    },
    allowShort: false,
    packId: "options-tape",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-tape-pipe-dark-cloud",
    title: "Pipe mill prints a dark-cloud cover after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE pipe mill printed a green bar, then a red bar that opened above that close and finished in the lower half of that body without swallowing it. Thin leftover-premium chatter says the gap-up open must continue. This app grades the stock only — no chain, no Greeks. Chase the gap-up, wait, or take risk off?",
    newsHeadline:
      "Dark-cloud cover on the pipe mill. Thin chatter: leftover premium, gap-up open must continue. Options context only.",
    preOhlc: PIPE_PRE,
    postOhlc: withAftermath(PIPE_PRE, [
      bar("+1", 27.274, 27.282, 27.238, 27.244),
      bar("+2", 27.244, 27.252, 27.208, 27.214),
      bar("+3", 27.214, 27.222, 27.178, 27.184),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A dark-cloud cover is usually fade-or-wait, not a chase of the gap-up open. The red close is inside the prior body, so this is not a bearish engulfing. This is not an outside bar: the low stayed inside the prior low. This is not a shooting star (that is one long upper wick) and not an evening star (that is three bars). Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the railroad tweezer, not the cement evening star, not the port opening drive, not the beverage dump, not the lime-kiln inside bar, not the glass-container outside bar, not the tank-farm fail-break, not the roofing-maker engulfing, not the tile-kiln shooting star, not the dock-token dark-cloud tape, and still no chain.",
      whyMarketMoved: "The dark-cloud close held and the pipe mill leaked; the gap-up open did not continue.",
      evidence: "Pipe-mill dark-cloud tape plus thin leftover-premium gap-up-must-continue chatter. No Greeks.",
    },
    allowShort: false,
    packId: "options-tape",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-tape-sand-three-crows",
    title: "Sand quarry prints three black crows after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE sand quarry ground higher, then printed three falling red bodies in a row. Thin leftover-premium chatter says the first red is a dip to buy. This app grades the stock only — no chain, no Greeks. Chase the dip, wait, or take risk off?",
    newsHeadline:
      "Three black crows on the sand quarry. Thin chatter: leftover premium, first red is a dip to buy. Options context only.",
    preOhlc: SAND_PRE,
    postOhlc: withAftermath(SAND_PRE, [
      bar("+1", 14.126, 14.134, 14.088, 14.096),
      bar("+2", 14.096, 14.104, 14.058, 14.066),
      bar("+3", 14.066, 14.074, 14.028, 14.036),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Three black crows after a grind are usually fade-or-wait, not a chase of the first red as a dip. This is not one bearish engulfing bar: three similar red bodies stepped lower. This is not an evening star (that is a small middle bar) and not a dark-cloud cover (that is two bars). Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the railroad tweezer, not the cement evening star, not the port opening drive, not the beverage dump, not the lime-kiln inside bar, not the glass-container outside bar, not the tank-farm fail-break, not the roofing-maker engulfing, not the tile-kiln shooting star, not the pipe-mill dark-cloud, not the node-token three-crows tape, and still no chain.",
      whyMarketMoved: "The third crow held and the sand quarry leaked; the first red was not a dip to buy.",
      evidence: "Sand-quarry three-black-crows tape plus thin leftover-premium dip-to-buy chatter. No Greeks.",
    },
    allowShort: false,
    packId: "options-tape",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-tape-grout-hanging-man",
    title: "Grout mill prints a hanging man after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE grout mill ground higher, then printed a hanging man: a small body near the highs with a long lower wick. Thin leftover-premium chatter says the lower wick must hold. This app grades the stock only — no chain, no Greeks. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Hanging man on the grout mill. Thin chatter: leftover premium, lower wick must hold. Options context only.",
    preOhlc: GROUT_PRE,
    postOhlc: withAftermath(GROUT_PRE, [
      bar("+1", 29.726, 29.742, 29.568, 29.586),
      bar("+2", 29.586, 29.602, 29.428, 29.446),
      bar("+3", 29.446, 29.462, 29.288, 29.306),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A hanging man after a grind is usually fade-or-wait, not a chase of the lower wick as a dip. This is not a shooting star: that is a long upper wick. This is not a hammer: a hammer shows up after a decline, not after a grind. This is not a doji and not three black crows. This is not an outside bar: the high stayed inside the prior high. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the railroad tweezer, not the cement evening star, not the port opening drive, not the beverage dump, not the lime-kiln inside bar, not the glass-container outside bar, not the tank-farm fail-break, not the roofing-maker engulfing, not the tile-kiln shooting star, not the pipe-mill dark-cloud, not the sand-quarry three-crows, not the slot-token hanging-man tape, and still no chain.",
      whyMarketMoved: "The hanging-man close held and the grout mill leaked; the lower wick did not hold.",
      evidence: "Grout-mill hanging-man tape plus thin leftover-premium lower-wick-must-hold chatter. No Greeks.",
    },
    allowShort: false,
    packId: "options-tape",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-tape-stucco-harami",
    title: "Stucco mill prints a bearish harami after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE stucco mill ground higher into a tall green bar, then printed a small body fully inside that green body. Thin leftover-premium chatter says the small inside body means the grind must resume. This app grades the stock only — no chain, no Greeks. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Bearish harami on the stucco mill. Thin chatter: leftover premium, small inside body means the grind must resume. Options context only.",
    preOhlc: STUCCO_PRE,
    postOhlc: withAftermath(STUCCO_PRE, [
      bar("+1", 51.676, 51.698, 51.598, 51.618),
      bar("+2", 51.618, 51.638, 51.528, 51.548),
      bar("+3", 51.548, 51.568, 51.448, 51.468),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish harami after a grind is usually fade-or-wait, not a chase of the small inside body as a resume. The small body sits inside the prior body; this is not a bearish engulfing. This is not a hanging man (no long lower wick) and not a shooting star (no long upper wick). This is not the lime-kiln inside-bar-still-ahead HOLD: there is no official air-permit note still ahead, and the process here is fade-or-wait, not wait-for-the-print. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the railroad tweezer, not the cement evening star, not the port opening drive, not the beverage dump, not the lime-kiln inside bar, not the glass-container outside bar, not the tank-farm fail-break, not the roofing-maker engulfing, not the tile-kiln shooting star, not the pipe-mill dark-cloud, not the sand-quarry three-crows, not the grout-mill hanging man, not the epoch-token harami tape, and still no chain.",
      whyMarketMoved: "The harami close held and the stucco mill leaked; the small inside body was not a resume of the grind.",
      evidence: "Stucco-mill bearish-harami tape plus thin leftover-premium grind-must-resume chatter. No Greeks.",
    },
    allowShort: false,
    packId: "options-tape",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-tape-joist-marubozu",
    title: "Joist mill prints a bearish marubozu after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE joist mill ground higher, then printed a long red bar that opened near its high and closed near its low, with almost no wicks. Thin leftover-premium chatter says the long red close must bounce. This app grades the stock only — no chain, no Greeks. Chase the red as a dip, wait, or take risk off?",
    newsHeadline:
      "Bearish marubozu on the joist mill. Thin chatter: leftover premium, long red close must bounce. Options context only.",
    preOhlc: JOIST_PRE,
    postOhlc: withAftermath(JOIST_PRE, [
      bar("+1", 43.204, 43.218, 43.118, 43.132),
      bar("+2", 43.132, 43.146, 43.046, 43.058),
      bar("+3", 43.058, 43.072, 42.972, 42.986),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish marubozu after a grind is usually fade-or-wait, not a chase of the long red close as a bounce. The bar opened near the high and closed near the low with tiny wicks; this is not a hanging man (no long lower wick) and not a shooting star (no long upper wick). This is not a bearish engulfing: the red body does not swallow the prior green body. This is not three black crows (one bar, not three) and not a dark-cloud cover (that opens above the prior close and stays inside the prior body). This is not a harami: the last bar is large, not a small body inside the prior body. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the railroad tweezer, not the cement evening star, not the port opening drive, not the beverage dump, not the lime-kiln inside bar, not the glass-container outside bar, not the tank-farm fail-break, not the roofing-maker engulfing, not the tile-kiln shooting star, not the pipe-mill dark-cloud, not the sand-quarry three-crows, not the grout-mill hanging man, not the stucco-mill harami, not the nonce-token marubozu tape, and still no chain.",
      whyMarketMoved: "The marubozu close held and the joist mill leaked; the long red close was not a bounce.",
      evidence: "Joist-mill bearish-marubozu tape plus thin leftover-premium long-red-must-bounce chatter. No Greeks.",
    },
    allowShort: false,
    packId: "options-tape",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-tape-purlin-gravestone",
    title: "Purlin mill prints a gravestone doji after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE purlin mill ground higher, then printed a gravestone doji: open and close sit on the lows with a long upper wick and almost no body. Thin leftover-premium chatter says the wick must continue. This app grades the stock only — no chain, no Greeks. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Gravestone doji on the purlin mill. Thin chatter: leftover premium, upper wick must continue. Options context only.",
    preOhlc: PURLIN_PRE,
    postOhlc: withAftermath(PURLIN_PRE, [
      bar("+1", 63.476, 63.492, 63.318, 63.334),
      bar("+2", 63.334, 63.348, 63.168, 63.184),
      bar("+3", 63.184, 63.198, 63.018, 63.034),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A gravestone doji after a grind is usually fade-or-wait, not a chase of the upper wick. Open and close sit on the lows with almost no body; this is not a shooting star (that has a small real body near the lows). This is not a hanging man (no long lower wick) and not a marubozu (this bar has a long upper wick). This is not an outside bar: the low stayed inside the prior low. This is not a harami (the last bar is not a small body inside the prior body). Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the railroad tweezer, not the cement evening star, not the port opening drive, not the beverage dump, not the lime-kiln inside bar, not the glass-container outside bar, not the tank-farm fail-break, not the roofing-maker engulfing, not the tile-kiln shooting star, not the pipe-mill dark-cloud, not the sand-quarry three-crows, not the grout-mill hanging man, not the stucco-mill harami, not the joist-mill marubozu, not the gossip-token gravestone tape, and still no chain.",
      whyMarketMoved: "The gravestone close held and the purlin mill leaked; the upper wick did not continue.",
      evidence: "Purlin-mill gravestone-doji tape plus thin leftover-premium wick-must-continue chatter. No Greeks.",
    },
    allowShort: false,
    packId: "options-tape",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-tape-truss-harami-cross",
    title: "Truss mill prints a harami cross after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE truss mill ground higher into a tall green bar, then printed a doji fully inside that green body. Thin leftover-premium chatter says the doji means the grind must resume. This app grades the stock only — no chain, no Greeks. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Harami cross on the truss mill. Thin chatter: leftover premium, the doji means the grind must resume. Options context only.",
    preOhlc: TRUSS_PRE,
    postOhlc: withAftermath(TRUSS_PRE, [
      bar("+1", 81.632, 81.652, 81.478, 81.496),
      bar("+2", 81.496, 81.514, 81.328, 81.346),
      bar("+3", 81.346, 81.364, 81.168, 81.186),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A harami cross after a grind is usually fade-or-wait, not a chase of the inside doji as a resume. The doji sits inside the prior body; this is not a bearish harami with a small real body, and not a gravestone (open and close are not pinned to the lows with a long upper wick). This is not a hanging man (no long lower wick) and not a shooting star (no long upper wick from the lows). This is not the lime-kiln inside-bar-still-ahead HOLD: there is no official air-permit note still ahead, and the process here is fade-or-wait, not wait-for-the-print. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the railroad tweezer, not the cement evening star, not the port opening drive, not the beverage dump, not the lime-kiln inside bar, not the glass-container outside bar, not the tank-farm fail-break, not the roofing-maker engulfing, not the tile-kiln shooting star, not the pipe-mill dark-cloud, not the sand-quarry three-crows, not the grout-mill hanging man, not the stucco-mill harami, not the joist-mill marubozu, not the purlin-mill gravestone, not the witness-token harami-cross tape, and still no chain.",
      whyMarketMoved: "The harami-cross close held and the truss mill leaked; the inside doji was not a resume of the grind.",
      evidence: "Truss-mill harami-cross tape plus thin leftover-premium doji-must-resume chatter. No Greeks.",
    },
    allowShort: false,
    packId: "options-tape",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-tape-ridge-spinning-top",
    title: "Ridge mill prints a spinning top after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE ridge mill ground higher, then printed a spinning top: a small real body near the middle of the bar with upper and lower wicks of similar length. Thin leftover-premium chatter says the pause means the grind must resume. This app grades the stock only — no chain, no Greeks. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Spinning top on the ridge mill. Thin chatter: leftover premium, the pause means the grind must resume. Options context only.",
    preOhlc: RIDGE_PRE,
    postOhlc: withAftermath(RIDGE_PRE, [
      bar("+1", 47.684, 47.718, 47.428, 47.456),
      bar("+2", 47.456, 47.486, 47.168, 47.198),
      bar("+3", 47.198, 47.228, 46.886, 46.918),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A spinning top after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar has a small real body near the middle with wicks both ways; this is not a hanging man (that sits near the highs with a long lower wick only) and not a shooting star (that sits near the lows with a long upper wick only). This is not a harami cross: the last bar is not a doji sitting inside the prior body. This is not a gravestone (open and close are not pinned to the lows). This is not the lime-kiln inside-bar-still-ahead HOLD: there is no official air-permit note still ahead, and the process here is fade-or-wait, not wait-for-the-print. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the railroad tweezer, not the cement evening star, not the port opening drive, not the beverage dump, not the lime-kiln inside bar, not the glass-container outside bar, not the tank-farm fail-break, not the roofing-maker engulfing, not the tile-kiln shooting star, not the pipe-mill dark-cloud, not the sand-quarry three-crows, not the grout-mill hanging man, not the stucco-mill harami, not the joist-mill marubozu, not the purlin-mill gravestone, not the truss-mill harami-cross, not the rebar hanging man, not the commit-token spinning-top tape, and still no chain.",
      whyMarketMoved: "The spinning-top close held and the ridge mill leaked; the pause was not a resume of the grind.",
      evidence: "Ridge-mill spinning-top tape plus thin leftover-premium pause-must-resume chatter. No Greeks.",
    },
    allowShort: false,
    packId: "options-tape",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-tape-eave-long-legged-doji",
    title: "Eave mill prints a long-legged doji after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE eave mill ground higher, then printed a long-legged doji: open and close sit together with long upper and lower wicks of similar length. Thin leftover-premium chatter says the long-legged pause means the grind must resume. This app grades the stock only — no chain, no Greeks. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Long-legged doji on the eave mill. Thin chatter: leftover premium, the long-legged pause means the grind must resume. Options context only.",
    preOhlc: EAVE_PRE,
    postOhlc: withAftermath(EAVE_PRE, [
      bar("+1", 33.448, 33.498, 33.148, 33.186),
      bar("+2", 33.186, 33.228, 32.868, 32.908),
      bar("+3", 32.908, 32.948, 32.568, 32.608),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A long-legged doji after a grind is usually fade-or-wait, not a chase of the pause as a resume. Open and close sit together with long wicks both ways; this is not a spinning top (that has a small real body). This is not a gravestone (open and close are not pinned to the lows with a long upper wick only). This is not a harami cross: the doji is not sitting inside the prior body. This is not a hanging man (no long lower wick only) and not a shooting star (no long upper wick from the lows). This is not the lime-kiln inside-bar-still-ahead HOLD: there is no official air-permit note still ahead, and the process here is fade-or-wait, not wait-for-the-print. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the railroad tweezer, not the cement evening star, not the port opening drive, not the beverage dump, not the lime-kiln inside bar, not the glass-container outside bar, not the tank-farm fail-break, not the roofing-maker engulfing, not the tile-kiln shooting star, not the pipe-mill dark-cloud, not the sand-quarry three-crows, not the grout-mill hanging man, not the stucco-mill harami, not the joist-mill marubozu, not the purlin-mill gravestone, not the truss-mill harami-cross, not the ridge-mill spinning top, not the gable-mill spinning-top macro, not the hint-token long-legged-doji tape, and still no chain.",
      whyMarketMoved: "The long-legged-doji close held and the eave mill leaked; the pause was not a resume of the grind.",
      evidence: "Eave-mill long-legged-doji tape plus thin leftover-premium long-legged-pause-must-resume chatter. No Greeks.",
    },
    allowShort: false,
    packId: "options-tape",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-tape-flash-dragonfly",
    title: "Flash mill prints a dragonfly doji after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE flash mill ground higher, then printed a dragonfly doji: open and close sit together at the highs with a long lower wick only. Thin leftover-premium chatter says the dragonfly pause means the grind must resume. This app grades the stock only — no chain, no Greeks. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Dragonfly doji on the flash mill. Thin chatter: leftover premium, the dragonfly pause means the grind must resume. Options context only.",
    preOhlc: FLASH_PRE,
    postOhlc: withAftermath(FLASH_PRE, [
      bar("+1", 20.448, 20.518, 20.086, 20.148),
      bar("+2", 20.148, 20.218, 19.728, 19.798),
      bar("+3", 19.798, 19.868, 19.348, 19.418),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A dragonfly doji after a grind is usually fade-or-wait, not a chase of the pause as a resume. Open and close sit together at the highs with a long lower wick; this is not a hanging man (that has a small real body near the highs). This is not a gravestone (open and close are not pinned to the lows with a long upper wick). This is not a long-legged doji (no long upper wick). This is not a spinning top (no small real body in the middle). This is not a harami cross: the doji is not sitting inside the prior body. This is not the lime-kiln inside-bar-still-ahead HOLD: there is no official air-permit note still ahead, and the process here is fade-or-wait, not wait-for-the-print. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the railroad tweezer, not the cement evening star, not the port opening drive, not the beverage dump, not the lime-kiln inside bar, not the glass-container outside bar, not the tank-farm fail-break, not the roofing-maker engulfing, not the tile-kiln shooting star, not the pipe-mill dark-cloud, not the sand-quarry three-crows, not the grout-mill hanging man, not the stucco-mill harami, not the joist-mill marubozu, not the purlin-mill gravestone, not the truss-mill harami-cross, not the ridge-mill spinning top, not the eave-mill long-legged doji, not the gable-mill spinning-top macro, not the hip-mill long-legged-doji macro, not the batch-token dragonfly tape, and still no chain.",
      whyMarketMoved: "The dragonfly-doji close held and the flash mill leaked; the pause was not a resume of the grind.",
      evidence: "Flash-mill dragonfly-doji tape plus thin leftover-premium dragonfly-pause-must-resume chatter. No Greeks.",
    },
    allowShort: false,
    packId: "options-tape",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-tape-dormer-matching-high",
    title: "Dormer mill prints a matching high after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE dormer mill ground higher into a tall green bar, then printed a small green bar that tags nearly the same high and closes weak under it. Thin leftover-premium chatter says the matching-high pause means the grind must resume. This app grades the stock only — no chain, no Greeks. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Matching high on the dormer mill. Thin chatter: leftover premium, the matching-high pause means the grind must resume. Options context only.",
    preOhlc: DORMER_PRE,
    postOhlc: withAftermath(DORMER_PRE, [
      bar("+1", 31.128, 31.168, 30.748, 30.798),
      bar("+2", 30.798, 30.838, 30.386, 30.442),
      bar("+3", 30.442, 30.486, 29.918, 29.968),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A matching high after a grind is usually fade-or-wait, not a chase of the pause as a resume. Both bars are green and share nearly the same high; the last close sits weak under that high. This is not a tweezer: a tweezer tags the high with opposite-color bodies. This is not a shooting star (the last body is not sitting near the lows with a long upper wick only). This is not a dragonfly (open and close are not pinned to the highs with a long lower wick). This is not a harami: the last high pokes to the prior high, not a small body fully inside the prior body. This is not the lime-kiln inside-bar-still-ahead HOLD: there is no official air-permit note still ahead, and the process here is fade-or-wait, not wait-for-the-print. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the railroad tweezer, not the cement evening star, not the port opening drive, not the beverage dump, not the lime-kiln inside bar, not the glass-container outside bar, not the tank-farm fail-break, not the roofing-maker engulfing, not the tile-kiln shooting star, not the pipe-mill dark-cloud, not the sand-quarry three-crows, not the grout-mill hanging man, not the stucco-mill harami, not the joist-mill marubozu, not the purlin-mill gravestone, not the truss-mill harami-cross, not the ridge-mill spinning top, not the eave-mill long-legged doji, not the flash-mill dragonfly, not the sill-mill dragonfly macro, not the quill-token matching-high tape, and still no chain.",
      whyMarketMoved: "The matching-high close held and the dormer mill leaked; the pause was not a resume of the grind.",
      evidence: "Dormer-mill matching-high tape plus thin leftover-premium matching-high-pause-must-resume chatter. No Greeks.",
    },
    allowShort: false,
    packId: "options-tape",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-tape-gutter-belt-hold",
    title: "Gutter mill prints a bearish belt hold after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE gutter mill ground higher, then printed a bearish belt hold: the last bar opens at its high with no upper wick and sells off, closing weak with a real body and a lower wick. Thin leftover-premium chatter says the belt-hold pause means the grind must resume. This app grades the stock only — no chain, no Greeks. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Bearish belt hold on the gutter mill. Thin chatter: leftover premium, the belt-hold pause means the grind must resume. Options context only.",
    preOhlc: GUTTER_PRE,
    postOhlc: withAftermath(GUTTER_PRE, [
      bar("+1", 18.468, 18.518, 18.086, 18.136),
      bar("+2", 18.136, 18.186, 17.648, 17.698),
      bar("+3", 17.698, 17.748, 17.086, 17.148),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish belt hold after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar opens at the high with no upper wick and sells off into a real body; a lower wick is allowed. This is not a marubozu: a marubozu has tiny wicks at both ends and closes near the low. This is not a matching high: both of those bars are green and share nearly the same high. This is not a hanging man (the body is not a small real body near the highs with a long lower wick). This is not a shooting star (there is no long upper wick from the lows). Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the railroad tweezer, not the cement evening star, not the port opening drive, not the beverage dump, not the lime-kiln inside bar, not the glass-container outside bar, not the tank-farm fail-break, not the roofing-maker engulfing, not the tile-kiln shooting star, not the pipe-mill dark-cloud, not the sand-quarry three-crows, not the grout-mill hanging man, not the stucco-mill harami, not the joist-mill marubozu, not the purlin-mill gravestone, not the truss-mill harami-cross, not the ridge-mill spinning top, not the eave-mill long-legged doji, not the flash-mill dragonfly, not the dormer-mill matching high, not the rafter-mill matching-high macro, and still no chain.",
      whyMarketMoved: "The belt-hold close held and the gutter mill leaked; the pause was not a resume of the grind.",
      evidence: "Gutter-mill bearish-belt-hold tape plus thin leftover-premium belt-hold-pause-must-resume chatter. No Greeks.",
    },
    allowShort: false,
    packId: "options-tape",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-tape-stud-separating-lines",
    title: "Stud mill prints bearish separating lines after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE stud mill ground higher into a tall green bar, then printed a long red bar that opens at nearly the same open as that green bar and sells off. Thin leftover-premium chatter says the separating-lines pause means the grind must resume. This app grades the stock only — no chain, no Greeks. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Bearish separating lines on the stud mill. Thin chatter: leftover premium, the separating-lines pause means the grind must resume. Options context only.",
    preOhlc: STUD_PRE,
    postOhlc: withAftermath(STUD_PRE, [
      bar("+1", 61.848, 62.148, 59.486, 59.868),
      bar("+2", 59.868, 60.148, 57.286, 57.648),
      bar("+3", 57.648, 57.918, 54.486, 54.868),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Bearish separating lines after a grind are usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens at nearly the same open as the prior tall green and sells off. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick, usually after the prior close, not back at the prior open. This is not a marubozu: a marubozu has tiny wicks at both ends and closes near the low. This is not a matching high: both of those bars are green and share nearly the same high. This is not a hanging man (the body is not a small real body near the highs with a long lower wick). This is not a shooting star (there is no long upper wick from the lows). Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the railroad tweezer, not the cement evening star, not the port opening drive, not the beverage dump, not the lime-kiln inside bar, not the glass-container outside bar, not the tank-farm fail-break, not the roofing-maker engulfing, not the tile-kiln shooting star, not the pipe-mill dark-cloud, not the sand-quarry three-crows, not the grout-mill hanging man, not the stucco-mill harami, not the joist-mill marubozu, not the purlin-mill gravestone, not the truss-mill harami-cross, not the ridge-mill spinning top, not the eave-mill long-legged doji, not the flash-mill dragonfly, not the dormer-mill matching high, not the gutter-mill belt hold, not the rafter-mill matching-high macro, not the mullion-mill belt-hold macro, not the glyph-token separating-lines tape, and still no chain.",
      whyMarketMoved: "The separating-lines close held and the stud mill leaked; the pause was not a resume of the grind.",
      evidence: "Stud-mill bearish-separating-lines tape plus thin leftover-premium separating-lines-pause-must-resume chatter. No Greeks.",
    },
    allowShort: false,
    packId: "options-tape",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-tape-jamb-on-neck",
    title: "Jamb mill prints a bearish on-neck after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE jamb mill ground higher into a tall green bar, then printed a long red bar that opens above that green close and closes at nearly the prior low. Thin leftover-premium chatter says the on-neck pause means the grind must resume. This app grades the stock only — no chain, no Greeks. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Bearish on-neck on the jamb mill. Thin chatter: leftover premium, the on-neck pause means the grind must resume. Options context only.",
    preOhlc: JAMB_PRE,
    postOhlc: withAftermath(JAMB_PRE, [
      bar("+1", 98.186, 98.548, 95.286, 95.648),
      bar("+2", 95.648, 95.918, 92.486, 92.868),
      bar("+3", 92.868, 93.148, 89.286, 89.648),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish on-neck after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens above the prior close and closes at nearly the prior low. This is not separating lines: those share nearly the same open as the prior tall green. This is not a dark-cloud: a dark-cloud closes in the lower half of the prior body, still above that prior open, not at the prior low. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick. This is not a matching high: both of those bars are green and share nearly the same high. This is not a hanging man (the body is not a small real body near the highs with a long lower wick). Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the railroad tweezer, not the cement evening star, not the port opening drive, not the beverage dump, not the lime-kiln inside bar, not the glass-container outside bar, not the tank-farm fail-break, not the roofing-maker engulfing, not the tile-kiln shooting star, not the pipe-mill dark-cloud, not the sand-quarry three-crows, not the grout-mill hanging man, not the stucco-mill harami, not the joist-mill marubozu, not the purlin-mill gravestone, not the truss-mill harami-cross, not the ridge-mill spinning top, not the eave-mill long-legged doji, not the flash-mill dragonfly, not the dormer-mill matching high, not the gutter-mill belt hold, not the stud-mill separating lines, not the sash-mill separating-lines macro, not the cipher-token on-neck tape, and still no chain.",
      whyMarketMoved: "The on-neck close held and the jamb mill leaked; the pause was not a resume of the grind.",
      evidence: "Jamb-mill bearish-on-neck tape plus thin leftover-premium on-neck-pause-must-resume chatter. No Greeks.",
    },
    allowShort: false,
    packId: "options-tape",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-tape-newel-in-neck",
    title: "Newel mill prints a bearish in-neck after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE newel mill ground higher into a tall green bar, then printed a long red bar that opens above that green close and closes at nearly that same close, not the prior low. Thin leftover-premium chatter says the in-neck pause means the grind must resume. This app grades the stock only — no chain, no Greeks. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Bearish in-neck on the newel mill. Thin chatter: leftover premium, the in-neck pause means the grind must resume. Options context only.",
    preOhlc: NEWEL_PRE,
    postOhlc: withAftermath(NEWEL_PRE, [
      bar("+1", 58.286, 58.548, 56.286, 56.648),
      bar("+2", 56.648, 56.918, 54.286, 54.668),
      bar("+3", 54.668, 54.948, 51.286, 51.648),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish in-neck after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens above the prior close and closes at nearly that same close, not the prior low. This is not on-neck: on-neck closes at nearly the prior low. This is not a dark-cloud: a dark-cloud closes in the lower half of the prior body, still above that prior open, not back at the prior close. This is not separating lines: those share nearly the same open as the prior tall green. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick. This is not a matching high: both of those bars are green and share nearly the same high. This is not the jamb-mill tape: that on-neck sits near 101.65 leftover premium, not this newel mill. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the railroad tweezer, not the cement evening star, not the port opening drive, not the beverage dump, not the lime-kiln inside bar, not the glass-container outside bar, not the tank-farm fail-break, not the roofing-maker engulfing, not the tile-kiln shooting star, not the pipe-mill dark-cloud, not the sand-quarry three-crows, not the grout-mill hanging man, not the stucco-mill harami, not the joist-mill marubozu, not the purlin-mill gravestone, not the truss-mill harami-cross, not the ridge-mill spinning top, not the eave-mill long-legged doji, not the flash-mill dragonfly, not the dormer-mill matching high, not the gutter-mill belt hold, not the stud-mill separating lines, not the jamb-mill on-neck, not the lath-mill on-neck macro, not the scroll-token in-neck tape, and still no chain.",
      whyMarketMoved: "The in-neck close held and the newel mill leaked; the pause was not a resume of the grind.",
      evidence: "Newel-mill bearish-in-neck tape plus thin leftover-premium in-neck-pause-must-resume chatter. No Greeks.",
    },
    allowShort: false,
    packId: "options-tape",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-tape-spandrel-thrusting",
    title: "Spandrel mill prints a bearish thrusting line after a grind",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE spandrel mill ground higher into a tall green bar, then printed a long red bar that opens above that green close and closes into that prior body, still above the midpoint. Thin leftover-premium chatter says the thrusting pause means the grind must resume. This app grades the stock only — no chain, no Greeks. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Bearish thrusting line on the spandrel mill. Thin chatter: leftover premium, the thrusting pause means the grind must resume. Options context only.",
    preOhlc: SPANDREL_PRE,
    postOhlc: withAftermath(SPANDREL_PRE, [
      bar("+1", 179.468, 179.848, 177.186, 177.548),
      bar("+2", 177.548, 177.918, 174.486, 174.868),
      bar("+3", 174.868, 175.248, 171.286, 171.648),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A bearish thrusting line after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens above the prior close and closes into that prior body, still above the midpoint. This is not in-neck: in-neck closes at nearly the prior close. This is not on-neck: on-neck closes at nearly the prior low. This is not a dark-cloud: a dark-cloud closes in the lower half of the prior body, still above that prior open. This is not separating lines: those share nearly the same open as the prior tall green. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick. This is not a matching high: both of those bars are green and share nearly the same high. This is not the newel-mill tape: that in-neck sits near 58.75 leftover premium, not this spandrel mill. This is not the jamb-mill tape: that on-neck sits near 101.65. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the railroad tweezer, not the cement evening star, not the port opening drive, not the beverage dump, not the lime-kiln inside bar, not the glass-container outside bar, not the tank-farm fail-break, not the roofing-maker engulfing, not the tile-kiln shooting star, not the pipe-mill dark-cloud, not the sand-quarry three-crows, not the grout-mill hanging man, not the stucco-mill harami, not the joist-mill marubozu, not the purlin-mill gravestone, not the truss-mill harami-cross, not the ridge-mill spinning top, not the eave-mill long-legged doji, not the flash-mill dragonfly, not the dormer-mill matching high, not the gutter-mill belt hold, not the stud-mill separating lines, not the jamb-mill on-neck, not the newel-mill in-neck, not the baluster-mill in-neck macro, not the rune-token thrusting tape, and still no chain.",
      whyMarketMoved: "The thrusting close held and the spandrel mill leaked; the pause was not a resume of the grind.",
      evidence: "Spandrel-mill bearish-thrusting tape plus thin leftover-premium thrusting-pause-must-resume chatter. No Greeks.",
    },
    allowShort: false,
    packId: "options-tape",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-macro-wste-harami",
    title: "Waste-hauler harami after a dump as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE waste-hauler already dumped as risk appetite faded. The last full bar is a small inside candle, not a reclaim. Thin leftover-premium chatter treats the inside bar as a bid. Ask whether that pause is a new path. This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Risk-off. Waste-hauler dumped with risk appetite, then printed a small inside bar. Thin chatter: leftover premium. Options context only.",
    preOhlc: WSTE_PRE,
    postOhlc: withAftermath(WSTE_PRE, [
      bar("+1", 59.8, 60.0, 58.6, 58.8),
      bar("+2", 58.8, 59.0, 57.6, 57.8),
      bar("+3", 57.8, 58.0, 56.6, 56.8),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this stock falling. A small inside bar after a dump is often a pause, not a reclaim. Leftover premium is not a stock fill. Fade or wait; HOLD if the slip already has your size. This is not leftover-premium math, not the railroad tweezer, not the grocery falling wedge, not the tower H&S, and still no chain.",
      whyMarketMoved: "The inside bar failed and the waste-hauler leaked as risk stayed offered.",
      evidence: "Waste-hauler dump-then-harami tape plus a risk-off brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-macro",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-macro-deal-cpi-print",
    title: "Auto dealer coiled into a hot CPI print",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "This SAMPLE auto dealer has been coiled in a tight range into a scheduled CPI print. The print comes in hot. Financing often tightens, so this name can sell. Thin leftover-premium talk is not the fill. This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Hot CPI print. Rate-cut odds fall. Auto dealer in focus. Thin chatter: leftover premium. Options context only.",
    preOhlc: DEAL_PRE,
    postOhlc: withAftermath(DEAL_PRE, [
      bar("+1", 23.78, 23.82, 23.48, 23.52),
      bar("+2", 23.52, 23.56, 23.22, 23.26),
      bar("+3", 23.26, 23.3, 22.96, 23.0),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Size for surprise into data. A hot CPI print can reprice financing, so this dealer can fall. Leftover premium is not a stock fill. HOLD if the coil already has your size. This is not leftover-premium math, not the waste-hauler risk-off harami, not the utility coil-before-the-print, not the homebuilder already-ran jobs tape, and still no chain.",
      whyMarketMoved: "The coil broke lower as the auto dealer sold the hot CPI print.",
      evidence: "Auto-dealer coil tape plus a CPI-print brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-macro",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-macro-fert-potash-supply",
    title: "Fertilizer grind into a potash-export freeze",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "This SAMPLE fertilizer name has been grinding higher. Then a potash-export freeze hits. Name which side this stock is on: the producer, not an importer. Thin leftover-premium talk is not the fill. This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Potash-export freeze. Fertilizer supply tight in this SAMPLE brief. Thin chatter: leftover premium. Options context only.",
    preOhlc: FERT_PRE,
    postOhlc: withAftermath(FERT_PRE, [
      bar("+1", 48.62, 49.28, 48.54, 49.16),
      bar("+2", 49.16, 49.72, 49.08, 49.58),
      bar("+3", 49.58, 50.12, 49.48, 49.96),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A supply scare can bid the producer that is actually short. Here fertilizer is the tight side, so this name can rise. Leftover premium is not a stock fill. HOLD if the grind already has your size. This is not leftover-premium math, not the importer shipping-lane coil, not the grocery trucking wedge, not the waste-hauler risk-off harami, not the auto-dealer CPI coil, and still no chain.",
      whyMarketMoved: "The grind continued as the fertilizer name bid the potash freeze.",
      evidence: "Fertilizer grind tape plus a producer-side export-freeze headline. No Greeks.",
    },
    allowShort: false,
    packId: "options-macro",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-macro-staff-dump-no-reclaim",
    title: "Staffing dump as risk appetite fades, no reclaim",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE staffing firm already dumped as risk appetite faded. The last bars keep making lower closes, not an inside pause. Thin leftover-premium chatter says the first bounce must reclaim. The bounce has not shown up. This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Risk-off. Staffing sold with cyclicals. Thin chatter: leftover premium, dump must reclaim. No bounce yet. Options context only.",
    preOhlc: STAFF_PRE,
    postOhlc: withAftermath(STAFF_PRE, [
      bar("+1", 13.18, 13.32, 12.48, 12.54),
      bar("+2", 12.54, 12.68, 11.84, 11.9),
      bar("+3", 11.9, 12.04, 11.22, 11.28),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this stock falling when staffing is the cyclical side. A dump with no reclaim is late-chase, not a new bounce path. Leftover premium is not a stock fill. Fade or wait; HOLD if the slip already has your size. This is not leftover-premium math, not the waste-hauler dump-then-harami, not the auto-dealer CPI coil, not the fertilizer potash grind, not the beverage tax dump, and still no chain.",
      whyMarketMoved: "The dump continued; no bounce showed up as staffing stayed offered with risk.",
      evidence: "Staffing dump-no-reclaim tape plus a risk-off leftover-premium brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-macro",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-macro-mill-evening-star",
    title: "Paper mill evening star as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE paper mill rallied into a long green bar, a small star at the highs, then a red close back into that body as risk appetite faded. Paper is the cyclical industrial in this SAMPLE brief, not duration. Thin leftover-premium chatter treats the evening star as a bid. This app grades the stock only — no chain, no Greeks.",
    newsHeadline:
      "Risk-off. Paper mill sold with cyclicals. Evening star at the highs, not a reclaim. Thin chatter: leftover premium. Options context only.",
    preOhlc: MILL_PRE,
    postOhlc: withAftermath(MILL_PRE, [
      bar("+1", 28.74, 28.82, 28.42, 28.48),
      bar("+2", 28.48, 28.56, 28.16, 28.22),
      bar("+3", 28.22, 28.3, 27.9, 27.96),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this stock falling when paper is the cyclical side. The evening star is already a pause, not a new bid path. Leftover premium is not a stock fill. Fade or wait; HOLD if the slip already has your size. This is not leftover-premium math, not the cement quarry evening star, not the waste-hauler dump-then-harami, not the auto-dealer CPI coil, not the fertilizer potash grind, not the staffing dump-no-reclaim, not the lime-kiln inside bar, and still no chain.",
      whyMarketMoved: "The red close held and the paper mill leaked as cyclicals stayed offered with risk.",
      evidence: "Paper-mill evening-star tape plus a risk-off leftover-premium brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-macro",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-macro-salt-outside-bar",
    title: "Salt miner prints an outside bar that closes weak as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE salt miner printed a wide bar that took both sides, then closed weak as risk appetite faded. Salt is the cyclical industrial in this SAMPLE brief, not duration. Thin leftover-premium chatter says the upper wick must hold. This app grades the stock only — no chain, no Greeks. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Salt miner sold with cyclicals. Outside bar. Thin chatter: leftover premium, wick must hold. Options context only.",
    preOhlc: SALT_PRE,
    postOhlc: withAftermath(SALT_PRE, [
      bar("+1", 91.22, 91.34, 90.88, 91.0),
      bar("+2", 91.0, 91.12, 90.66, 90.78),
      bar("+3", 90.78, 90.9, 90.44, 90.56),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this stock falling when salt is the cyclical side. An outside bar that closes weak is usually fade-or-wait, not a chase of the upper wick. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the waste-hauler dump-then-harami, not the auto-dealer CPI coil, not the fertilizer potash grind, not the staffing dump-no-reclaim, not the paper-mill evening star, not the glass-container tape outside bar, not the regional-bank outside bar, and still no chain.",
      whyMarketMoved: "The weak close continued lower; the upper wick did not hold as the salt miner stayed offered with risk.",
      evidence: "Salt-miner outside-bar tape plus a risk-off leftover-premium brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-macro",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-macro-asph-fail-break",
    title: "Asphalt paver pokes a range, then fails as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE asphalt paver poked above a range, then slipped back as risk appetite faded. Asphalt is the cyclical industrial in this SAMPLE brief, not duration. Thin leftover-premium chatter says the break must hold. This app grades the stock only — no chain, no Greeks. Chase the first green poke, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Asphalt paver sold with cyclicals. Thin chatter: leftover premium, range break must hold. Options context only.",
    preOhlc: ASPH_PRE,
    postOhlc: withAftermath(ASPH_PRE, [
      bar("+1", 12.38, 12.52, 12.08, 12.14),
      bar("+2", 12.14, 12.28, 11.84, 11.9),
      bar("+3", 11.9, 12.04, 11.6, 11.66),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this stock falling when asphalt is the cyclical industrial side. A failed poke is usually fade-or-wait, not a chase. Do not treat the first green bar as a breakout. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the waste-hauler dump-then-harami, not the auto-dealer CPI coil, not the fertilizer potash grind, not the staffing dump-no-reclaim, not the paper-mill evening star, not the salt-miner outside bar, not the tank-farm tape fail-break, not the event-still-ahead fail-break, and still no chain.",
      whyMarketMoved: "The poke failed and the asphalt paver slipped back through the range as cyclicals stayed offered with risk.",
      evidence: "Asphalt-paver failed-breakout tape plus a risk-off leftover-premium brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-macro",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-macro-brck-engulf",
    title: "Brick kiln prints a bearish engulfing as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE brick kiln printed a small green bar, then a red bar whose body swallowed that green body as risk appetite faded. Brick is the cyclical industrial in this SAMPLE brief, not duration. Thin leftover-premium chatter says the first green must resume. This app grades the stock only — no chain, no Greeks. Chase the swallowed green, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Brick kiln sold with cyclicals. Bearish engulfing. Thin chatter: leftover premium, first green must resume. Options context only.",
    preOhlc: BRCK_PRE,
    postOhlc: withAftermath(BRCK_PRE, [
      bar("+1", 33.112, 33.124, 33.076, 33.088),
      bar("+2", 33.088, 33.1, 33.052, 33.064),
      bar("+3", 33.064, 33.076, 33.028, 33.04),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this stock falling when brick is the cyclical industrial side. A bearish engulfing is usually fade-or-wait, not a chase of the swallowed green bar. This is not an outside bar: the red high stayed inside the prior high. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the waste-hauler dump-then-harami, not the auto-dealer CPI coil, not the fertilizer potash grind, not the staffing dump-no-reclaim, not the paper-mill evening star, not the salt-miner outside bar, not the asphalt-paver fail-break, not the roofing-maker tape engulfing, not the event-still-ahead fail-break, not the regional-bank outside bar, and still no chain.",
      whyMarketMoved: "The engulfing close held and the brick kiln leaked as cyclicals stayed offered with risk.",
      evidence: "Brick-kiln bearish-engulfing tape plus a risk-off leftover-premium brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-macro",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-macro-gyps-shooting-star",
    title: "Gypsum board prints a shooting star as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE gypsum-board name ground higher, then printed a shooting star: a small body near the lows with a long upper wick as risk appetite faded. Gypsum is the cyclical industrial in this SAMPLE brief, not duration. Thin leftover-premium chatter says the wick must continue. This app grades the stock only — no chain, no Greeks. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Gypsum board sold with cyclicals. Shooting star. Thin chatter: leftover premium, upper wick must continue. Options context only.",
    preOhlc: GYPS_PRE,
    postOhlc: withAftermath(GYPS_PRE, [
      bar("+1", 16.98, 17.06, 16.72, 16.78),
      bar("+2", 16.78, 16.86, 16.52, 16.58),
      bar("+3", 16.58, 16.66, 16.32, 16.38),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this stock falling when gypsum is the cyclical industrial side. A shooting star after a grind is usually fade-or-wait, not a chase of the upper wick. This is not an outside bar: the low stayed inside the prior low. This is not an evening star (that is three bars) and not a bearish engulfing (the body did not swallow the prior body). Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the waste-hauler dump-then-harami, not the auto-dealer CPI coil, not the fertilizer potash grind, not the staffing dump-no-reclaim, not the paper-mill evening star, not the salt-miner outside bar, not the asphalt-paver fail-break, not the brick-kiln engulfing, not the tile-kiln tape shooting star, not the roofing-maker tape engulfing, not the event-still-ahead fail-break, and still no chain.",
      whyMarketMoved: "The shooting-star close held and the gypsum-board name leaked as cyclicals stayed offered with risk.",
      evidence: "Gypsum-board shooting-star tape plus a risk-off leftover-premium brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-macro",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-macro-slab-dark-cloud",
    title: "Concrete slab prints a dark-cloud cover as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE concrete-slab name printed a green bar, then a red bar that opened above that close and finished in the lower half of that body without swallowing it as risk appetite faded. Slab is the cyclical industrial in this SAMPLE brief, not duration. Thin leftover-premium chatter says the gap-up open must continue. This app grades the stock only — no chain, no Greeks. Chase the gap-up, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Concrete slab sold with cyclicals. Dark-cloud cover. Thin chatter: leftover premium, gap-up open must continue. Options context only.",
    preOhlc: SLAB_PRE,
    postOhlc: withAftermath(SLAB_PRE, [
      bar("+1", 21.274, 21.282, 21.238, 21.244),
      bar("+2", 21.244, 21.252, 21.208, 21.214),
      bar("+3", 21.214, 21.222, 21.178, 21.184),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this stock falling when slab is the cyclical industrial side. A dark-cloud cover is usually fade-or-wait, not a chase of the gap-up open. The red close is inside the prior body, so this is not a bearish engulfing. This is not an outside bar: the low stayed inside the prior low. This is not a shooting star (that is one long upper wick) and not an evening star (that is three bars). Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the waste-hauler dump-then-harami, not the auto-dealer CPI coil, not the fertilizer potash grind, not the staffing dump-no-reclaim, not the paper-mill evening star, not the salt-miner outside bar, not the asphalt-paver fail-break, not the brick-kiln engulfing, not the gypsum-board shooting star, not the pipe-mill tape dark-cloud, not the tile-kiln tape shooting star, and still no chain.",
      whyMarketMoved: "The dark-cloud close held and the concrete-slab name leaked as cyclicals stayed offered with risk.",
      evidence: "Concrete-slab dark-cloud tape plus a risk-off leftover-premium brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-macro",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-macro-clay-three-crows",
    title: "Clay pit prints three black crows as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE clay pit ground higher, then printed three falling red bodies in a row as risk appetite faded. Clay is the cyclical industrial in this SAMPLE brief, not duration. Thin leftover-premium chatter says the first red is a dip to buy. This app grades the stock only — no chain, no Greeks. Chase the dip, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Clay pit sold with cyclicals. Three black crows. Thin chatter: leftover premium, first red is a dip to buy. Options context only.",
    preOhlc: CLAY_PRE,
    postOhlc: withAftermath(CLAY_PRE, [
      bar("+1", 37.126, 37.134, 37.088, 37.096),
      bar("+2", 37.096, 37.104, 37.058, 37.066),
      bar("+3", 37.066, 37.074, 37.028, 37.036),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this stock falling when clay is the cyclical industrial side. Three black crows after a grind are usually fade-or-wait, not a chase of the first red as a dip. This is not one bearish engulfing bar: three similar red bodies stepped lower. This is not an evening star (that is a small middle bar) and not a dark-cloud cover (that is two bars). Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the waste-hauler dump-then-harami, not the auto-dealer CPI coil, not the fertilizer potash grind, not the staffing dump-no-reclaim, not the paper-mill evening star, not the salt-miner outside bar, not the asphalt-paver fail-break, not the brick-kiln engulfing, not the gypsum-board shooting star, not the concrete-slab dark-cloud, not the sand-quarry tape three-crows, and still no chain.",
      whyMarketMoved: "The third crow held and the clay pit leaked as cyclicals stayed offered with risk.",
      evidence: "Clay-pit three-black-crows tape plus a risk-off leftover-premium brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-macro",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-macro-rebar-hanging-man",
    title: "Rebar mill prints a hanging man as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE rebar mill ground higher, then printed a hanging man: a small body near the highs with a long lower wick as risk appetite faded. Rebar is the cyclical industrial in this SAMPLE brief, not duration. Thin leftover-premium chatter says the lower wick must hold. This app grades the stock only — no chain, no Greeks. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Rebar mill sold with cyclicals. Hanging man. Thin chatter: leftover premium, lower wick must hold. Options context only.",
    preOhlc: REBAR_PRE,
    postOhlc: withAftermath(REBAR_PRE, [
      bar("+1", 46.382, 46.408, 46.198, 46.224),
      bar("+2", 46.224, 46.248, 46.038, 46.064),
      bar("+3", 46.064, 46.088, 45.878, 45.904),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this stock falling when rebar is the cyclical industrial side. A hanging man after a grind is usually fade-or-wait, not a chase of the lower wick as a dip. This is not a shooting star: that is a long upper wick. This is not a hammer: a hammer shows up after a decline, not after a grind. This is not a doji and not three black crows. This is not an outside bar: the high stayed inside the prior high. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the waste-hauler dump-then-harami, not the auto-dealer CPI coil, not the fertilizer potash grind, not the staffing dump-no-reclaim, not the paper-mill evening star, not the salt-miner outside bar, not the asphalt-paver fail-break, not the brick-kiln engulfing, not the gypsum-board shooting star, not the concrete-slab dark-cloud, not the clay-pit three-crows, not the grout-mill tape hanging man, and still no chain.",
      whyMarketMoved: "The hanging-man close held and the rebar mill leaked as cyclicals stayed offered with risk.",
      evidence: "Rebar-mill hanging-man tape plus a risk-off leftover-premium brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-macro",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-macro-cable-harami",
    title: "Cable mill prints a bearish harami as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE cable mill ground higher into a tall green bar, then printed a small body fully inside that green body as risk appetite faded. Cable is the cyclical industrial in this SAMPLE brief, not duration. Thin leftover-premium chatter says the small inside body means the grind must resume. This app grades the stock only — no chain, no Greeks. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Cable mill sold with cyclicals. Bearish harami. Thin chatter: leftover premium, small inside body means the grind must resume. Options context only.",
    preOhlc: CABLE_PRE,
    postOhlc: withAftermath(CABLE_PRE, [
      bar("+1", 68.86, 68.94, 68.48, 68.54),
      bar("+2", 68.54, 68.62, 68.16, 68.22),
      bar("+3", 68.22, 68.3, 67.84, 67.9),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this stock falling when cable is the cyclical industrial side. A bearish harami after a grind is usually fade-or-wait, not a chase of the small inside body as a resume. The small body sits inside the prior body; this is not a bearish engulfing. This is not a hanging man (no long lower wick) and not a shooting star (no long upper wick). This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. This is not the lime-kiln inside-bar-still-ahead HOLD: there is no official air-permit note still ahead. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the waste-hauler dump-then-harami, not the auto-dealer CPI coil, not the fertilizer potash grind, not the staffing dump-no-reclaim, not the paper-mill evening star, not the salt-miner outside bar, not the asphalt-paver fail-break, not the brick-kiln engulfing, not the gypsum-board shooting star, not the concrete-slab dark-cloud, not the clay-pit three-crows, not the rebar-mill hanging man, not the stucco-mill tape harami, and still no chain.",
      whyMarketMoved: "The harami close held and the cable mill leaked as cyclicals stayed offered with risk.",
      evidence: "Cable-mill bearish-harami tape plus a risk-off leftover-premium brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-macro",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-macro-lintel-marubozu",
    title: "Lintel mill prints a bearish marubozu as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE lintel mill ground higher, then printed a long red bar that opened near its high and closed near its low, with almost no wicks, as risk appetite faded. Lintel is the cyclical industrial in this SAMPLE brief, not duration. Thin leftover-premium chatter says the long red close must bounce. This app grades the stock only — no chain, no Greeks. Chase the red as a dip, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Lintel mill sold with cyclicals. Bearish marubozu. Thin chatter: leftover premium, long red close must bounce. Options context only.",
    preOhlc: LINTEL_PRE,
    postOhlc: withAftermath(LINTEL_PRE, [
      bar("+1", 74.232, 74.248, 74.086, 74.102),
      bar("+2", 74.102, 74.118, 73.956, 73.972),
      bar("+3", 73.972, 73.988, 73.826, 73.842),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this stock falling when lintel is the cyclical industrial side. A bearish marubozu after a grind is usually fade-or-wait, not a chase of the long red close as a bounce. The bar opened near the high and closed near the low with tiny wicks; this is not a hanging man (no long lower wick) and not a shooting star (no long upper wick). This is not a bearish engulfing: the red body does not swallow the prior green body. This is not three black crows (one bar, not three) and not a dark-cloud cover (that opens above the prior close and stays inside the prior body). This is not a harami: the last bar is large, not a small body inside the prior body. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the waste-hauler dump-then-harami, not the auto-dealer CPI coil, not the fertilizer potash grind, not the staffing dump-no-reclaim, not the paper-mill evening star, not the salt-miner outside bar, not the asphalt-paver fail-break, not the brick-kiln engulfing, not the gypsum-board shooting star, not the concrete-slab dark-cloud, not the clay-pit three-crows, not the rebar-mill hanging man, not the cable-mill harami, not the joist-mill tape marubozu, and still no chain.",
      whyMarketMoved: "The marubozu close held and the lintel mill leaked as cyclicals stayed offered with risk.",
      evidence: "Lintel-mill bearish-marubozu tape plus a risk-off leftover-premium brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-macro",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-macro-soffit-gravestone",
    title: "Soffit mill prints a gravestone doji as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE soffit mill ground higher, then printed a gravestone doji: open and close sit on the lows with a long upper wick and almost no body, as risk appetite faded. Soffit is the cyclical industrial in this SAMPLE brief, not duration. Thin leftover-premium chatter says the wick must continue. This app grades the stock only — no chain, no Greeks. Chase the wick, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Soffit mill sold with cyclicals. Gravestone doji. Thin chatter: leftover premium, upper wick must continue. Options context only.",
    preOhlc: SOFFIT_PRE,
    postOhlc: withAftermath(SOFFIT_PRE, [
      bar("+1", 57.808, 57.826, 57.628, 57.646),
      bar("+2", 57.646, 57.662, 57.458, 57.476),
      bar("+3", 57.476, 57.492, 57.288, 57.306),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this stock falling when soffit is the cyclical industrial side. A gravestone doji after a grind is usually fade-or-wait, not a chase of the upper wick. Open and close sit on the lows with almost no body; this is not a shooting star (that has a small real body near the lows). This is not a hanging man (no long lower wick) and not a marubozu (this bar has a long upper wick). This is not an outside bar: the low stayed inside the prior low. This is not a harami (the last bar is not a small body inside the prior body). Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the waste-hauler dump-then-harami, not the auto-dealer CPI coil, not the fertilizer potash grind, not the staffing dump-no-reclaim, not the paper-mill evening star, not the salt-miner outside bar, not the asphalt-paver fail-break, not the brick-kiln engulfing, not the gypsum-board shooting star, not the concrete-slab dark-cloud, not the clay-pit three-crows, not the rebar-mill hanging man, not the cable-mill harami, not the lintel-mill marubozu, not the purlin-mill tape gravestone, and still no chain.",
      whyMarketMoved: "The gravestone close held and the soffit mill leaked as cyclicals stayed offered with risk.",
      evidence: "Soffit-mill gravestone-doji tape plus a risk-off leftover-premium brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-macro",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-macro-fascia-harami-cross",
    title: "Fascia mill prints a harami cross as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE fascia mill ground higher into a tall green bar, then printed a doji fully inside that green body as risk appetite faded. Fascia is the cyclical industrial in this SAMPLE brief, not duration. Thin leftover-premium chatter says the doji means the grind must resume. This app grades the stock only — no chain, no Greeks. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Fascia mill sold with cyclicals. Harami cross. Thin chatter: leftover premium, the doji means the grind must resume. Options context only.",
    preOhlc: FASCIA_PRE,
    postOhlc: withAftermath(FASCIA_PRE, [
      bar("+1", 87.752, 87.772, 87.548, 87.568),
      bar("+2", 87.568, 87.586, 87.348, 87.368),
      bar("+3", 87.368, 87.386, 87.138, 87.158),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this stock falling when fascia is the cyclical industrial side. A harami cross after a grind is usually fade-or-wait, not a chase of the inside doji as a resume. The doji sits inside the prior body; this is not a bearish harami with a small real body, and not a gravestone (open and close are not pinned to the lows with a long upper wick). This is not a hanging man (no long lower wick) and not a shooting star (no long upper wick from the lows). This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. This is not the lime-kiln inside-bar-still-ahead HOLD: there is no official air-permit note still ahead. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the waste-hauler dump-then-harami, not the auto-dealer CPI coil, not the fertilizer potash grind, not the staffing dump-no-reclaim, not the paper-mill evening star, not the salt-miner outside bar, not the asphalt-paver fail-break, not the brick-kiln engulfing, not the gypsum-board shooting star, not the concrete-slab dark-cloud, not the clay-pit three-crows, not the rebar-mill hanging man, not the cable-mill harami, not the lintel-mill marubozu, not the soffit-mill gravestone, not the truss-mill tape harami-cross, and still no chain.",
      whyMarketMoved: "The harami-cross close held and the fascia mill leaked as cyclicals stayed offered with risk.",
      evidence: "Fascia-mill harami-cross tape plus a risk-off leftover-premium brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-macro",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-macro-gable-spinning-top",
    title: "Gable mill prints a spinning top as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE gable mill ground higher, then printed a spinning top: a small real body near the middle of the bar with upper and lower wicks of similar length as risk appetite faded. Gable is the cyclical industrial in this SAMPLE brief, not duration. Thin leftover-premium chatter says the pause means the grind must resume. This app grades the stock only — no chain, no Greeks. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Gable mill sold with cyclicals. Spinning top. Thin chatter: leftover premium, the pause means the grind must resume. Options context only.",
    preOhlc: GABLE_PRE,
    postOhlc: withAftermath(GABLE_PRE, [
      bar("+1", 52.73, 52.768, 52.498, 52.532),
      bar("+2", 52.532, 52.568, 52.268, 52.304),
      bar("+3", 52.304, 52.338, 52.018, 52.054),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this stock falling when gable is the cyclical industrial side. A spinning top after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar has a small real body near the middle with wicks both ways; this is not a hanging man (that sits near the highs with a long lower wick only) and not a shooting star (that sits near the lows with a long upper wick only). This is not a harami cross: the last bar is not a doji sitting inside the prior body. This is not a gravestone (open and close are not pinned to the lows). This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. This is not the lime-kiln inside-bar-still-ahead HOLD: there is no official air-permit note still ahead. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the waste-hauler dump-then-harami, not the auto-dealer CPI coil, not the fertilizer potash grind, not the staffing dump-no-reclaim, not the paper-mill evening star, not the salt-miner outside bar, not the asphalt-paver fail-break, not the brick-kiln engulfing, not the gypsum-board shooting star, not the concrete-slab dark-cloud, not the clay-pit three-crows, not the rebar-mill hanging man, not the cable-mill harami, not the lintel-mill marubozu, not the soffit-mill gravestone, not the fascia-mill harami-cross, not the ridge-mill spinning-top tape, and still no chain.",
      whyMarketMoved: "The spinning-top close held and the gable mill leaked as cyclicals stayed offered with risk.",
      evidence: "Gable-mill spinning-top tape plus a risk-off leftover-premium brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-macro",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-macro-hip-long-legged-doji",
    title: "Hip mill prints a long-legged doji as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE hip mill ground higher, then printed a long-legged doji: open and close sit together with long upper and lower wicks of similar length as risk appetite faded. Hip is the cyclical industrial in this SAMPLE brief, not duration. Thin leftover-premium chatter says the long-legged pause means the grind must resume. This app grades the stock only — no chain, no Greeks. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Hip mill sold with cyclicals. Long-legged doji. Thin chatter: leftover premium, the long-legged pause means the grind must resume. Options context only.",
    preOhlc: HIP_PRE,
    postOhlc: withAftermath(HIP_PRE, [
      bar("+1", 39.308, 39.368, 38.898, 38.958),
      bar("+2", 38.958, 39.018, 38.508, 38.568),
      bar("+3", 38.568, 38.628, 38.086, 38.148),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this stock falling when hip is the cyclical industrial side. A long-legged doji after a grind is usually fade-or-wait, not a chase of the pause as a resume. Open and close sit together with long wicks both ways; this is not a spinning top (that has a small real body). This is not a gravestone (open and close are not pinned to the lows with a long upper wick only). This is not a harami cross: the doji is not sitting inside the prior body. This is not a hanging man (no long lower wick only) and not a shooting star (no long upper wick from the lows). This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. This is not the lime-kiln inside-bar-still-ahead HOLD: there is no official air-permit note still ahead. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the waste-hauler dump-then-harami, not the auto-dealer CPI coil, not the fertilizer potash grind, not the staffing dump-no-reclaim, not the paper-mill evening star, not the salt-miner outside bar, not the asphalt-paver fail-break, not the brick-kiln engulfing, not the gypsum-board shooting star, not the concrete-slab dark-cloud, not the clay-pit three-crows, not the rebar-mill hanging man, not the cable-mill harami, not the lintel-mill marubozu, not the soffit-mill gravestone, not the fascia-mill harami-cross, not the gable-mill spinning top, not the eave-mill tape long-legged doji, not the ridge-mill spinning-top tape, and still no chain.",
      whyMarketMoved: "The long-legged-doji close held and the hip mill leaked as cyclicals stayed offered with risk.",
      evidence: "Hip-mill long-legged-doji tape plus a risk-off leftover-premium brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-macro",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-macro-sill-dragonfly",
    title: "Sill mill prints a dragonfly doji as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE sill mill ground higher, then printed a dragonfly doji: open and close sit together at the highs with a long lower wick only as risk appetite faded. Sill is the cyclical industrial in this SAMPLE brief, not duration. Thin leftover-premium chatter says the dragonfly pause means the grind must resume. This app grades the stock only — no chain, no Greeks. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Sill mill sold with cyclicals. Dragonfly doji. Thin chatter: leftover premium, the dragonfly pause means the grind must resume. Options context only.",
    preOhlc: SILL_PRE,
    postOhlc: withAftermath(SILL_PRE, [
      bar("+1", 70.768, 70.818, 69.948, 70.018),
      bar("+2", 70.018, 70.086, 69.328, 69.418),
      bar("+3", 69.418, 69.486, 68.618, 68.728),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this stock falling when sill is the cyclical industrial side. A dragonfly doji after a grind is usually fade-or-wait, not a chase of the pause as a resume. Open and close sit together at the highs with a long lower wick; this is not a hanging man (that has a small real body near the highs). This is not a gravestone (open and close are not pinned to the lows with a long upper wick). This is not a long-legged doji (no long upper wick). This is not a spinning top (no small real body in the middle). This is not a harami cross: the doji is not sitting inside the prior body. This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. This is not the lime-kiln inside-bar-still-ahead HOLD: there is no official air-permit note still ahead. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the waste-hauler dump-then-harami, not the auto-dealer CPI coil, not the fertilizer potash grind, not the staffing dump-no-reclaim, not the paper-mill evening star, not the salt-miner outside bar, not the asphalt-paver fail-break, not the brick-kiln engulfing, not the gypsum-board shooting star, not the concrete-slab dark-cloud, not the clay-pit three-crows, not the rebar-mill hanging man, not the cable-mill harami, not the lintel-mill marubozu, not the soffit-mill gravestone, not the fascia-mill harami-cross, not the gable-mill spinning top, not the hip-mill long-legged doji, not the flash-mill tape dragonfly, not the eave-mill tape long-legged doji, and still no chain.",
      whyMarketMoved: "The dragonfly-doji close held and the sill mill leaked as cyclicals stayed offered with risk.",
      evidence: "Sill-mill dragonfly-doji tape plus a risk-off leftover-premium brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-macro",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-macro-rafter-matching-high",
    title: "Rafter mill prints a matching high as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE rafter mill ground higher into a tall green bar, then printed a small green bar that tags nearly the same high and closes weak under it as risk appetite faded. Rafter is the cyclical industrial in this SAMPLE brief, not duration. Thin leftover-premium chatter says the matching-high pause means the grind must resume. This app grades the stock only — no chain, no Greeks. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Rafter mill sold with cyclicals. Matching high. Thin chatter: leftover premium, the matching-high pause means the grind must resume. Options context only.",
    preOhlc: RAFTER_PRE,
    postOhlc: withAftermath(RAFTER_PRE, [
      bar("+1", 77.028, 77.068, 76.418, 76.468),
      bar("+2", 76.468, 76.518, 75.818, 75.868),
      bar("+3", 75.868, 75.918, 75.148, 75.198),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this stock falling when rafter is the cyclical industrial side. A matching high after a grind is usually fade-or-wait, not a chase of the pause as a resume. Both bars are green and share nearly the same high; the last close sits weak under that high. This is not a tweezer: a tweezer tags the high with opposite-color bodies. This is not a shooting star (the last body is not sitting near the lows with a long upper wick only). This is not a dragonfly (open and close are not pinned to the highs with a long lower wick). This is not a harami: the last high pokes to the prior high, not a small body fully inside the prior body. This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. This is not the lime-kiln inside-bar-still-ahead HOLD: there is no official air-permit note still ahead. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the waste-hauler dump-then-harami, not the auto-dealer CPI coil, not the fertilizer potash grind, not the staffing dump-no-reclaim, not the paper-mill evening star, not the salt-miner outside bar, not the asphalt-paver fail-break, not the brick-kiln engulfing, not the gypsum-board shooting star, not the concrete-slab dark-cloud, not the clay-pit three-crows, not the rebar-mill hanging man, not the cable-mill harami, not the lintel-mill marubozu, not the soffit-mill gravestone, not the fascia-mill harami-cross, not the gable-mill spinning top, not the hip-mill long-legged doji, not the sill-mill dragonfly, not the dormer-mill matching-high tape, and still no chain.",
      whyMarketMoved: "The matching-high close held and the rafter mill leaked as cyclicals stayed offered with risk.",
      evidence: "Rafter-mill matching-high tape plus a risk-off leftover-premium brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-macro",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-macro-mullion-belt-hold",
    title: "Mullion mill prints a bearish belt hold as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE mullion mill ground higher, then printed a bearish belt hold: the last bar opens at its high with no upper wick and sells off, closing weak with a real body and a lower wick as risk appetite faded. Mullion is the cyclical industrial in this SAMPLE brief, not duration. Thin leftover-premium chatter says the belt-hold pause means the grind must resume. This app grades the stock only — no chain, no Greeks. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Mullion mill sold with cyclicals. Bearish belt hold. Thin chatter: leftover premium, the belt-hold pause means the grind must resume. Options context only.",
    preOhlc: MULLION_PRE,
    postOhlc: withAftermath(MULLION_PRE, [
      bar("+1", 9.218, 9.268, 8.648, 8.698),
      bar("+2", 8.698, 8.748, 8.086, 8.136),
      bar("+3", 8.136, 8.186, 7.418, 7.468),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this stock falling when mullion is the cyclical industrial side. A bearish belt hold after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar opens at the high with no upper wick and sells off into a real body; a lower wick is allowed. This is not a marubozu: a marubozu has tiny wicks at both ends and closes near the low. This is not a matching high: both of those bars are green and share nearly the same high. This is not a hanging man (the body is not a small real body near the highs with a long lower wick). This is not a shooting star (there is no long upper wick from the lows). This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. This is not the lime-kiln inside-bar-still-ahead HOLD: there is no official air-permit note still ahead. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the waste-hauler dump-then-harami, not the auto-dealer CPI coil, not the fertilizer potash grind, not the staffing dump-no-reclaim, not the paper-mill evening star, not the salt-miner outside bar, not the asphalt-paver fail-break, not the brick-kiln engulfing, not the gypsum-board shooting star, not the concrete-slab dark-cloud, not the clay-pit three-crows, not the rebar-mill hanging man, not the cable-mill harami, not the lintel-mill marubozu, not the soffit-mill gravestone, not the fascia-mill harami-cross, not the gable-mill spinning top, not the hip-mill long-legged doji, not the sill-mill dragonfly, not the rafter-mill matching high, not the gutter-mill tape belt hold, and still no chain.",
      whyMarketMoved: "The belt-hold close held and the mullion mill leaked as cyclicals stayed offered with risk.",
      evidence: "Mullion-mill bearish-belt-hold tape plus a risk-off leftover-premium brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-macro",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-macro-sash-separating-lines",
    title: "Sash mill prints bearish separating lines as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE sash mill ground higher into a tall green bar, then printed a long red bar that opens at nearly the same open as that green bar and sells off as risk appetite faded. Sash is the cyclical industrial in this SAMPLE brief, not duration. Thin leftover-premium chatter says the separating-lines pause means the grind must resume. This app grades the stock only — no chain, no Greeks. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Sash mill sold with cyclicals. Bearish separating lines. Thin chatter: leftover premium, the separating-lines pause means the grind must resume. Options context only.",
    preOhlc: SASH_PRE,
    postOhlc: withAftermath(SASH_PRE, [
      bar("+1", 130.448, 131.186, 125.648, 126.448),
      bar("+2", 126.448, 127.186, 120.648, 121.448),
      bar("+3", 121.448, 122.186, 114.648, 115.448),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this stock falling when sash is the cyclical industrial side. Bearish separating lines after a grind are usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens at nearly the same open as the prior tall green and sells off. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick, usually after the prior close, not back at the prior open. This is not a marubozu: a marubozu has tiny wicks at both ends and closes near the low. This is not a matching high: both of those bars are green and share nearly the same high. This is not a hanging man (the body is not a small real body near the highs with a long lower wick). This is not a shooting star (there is no long upper wick from the lows). This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. This is not the lime-kiln inside-bar-still-ahead HOLD: there is no official air-permit note still ahead. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the waste-hauler dump-then-harami, not the auto-dealer CPI coil, not the fertilizer potash grind, not the staffing dump-no-reclaim, not the paper-mill evening star, not the salt-miner outside bar, not the asphalt-paver fail-break, not the brick-kiln engulfing, not the gypsum-board shooting star, not the concrete-slab dark-cloud, not the clay-pit three-crows, not the rebar-mill hanging man, not the cable-mill harami, not the lintel-mill marubozu, not the soffit-mill gravestone, not the fascia-mill harami-cross, not the gable-mill spinning top, not the hip-mill long-legged doji, not the sill-mill dragonfly, not the rafter-mill matching high, not the mullion-mill belt hold, not the stud-mill tape separating lines, not the gutter-mill tape belt hold, not the crest-token separating-lines macro, and still no chain.",
      whyMarketMoved: "The separating-lines close held and the sash mill leaked as cyclicals stayed offered with risk.",
      evidence: "Sash-mill bearish-separating-lines tape plus a risk-off leftover-premium brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-macro",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-macro-lath-on-neck",
    title: "Lath mill prints a bearish on-neck as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE lath mill ground higher into a tall green bar, then printed a long red bar that opens above that green close and closes at nearly the prior low as risk appetite faded. Lath is the cyclical industrial in this SAMPLE brief, not duration. Thin leftover-premium chatter says the on-neck pause means the grind must resume. This app grades the stock only — no chain, no Greeks. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Lath mill sold with cyclicals. Bearish on-neck. Thin chatter: leftover premium, the on-neck pause means the grind must resume. Options context only.",
    preOhlc: LATH_PRE,
    postOhlc: withAftermath(LATH_PRE, [
      bar("+1", 48.186, 48.548, 45.286, 45.648),
      bar("+2", 45.648, 45.918, 42.486, 42.868),
      bar("+3", 42.868, 43.148, 39.286, 39.648),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this stock falling when lath is the cyclical industrial side. A bearish on-neck after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens above the prior close and closes at nearly the prior low. This is not separating lines: those share nearly the same open as the prior tall green. This is not a dark-cloud: a dark-cloud closes in the lower half of the prior body, still above that prior open, not at the prior low. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick. This is not a matching high: both of those bars are green and share nearly the same high. This is not a hanging man (the body is not a small real body near the highs with a long lower wick). This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. This is not the lime-kiln inside-bar-still-ahead HOLD: there is no official air-permit note still ahead. This is not the jamb-mill tape: that on-neck sits near 101.65 leftover premium, not this lath mill. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the waste-hauler dump-then-harami, not the auto-dealer CPI coil, not the fertilizer potash grind, not the staffing dump-no-reclaim, not the paper-mill evening star, not the salt-miner outside bar, not the asphalt-paver fail-break, not the brick-kiln engulfing, not the gypsum-board shooting star, not the concrete-slab dark-cloud, not the clay-pit three-crows, not the rebar-mill hanging man, not the cable-mill harami, not the lintel-mill marubozu, not the soffit-mill gravestone, not the fascia-mill harami-cross, not the gable-mill spinning top, not the hip-mill long-legged doji, not the sill-mill dragonfly, not the rafter-mill matching high, not the mullion-mill belt hold, not the sash-mill separating lines, not the jamb-mill tape on-neck, not the joist-mill marubozu, and still no chain.",
      whyMarketMoved: "The on-neck close held and the lath mill leaked as cyclicals stayed offered with risk.",
      evidence: "Lath-mill bearish-on-neck tape plus a risk-off leftover-premium brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-macro",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-macro-baluster-in-neck",
    title: "Baluster mill prints a bearish in-neck as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE baluster mill ground higher into a tall green bar, then printed a long red bar that opens above that green close and closes at nearly that same close, not the prior low, as risk appetite faded. Baluster is the cyclical industrial in this SAMPLE brief, not duration. Thin leftover-premium chatter says the in-neck pause means the grind must resume. This app grades the stock only — no chain, no Greeks. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Baluster mill sold with cyclicals. Bearish in-neck. Thin chatter: leftover premium, the in-neck pause means the grind must resume. Options context only.",
    preOhlc: BALUSTER_PRE,
    postOhlc: withAftermath(BALUSTER_PRE, [
      bar("+1", 206.268, 206.848, 202.186, 202.648),
      bar("+2", 202.648, 203.186, 197.486, 197.868),
      bar("+3", 197.868, 198.348, 191.286, 191.648),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this stock falling when baluster is the cyclical industrial side. A bearish in-neck after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens above the prior close and closes at nearly that same close, not the prior low. This is not on-neck: on-neck closes at nearly the prior low. This is not a dark-cloud: a dark-cloud closes in the lower half of the prior body, still above that prior open, not back at the prior close. This is not separating lines: those share nearly the same open as the prior tall green. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick. This is not a matching high: both of those bars are green and share nearly the same high. This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. This is not the lime-kiln inside-bar-still-ahead HOLD: there is no official air-permit note still ahead. This is not the lath-mill: that on-neck sits near 50.55 leftover premium, not this baluster mill. This is not the newel-mill tape: that in-neck sits near 58.75. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the waste-hauler dump-then-harami, not the auto-dealer CPI coil, not the fertilizer potash grind, not the staffing dump-no-reclaim, not the paper-mill evening star, not the salt-miner outside bar, not the asphalt-paver fail-break, not the brick-kiln engulfing, not the gypsum-board shooting star, not the concrete-slab dark-cloud, not the clay-pit three-crows, not the rebar-mill hanging man, not the cable-mill harami, not the lintel-mill marubozu, not the soffit-mill gravestone, not the fascia-mill harami-cross, not the gable-mill spinning top, not the hip-mill long-legged doji, not the sill-mill dragonfly, not the rafter-mill matching high, not the mullion-mill belt hold, not the sash-mill separating lines, not the lath-mill on-neck, not the jamb-mill tape on-neck, not the newel-mill tape in-neck, and still no chain.",
      whyMarketMoved: "The in-neck close held and the baluster mill leaked as cyclicals stayed offered with risk.",
      evidence: "Baluster-mill bearish-in-neck tape plus a risk-off leftover-premium brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-macro",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-macro-transom-thrusting",
    title: "Transom mill prints a bearish thrusting line as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE transom mill ground higher into a tall green bar, then printed a long red bar that opens above that green close and closes into that prior body, still above the midpoint, as risk appetite faded. Transom is the cyclical industrial in this SAMPLE brief, not duration. Thin leftover-premium chatter says the thrusting pause means the grind must resume. This app grades the stock only — no chain, no Greeks. Chase the pause, wait, or take risk off?",
    newsHeadline:
      "Risk-off. Transom mill sold with cyclicals. Bearish thrusting line. Thin chatter: leftover premium, the thrusting pause means the grind must resume. Options context only.",
    preOhlc: TRANSOM_PRE,
    postOhlc: withAftermath(TRANSOM_PRE, [
      bar("+1", 310.686, 310.918, 308.248, 308.648),
      bar("+2", 308.648, 308.918, 305.186, 305.548),
      bar("+3", 305.548, 305.868, 301.286, 301.648),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off bid can keep this stock falling when transom is the cyclical industrial side. A bearish thrusting line after a grind is usually fade-or-wait, not a chase of the pause as a resume. The last bar is a long red that opens above the prior close and closes into that prior body, still above the midpoint. This is not in-neck: in-neck closes at nearly the prior close. This is not on-neck: on-neck closes at nearly the prior low. This is not a dark-cloud: a dark-cloud closes in the lower half of the prior body, still above that prior open. This is not separating lines: those share nearly the same open as the prior tall green. This is not a belt hold: a belt hold opens at that last bar's own high with no upper wick. This is not a matching high: both of those bars are green and share nearly the same high. This is not a dump-then-harami: that pattern shows up after a decline, not after a grind. This is not the lime-kiln inside-bar-still-ahead HOLD: there is no official air-permit note still ahead. This is not the baluster-mill: that in-neck sits near 206 leftover premium, not this transom mill. This is not the spandrel-mill tape: that thrusting line sits near 179. Leftover premium is not a stock fill. HOLD if the slip already has your size. This is not leftover-premium math, not the waste-hauler dump-then-harami, not the auto-dealer CPI coil, not the fertilizer potash grind, not the staffing dump-no-reclaim, not the paper-mill evening star, not the salt-miner outside bar, not the asphalt-paver fail-break, not the brick-kiln engulfing, not the gypsum-board shooting star, not the concrete-slab dark-cloud, not the clay-pit three-crows, not the rebar-mill hanging man, not the cable-mill harami, not the lintel-mill marubozu, not the soffit-mill gravestone, not the fascia-mill harami-cross, not the gable-mill spinning top, not the hip-mill long-legged doji, not the sill-mill dragonfly, not the rafter-mill matching high, not the mullion-mill belt hold, not the sash-mill separating lines, not the lath-mill on-neck, not the baluster-mill in-neck, not the spandrel-mill tape thrusting, and still no chain.",
      whyMarketMoved: "The thrusting close held and the transom mill leaked as cyclicals stayed offered with risk.",
      evidence: "Transom-mill bearish-thrusting tape plus a risk-off leftover-premium brief. No Greeks.",
    },
    allowShort: false,
    packId: "options-macro",
    difficulty: "beginner",
    assetClass: "option_context",
  },
];
