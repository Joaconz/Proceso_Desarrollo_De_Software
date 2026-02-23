import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { CopySlash, Home, PlusCircle, Search, User } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";

export default function MainLayout() {
    const location = useLocation();
    const { user } = useAuth();

    // Check authentication
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const navItems = [
        { name: "Dashboard", href: "/", icon: Home },
        { name: "Buscar Partidos", href: "/search", icon: Search },
        { name: "Crear Partido", href: "/create", icon: PlusCircle },
        { name: "Perfil", href: "/profile", icon: User },
    ];

    return (
        <div className="flex h-screen w-full flex-col bg-background text-text md:flex-row">
            {/* Sidebar - Desktop */}
            <aside className="hidden w-64 flex-col border-r border-border bg-surface p-6 md:flex">
                <div className="flex items-center gap-2 mb-8 text-primary">
                    <CopySlash className="h-8 w-8" />
                    <h1 className="text-xl font-bold text-white">MatchFinder</h1>
                </div>

                <nav className="flex-1 space-y-2 text-sm font-medium">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all text-textMuted hover:bg-[#27272a] hover:text-white",
                                    isActive && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
                <div className="flex-1 p-4 md:p-8 w-full max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* Bottom Nav - Mobile */}
            <nav className="flex items-center justify-around border-t border-border bg-surface p-3 md:hidden">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 p-2 text-textMuted",
                                isActive && "text-primary"
                            )}
                        >
                            <item.icon className="h-6 w-6" />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
