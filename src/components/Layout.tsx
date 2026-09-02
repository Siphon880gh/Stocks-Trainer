import { Outlet } from "react-router-dom";
import AppChrome from "./AppChrome";

export default function Layout() {
  return (
    <AppChrome>
      <Outlet />
    </AppChrome>
  );
}
