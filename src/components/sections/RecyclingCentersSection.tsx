import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, ExternalLink, Recycle } from "lucide-react";

// Fix Leaflet default icon in Vite (asset handling differs from Webpack)
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const CENTERS = [
  {
    id: 1,
    name: "Asociación de Recicladores Recuperarte",
    address: "Villavicencio, Meta",
    lat: 4.1435,
    lng: -73.6294,
  },
  {
    id: 2,
    name: "Asociación de Recicladores Ecoambiente",
    address: "Villavicencio, Meta",
    lat: 4.1512,
    lng: -73.6350,
  },
  {
    id: 3,
    name: "Recinam del Llano",
    address: "Villavicencio, Meta",
    lat: 4.1380,
    lng: -73.6200,
  },
  {
    id: 4,
    name: "Asociación de Recicladores La Suaitana Villao",
    address: "Villavicencio, Meta",
    lat: 4.1468,
    lng: -73.6480,
  },
  {
    id: 5,
    name: "Asociación de Recicladores Proyectos Ambientales Recuperables del Meta",
    address: "Villavicencio, Meta",
    lat: 4.1310,
    lng: -73.6150,
  },
  {
    id: 6,
    name: "Asociación de Recicladores Con Canitas de Villavicencio (ASOCANITAS)",
    address: "Villavicencio, Meta",
    lat: 4.1560,
    lng: -73.6410,
  },
  {
    id: 7,
    name: "Asociación de Recicladores Unidos por una Meta (ARUM)",
    address: "Villavicencio, Meta",
    lat: 4.1450,
    lng: -73.6260,
  },
];

const MAP_CENTER: [number, number] = [4.1430, -73.6320];

const RecyclingCentersSection = () => {
  useEffect(() => {
    // Ensure Leaflet CSS container sizes are applied correctly after mount
  }, []);

  return (
    <section id="centros" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            ♻️ Puntos de Reciclaje
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Centros de <span className="text-gradient-eco">acopio</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Lleva tus materiales reciclables a uno de estos puntos autorizados en Villavicencio
            y acumula puntos por cada entrega.
          </p>
        </div>

        {/* Map */}
        <div className="rounded-3xl overflow-hidden border border-border/50 shadow-card-eco mb-10" style={{ height: "420px" }}>
          <MapContainer
            center={MAP_CENTER}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {CENTERS.map((c) => (
              <Marker key={c.id} position={[c.lat, c.lng]}>
                <Popup>
                  <div className="font-medium text-sm">{c.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{c.address}</div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline mt-1 flex items-center gap-1"
                  >
                    Ver en Google Maps
                  </a>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Centers grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CENTERS.map((c) => (
            <div
              key={c.id}
              className="bg-card rounded-2xl border border-border/50 p-5 hover:shadow-card-eco transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-eco flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Recycle size={18} className="text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm leading-snug">{c.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <MapPin size={11} /> {c.address}
                  </div>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <ExternalLink size={11} /> Cómo llegar
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          * Las ubicaciones son aproximadas. Verifica con la asociación antes de ir.
        </p>
      </div>
    </section>
  );
};

export default RecyclingCentersSection;
