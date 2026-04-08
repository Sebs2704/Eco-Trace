import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Recycle, QrCode, Star, Flame, Leaf, Package,
  Milk, Newspaper, Wine, Cpu, ArrowLeft, Scale,
  MapPin, CheckCircle2, Clock, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ecoLogo from "@/assets/eco-logo.png";

// ─── Materiales reciclables y sus puntos por kg ───────────────────────────────
const MATERIALS = [
  { id: "plastico",  name: "Plástico",       icon: Milk,      color: "bg-eco-sky",   pts_per_kg: 20 },
  { id: "papel",     name: "Papel / Cartón",  icon: Newspaper, color: "bg-eco-warm",  pts_per_kg: 10 },
  { id: "vidrio",    name: "Vidrio",          icon: Wine,      color: "bg-primary",   pts_per_kg: 15 },
  { id: "metal",     name: "Metal",           icon: Package,   color: "bg-eco-earth", pts_per_kg: 25 },
  { id: "electronico", name: "Electrónicos",  icon: Cpu,       color: "bg-accent",    pts_per_kg: 30 },
];

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface RecyclingLog {
  id: string;
  material: string;
  quantity_kg: number;
  location: string;
  notes: string | null;
  qr_code: string | null;
  points_earned: number;
  created_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit", month: "short", year: "numeric",
  });

const materialLabel = (id: string) =>
  MATERIALS.find((m) => m.id === id)?.name ?? id;

const materialColor = (id: string) =>
  MATERIALS.find((m) => m.id === id)?.color ?? "bg-muted";

const MaterialIcon = ({ id, className }: { id: string; className?: string }) => {
  const mat = MATERIALS.find((m) => m.id === id);
  const Icon = mat?.icon ?? Recycle;
  return <Icon className={className} />;
};

