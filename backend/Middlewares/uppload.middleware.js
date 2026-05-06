import { upload } from "../Utils/cloudinary.util.js";

const uploadSingleImage = upload.single("image");    
const uploadSingleFile = upload.single("file");      

export { uploadSingleImage, uploadSingleFile };