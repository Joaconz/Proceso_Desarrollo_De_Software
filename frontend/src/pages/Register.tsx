import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CopySlash } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/Card";
import { api } from "../services/api";

export default function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.register({
                nombreUsuario: username,
                correo: email,
                contrasenia: password,
                nivel: "PRINCIPIANTE" // default values
            });
            navigate("/login");
        } catch (error) {
            console.error("Error creating user");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <Link to="/" className="mb-8 flex items-center gap-2 text-primary">
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
