import { log } from "console";
import User from "../Models/user.model.js";

const getMainDataService = async () => {
    let user = await User.findOne({
        attributes: { exclude: ['password', 'role'] }
    });
    return user || null;
};

const editUserDataService = async (userEmail, updateData, cv ) => {
    const user = await User.findOne({ where: { email: userEmail } });
    if (!user) return null;
    if(updateData.skills){
        updateData.skills=JSON.parse(updateData.skills)
    }else{
        updateData.skills=[]
    }
    if(updateData.freelancePlatforms){
        updateData.freelancePlatforms=JSON.parse(updateData.freelancePlatforms)
    }else{
        updateData.freelancePlatforms=[]
    }
    let relativePath='';
    if(cv){
        if (user.cv) {
        try {
            const fileName = path.basename(user.cv);
            const oldPath = path.join(process.cwd(), 'backend', 'uploads', fileName);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        } catch (err) {            
            return res.status(500).json("Falied to update Cv")
        }
    }
        relativePath = `/uploads/${cv.filename}`;
    }
        user.name=updateData.name || user.name;
        user.description=updateData.description || user.description;
        user.linkedIn=updateData.linkedIn || user.linkedIn;
        user.gitHub=updateData.gitHub || user.gitHub;
        user.phoneNumber=updateData.phoneNumber || user.phoneNumber;
        user.city=updateData.city || user.city;
        user.street=updateData.street || user.street;
        user.governorate=updateData.governorate || user.governorate;
        user.skills=updateData.skills || user.skills;
        user.freelancePlatforms=updateData.freelancePlatforms || user.freelancePlatforms;
        user.cv=relativePath || user.cv
    
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