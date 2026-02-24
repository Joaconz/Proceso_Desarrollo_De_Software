import type { Match, User, Deporte, SkillLevel } from "../types";

/**
 * D3 — Helper centralizado para fetch + manejo de errores (DRY / SRP).
 * Todas las funciones de la API lo reutilizan en lugar de repetir el patrón
 * response.ok → response.text() → throw Error.
 */
async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || `Error ${response.status}: ${response.statusText}`);
    }
    return response.json() as Promise<T>;
}

const JSON_HEADERS = { "Content-Type": "application/json" };

export const api = {
    // ── Usuarios ──────────────────────────────────────────────────────────────
    login: (credentials: unknown): Promise<User> =>
        apiFetch("/api/usuarios/login", {
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify(credentials),
        }),

    register: (userData: unknown): Promise<User> =>
        apiFetch("/api/usuarios/registro", {
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify(userData),
        }),

    /**
     * Registra el FCM token del dispositivo en el servidor.
     * Lo llama el frontend después del login para habilitar push reales.
     * Si falla (permissions denegados, modo DEMO), se ignora silenciosamente.
     */
    registerFcmToken: (userId: number | string, fcmToken: string): Promise<User> =>
        apiFetch(`/api/usuarios/${userId}/fcm-token`, {
            method: "PUT",
            headers: JSON_HEADERS,
            body: JSON.stringify({ fcmToken }),
        }),

    actualizarPerfil: (userId: number | string, data: { deporteId?: number; nivel?: string; barrio?: string }): Promise<User> =>
        apiFetch(`/api/usuarios/${userId}/perfil`, {
            method: "PUT",
            headers: JSON_HEADERS,
            body: JSON.stringify(data),
        }),

    // ── Metadatos ─────────────────────────────────────────────────────────────
    getDeportes: (): Promise<Deporte[]> => apiFetch("/api/metadata/deportes"),

    getNiveles: (): Promise<SkillLevel[]> => apiFetch("/api/metadata/niveles"),

    getBarrios: (): Promise<string[]> => apiFetch("/api/metadata/barrios"),

    // ── Partidos ──────────────────────────────────────────────────────────────
    getMatches: (): Promise<Match[]> => apiFetch("/api/partidos"),

    getRecommendedMatches: (userId: string | number, algoritmo?: string): Promise<Match[]> =>
        apiFetch(`/api/usuarios/${userId}/buscar-partidos?algoritmo=${algoritmo ?? "NIVEL"}`),

    getMatchById: (id: string): Promise<Match> =>
        apiFetch(`/api/partidos/${id}`),

    createMatch: (matchData: unknown): Promise<Match> =>
        apiFetch("/api/partidos/crear", {
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify(matchData),
        }),

    joinMatch: (matchId: string | number, userId: string | number): Promise<Match> =>
        apiFetch(`/api/partidos/${matchId}/unirse/${userId}`, { method: "POST" }),

    confirmMatch: (matchId: string | number): Promise<Match> =>
        apiFetch(`/api/partidos/${matchId}/confirmar`, { method: "POST" }),

    cancelMatch: (matchId: string | number): Promise<Match> =>
        apiFetch(`/api/partidos/${matchId}/cancelar`, { method: "POST" }),

    startMatch: (matchId: string | number): Promise<Match> =>
        apiFetch(`/api/partidos/${matchId}/iniciar`, { method: "POST" }),

    finishMatch: (matchId: string | number): Promise<Match> =>
        apiFetch(`/api/partidos/${matchId}/finalizar`, { method: "POST" }),

    registrarPuntaje: (matchId: string | number, participanteId: string | number, valor: string): Promise<Match> =>
        apiFetch(`/api/partidos/${matchId}/puntaje?participanteId=${participanteId}&valor=${valor}`, { method: "POST" }),

    leaveMatch: (matchId: string | number, userId: string | number): Promise<Match> =>
        apiFetch(`/api/partidos/${matchId}/abandonar/${userId}`, { method: "POST" }),

    editMatch: (matchId: string | number, data: { ubicacion?: string; horario?: string; duracionMinutos?: number }): Promise<Match> =>
        apiFetch(`/api/partidos/${matchId}`, {
            method: "PUT",
            headers: JSON_HEADERS,
            body: JSON.stringify(data),
        }),

    finalizarConResultado: (
        matchId: string | number,
        data: { nombreLocal: string; puntajeLocal: string; nombreVisitante: string; puntajeVisitante: string }
    ): Promise<Match> =>
        apiFetch(`/api/partidos/${matchId}/finalizar-con-resultado`, {
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify({
                nombreLocal: data.nombreLocal,
                puntajeLocal: parseInt(data.puntajeLocal) || 0,
                nombreVisitante: data.nombreVisitante,
                puntajeVisitante: parseInt(data.puntajeVisitante) || 0,
            }),
        }),

    /**
     * Finaliza un duelo (partido de 2 jugadores) registrando sets/goles
     * y cambiando el estado en una sola transacción.
     * puntajes: Record<participanteId, valor>
     */
    finalizarDuelo: (matchId: string | number, puntajes: Record<number, string>): Promise<Match> => {
        // Convertir keys a string para JSON (el backend acepta Map<String, String>)
        const body: Record<string, string> = {};
        Object.entries(puntajes).forEach(([k, v]) => { body[k] = v; });
        return apiFetch(`/api/partidos/${matchId}/finalizar-duelo`, {
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify(body),
        });
    },
};
