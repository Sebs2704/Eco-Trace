import { useState } from "react";
import { Menu, X, LogOut, User, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ecoLogo from "@/assets/eco-logo.png";

const navItems = [
  { label: "Inicio", href: "#hero" },
  { label: "Clasificación", href: "#clasificacion" },
  { label: "Gamificación", href: "#gamificacion" },
  { label: "Trazabilidad", href: "#trazabilidad" },
  { label: "Impacto", href: "#impacto" },
  { label: "♻️ Centros de acopio", href: "#centros" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-eco">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <a href="#hero" className="flex items-center gap-2">
          <img src={ecoLogo} alt="EcoVilla" className="h-9 w-9" />
          <span className="font-display font-bold text-xl text-gradient-eco">EcoVilla</span>
        </a>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                <LayoutDashboard size={16} className="text-primary" />
                <span className="text-sm font-medium text-primary">
                  Mi Dashboard · {profile?.points ?? 0} pts
                </span>
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors"
              >
                <LogOut size={16} />
                Salir
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-eco text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass-eco border-t border-border/50 px-4 pb-4 pt-2 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              {item.label}
            </a>
          ))}
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 py-2 text-sm font-medium text-primary"
              >
                <LayoutDashboard size={16} /> Mi Dashboard · {profile?.points ?? 0} pts
              </Link>
              <button
                type="button"
                onClick={() => { signOut(); setOpen(false); }}
                className="block py-2 text-sm font-medium text-destructive"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-primary"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
