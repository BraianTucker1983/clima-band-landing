// src/routes/seguime.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Youtube, Instagram, Disc, ArrowRight, Music } from "lucide-react";
import { motion, useMotionValue, animate, AnimatePresence } from "framer-motion";

import { SocialCard } from "@/components/SocialCard";
import { InfoSection } from "@/components/InfoSection";
import { Novedades } from "@/components/novedades";
import { Biografia } from "@/components/biografia";
import { Footer } from "@/components/footer";
import { Card } from "@/components/Card";
import { ClimaAdminGallery } from "@/components/ClimaAdminGallery";
import { ClimaGalleryPreview } from "@/components/ClimaGalleryPreview";
import { ClimaGalleryGrid } from "@/components/ClimaGalleryGrid";

// 🎵 NUEVOS COMPONENTES DE AUDIO
import { ClimaAdminAudio } from "@/components/ClimaAdminAudio";
import { ClimaMusicLibrary } from "@/components/ClimaMusicLibrary";

import bgSeguime from "@/assets/seguime-bg.webp";

export const Route = createFileRoute("/seguime")({
  component: SeguimePage,
});

/* ---------------- IMÁGENES ESTÁTICAS PARA EL CAROUSEL ---------------- */
const images = import.meta.glob<string>(
  "/src/assets/carousel/*.webp",
  { eager: true, import: "default" }
);

const fotos = Object.entries(images).map(([path, src]) => ({
  src,
  alt: path.split("/").pop()?.split(".")[0] || "foto",
}));

/* ---------------- TIPOS ---------------- */
type Tema = {
  name: string;
  youtube: string;
  letra: keyof typeof letras;
};

