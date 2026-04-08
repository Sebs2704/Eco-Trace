import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import ecoLogo from "@/assets/eco-logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Ingresa tu correo electrónico");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
      toast.success("¡Correo enviado! Revisa tu bandeja de entrada.");
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
          <h1 className="font-display text-2xl font-bold">Recuperar Contraseña</h1>
          <p className="text-muted-foreground text-sm mt-1">Te enviaremos un enlace para restablecer tu contraseña</p>
        </div>

        {sent ? (
          <div className="bg-card rounded-2xl border border-border/50 p-6 text-center shadow-card-eco">
            <Mail size={48} className="mx-auto text-primary mb-4" />
            <h2 className="font-semibold text-lg mb-2">¡Correo enviado!</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Revisa tu bandeja de entrada y sigue el enlace para restablecer tu contraseña.
            </p>
            <Link to="/login" className="text-primary font-medium hover:underline text-sm">
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="bg-card rounded-2xl border border-border/50 p-6 space-y-4 shadow-card-eco">
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

            <Button type="submit" className="w-full bg-gradient-eco" disabled={loading}>
              <Mail size={18} />
              {loading ? "Enviando..." : "Enviar enlace"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              <Link to="/login" className="text-primary font-medium hover:underline">
                Volver al inicio de sesión
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
