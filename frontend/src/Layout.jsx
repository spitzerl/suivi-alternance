import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  GraduationCap,
  LogOut,
  Sun,
  Moon,
  LayoutDashboard,
  Settings,
  UserPlus,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, email, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = isAuthenticated
    ? [
        { label: "Candidatures", path: "/dashboard", icon: LayoutDashboard },
        { label: "Paramètres", path: "/settings", icon: Settings },
      ]
    : [
        { label: "Connexion", path: "/login", icon: LogIn },
        { label: "Inscription", path: "/register", icon: UserPlus },
      ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 sm:px-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity"
          >
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold text-base sm:text-lg tracking-tight">
              Suivi Alternance
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-1 mr-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === item.path
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
            >
              {theme === "light" ? (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              )}
            </Button>

            {isAuthenticated && (
              <div className="flex items-center gap-2 ml-2">
                <span className="text-[12px] text-muted-foreground hidden lg:inline">
                  {email}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="h-9 w-9 text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="h-[1.2rem] w-[1.2rem]" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border flex items-center justify-around px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "fill-primary/20")} />
              <span className="text-[10px] font-medium uppercase tracking-wider">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
