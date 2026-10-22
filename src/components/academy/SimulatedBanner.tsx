import { SIMULATED_BANNER } from "../../lib/academy/copy";

/** Shown on every paper-trading surface (CHARTER §5). */
export default function SimulatedBanner() {
  return (
    <p className="text-[12px] font-semibold text-sim border border-sim/40 bg-sim/5 rounded-md px-3 py-1.5" data-testid="simulated-banner">
      {SIMULATED_BANNER}
    </p>
  );
}
