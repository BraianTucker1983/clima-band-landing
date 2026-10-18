// src/components/ClimaMusicLibrary.tsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, Play, Pause } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type Track = {
  id: string;
  title: string;
  audio_url: string;
  section: string;
  created_at?: string;
};

export function ClimaMusicLibrary() {
  const [tracksBySection, setTracksBySection] = useState<Record<string, Track[]>>({});
  const [activeSection, setActiveSection] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [activeAudioUrl, setActiveAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      const { data, error } = await supabase
        .from("clima_tracks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const grouped = data.reduce((acc: Record<string, Track[]>, track) => {
          const section = track.section || "General";
          if (!acc[section]) acc[section] = [];
          acc[section].push(track);
          return acc;
        }, {});

        setTracksBySection(grouped);
        const sections = Object.keys(grouped);
        if (sections.length > 0) setActiveSection(sections[0]);
      }
    } catch (err) {
      console.error("Error al cargar biblioteca musical:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10 text-white/60">Cargando biblioteca musical...</div>;

  const sections = Object.keys(tracksBySection);
  if (sections.length === 0) return <div className="text-center py-10 text-white/60">No hay canciones cargadas todavía.</div>;

  const currentTracks = tracksBySection[activeSection] || [];

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start w-full max-w-6xl mx-auto">
      {/* SEPARADORES LATERALES */}
      <div className="w-full md:w-64 flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 shrink-0">
        <div className="text-xs uppercase tracking-wider text-white/40 px-3 pb-1 hidden md:block">
          Categorías / Listas
        </div>
        {sections.map((sectionName) => {
          const isActive = activeSection === sectionName;
          const count = tracksBySection[sectionName].length;

          return (
            <button
              key={sectionName}
              onClick={() => setActiveSection(sectionName)}
              className={`relative text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group whitespace-nowrap md:whitespace-normal ${
                isActive
                  ? "bg-white/15 text-white font-semibold shadow-lg border-l-4 border-white"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border-l-4 border-transparent"
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Disc className={`w-4 h-4 shrink-0 ${isActive ? "text-white animate-spin" : "text-white/40"}`} />
                <span className="truncate">{sectionName}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-white/5 text-white/40"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* LISTA DE PISTAS DE LA SECCIÓN */}
      <div className="flex-1 w-full min-h-[400px]">
        <div className="border-b border-white/10 pb-3 mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white tracking-wide">{activeSection}</h3>
          <span className="text-sm text-white/50">{currentTracks.length} pistas</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {currentTracks.map((track) => {
              const isPlaying = activeAudioUrl === track.audio_url;

              return (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveAudioUrl(isPlaying ? null : track.audio_url)}
                      className="p-3 rounded-full bg-white text-black hover:scale-105 transition shadow-md"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>
                    <div>
                      <h4 className="font-semibold text-white text-sm md:text-base">{track.title}</h4>
                      <span className="text-xs text-white/40">{activeSection}</span>
                    </div>
                  </div>

                  {isPlaying && (
                    <audio
                      src={track.audio_url}
                      controls
                      autoPlay
                      onEnded={() => setActiveAudioUrl(null)}
                      className="h-10 max-w-[200px] md:max-w-xs accent-white"
                    />
                  )}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}