---
name: add-equity-sample-pack
description: >-
  Add a distinct SAMPLE equity SamplePack (OHLC + notes) and expose it on Market
  via the markets adapter. Use when seeding or extending E1 equity packs.
---

# Add equity SamplePack

## Steps
1. Add a unique OHLC series in `src/lib/samplePacks.ts` (not a scaled clone of an existing series).
2. Append a `SamplePack` to `EQUITY_SAMPLE_PACKS` with `assetClass: "equity"`, SAMPLE/STYLIZED `educationalNotes`.
3. Market list auto-includes equity packs via `markets.ts` → `EQUITY_MARKETS` — no Market.tsx change unless UI copy needs it.
4. Run `npm run lint` && `npm run build`.
5. E1.M1 is already `done`. Do not reopen it. A new pack is leftover SAMPLE content, not a new milestone.

## Failure notes
- If charts look identical: rewrite OHLC shape (trend vs range vs selloff), do not only rescale prices.
- If lint fails on missing React `key` typing: keep `key` on a wrapper element (`span.contents`), not on untyped helpers when `@types/react` is absent.
