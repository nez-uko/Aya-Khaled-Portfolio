import express, { json } from "express";
import cors  from "cors"
import { configDotenv } from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import { errorHandler, notFoundHandler } from "../backend/Middlewares/notFoundHandler.middleware.js";
import contactRoute from "../backend/Routes/contact.route.js";
import portfolioRoutes from "../backend/Routes/user.data.route.js";
import authRoutes from "../backend/Routes/auth.route.js";
import dashboardRoutes from "../backend/Routes/dashBoardAuth.route.js";
import { sequelize } from "../backend/Config/db.config.js";

configDotenv();
const app = express();

// Middlewares
app.use(json());
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true
}));

try {
    await sequelize.authenticate();
    console.log("Database connected successfully");
} catch (error) {
    console.error("Database connection failed:", error);
}

// Routes
app.use("/portfolio", portfolioRoutes);
app.use("/contact", contactRoute);
app.use("/auth", authRoutes);
app.use("/portfolio/edit", dashboardRoutes);

// temporary route
app.get("/", (req, res) => {
    res.status(200).json({ message: "API is running smoothly" });
});


app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

export default app;