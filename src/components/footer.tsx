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

      {/* COPYRIGHT */}
      <p className="text-sm mt-8 opacity-40">
        © 2026 CLIMA. Todos los derechos reservados.
      </p>
    </footer>
  );
}