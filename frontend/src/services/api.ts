import type { Match, User } from "../types";

export const api = {
    // ---- Usuarios ----
    login: async (credentials: any): Promise<User> => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        if (!response.ok) throw new Error("Login fallido");
        return response.json();
    },

    register: async (userData: any): Promise<User> => {
        const response = await fetch('/api/usuarios/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (!response.ok) throw new Error("Registro fallido");
        return response.json();
    },

    // ---- Partidos ----
    getMatches: async (): Promise<Match[]> => {
        const response = await fetch('/api/partidos');
        if (!response.ok) throw new Error("Error obteniendo partidos");
        return response.json();
    },

    getMatchById: async (id: string): Promise<Match> => {
        const response = await fetch(`/api/partidos/${id}`);
        if (!response.ok) throw new Error("Error obteniendo el detalle");
        return response.json();
    },

    createMatch: async (matchData: any): Promise<Match> => {
        const response = await fetch('/api/partidos/crear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(matchData)
        });
        if (!response.ok) throw new Error("Falló la creación del partido");
        return response.json();
    },

    joinMatch: async (matchId: string, userId: string | number): Promise<Match> => {
        const response = await fetch(`/api/partidos/${matchId}/unirse/${userId}`, {
            method: 'POST'
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || "Error uniéndose al partido");
        }
        return response.json();
    },

    confirmMatch: async (matchId: string): Promise<Match> => {
        const response = await fetch(`/api/partidos/${matchId}/confirmar`, {
            method: 'POST'
        });
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || "No se puede confirmar");
        }
        return response.json();
    }
};
