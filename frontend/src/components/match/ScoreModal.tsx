import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import type { Match } from "../../types";

interface TeamResult {
    nombreLocal: string;
    puntajeLocal: string;
    nombreVisitante: string;
    puntajeVisitante: string;
}

interface Props {
    match: Match;
    scores: Record<number, string>;
    onScoreChange: (id: number, value: string) => void;
    teamResult: TeamResult;
    onTeamResultChange: (field: keyof TeamResult, value: string) => void;
    onConfirm: () => void;
    onCancel: () => void;
    loading: boolean;
}

/**
 * SRP: responsabilidad única — modal de ingreso de puntajes al finalizar.
 * Modo 1 (2 jugadores): muestra el nombre de cada participante + input individual.
 * Modo 2 (equipo): solicita nombre y puntaje de los dos equipos.
 */
export function ScoreModal({
    match, scores, onScoreChange,
    teamResult, onTeamResultChange,
    onConfirm, onCancel, loading
}: Props) {
    const isTeamMatch = (match.cantidadJugadoresReq ?? 0) > 2;
    const label = match.deporte?.tipoPuntuacion === "SETS" ? "Sets" : "Goles";

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-surface border border-border rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                    <h3 className="text-lg font-semibold text-white">
                        {isTeamMatch ? "Resultado del Partido" : "Ingresar Resultados"}
                    </h3>
                    <p className="text-sm text-textMuted mt-1">
                        {isTeamMatch
                            ? `Indicá el nombre de cada equipo y la cantidad de ${label.toLowerCase()} obtenidos.`
                            : `Ingresá los ${label.toLowerCase()} para cada jugador antes de cerrar el partido.`}
                    </p>
                </div>

                <div className="p-6 space-y-4">
                    {isTeamMatch ? (
                        <>
                            {/* Equipo Local */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-textMuted uppercase tracking-wider">
                                    Equipo Local
                                </label>
                                <div className="flex gap-3 items-center">
                                    <Input
                                        className="flex-1"
                                        placeholder="Nombre del equipo"
                                        value={teamResult.nombreLocal}
                                        onChange={e => onTeamResultChange("nombreLocal", e.target.value)}
                                    />
                                    <Input
                                        type="number"
                                        min="0"
                                        className="w-20 text-center font-bold"
                                        placeholder="0"
                                        value={teamResult.puntajeLocal}
                                        onChange={e => onTeamResultChange("puntajeLocal", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-border" />
                                <span className="text-xs text-textMuted font-semibold">VS</span>
                                <div className="flex-1 h-px bg-border" />
                            </div>

                            {/* Equipo Visitante */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-textMuted uppercase tracking-wider">
                                    Equipo Visitante
                                </label>
                                <div className="flex gap-3 items-center">
                                    <Input
                                        className="flex-1"
                                        placeholder="Nombre del equipo"
                                        value={teamResult.nombreVisitante}
                                        onChange={e => onTeamResultChange("nombreVisitante", e.target.value)}
                                    />
                                    <Input
                                        type="number"
                                        min="0"
                                        className="w-20 text-center font-bold"
                                        placeholder="0"
                                        value={teamResult.puntajeVisitante}
                                        onChange={e => onTeamResultChange("puntajeVisitante", e.target.value)}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {match.participantes?.map((p) => (
                                <div key={p.id} className="flex justify-between items-center bg-background p-3 rounded-lg border border-border">
                                    <span className="font-medium text-white">{p.nombre}</span>
                                    <Input
                                        type="number"
                                        min="0"
                                        className="w-24 text-center font-bold"
                                        placeholder="0"
                                        value={scores[p.id] || ""}
                                        onChange={(e) => onScoreChange(p.id, e.target.value)}
                                    />
                                </div>
                            ))}
                            {(!match.participantes || match.participantes.length === 0) && (
                                <p className="text-sm text-warning bg-warning/10 border border-warning/30 p-3 rounded-lg">
                                    No se encontraron participantes válidos para puntuar.
                                </p>
                            )}
                        </>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
                    <Button variant="ghost" onClick={onCancel} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button onClick={onConfirm} disabled={loading}>
                        {loading ? "Guardando..." : "Validar y Finalizar"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
