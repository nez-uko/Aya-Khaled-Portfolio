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

// Routes
app.use("/portfolio", portfolioRoutes);
app.use("/contact", contactRoute);
app.use("/auth", authRoutes);
app.use("/portfolio/edit", dashboardRoutes);

// temporary route
app.get("/", async (req, res) => {
    await sequelize.authenticate();
    res.json({ message: "API is running" });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;