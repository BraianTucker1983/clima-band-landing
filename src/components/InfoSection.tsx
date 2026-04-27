import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Instagram,
  Youtube,
} from "lucide-react";

import imgImanol from "@/assets/imanol.jpg";
import imgJuan from "@/assets/juanmanuel.jpg";
import imgAlan from "@/assets/alan.jpg";
import imgBraian from "@/assets/braian.jpg";

// 🔥 Mapeo de íconos
const socialIcons = {
  instagram: Instagram,
  youtube: Youtube,
};

const members = [
  {
    name: "Imanol Insua",
    role: "Compositor · Voz · Guitarra · Saxo",
    photo: imgImanol,
    socials: {
      instagram: "https://www.instagram.com/imanolinsua/",
      youtube: "https://www.youtube.com/@imanolinsua", 
    },
  },
  {
    name: "Juan Manuel Merkel",
    role: "Guitarra · Voz",
    photo: imgJuan,
    socials: {
      instagram: "https://www.instagram.com/nanomerkel/",      
    },
  },
  {
    name: "Alan Tucker",
    role: "Bajo",
    photo: imgAlan,
    socials: {
      instagram: "https://www.instagram.com/alan.tucker.716195/",
    },
  },
  {
    name: "Braian Tucker",
    role: "Batería",
    photo: imgBraian,
    socials: {
      instagram: "https://www.instagram.com/braiantucker/",
    },
  },
];

export function InfoSection() {
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((c) => (c === 0 ? members.length - 1 : c - 1));

  const next = () =>
    setCurrent((c) => (c === members.length - 1 ? 0 : c + 1));

  const currentMember = members[current];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 justify-center">
        {/* Botón anterior */}
        <button
          onClick={prev}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <ChevronLeft />
        </button>

        {/* Card */}
        <div className="max-w-sm w-full border border-white/10 rounded-xl overflow-hidden bg-black/20">
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={currentMember.photo}
              alt={currentMember.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 text-center">
            <h3 className="text-xl font-bold">
              {currentMember.name}
            </h3>

            <p className="text-white/70 text-sm mt-1">
              {currentMember.role}
            </p>

            {/* 🔥 Redes dinámicas */}
            <div className="flex justify-center gap-4 mt-4">
              {Object.entries(currentMember.socials).map(
                ([key, url]) => {
                  const Icon = socialIcons[key as keyof typeof socialIcons];
                  if (!Icon) return null;

                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={key} // 👈 tooltip simple
                      className="text-white/70 hover:text-white hover:scale-110 transition"
                    >
                      <Icon size={22} />
                    </a>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Botón siguiente */}
        <button
          onClick={next}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Indicadores */}
      <div className="flex justify-center gap-2">
        {members.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current
                ? "bg-white w-6"
                : "bg-white/30 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
}