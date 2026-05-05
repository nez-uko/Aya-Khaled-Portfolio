import { Router } from "express";
import {  getMainData } from "../Controllers/User.data.controller.js";
import { getAllProjects, getAllExperiences, getAllCertificates, getOneProject } from "../Controllers/userRelatedData.controller.js";
const router= Router();


router.get("/", getMainData);

router.get("/projects",getAllProjects);

router.get("/experiences",getAllExperiences);

router.get("/certificates",getAllCertificates);

router.get("/project/:id",getOneProject);

export default router
