---
name: add-coaching-session
description: >-
  Add a deterministic step-coaching decision graph (meta + tree) under
  src/lib/coaching/sessions and wire the sessions folder export. Use for E11
  content authoring — no runtime LLM.
---

# Add coaching session

## Steps
1. Create `src/lib/coaching/sessions/<slug>.ts` exporting a `CoachingSession` (`meta` + `tree`) and `export default`.
2. Required meta: `slug` (kebab-case), `title`, `summary`, `topic`, `tags[]`.
3. Graph: `start` + `nodes`; outcomes `continue` | `wrong` | `success`.
4. Include ≥1 `wrong` with `rewind_to` (earlier decision) and ≥1 `success`.
5. Choice labels must read well on buttons **and** in the path trail.
6. Append the session to `COACHING_SESSION_MODULES` in `src/lib/coaching/sessions/index.ts`.
7. Run `npm run test:coaching` && `npm run lint` && `npm run build`.

## Constraints
- No randomness, LLM, or external APIs at session runtime.
- SAMPLE / educational framing; no LIVE / brokerage claims.
- Invalid graphs are excluded from `listSessions()` / fail `loadSession`.

## Failure notes
- Not in catalog → missing from `COACHING_SESSION_MODULES` or validation failed.
- Rewind broken → `rewind_to` missing or points at unknown node.
---
