import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, AlertCircle, CheckCircle2, Trophy, Users } from "lucide-react";
import { api } from "../services/api";
import type { Match } from "../types";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { MatchInfo } from "../components/match/MatchInfo";
import { PlayerList } from "../components/match/PlayerList";
import { MatchStateProgress } from "../components/match/MatchStateProgress";
import { MatchActions } from "../components/match/MatchActions";
import { ScoreModal } from "../components/match/ScoreModal";

/**
 * SRP aplicado: MatchDetail actúa como orquestador.
 * La lógica de UI está delegada a sub-componentes especializados:
 *   - MatchInfo: detalles informativos
 *   - PlayerList: lista de jugadores
 *   - MatchStateProgress: ciclo de estados
 *   - MatchActions: botones de acción
 *   - ScoreModal: modal de puntajes
 */
export default function MatchDetail() {
    const storedStr = localStorage.getItem("user");
    const storedUser = storedStr ? JSON.parse(storedStr) : null;
    const CURRENT_USER_ID = storedUser?.id || 1;

    const { id } = useParams<{ id: string }>();
    const [match, setMatch] = useState<Match | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [showScoreModal, setShowScoreModal] = useState(false);
    const [scores, setScores] = useState<Record<number, string>>({});
    const [teamResult, setTeamResult] = useState({
        nombreLocal: "Equipo Local",
        puntajeLocal: "",
        nombreVisitante: "Equipo Visitante",
        puntajeVisitante: "",
    });
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({ ubicacion: "", horario: "", duracionMinutos: 0 });

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 4500);
    };

    const loadMatch = async () => {
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

    useEffect(() => { loadMatch(); }, [id]);

    const doAction = async (label: string, action: () => Promise<Match>, successMessage?: string) => {
        setActionLoading(label);
        setError(null);
        try {
            const updated = await action();
            setMatch(updated);
            if (successMessage) showToast(successMessage);
        } catch (e: any) {
            setError(e.message || "Error ejecutando acción");
        } finally {
            setActionLoading(null);
        }
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

    const submitScoresAndFinish = async () => {
        if (!match) return;
        setActionLoading("finish");
        setError(null);
        const isTeamMatch = (match.cantidadJugadoresReq ?? 0) > 2;
        try {
            let updated: typeof match;
            if (isTeamMatch) {
                updated = await api.finalizarConResultado(match.id, teamResult);
            } else {
                // Partido 1v1: registrar sets/goles y finalizar en una sola llamada
                // para garantizar que el DTO retorne puntajeObtenido correcto
                if (!match.participantes) return;
                const puntajes: Record<number, string> = {};
                match.participantes.forEach(p => {
                    puntajes[p.id] = scores[p.id] || "0";
                });
                updated = await api.finalizarDuelo(match.id, puntajes);
            }
            setMatch(updated);
            // Recarga desde la API para garantizar puntajeObtenido correcto
            // (el response de finalizarDuelo puede llegar antes del flush JPA completo)
            await loadMatch();
            setShowScoreModal(false);
            showToast("Partido finalizado y puntajes guardados con éxito.");
        } catch (e: any) {
            setError(e.message || "Error al registrar resultados");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
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
    const isEnrolled = match.jugadoresInscritos?.some(p => p.id?.toString() === CURRENT_USER_ID.toString()) ?? false;
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
                            {match.jugadoresInscritos?.length || 0}
                            <span className="text-textMuted text-lg font-normal"> / {match.cantidadJugadoresReq}</span>
                        </div>
                        <div className="text-xs text-textMuted uppercase tracking-wider">Jugadores</div>
                    </div>
                    {canJoin && (
                        <Button size="lg"
                            onClick={() => doAction("join", () => api.joinMatch(match.id, CURRENT_USER_ID), "¡Te has unido al partido!")}
                            disabled={actionLoading !== null}>
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
                    <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <MatchInfo match={match} />
                    <PlayerList match={match} />

                    {/* Resultados finales */}
                    {match.estadoActualType === "FINALIZADO" && (match.participantes?.length ?? 0) > 0 && (
                        <Card className="border-brand/40 overflow-hidden">
                            <div className="bg-brand/10 px-6 py-4 border-b border-brand/20 flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-brand" />
                                <h3 className="text-lg font-bold text-white">Resultados Oficiales</h3>
                            </div>
                            <CardContent className="p-0">
                                <ul className="divide-y divide-border">
                                    {match.participantes!.map(p => (
                                        <li key={p.id} className="flex items-center justify-between p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300">
                                                    {p.tipo === "EQUIPO" ? <Users className="h-5 w-5" /> : p.nombre.charAt(0).toUpperCase()}
                                                </div>
                                                <p className="font-medium text-white">{p.nombre}</p>
                                            </div>
                                            <div className="bg-slate-800/80 rounded-lg px-4 py-2 min-w-[4rem] text-center border border-slate-700/50">
                                                <span className="text-2xl font-black text-brand">
                                                    {p.puntajeObtenido ?? "-"}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    {/* Formulario de edición */}
                    {editing && (
                        <Card className="border-primary/50">
                            <CardHeader><CardTitle>Editar Partido</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white">Ubicación</label>
                                    <Input value={editForm.ubicacion}
                                        onChange={e => setEditForm(f => ({ ...f, ubicacion: e.target.value }))} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white">Fecha y Hora</label>
                                        <Input type="datetime-local" value={editForm.horario}
                                            onChange={e => setEditForm(f => ({ ...f, horario: e.target.value }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white">Duración (min)</label>
                                        <Input type="number" value={editForm.duracionMinutos}
                                            onChange={e => setEditForm(f => ({ ...f, duracionMinutos: Number(e.target.value) }))} />
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

                {/* Sidebar */}
                <div className="space-y-6">
                    <MatchStateProgress estadoActualType={match.estadoActualType} isFull={isFull} />
                    <MatchActions
                        match={match}
                        isCreator={isCreator}
                        isEnrolled={isEnrolled}
                        canEdit={canEdit && !editing}
                        actionLoading={actionLoading}
                        onEdit={openEdit}
                        onConfirm={() => doAction("confirm", () => api.confirmMatch(match.id), "Partido Confirmado.")}
                        onStart={() => doAction("start", () => api.startMatch(match.id), "Partido Iniciado.")}
                        onOpenScoreModal={() => setShowScoreModal(true)}
                        onLeave={() => doAction("leave", () => api.leaveMatch(match.id, CURRENT_USER_ID), "Abandonaste el partido.")}
                        onCancel={() => {
                            if (window.confirm("¿Estás seguro de que querés cancelar este partido?")) {
                                doAction("cancel", () => api.cancelMatch(match.id), "Partido cancelado.");
                            }
                        }}
                    />
                </div>
            </div>

            {/* Toast */}
            {toastMessage && (
                <div className="fixed bottom-4 right-4 bg-success text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">{toastMessage}</span>
                </div>
            )}

            {/* Score Modal */}
            {showScoreModal && (
                <ScoreModal
                    match={match}
                    scores={scores}
                    onScoreChange={(id, value) => setScores(s => ({ ...s, [id]: value }))}
                    teamResult={teamResult}
                    onTeamResultChange={(field, value) => setTeamResult(r => ({ ...r, [field]: value }))}
                    onConfirm={submitScoresAndFinish}
                    onCancel={() => setShowScoreModal(false)}
                    loading={actionLoading === "finish"}
                />
            )}
        </div>
    );
}
