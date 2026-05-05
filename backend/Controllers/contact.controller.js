import { createTransport } from 'nodemailer';
import asyncHandler from 'express-async-handler';
import { validateContact, isValidEmail } from '../Validators/auth.validator.js';
import { configDotenv } from "dotenv";

configDotenv();

const transporter = createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: { rejectUnauthorized: false }
});

const ContactForm = asyncHandler(async (req, res) => {
    const { email, message, name } = req.body;
    const { error } = validateContact(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    if (!isValidEmail(email)) return res.status(400).json({ message: "Invalid email format" });

    const mailOptions = {
    from: `"${name}" <${process.env.EMAIL}>`, 
    replyTo: email, 
    to: process.env.EMAIL,
    subject: `New Portfolio Message from ${name}`,
    html: `
        <h4>You received a new message from your portfolio:</h4>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
    `
};

    transporter.sendMail(mailOptions, (error) => {
        if (error) return res.status(500).json({ message: "Something went wrong" , error: error.message });
        res.status(200).json({ message: "Message sent successfully" });
    });
});

export { ContactForm };