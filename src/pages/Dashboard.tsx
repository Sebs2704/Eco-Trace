import { Link } from "react-router-dom";
import {
  Recycle, Star, Flame, Leaf,
  Scale, MapPin, Clock, TrendingUp,
  Trophy, ArrowLeft, QrCode,
} from "lucide-react";
import ecoLogo from "@/assets/eco-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { MATERIALS, getMaterialLabel, getMaterialColor } from "@/constants/materials";
import { MISSIONS } from "@/constants/missions";
import { progressWidth } from "@/lib/progressWidth";
import { formatDate } from "@/lib/formatDate";
import { useRecyclingLogs } from "@/hooks/useRecyclingLogs";
import { useMissions } from "@/hooks/useMissions";

const MaterialIcon = ({ id, className }: { id: string; className?: string }) => {
  const mat = MATERIALS.find((m) => m.id === id);
  const Icon = mat?.icon ?? Recycle;
  return <Icon className={className} />;
};

const Dashboard = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { data: logs = [], isLoading: loadingLogs } = useRecyclingLogs(user?.id);

  const { getAwardedIds } = useMissions({
    userId: user?.id,
    profile,
    logs,
    loadingLogs,
    onAwarded: refreshProfile,
  });

  const totalKg = profile?.total_kg ?? logs.reduce((s, l) => s + l.quantity_kg, 0);
  const points  = profile?.points ?? 0;
  const level   = points >= 2000 ? "Experto" : points >= 500 ? "Avanzado" : "Iniciante";

  const awardedIds = getAwardedIds();
  const kg = Number(profile?.total_kg ?? 0);
  const streak = profile?.streak ?? 0;
  const completedCount = MISSIONS.filter(
    (m) => awardedIds.includes(m.id) || m.check(logs, kg, streak, points)
  ).length;

  return (
    <div className="min-h-screen bg-background">
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
                <div className="font-display text-2xl font-bold">{points.toLocaleString()}</div>
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
              { icon: Scale,      label: "Kg reciclados", value: `${Number(totalKg).toFixed(1)} kg` },
              { icon: Recycle,    label: "Registros",     value: logs.length },
              { icon: TrendingUp, label: "Nivel",         value: level },
            ].map((s) => (
              <div key={s.label} className="bg-primary-foreground/10 rounded-2xl p-3 text-center">
                <s.icon size={18} className="mx-auto mb-1 text-primary-foreground/80" />
                <div className="font-display font-bold text-base sm:text-lg">{s.value}</div>
                <div className="text-[10px] sm:text-xs text-primary-foreground/70">{s.label}</div>
              </div>
            ))}
          </div>

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
            <div className="flex items-center justify-center h-32">
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
                <div key={log.id} className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50 hover:bg-muted transition-colors">
                  <div className={`w-10 h-10 rounded-xl ${getMaterialColor(log.material)} flex items-center justify-center shrink-0`}>
                    <MaterialIcon id={log.material} className="text-primary-foreground w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{getMaterialLabel(log.material)}</div>
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
              {completedCount} / {MISSIONS.length} completadas
            </span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {MISSIONS.map((m) => {
              const done = awardedIds.includes(m.id) || m.check(logs, kg, streak, points);
              const cur  = m.currentVal(logs, kg, streak, points);
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
                    <div className={`text-xs font-bold shrink-0 ${done ? "text-primary" : "text-muted-foreground"}`}>
                      +{m.bonus}
                    </div>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-eco rounded-full transition-all duration-700 ${progressWidth(Math.round(pct))}`} />
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
