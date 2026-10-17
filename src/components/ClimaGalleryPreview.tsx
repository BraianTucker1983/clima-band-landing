// src/components/ClimaGalleryPreview.tsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { Images, ArrowRight } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type Photo = {
  id: string;
  title: string;
  image_url: string;
  section: string;
};

interface Props {
  onOpenFullGallery: () => void;
}

export function ClimaGalleryPreview({ onOpenFullGallery }: Props) {
  const [latestPhotos, setLatestPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestPhotos();
  }, []);

  const fetchLatestPhotos = async () => {
    try {
      // Traemos únicamente las últimas 6 fotos para la vista previa
      const { data, error } = await supabase
        .from("clima_photos")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      if (data) setLatestPhotos(data);
    } catch (err) {
      console.error("Error al cargar vista previa:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
  if (latestPhotos.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto my-12 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest mb-1">
            <Images className="w-4 h-4 text-white" />
            Galería de Shows & Coberturas
          </div>
          <h2 className="text-2xl font-bold text-white">Fotos Recientes</h2>
        </div>

        <button
          onClick={onOpenFullGallery}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition shadow-lg text-sm"
        >
          <span>Ver Galería Completa</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grilla compacta de 6 imágenes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {latestPhotos.map((photo) => (
          <motion.div
            key={photo.id}
            whileHover={{ scale: 1.03 }}
            onClick={onOpenFullGallery}
            className="aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10 cursor-pointer relative group"
          >
            <img
              src={photo.image_url}
              alt={photo.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center p-2 text-center">
              <span className="text-[10px] text-white font-medium line-clamp-2">{photo.title}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}