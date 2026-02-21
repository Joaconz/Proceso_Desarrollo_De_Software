import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Activity, LogOut } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

export default function Profile() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Mock user data
    const user = {
        username: "joaquin",
        email: "joaquin@ejemplo.com",
        favoriteSport: "Futbol",
        skillLevel: "Intermedio",
        matchesPlayed: 14,
        memberSince: "Febrero 2026"
    };

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigate("/");
        }, 800);
    };

    const handleLogout = () => {
        navigate("/login");
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-border border-4 border-surface shadow-xl flex items-center justify-center text-4xl font-bold text-primary">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">{user.username}</h1>
                        <p className="text-textMuted">{user.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">Miembro desde {user.memberSince}</Badge>
                        </div>
                    </div>
                </div>
                <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Completar Perfil</CardTitle>
                        <CardDescription>
                            Estos datos ayudarán a emparejarte mejor en los partidos
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSaveProfile}>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-primary" />
                                        Deporte Favorito
                                    </label>
                                    <select
                                        defaultValue={user.favoriteSport}
                                        className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-sm text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                    >
                                        <option value="">No especificado</option>
                                        <option value="Futbol">Fútbol</option>
                                        <option value="Basquet">Básquet</option>
                                        <option value="Voley">Vóley</option>
                                        <option value="Tenis">Tenis</option>
                                        <option value="Padel">Pádel</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white flex items-center gap-2">
                                        <Trophy className="h-4 w-4 text-primary" />
                                        Nivel de Juego
                                    </label>
                                    <select
                                        defaultValue={user.skillLevel}
                                        className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-sm text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                    >
                                        <option value="">No especificado</option>
                                        <option value="Principiante">Principiante</option>
                                        <option value="Intermedio">Intermedio</option>
                                        <option value="Avanzado">Avanzado</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border flex justify-end">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Guardando..." : "Guardar Perfil y Continuar"}
                                </Button>
                            </div>
                        </CardContent>
                    </form>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Estadísticas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 rounded-xl bg-surface border border-border flex flex-col items-center justify-center text-center">
                            <div className="text-4xl font-bold text-white mb-1">{user.matchesPlayed}</div>
                            <div className="text-sm text-textMuted uppercase tracking-wider">Partidos Jugados</div>
                        </div>
                        <div className="p-4 rounded-xl bg-surface border border-border flex flex-col items-center justify-center text-center">
                            <div className="text-4xl font-bold text-primary mb-1">{user.skillLevel || "-"}</div>
                            <div className="text-sm text-textMuted uppercase tracking-wider">Nivel Actual</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
