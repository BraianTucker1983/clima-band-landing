import { createFileRoute, Link } from "@tanstack/react-router";
import loboImg from "@/assets/lobo.png";
import fronteraImg from "@/assets/frontera.png";

export const Route = createFileRoute("/letras/$tema")({
  component: LetraPage,
});

const letrasData = {
  lobo: {
    titulo: "El Lobo Invisible",
    portada: loboImg,
    letra: `

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
un lobo invisible...`,
  },
  frontera: {
    titulo: "Frontera",
    portada: fronteraImg,
    letra: `

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
Tras la frontera`,
  },
};

function LetraPage() {
  const { tema } = Route.useParams();

  const data = letrasData[tema as keyof typeof letrasData];

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Tema no encontrado
      </div>
    );
  }

  return (
    <div className="min-h-screen relative text-white">
      
      {/* Fondo */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${data.portada})` }}
      />

      {/* Overlay oscuro */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Contenido */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12 text-center">
        
        <Link
          to="/seguime"
          className="text-sm opacity-70 hover:opacity-100 transition"
        >
          ← Volver
        </Link>

        <h1 className="text-3xl font-bold mt-6 mb-6">
          {data.titulo}
        </h1>

        <pre className="whitespace-pre-wrap leading-relaxed text-sm">
          {data.letra}
        </pre>
      </div>
    </div>
  );
}