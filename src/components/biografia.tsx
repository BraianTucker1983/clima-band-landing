import bgBio from "@/assets/seguime-bg.webp";

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

        <p className="text-lg leading-relaxed mt-4">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </p>

      </div>
    </div>
  );
}