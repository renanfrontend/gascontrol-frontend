import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, BarChart3, ListChecks } from "lucide-react";
import { useUiStore } from "~/store/uiStore";
import { cn } from "~/lib/utils";

// O array de links não pode estar comentado
const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/gasometros", label: "Gasômetros", icon: BarChart3 },
    { to: "/alertas", label: "Alertas", icon: ListChecks },
];

// Sintaxe correta para a definição do componente
export function Sidebar() {
  const { isSidebarPinned } = useUiStore();
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = isSidebarPinned || isHovered;

  return (
    <aside
      className={cn(
        "flex-shrink-0 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out",
        isExpanded ? "w-64" : "w-20"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-8 text-center h-8 flex items-center justify-center">
          {isExpanded ? "GasControl" : "GC"}
        </h1>
        <nav className="flex flex-col space-y-2">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 py-2.5 rounded-lg transition-colors",
                  "hover:bg-gray-200 dark:hover:bg-gray-700",
                  isActive && "bg-slate-900 text-white",
                  isExpanded ? "px-4" : "px-2.5 justify-center"
                )
              }
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap transition-opacity duration-200",
                  isExpanded ? "opacity-100" : "opacity-0 hidden"
                )}
              >
                {label}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}