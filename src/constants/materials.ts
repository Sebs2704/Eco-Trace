import { Milk, Newspaper, Wine, Package, Cpu } from "lucide-react";
import type { Material } from "@/types";

export const MATERIALS: Material[] = [
  { id: "plastico",    name: "Plástico",      icon: Milk,      color: "bg-eco-sky",   pts_per_kg: 20 },
  { id: "papel",       name: "Papel / Cartón", icon: Newspaper, color: "bg-eco-warm",  pts_per_kg: 10 },
  { id: "vidrio",      name: "Vidrio",         icon: Wine,      color: "bg-primary",   pts_per_kg: 15 },
  { id: "metal",       name: "Metal",          icon: Package,   color: "bg-eco-earth", pts_per_kg: 25 },
  { id: "electronico", name: "Electrónicos",   icon: Cpu,       color: "bg-accent",    pts_per_kg: 30 },
];

export const getMaterialById   = (id: string) => MATERIALS.find((m) => m.id === id);
export const getMaterialLabel  = (id: string) => getMaterialById(id)?.name  ?? id;
export const getMaterialColor  = (id: string) => getMaterialById(id)?.color ?? "bg-muted";
