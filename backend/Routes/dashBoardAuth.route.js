import { Router } from "express";
import { restrictToPortfolioOwner, verifyToken } from "../Middlewares/jwt.middleware.js";
import { addCertificate, addExperience, addProject, deleteCertificate, deleteExperience, deleteProject, updateCertificate, updateExperience, updateProject } from "../Controllers/userRelatedData.controller.js";
import { upload } from "../Utils/cloudinary.util.js";
import { deleteProfileImage, updateUserProfile, uploadProfileImage } from "../Controllers/User.data.controller.js";

const router = Router();

router.delete("/profile-image", verifyToken, restrictToPortfolioOwner, deleteProfileImage);
router.delete("/certificate/:id", verifyToken, restrictToPortfolioOwner, deleteCertificate);
router.delete("/project/:id", verifyToken, restrictToPortfolioOwner, deleteProject);
router.delete("/experience/:id", verifyToken, restrictToPortfolioOwner, deleteExperience);

router.put("/", verifyToken, restrictToPortfolioOwner, upload.single("cv"), updateUserProfile);
router.post("/profile-image", verifyToken, restrictToPortfolioOwner, upload.single("profileImage"), uploadProfileImage);
router.post("/certificate", verifyToken, restrictToPortfolioOwner, upload.single("certificateImage"), addCertificate);
router.post("/project", verifyToken, restrictToPortfolioOwner, upload.single("projectImage"), addProject);
router.post("/experience", verifyToken, restrictToPortfolioOwner, upload.none(), addExperience);

router.put("/project/:id", verifyToken, restrictToPortfolioOwner, upload.single("projectImage"), updateProject);
router.put("/experience/:id", verifyToken, restrictToPortfolioOwner, upload.none(), updateExperience);
router.put("/certificate/:id", verifyToken, restrictToPortfolioOwner, upload.single("certificateImage"), updateCertificate);

export default router;