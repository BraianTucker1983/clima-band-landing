import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import bgBio from "@/assets/seguime-bg.png";

export const Route = createFileRoute("/biografia")({
  component: BiografiaPage,
});

function BiografiaPage() {
  return (
    <div className="min-h-screen relative text-white">

      {/* Fondo */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgBio})` }}
      />

      {/* Overlay oscuro */}
      <div className="fixed inset-0 bg-black/70" />

      {/* Contenido */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-10">

        {/* Volver */}
        <Link
          to="/seguime"
          className="flex items-center gap-2 mb-8 text-gray-300 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </Link>

        {/* Título */}
        <h1 className="text-3xl font-bold mb-6">
          Biografía de CLIMA
        </h1>

        {/* Texto */}
        <p className="text-lg leading-relaxed">
          CLIMA es una banda formada en Coronel Suárez que mezcla sonidos
          modernos con una identidad propia. A lo largo de su recorrido,
          han construido un estilo que combina energía en vivo, letras
          profundas y una conexión directa con su público.
        </p>

        <p className="text-lg leading-relaxed mt-4">
          Desde sus primeros ensayos hasta sus presentaciones en vivo,
          la banda fue creciendo y consolidando su propuesta musical,
          destacándose por su autenticidad y evolución constante.
        </p>

      </div>
    </div>
  );
}