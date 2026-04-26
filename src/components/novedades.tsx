import { Calendar, MapPin } from "lucide-react";

const fechas = [
  { date: "25 ABR 2026", venue: "Tomacco's", city: "Pueblo San Jose", ticketLink: "#" },
];

const noticias = [
  {
    date: "20 ABR 2026",
    title: "Cuatro temillas nuevos próximamente",
    description: "Terminamos de grabas el bajo y la bateria en cuatro canciones nuevas, espero lo disfruten tanto como nosotros en este proceso.",
  },
  {
    date: "1 MAR 2026",
    title: "Gira 2026 confirmada",
    description: "Confirmamos las primeras fechas de nuestra gira por Argentina y Uruguay.",
  },
];

export function Novedades() {
  return (
    <div className="space-y-10">

      {/* Fechas */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
          <Calendar className="w-5 h-5 text-primary" />
          Próximas Fechas
        </h2>

        <div className="space-y-4">
          {fechas.map((f, i) => (
            <div
              key={i}
              className="border border-white/10 rounded-lg p-4 bg-black/20 flex items-center justify-between flex-wrap gap-4"
            >
              <div className="flex items-center gap-4">
                <span className="text-primary font-bold text-sm whitespace-nowrap">
                  {f.date}
                </span>

                <div>
                  <p className="font-semibold">{f.venue}</p>
                  <p className="text-sm flex items-center gap-1 text-white/70">
                    <MapPin className="w-3.5 h-3.5" />
                    {f.city}
                  </p>
                </div>
              </div>

              <a
                href={f.ticketLink}
                className="px-4 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                Entradas
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Noticias */}
      <section>
        <h2 className="text-xl font-bold mb-4">Noticias</h2>

        <div className="space-y-4">
          {noticias.map((n, i) => (
            <div
              key={i}
              className="border border-white/10 rounded-lg p-4 bg-black/20"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                {n.date}
              </span>

              <h3 className="font-bold text-lg mt-2">
                {n.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-white/70">
                {n.description}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}