import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { validateLogin } from "../Validators/auth.validator.js";
import User from "../Models/user.model.js";



const Login = asyncHandler(async (req, res) => {
    
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    
    const user = await User.findOne({ where: { email: req.body.email.trim().toLowerCase() } });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);    
    if (!isPasswordMatch) return res.status(400).json({ message: "Invalid email or password" });

    
    const accessToken = user.generateToken(); 
    const refreshToken = user.generateRefreshToken(); 

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true, 
        secure: true,  
        sameSite: 'None', 
        maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    
    const { password, refreshToken: _, ...userData } = user.toJSON();
    res.status(200).json({
        message: "Login Successful",
        ...userData,
        token: accessToken 
    });
});

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    family: 4,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

const forgetPassword = asyncHandler(async (req, res) => {
    if(!req.body.email)
        return res.status(400).json({message:"email is required"})
        const email = req.body.email.trim().toLowerCase();
        console.log(email);
        
    const user = await User.findOne({ where: { email} });
    console.log(user.email);
    
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const token = jwt.sign({ id: user.id, otp }, process.env.JWT_SECRET_KEY, { expiresIn: '15m' });

    try {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: 'Reset Code',
        html: `<h1>Your Code: ${otp}</h1>`
    });
    res.json({ success: true, token });
} catch (mailError) {
    console.log("Nodemailer Error:", mailError); 
    res.status(500).json({ message: "Error sending email", detail: mailError.message });
}
});

const verifyOtp = asyncHandler(async (req, res) => {
    const { token, otp } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decoded);
        if (decoded.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        res.json({ success: true, message: "OTP Verified" });
    } catch (error) {
        res.status(400).json({ message: "Session expired" });
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decoded);
        
        const user = await User.findByPk(decoded.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const salt = await bcrypt.genSalt(10);
        console.log(salt);
        
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        
        res.json({ success: true, message: "Password updated" });
    } catch (error) {
        res.status(400).json({ message: "Invalid session" });
    }
});


const refreshToken = asyncHandler(async (req, res) => {
    const cookieToken = req.cookies.refreshToken;

    if (!cookieToken) {
        return res.status(401).json({ message: "You are not authenticated!" });
    }

    const user = await User.findOne({ where: { refreshToken: cookieToken } });
    
    if (!user) {
        return res.status(403).json({ message: "Refresh token is not valid!" });
    }

    
    jwt.verify(cookieToken, process.env.JWT_REFRESH_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Token is expired or invalid!" });
        }

        const newAccessToken = user.generateToken();

        res.status(200).json({
            token: newAccessToken
        });
    });
});

export { Login, forgetPassword, verifyOtp, resetPassword , refreshToken };