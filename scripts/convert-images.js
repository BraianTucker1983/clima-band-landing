import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputDir = "./src/assets";

async function convertImages(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await convertImages(fullPath);
      continue;
    }

    const ext = path.extname(file).toLowerCase();
    const name = path.basename(file, ext);

    if ([".png", ".jpg", ".jpeg"].includes(ext)) {
      const outputPath = path.join(dir, `${name}.webp`);

      try {
        // Convertir imagen
        await sharp(fullPath)
          .resize({ width: 1200, withoutEnlargement: true })
          .webp({ quality: 75 })
          .toFile(outputPath);

        console.log(`✔ Convertido: ${file} → ${name}.webp`);

        // 🔒 Verificación antes de borrar
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(fullPath); // borrar original
          console.log(`🗑 Eliminado: ${file}`);
        } else {
          console.log(`⚠ No se eliminó ${file} (falló conversión)`);
        }

      } catch (error) {
        console.error(`❌ Error con ${file}:`, error.message);
      }
    }
  }
}

convertImages(inputDir);