import type { Match, User, Deporte, SkillLevel } from "../types";

export const api = {
    // ---- Usuarios ----
    login: async (credentials: any): Promise<User> => {
        // Backend doesn't have a login endpoint, mock it for now
        return {
            id: 1,
            nombreUsuario: credentials.correo.split('@')[0],
            correo: credentials.correo,
            deporteFavorito: { id: 1, nombre: "Futbol", cantidadJugadoresPermitidos: 22 },
            nivel: "INTERMEDIO"
        };
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

    // ---- Metadatos ----
    getDeportes: async (): Promise<Deporte[]> => {
        const response = await fetch('/api/metadata/deportes');
        if (!response.ok) throw new Error("Error obteniendo deportes");
        return response.json();
    },

    getNiveles: async (): Promise<SkillLevel[]> => {
        const response = await fetch('/api/metadata/niveles');
        if (!response.ok) throw new Error("Error obteniendo niveles");
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
        if (!response.ok) throw new Error("Match no encontrado");
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

    joinMatch: async (matchId: string | number, userId: string | number): Promise<Match> => {
        const response = await fetch(`/api/partidos/${matchId}/unirse/${userId}`, {
            method: 'POST'
        });
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || "Error uniéndose al partido");
        }
        return response.json();
    },

    confirmMatch: async (matchId: string | number): Promise<Match> => {
        const response = await fetch(`/api/partidos/${matchId}/confirmar`, {
            method: 'POST'
        });
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || "No se puede confirmar");
        }
        return response.json();
    },

    cancelMatch: async (matchId: string | number): Promise<Match> => {
        const response = await fetch(`/api/partidos/${matchId}/cancelar`, {
            method: 'POST'
        });
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || "No se puede cancelar");
        }
        return response.json();
    },

    startMatch: async (matchId: string | number): Promise<Match> => {
        const response = await fetch(`/api/partidos/${matchId}/iniciar`, {
            method: 'POST'
        });
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || "No se puede iniciar");
        }
        return response.json();
    },

    finishMatch: async (matchId: string | number): Promise<Match> => {
        const response = await fetch(`/api/partidos/${matchId}/finalizar`, {
            method: 'POST'
        });
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || "No se puede finalizar");
        }
        return response.json();
    },

    leaveMatch: async (matchId: string | number, userId: string | number): Promise<Match> => {
        const response = await fetch(`/api/partidos/${matchId}/abandonar/${userId}`, {
            method: 'POST'
        });
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || "No se puede abandonar el partido");
        }
        return response.json();
    },

    editMatch: async (matchId: string | number, data: { ubicacion?: string; horario?: string; duracionMinutos?: number }): Promise<Match> => {
        const response = await fetch(`/api/partidos/${matchId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || "No se puede editar el partido");
        }
        return response.json();
    }
};
