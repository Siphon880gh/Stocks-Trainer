import { SAMPLE_DATA_NOTE } from "../lib/learnerCopy";

export { SAMPLE_DATA_NOTE };

/** Muted honesty line. Place it after the main heading or paragraph. */
export default function SampleDataNote({
  className = "text-[12px] text-muted",
}: {
  className?: string;
}) {
  return <p className={className}>{SAMPLE_DATA_NOTE}</p>;
}
