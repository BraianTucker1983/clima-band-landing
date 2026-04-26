import { Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="pt-10 text-center text-white/60">

      {/* BRAND */}
      <h3 className="text-white text-3xl tracking-[8px] mb-2">
        CLIMA
      </h3>

      <p className="text-base opacity-70">
        Banda musical · Coronel Suarez · Argentina
      </p>

      {/* LINKS */}
      <div className="flex justify-center gap-6 mt-6 text-base">
        <a
          href="https://www.instagram.com/climamusica/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition"
        >
          Instagram
        </a>
      </div>

      {/* SOCIAL ICONS */}
      <div className="flex justify-center gap-5 mt-6 text-white/60">
        <a
          href="https://www.instagram.com/climamusica/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition"
        >
          <Instagram size={22} />
        </a>
        
      </div>

      {/* COPYRIGHT */}
      <p className="text-sm mt-8 opacity-40">
        © 2026 CLIMA. Todos los derechos reservados.
      </p>
    </footer>
  );
}