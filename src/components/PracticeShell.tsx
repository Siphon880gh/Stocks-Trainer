import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import YouTubeSearchLink from "./YouTubeSearchLink";

export default function PracticeShell({
  title,
  blurb,
  children,
}: {
  title: string;
  blurb: string;
  children: ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full space-y-4">
        <div>
          <p className="text-[12px] text-muted">
            <Link to="/training" className="hover:text-ink">
              Learn
            </Link>
            {" · Misc Practices"}
          </p>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
            <YouTubeSearchLink title={title} />
          </div>
          <p className="text-[13px] text-muted">{blurb}</p>
        </div>
        {children}
      </main>
    </div>
  );
}
