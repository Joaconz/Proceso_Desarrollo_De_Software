import { CheckCircle2, Edit3, Flag, LogOut, Play, XCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import type { Match } from "../../types";

interface Props {
    match: Match;
    isCreator: boolean;
    isEnrolled: boolean;
    canEdit: boolean;
    actionLoading: string | null;
    onEdit: () => void;
    onConfirm: () => void;
    onStart: () => void;
    onOpenScoreModal: () => void;
    onLeave: () => void;
    onCancel: () => void;
}

/**
 * SRP: responsabilidad única — botones de acción según estado y rol del usuario.
 */
export function MatchActions({
    match, isCreator, isEnrolled, canEdit,
    actionLoading, onEdit, onConfirm, onStart,
    onOpenScoreModal, onLeave, onCancel
}: Props) {
    const isTerminal = match.estadoActualType === "CANCELADO" || match.estadoActualType === "FINALIZADO";
    if (isTerminal) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {canEdit && (
                    <Button variant="outline" className="w-full justify-start gap-2"
                        onClick={onEdit} disabled={actionLoading !== null}>
                        <Edit3 className="h-4 w-4" /> Editar Partido
                    </Button>
                )}

                {isCreator && match.estadoActualType === "PARTIDO_ARMADO" && (
                    <Button className="w-full justify-start gap-2 bg-success hover:bg-success/90"
                        onClick={onConfirm} disabled={actionLoading !== null}>
                        <CheckCircle2 className="h-4 w-4" />
                        {actionLoading === "confirm" ? "Confirmando..." : "Confirmar Encuentro"}
                    </Button>
                )}

                {isCreator && match.estadoActualType === "CONFIRMADO" && (
                    <Button className="w-full justify-start gap-2 bg-green-600 hover:bg-green-700"
                        onClick={onStart}
                        disabled={actionLoading !== null || (match.jugadoresInscritos?.length || 0) < match.cantidadJugadoresReq}>
                        <Play className="h-4 w-4" />
                        {actionLoading === "start" ? "Iniciando..." : "Iniciar Partido"}
                    </Button>
                )}

                {isCreator && match.estadoActualType === "EN_JUEGO" && (
                    <Button className="w-full justify-start gap-2"
                        onClick={onOpenScoreModal} disabled={actionLoading !== null}>
                        <Flag className="h-4 w-4" />
                        {actionLoading === "finish" ? "Finalizando..." : "Finalizar Partido"}
                    </Button>
                )}

                {!isCreator && isEnrolled && ["NECESITAMOS_JUGADORES", "PARTIDO_ARMADO"].includes(match.estadoActualType) && (
                    <Button variant="outline" className="w-full justify-start gap-2 text-warning border-warning/30 hover:bg-warning/10"
                        onClick={onLeave} disabled={actionLoading !== null}>
                        <LogOut className="h-4 w-4" />
                        {actionLoading === "leave" ? "Saliendo..." : "Abandonar Partido"}
                    </Button>
                )}

                {isCreator && ["NECESITAMOS_JUGADORES", "PARTIDO_ARMADO", "CONFIRMADO"].includes(match.estadoActualType) && (
                    <Button variant="outline" className="w-full justify-start gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={onCancel} disabled={actionLoading !== null}>
                        <XCircle className="h-4 w-4" />
                        {actionLoading === "cancel" ? "Cancelando..." : "Cancelar Partido"}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
