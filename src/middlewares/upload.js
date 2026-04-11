import multer from 'multer';

// Configure storage (Memory storage is best for serverless/Supabase uploads)
const storage = multer.memoryStorage();

// File filter (Optional but recommended)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('No es una imagen. Por favor, sube una imagen.'), false);
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
