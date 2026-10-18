// src/components/footer.tsx
import { Instagram, Lock } from "lucide-react";

interface FooterProps {
  onOpenAdmin?: () => void;
  isAdmin?: boolean;
}

export function Footer({ onOpenAdmin, isAdmin }: FooterProps) {
  return (
    <footer className="pt-10 text-center text-white/60 space-y-4">
      {/* BRAND */}
      <h3 className="text-white text-3xl tracking-[8px] mb-2">CLIMA</h3>

      <p className="text-base opacity-70">
        Banda musical · Coronel Suárez · Argentina
      </p>

      {/* LINKS */}
      <div className="flex justify-center mt-6">
        <a
          href="https://www.instagram.com/climamusica/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white/70 hover:text-white transition text-base"
        >
          <Instagram size={20} />
          <span>@climamusica</span>
        </a>
      </div>

      {/* ACCESO ADMIN DISCRETO */}
      {!isAdmin && onOpenAdmin && (
        <div className="pt-2">
          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/40 hover:text-white/80 transition text-xs"
            title="Acceso Administrador"
          >
            <Lock className="w-3 h-3" />
            <span>Admin</span>
          </button>
        </div>
      )}

      {/* COPYRIGHT */}
      <p className="text-sm opacity-40">
        © {new Date().getFullYear()} CLIMA. Todos los derechos reservados.
      </p>
    </footer>
  );
}