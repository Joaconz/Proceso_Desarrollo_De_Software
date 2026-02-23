import { Calendar, Clock, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import type { Match } from "../../types";

interface Props {
    match: Match;
}

/**
 * SRP: responsabilidad única — mostrar los detalles informativos del partido.
 */
export function MatchInfo({ match }: Props) {
    return (
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
    );
}
