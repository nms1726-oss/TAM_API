import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Carpeta donde Escritorio almacenará las imágenes
const PHP_DESKTOP = 'C:/TAM-Escritorio/www';

const uploadDir = path.join(
    PHP_DESKTOP,
    'imagenes',
    'productos'
);

// Crear la carpeta si no existe
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },

    filename: (_req, file, cb) => {
        cb(null, file.originalname);
    }
});

export const uploadProductos = multer({
    storage
});