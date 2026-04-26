import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Youtube, X, Instagram } from "lucide-react";
import { motion, useAnimation, useMotionValue } from "framer-motion";

import { SocialCard } from "@/components/SocialCard";
import { InfoSection } from "@/components/InfoSection";
import { Novedades } from "@/components/novedades";
import { Biografia } from "@/components/biografia";
import { Footer } from "@/components/footer";
import { Card } from "@/components/Card";

import bgSeguime from "@/assets/seguime-bg.png";

export const Route = createFileRoute("/seguime")({
  component: SeguimePage,
});

/* ---------------- IMÁGENES ---------------- */
const images = import.meta.glob<string>(
  "@/assets/carousel/*.{jpg,png,jpeg}",
  { eager: true, import: "default" }
);

const fotos = Object.entries(images).map(([path, src]) => ({
  src,
  alt: path.split("/").pop()?.split(".")[0] || "foto",
}));

/* ---------------- TEMAS ---------------- */
const temas = [
  {
    name: "El Lobo Invisible",
    youtube: "https://www.youtube.com/watch?v=wd9jF8u-yJc",
    letra: "lobo",
  },
  {
    name: "Frontera",
    youtube: "https://www.youtube.com/watch?v=HJlcY-RFRcE",
    letra: "frontera",
  },
];

/* ---------------- HELPERS ---------------- */
function getYoutubeId(url: string) {
  return url.split("v=")[1]?.split("&")[0];
}

/* ---------------- CAROUSEL ---------------- */
function AutoCarousel() {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);

  const [width, setWidth] = useState(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.scrollWidth - ref.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    if (!dragging && width > 0) {
      controls.start({
        x: -width / 2,
        transition: {
          duration: 40,
          ease: "linear",
          repeat: Infinity,
        },
      });
    }
  }, [dragging, width]);

  return (
    <div className="w-full max-w-lg mx-auto overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <motion.div
        ref={ref}
        style={{ x }}
        className="flex gap-4 cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: -width, right: 0 }}
        animate={controls}
        onDragStart={() => setDragging(true)}
        onDragEnd={() => setDragging(false)}
      >
        {[...fotos, ...fotos].map((f, i) => (
          <motion.img
            key={i}
            src={f.src}
            className="w-[250px] h-[330px] object-cover rounded-lg shrink-0"
            whileTap={{ scale: 0.95 }}
            draggable={false}
          />
        ))}
      </motion.div>
    </div>
  );
}

/* ---------------- PAGE ---------------- */
function SeguimePage() {
  const [openPlayer, setOpenPlayer] = useState<number | null>(null);
  const [showLyrics, setShowLyrics] = useState<number | null>(null);
  const [openBio, setOpenBio] = useState(false);

  /* LETRAS */
const letras = {
  lobo: `
Fuí un hermoso niño cursi
descarrié de los renglones
un piedrazo en la ventana
me ofreció mirar al sol

Fuí parche de bicicleta
fantasmee por los rincones
se me escapó la pelota
cuando iba a hacer el gol

y te vi, estabas temprano en la soledad
tatuaste mi mano con tempera azul
para mi era el cielo...

Fuí a cambiar mis figuritas
por tarjetitas magnéticas
la electricidad frenética
de tiempo y velocidad

Nos llevó hacia un infinito
de compás irreverente
te perdiste entre la gente
y el bombo de la ciudad

y me vi, estaba pensando y de tanto pensar
quemé los fusibles de la realidad
me quedé alumbrando con la linterna
a un lobo invisible

Fuí a la vuelta de la esquina
para respirar un rato
a sacarme los zapatos
de la desesperación

había un lago de silencios
que se reflejó en mis ojos
desbordaba en tu ventana
donde se rompía el sol

y te vi, estabas temblando de frío y amor
la frágil frecuencia nació entre los dos
llenaste mi mano con tempera azul
para mi era el cielo o un lobo feroz
un lobo invisible...
  `,

  frontera: `
El mundo está cambiando chango
Ya nada es como antes
Lo dicen los parlantes
Hay fuego en la frontera

La vida es un instante
Un mar de aplicaciones
Nos quedan las canciones
Para sobrevivir

A ver quién canta por verdadero amor
Suelta tu primavera
Alza tu mano para que pueda ver
Tras la frontera

Los siglos que sembramos
Con lágrimas de tiempo
Dónde estará mi hermano
Que hoy no fue a la escuela

No olvides mi nombre
Quizás nos encontremos
Celebrando la lluvia
Que cae sobre la tierra

A ver quién baila por verdadero amor
Esta es tu primavera
Alza tu mano para que pueda ver
Tras la frontera
  `,
};

  const togglePlayer = (i: number) => {
    setOpenPlayer((prev) => (prev === i ? null : i));
  };

  return (
    <div className="min-h-screen bg-background relative">

      {/* BACKGROUND */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgSeguime})` }}
      />
      <div className="fixed inset-0 bg-black/70" />

      {/* NAV */}
      <div className="relative z-10 px-6 py-6 max-w-5xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-white">
          <ArrowLeft className="w-5 h-5" />
          Volver
        </Link>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-20 space-y-14">

        {/*SOCIALCARD */}
        <div className="flex justify-center w-full">
          <SocialCard
            title="Seguinos en"
            subtitle="@climamusica"
            url="https://www.instagram.com/climamusica/"
            icon={<Instagram className="w-8 h-8 text-white" />}
          />
        </div>

        {/* CAROUSEL */}
        <AutoCarousel />

        {/* INFO */}
        <InfoSection />

        {/* TEMAS */}
        <section className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold">Temas</h2>

          {temas.map((tema, i) => (
            <div
              key={i}
              className="border border-white/10 rounded-lg p-4 bg-black/20"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center">
                <span className="font-semibold">{tema.name}</span>

                <div className="flex items-center gap-2">

                  {/* YOUTUBE */}
                  <button
                    onClick={() =>
                      setOpenPlayer(openPlayer === i ? null : i)
                    }
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <Youtube className="w-5 h-5" />
                  </button>

                  {/* LETRA */}
                  <button
                    onClick={() =>
                      setShowLyrics(showLyrics === i ? null : i)
                    }
                    className="px-3 py-1 text-sm rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    Letra
                  </button>

                </div>
              </div>

              {/* 🎬 VIDEO */}
              {openPlayer === i && (
                <div className="mt-4">
                  <iframe
                    className="w-full aspect-video rounded-lg"
                    src={`https://www.youtube.com/embed/${getYoutubeId(
                      tema.youtube
                    )}?autoplay=1`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
              )}

              {/* 📄 LETRA */}
              {showLyrics === i && (
                <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10 whitespace-pre-line text-sm leading-relaxed text-center">
                  {letras[tema.letra as keyof typeof letras]}
                </div>
              )}
            </div>
          ))}
        </section>
        {/* NOVEDADES */}
        
        <Card title="Novedades">
        <Novedades />
        </Card>

        
      {/* CARD BIO */}
        <Card title="Historia">
          <Biografia />
        </Card>

      {/* FOOTER */}  
      <Card>
        <Footer />
      </Card>

    </div>
  </div>


    
  );
}