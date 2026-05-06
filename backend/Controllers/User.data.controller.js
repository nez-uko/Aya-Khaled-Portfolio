import asyncHandler from "express-async-handler";
import fs from "fs";
import path from "path";
import { getMainDataService, editUserDataService } from "../Services/User.data.service.js";
import User from "../Models/user.model.js";
import { validateUpdateUserData } from "../Validators/userData.validate.js";
import { uploadToCloudinary } from "../Utils/cloudinary.util.js";
import { v2 as cloudinary } from "cloudinary";

const getMainData = asyncHandler(async (req, res) => {
    const user = await getMainDataService();
    if (!user) 
    {
        return res.status(404).json({ error: 'User not found' });
    }
    
    let userData = user.get({ plain: true });
    if (userData.profile && userData.profile.url) {
        userData.profile = userData.profile.url;
    }
    if (userData.cv && userData.cv.url) {
        userData.cv = userData.cv.url;
    }
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

    if (user.profile && user.profile.publicId) {
        try {
            await cloudinary.uploader.destroy(user.profile.publicId);
        } catch (err) {
            console.log("Failed to delete old profile image:", err);
        }
    }

    const result = await uploadToCloudinary(req.file.buffer);
    user.profile = {
        url: result.url,
        publicId: result.publicId
    };

    try {
        await user.save();
        res.status(200).json({ success: true, profileImage: result.url });
    } catch (dbError) {
        res.status(500).json({ message: "Image uploaded but DB failed", error: dbError.message });
    }
});


export const deleteProfileImage = asyncHandler(async (req, res) => {
    const user = await User.findOne({ where: { email: process.env.EMAIL } });
    
    if (!user || !user.profile) {
        return res.status(404).json({ message: "No profile image found" });
    }
    
    if (user.profile.publicId) {
        try {
            await cloudinary.uploader.destroy(user.profile.publicId);
        } catch (err) {
            console.log("Failed to delete from Cloudinary:", err);
        }
    }
    
    user.profile = null;
    await user.save();

    res.status(200).json({ success: true, message: "Profile image deleted successfully" });
});

export {  getMainData, updateUserProfile, uploadProfileImage };