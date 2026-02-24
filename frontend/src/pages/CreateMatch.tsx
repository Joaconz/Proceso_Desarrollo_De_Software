import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/Card";
import { api } from "../services/api";
import type { Deporte, SkillLevel } from "../types";
import { useAuth } from "../context/AuthContext";

export default function CreateMatch() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // Metadata State
    const [sportsOptions, setSportsOptions] = useState<Deporte[]>([]);
    const [skillsOptions, setSkillsOptions] = useState<SkillLevel[]>([]);
    const [barrioOptions, setBarrioOptions] = useState<string[]>([]);

    // Form State
    const [sportId, setSportId] = useState<number | "">("");
    const [requiredPlayers, setRequiredPlayers] = useState(10);
    const [location, setLocation] = useState("");
    const [barrio, setBarrio] = useState("CUALQUIERA");
    const [date, setDate] = useState("");
    const [duration, setDuration] = useState(60);
    const [minSkill, setMinSkill] = useState<SkillLevel | "">("");

    useEffect(() => {
        api.getDeportes().then(setSportsOptions).catch(console.error);
        api.getNiveles().then(setSkillsOptions).catch(console.error);
        api.getBarrios().then(setBarrioOptions).catch(console.error);
    }, []);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sportId) return;

        setIsLoading(true);

        try {
            await api.createMatch({
                deporteId: sportId,
                cantidadJugadoresReq: requiredPlayers,
                duracionMinutos: duration,
                ubicacion: location,
                horario: date, // datetime-local ya está en formato ISO local
                nivelRequerido: minSkill || null,
                barrio: barrio,
                creadorId: user?.id || 1
            });
            navigate("/");
        } catch (error) {
            console.error("Error creating match", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Crear Partido</h1>
                <p className="text-textMuted">Organiza un nuevo encuentro deportivo y encuentra jugadores.</p>
            </div>

            <Card>
                <form onSubmit={onSubmit}>
                    <CardHeader>
                        <CardTitle>Detalles del Encuentro</CardTitle>
                        <CardDescription>Completa los datos para publicar tu partido</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Deporte</label>
                                <select
                                    className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-sm text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                    value={sportId}
                                    onChange={(e) => setSportId(Number(e.target.value))}
                                    required
                                >
                                    <option value="" disabled>Selecciona un deporte</option>
                                    {sportsOptions.map(s => (
                                        <option key={s.id} value={s.id}>{s.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Jugadores Requeridos</label>
                                <Input
                                    type="number"
                                    min="2" max={sportsOptions.find(s => s.id === sportId)?.cantidadJugadoresPermitidos || 22}
                                    placeholder={`Ej: ${sportsOptions.find(s => s.id === sportId)?.cantidadJugadoresPermitidos || 10}`}
                                    value={requiredPlayers}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        const max = sportsOptions.find(s => s.id === sportId)?.cantidadJugadoresPermitidos || 22;
                                        if (val <= max) {
                                            setRequiredPlayers(val);
                                        }
                                    }}
                                    required
                                />
                                {sportId && (
                                    <p className="text-xs text-textMuted mt-1">
                                        Máximo permitido por deporte: {sportsOptions.find(s => s.id === sportId)?.cantidadJugadoresPermitidos}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Ubicación</label>
                                <Input
                                    type="text"
                                    placeholder="Ej: Cancha El Trébol"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Barrio</label>
                                <select
                                    className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-sm text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                    value={barrio}
                                    onChange={(e) => setBarrio(e.target.value)}
                                >
                                    {barrioOptions.map(b => (
                                        <option key={b} value={b}>{b === "CUALQUIERA" ? "Cualquiera" : b}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Fecha y Hora</label>
                                <Input
                                    type="datetime-local"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Duración (minutos)</label>
                                <Input
                                    type="number" min="30" step="15" placeholder="60"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-white">Nivel Mínimo (Opcional)</label>
                                <div className="flex flex-wrap gap-4 mt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="nivel"
                                            value=""
                                            checked={minSkill === ""}
                                            onChange={(e) => setMinSkill(e.target.value as "" | SkillLevel)}
                                            className="w-4 h-4 text-primary bg-surface border-border focus:ring-primary focus:ring-1"
                                        />
                                        <span className="text-sm text-textMuted">Cualquiera</span>
                                    </label>
                                    {skillsOptions
                                        .filter(skill => {
                                            if (!user?.nivel) return true;
                                            const order: Record<string, number> = { PRINCIPIANTE: 0, INTERMEDIO: 1, AVANZADO: 2 };
                                            return (order[skill] ?? 0) <= (order[user.nivel] ?? 0);
                                        })
                                        .map(skill => (
                                        <label key={skill} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="nivel"
                                                value={skill}
                                                checked={minSkill === skill}
                                                onChange={(e) => setMinSkill(e.target.value as SkillLevel)}
                                                className="w-4 h-4 text-primary bg-surface border-border focus:ring-primary focus:ring-1"
                                            />
                                            <span className="text-sm text-textMuted">{skill}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4 border-t border-border pt-6">
                        <Button variant="ghost" type="button" onClick={() => navigate("/")}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Creando..." : "Crear Partido"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
