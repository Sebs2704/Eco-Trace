import { useState } from "react";
import { QrCode, MapPin, Truck, Factory, Package, CheckCircle2, ArrowRight } from "lucide-react";

const trackingSteps = [
  { icon: QrCode, label: "Escaneo QR", desc: "El ciudadano escanea el código QR del contenedor", status: "done" },
  { icon: MapPin, label: "Punto de acopio", desc: "Los residuos llegan al centro de acopio del barrio", status: "done" },
  { icon: Truck, label: "Recolección", desc: "Vehículo recolector transporta al centro de procesamiento", status: "done" },
  { icon: Factory, label: "Procesamiento", desc: "Clasificación industrial y preparación del material", status: "active" },
  { icon: Package, label: "Nuevo producto", desc: "Transformación en materia prima o producto reciclado", status: "pending" },
];

const mockQRData = {
  id: "VLL-2026-04872",
  material: "PET Plástico",
  weight: "2.3 kg",
  date: "07/04/2026",
  location: "Barrio La Esperanza",
  points: 45,
};

const TraceabilitySection = () => {
  const [scanned, setScanned] = useState(false);

  return (
    <section id="trazabilidad" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
            📍 Trazabilidad
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Rastrea tu <span className="text-gradient-eco">reciclaje</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Con códigos QR puedes seguir el viaje de tus residuos desde tu hogar hasta su transformación.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative">
            <div className="hidden md:block absolute top-8 left-0 right-0 h-1 bg-border z-0">
              <div className="h-full bg-gradient-eco rounded-full" style={{ width: "70%" }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
              {trackingSteps.map((step, i) => (
                <div key={step.label} className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-all ${
                    step.status === "done" ? "bg-gradient-eco shadow-eco" :
                    step.status === "active" ? "bg-primary/20 border-2 border-primary animate-pulse-eco" :
                    "bg-muted border-2 border-border"
                  }`}>
                    <step.icon size={28} className={
                      step.status === "done" ? "text-primary-foreground" :
                      step.status === "active" ? "text-primary" :
                      "text-muted-foreground"
                    } />
                  </div>
                  <h4 className="font-semibold text-sm">{step.label}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="bg-card rounded-3xl shadow-card-eco border border-border/50 overflow-hidden">
            <div className="bg-gradient-eco p-6 text-center">
              <QrCode size={48} className="mx-auto mb-3 text-primary-foreground" />
              <h3 className="font-display text-xl font-bold text-primary-foreground">Simulador de escaneo QR</h3>
              <p className="text-primary-foreground/80 text-sm mt-1">Haz clic para simular el escaneo de un código QR</p>
            </div>

            {!scanned ? (
              <div className="p-8 text-center">
                <button
                  onClick={() => setScanned(true)}
                  className="w-40 h-40 mx-auto rounded-3xl border-4 border-dashed border-primary/30 flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <div className="text-center">
                    <QrCode size={48} className="mx-auto text-primary/50 group-hover:text-primary transition-colors" />
                    <span className="text-sm text-muted-foreground mt-2 block">Toca para escanear</span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="p-6 animate-slide-up space-y-4">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <CheckCircle2 size={20} />
                  ¡Código escaneado exitosamente!
                </div>
                {Object.entries(mockQRData).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="text-sm text-muted-foreground capitalize">{key.replace("_", " ")}</span>
                    <span className="text-sm font-medium">{val}</span>
                  </div>
                ))}
                <button
                  onClick={() => setScanned(false)}
                  className="w-full py-2.5 rounded-xl bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors"
                >
                  Escanear otro
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TraceabilitySection;
