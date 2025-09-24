import { NavLink } from "react-router-dom";
import { LayoutDashboard, BarChart3, ListChecks } from "lucide-react";

const navLinks = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/gasometros", label: "Gasômetros", icon: BarChart3 },
  { to: "/alertas", label: "Alertas", icon: ListChecks },
];

export function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 bg-gray-100 dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-bold mb-8 text-center">GasControl</h1>
      <nav className="flex flex-col space-y-2">
        {navLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end // 'end' prop ensures the root '/' link isn't active for all child routes
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}