// ─── Componente principal ────────────────────────────────────────────────────
const Dashboard = () => {
  const { user, profile, refreshProfile } = useAuth();

  // Form state
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIALS[0].id);
  const [quantityKg, setQuantityKg] = useState("");
  const [location, setLocation] = useState("Villavicencio");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Post-registro: mostrar QR generado
  const [lastQR, setLastQR] = useState<{ code: string; points: number } | null>(null);

  // Historial
  const [logs, setLogs] = useState<RecyclingLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  // ─── Cargar historial ──────────────────────────────────────────────────────
  const fetchLogs = useCallback(async () => {
    if (!user) return;
    setLoadingLogs(true);
    const { data, error } = await supabase
      .from("recycling_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);
    if (!error && data) setLogs(data as RecyclingLog[]);
    setLoadingLogs(false);
  }, [user]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  // ─── Calcular puntos preview ───────────────────────────────────────────────
  const mat = MATERIALS.find((m) => m.id === selectedMaterial)!;
  const kg = parseFloat(quantityKg) || 0;
  const previewPoints = Math.round(kg * mat.pts_per_kg);

  // ─── Registrar reciclaje ───────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (kg <= 0) { toast.error("Ingresa una cantidad válida en kg"); return; }
    if (!location.trim()) { toast.error("Ingresa la ubicación"); return; }

    setSubmitting(true);
    const qrCode = `VLL-${Date.now()}-${selectedMaterial.slice(0, 3).toUpperCase()}`;

    const { error } = await supabase.from("recycling_logs").insert({
      user_id: user.id,
      material: selectedMaterial,
      quantity_kg: kg,
      location: location.trim(),
      notes: notes.trim() || null,
      qr_code: qrCode,
      points_earned: previewPoints,
    });

    setSubmitting(false);

    if (error) {
      toast.error("Error al guardar el registro. Intenta de nuevo.");
      console.error(error);
      return;
    }

    toast.success(`¡Registro exitoso! Ganaste ${previewPoints} puntos`);
    setLastQR({ code: qrCode, points: previewPoints });
    setQuantityKg("");
    setNotes("");
    await Promise.all([fetchLogs(), refreshProfile()]);
  };

  // ─── Stats del perfil ──────────────────────────────────────────────────────
  const totalLogs = logs.length;
  const totalKg = profile?.total_kg ?? logs.reduce((s, l) => s + l.quantity_kg, 0);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* ── Topbar ── */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={ecoLogo} alt="EcoVilla" className="h-8 w-8" />
            <span className="font-display font-bold text-lg text-gradient-eco">EcoVilla</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} /> Volver al inicio
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">

        {/* ── Perfil del usuario ── */}
        <section className="bg-gradient-eco rounded-3xl p-6 text-primary-foreground mb-8 shadow-eco">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center text-3xl shrink-0">
              🌿
            </div>
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold">
                ¡Hola, {profile?.full_name ?? "Reciclador"}!
              </h1>
              <p className="text-primary-foreground/80 text-sm mt-0.5">
                Cada kg que reciclas hace la diferencia en Villavicencio
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="font-display text-2xl font-bold">{(profile?.points ?? 0).toLocaleString()}</div>
                <div className="text-xs text-primary-foreground/70 flex items-center gap-1 justify-center">
                  <Star size={12} /> Puntos
                </div>
              </div>
              <div className="text-center">
                <div className="font-display text-2xl font-bold">{profile?.streak ?? 0}</div>
                <div className="text-xs text-primary-foreground/70 flex items-center gap-1 justify-center">
                  <Flame size={12} /> Racha
                </div>
              </div>
            </div>
          </div>

          {/* Stats rápidas */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { icon: Scale, label: "Kg reciclados", value: `${Number(totalKg).toFixed(1)} kg` },
              { icon: Recycle, label: "Registros", value: totalLogs },
              { icon: TrendingUp, label: "Nivel", value: (profile?.points ?? 0) >= 2000 ? "Experto" : (profile?.points ?? 0) >= 500 ? "Avanzado" : "Iniciante" },
            ].map((s) => (
              <div key={s.label} className="bg-primary-foreground/10 rounded-2xl p-3 text-center">
                <s.icon size={20} className="mx-auto mb-1 text-primary-foreground/80" />
                <div className="font-display font-bold text-lg">{s.value}</div>
                <div className="text-xs text-primary-foreground/70">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-6">

          {/* ── Formulario de registro ── */}
          <section className="bg-card rounded-3xl border border-border/50 shadow-card-eco p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-eco flex items-center justify-center">
                <Recycle size={20} className="text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold">Registrar reciclaje</h2>
                <p className="text-xs text-muted-foreground">Selecciona material y cantidad</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Selector de material */}
              <div>
                <Label className="mb-2 block text-sm font-medium">Material</Label>
                <div className="grid grid-cols-5 gap-2">
                  {MATERIALS.map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMaterial(m.id)}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                          selectedMaterial === m.id
                            ? "border-primary bg-primary/5 scale-105 shadow-eco"
                            : "border-transparent bg-muted/60 hover:bg-muted"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg ${m.color} flex items-center justify-center`}>
                          <Icon size={16} className="text-primary-foreground" />
                        </div>
                        <span className="text-[10px] font-medium text-center leading-tight">{m.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cantidad */}
              <div className="space-y-1.5">
                <Label htmlFor="quantity">Cantidad (kg)</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="Ej: 1.5"
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(e.target.value)}
                />
                {kg > 0 && (
                  <p className="text-xs text-primary font-medium flex items-center gap-1">
                    <Star size={12} /> Ganarás {previewPoints} puntos
                  </p>
                )}
              </div>

              {/* Ubicación */}
              <div className="space-y-1.5">
                <Label htmlFor="location" className="flex items-center gap-1">
                  <MapPin size={13} /> Barrio / Punto de acopio
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Ej: Barrio La Esperanza"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Notas */}
              <div className="space-y-1.5">
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Input
                  id="notes"
                  type="text"
                  placeholder="Ej: Material limpio y seco"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-eco font-semibold"
                disabled={submitting}
              >
                <Recycle size={18} />
                {submitting ? "Registrando..." : "Registrar reciclaje"}
              </Button>
            </form>

            {/* QR generado tras registro exitoso */}
            {lastQR && (
              <div className="mt-5 p-4 bg-primary/5 rounded-2xl border border-primary/20 animate-slide-up">
                <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-3">
                  <CheckCircle2 size={18} /> ¡Registro guardado!
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl border-2 border-dashed border-primary/40 flex items-center justify-center bg-background">
                    <QrCode size={40} className="text-primary/60" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Código de trazabilidad</p>
                    <code className="text-xs font-mono text-foreground bg-muted px-2 py-1 rounded block break-all">
                      {lastQR.code}
                    </code>
                    <p className="text-xs text-primary font-medium mt-2 flex items-center gap-1">
                      <Star size={11} /> +{lastQR.points} puntos acreditados
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setLastQR(null)}
                  className="mt-3 w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cerrar
                </button>
              </div>
            )}
          </section>

          {/* ── Historial de reciclaje ── */}
          <section className="bg-card rounded-3xl border border-border/50 shadow-card-eco p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold">Mi historial</h2>
                <p className="text-xs text-muted-foreground">Tus últimos 20 registros</p>
              </div>
            </div>

            {loadingLogs ? (
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                <Leaf size={24} className="animate-bounce text-primary" />
              </div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center gap-3">
                <Recycle size={40} className="text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  Aún no tienes registros.<br />¡Registra tu primer reciclaje!
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-xl ${materialColor(log.material)} flex items-center justify-center shrink-0`}>
                      <MaterialIcon id={log.material} className="text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{materialLabel(log.material)}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="flex items-center gap-0.5">
                          <Scale size={10} /> {log.quantity_kg} kg
                        </span>
                        <span className="flex items-center gap-0.5">
                          <MapPin size={10} /> {log.location}
                        </span>
                      </div>
                      {log.notes && (
                        <div className="text-xs text-muted-foreground/70 truncate">{log.notes}</div>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-primary">+{log.points_earned}</div>
                      <div className="text-[10px] text-muted-foreground">{formatDate(log.created_at)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* ── Guía de puntos ── */}
        <section className="mt-6 bg-card rounded-3xl border border-border/50 shadow-card-eco p-6">
          <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
            <Star size={18} className="text-primary" /> Tabla de puntos por material
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {MATERIALS.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.id} className="text-center p-3 rounded-xl bg-muted/50">
                  <div className={`w-10 h-10 rounded-xl ${m.color} flex items-center justify-center mx-auto mb-2`}>
                    <Icon size={18} className="text-primary-foreground" />
                  </div>
                  <div className="text-sm font-medium leading-tight">{m.name}</div>
                  <div className="text-xs text-primary font-bold mt-1">{m.pts_per_kg} pts/kg</div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
