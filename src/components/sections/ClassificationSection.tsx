import { useState } from "react";
import { Package, Milk, Newspaper, Battery, Apple, Wine, CheckCircle2, XCircle, Sparkles } from "lucide-react";

const materials = [
  {
    id: "plastico",
    name: "Plástico",
    icon: Milk,
    color: "bg-eco-sky",
    bin: "Contenedor Azul",
    examples: ["Botellas PET", "Envases de yogurt", "Bolsas plásticas"],
    tips: "Enjuaga y aplasta las botellas antes de depositarlas.",
    recyclable: true,
  },
  {
    id: "papel",
    name: "Papel y Cartón",
    icon: Newspaper,
    color: "bg-eco-warm",
    bin: "Contenedor Gris",
    examples: ["Periódicos", "Cajas de cartón", "Hojas de papel"],
    tips: "No mezcles con papel mojado o con restos de comida.",
    recyclable: true,
  },
  {
    id: "vidrio",
    name: "Vidrio",
    icon: Wine,
    color: "bg-primary",
    bin: "Contenedor Verde",
    examples: ["Botellas de vidrio", "Frascos", "Envases de conservas"],
    tips: "Retira las tapas metálicas antes de reciclar.",
    recyclable: true,
  },
  {
    id: "organico",
    name: "Orgánico",
    icon: Apple,
    color: "bg-eco-earth",
    bin: "Contenedor Verde Oscuro",
    examples: ["Cáscaras de fruta", "Restos de comida", "Hojas secas"],
    tips: "Ideal para compostaje doméstico.",
    recyclable: false,
  },
  {
    id: "peligroso",
    name: "Peligroso",
    icon: Battery,
    color: "bg-eco-danger",
    bin: "Punto Limpio",
    examples: ["Pilas", "Medicamentos", "Aceites usados"],
    tips: "Nunca los mezcles con residuos comunes.",
    recyclable: false,
  },
  {
    id: "general",
    name: "No reciclable",
    icon: Package,
    color: "bg-muted-foreground",
    bin: "Contenedor Negro",
    examples: ["Pañales", "Colillas", "Cerámica rota"],
    tips: "Minimiza este tipo de residuos eligiendo productos reutilizables.",
    recyclable: false,
  },
];

const ClassificationSection = () => {
  const [active, setActive] = useState(materials[0]);
  const [dragItem, setDragItem] = useState<string | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

  const handleDrop = (binId: string) => {
    if (dragItem === binId) {
      setResult("correct");
    } else {
      setResult("wrong");
    }
    setTimeout(() => setResult(null), 2000);
    setDragItem(null);
  };

  return (
    <section id="clasificacion" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            📋 Guía Interactiva
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Clasifica tus <span className="text-gradient-eco">residuos</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Aprende a separar correctamente. Selecciona un material para ver cómo reciclarlo.
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-2xl mx-auto mb-12">
          {materials.map((mat) => (
            <button
              key={mat.id}
              onClick={() => setActive(mat)}
              draggable
              onDragStart={() => setDragItem(mat.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all cursor-grab active:cursor-grabbing ${
                active.id === mat.id
                  ? "border-primary shadow-eco bg-card scale-105"
                  : "border-transparent bg-card/60 hover:bg-card hover:border-border"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl ${mat.color} flex items-center justify-center`}>
                <mat.icon size={24} className="text-primary-foreground" />
              </div>
              <span className="text-xs font-medium text-center">{mat.name}</span>
            </button>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-3xl shadow-card-eco p-8 border border-border/50 transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl ${active.color} flex items-center justify-center`}>
                <active.icon size={32} className="text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold">{active.name}</h3>
                <span className={`inline-flex items-center gap-1 text-sm font-medium ${active.recyclable ? "text-primary" : "text-muted-foreground"}`}>
                  {active.recyclable ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  {active.recyclable ? "Reciclable" : "No reciclable"}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">Contenedor</h4>
                <div className="bg-muted rounded-xl p-4 text-center font-display font-semibold text-lg">
                  {active.bin}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">Ejemplos</h4>
                <ul className="space-y-1.5">
                  {active.examples.map((ex) => (
                    <li key={ex} className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-primary/5 rounded-xl p-4 flex items-start gap-3">
              <Sparkles size={20} className="text-primary mt-0.5 shrink-0" />
              <p className="text-sm"><strong>Tip:</strong> {active.tips}</p>
            </div>
          </div>

          {result && (
            <div className={`mt-4 text-center py-3 rounded-xl font-semibold text-lg animate-slide-up ${
              result === "correct" ? "bg-primary/10 text-primary" : "bg-eco-danger/10 text-eco-danger"
            }`}>
              {result === "correct" ? "✅ ¡Correcto! Bien clasificado." : "❌ Intenta de nuevo. Revisa la guía."}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ClassificationSection;
