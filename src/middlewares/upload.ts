import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(__dirname, '../../uploads/perfiles');

// Crea la carpeta si no existe
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const id = req.params.id;
        const ext = path.extname(file.originalname) || '.jpg';
        cb(null, `usuario_${id}_${Date.now()}${ext}`);
    },
});

export const upload = multer({ storage });