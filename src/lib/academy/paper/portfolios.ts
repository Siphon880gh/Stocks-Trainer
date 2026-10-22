/**
 * BA11.M6: several named paper portfolios (e.g. one per strategy). SIMULATED — virtual money only.
 * The active portfolio's session is `PaperStore.session` (so every existing reader keeps working); the others
 * wait in `otherPortfolios`. A store from before M6 becomes the single portfolio "Main".
 */
import type { PaperStore } from "../storage";
import type { PaperSessionLog } from "./types";

export const MAX_PORTFOLIOS = 5;
export const NAME_MAX = 24;

export type PortfolioCode = "NAME_EMPTY" | "NAME_TOO_LONG" | "NAME_TAKEN" | "TOO_MANY" | "UNKNOWN" | "ACTIVE";

export interface PortfolioView {
  id: string;
  name: string;
  active: boolean;
  session: PaperSessionLog | null;
}

export type PortfolioResult = { ok: true; store: PaperStore } | { ok: false; code: PortfolioCode; message: string; store: PaperStore };

export function listPortfolios(p: PaperStore): PortfolioView[] {
  return [{ ...p.portfolio, active: true, session: p.session }, ...p.otherPortfolios.map((o) => ({ ...o, active: false }))];
}

const fail = (store: PaperStore, code: PortfolioCode, message: string): PortfolioResult => ({ ok: false, code, message, store });

function checkName(p: PaperStore, raw: string, exceptId?: string): { name: string } | { code: PortfolioCode; message: string } {
  const name = raw.trim().replace(/\s+/g, " ");
  if (!name) return { code: "NAME_EMPTY", message: "Give the portfolio a name." };
  if (name.length > NAME_MAX) return { code: "NAME_TOO_LONG", message: `Keep the name to ${NAME_MAX} characters.` };
  if (listPortfolios(p).some((x) => x.id !== exceptId && x.name.toLowerCase() === name.toLowerCase())) return { code: "NAME_TAKEN", message: `You already have a portfolio called ${name}.` };
  return { name };
}

const nextId = (p: PaperStore) => {
  const used = new Set(listPortfolios(p).map((x) => x.id));
  let n = 2;
  while (used.has(`p${n}`)) n++;
  return `p${n}`;
};

/** Create an empty portfolio and make it active (the current one keeps its session). */
export function createPortfolio(p: PaperStore, rawName: string): PortfolioResult {
  if (listPortfolios(p).length >= MAX_PORTFOLIOS) return fail(p, "TOO_MANY", `Up to ${MAX_PORTFOLIOS} portfolios. Delete one you no longer use first.`);
  const c = checkName(p, rawName);
  if ("code" in c) return fail(p, c.code, c.message);
  return { ok: true, store: { ...p, portfolio: { id: nextId(p), name: c.name }, session: null, otherPortfolios: [...p.otherPortfolios, { ...p.portfolio, session: p.session }] } };
}

/** Make another portfolio active. Order of the list is kept stable by id. */
export function switchPortfolio(p: PaperStore, id: string): PortfolioResult {
  if (id === p.portfolio.id) return { ok: true, store: p };
  const target = p.otherPortfolios.find((o) => o.id === id);
  if (!target) return fail(p, "UNKNOWN", "That portfolio does not exist.");
  const others = [...p.otherPortfolios.filter((o) => o.id !== id), { ...p.portfolio, session: p.session }].sort((a, b) => order(a.id) - order(b.id));
  return { ok: true, store: { ...p, portfolio: { id: target.id, name: target.name }, session: target.session, otherPortfolios: others } };
}

const order = (id: string) => (id === "main" ? 0 : Number(id.slice(1)) || 99);

export function renamePortfolio(p: PaperStore, id: string, rawName: string): PortfolioResult {
  const c = checkName(p, rawName, id);
  if ("code" in c) return fail(p, c.code, c.message);
  if (id === p.portfolio.id) return { ok: true, store: { ...p, portfolio: { ...p.portfolio, name: c.name } } };
  if (!p.otherPortfolios.some((o) => o.id === id)) return fail(p, "UNKNOWN", "That portfolio does not exist.");
  return { ok: true, store: { ...p, otherPortfolios: p.otherPortfolios.map((o) => (o.id === id ? { ...o, name: c.name } : o)) } };
}

/** Delete an inactive portfolio and its session (the active one cannot be deleted). */
export function deletePortfolio(p: PaperStore, id: string): PortfolioResult {
  if (id === p.portfolio.id) return fail(p, "ACTIVE", "Switch to another portfolio before deleting this one.");
  if (!p.otherPortfolios.some((o) => o.id === id)) return fail(p, "UNKNOWN", "That portfolio does not exist.");
  return { ok: true, store: { ...p, otherPortfolios: p.otherPortfolios.filter((o) => o.id !== id) } };
}
