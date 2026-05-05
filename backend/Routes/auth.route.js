import {Router} from "express";
import { forgetPassword, Login, refreshToken, resetPassword, verifyOtp } from "../Controllers/auth.controller.js";
import { verifyToken } from "../Middlewares/jwt.middleware.js";
const router= Router();

//login
router.post("/login",Login);


router.post("/forget-password",forgetPassword);

router.post("/verfiy-otp",verifyOtp);

router.post("/reset-password",resetPassword);
router.post("/refresh-token", refreshToken);

export default router;

