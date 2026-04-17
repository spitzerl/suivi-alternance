import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, LogOut, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, email, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/60">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 text-foreground hover:opacity-80 transition-opacity">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-semibold text-[15px] tracking-tight">Suivi Alternance</span>
          </Link>

          <nav className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="mr-1 text-muted-foreground hover:text-foreground h-8 w-8 p-0"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className={cn(
                    "px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors",
                    location.pathname === '/login'
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className={cn(
                    "px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors",
                    location.pathname === '/register'
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Inscription
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className={cn(
                    "px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors",
                    location.pathname === '/dashboard'
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Candidatures
                </Link>
                <Link
                  to="/settings"
                  className={cn(
                    "px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors",
                    location.pathname === '/settings'
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Paramètres
                </Link>
                <span className="text-[12px] text-muted-foreground ml-2 hidden sm:inline">{email}</span>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="ml-1 text-muted-foreground hover:text-foreground h-8 w-8 p-0">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
