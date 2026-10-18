// src/components/novedades.tsx
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Calendar, MapPin, Plus, Trash2, History, Ticket, ExternalLink, Image as ImageIcon } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type Show = {
  id: string;
  date: string; // Formato YYYY-MM-DD
  venue: string;
  city: string;
  ticket_link: string;
  map_link?: string;
  flyer_url?: string;
};

interface Props {
  isAdmin?: boolean;
}

const noticiasEstaticas = [
  {
    date: "20 ABR 2026",
    title: "Cuatro temillas nuevos próximamente",
    description: "Terminamos de grabar el bajo y la batería en cuatro canciones nuevas, esperamos lo disfruten tanto como nosotros en este proceso.",
  },
  {
    date: "1 MAR 2026",
    title: "Gira 2026 confirmada",
    description: "Confirmamos las primeras fechas de nuestra gira por Argentina y Uruguay.",
  },
];

// Helper para formatear fecha YYYY-MM-DD a formato legible "25 ABR 2026"
function formatDateLegible(dateString: string) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  const meses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  const numMes = parseInt(month, 10) - 1;
  return `${day} ${meses[numMes] || ""} ${year}`;
}

export function Novedades({ isAdmin = false }: Props) {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para formulario admin
  const [dateInput, setDateInput] = useState("");
  const [venueInput, setVenueInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [ticketInput, setTicketInput] = useState("");
  const [mapInput, setMapInput] = useState("");
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchShows = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("clima_shows")
      .select("*")
      .order("date", { ascending: true });

    if (!error && data) {
      setShows(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchShows();
  }, []);

  const handleAddShow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateInput || !venueInput || !cityInput) return;

    setSubmitting(true);
    try {
      let flyerUrl = "";

      // 1. Si se seleccionó un flyer, subirlo al Storage
      if (flyerFile) {
        const fileExt = flyerFile.name.split(".").pop();
        const fileName = `flyer-${Date.now()}.${fileExt}`;
        const filePath = `flyers/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("clima-galeria-shows")
          .upload(filePath, flyerFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("clima-galeria-shows")
          .getPublicUrl(filePath);

        flyerUrl = publicUrlData.publicUrl;
      }

      // 2. Guardar registro en Supabase
      const { error } = await supabase.from("clima_shows").insert([
        {
          date: dateInput,
          venue: venueInput,
          city: cityInput,
          ticket_link: ticketInput || "#",
          map_link: mapInput || "#",
          flyer_url: flyerUrl || null,
        },
      ]);

      if (error) throw error;

      // Limpiar formulario
      setDateInput("");
      setVenueInput("");
      setCityInput("");
      setTicketInput("");
      setMapInput("");
      setFlyerFile(null);
      fetchShows();
    } catch (err: any) {
      alert("Error agregando el recital: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteShow = async (id: string, venue: string, flyerUrl?: string) => {
    const confirmed = window.confirm(`¿Querés eliminar la fecha en "${venue}"?`);
    if (!confirmed) return;

    try {
      // Opcional: Borrar la imagen del storage si existía
      if (flyerUrl) {
        const urlParts = flyerUrl.split("/clima-galeria-shows/");
        if (urlParts.length > 1) {
          await supabase.storage.from("clima-galeria-shows").remove([urlParts[1]]);
        }
      }

      const { error } = await supabase.from("clima_shows").delete().eq("id", id);
      if (error) throw error;
      fetchShows();
    } catch (err: any) {
      alert("Error eliminando recital: " + err.message);
    }
  };

  // Filtrado de fechas
  const hoy = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const proximasFechas = shows.filter((s) => s.date >= hoy);
  const historialFechas = shows.filter((s) => s.date < hoy).reverse();

  return (
    <div className="space-y-10">
      {/* 🔒 FORMULARIO ADMIN PARA AGREGAR SHOWS */}
      {isAdmin && (
        <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-400" />
            Cargar Nuevo Recital con Flyer
          </h3>
          <form onSubmit={handleAddShow} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/60 mb-1">Fecha</label>
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Lugar / Bar / Evento</label>
              <input
                type="text"
                value={venueInput}
                onChange={(e) => setVenueInput(e.target.value)}
                placeholder="Ej: Tomacco's"
                required
                className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Ciudad / Localidad</label>
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="Ej: Pueblo San José"
                required
                className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Link Entradas (Opcional)</label>
              <input
                type="url"
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                placeholder="https://..."
                className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Dirección / Link de Google Maps (Opcional)</label>
              <input
                type="url"
                value={mapInput}
                onChange={(e) => setMapInput(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Flyer del Recital (Imagen)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFlyerFile(e.target.files ? e.target.files[0] : null)}
                className="w-full text-xs text-white/70 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition text-sm disabled:opacity-50"
              >
                {submitting ? "Subiendo flyer y guardando..." : "Guardar Recital"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 📅 PRÓXIMAS FECHAS */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
          <Calendar className="w-5 h-5 text-primary" />
          Próximas Fechas
        </h2>

        {loading ? (
          <p className="text-sm text-white/50">Cargando fechas...</p>
        ) : proximasFechas.length === 0 ? (
          <p className="text-sm text-white/50 italic bg-black/20 p-4 rounded-lg border border-white/5">
            No hay fechas próximas agendadas por el momento. ¡Pronto más novedades!
          </p>
        ) : (
          <div className="space-y-4">
            {proximasFechas.map((f) => (
              <div
                key={f.id}
                className="border border-white/10 rounded-lg p-4 bg-black/20 flex flex-col gap-4"
              >
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex items-start gap-4">
                    {/* Miniatura del Flyer si existe */}
                    {f.flyer_url && (
                      <a href={f.flyer_url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                        <img
                          src={f.flyer_url}
                          alt={f.venue}
                          className="w-16 h-20 object-cover rounded-lg border border-white/20 hover:opacity-90 transition"
                          title="Ver flyer completo"
                        />
                      </a>
                    )}

                    <div>
                      <span className="text-primary font-bold text-sm block mb-1">
                        {formatDateLegible(f.date)}
                      </span>
                      <p className="font-semibold text-lg">{f.venue}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <p className="text-sm flex items-center gap-1 text-white/70">
                          <MapPin className="w-3.5 h-3.5" />
                          {f.city}
                        </p>

                        {f.map_link && f.map_link !== "#" && (
                          <a
                            href={f.map_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-white/80 hover:text-white flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded transition"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Ver en Mapa
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {f.ticket_link && f.ticket_link !== "#" && (
                      <a
                        href={f.ticket_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-1.5"
                      >
                        <Ticket className="w-4 h-4" />
                        Entradas
                      </a>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteShow(f.id, f.venue, f.flyer_url)}
                        className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition"
                        title="Eliminar recital"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🏛️ HISTORIAL DE RECITALES */}
      {historialFechas.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-white/80">
            <History className="w-4 h-4 text-white/60" />
            Historial de Recitales
          </h2>

          <div className="space-y-2">
            {historialFechas.map((f) => (
              <div
                key={f.id}
                className="border border-white/5 rounded-lg p-3 bg-black/40 flex items-center justify-between text-sm opacity-75 hover:opacity-100 transition flex-wrap gap-2"
              >
                <div className="flex items-center gap-3">
                  <span className="text-white/50 font-mono text-xs whitespace-nowrap">
                    {formatDateLegible(f.date)}
                  </span>
                  <div>
                    <span className="font-medium text-white/90">{f.venue}</span>
                    <span className="text-white/50 text-xs ml-2">({f.city})</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {f.flyer_url && (
                    <a
                      href={f.flyer_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-white/60 hover:text-white flex items-center gap-1"
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> Flyer
                    </a>
                  )}

                  {f.map_link && f.map_link !== "#" && (
                    <a
                      href={f.map_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-white/60 hover:text-white underline"
                    >
                      Mapa
                    </a>
                  )}

                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteShow(f.id, f.venue, f.flyer_url)}
                      className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* NOTICIAS */}
      <section>
        <h2 className="text-xl font-bold mb-4">Noticias</h2>

        <div className="space-y-4">
          {noticiasEstaticas.map((n, i) => (
            <div key={i} className="border border-white/10 rounded-lg p-4 bg-black/20">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                {n.date}
              </span>
              <h3 className="font-bold text-lg mt-2">{n.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{n.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}