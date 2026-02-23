import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Trophy, Users, AlertCircle, CheckCircle2, Edit3, XCircle, Play, Flag, LogOut } from "lucide-react";
import { api } from "../services/api";
import type { Match } from "../types";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/Card";
import { Input } from "../components/ui/Input";

const CURRENT_USER_ID = 1; // Simulated user

export default function MatchDetail() {
    const { id } = useParams<{ id: string }>();
    const [match, setMatch] = useState<Match | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({ ubicacion: "", horario: "", duracionMinutos: 0 });

    const fetchMatch = async () => {
        if (!id) return;
        try {
            const data = await api.getMatchById(id);
            setMatch(data || null);
        } catch {
            setMatch(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMatch(); }, [id]);

    const doAction = async (label: string, action: () => Promise<Match>) => {
        setActionLoading(label);
        setError(null);
        try {
            const updated = await action();
            setMatch(updated);
        } catch (e: any) {
            setError(e.message || "Error ejecutando acción");
        } finally {
            setActionLoading(null);
        }
    };

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
                <Button><Link to="/">Volver al Dashboard</Link></Button>
            </div>
        );
    }

    const isCreator = match.creador?.id?.toString() === CURRENT_USER_ID.toString();
    const isEnrolled = match.jugadoresInscritos?.some(p => p.id?.toString() === CURRENT_USER_ID.toString());
    const isFull = (match.jugadoresInscritos?.length || 0) >= match.cantidadJugadoresReq;
    const canJoin = !isFull && !isEnrolled && match.estadoActualType === "NECESITAMOS_JUGADORES";
    const canEdit = isCreator && (match.estadoActualType === "NECESITAMOS_JUGADORES" || match.estadoActualType === "PARTIDO_ARMADO");

    const openEdit = () => {
        setEditForm({
            ubicacion: match.ubicacion,
            horario: match.horario?.slice(0, 16) || "",
            duracionMinutos: match.duracionMinutos,
        });
        setEditing(true);
    };

    const submitEdit = async () => {
        if (!id) return;
        setActionLoading("edit");
        setError(null);
        try {
            const updated = await api.editMatch(id, {
                ubicacion: editForm.ubicacion,
                horario: editForm.horario ? new Date(editForm.horario).toISOString().slice(0, 19) : undefined,
                duracionMinutos: editForm.duracionMinutos,
            });
            setMatch(updated);
            setEditing(false);
        } catch (e: any) {
            setError(e.message || "Error editando");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-white tracking-tight">{match.deporte.nombre}</h1>
                        <Badge variant="outline">{match.nivelRequerido || "Todos los niveles"}</Badge>
                    </div>
                    <p className="text-textMuted flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> {match.ubicacion}
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-surface p-4 rounded-xl border border-border">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                            {match.jugadoresInscritos?.length || 0} <span className="text-textMuted text-lg font-normal">/ {match.cantidadJugadoresReq}</span>
                        </div>
                        <div className="text-xs text-textMuted uppercase tracking-wider">Jugadores</div>
                    </div>
                    {canJoin && (
                        <Button
                            size="lg"
                            onClick={() => doAction("join", () => api.joinMatch(match.id, CURRENT_USER_ID))}
                            disabled={actionLoading !== null}
                            className="shadow-lg shadow-primary/20"
                        >
                            {actionLoading === "join" ? "Uniendo..." : "Unirme al Partido"}
                        </Button>
                    )}
                    {isEnrolled && !isCreator && match.estadoActualType === "NECESITAMOS_JUGADORES" && (
                        <Button variant="outline" className="text-success border-success/30 bg-success/10 cursor-default">
                            <CheckCircle2 className="h-4 w-4 mr-2" /> Inscripto
                        </Button>
                    )}
                    {isFull && !isEnrolled && (
                        <Badge variant="secondary" className="text-sm px-3 py-1.5">Partido Lleno</Badge>
                    )}
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="bg-destructive/20 border border-destructive/40 text-destructive rounded-lg p-3 text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    {/* Match Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalles del Encuentro</CardTitle>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-border rounded-lg text-primary"><Calendar className="h-5 w-5" /></div>
                                    <div>
                                        <h4 className="font-medium text-white">Fecha</h4>
                                        <p className="text-sm text-textMuted">{new Date(match.horario).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-border rounded-lg text-primary"><Clock className="h-5 w-5" /></div>
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
                                    <div className="p-2.5 bg-border rounded-lg text-primary"><Trophy className="h-5 w-5" /></div>
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

                    {/* Players */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Jugadores Confirmados</CardTitle>
                                <CardDescription>
                                    Faltan {Math.max(0, match.cantidadJugadoresReq - (match.jugadoresInscritos?.length || 0))} jugadores
                                </CardDescription>
                            </div>
                            <Users className="h-5 w-5 text-textMuted" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {(match.jugadoresInscritos || []).map((player, idx) => (
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

                                {Array.from({ length: Math.max(0, match.cantidadJugadoresReq - (match.jugadoresInscritos?.length || 0)) }).map((_, idx) => (
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

                    {/* Edit Modal */}
                    {editing && (
                        <Card className="border-primary/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Edit3 className="h-5 w-5" /> Editar Partido</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white">Ubicación</label>
                                    <Input value={editForm.ubicacion} onChange={e => setEditForm(f => ({ ...f, ubicacion: e.target.value }))} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white">Fecha y Hora</label>
                                        <Input type="datetime-local" value={editForm.horario} onChange={e => setEditForm(f => ({ ...f, horario: e.target.value }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white">Duración (min)</label>
                                        <Input type="number" value={editForm.duracionMinutos} onChange={e => setEditForm(f => ({ ...f, duracionMinutos: Number(e.target.value) }))} />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-3 border-t border-border pt-4">
                                <Button variant="ghost" onClick={() => setEditing(false)}>Cancelar</Button>
                                <Button onClick={submitEdit} disabled={actionLoading === "edit"}>
                                    {actionLoading === "edit" ? "Guardando..." : "Guardar Cambios"}
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </div>

                {/* Sidebar: State + Actions */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Estado del Partido</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <StatusStep label="Necesitamos Jugadores" isActive={match.estadoActualType === "NECESITAMOS_JUGADORES"} isCompleted={isFull || ["PARTIDO_ARMADO", "CONFIRMADO", "EN_JUEGO", "FINALIZADO"].includes(match.estadoActualType)} />
                                <StatusStep label="Partido Armado" isActive={match.estadoActualType === "PARTIDO_ARMADO"} isCompleted={["CONFIRMADO", "EN_JUEGO", "FINALIZADO"].includes(match.estadoActualType)} />
                                <StatusStep label="Confirmado" isActive={match.estadoActualType === "CONFIRMADO"} isCompleted={["EN_JUEGO", "FINALIZADO"].includes(match.estadoActualType)} />
                                <StatusStep label="En Juego" isActive={match.estadoActualType === "EN_JUEGO"} isCompleted={match.estadoActualType === "FINALIZADO"} />
                                <StatusStep label="Finalizado" isActive={match.estadoActualType === "FINALIZADO"} isCompleted={false} />
                                {match.estadoActualType === "CANCELADO" && (
                                    <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/30">
                                        <XCircle className="h-5 w-5 text-destructive" />
                                        <span className="text-sm font-medium text-destructive">Partido Cancelado</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    {match.estadoActualType !== "CANCELADO" && match.estadoActualType !== "FINALIZADO" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Acciones</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {/* Edit (creator, pre-confirmed) */}
                                {canEdit && !editing && (
                                    <Button variant="outline" className="w-full justify-start gap-2" onClick={openEdit} disabled={actionLoading !== null}>
                                        <Edit3 className="h-4 w-4" /> Editar Partido
                                    </Button>
                                )}

                                {/* Confirm (creator, PARTIDO_ARMADO) */}
                                {isCreator && match.estadoActualType === "PARTIDO_ARMADO" && (
                                    <Button className="w-full justify-start gap-2 bg-success hover:bg-success/90"
                                        onClick={() => doAction("confirm", () => api.confirmMatch(match.id))}
                                        disabled={actionLoading !== null}>
                                        <CheckCircle2 className="h-4 w-4" />
                                        {actionLoading === "confirm" ? "Confirmando..." : "Confirmar Encuentro"}
                                    </Button>
                                )}

                                {/* Start (creator, CONFIRMADO) */}
                                {isCreator && match.estadoActualType === "CONFIRMADO" && (
                                    <Button className="w-full justify-start gap-2 bg-green-600 hover:bg-green-700"
                                        onClick={() => doAction("start", () => api.startMatch(match.id))}
                                        disabled={actionLoading !== null}>
                                        <Play className="h-4 w-4" />
                                        {actionLoading === "start" ? "Iniciando..." : "Iniciar Partido"}
                                    </Button>
                                )}

                                {/* Finish (creator, EN_JUEGO) */}
                                {isCreator && match.estadoActualType === "EN_JUEGO" && (
                                    <Button className="w-full justify-start gap-2"
                                        onClick={() => doAction("finish", () => api.finishMatch(match.id))}
                                        disabled={actionLoading !== null}>
                                        <Flag className="h-4 w-4" />
                                        {actionLoading === "finish" ? "Finalizando..." : "Finalizar Partido"}
                                    </Button>
                                )}

                                {/* Leave (non-creator, enrolled, NECESITAMOS_JUGADORES) */}
                                {!isCreator && isEnrolled && match.estadoActualType === "NECESITAMOS_JUGADORES" && (
                                    <Button variant="outline" className="w-full justify-start gap-2 text-warning border-warning/30 hover:bg-warning/10"
                                        onClick={() => doAction("leave", () => api.leaveMatch(match.id, CURRENT_USER_ID))}
                                        disabled={actionLoading !== null}>
                                        <LogOut className="h-4 w-4" />
                                        {actionLoading === "leave" ? "Saliendo..." : "Abandonar Partido"}
                                    </Button>
                                )}

                                {/* Cancel (creator, pre-EN_JUEGO) */}
                                {isCreator && ["NECESITAMOS_JUGADORES", "PARTIDO_ARMADO", "CONFIRMADO"].includes(match.estadoActualType) && (
                                    <Button variant="outline" className="w-full justify-start gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
                                        onClick={() => {
                                            if (window.confirm("¿Estás seguro de que querés cancelar este partido?")) {
                                                doAction("cancel", () => api.cancelMatch(match.id));
                                            }
                                        }}
                                        disabled={actionLoading !== null}>
                                        <XCircle className="h-4 w-4" />
                                        {actionLoading === "cancel" ? "Cancelando..." : "Cancelar Partido"}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatusStep({ label, isActive, isCompleted }: { label: string; isActive: boolean; isCompleted: boolean }) {
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
