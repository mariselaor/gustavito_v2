import express from "express";
import cors from "cors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = 3000;

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuración de multer (para recibir archivos)
const upload = multer({ dest: "uploads/" });

// Permitir CORS
app.use(cors());

// Ruta para subir imagen
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Subir a Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "estudiantes", // Carpeta en Cloudinary
    });

    // Borrar archivo temporal
    fs.unlinkSync(filePath);

    // Devolver URL pública
    res.json({ url: result.secure_url });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al subir la imagen" });
  }
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
