import Experience from "../Models/Experiences.model.js";
import Certificate from "../Models/certificates.model.js";
import Project from "../Models/projects.model.js";
import { uploadToCloudinary } from "../Utils/cloudinary.util.js";
import { v2 as cloudinary } from "cloudinary";

// --- Projects Services ---

const getAllProjectsService = async (req) => {
    const projects = await Project.findAll({ order: [["createdAt", "DESC"]] });
    
    if (projects) {
        return projects.map(project => project.toJSON());
    }
    return null;
};

const getOneProjectService = async (id) => {
    const project = await Project.findByPk(id);
    if (project) {
        return project.toJSON(); 
    }
    return null;
};

const addProjectService = async (data, files) => {
    let project;
    
    if (files && files.length > 0) {
        try {
            const uploadPromises = files.map(file => uploadToCloudinary(file.buffer));
            const uploadResults = await Promise.all(uploadPromises);
            
            data.projectImages = uploadResults.map(result => ({
                url: result.url,
                publicId: result.publicId 
            }));
        } catch (uploadError) {
            console.error("Cloudinary Upload Error:", uploadError);
            return null; 
        }
    } else {
        data.projectImages = []; 
    }
    
    if (data.usedSkills) {
        data.usedSkills = JSON.parse(data.usedSkills);
    } else {
        data.usedSkills = [];
    }

    try {
        project = await Project.create(data);
    } catch (error) {
        return null;
    }
    return project;
};

const updateProjectService = async (id, data, files) => {
    const project = await Project.findByPk(id);
    if (!project) return null;


    let finalImages = [];

    if (data.remainingImages) {
        finalImages = typeof data.remainingImages === 'string' 
            ? JSON.parse(data.remainingImages) 
            : data.remainingImages;
    } else {
        finalImages = [];
    }

    const deletedImages = project.projectImages.filter(oldImg => 
        !finalImages.some(remImg => remImg.publicId === oldImg.publicId)
    );

    if (deletedImages.length > 0) {
        const deletePromises = deletedImages.map(img => 
            cloudinary.v2.uploader.destroy(img.publicId).catch(e => console.log("Cloudinary destroy error:", e))
        );
        await Promise.all(deletePromises); 
    }

    if (files && files.length > 0) {
        try {
            const uploadPromises = files.map(file => uploadToCloudinary(file.buffer));
            const uploadResults = await Promise.all(uploadPromises);
            
            const newImages = uploadResults.map(result => ({
                url: result.url,
                publicId: result.publicId
            }));

            finalImages = [...finalImages, ...newImages];
        } catch (uploadError) {
            console.error("Cloudinary Upload Error during update:", uploadError);
            return null;
        }
    }

    data.projectImages = finalImages;
    
    if (data.usedSkills) {
        data.usedSkills = JSON.parse(data.usedSkills);
    }
    
    return await project.update(data);
};

const deleteProjectService = async (id) => {
    const project = await Project.findByPk(id);
    if (!project) return null;
    
    if (project.projectImages && project.projectImages.length > 0) {
        try {
            const deletePromises = project.projectImages.map(img => {
                if (img.publicId) {
                    return cloudinary.v2.uploader.destroy(img.publicId);
                }
            });
            
            await Promise.all(deletePromises);
        } catch (err) {
            console.error("Cloudinary Delete Error during project deletion:", err);
        }
    }
    
    await project.destroy();
    return true;
};

// --- Experience Services ---

const getAllExperiencesService = async () => {
    return await Experience.findAll({ order: [["createdAt", "DESC"]] });
};

const addExperienceService = async (data) => {
    return await Experience.create(data);
};

const updateExperienceService = async (id, data) => {
    const experience = await Experience.findByPk(id);
    if (!experience) return null;
    return await experience.update(data);
};

const deleteExperienceService = async (id) => {
    const experience = await Experience.findByPk(id);
    if (!experience) return null;
    return await experience.destroy();
};

// --- Certificate Services ---

const getAllCertificatesService = async (req) => {
    const certificates = await Certificate.findAll({ order: [["createdAt", "DESC"]] });
    
    if (certificates) {
        certificates.forEach(cert => {
            if (cert.certificateImage && cert.certificateImage.url) {
                if (!cert.certificateImage.url.startsWith('http')) {
                    const baseUrl = `${req.protocol}://${req.get('host')}`;
                    cert.certificateImage.url = `${baseUrl}${cert.certificateImage.url}`;
                }
            }
        });
    }
    return certificates || null;
};

const addCertificateService = async (data, file) => {
    let certificate;
    if (file) {
        const result = await uploadToCloudinary(file.buffer);
        data.certificateImage = {
            url: result.url,
            publicId: result.publicId
        };
    }
    try {
        certificate = await Certificate.create(data);
    } catch (error) {
        return null;
    }
    return certificate;
};

const updateCertificateService = async (id, data, file) => {
    const certificate = await Certificate.findByPk(id);
    if (!certificate) return null;

    if (file) {
        if (certificate.certificateImage && certificate.certificateImage.publicId) {
            try {
                await cloudinary.uploader.destroy(certificate.certificateImage.publicId);
            } catch (err) {
                return null;
            }
        }
        
        const result = await uploadToCloudinary(file.buffer);
        data.certificateImage = {
            url: result.url,
            publicId: result.publicId
        };
    }

    return await certificate.update(data);
};

const deleteCertificateService = async (id) => {
    const certificate = await Certificate.findByPk(id);
    if (!certificate) return null;

    if (certificate.certificateImage && certificate.certificateImage.publicId) {
        try {
            await cloudinary.uploader.destroy(certificate.certificateImage.publicId);
        } catch (err) {
            return null;
        }
    }

    return await certificate.destroy();
};

export {
    getAllProjectsService,
    getOneProjectService,
    addProjectService,
    updateProjectService,
    deleteProjectService,
    getAllExperiencesService,
    addExperienceService,
    updateExperienceService,
    deleteExperienceService,
    getAllCertificatesService,
    addCertificateService,
    updateCertificateService,
    deleteCertificateService,
};