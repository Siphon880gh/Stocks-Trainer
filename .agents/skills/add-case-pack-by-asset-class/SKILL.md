---
name: add-case-pack-by-asset-class
description: Add SAMPLE decide-and-reveal CaseStudy packs tagged with assetClass (futures/forex/crypto/options-context) and wire CASE_PACKS + Navigator decide links.
---

# Add case pack by assetClass

## When
Seeding multi-market SAMPLE cases (E10 pattern).

## Steps
1. Add cases in `src/lib/multiAssetCases.ts` (or extend) with distinct pre/post OHLC, process debriefs, `allowShort: false` unless story says otherwise.
2. Set `assetClass`, `packId`, `difficulty: "beginner"` for Explorer/Navigator.
3. Wire arrays into `CASE_STUDIES` + `CASE_PACKS` in `src/lib/caseStudies.ts`.
4. Ensure `Cases.tsx` `CLASS_TO_PACKS` maps the class → pack id(s).
5. `hasDecidePackForClass` in `marketNavigator.ts` unlocks **DECIDE_CASES** automatically.
6. Verify: `npm run lint` && `npm run build`.

## Constraints
SAMPLE/STYLIZED only · no LIVE · options-context = no chain/Greeks · chart soft-gate still enforced in CasePlayer.
