import { createFileRoute, Link } from "@tanstack/react-router";
import climaLogo from "@/assets/clima-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CLIMA — Banda" },
      { name: "description", content: "Sitio oficial de la banda CLIMA." },
      { property: "og:title", content: "CLIMA — Banda" },
      { property: "og:description", content: "Sitio oficial de la banda CLIMA." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background glow effects */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--glow-blue) 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--glow-violet) 0%, transparent 70%)" }}
      />

      {/* Logo */}
      <img
        src={climaLogo}
        alt="CLIMA"
        width={500}
        height={250}
        className="relative z-10 mb-12"
        style={{ animation: "float 4s ease-in-out infinite" }}
      />

      {/* CTA Button */}
      <Link to="/seguime" className="glow-button relative z-10 no-underline">
        Seguinos
      </Link>
    </div>
  );
}
