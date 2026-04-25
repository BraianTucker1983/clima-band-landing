import bgBio from "@/assets/seguime-bg.png";

export function Biografia() {
  return (
    <div className="relative text-white rounded-xl overflow-hidden">

      {/* Fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${bgBio})` }}
      />

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/70 z-0" />

      {/* Contenido */}
      <div className="relative z-10 p-6">

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