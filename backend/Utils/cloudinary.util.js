import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { Readable } from "stream";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET_KEY
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only images and PDF files are allowed!"), false);
    }
};

const upload = multer({ 
    storage: multer.memoryStorage(),
    fileFilter: multerFilter,
    limits: { fileSize: 5 * 1024 * 1024 } 
});

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        
        const isPDF = buffer.toString('hex', 0, 4) === '25504446';
        const resourceType = isPDF ? "raw" : "image";
        
        const stream = cloudinary.uploader.upload_stream(
            { 
                folder: "Ava_Portfolio",
                resource_type: resourceType
            },
            (error, result) => {
                if (error) reject(error);
                else resolve({
                    url: result.secure_url,
                    publicId: result.public_id
                });
            }
        );
        Readable.from(buffer).pipe(stream).on('error', reject);
    });
};

export { upload, uploadToCloudinary };