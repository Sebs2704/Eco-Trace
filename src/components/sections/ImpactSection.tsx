import { useState } from "react";
import { TrendingUp, Leaf, Droplets, Zap, TreePine, BarChart3 } from "lucide-react";

const impactData = [
  { icon: Leaf, label: "CO₂ evitado", value: "480", unit: "toneladas", color: "text-primary" },
  { icon: Droplets, label: "Agua ahorrada", value: "12M", unit: "litros", color: "text-eco-water" },
  { icon: Zap, label: "Energía conservada", value: "320", unit: "MWh", color: "text-eco-warm" },
  { icon: TreePine, label: "Árboles salvados", value: "1,200", unit: "árboles", color: "text-eco-leaf" },
];

const timeline = [
  {
    phase: "Corto plazo",
    emoji: "🌱",
    desc: "Sensibilización ciudadana y primeras pruebas de modelos colaborativos de reciclaje.",
    items: ["Campañas de educación ambiental", "App con guía de clasificación", "Primeros puntos QR activos"],
  },
  {
    phase: "Mediano plazo",
    emoji: "🌿",
    desc: "Mayor participación comunitaria con soluciones tecnológicas accesibles y efectivas.",
    items: ["Red de sensores en contenedores", "Sistema de gamificación activo", "Alianzas con comercios locales"],
  },
  {
    phase: "Largo plazo",
    emoji: "🌳",
    desc: "Villavicencio sostenible con gestión de residuos fortalecida y economía circular.",
    items: ["IA para optimización de rutas", "Marketplace de materiales reciclados", "Reducción del 40% en residuos al relleno"],
  },
];

const ImpactSection = () => {
  const [activePhase, setActivePhase] = useState(0);

  return (
    <section id="impacto" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-eco-leaf/20 text-eco-leaf text-sm font-medium mb-4">
            📊 Impacto Ambiental
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Nuestro <span className="text-gradient-eco">impacto</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Cada acción cuenta. Estos son los resultados proyectados de una Villavicencio que recicla.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-20">
          {impactData.map((d) => (
            <div key={d.label} className="bg-card rounded-2xl p-6 border border-border/50 text-center hover:shadow-card-eco transition-all group">
              <d.icon size={36} className={`mx-auto mb-3 ${d.color} group-hover:scale-110 transition-transform`} />
              <div className="font-display text-3xl font-bold">{d.value}</div>
              <div className="text-xs text-muted-foreground">{d.unit}</div>
              <div className="text-sm font-medium mt-1">{d.label}</div>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <h3 className="font-display text-2xl font-bold text-center mb-8">Hoja de ruta</h3>

          <div className="flex gap-2 justify-center mb-8">
            {timeline.map((t, i) => (
              <button
                key={t.phase}
                onClick={() => setActivePhase(i)}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  activePhase === i
                    ? "bg-gradient-eco text-primary-foreground shadow-eco"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.emoji} {t.phase}
              </button>
            ))}
          </div>

          <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-card-eco animate-slide-up" key={activePhase}>
            <div className="text-4xl mb-4">{timeline[activePhase].emoji}</div>
            <h4 className="font-display text-xl font-bold mb-2">{timeline[activePhase].phase}</h4>
            <p className="text-muted-foreground mb-6">{timeline[activePhase].desc}</p>
            <ul className="space-y-3">
              {timeline[activePhase].items.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
