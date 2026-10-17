// src/components/ClimaGalleryGrid.tsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { X, FolderOpen } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type Photo = {
  id: string;
  title: string;
  image_url: string;
  section: string;
  created_at?: string;
};

export function ClimaGalleryGrid() {
  const [photosBySection, setPhotosBySection] = useState<Record<string, Photo[]>>({});
  const [activeSection, setActiveSection] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from("clima_photos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Agrupamos las fotos por su sección
        const grouped = data.reduce((acc: Record<string, Photo[]>, photo) => {
          const section = photo.section || "General";
          if (!acc[section]) {
            acc[section] = [];
          }
          acc[section].push(photo);
          return acc;
        }, {});

        setPhotosBySection(grouped);
        
        // Seleccionamos por defecto la primera sección disponible
        const sections = Object.keys(grouped);
        if (sections.length > 0) {
          setActiveSection(sections[0]);
        }
      }
    } catch (err) {
      console.error("Error al cargar galería:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-white/60">Cargando galería...</div>;
  }

  const sections = Object.keys(photosBySection);

  if (sections.length === 0) {
    return <div className="text-center py-10 text-white/60">No hay fotos en la galería todavía.</div>;
  }

  const currentPhotos = photosBySection[activeSection] || [];

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start w-full max-w-6xl mx-auto">
      {/* PESTAÑAS / SEPARADORES LATERALES (IZQUIERDA) */}
      <div className="w-full md:w-64 flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 shrink-0">
        <div className="text-xs uppercase tracking-wider text-white/40 px-3 pb-1 hidden md:block">
          Secciones / Shows
        </div>
        {sections.map((sectionName) => {
          const isActive = activeSection === sectionName;
          const count = photosBySection[sectionName].length;

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
                <FolderOpen className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-white/40"}`} />
                <span className="truncate">{sectionName}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-white/5 text-white/40"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* GRILLA DE FOTOS DE LA SECCIÓN ACTIVA (DERECHA) */}
      <div className="flex-1 w-full min-h-[400px]">
        <div className="border-b border-white/10 pb-3 mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white tracking-wide">{activeSection}</h3>
          <span className="text-sm text-white/50">{currentPhotos.length} fotos</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          >
            {currentPhotos.map((photo) => (
              <motion.div
                key={photo.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedImage(photo)}
                className="relative aspect-square overflow-hidden rounded-xl bg-white/5 cursor-pointer border border-white/10 shadow-md group"
              >
                <img
                  src={photo.image_url}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                  <p className="text-xs text-white font-medium truncate">{photo.title}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* LIGHTBOX / MODAL DE IMAGEN AMPLIADA */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-10 right-0 p-2 text-white/80 hover:text-white bg-white/10 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title}
                className="max-h-[75vh] w-auto object-contain rounded-lg border border-white/10 shadow-2xl"
              />
              <p className="text-white font-semibold mt-4 text-center text-lg">{selectedImage.title}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}