import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CopySlash } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/Card";

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

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
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <Link to="/" className="mb-8 flex items-center gap-2 text-primary">
                <CopySlash className="h-10 w-10 text-primary" />
                <span className="text-3xl font-bold text-white">MatchFinder</span>
            </Link>

            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Inicia sesión</CardTitle>
                    <CardDescription>
                        Ingresa tu correo para acceder a tu cuenta
                    </CardDescription>
                </CardHeader>
                <form onSubmit={onSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none">
                                Correo Electrónico
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@ejemplo.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-medium leading-none">
                                    Contraseña
                                </label>
                                <Link to="#" className="text-sm text-primary hover:underline">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <Input id="password" type="password" required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? "Iniciando..." : "Ingresar"}
                        </Button>
                        <div className="text-center text-sm text-textMuted">
                            ¿No tienes una cuenta?{" "}
                            <Link to="#" className="text-primary hover:underline underline-offset-4">
                                Regístrate
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
