// src/components/ClimaAdminAudio.tsx
// src/components/ClimaAdminAudio.tsx
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Upload, CheckCircle2, Music, Trash2, Loader2 } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Props {
  onUploadSuccess?: () => void;
}

const capitalizeFirstLetter = (string: string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

type Track = {
  id: string;
  title: string;
  audio_url: string;
  section: string;
};

export function ClimaAdminAudio({ onUploadSuccess }: Props) {
  const [section, setSection] = useState("Shows en Vivo");
  const [baseTitle, setBaseTitle] = useState("");
  const [audioFiles, setAudioFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");
  const [successCount, setSuccessCount] = useState<number | null>(null);

  // Estados para gestión y eliminación
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTracks = async () => {
    setLoadingTracks(true);
    const { data, error } = await supabase
      .from("clima_tracks")
      .select("*")
      .order("id", { ascending: false });
    
    if (!error && data) {
      setTracks(data);
    }
    setLoadingTracks(false);
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFiles || audioFiles.length === 0) return;

    setUploading(true);
    setSuccessCount(null);
    let uploaded = 0;

    try {
      for (let i = 0; i < audioFiles.length; i++) {
        const file = audioFiles[i];
        setProgressMessage(`Subiendo pista ${i + 1} de ${audioFiles.length}...`);

        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `audio/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("clima-audio-tracks")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("clima-audio-tracks")
          .getPublicUrl(filePath);

        const audio_url = publicUrlData.publicUrl;

        const originalName = file.name.replace(/\.[^/.]+$/, "");
        const trackTitle = baseTitle
          ? (audioFiles.length > 1 ? `${baseTitle} (${i + 1})` : baseTitle)
          : capitalizeFirstLetter(originalName);

        const { error: dbError } = await supabase
          .from("clima_tracks")
          .insert([{ title: trackTitle, audio_url, section }]);

        if (dbError) throw dbError;
        uploaded++;
      }

      setSuccessCount(uploaded);
      setAudioFiles(null);
      setBaseTitle("");
      fetchTracks();
      if (onUploadSuccess) onUploadSuccess();
    } catch (err: any) {
      console.error("Error al subir audios:", err);
      setProgressMessage(`Error: ${err.message || "No se pudieron subir las pistas"}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (track: Track) => {
    const confirmed = window.confirm(`¿Estás seguro de que querés eliminar la pista "${track.title}"?`);
    if (!confirmed) return;

    setDeletingId(track.id);
    try {
      // Intentar extraer la ruta del Storage para borrar el archivo físico
      const urlParts = track.audio_url.split("/clima-audio-tracks/");
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from("clima-audio-tracks").remove([filePath]);
      }

      // Borrar de la base de datos
      const { error } = await supabase
        .from("clima_tracks")
        .delete()
        .eq("id", track.id);

      if (error) throw error;

      fetchTracks();
      if (onUploadSuccess) onUploadSuccess();
    } catch (err: any) {
      console.error("Error al eliminar:", err);
      alert("No se pudo eliminar la pista: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-white space-y-8">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <Music className="w-6 h-6 text-white" />
        <h3 className="text-xl font-bold">Administración de Pistas de Audio</h3>
      </div>

      {/* FORMULARIO DE SUBIDA */}
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-white/60 mb-2">
            Sección / Categoría / Show
          </label>
          <input
            type="text"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/30"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-white/60 mb-2">
            Título Base (Opcional - Vacío usa el nombre del archivo)
          </label>
          <input
            type="text"
            value={baseTitle}
            onChange={(e) => setBaseTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/30"
            placeholder="Ej: Ensayo General"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-white/60 mb-2">
            Archivos de Audio (MP3, WAV, WebM)
          </label>
          <input
            type="file"
            accept="audio/*"
            multiple
            onChange={(e) => setAudioFiles(e.target.files)}
            className="w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
          />
        </div>

        <button
          type="submit"
          disabled={uploading || !audioFiles}
          className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Upload className="w-5 h-5" />
          <span>{uploading ? progressMessage : "Subir Pistas"}</span>
        </button>

        {successCount !== null && (
          <div className="flex items-center gap-2 text-green-400 text-sm justify-center">
            <CheckCircle2 className="w-5 h-5" />
            <span>¡{successCount} pistas subidas con éxito!</span>
          </div>
        )}
      </form>

      {/* LISTADO Y GESTIÓN DE ELIMINACIÓN */}
      <div className="border-t border-white/10 pt-6 space-y-4">
        <h4 className="font-bold text-sm tracking-wide uppercase text-white/80">Pistas Subidas Actualmente</h4>
        {loadingTracks ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-white/50" />
          </div>
        ) : tracks.length === 0 ? (
          <p className="text-xs text-white/40 text-center py-2">No hay pistas cargadas en la base de datos.</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {tracks.map((track) => (
              <div key={track.id} className="flex items-center justify-between bg-black/30 border border-white/10 p-3 rounded-lg text-sm">
                <div className="truncate pr-4">
                  <p className="font-semibold truncate">{track.title}</p>
                  <p className="text-xs text-white/40">{track.section}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(track)}
                  disabled={deletingId === track.id}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition shrink-0 disabled:opacity-50"
                  title="Eliminar pista"
                >
                  {deletingId === track.id ? (
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