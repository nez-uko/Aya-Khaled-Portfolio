import Experience from "../Models/Experiences.model.js";
import Certificate from "../Models/certificates.model.js";
import fs from "fs";
import path from "path";
import Project from "../Models/projects.model.js";
import { getFullImageUrl } from "../Utils/multer.util.js";

// --- Projects Services ---

const getAllProjectsService = async (req) => {
    const projects= await Project.findAll({ order: [["createdAt", "DESC"]] });
    
    if(projects)
    {
        projects.map((pro)=>{
            pro.projectImage = getFullImageUrl(req, cert.projectImage);
        })
    }
    return projects || null;
};

const getOneProjectService = async (id) => {
    return await Project.findByPk(id);
};

const addProjectService = async (data, file) => {
    let project;
    data.projectImage = `/uploads/${file.filename}`;
    if(data.usedSkills){
        data.usedSkills=JSON.parse(data.usedSkills)
    }else{
        data.usedSkills=[]
    }

    try {
        project= await Project.create(data);
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
        if (project.projectImage) {
            const oldPath = path.join(process.cwd(),'backend', project.projectImage);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        data.projectImage = `/uploads/${file.filename}`;
    }
    return await project.update(data);
};

const deleteProjectService = async (id) => {
    const project = await Project.findByPk(id);
    if (!project) 
        return null;
    
    if (project.projectImage) {
        const imagePath = path.join(process.cwd(),'backend', project.projectImage);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
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
    const certificates= await Certificate.findAll({ order: [["createdAt", "DESC"]] });
    if(certificates)
    {
        certificates.map((cert)=>{
            cert.certificateImage = getFullImageUrl(req, cert.certificateImage);
        })
    }
        console.log(certificates);

    return certificates || null;
};

const addCertificateService = async (data, file) => {
    let certificate;
    if (file) {
        data.certificateImage = `/uploads/${file.filename}`;
    }
    try {
        certificate= await Certificate.create(data);
    } catch (error) {
        return null;
    }
    return certificate;
};

const updateCertificateService = async (id, data, file) => {
    const certificate = await Certificate.findByPk(id);
    if (!certificate) return null;

    if (file) {
        if (certificate.certificateImage) {
            const oldPath = path.join(process.cwd(),'backend', certificate.certificateImage);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        data.certificateImage = `/uploads/${file.filename}`;
    }

    return await certificate.update(data);
};

const deleteCertificateService = async (id) => {
    const certificate = await Certificate.findByPk(id);
    if (!certificate) return null;

    if (certificate.certificateImage) {
        const imagePath = path.join(process.cwd(),'backend', certificate.certificateImage);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
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
