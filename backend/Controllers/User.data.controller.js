import asyncHandler from "express-async-handler";
import fs from "fs";
import path from "path";
import { getMainDataService, editUserDataService } from "../Services/User.data.service.js";
import User from "../Models/user.model.js";
import { validateUpdateUserData } from "../Validators/userData.validate.js";

const getMainData = asyncHandler(async (req, res) => {
    const user = await getMainDataService();
    if (!user) 
    {
        return res.status(404).json({ error: 'User not found' });
    }
    
    let userData = user.get({ plain: true });
        userData.profile = userData.profile 
        ? `${req.protocol}://${req.get('host')}${userData.profile.startsWith('/') ? '' : '/'}${userData.profile}` 
        : null;
        userData.cv = userData.cv 
            ? `${req.protocol}://${req.get('host')}${userData.cv.startsWith('/') ? '' : '/'}${userData.cv}`
            : null;        
    res.status(200).json({
        userData
    });
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const { error } = validateUpdateUserData(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updates = { ...req.body };
    const user = await editUserDataService(process.env.EMAIL, updates , req.file || null);
    if (!user) return res.status(404).json({ message: "User not found or failed to update data" });

    res.status(200).json({ success: true, user });
});

const uploadProfileImage = asyncHandler(async (req, res) => {
    
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const userEmail = process.env.EMAIL;
    const user = await User.findOne({ where: { email: userEmail } });
    
    if (!user) {
        return res.status(404).json({ message: "User not found in database" });
    }

    
    if (user.profile) {
        try {
            const fileName = path.basename(user.profile);
            const oldPath = path.join(process.cwd(), 'backend', 'uploads', fileName);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        } catch (err) {
            return res.status(500).json("Falied to update profile image")
        }
    }

    const relativePath = `/uploads/${req.file.filename}`;
    user.profile = relativePath;

    try {
        await user.save();
        res.status(200).json({ success: true, profileImage: relativePath });
    } catch (dbError) {
        res.status(500).json({ message: "Server saved the file but DB failed", error: dbError.message });
    }
});


export const deleteProfileImage = asyncHandler(async (req, res) => {
    const user = await User.findOne({ where: { email: process.env.EMAIL } });
    
    if (!user || !user.profile) {
        return res.status(404).json({ message: "No profile image found" });
    }
    const imagePath = path.join(process.cwd(),'backend', user.profile);
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
    
    user.profile = null;
    await user.save();

    res.status(200).json({ success: true, message: "Profile image deleted successfully" });
});

export {  getMainData, updateUserProfile, uploadProfileImage };