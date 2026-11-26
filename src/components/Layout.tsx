import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppChrome from "./AppChrome";
import { recordVisit } from "../lib/mapProgress";
import { PageLoading } from "../lib/lazyPage";

export default function Layout() {
  const { pathname } = useLocation();
  // Progress Map (#23): remember which pages were opened, so the map can fill in what was explored.
  useEffect(() => recordVisit(pathname), [pathname]);
  return (
    <AppChrome>
      <Suspense fallback={<PageLoading />}>
        <Outlet />
      </Suspense>
    </AppChrome>
  );
}