/* ---------------- TEMAS ---------------- */
const temas: Tema[] = [
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

/* ---------------- VARIANTES ANIMACIÓN ---------------- */
const fadeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

/* ---------------- CAROUSEL ---------------- */
type CarouselProps = {
  images: { src: string; alt: string }[];
  speed?: number;
};

function AutoCarousel({ images, speed = 50 }: CarouselProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const [width, setWidth] = useState(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.scrollWidth / 2);
    }
  }, [images]);

  useEffect(() => {
    if (!dragging && width > 0) {
      const duration = width / speed;
      const controls = animate(x, -width, {
        duration,
        ease: "linear",
        repeat: Infinity,
      });
      return () => controls.stop();
    }
  }, [width, dragging, speed]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-lg mx-auto overflow-hidden rounded-xl border border-white/10 bg-white/5 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
    >
      <motion.div
        ref={ref}
        style={{ x }}
        className="flex gap-4 cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: -width, right: 0 }}
        onDragStart={() => setDragging(true)}
        onDragEnd={() => setDragging(false)}
      >
        {[...images, ...images].map((f, i) => (
          <motion.img
            key={i}
            src={f.src}
            alt={f.alt}
            loading="lazy"
            className="w-[250px] h-[330px] object-cover rounded-lg shrink-0"
            whileTap={{ scale: 0.95 }}
            draggable={false}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ---------------- LETRAS ---------------- */
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
Key hoy no fue a la escuela

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

/* ---------------- PAGE ---------------- */
function SeguimePage() {
  const [openPlayer, setOpenPlayer] = useState<number | null>(null);
  const [showLyrics, setShowLyrics] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // 🖼️ ESTADOS PARA VISTAS DEDICADAS
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [showFullMusic, setShowFullMusic] = useState(false); // 🎵 NUEVO ESTADO

  // 🔐 ESTADOS DE SEGURIDAD PARA ADMIN
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAdmin(true);
      setShowPinModal(false);
      setPinInput("");
      setPinError("");
    } else {
      setPinError("Clave incorrecta");
    }
  };

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background relative text-white">
      {/* BACKGROUND */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgSeguime})` }}
      />
      <div className="fixed inset-0 bg-black/70" />

      {/* NAV */}
      <div className="relative z-10 px-6 py-6 max-w-5xl mx-auto flex justify-between items-center">
        {showFullGallery || showFullMusic ? (
          <button
            onClick={() => {
              setShowFullGallery(false);
              setShowFullMusic(false);
            }}
            className="flex items-center gap-2 text-white hover:text-white/80 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a la página principal
          </button>
        ) : (
          <Link to="/" className="flex items-center gap-2 text-white">
            <ArrowLeft className="w-5 h-5" />
            Volver
          </Link>
        )}

        {/* Acceso Admin Discreto */}
        {!isAdmin && (
          <button
            onClick={() => setShowPinModal(true)}
            className="text-xs text-white/30 hover:text-white/70 transition"
          >
            Acceso Admin
          </button>
        )}
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-20 space-y-14">
        {showFullGallery ? (
          /* 📸 VISTA DEDICADA A LA GALERÍA COMPLETA */
          <Card>
            <ClimaGalleryGrid key={refreshKey} />
          </Card>
        ) : showFullMusic ? (
          /* 🎵 VISTA DEDICADA A LA BIBLIOTECA MUSICAL */
          <Card>
            <ClimaMusicLibrary key={refreshKey} />
          </Card>
        ) : (
          /* VISTA PRINCIPAL REGULAR */
          <>
            {/* SOCIALCARD */}
            <div className="flex justify-center w-full">
              <SocialCard
                title="Seguinos en"
                subtitle="@climamusica"
                url="https://www.instagram.com/climamusica/"
                icon={<Instagram className="w-8 h-8 text-white" />}
              />
            </div>

            {/* CAROUSEL (Imágenes locales) */}
            <AutoCarousel images={fotos} speed={60} />

            {/* TEMAS */}
            <section className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-bold">Disponibles en Streaming</h2>

              {temas.map((tema, i) => (
                <div
                  key={i}
                  className="border border-white/10 rounded-lg p-4 bg-black/20"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{tema.name}</span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setOpenPlayer(openPlayer === i ? null : i)
                        }
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                      >
                        <Youtube className="w-5 h-5" />
                      </button>

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

                  <AnimatePresence>
                    {openPlayer === i && (
                      <motion.div
                        key="video"
                        variants={fadeVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.4 }}
                        className="mt-4"
                      >
                        <iframe
                          className="w-full aspect-video rounded-lg"
                          src={`https://www.youtube.com/embed/${getYoutubeId(
                            tema.youtube
                          )}?autoplay=1`}
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {showLyrics === i && (
                      <motion.div
                        key="lyrics"
                        variants={fadeVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.6 }}
                        className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10 whitespace-pre-line text-sm leading-relaxed text-center"
                      >
                        {letras[tema.letra]}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </section>

            {/* 📸 PREVIEW DE FOTOS RECIENTES + BOTÓN */}
            <ClimaGalleryPreview
              key={refreshKey}
              onOpenFullGallery={() => setShowFullGallery(true)}
            />

            {/* 🎵 BOTÓN / ACCESO RÁPIDO A LA BIBLIOTECA MUSICAL */}
            <div className="w-full max-w-6xl mx-auto p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest mb-1">
                  <Disc className="w-4 h-4 text-white animate-spin" />
                  Canciones de estudio y en vivo
                </div>
                <h2 className="text-2xl font-bold text-white">Canciones</h2>
              </div>

              <button
                onClick={() => setShowFullMusic(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition shadow-lg text-sm"
              >
                <span>Ver Biblioteca</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* INFO */}
            <InfoSection />            

            {/* NOVEDADES */}
            <Card title="Novedades">
              <Novedades isAdmin={isAdmin} />
            </Card>

            {/* CARD BIO */}
            <Card title="Historia">
              <Biografia />
            </Card>
          </>
        )}

        {/* 🔒 PANEL DE ADMINISTRACIÓN (SOLO VISIBLE SI ESTÁS LOGUEADO) */}
        {isAdmin && (
          <Card title="Panel de Administración">
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setIsAdmin(false)}
                  className="text-xs text-red-400 hover:text-red-300 underline"
                >
                  Cerrar Sesión Admin
                </button>
              </div>
              
              {/* Panel de Fotos */}
              <ClimaAdminGallery onUploadSuccess={handleUploadSuccess} />

              {/* Panel de Audio (NUEVO) */}
              <ClimaAdminAudio onUploadSuccess={handleUploadSuccess} />
            </div>
          </Card>
        )}

        {/* FOOTER */}
        <Card>
          <Footer />
        </Card>
      </div>

      {/* 🔑 MODAL PARA INGRESAR PIN */}
      {showPinModal && (
        <div 
          onClick={() => setShowPinModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 border border-white/10 p-6 rounded-xl max-w-xs w-full space-y-4 text-white"
          >
            <h3 className="text-lg font-bold text-center">Acceso Administrador</h3>
            <form onSubmit={handleAdminLogin} className="space-y-3">
              <input
                type="password"
                placeholder="Ingresá la clave"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-center text-white focus:outline-none focus:border-white/30"
                autoFocus
              />
              {pinError && <p className="text-xs text-red-400 text-center">{pinError}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="w-1/2 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-semibold"
                >
                  Ingresar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}