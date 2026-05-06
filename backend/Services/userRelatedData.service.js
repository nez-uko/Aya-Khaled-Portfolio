import Experience from "../Models/Experiences.model.js";
import Certificate from "../Models/certificates.model.js";
import Project from "../Models/projects.model.js";
import { uploadToCloudinary } from "../Utils/cloudinary.util.js";
import { v2 as cloudinary } from "cloudinary";

// --- Projects Services ---

const getAllProjectsService = async (req) => {
    const projects = await Project.findAll({ order: [["createdAt", "DESC"]] });
    
    if (projects) {
        projects.forEach(project => {
            if (project.projectImage && project.projectImage.url) {
                project.projectImage = project.projectImage.url;
            }
        });
    }
    return projects || null;
};

const getOneProjectService = async (id) => {
    const project = await Project.findByPk(id);
    if (project && project.projectImage && project.projectImage.url) {
        project.projectImage = project.projectImage.url;
    }
    return project;
};

const addProjectService = async (data, file) => {
    let project;
    
    if (file) {
        const result = await uploadToCloudinary(file.buffer);
        data.projectImage = {
            url: result.url,
            publicId: result.publicId
        };
    }
    
    if (data.usedSkills) {
        data.usedSkills = JSON.parse(data.usedSkills);
    } else {
        data.usedSkills = [];
    }

    try {
        project = await Project.create(data);
    } catch (error) {
        console.log(error);
        return null;
    }
    return project;
};

const updateProjectService = async (id, data, file) => {
    const project = await Project.findByPk(id);
    if (!project) return null;

    if (file) {
        if (project.projectImage && project.projectImage.publicId) {
            try {
                await cloudinary.uploader.destroy(project.projectImage.publicId);
            } catch (err) {
                console.log("Failed to delete old project image:", err);
            }
        }
        
        const result = await uploadToCloudinary(file.buffer);
        data.projectImage = {
            url: result.url,
            publicId: result.publicId
        };
    }
    
    if (data.usedSkills) {
        data.usedSkills = JSON.parse(data.usedSkills);
    }
    
    return await project.update(data);
};

const deleteProjectService = async (id) => {
    const project = await Project.findByPk(id);
    if (!project) return null;
    
    if (project.projectImage && project.projectImage.publicId) {
        try {
            await cloudinary.uploader.destroy(project.projectImage.publicId);
        } catch (err) {
            console.log("Failed to delete project image from Cloudinary:", err);
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
                cert.certificateImage = cert.certificateImage.url;
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
                console.log("Failed to delete old certificate image:", err);
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
            console.log("Failed to delete certificate image from Cloudinary:", err);
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