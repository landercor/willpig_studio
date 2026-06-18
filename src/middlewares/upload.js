import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) { //detecta si es una imagen y el tipo de archivo
        cb(null, true);
    } else {
        cb(new Error('No es una imagen. Por favor, sube una imagen.'), false); //error si no es una imagen
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

export default upload;
