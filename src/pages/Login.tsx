import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Recycle, LogIn } from "lucide-react";
import ecoLogo from "@/assets/eco-logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextUrl = searchParams.get("next") ?? "/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("¡Bienvenido de vuelta!");
      navigate(nextUrl);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <img src={ecoLogo} alt="EcoVilla" className="h-12 w-12" />
            <span className="font-display font-bold text-2xl text-gradient-eco">EcoVilla</span>
          </Link>
          <h1 className="font-display text-2xl font-bold">Iniciar Sesión</h1>
          <p className="text-muted-foreground text-sm mt-1">Ingresa a tu cuenta y sigue reciclando</p>
        </div>

        <form onSubmit={handleLogin} className="bg-card rounded-2xl border border-border/50 p-6 space-y-4 shadow-card-eco">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button type="submit" className="w-full bg-gradient-eco" disabled={loading}>
            <LogIn size={18} />
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Crear cuenta
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
