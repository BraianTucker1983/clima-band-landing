import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Instagram, Music, ArrowLeft, Newspaper } from "lucide-react";
import imgImanol from "@/assets/imanol.jpg";
import imgJuan from "@/assets/juanmanuel.jpg";
import imgAlan from "@/assets/alan.jpg";
import imgBraian from "@/assets/braian.jpg";

const members = [
  {
    name: "Imanol Insua",
    role: "Compositor · Voz · Guitarra · Saxo",
    bio: "Compositor, vocalista, guitarrista y saxofonista. El alma creativa detrás de CLIMA.",
    photo: imgImanol,
    instagram: "https://www.instagram.com/imanolinsua/",
    spotify: "#",
  },
  {
    name: "Juan Manuel Merkel",
    role: "Guitarra · Voz",
    bio: "Guitarrista y segunda voz. Su sonido define la identidad de CLIMA.",
    photo: imgJuan,
    instagram: "https://www.instagram.com/nanomerkel/",
    spotify: "#",
  },
  {
    name: "Alan Tucker",
    role: "Bajo",
    bio: "El groove y la base que sostiene todo el sonido de la banda.",
    photo: imgAlan,
    instagram: "https://www.instagram.com/alan.tucker.716195/",
    spotify: "#",
  },
  {
    name: "Braian Tucker",
    role: "Batería",
    bio: "El pulso rítmico y la energía en vivo de CLIMA.",
    photo: imgBraian,
    instagram: "https://www.instagram.com/braiantucker/",
    spotify: "#",
  },
];

function InfoPage() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? members.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === members.length - 1 ? 0 : c + 1));

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-15 blur-[120px] pointer-events-none"
        style={{ background: "linear-gradient(180deg, var(--glow-blue), var(--glow-violet), transparent)" }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-6 max-w-5xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </Link>
        <Link to="/novedades" className="flex items-center gap-2 glow-button text-sm !py-2 !px-4 no-underline">
          <Newspaper className="w-4 h-4" />
          Novedades
        </Link>
      </div>

      {/* Title */}
      <div className="relative z-10 text-center mt-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text">La Banda</h1>
        <p className="text-muted-foreground mt-3">Conocé a los integrantes de CLIMA</p>
      </div>

      {/* Carousel */}
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-4 justify-center">
          <button
            onClick={prev}
            className="p-3 rounded-full bg-secondary text-foreground hover:bg-primary/20 transition-colors shrink-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="member-card max-w-sm w-full">
            {/* Photo placeholder */}
            <div className="aspect-[3/4] bg-secondary overflow-hidden">
              <img
                src={members[current].photo}
                alt={members[current].name}
                className="w-full h-full object-cover"
                width={640}
                height={854}
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-foreground">{members[current].name}</h2>
              <p className="text-primary text-sm font-semibold uppercase tracking-wider mt-1">
                {members[current].role}
              </p>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {members[current].bio}
              </p>
              <div className="flex gap-3 mt-5">
                <a
                  href={members[current].instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-secondary hover:bg-primary/20 text-foreground transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={members[current].spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-secondary hover:bg-primary/20 text-foreground transition-colors"
                >
                  <Music className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <button
            onClick={next}
            className="p-3 rounded-full bg-secondary text-foreground hover:bg-primary/20 transition-colors shrink-0"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {members.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === current ? "bg-primary w-8" : "bg-secondary"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
