import { useEffect, useState } from "react";
import { Leaf, TreePine, Droplets, ArrowDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { value: 1200, suffix: "+", label: "Toneladas recicladas",    icon: Leaf },
  { value: 85,   suffix: "%", label: "Participación ciudadana", icon: TreePine },
  { value: 340,  suffix: "",  label: "Puntos de recolección",   icon: Droplets },
];

const LEAF_COUNT = 6;

const COUNTER_DURATION = 2000;
const COUNTER_STEPS    = 60;

const AnimatedCounter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const increment = target / COUNTER_STEPS;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, COUNTER_DURATION / COUNTER_STEPS);
    return () => clearInterval(timer);
  }, [target]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

const HeroSection = () => (
  <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0">
      <img src={heroBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
      <div className="absolute inset-0 bg-foreground/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-background" />
    </div>

    {Array.from({ length: LEAF_COUNT }, (_, i) => (
      <div key={i} className={`absolute text-primary/30 animate-leaf-fall pointer-events-none leaf-${i}`}>
        🍃
      </div>
    ))}

    <div className="relative z-10 container mx-auto px-4 text-center">
      <div className="animate-slide-up">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-6 backdrop-blur-sm border border-primary/30">
          🌿 Villavicencio Sostenible · TRL 5-6
        </span>
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-black leading-tight mb-6 text-white">
          Recicla.{" "}
          <span className="text-gradient-eco">Transforma.</span>
          <br />
          Impacta.
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light text-white/85">
          Plataforma tecnológica para la gestión inteligente de residuos reciclables.
          Clasifica, rastrea y gana recompensas por cuidar tu ciudad.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a
            href="#clasificacion"
            className="bg-gradient-eco text-primary-foreground px-8 py-3.5 rounded-xl font-semibold text-lg hover:opacity-90 transition-all shadow-glow-eco"
          >
            Clasificar residuos
          </a>
          <a
            href="#impacto"
            className="glass-eco text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-all"
          >
            Ver impacto
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-eco rounded-2xl p-5 animate-slide-up-delayed">
            <stat.icon className="mx-auto mb-2 text-primary" size={28} />
            <div className="font-display text-3xl font-bold text-white">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-sm text-white/75">{stat.label}</div>
          </div>
        ))}
      </div>

      <a href="#clasificacion" aria-label="Ir a la sección de clasificación" className="inline-block mt-12 animate-float">
        <ArrowDown className="text-primary" size={32} />
      </a>
    </div>
  </section>
);

export default HeroSection;
