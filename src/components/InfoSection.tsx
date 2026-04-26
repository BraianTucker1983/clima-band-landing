import { useState } from "react";
import { ChevronLeft, ChevronRight, Instagram, Music } from "lucide-react";

import imgImanol from "@/assets/imanol.jpg";
import imgJuan from "@/assets/juanmanuel.jpg";
import imgAlan from "@/assets/alan.jpg";
import imgBraian from "@/assets/braian.jpg";

const members = [
  {
    name: "Imanol Insua",
    role: "Compositor · Voz · Guitarra · Saxo",
    photo: imgImanol,
    instagram: "https://www.instagram.com/imanolinsua/",
    spotify: "#",
  },
  {
    name: "Juan Manuel Merkel",
    role: "Guitarra · Voz",
    photo: imgJuan,
    instagram: "https://www.instagram.com/nanomerkel/",
    spotify: "#",
  },
  {
    name: "Alan Tucker",
    role: "Bajo",
    photo: imgAlan,
    instagram: "https://www.instagram.com/alan.tucker.716195/",
    spotify: "#",
  },
  {
    name: "Braian Tucker",
    role: "Batería",
    photo: imgBraian,
    instagram: "https://www.instagram.com/braiantucker/",
    spotify: "#",
  },
];

export function InfoSection() {
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((c) => (c === 0 ? members.length - 1 : c - 1));

  const next = () =>
    setCurrent((c) => (c === members.length - 1 ? 0 : c + 1));

  return (
    <div className="space-y-6">

      <div className="flex items-center gap-4 justify-center">
        <button
          onClick={prev}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <ChevronLeft />
        </button>

        <div className="max-w-sm w-full border border-white/10 rounded-xl overflow-hidden bg-black/20">
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={members[current].photo}
              alt={members[current].name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 text-center">
            <h3 className="text-xl font-bold">
              {members[current].name}
            </h3>

            <p className="text-white/70 text-sm mt-1">
              {members[current].role}
            </p>

            <div className="flex justify-center gap-3 mt-4">
              <a
                href={members[current].instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition"
              >
                <Instagram />
              </a>
            </div>
          </div>
        </div>

        <button
          onClick={next}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <ChevronRight />
        </button>
      </div>

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