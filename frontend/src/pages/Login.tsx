import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CopySlash } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/Card";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const user = await api.login({ correo: email, contrasenia: password });
            authLogin(user);

            // ── Registrar FCM token post-login ───────────────────────────────
            // Opción A: solicitamos permiso de notificaciones al browser y
            // generamos un token único por dispositivo/sesión.
            // En producción real, aquí iría el Firebase JS SDK getToken().
            // El backend lo persiste en usuario.fcmToken para que
            // FirebaseAdapter pueda enviar push personalizadas.
            if (user.id != null) {
                registrarFcmToken(Number(user.id)).catch(() => {
                    // Permiso denegado o error → modo DEMO en el backend (no bloquea)
                });
            }

            navigate("/");
        } catch (err: any) {
            console.error("Error validando usuario", err);
            setError(err.message || "Credenciales incorrectas o error de conexión.");
            setTimeout(() => setError(null), 4000);
        } finally {
            setIsLoading(false);
        }
    };

    /** Solicita permiso de notificaciones y registra el FCM token en el backend. */
    const registrarFcmToken = async (userId: number) => {
        // Verificar soporte del navegador
        if (!("Notification" in window)) return;

        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        // Generar un token estable por dispositivo+usuario usando crypto
        // (en producción real: await getToken(messaging, { vapidKey: VITE_VAPID_KEY }))
        const rawToken = `${userId}-${navigator.userAgent}-${window.location.hostname}`;
        const encoder = new TextEncoder();
        const data = encoder.encode(rawToken);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const fcmToken = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

        await api.registerFcmToken(userId, fcmToken);
        console.log("[FCM] Token registrado en el servidor:", fcmToken.substring(0, 16) + "...");
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? "Iniciando..." : "Ingresar"}
                        </Button>
                        <div className="text-center text-sm text-textMuted">
                            ¿No tienes una cuenta?{" "}
                            <Link to="/register" className="text-primary hover:underline underline-offset-4">
                                Regístrate
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>

            {/* Error Toaster */}
            {error && (
                <div className="fixed bottom-4 right-4 bg-red-600 outline outline-1 outline-red-400 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-5">
                    <span className="font-medium">{error}</span>
                </div>
            )}
        </div>
    );
}
