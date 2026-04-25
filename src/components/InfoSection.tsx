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

  const prev = () => setCurrent((c) => (c === 0 ? members.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === members.length - 1 ? 0 : c + 1));

  return (
    <section id="info" className="mb-16">      

      <div className="flex items-center gap-4 justify-center">
        <button onClick={prev} className="p-3 rounded-full bg-secondary hover:bg-primary/20">
          <ChevronLeft />
        </button>

        <div className="member-card max-w-sm w-full">
          <div className="aspect-[3/4] bg-secondary overflow-hidden">
            <img
              src={members[current].photo}
              alt={members[current].name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 text-center">
            <h3 className="text-xl font-bold">{members[current].name}</h3>
            <p className="text-primary text-sm mt-1">{members[current].role}</p>

            <div className="flex justify-center gap-3 mt-4">
              <a href={members[current].instagram} target="_blank">
                <Instagram />
              </a>
              <a href={members[current].spotify} target="_blank">
                <Music />
              </a>
            </div>
          </div>
        </div>

        <button onClick={next} className="p-3 rounded-full bg-secondary hover:bg-primary/20">
          <ChevronRight />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {members.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full ${
              i === current ? "bg-primary w-6" : "bg-secondary"
            }`}
          />
        ))}
      </div>
    </section>
  );
}