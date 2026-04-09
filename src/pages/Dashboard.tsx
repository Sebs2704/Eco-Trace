import { useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import {
  Recycle, Star, Flame, Leaf, Package,
  Milk, Newspaper, Wine, Cpu, ArrowLeft, Scale,
  MapPin, Clock, TrendingUp,
  Trophy, Award, Sprout, Zap, Target, QrCode,
} from "lucide-react";
import ecoLogo from "@/assets/eco-logo.png";

// ─── Materiales ───────────────────────────────────────────────────────────────
const MATERIALS = [
  { id: "plastico",    name: "Plástico",      icon: Milk,      color: "bg-eco-sky",   pts_per_kg: 20 },
  { id: "papel",       name: "Papel / Cartón", icon: Newspaper, color: "bg-eco-warm",  pts_per_kg: 10 },
  { id: "vidrio",      name: "Vidrio",         icon: Wine,      color: "bg-primary",   pts_per_kg: 15 },
  { id: "metal",       name: "Metal",          icon: Package,   color: "bg-eco-earth", pts_per_kg: 25 },
  { id: "electronico", name: "Electrónicos",   icon: Cpu,       color: "bg-accent",    pts_per_kg: 30 },
];

// ─── Helper barra de progreso ─────────────────────────────────────────────────
const pctClass = (p: number) => {
  if (p <= 0)  return "w-0";
  if (p <= 5)  return "w-[5%]";
  if (p <= 10) return "w-[10%]";
  if (p <= 15) return "w-[15%]";
  if (p <= 20) return "w-1/5";
  if (p <= 25) return "w-1/4";
  if (p <= 30) return "w-[30%]";
  if (p <= 33) return "w-1/3";
  if (p <= 40) return "w-2/5";
  if (p <= 45) return "w-[45%]";
  if (p <= 50) return "w-1/2";
  if (p <= 55) return "w-[55%]";
  if (p <= 60) return "w-3/5";
  if (p <= 66) return "w-2/3";
  if (p <= 70) return "w-[70%]";
  if (p <= 75) return "w-3/4";
  if (p <= 80) return "w-4/5";
  if (p <= 85) return "w-[85%]";
  if (p <= 90) return "w-[90%]";
  if (p <= 95) return "w-[95%]";
  return "w-full";
};

// ─── Misiones ─────────────────────────────────────────────────────────────────
interface Mission {
  id: string;
  title: string;
  desc: string;
  bonus: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  check: (logs: { material: string; quantity_kg: number }[], totalKg: number, streak: number, points: number) => boolean;
  currentVal: (logs: { material: string; quantity_kg: number }[], totalKg: number, streak: number, points: number) => number;
  total: number;
}

const MISSIONS: Mission[] = [
  { id: "first_log",     title: "Primer paso",          desc: "Registra tu primer reciclaje",            bonus: 50,  icon: Sprout,  check: (l) => l.length >= 1,                                       currentVal: (l) => Math.min(l.length, 1),                                  total: 1    },
  { id: "logs_5",        title: "Reciclador activo",    desc: "Registra 5 reciclajes",                   bonus: 100, icon: Recycle, check: (l) => l.length >= 5,                                       currentVal: (l) => Math.min(l.length, 5),                                  total: 5    },
  { id: "logs_20",       title: "Veterano del reciclaje", desc: "Registra 20 reciclajes",                bonus: 250, icon: Trophy,  check: (l) => l.length >= 20,                                      currentVal: (l) => Math.min(l.length, 20),                                 total: 20   },
  { id: "kg_5",          title: "5 kg reciclados",      desc: "Recicla 5 kg en total",                   bonus: 75,  icon: Scale,   check: (_l, k) => k >= 5,                                          currentVal: (_l, k) => Math.min(k, 5),                                     total: 5    },
  { id: "kg_10",         title: "10 kg reciclados",     desc: "Recicla 10 kg en total",                  bonus: 150, icon: Scale,   check: (_l, k) => k >= 10,                                         currentVal: (_l, k) => Math.min(k, 10),                                    total: 10   },
  { id: "kg_50",         title: "50 kg reciclados",     desc: "Recicla 50 kg en total",                  bonus: 500, icon: Award,   check: (_l, k) => k >= 50,                                         currentVal: (_l, k) => Math.min(k, 50),                                    total: 50   },
  { id: "streak_3",      title: "Racha de 3 días",      desc: "Mantén una racha de 3 días seguidos",     bonus: 100, icon: Flame,   check: (_l, _k, s) => s >= 3,                                      currentVal: (_l, _k, s) => Math.min(s, 3),                                 total: 3    },
  { id: "streak_7",      title: "Racha de fuego",       desc: "Mantén una racha de 7 días seguidos",     bonus: 200, icon: Flame,   check: (_l, _k, s) => s >= 7,                                      currentVal: (_l, _k, s) => Math.min(s, 7),                                 total: 7    },
  { id: "all_materials", title: "Reciclador completo",  desc: "Recicla todos los tipos de materiales",   bonus: 300, icon: Target,  check: (l) => new Set(l.map((x) => x.material)).size >= 5,         currentVal: (l) => Math.min(new Set(l.map((x) => x.material)).size, 5),   total: 5    },
  { id: "electronics",   title: "E-Waste Warrior",      desc: "Recicla material electrónico",            bonus: 100, icon: Cpu,     check: (l) => l.some((x) => x.material === "electronico"),         currentVal: (l) => (l.some((x) => x.material === "electronico") ? 1 : 0), total: 1    },
  { id: "pts_500",       title: "Eco-Campeón",          desc: "Acumula 500 puntos de reciclaje",         bonus: 150, icon: Star,    check: (_l, _k, _s, p) => p >= 500,                                currentVal: (_l, _k, _s, p) => Math.min(p, 500),                           total: 500  },
  { id: "pts_2000",      title: "Gran Reciclador",      desc: "Acumula 2 000 puntos de reciclaje",       bonus: 500, icon: Zap,     check: (_l, _k, _s, p) => p >= 2000,                               currentVal: (_l, _k, _s, p) => Math.min(p, 2000),                          total: 2000 },
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

// ─── Helpers de display ───────────────────────────────────────────────────────
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });

