import { Users } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import type { Match } from "../../types";

interface Props {
    match: Match;
}

/**
 * SRP: responsabilidad única — mostrar la lista de jugadores inscritos y vacantes.
 */
export function PlayerList({ match }: Props) {
    const enrolled = match.jugadoresInscritos || [];
    const vacantes = Math.max(0, match.cantidadJugadoresReq - enrolled.length);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Jugadores Confirmados</CardTitle>
                    <CardDescription>Faltan {vacantes} jugadores</CardDescription>
                </div>
                <Users className="h-5 w-5 text-textMuted" />
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {enrolled.map((player, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-border flex items-center justify-center font-bold text-primary">
                                    {player.nombreUsuario?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-medium text-white text-sm">{player.nombreUsuario}</p>
                                    {player.id === match.creador?.id && (
                                        <span className="text-[10px] uppercase text-primary font-bold">Organizador</span>
                                    )}
                                </div>
                            </div>
                            {player.nivel && (
                                <Badge variant="secondary" className="text-xs font-normal">{player.nivel}</Badge>
                            )}
                        </div>
                    ))}

                    {Array.from({ length: vacantes }).map((_, idx) => (
                        <div key={`empty-${idx}`} className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-border/60 opacity-60">
                            <div className="h-10 w-10 rounded-full bg-border/50 flex items-center justify-center">
                                <Users className="h-5 w-5 text-textMuted" />
                            </div>
                            <div><p className="text-sm text-textMuted italic">Lugar disponible</p></div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
