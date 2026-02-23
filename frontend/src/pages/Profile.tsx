import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Activity, LogOut } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import type { Deporte } from "../types";

export default function Profile() {
    const navigate = useNavigate();
    const { user, logout, login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [deportes, setDeportes] = useState<Deporte[]>([]);
    const [niveles, setNiveles] = useState<string[]>([]);
    const [selectedDeporteId, setSelectedDeporteId] = useState<number | "">("");
    const [selectedNivel, setSelectedNivel] = useState<string>("");
    const [message, setMessage] = useState<{ type: "error" | "success", text: string } | null>(null);

    useEffect(() => {
        // Cargar metadata para los selectores
        Promise.all([api.getDeportes(), api.getNiveles()]).then(([deps, nivs]) => {
            setDeportes(deps);
            // El backend devuelve objetos tipo { name: "PRINCIPIANTE" } o strings directo 
            // dependiendo de cómo esté configurado, asumo array de strings según UsuarioService.obtenerNiveles()
            setNiveles(nivs as unknown as string[]);
        }).catch(err => console.error("Error cargando metadatos de perfil", err));
    }, []);

    useEffect(() => {
        if (user) {
            setSelectedDeporteId(user.deporteFavorito?.id || "");
            setSelectedNivel(user.nivel || "");
        }
    }, [user]);

    if (!user) return null;

    const displayUser = {
        username: user.nombreUsuario || "Usuario",
        email: user.correo || "",
        matchesPlayed: 0, // Mock
        memberSince: new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        try {
            const data: any = {};
            if (selectedDeporteId !== "") data.deporteId = Number(selectedDeporteId);
            if (selectedNivel !== "") data.nivel = selectedNivel;

            const updatedUser = await api.actualizarPerfil(user.id!, data);
            login(updatedUser); // Actualizar context y localStorage

            setMessage({ type: "success", text: "Perfil actualizado correctamente." });
            setTimeout(() => setMessage(null), 3000);
        } catch (err: any) {
            setMessage({ type: "error", text: err.message || "Error al actualizar perfil." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-border border-4 border-surface shadow-xl flex items-center justify-center text-4xl font-bold text-primary">
                        {displayUser.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">{displayUser.username}</h1>
                        <p className="text-textMuted">{displayUser.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">Miembro desde {displayUser.memberSince}</Badge>
                        </div>
                    </div>
                </div>
                <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                </Button>
            </div>

            {message && (
                <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-success/10 text-success border border-success/30' : 'bg-destructive/10 text-destructive border border-destructive/30'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Completar Perfil</CardTitle>
                        <CardDescription>
                            Estos datos te ayudarán a encontrar partidos adecuados a tu nivel (RF 5).
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
                                        value={selectedDeporteId}
                                        onChange={(e) => setSelectedDeporteId(e.target.value === "" ? "" : Number(e.target.value))}
                                        className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-sm text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                    >
                                        <option value="">No especificado</option>
                                        {deportes.map(d => (
                                            <option key={d.id} value={d.id}>{d.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white flex items-center gap-2">
                                        <Trophy className="h-4 w-4 text-primary" />
                                        Nivel de Juego
                                    </label>
                                    <select
                                        value={selectedNivel}
                                        onChange={(e) => setSelectedNivel(e.target.value)}
                                        className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-sm text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                    >
                                        <option value="">No especificado</option>
                                        {niveles.map(n => (
                                            <option key={n} value={n}>{n}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border flex justify-end">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Guardando..." : "Guardar Perfil"}
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
                            <div className="text-4xl font-bold text-white mb-1">{displayUser.matchesPlayed}</div>
                            <div className="text-sm text-textMuted uppercase tracking-wider">Partidos Jugados</div>
                        </div>
                        <div className="p-4 rounded-xl bg-surface border border-border flex flex-col items-center justify-center text-center">
                            <div className="text-2xl font-bold text-primary mb-1 mt-2">
                                {user.nivel || "N/A"}
                            </div>
                            <div className="text-sm text-textMuted uppercase tracking-wider">Nivel Actual</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
