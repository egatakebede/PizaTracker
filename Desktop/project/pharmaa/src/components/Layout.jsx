import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useTheme } from "./ThemeContext";

export default function Layout() {
  const { theme } = useTheme();

  return (
    <div className={`flex h-screen overflow-hidden font-sans ${theme === "dark" ? "bg-slate-900" : "bg-gray-50"}`}>
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
            <Topbar />
            <main className="flex-1 overflow-y-auto p-6">
                <Outlet />
            </main>
        </div>
    </div>
  );
}