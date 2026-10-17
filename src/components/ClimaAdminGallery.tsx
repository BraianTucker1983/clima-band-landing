// src/components/ClimaAdminGallery.tsx
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { compressImage } from "@/utils/compressImage";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type Props = {
  onUploadSuccess?: () => void;
};

export function ClimaAdminGallery({ onUploadSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [section, setSection] = useState("Fotos de Septiembre");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [message, setMessage] = useState("");

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

        // 1. Comprimir a WebP
        const compressedWebp = await compressImage(file);
        const fileName = `clima-${Date.now()}-${i}-${compressedWebp.name}`;

        // 2. Subir a Storage
        const { error: storageError } = await supabase.storage
          .from("clima-galeria-shows")
          .upload(fileName, compressedWebp);

        if (storageError) {
          console.error(`Error subiendo ${file.name}:`, storageError);
          continue;
        }

        // 3. Obtener URL pública
        const { data: publicUrlData } = supabase.storage
          .from("clima-galeria-shows")
          .getPublicUrl(fileName);

        const imageUrl = publicUrlData.publicUrl;

        // 4. Si son varias fotos, agregamos un número al título (o mantenemos el mismo título base)
        const photoTitle = files.length > 1 ? `${title} (${i + 1})` : title;

        // 5. Guardar registro en Supabase
        const { error: dbError } = await supabase
          .from("clima_photos")
          .insert([{ title: photoTitle, image_url: imageUrl, section }]);

        if (dbError) {
          console.error(`Error registrando ${file.name}:`, dbError);
          continue;
        }

        successCount++;
      }

      setMessage(`¡${successCount} de ${files.length} fotos subidas con éxito!`);
      setTitle("");
      setFiles([]);

      if (onUploadSuccess) onUploadSuccess();
    } catch (err: any) {
      console.error(err);
      setMessage(`Error en la subida: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto border border-white/10 rounded-xl p-6 bg-black/20 text-white">
      <h2 className="text-xl font-bold mb-4 text-center">Subir Fotos en Lote - Clima</h2>

      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm opacity-70 mb-1">Sección / Categoría</label>
          <input
            type="text"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-white/30"
            placeholder="Ej: Fotos de Septiembre"
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
            placeholder="Ej: Show Tomacco's"
          />
        </div>

        <div>
          <label className="block text-sm opacity-70 mb-1">Imágenes (Podés seleccionar varias)</label>
          <input
            type="file"
            accept="image/*"
            multiple // 👈 Permite selección múltiple
            onChange={handleFileChange}
            required
            className="w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
          />
          {files.length > 0 && (
            <p className="text-xs text-white/60 mt-1.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
              {files.length} {files.length === 1 ? "imagen seleccionada" : "imágenes seleccionadas"}
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
              Subir {files.length > 0 ? `${files.length} Fotos` : "Fotos"}
            </>
          )}
        </button>

        {message && <p className="text-center text-sm mt-2 text-white/80">{message}</p>}
      </form>
    </div>
  );
}