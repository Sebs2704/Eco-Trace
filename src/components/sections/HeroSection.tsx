import { useEffect, useState } from "react";
import { Leaf, TreePine, Droplets, ArrowDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { value: 1200, suffix: "+", label: "Toneladas recicladas", icon: Leaf },
  { value: 85, suffix: "%", label: "Participación ciudadana", icon: TreePine },
  { value: 340, suffix: "", label: "Puntos de recolección", icon: Droplets },
];

const AnimatedCounter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString()}{suffix}</span>;
};

const HeroSection = () => {
  const leaves = Array.from({ length: 6 }, (_, i) => i);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-background" />
      </div>

      {leaves.map((i) => (
        <div
          key={i}
          className="absolute text-primary/30 animate-leaf-fall pointer-events-none"
          style={{
            left: `${10 + i * 15}%`,
            animationDelay: `${i * 1.3}s`,
            fontSize: `${18 + i * 4}px`,
          }}
        >
          🍃
        </div>
      ))}

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="animate-slide-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-6 backdrop-blur-sm border border-primary/30">
            🌿 Villavicencio Sostenible · TRL 5-6
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-black leading-tight mb-6" style={{ color: 'hsl(0 0% 100%)' }}>
            Recicla.{" "}
            <span className="text-gradient-eco">Transforma.</span>
            <br />
            Impacta.
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light" style={{ color: 'hsl(0 0% 85%)' }}>
            Plataforma tecnológica para la gestión inteligente de residuos reciclables.
            Clasifica, rastrea y gana recompensas por cuidar tu ciudad.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a href="#clasificacion" className="bg-gradient-eco text-primary-foreground px-8 py-3.5 rounded-xl font-semibold text-lg hover:opacity-90 transition-all shadow-glow-eco">
              Clasificar residuos
            </a>
            <a href="#impacto" className="glass-eco px-8 py-3.5 rounded-xl font-semibold text-lg transition-all" style={{ color: 'hsl(0 0% 100%)' }}>
              Ver impacto
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-eco rounded-2xl p-5 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <stat.icon className="mx-auto mb-2 text-primary" size={28} />
              <div className="font-display text-3xl font-bold" style={{ color: 'hsl(0 0% 100%)' }}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm" style={{ color: 'hsl(0 0% 75%)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <a href="#clasificacion" className="inline-block mt-12 animate-float">
          <ArrowDown className="text-primary" size={32} />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
