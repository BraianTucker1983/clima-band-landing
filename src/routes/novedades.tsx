import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";

export const Route = createFileRoute("/novedades")({
  head: () => ({
    meta: [
      { title: "Novedades — CLIMA" },
      { name: "description", content: "Próximas fechas y noticias de CLIMA." },
      { property: "og:title", content: "Novedades — CLIMA" },
      { property: "og:description", content: "Próximas fechas y noticias de CLIMA." },
    ],
  }),
  component: NovedadesPage,
});

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

function NovedadesPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[600px] h-[400px] opacity-10 blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--glow-violet) 0%, transparent 70%)" }}
      />

      {/* Header */}
      <div className="relative z-10 px-6 py-6 max-w-4xl mx-auto">
        <Link to="/info" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Volver a Info</span>
        </Link>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-16">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text text-center mb-16">Novedades</h1>

        {/* Fechas */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary" />
            Próximas Fechas
          </h2>
          <div className="space-y-4">
            {fechas.map((f, i) => (
              <div key={i} className="news-card flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-primary font-bold text-sm whitespace-nowrap">{f.date}</span>
                  <div>
                    <p className="text-foreground font-semibold">{f.venue}</p>
                    <p className="text-muted-foreground text-sm flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {f.city}
                    </p>
                  </div>
                </div>
                <a
                  href={f.ticketLink}
                  className="glow-button !py-2 !px-5 !text-sm no-underline"
                >
                  Entradas
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Noticias */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Noticias</h2>
          <div className="space-y-4">
            {noticias.map((n, i) => (
              <div key={i} className="news-card">
                <span className="text-accent text-xs font-semibold uppercase tracking-wider">{n.date}</span>
                <h3 className="text-foreground font-bold text-lg mt-2">{n.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{n.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
