import { useState } from "react";
import { Trophy, Star, Flame, Medal, TrendingUp, Gift, Loader2 } from "lucide-react";
import { progressWidth } from "@/lib/progressWidth";
import { useLeaderboard } from "@/hooks/useLeaderboard";

const rewards = [
  { name: "Descuento 10% comercio local", points: 500,  icon: Gift },
  { name: "Entrada gratis al Bioparque",  points: 1000, icon: Star },
  { name: "Kit de productos eco",         points: 1500, icon: Medal },
  { name: "Bono transporte público",      points: 2000, icon: TrendingUp },
];

const challenges = [
  { title: "Recicla 5 botellas PET",   progress: 80, reward: 50  },
  { title: "Registra 3 días seguidos", progress: 66, reward: 100 },
  { title: "Comparte con un amigo",    progress: 0,  reward: 75  },
];

type Tab = "ranking" | "recompensas" | "retos";

const GamificationSection = () => {
  const [tab, setTab] = useState<Tab>("ranking");
  const { data: leaderboard = [], isLoading: loadingLb } = useLeaderboard();

  return (
    <section id="gamificacion" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-medium mb-4">
            🎮 Gamificación
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Recicla y <span className="text-gradient-eco">gana</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Acumula puntos por cada residuo bien clasificado. Compite, desbloquea recompensas y transforma tu ciudad.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 mb-8 justify-center">
            {(["ranking", "recompensas", "retos"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  tab === t
                    ? "bg-gradient-eco text-primary-foreground shadow-eco"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "ranking"     && "🏆 Ranking"}
                {t === "recompensas" && "🎁 Recompensas"}
                {t === "retos"       && "🔥 Retos"}
              </button>
            ))}
          </div>

          {/* ── Ranking ── */}
          {tab === "ranking" && (
            <div className="space-y-3 animate-slide-up">
              {loadingLb ? (
                <div className="flex justify-center py-12">
                  <Loader2 size={28} className="animate-spin text-primary" />
                </div>
              ) : (
                leaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-card-eco ${
                      entry.rank <= 3 ? "bg-card border-primary/20" : "bg-card/60 border-border/50"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-lg ${
                      entry.rank === 1 ? "bg-gradient-warm text-secondary-foreground" :
                      entry.rank === 2 ? "bg-muted text-foreground" :
                      entry.rank === 3 ? "bg-eco-earth/20 text-eco-earth" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {entry.rank === 1 ? <Trophy size={18} /> : entry.rank}
                    </div>
                    <span className="text-2xl">{entry.avatar}</span>
                    <div className="flex-1">
                      <div className="font-semibold">{entry.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Flame size={12} className="text-eco-warm" /> {entry.streak} días seguidos
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-bold text-primary">{entry.points.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">puntos</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── Recompensas ── */}
          {tab === "recompensas" && (
            <div className="grid sm:grid-cols-2 gap-4 animate-slide-up">
              {rewards.map((r) => (
                <div key={r.name} className="bg-card rounded-2xl p-6 border border-border/50 hover:shadow-card-eco transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-eco flex items-center justify-center group-hover:scale-110 transition-transform">
                      <r.icon size={28} className="text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{r.name}</h4>
                      <div className="flex items-center gap-1 text-sm text-primary font-medium">
                        <Star size={14} /> {r.points} puntos
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-4 w-full py-2.5 rounded-xl bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors"
                  >
                    Canjear
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── Retos ── */}
          {tab === "retos" && (
            <div className="space-y-4 animate-slide-up">
              {challenges.map((c) => (
                <div key={c.title} className="bg-card rounded-2xl p-6 border border-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{c.title}</h4>
                    <span className="text-sm text-primary font-medium">+{c.reward} pts</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-eco rounded-full transition-all duration-1000 ${progressWidth(c.progress)}`} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{c.progress}% completado</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GamificationSection;
