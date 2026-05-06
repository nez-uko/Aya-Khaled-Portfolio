import User from "../Models/user.model.js";
import { uploadToCloudinary } from "../Utils/cloudinary.util.js";
import { v2 as cloudinary } from "cloudinary";

const getMainDataService = async () => {
    let user = await User.findOne({
        attributes: { exclude: ['password', 'role'] }
    });
    return user || null;
};

const editUserDataService = async (userEmail, updateData, cvFile) => {
    const user = await User.findOne({ where: { email: userEmail } });
    if (!user) return null;
    
    if (updateData.skills) {
        updateData.skills = JSON.parse(updateData.skills);
    } else {
        updateData.skills = [];
    }
    
    if (updateData.freelancePlatforms) {
        updateData.freelancePlatforms = JSON.parse(updateData.freelancePlatforms);
    } else {
        updateData.freelancePlatforms = [];
    }
    
    let cvData = user.cv;
    if (cvFile) {
        if (user.cv && user.cv.publicId) {
            try {
                await cloudinary.uploader.destroy(user.cv.publicId);
            } catch (err) {
                console.log("Failed to delete old CV:", err);
            }
        }
        
        const result = await uploadToCloudinary(cvFile.buffer);
        cvData = {
            url: result.url,
            publicId: result.publicId
        };
    }
    
    user.name = updateData.name || user.name;
    user.description = updateData.description || user.description;
    user.linkedIn = updateData.linkedIn || user.linkedIn;
    user.gitHub = updateData.gitHub || user.gitHub;
    user.phoneNumber = updateData.phoneNumber || user.phoneNumber;
    user.city = updateData.city || user.city;
    user.street = updateData.street || user.street;
    user.governorate = updateData.governorate || user.governorate;
    user.skills = updateData.skills || user.skills;
    user.freelancePlatforms = updateData.freelancePlatforms || user.freelancePlatforms;
    user.cv = cvData;
    
    try {
        await user.save();
    } catch (error) {
        return null;
    }
    return user;
};

export {
    getMainDataService,
    editUserDataService
};