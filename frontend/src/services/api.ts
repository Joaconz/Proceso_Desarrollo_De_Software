import type { Match } from "../types";

export const mockMatches: Match[] = [
    {
        id: "1",
        sport: "Futbol",
        requiredPlayers: 10,
        durationMinutes: 60,
        location: "Cancha El Trébol, Palermo",
        date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        currentState: "NecesitamosJugadores",
        minSkillLevel: "Intermedio",
        players: [
            { id: "u1", username: "juanperez", email: "juan@test.com", skillLevel: "Avanzado" },
            { id: "u2", username: "marting", email: "martin@test.com", skillLevel: "Intermedio" },
        ],
        organizerId: "u1",
    },
    {
        id: "2",
        sport: "Basquet",
        requiredPlayers: 10,
        durationMinutes: 90,
        location: "Club Atlético, Belgrano",
        date: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
        currentState: "PartidoArmado",
        players: Array(10).fill({ id: "mock", username: "Jugador Anónimo", email: "anon@test.com" }),
        organizerId: "u3",
    },
    {
        id: "3",
        sport: "Tenis",
        requiredPlayers: 4,
        durationMinutes: 120,
        location: "Complejo Las Rejas",
        date: new Date(Date.now() + 43200000).toISOString(), // 12 hours from now
        currentState: "Confirmado",
        minSkillLevel: "Avanzado",
        players: Array(4).fill({ id: "mock", username: "Pro Player", email: "pro@test.com" }),
        organizerId: "u4",
    }
];

// Helper to simulate API calls
export const api = {
    getMatches: async (): Promise<Match[]> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockMatches), 600);
        });
    },
    getMatchById: async (id: string): Promise<Match | undefined> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockMatches.find(m => m.id === id)), 400);
        });
    }
};
