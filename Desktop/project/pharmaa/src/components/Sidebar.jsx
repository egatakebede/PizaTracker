import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  FileText,
  Users,
  Truck,
  BarChart2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { useTheme } from "./ThemeContext";
import { logout } from "../authService";

export const navigation = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inventory", label: "Inventory", icon: Boxes, badge: 3 },
  { to: "/sales", label: "Orders", icon: ShoppingCart },
  { to: "/prescriptions", label: "Prescriptions", icon: FileText },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/suppliers", label: "Suppliers", icon: Truck },
  { to: "/reports", label: "Reports", icon: BarChart2 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const toggleCollapse = () => setCollapsed(!collapsed);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin");
      setMobileOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const sidebarBaseClasses =
    "flex flex-col transition-all duration-300 border-r min-h-screen";

  const sidebarThemeClasses =
    theme === "dark"
      ? "bg-gray-900 border-gray-700 text-gray-200"
      : "bg-white border-gray-200 text-gray-700";

  const sidebarWidth = collapsed ? "w-20" : "w-64";

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-md shadow"
        onClick={toggleMobile}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside
        className={`${sidebarBaseClasses} ${sidebarThemeClasses} ${sidebarWidth}
          ${mobileOpen ? "fixed top-0 left-0 z-40 h-full" : "hidden md:flex"}`}
      >
        <div className="flex justify-end p-2 border-b border-border">
          <button
            className="p-1 rounded hover:bg-muted"
            onClick={toggleCollapse}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors relative group",
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300"
                      : `${theme === "dark" ? "text-gray-200 hover:bg-gray-800 hover:text-white" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}`
                  ].join(" ")
                }
                title={collapsed ? item.label : undefined}
                onClick={() => setMobileOpen(false)}
              >
                <Icon className="w-5 h-5" />
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className="ml-auto text-xs bg-red-500 text-white rounded-full px-2 py-0.5">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className={`p-3 border-t mt-auto ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md transition-colors
              ${theme === "dark" ? "text-gray-200 hover:bg-gray-800 hover:text-white" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}`}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className="w-5 h-5 text-red-500" />
            {!collapsed && (
              <span className="text-red-600 dark:text-red-400 font-medium">
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={toggleMobile}
        />
      )}
    </>
  );
}