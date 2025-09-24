import { Button } from "~/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import { useUiStore } from "~/store/uiStore";
import { useAuth } from "~/contexts/AuthContext";

export function Header() {
  const { toggleSidebarPin } = useUiStore();
  const { logout } = useAuth();

  return (
    <header className="flex items-center justify-between h-16 px-8 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
      <Button variant="ghost" size="icon" onClick={toggleSidebarPin}>
        <Menu className="h-6 w-6" />
      </Button>

      <Button variant="ghost" onClick={logout}>
        Sair
        <LogOut className="ml-2 h-4 w-4" />
      </Button>
    </header>
  );
}