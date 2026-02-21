import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/Card";


export default function CreateMatch() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            navigate("/");
        }, 1000);
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
                                    required
                                >
                                    <option value="">Selecciona un deporte</option>
                                    <option value="Futbol">Fútbol</option>
                                    <option value="Basquet">Básquet</option>
                                    <option value="Voley">Vóley</option>
                                    <option value="Tenis">Tenis</option>
                                    <option value="Padel">Pádel</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Jugadores Requeridos</label>
                                <Input type="number" min="2" max="22" placeholder="Ej: 10" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white">Ubicación</label>
                            <Input type="text" placeholder="Ej: Cancha El Trébol, Palermo" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Fecha y Hora</label>
                                <Input type="datetime-local" required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Duración (minutos)</label>
                                <Input type="number" min="30" step="15" placeholder="60" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Nivel Mínimo (Opcional)</label>
                                <select className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-sm text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                                    <option value="">Cualquiera</option>
                                    <option value="Principiante">Principiante</option>
                                    <option value="Intermedio">Intermedio</option>
                                    <option value="Avanzado">Avanzado</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Nivel Máximo (Opcional)</label>
                                <select className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-sm text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                                    <option value="">Cualquiera</option>
                                    <option value="Principiante">Principiante</option>
                                    <option value="Intermedio">Intermedio</option>
                                    <option value="Avanzado">Avanzado</option>
                                </select>
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
