const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');

// Configuración de Multer para almacenamiento en memoria
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Tamaño máximo de 5 MB
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no permitido'));
        }
    },
});

// Función para validar y convertir una imagen
async function validateAndConvertImage(file, dimension, category) {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (file && validTypes.includes(file.mimetype)) {
        if (file.size > 2097152) { // 2MB
            throw new Error('El tamaño de la imagen debe ser menor a 2MB');
        }

        try {
            const image = sharp(file.buffer);
            const metadata = await image.metadata();
            // Se utiliza la categoría para definir la ruta
            const categoryFolder = path.join(__dirname, '..', 'images', category);
            if (!fs.existsSync(categoryFolder)) {
                fs.mkdirSync(categoryFolder, { recursive: true });
            }

            if (metadata.width === dimension.width && metadata.height === dimension.height && metadata.format === 'webp') {
                const filename = `${Date.now()}.webp`;
                const outputPath = path.join(categoryFolder, filename);
                await fs.promises.writeFile(outputPath, file.buffer);
                return filename;
            }

            const filename = `${Date.now()}.webp`;
            const outputPath = path.join(categoryFolder, filename);
            await image
                .resize(dimension.width, dimension.height, { fit: sharp.fit.cover })
                .toFormat('webp', { quality: 80 })
                .toFile(outputPath);

            return filename;
        } catch (error) {
            throw new Error('Error al procesar la imagen');
        }
    } else {
        throw new Error('El tipo de imagen debe ser jpg, avif, webp o png');
    }
}

// Función para guardar un archivo
function saveFile(file, destinationPath) {
    if (!file) throw new Error('Archivo no válido');
    try {
        const filePath = path.join(destinationPath, file.filename);
        fs.renameSync(file.path, filePath);
        return file.filename;
    } catch (error) {
        throw new Error('Error al mover el archivo');
    }
}

// Función para borrar un archivo
function deleteFile(destinationPath, filename) {
    try {
        const filePath = path.join(destinationPath, filename);
        fs.unlinkSync(filePath);
        return true;
    } catch (error) {
        throw new Error('Error al eliminar el archivo');
    }
}

function changeFile(file, destinationPath, oldFilename) {
    if (!saveFile(file, destinationPath)) {
        return false;
    }
    return deleteFile(destinationPath, oldFilename);
}

// Función para validar archivos PDF o DOCX
function validateDocument(file, maxSizeMB) {
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
        throw new Error(`El tamaño del archivo debe ser menor a ${maxSizeMB}MB`);
    }

    const fileType = mime.lookup(file.originalname);
    if (fileType === 'application/pdf' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return true;
    } else {
        throw new Error('El archivo debe ser de tipo PDF o DOCX');
    }
}

// Middleware que usa multer
function fileUpload(req, res, next) {
    console.log('--- Middleware fileUpload activado ---');
    upload.single('file')(req, res, (err) => {
        console.log('Archivo recibido:', req.file);
        console.log('Cuerpo recibido:', req.body);

        if (err) {
            console.error('Error en fileUpload:', err.message);
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}


module.exports = {
    fileUpload,
    validateAndConvertImage,
    saveFile,
    deleteFile,
    changeFile,
    validateDocument,
};
