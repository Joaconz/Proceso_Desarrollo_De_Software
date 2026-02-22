export interface Deporte {
    id: number;
    nombre: string;
    cantidadJugadoresPermitidos: number;
}

export type SkillLevel = "PRINCIPIANTE" | "INTERMEDIO" | "AVANZADO";

export type MatchState = "NECESITAMOS_JUGADORES" | "PARTIDO_ARMADO" | "CONFIRMADO" | "EN_JUEGO" | "FINALIZADO" | "CANCELADO";

export interface User {
    id?: string | number; // Back sends ID
    nombreUsuario: string;
    correo: string;
    contrasenia?: string;
    deporteFavorito?: Deporte;
    nivel?: SkillLevel;
}

export interface Match {
    id: string | number;
    deporte: Deporte;
    cantidadJugadoresReq: number;
    duracionMinutos: number;
    ubicacion: string;
    horario: string; // ISO String without timezone Z might be sent locally 2026-03-01T19:00:00
    nivelRequerido?: SkillLevel;
    estadoActualType: MatchState;
    jugadoresInscritos?: User[];
    creador: User;
}
