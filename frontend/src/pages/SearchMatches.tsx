import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, Brain, MapIcon, History, List } from "lucide-react";
import { api } from "../services/api";
import type { Match } from "../types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

type Algoritmo = "NONE" | "NIVEL" | "CERCANIA" | "HISTORIAL";

const ALGORITMOS: { id: Algoritmo; label: string; desc: string; icon: React.ElementType }[] = [
    {
        id: "NONE",
        label: "Todos",
        desc: "Todos los partidos abiertos.",
        icon: List,
    },
    {
        id: "NIVEL",
        label: "Por Nivel",
        desc: "Partidos que coinciden con tu nivel.",
        icon: Brain,
    },
    {
        id: "CERCANIA",
        label: "Por Cercanía",
        desc: "Partidos en tu barrio preferido.",
        icon: MapIcon,
    },
    {
        id: "HISTORIAL",
        label: "Por Historial",
        desc: "Partidos con jugadores experimentados.",
        icon: History,
    },
];

export default function SearchMatches() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [algoritmo, setAlgoritmo] = useState<Algoritmo>("NONE");
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const loadMatches = (algo: Algoritmo) => {
        setLoading(true);
        setError(null);
        const currentUserId = user?.id || 1;

        const request: Promise<Match[]> =
            algo === "NONE"
                ? api.getMatches()
                : api.getRecommendedMatches(currentUserId, algo);

        request
            .then((data) => {
                const LEVEL_ORDER: Record<string, number> = { PRINCIPIANTE: 0, INTERMEDIO: 1, AVANZADO: 2 };
                const userLevel = user?.nivel ? LEVEL_ORDER[user.nivel] ?? 99 : 99;

                let filtered = algo === "NONE"
                    ? data.filter((m: Match) => m.estadoActualType === "NECESITAMOS_JUGADORES")
                    : data;

                // Filtrar partidos con nivel superior al del usuario
                filtered = filtered.filter((m: Match) =>
                    !m.nivelRequerido || (LEVEL_ORDER[m.nivelRequerido] ?? 0) <= userLevel
                );

                setMatches(filtered);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || "Error al cargar partidos.");
                setLoading(false);
            });
    };

    useEffect(() => {
        loadMatches(algoritmo);
    }, [algoritmo]);

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

    const algoActual = ALGORITMOS.find((a) => a.id === algoritmo)!;

    return (
        <div className="space-y-6">
            {/* Encabezado */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Buscar Partido</h1>
                <p className="text-textMuted">Explorá los encuentros disponibles y unite al que prefieras.</p>
            </div>

            {/* Selector de estrategia de emparejamiento */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Brain className="h-4 w-4 text-primary" />
                    Estrategia de emparejamiento
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {ALGORITMOS.map((a) => {
                        const Icon = a.icon;
                        const active = algoritmo === a.id;
                        return (
                            <button
                                key={a.id}
                                onClick={() => setAlgoritmo(a.id)}
                                className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all
                                    ${active
                                        ? "border-primary bg-primary/10 text-white"
                                        : "border-border bg-background/40 text-textMuted hover:border-primary/40"
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />
                                    <span className="font-medium text-sm">{a.label}</span>
                                </div>
                                <p className="text-xs leading-snug opacity-70">{a.desc}</p>
                            </button>
                        );
                    })}
                </div>
                {algoritmo !== "NONE" && (
                    <p className="text-xs text-primary/80">
                        ✦ Mostrando resultados filtrados por: <strong>{algoActual.label}</strong>
                    </p>
                )}
            </div>

            {/* Estado de carga / error */}
            {loading && (
                <div className="flex items-center justify-center min-h-[30vh]">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
            )}

            {error && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-red-400">
                    {error}
                    {algoritmo === "HISTORIAL" && (
                        <p className="mt-1 opacity-70">
                            Nota: la estrategia por historial requiere haber jugado partidos previos.
                        </p>
                    )}
                </div>
            )}

            {/* Grilla de partidos */}
            {!loading && !error && (
                <>
                    {matches.length === 0 ? (
                        <div className="text-center py-16 text-textMuted">
                            <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p className="text-lg font-medium">No hay partidos disponibles</p>
                            <p className="text-sm mt-1">
                                {algoritmo !== "NONE"
                                    ? "Probá con otra estrategia de búsqueda o verificá tu perfil."
                                    : "Aún no hay partidos abiertos."}
                            </p>
                        </div>
                    ) : (
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
                                        <CardDescription className="flex items-center gap-2 mt-1 flex-wrap">
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
                                                {new Date(match.horario).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                {" "}• {match.duracionMinutos} min
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-textMuted">
                                            <MapPin className="h-4 w-4 flex-shrink-0" />
                                            <span className="truncate">{match.ubicacion}</span>
                                        </div>

                                        {/* Barra de progreso de jugadores */}
                                        <div className="mt-4 pt-4 border-t border-border">
                                            <div className="flex items-center justify-between text-sm mb-1">
                                                <div className="flex items-center gap-2 text-textMuted">
                                                    <Users className="h-4 w-4" />
                                                    <span>Jugadores</span>
                                                </div>
                                                <span className="font-semibold text-white">
                                                    {match.jugadoresInscritos?.length || 0} / {match.cantidadJugadoresReq}
                                                </span>
                                            </div>
                                            <div className="w-full h-2 bg-[#27272a] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary transition-all duration-500"
                                                    style={{
                                                        width: `${Math.min(
                                                            100,
                                                            ((match.jugadoresInscritos?.length || 0) /
                                                                match.cantidadJugadoresReq) *
                                                            100
                                                        )}%`,
                                                    }}
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
                    )}
                </>
            )}
        </div>
    );
}
