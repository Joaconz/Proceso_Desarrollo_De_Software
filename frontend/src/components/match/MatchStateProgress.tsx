import { CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import type { MatchState } from "../../types";

interface Props {
    estadoActualType: MatchState;
    isFull: boolean;
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

/**
 * SRP: responsabilidad única — visualizar el progreso del ciclo de estados.
 */
export function MatchStateProgress({ estadoActualType, isFull }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Estado del Partido</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <StatusStep
                        label="Necesitamos Jugadores"
                        isActive={estadoActualType === "NECESITAMOS_JUGADORES"}
                        isCompleted={isFull || ["PARTIDO_ARMADO", "CONFIRMADO", "EN_JUEGO", "FINALIZADO"].includes(estadoActualType)}
                    />
                    <StatusStep
                        label="Partido Armado"
                        isActive={estadoActualType === "PARTIDO_ARMADO"}
                        isCompleted={["CONFIRMADO", "EN_JUEGO", "FINALIZADO"].includes(estadoActualType)}
                    />
                    <StatusStep
                        label="Confirmado"
                        isActive={estadoActualType === "CONFIRMADO"}
                        isCompleted={["EN_JUEGO", "FINALIZADO"].includes(estadoActualType)}
                    />
                    <StatusStep
                        label="En Juego"
                        isActive={estadoActualType === "EN_JUEGO"}
                        isCompleted={estadoActualType === "FINALIZADO"}
                    />
                    <StatusStep label="Finalizado" isActive={false} isCompleted={estadoActualType === "FINALIZADO"} />
                    {estadoActualType === "CANCELADO" && (
                        <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/30">
                            <XCircle className="h-5 w-5 text-destructive" />
                            <span className="text-sm font-medium text-destructive">Partido Cancelado</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
