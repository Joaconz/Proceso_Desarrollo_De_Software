export type Sport = "Futbol" | "Basquet" | "Voley" | "Tenis" | "Padel";

export type SkillLevel = "Principiante" | "Intermedio" | "Avanzado";

export type MatchState = "NecesitamosJugadores" | "PartidoArmado" | "Confirmado" | "EnJuego" | "Finalizado" | "Cancelado";

export interface User {
    id: string;
    username: string;
    email: string;
    favoriteSport?: Sport;
    skillLevel?: SkillLevel;
}

export interface Match {
    id: string;
    sport: Sport;
    requiredPlayers: number;
    durationMinutes: number;
    location: string;
    date: string; // ISO String
    minSkillLevel?: SkillLevel;
    maxSkillLevel?: SkillLevel;
    currentState: MatchState;
    players: User[];
    organizerId: string;
}
