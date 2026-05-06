import asyncHandler from "express-async-handler";
import {
    validateCertificateData,
    validateExperienceData,
    validateProjectData,
    validateUpdateExperienceData,
    validateUpdateProjectData,
} from "../Validators/userData.validate.js";
import { fn, col, Op, Sequelize } from 'sequelize';
import {
    addCertificateService,
    addExperienceService,
    addProjectService,
    deleteCertificateService,
    deleteExperienceService,
    deleteProjectService,
    getAllCertificatesService,
    getAllExperiencesService,
    getAllProjectsService,
    getOneProjectService,
    updateProjectService,
    updateExperienceService,
    updateCertificateService,
} from "../Services/userRelatedData.service.js";
import Project from "../Models/projects.model.js";
import Certificate from "../Models/certificates.model.js";

// --- GET ALL ---
const getAllProjects = asyncHandler(async (req, res) => {
    const projects = await getAllProjectsService(req);

    if (!projects || projects.length === 0)
        return res.status(200).json({ 
            message: "No Projects Added Yet",
            projects : []
        });

    return res.status(200).json({
        message: "All Projects retrieved successfully",
        projects,
    });
});

const getAllExperiences = asyncHandler(async (req, res) => {
    const experiences = await getAllExperiencesService();
    if (!experiences || experiences.length === 0)
        return res.status(200).json({ 
            message: "No Experiences Added Yet",
            experiences : []
        });
    return res.status(200).json({
        message: "All Experiences retrieved successfully",
        experiences,
    });
});

const getAllCertificates = asyncHandler(async (req, res) => {
    const certificates = await getAllCertificatesService(req);
    if (!certificates || certificates.length === 0)
        return res.status(200).json({ 
            message: "No certificates Added Yet",
            certificates : []
        });
    return res.status(200).json({
        message: "All Certificates retrieved successfully",
        certificates,
    });
});

// --- GET ONE ---
const getOneProject = asyncHandler(async (req, res) => {
    const projectId = req.params.id;
    const project = await getOneProjectService(projectId);
    if (!project) {
        return res.status(404).json({ message: "Project Not found" });
    }

    if (project.projectImage && project.projectImage.url) {
        project.projectImage = project.projectImage.url;
    }
    return res.status(200).json({
        message: "project retrieved successfully",
        project,
    });
});

// --- DELETE ---
const deleteProject = asyncHandler(async (req, res) => {
    const projectId = req.params.id;
    const result = await deleteProjectService(projectId);
    if (!result) return res.status(404).json({ message: "Project not found" });
    return res.status(200).json({ message: "project deleted successfully" });
});

const deleteExperience = asyncHandler(async (req, res) => {
    const experienceId = req.params.id;
    const result = await deleteExperienceService(experienceId);
    if (!result) return res.status(404).json({ message: "Experience not found" });
    return res.status(200).json({ message: "Experience deleted successfully" });
});

const deleteCertificate = asyncHandler(async (req, res) => {
    const certificateId = req.params.id;
    const result = await deleteCertificateService(certificateId);
    if (!result)
        return res.status(404).json({ message: "Certificate not found" });
    return res.status(200).json({ message: "Certificate deleted successfully" });
});

// --- ADD ---
const addCertificate = asyncHandler(async (req, res) => {
    const { error } = validateCertificateData(req.body);

    if (error) return res.status(400).json({ message: error.details[0].message });
    if (!req.file) {
        return res.status(400).json({
            message: "Certificate Image is required",
        });
    }
    const certificate = await Certificate.findOne({
        where: {
            title: {
                [Op.and]: [
                    Sequelize.where(fn('LOWER', col('title')), fn('LOWER', req.body.title))
                ]
            }
        }
    });
    if (certificate)
        return res
            .status(400)
            .json({ message: "this certificate is already exist" });

    const newCertificate = await addCertificateService(req.body, req.file);
    if (!newCertificate)
        return res.status(500).json({ message: "Failed to add certificate" });

    return res.status(200).json({
        message: "Certificate added successfully",
        newCertificate,
    });
});

const addProject = asyncHandler(async (req, res) => {
    const { error } = validateProjectData(req.body);

    if (error) return res.status(400).json({ message: error.details[0].message });

    if (!req.file) {
        return res.status(400).json({
            message: "Project Image is required",
        });
    }

    const project = await Project.findOne({
        where: {
            title: {
                [Op.and]: [
                    Sequelize.where(
                        fn("LOWER", col("title")),
                        fn("LOWER", req.body.title),
                    ),
                ],
            },
        },
    });

    if (project)
        return res.status(400).json({ message: "this project is already exist" });

    const newProject = await addProjectService(req.body, req.file);

    if (!newProject)
        return res.status(500).json({ message: "Failed to add project" });

    return res.status(200).json({
        message: "Project added successfully",
        newProject,
    });
});

const addExperience = asyncHandler(async (req, res) => {
    const { error } = validateExperienceData(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const newExperience = await addExperienceService(req.body);
    if (!newExperience)
        return res.status(500).json({ message: "Failed to add experience" });

    return res.status(200).json({
        message: "Experience added successfully",
        newExperience,
    });
});

// --- UPDATE ---
const updateProject = asyncHandler(async (req, res) => {
    const { error } = validateUpdateProjectData(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updatedProject = await updateProjectService(
        req.params.id,
        req.body,
        req.file,
    );
    if (!updatedProject)
        return res.status(500).json({ message: "Failed to update project" });

    return res.status(200).json({
        message: "Project updated successfully",
        updatedProject,
    });
});

const updateExperience = asyncHandler(async (req, res) => {
    const { error } = validateUpdateExperienceData(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updatedExperience = await updateExperienceService(
        req.params.id,
        req.body,
    );
    if (!updatedExperience)
        return res.status(500).json({ message: "Failed to update experience" });

    return res.status(200).json({
        message: "Experience updated successfully",
        updatedExperience,
    });
});

const updateCertificate = asyncHandler(async (req, res) => {
    const { error } = validateCertificateData(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
        
    const updatedCertificate = await updateCertificateService(
        req.params.id,
        req.body,
        req.file,
    );
    
    if (!updatedCertificate)
        return res.status(500).json({ message: "Failed to update certificate" });
    
    return res.status(200).json({
        message: "Certificate updated successfully",
        updatedCertificate,
    });
});

export {
    getAllProjects,
    getAllExperiences,
    getAllCertificates,
    getOneProject,
    deleteProject,
    deleteExperience,
    deleteCertificate,
    addCertificate,
    addProject,
    addExperience,
    updateProject,
    updateExperience,
    updateCertificate,
};