import { createContext, useContext, useState, type ReactNode } from "react";
import type { User } from "../types";

interface AuthContextValue {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "user";

/**
 * AuthContext centraliza el estado de autenticación (SRP).
 * Reemplaza los accesos dispersos a localStorage.getItem("user")
 * en cada página con un único punto de verdad.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    });

    const login = (u: User) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
        setUser(u);
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

/** Hook de conveniencia con validación de contexto. */
export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
    return ctx;
}
