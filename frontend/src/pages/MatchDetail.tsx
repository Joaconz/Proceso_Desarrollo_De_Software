import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Trophy, Users, AlertCircle, CheckCircle2 } from "lucide-react";
import { api } from "../services/api";
import type { Match } from "../types";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";

export default function MatchDetail() {
    const { id } = useParams<{ id: string }>();
    const [match, setMatch] = useState<Match | null>(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [joined, setJoined] = useState(false);

    useEffect(() => {
        if (id) {
            api.getMatchById(id).then((data) => {
                setMatch(data || null);
                setLoading(false);
            });
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!match) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Partido no encontrado</h2>
                <p className="text-textMuted mb-6">El partido que buscas no existe o ha sido eliminado.</p>
                <Button>
                    <Link to="/">Volver al Dashboard</Link>
                </Button>
            </div>
        );
    }

    const handleJoin = async () => {
        setJoining(true);
        try {
            await api.joinMatch(match!.id.toString(), 1); // Mocking user ID 1 for now
            const updatedMatch = await api.getMatchById(match!.id.toString());
            setMatch(updatedMatch);
            setJoined(true);
        } catch (error) {
            console.error("Error uniéndose:", error);
        } finally {
            setJoining(false);
        }
    };

    const isFull = (match.jugadoresEnlistados?.length || 0) >= match.cantidadJugadoresReq;
    const canJoin = !isFull && !joined && match.estadoActualType === "NECESITAMOS_JUGADORES";

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-white tracking-tight">{match.deporte}</h1>
                        <Badge variant="outline">{match.nivelRequerido || "Todos los niveles"}</Badge>
                    </div>
                    <p className="text-textMuted flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> {match.ubicacion}
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-surface p-4 rounded-xl border border-border">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                            {match.jugadoresEnlistados?.length || 0} <span className="text-textMuted text-lg font-normal">/ {match.cantidadJugadoresReq}</span>
                        </div>
                        <div className="text-xs text-textMuted uppercase tracking-wider">Jugadores</div>
                    </div>
                    {joined ? (
                        <Button variant="outline" className="text-success border-success/30 bg-success/10 cursor-default">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Inscripto
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            onClick={handleJoin}
                            disabled={!canJoin || joining}
                            className="w-full md:w-auto shadow-lg shadow-primary/20"
                        >
                            {joining ? "Uniendo..." : isFull ? "Partido Lleno" : "Unirme al Partido"}
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalles del Encuentro</CardTitle>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-border rounded-lg text-primary">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-white">Fecha</h4>
                                        <p className="text-sm text-textMuted">{new Date(match.horario).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-border rounded-lg text-primary">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-white">Hora y Duración</h4>
                                        <p className="text-sm text-textMuted">
                                            {new Date(match.horario).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            <span className="mx-2">•</span>
                                            {match.duracionMinutos} minutos
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-border rounded-lg text-primary">
                                        <Trophy className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-white">Nivel Requerido</h4>
                                        <p className="text-sm text-textMuted">
                                            {match.nivelRequerido ? `Nivel: ${match.nivelRequerido}` : "Para todos los niveles"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Jugadores Confirmados</CardTitle>
                                <CardDescription>
                                    Faltan {Math.max(0, match.cantidadJugadoresReq - (match.jugadoresEnlistados?.length || 0))} jugadores
                                </CardDescription>
                            </div>
                            <Users className="h-5 w-5 text-textMuted" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {(match.jugadoresEnlistados || []).map((player, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-border flex items-center justify-center font-bold text-primary">
                                                {player.nombreUsuario.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white text-sm">{player.nombreUsuario}</p>
                                                {player.id === match.creador?.id && (
                                                    <span className="text-[10px] uppercase text-primary font-bold">Organizador</span>
                                                )}
                                            </div>
                                        </div>
                                        {player.nivel && (
                                            <Badge variant="secondary" className="text-xs font-normal">
                                                {player.nivel}
                                            </Badge>
                                        )}
                                    </div>
                                ))}

                                {Array.from({ length: Math.max(0, match.cantidadJugadoresReq - (match.jugadoresEnlistados?.length || 0)) }).map((_, idx) => (
                                    <div key={`empty-${idx}`} className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-border/60 opacity-60">
                                        <div className="h-10 w-10 rounded-full bg-border/50 flex items-center justify-center">
                                            <Users className="h-5 w-5 text-textMuted" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-textMuted italic">Lugar disponible</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Estado del Partido</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <StatusStep
                                    label="Necesitamos Jugadores"
                                    isActive={match.estadoActualType === "NECESITAMOS_JUGADORES" || isFull}
                                    isCompleted={isFull}
                                />
                                <StatusStep
                                    label="Partido Armado"
                                    isActive={match.estadoActualType === "PARTIDO_ARMADO"}
                                    isCompleted={match.estadoActualType !== "NECESITAMOS_JUGADORES" && match.estadoActualType !== "PARTIDO_ARMADO"}
                                />
                                <StatusStep
                                    label="Confirmado"
                                    isActive={match.estadoActualType === "CONFIRMADO"}
                                    isCompleted={match.estadoActualType === "EN_JUEGO" || match.estadoActualType === "FINALIZADO"}
                                />
                                <StatusStep
                                    label="En Juego"
                                    isActive={match.estadoActualType === "EN_JUEGO"}
                                    isCompleted={match.estadoActualType === "FINALIZADO"}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function StatusStep({ label, isActive, isCompleted }: { label: string, isActive: boolean, isCompleted: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <div className={`h-6 w-6 rounded-full flex items-center justify-center border-2 
        ${isCompleted ? 'bg-primary border-primary text-white' :
                    isActive ? 'border-primary text-primary' : 'border-border text-textMuted'}`}
            >
                {isCompleted && <CheckCircle2 className="h-4 w-4" />}
            </div>
            <span className={`text-sm ${isActive || isCompleted ? 'text-white font-medium' : 'text-textMuted'}`}>
                {label}
            </span>
        </div>
    );
}