const materialLabel = (id: string) => MATERIALS.find((m) => m.id === id)?.name ?? id;
const materialColor = (id: string) => MATERIALS.find((m) => m.id === id)?.color ?? "bg-muted";

const MaterialIcon = ({ id, className }: { id: string; className?: string }) => {
  const mat = MATERIALS.find((m) => m.id === id);
  const Icon = mat?.icon ?? Recycle;
  return <Icon className={className} />;
};

// ─── Componente principal ─────────────────────────────────────────────────────
const Dashboard = () => {
  const { user, profile, refreshProfile } = useAuth();

  const [logs, setLogs]           = useState<RecyclingLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  const awardedKey      = user ? `eco_awarded_${user.id}` : null;
  const missionCheckDone = useRef(false);

  // ─── Cargar historial ────────────────────────────────────────────────────
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

  // ─── Lógica de misiones ──────────────────────────────────────────────────
  useEffect(() => {
    if (loadingLogs || !user || !profile || !awardedKey || missionCheckDone.current) return;
    missionCheckDone.current = true;

    const awarded: string[] = JSON.parse(localStorage.getItem(awardedKey) ?? "[]");
    const totalKg = Number(profile.total_kg ?? 0);
    const streak  = profile.streak ?? 0;
    const points  = profile.points ?? 0;

    const newlyCompleted = MISSIONS.filter(
      (m) => !awarded.includes(m.id) && m.check(logs, totalKg, streak, points)
    );
    if (newlyCompleted.length === 0) return;

    const totalBonus = newlyCompleted.reduce((s, m) => s + m.bonus, 0);
    supabase
      .from("profiles")
      .update({ points: points + totalBonus })
      .eq("user_id", user.id)
      .then(({ error }) => {
        if (error) return;
        localStorage.setItem(awardedKey, JSON.stringify([...awarded, ...newlyCompleted.map((m) => m.id)]));
        newlyCompleted.forEach((m) => toast.success(`🏅 Misión: "${m.title}" +${m.bonus} pts`));
        refreshProfile();
      });
  }, [loadingLogs, logs, user, profile, awardedKey, refreshProfile]);

  const totalLogs = logs.length;
  const totalKg   = profile?.total_kg ?? logs.reduce((s, l) => s + l.quantity_kg, 0);

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Topbar */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={ecoLogo} alt="EcoVilla" className="h-8 w-8" />
            <span className="font-display font-bold text-lg text-gradient-eco">EcoVilla</span>
          </Link>
          <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={16} /> Inicio
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl space-y-6">

        {/* ── Perfil ── */}
        <section className="bg-gradient-eco rounded-3xl p-5 sm:p-6 text-primary-foreground shadow-eco">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center text-3xl shrink-0">
              🌿
            </div>
            <div className="flex-1">
              <h1 className="font-display text-xl sm:text-2xl font-bold">
                ¡Hola, {profile?.full_name ?? "Reciclador"}!
              </h1>
              <p className="text-primary-foreground/80 text-sm mt-0.5">
                Cada kg que reciclas hace la diferencia en Villavicencio
              </p>
            </div>
            <div className="flex gap-4 sm:gap-6">
              <div className="text-center">
                <div className="font-display text-2xl font-bold">{(profile?.points ?? 0).toLocaleString()}</div>
                <div className="text-xs text-primary-foreground/70 flex items-center gap-1 justify-center">
                  <Star size={11} /> Puntos
                </div>
              </div>
              <div className="text-center">
                <div className="font-display text-2xl font-bold">{profile?.streak ?? 0}</div>
                <div className="text-xs text-primary-foreground/70 flex items-center gap-1 justify-center">
                  <Flame size={11} /> Racha
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { icon: Scale,     label: "Kg reciclados", value: `${Number(totalKg).toFixed(1)} kg` },
              { icon: Recycle,   label: "Registros",     value: totalLogs },
              { icon: TrendingUp, label: "Nivel",        value: (profile?.points ?? 0) >= 2000 ? "Experto" : (profile?.points ?? 0) >= 500 ? "Avanzado" : "Iniciante" },
            ].map((s) => (
              <div key={s.label} className="bg-primary-foreground/10 rounded-2xl p-3 text-center">
                <s.icon size={18} className="mx-auto mb-1 text-primary-foreground/80" />
                <div className="font-display font-bold text-base sm:text-lg">{s.value}</div>
                <div className="text-[10px] sm:text-xs text-primary-foreground/70">{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA escanear QR */}
          <Link
            to="/reciclar"
            className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors font-semibold text-sm"
          >
            <QrCode size={18} /> Registrar reciclaje (escanea QR en la caneca)
          </Link>
        </section>

        {/* ── Historial ── */}
        <section className="bg-card rounded-3xl border border-border/50 shadow-card-eco p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Clock size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold">Mi historial</h2>
              <p className="text-xs text-muted-foreground">Tus últimos 20 registros</p>
            </div>
          </div>

          {loadingLogs ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <Leaf size={24} className="animate-bounce text-primary" />
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center gap-3">
              <Recycle size={36} className="text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                Aún no tienes registros.<br />Escanea el QR de una caneca para empezar.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl ${materialColor(log.material)} flex items-center justify-center shrink-0`}>
                    <MaterialIcon id={log.material} className="text-primary-foreground w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{materialLabel(log.material)}</div>
                    <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-2">
                      <span className="flex items-center gap-0.5"><Scale size={10} /> {log.quantity_kg} kg</span>
                      <span className="flex items-center gap-0.5"><MapPin size={10} /> {log.location}</span>
                    </div>
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

        {/* ── Misiones ── */}
        <section className="bg-card rounded-3xl border border-border/50 shadow-card-eco p-5 sm:p-6">
          <h2 className="font-display text-lg font-bold mb-5 flex items-center gap-2">
            <Trophy size={18} className="text-primary" /> Misiones
            <span className="ml-auto text-xs font-normal text-muted-foreground">
              {(() => {
                const awarded: string[] = JSON.parse(localStorage.getItem(awardedKey ?? "") ?? "[]");
                const kg = Number(profile?.total_kg ?? 0);
                const s  = profile?.streak ?? 0;
                const p  = profile?.points ?? 0;
                const done = MISSIONS.filter((m) => awarded.includes(m.id) || m.check(logs, kg, s, p)).length;
                return `${done} / ${MISSIONS.length} completadas`;
              })()}
            </span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {MISSIONS.map((m) => {
              const awarded: string[] = JSON.parse(localStorage.getItem(awardedKey ?? "") ?? "[]");
              const kg   = Number(profile?.total_kg ?? 0);
              const s    = profile?.streak ?? 0;
              const p    = profile?.points ?? 0;
              const done = awarded.includes(m.id) || m.check(logs, kg, s, p);
              const cur  = m.currentVal(logs, kg, s, p);
              const pct  = Math.min((cur / m.total) * 100, 100);
              const Icon = m.icon;
              return (
                <div
                  key={m.id}
                  className={`rounded-2xl p-4 border transition-all ${done ? "bg-primary/5 border-primary/30" : "bg-muted/40 border-border/40"}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${done ? "bg-gradient-eco" : "bg-muted"}`}>
                      <Icon size={16} className={done ? "text-primary-foreground" : "text-muted-foreground"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{m.title}</div>
                      <div className="text-xs text-muted-foreground leading-tight">{m.desc}</div>
                    </div>
                    <div className={`text-xs font-bold shrink-0 ${done ? "text-primary" : "text-muted-foreground"}`}>+{m.bonus}</div>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-eco rounded-full transition-all duration-700 ${pctClass(Math.round(pct))}`} />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>{done ? "✅ Completada" : `${cur % 1 === 0 ? cur : cur.toFixed(1)} / ${m.total}`}</span>
                    <span>{Math.round(pct)}%</span>
                  </div>
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
