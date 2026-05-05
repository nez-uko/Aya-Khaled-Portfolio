import { Router } from "express";
import { ContactForm } from "../Controllers/contact.controller.js";
const router= Router();


router.post("/",ContactForm);


export default router;