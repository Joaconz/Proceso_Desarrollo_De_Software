import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CopySlash } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/Card";
import { api } from "../services/api";
import type { Deporte, SkillLevel } from "../types";

export default function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Metadata States
    const [skillsOptions, setSkillsOptions] = useState<SkillLevel[]>([]);
    const [sportOptions, setSportsOptions] = useState<Deporte[]>([]);

    // Dropdown fields
    const [favoriteSportId, setFavoriteSportId] = useState<number | "">("");
    const [skillLevel, setSkillLevel] = useState<SkillLevel | "">("");

    useEffect(() => {
        api.getDeportes().then(setSportsOptions).catch(console.error);
        api.getNiveles().then(setSkillsOptions).catch(console.error);
    }, []);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.register({
                nombreUsuario: username,
                correo: email,
                contrasenia: password,
                deporteFavorito: favoriteSportId ? { id: favoriteSportId } : undefined,
                nivel: skillLevel || "PRINCIPIANTE" // default 
            });
            navigate("/login");
        } catch (error) {
            console.error("Error creating user");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center p-4">
            <Link to="/" className="mb-4 flex items-center gap-2 text-primary">
                <CopySlash className="h-10 w-10 text-primary" />
                <span className="text-3xl font-bold text-white">MatchFinder</span>
            </Link>

            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Crea una cuenta</CardTitle>
                    <CardDescription>
                        Ingresa tus datos para registrarte en la plataforma
                    </CardDescription>
                </CardHeader>
                <form onSubmit={onSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="username" className="text-sm font-medium leading-none text-white">
                                Nombre de usuario
                            </label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="tuusuario123"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none text-white">
                                Correo Electrónico
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium leading-none text-white">
                                Contraseña
                            </label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none text-white">
                                    Deporte Favorito (Opcional)
                                </label>
                                <select
                                    className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-sm text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                    value={favoriteSportId}
                                    onChange={(e) => setFavoriteSportId(Number(e.target.value))}
                                >
                                    <option value="">Ninguno</option>
                                    {sportOptions.map(s => (
                                        <option key={s.id} value={s.id}>{s.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-medium leading-none text-white">
                                    Nivel
                                </label>
                                <div className="flex flex-col gap-3 mt-2">
                                    {skillsOptions.map(skill => (
                                        <label key={skill} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="nivel"
                                                value={skill}
                                                checked={skillLevel === skill || (skillLevel === "" && skill === "PRINCIPIANTE")}
                                                onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
                                                className="w-4 h-4 text-primary bg-surface border-border focus:ring-primary focus:ring-1"
                                            />
                                            <span className="text-sm text-textMuted">{skill}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? "Registrando..." : "Registrarse"}
                        </Button>
                        <div className="text-center text-sm text-textMuted">
                            ¿Ya tienes una cuenta?{" "}
                            <Link to="/login" className="text-primary hover:underline underline-offset-4">
                                Inicia sesión
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
