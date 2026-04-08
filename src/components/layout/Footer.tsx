import { Leaf, Heart } from "lucide-react";
import ecoLogo from "@/assets/eco-logo.png";

const Footer = () => (
  <footer className="bg-foreground py-12">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <img src={ecoLogo} alt="EcoVilla" className="h-8 w-8" />
          <span className="font-display font-bold text-lg text-primary-foreground">EcoVilla</span>
        </div>
        <p className="text-sm text-primary-foreground/60 text-center">
          Solución tecnológica para la gestión de residuos reciclables · Villavicencio, Meta 🇨🇴
        </p>
        <div className="flex items-center gap-1 text-sm text-primary-foreground/60">
          Hecho con <Heart size={14} className="text-eco-danger" /> por estudiantes
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/40">
        TRL 5-6 · Prototipo funcional · Semestre 7-10 · {new Date().getFullYear()}
      </div>
    </div>
  </footer>
);

export default Footer;
