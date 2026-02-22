import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { api } from "../services/api";
import type { Match } from "../types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

export default function SearchMatches() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getMatches().then((data) => {
            setMatches(data);
            setLoading(false);
        });
    }, []);

    const getStateColor = (state: Match["estadoActualType"]) => {
        switch (state) {
            case "NECESITAMOS_JUGADORES": return "warning";
            case "PARTIDO_ARMADO": return "secondary";
            case "CONFIRMADO": return "success";
            case "EN_JUEGO": return "success";
            case "FINALIZADO": return "default";
            case "CANCELADO": return "destructive";
            default: return "default";
        }
    };

    const getStateLabel = (state: Match["estadoActualType"]) => {
        const labels: Record<Match["estadoActualType"], string> = {
            NECESITAMOS_JUGADORES: "Faltan Jugadores",
            PARTIDO_ARMADO: "Partido Armado",
            CONFIRMADO: "Confirmado",
            EN_JUEGO: "En Juego",
            FINALIZADO: "Finalizado",
            CANCELADO: "Cancelado",
        };
        return labels[state] || state;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Buscar Partido</h1>
                <p className="text-textMuted">Explora los eventos disponibles y únete a los que prefieras.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {matches.map((match) => (
                    <Card key={match.id} className="flex flex-col hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant={getStateColor(match.estadoActualType)}>
                                    {getStateLabel(match.estadoActualType)}
                                </Badge>
                                <div className="flex items-center text-sm font-medium text-primary">
                                    {match.deporte.nombre}
                                </div>
                            </div>
                            <CardTitle className="text-xl line-clamp-1">{match.ubicacion}</CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                                {match.nivelRequerido && (
                                    <span className="bg-[#27272a] text-xs px-2 py-0.5 rounded text-[#a1a1aa]">
                                        Nivel: {match.nivelRequerido}
                                    </span>
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-3">
                            <div className="flex items-center gap-2 text-sm text-textMuted">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(match.horario).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-textMuted">
                                <Clock className="h-4 w-4" />
                                <span>
                                    {new Date(match.horario).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    • {match.duracionMinutos} min
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-textMuted flex-wrap">
                                <MapPin className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">{match.ubicacion}</span>
                            </div>

                            <div className="mt-4 pt-4 border-t border-border">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-textMuted">
                                        <Users className="h-4 w-4" />
                                        <span>Jugadores:</span>
                                    </div>
                                    <span className="font-semibold text-white">
                                        {match.jugadoresInscritos?.length || 0} / {match.cantidadJugadoresReq}
                                    </span>
                                </div>
                                {/* Visual Progress Bar */}
                                <div className="w-full h-2 bg-[#27272a] rounded-full mt-2 overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-500"
                                        style={{ width: `${Math.min(100, ((match.jugadoresInscritos?.length || 0) / match.cantidadJugadoresReq) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">
                                <Link to={`/match/${match.id}`}>Ver Detalles</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
