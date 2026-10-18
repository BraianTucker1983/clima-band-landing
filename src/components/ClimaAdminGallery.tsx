// src/components/ClimaAdminGallery.tsx
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { compressImage } from "@/utils/compressImage";
import { Upload, Loader2, CheckCircle2, Trash2 } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type Props = {
  onUploadSuccess?: () => void;
};

type Photo = {
  id: string;
  title: string;
  image_url: string;
  section: string;
};

export function ClimaAdminGallery({ onUploadSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [section, setSection] = useState("Fotos de Septiembre");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [message, setMessage] = useState("");

  // Estados para gestión y eliminación
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPhotos = async () => {
    setLoadingPhotos(true);
    const { data, error } = await supabase
      .from("clima_photos")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      setPhotos(data);
    }
    setLoadingPhotos(false);
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0 || !title || !section) return;

    setLoading(true);
    setMessage("");
    setProgress({ current: 0, total: files.length });

    let successCount = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress({ current: i + 1, total: files.length });

        const compressedWebp = await compressImage(file);
        const fileName = `clima-${Date.now()}-${i}-${compressedWebp.name}`;

        const { error: storageError } = await supabase.storage
          .from("clima-galeria-shows")
          .upload(fileName, compressedWebp);

        if (storageError) continue;

        const { data: publicUrlData } = supabase.storage
          .from("clima-galeria-shows")
          .getPublicUrl(fileName);

        const imageUrl = publicUrlData.publicUrl;
        const photoTitle = files.length > 1 ? `${title} (${i + 1})` : title;

        const { error: dbError } = await supabase
          .from("clima_photos")
          .insert([{ title: photoTitle, image_url: imageUrl, section }]);

        if (dbError) continue;
        successCount++;
      }

      setMessage(`¡${successCount} de ${files.length} fotos subidas con éxito!`);
      setTitle("");
      setFiles([]);
      fetchPhotos();
      if (onUploadSuccess) onUploadSuccess();
    } catch (err: any) {
      console.error(err);
      setMessage(`Error en la subida: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (photo: Photo) => {
    const confirmed = window.confirm(`¿Estás seguro de que querés eliminar la foto "${photo.title}"?`);
    if (!confirmed) return;

    setDeletingId(photo.id);
    try {
      const urlParts = photo.image_url.split("/clima-galeria-shows/");
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from("clima-galeria-shows").remove([filePath]);
      }

      const { error } = await supabase
        .from("clima_photos")
        .delete()
        .eq("id", photo.id);

      if (error) throw error;

      fetchPhotos();
      if (onUploadSuccess) onUploadSuccess();
    } catch (err: any) {
      console.error("Error al eliminar la foto:", err);
      alert("No se pudo eliminar la foto: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-md mx-auto border border-white/10 rounded-xl p-6 bg-black/20 text-white space-y-6">
      <h2 className="text-xl font-bold mb-2 text-center">Administración de Galería</h2>

      {/* FORMULARIO DE SUBIDA */}
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm opacity-70 mb-1">Sección / Categoría</label>
          <input
            type="text"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-white/30"
          />
        </div>

        <div>
          <label className="block text-sm opacity-70 mb-1">Título Base de las Fotos / Evento</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-white/30"
          />
        </div>

        <div>
          <label className="block text-sm opacity-70 mb-1">Imágenes</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            required
            className="w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
          />
          {files.length > 0 && (
            <p className="text-xs text-white/60 mt-1.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
              {files.length} imágenes seleccionadas
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || files.length === 0}
          className="w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center justify-center gap-2 font-semibold disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              Procesando {progress.current} de {progress.total}...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Subir Fotos
            </>
          )}
        </button>

        {message && <p className="text-center text-sm mt-2 text-white/80">{message}</p>}
      </form>

      {/* LISTADO Y GESTIÓN DE ELIMINACIÓN DE FOTOS */}
      <div className="border-t border-white/10 pt-6 space-y-4">
        <h3 className="font-bold text-sm tracking-wide uppercase text-white/80">Fotos Subidas Actualmente</h3>
        {loadingPhotos ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-white/50" />
          </div>
        ) : photos.length === 0 ? (
          <p className="text-xs text-white/40 text-center py-2">No hay fotos cargadas.</p>
        ) : (
          <div className="space-y-2 max-h-52 overflow-y-auto pr-2">
            {photos.map((photo) => (
              <div key={photo.id} className="flex items-center justify-between bg-black/40 border border-white/10 p-2.5 rounded-lg text-sm">
                <div className="flex items-center gap-3 truncate pr-2">
                  <img src={photo.image_url} alt={photo.title} className="w-10 h-10 object-cover rounded shrink-0" />
                  <div className="truncate">
                    <p className="font-semibold truncate">{photo.title}</p>
                    <p className="text-xs text-white/40">{photo.section}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(photo)}
                  disabled={deletingId === photo.id}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition shrink-0 disabled:opacity-50"
                  title="Eliminar foto"
                >
                  {deletingId === photo.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}