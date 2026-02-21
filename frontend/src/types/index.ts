export type Sport = "Fútbol" | "Básquet" | "Vóley" | "Tenis" | "Pádel";

export type SkillLevel = "PRINCIPIANTE" | "INTERMEDIO" | "AVANZADO";

export type MatchState = "NECESITAMOS_JUGADORES" | "PARTIDO_ARMADO" | "CONFIRMADO" | "EN_JUEGO" | "FINALIZADO" | "CANCELADO";

export interface User {
    id?: string | number; // Back sends ID
    nombreUsuario: string;
    correo: string;
    contrasenia?: string;
    deporteFavorito?: Sport;
    nivel?: SkillLevel;
}

export interface Match {
    id: string | number;
    deporte: Sport;
    cantidadJugadoresReq: number;
    duracionMinutos: number;
    ubicacion: string;
    horario: string; // ISO String without timezone Z might be sent locally 2026-03-01T19:00:00
    nivelRequerido?: SkillLevel;
    estadoActualType: MatchState;
    jugadoresEnlistados?: User[];
    creador: { id: string | number, nombreUsuario?: string };
}
