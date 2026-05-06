import dotenv from "dotenv";
import {sequelize} from "../Config/db.config.js";
import User from "../Models/user.model.js";

dotenv.config();

export const seedAdmin = async () => {
    try {
        await sequelize.authenticate();
        // await sequelize.sync({ force: true });
        await User.destroy({ where: { email: process.env.EMAIL } });
        
        const user=await User.create({
            name: "Aya Khaled",
            email: process.env.EMAIL,
            password: process.env.EMAIL_PASSWORD__, 
            role: "admin",
            bio: "Data Analyst & Power BI Specailest",
            linkedIn:"https://www.linkedin.com/in/aya-k-mohamed-58474b2b7?utm_source=share_via&utm_content=profile&utm_medium=member_android",
            gitHub:'github',
            skills:["Power BI", "Python", "Excel", "Tableau", "SQL"],
            city:"Qena",
            governorate:"Egypt",
            description:"My journey as a Data Analyst began with a simple curiosity: How can we find clarity within chaos? Over the past few years, I've dedicated myself to transforming raw datasets into powerful, actionable insights and compelling visual stories using SQL, Python, and Power BI.I believe that data without context is just numbers. That's why I focus not just on the analysis, but on the why behind it. I'm passionate about collaborating with teams to build data-driven cultures and develop dashboards that make complex information intuitive.Whether it's optimizing business processes, analyzing customer behavior, or identifying market trends, I am always seeking new challenges that push me to learn and grow. This is not just my career; it's my calling to make data speak the truth.",
            phoneNumber:"01024370037"
        });
                process.exit(); 
    } catch (error) {
        process.exit(1);
    }
};

seedAdmin();