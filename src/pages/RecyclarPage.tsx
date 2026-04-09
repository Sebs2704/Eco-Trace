import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Recycle, MapPin, Star, CheckCircle2, LogIn, QrCode, ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ecoLogo from "@/assets/eco-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { MATERIALS } from "@/constants/materials";
import { getLocationName } from "@/constants/locations";
import { calculatePoints } from "@/lib/calculatePoints";
import { generateQrCode } from "@/lib/generateQrCode";
import { recyclingService } from "@/services/recyclingService";

const RecyclarPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();

  const locKey       = searchParams.get("loc") ?? "";
  const canecaId     = searchParams.get("id")  ?? "";
  const locationName = getLocationName(locKey);

  const [selectedMaterial, setSelectedMaterial] = useState(MATERIALS[0].id);
  const [quantityKg, setQuantityKg]             = useState("");
  const [notes, setNotes]                       = useState("");
  const [submitting, setSubmitting]             = useState(false);
  const [success, setSuccess]                   = useState<{ code: string; points: number } | null>(null);

  const kg            = parseFloat(quantityKg) || 0;
  const previewPoints = calculatePoints(selectedMaterial, kg);

  // ── Pantalla: no autenticado ─────────────────────────────────────────────
  if (!user) {
    const returnUrl = encodeURIComponent(`/reciclar?${searchParams.toString()}`);
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
        <img src={ecoLogo} alt="EcoVilla" className="h-16 w-16 mb-3" />
        <h1 className="font-display text-2xl font-bold mb-6 text-gradient-eco">EcoVilla</h1>
        <div className="w-full max-w-sm bg-card rounded-3xl border border-border/50 p-6 shadow-card-eco text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <QrCode size={26} className="text-primary" />
          </div>
          <h2 className="font-display text-xl font-bold mb-1">Registrar reciclaje</h2>
          <p className="text-muted-foreground text-sm mb-3">Caneca en:</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            <MapPin size={13} /> {locationName}
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            Inicia sesión para registrar tu reciclaje y ganar puntos
          </p>
          <Link to={`/login?next=${returnUrl}`}>
            <Button className="w-full bg-gradient-eco text-base py-5">
              <LogIn size={18} /> Iniciar sesión
            </Button>
          </Link>
          <Link to={`/signup?next=${returnUrl}`} className="block mt-3 text-sm text-primary hover:underline">
            ¿No tienes cuenta? Crear cuenta
          </Link>
        </div>
      </div>
    );
  }

  // ── Pantalla: éxito ──────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-eco flex items-center justify-center mb-5 shadow-eco">
          <CheckCircle2 size={40} className="text-primary-foreground" />
        </div>
        <h2 className="font-display text-2xl font-bold mb-1">¡Reciclaje registrado!</h2>
        <p className="text-muted-foreground text-sm mb-6">Tu contribución al medio ambiente quedó guardada.</p>

        <div className="w-full max-w-sm bg-card rounded-3xl border border-border/50 p-6 shadow-card-eco mb-6">
          <div className="flex items-center justify-center w-24 h-24 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 mx-auto mb-4">
            <QrCode size={48} className="text-primary/60" />
          </div>
          <p className="text-xs text-muted-foreground mb-1">Código de trazabilidad</p>
          <code className="text-xs font-mono text-foreground bg-muted px-2 py-1.5 rounded-lg block break-all mb-3">
            {success.code}
          </code>
          <div className="flex items-center justify-center gap-1 text-lg font-bold text-primary">
            <Star size={18} /> +{success.points} puntos acreditados
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => { setSuccess(null); setQuantityKg(""); setNotes(""); }}
          >
            Otro registro
          </Button>
          <Button type="button" className="flex-1 bg-gradient-eco" onClick={() => navigate("/dashboard")}>
            Ver mi perfil
          </Button>
        </div>
      </div>
    );
  }

  // ── Formulario ───────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (kg <= 0) { toast.error("Ingresa una cantidad válida en kg"); return; }
    setSubmitting(true);

    const qrCode = generateQrCode(selectedMaterial, canecaId || undefined);

    try {
      await recyclingService.insertLog({
        user_id:       user.id,
        material:      selectedMaterial,
        quantity_kg:   kg,
        location:      locationName,
        notes:         notes.trim() || null,
        qr_code:       qrCode,
        points_earned: previewPoints,
      });
      setSuccess({ code: qrCode, points: previewPoints });
      await refreshProfile();
    } catch {
      toast.error("Error al guardar. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-card/90 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <Link to="/dashboard" className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <img src={ecoLogo} alt="EcoVilla" className="h-7 w-7" />
          <span className="font-display font-bold text-gradient-eco">EcoVilla</span>
        </div>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto">
        <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-2xl px-4 py-3 mb-6">
          <MapPin size={18} className="text-primary shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Punto de acopio</p>
            <p className="font-semibold text-sm text-primary">{locationName}</p>
          </div>
          {canecaId && (
            <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              #{canecaId}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-base font-semibold mb-3 block">¿Qué vas a reciclar?</Label>
            <div className="grid grid-cols-5 gap-2">
              {MATERIALS.map((m) => {
                const Icon   = m.icon;
                const active = selectedMaterial === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMaterial(m.id)}
                    className={`flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-2xl border-2 transition-all active:scale-95 ${
                      active ? "border-primary bg-primary/5 scale-105 shadow-eco" : "border-transparent bg-muted/60"
                    }`}
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${m.color} flex items-center justify-center`}>
                      <Icon size={20} className="text-primary-foreground" />
                    </div>
                    <span className="text-[9px] sm:text-[11px] font-medium text-center leading-tight">{m.name}</span>
                    <span className="text-[9px] text-primary font-bold">{m.pts_per_kg} pts/kg</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-base font-semibold">Cantidad (kg)</Label>
            <Input
              id="quantity"
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0.1"
              placeholder="Ej: 1.5"
              value={quantityKg}
              onChange={(e) => setQuantityKg(e.target.value)}
              className="text-lg h-12 rounded-xl"
            />
            {kg > 0 && (
              <p className="text-sm text-primary font-semibold flex items-center gap-1 animate-slide-up">
                <Star size={14} /> Ganarás {previewPoints} puntos
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-base font-semibold">
              Notas <span className="font-normal text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="notes"
              type="text"
              placeholder="Ej: Material limpio y seco"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-base bg-gradient-eco font-bold rounded-2xl shadow-eco"
            disabled={submitting}
          >
            <Recycle size={20} />
            {submitting ? "Registrando..." : "Registrar reciclaje"}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default RecyclarPage;
