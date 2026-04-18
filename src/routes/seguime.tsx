import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Newspaper, Users, Youtube, Music } from "lucide-react";
import imgImanol from "@/assets/imanol.jpg";
import imgJuan from "@/assets/juanmanuel.jpg";
import imgAlan from "@/assets/alan.jpg";
import imgBraian from "@/assets/braian.jpg";
import imgFoto5 from "@/assets/foto5.jpg";
import imgFoto6 from "@/assets/foto6.jpg";
import imgFoto7 from "@/assets/foto7.jpg";
import imgFoto8 from "@/assets/foto8.jpg";
import imgFoto9 from "@/assets/foto9.jpg";
import imgFoto10 from "@/assets/foto10.jpg";
import imgFoto11 from "@/assets/foto11.jpg";
import imgFoto12 from "@/assets/foto12.jpg";
import imgFoto13 from "@/assets/foto13.png";
import imgFoto14 from "@/assets/foto14.png";
import imgFoto15 from "@/assets/foto15.png";
import imgFoto16 from "@/assets/foto16.png";
import imgFoto17 from "@/assets/foto17.png";
import imgFoto18 from "@/assets/foto18.png";

export const Route = createFileRoute("/seguime")({
  head: () => ({
    meta: [
      { title: "Seguime — CLIMA" },
      { name: "description", content: "Seguí a CLIMA. Fotos, música y más." },
      { property: "og:title", content: "Seguime — CLIMA" },
      { property: "og:description", content: "Seguí a CLIMA. Fotos, música y más." },
    ],
  }),
  component: SeguimePage,
});

const fotos = [
  { src: imgImanol, alt: "Imanol" },
  { src: imgJuan, alt: "Juan Manuel" },
  { src: imgAlan, alt: "Alan" },
  { src: imgBraian, alt: "Braian" },
  { src: imgFoto5, alt: "CLIMA - Selfie nocturna" },
  { src: imgFoto6, alt: "CLIMA - Noche" },
  { src: imgFoto7, alt: "CLIMA - Espejo" },
  { src: imgFoto8, alt: "CLIMA - Tocando en vivo" },
  { src: imgFoto9, alt: "CLIMA - Banda en vivo" },
  { src: imgFoto10, alt: "CLIMA - Escenario" },
  { src: imgFoto11, alt: "CLIMA - Serafín" },
  { src: imgFoto12, alt: "CLIMA - Grupo" },
  { src: imgFoto13, alt: "CLIMA - Saxo en vivo" },
  { src: imgFoto14, alt: "CLIMA - Bajista en vivo" },
  { src: imgFoto15, alt: "CLIMA - Banda tocando" },
  { src: imgFoto16, alt: "CLIMA - Escenario Suarvederos" },
  { src: imgFoto17, alt: "CLIMA - Grupo al aire libre" },
  { src: imgFoto18, alt: "CLIMA - Selfie del grupo" },
];

const temas = [
  {
    name: "El Lobo Invisible",
    youtube: "https://www.youtube.com/watch?v=wd9jF8u-yJc",
    spotify: "https://open.spotify.com/intl-es/track/1sYUchKZJxiRDpMveGm5Kw?si=3f789158816b41c0",
  },
  {
    name: "Frontera",
    youtube: "https://www.youtube.com/watch?v=HJlcY-RFRcE",
    spotify: null,
  },
];

function AutoCarousel() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c === fotos.length - 1 ? 0 : c + 1));
    }, 3500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto overflow-hidden rounded-xl border border-border">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {fotos.map((foto, i) => (
          <img
            key={i}
            src={foto.src}
            alt={foto.alt}
            className="w-full shrink-0 aspect-[3/4] object-cover"
          />
        ))}
      </div>
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {fotos.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? "bg-primary w-8" : "bg-secondary/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function SeguimePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-15 blur-[120px] pointer-events-none"
        style={{ background: "linear-gradient(180deg, var(--glow-blue), var(--glow-violet), transparent)" }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-6 max-w-5xl mx-auto flex-wrap gap-3">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/info" className="flex items-center gap-2 glow-button text-sm !py-2 !px-4 no-underline">
            <Users className="w-4 h-4" />
            Info
          </Link>
          <Link to="/novedades" className="flex items-center gap-2 glow-button text-sm !py-2 !px-4 no-underline">
            <Newspaper className="w-4 h-4" />
            Novedades
          </Link>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-16">
        {/* Photo Carousel */}
        <section className="mb-16">
          <AutoCarousel />
        </section>

        {/* Temas */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Temas</h2>
          <div className="space-y-3">
            {temas.map((tema, i) => (
              <div key={i} className="news-card flex items-center justify-between gap-4">
                <span className="text-foreground font-semibold">{tema.name}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={tema.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-secondary hover:bg-primary/20 text-foreground transition-colors"
                    aria-label={`${tema.name} en YouTube`}
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                  {tema.spotify && (
                    <a
                      href={tema.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-secondary hover:bg-primary/20 text-foreground transition-colors"
                      aria-label={`${tema.name} en Spotify`}
                    >
                      <Music className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
