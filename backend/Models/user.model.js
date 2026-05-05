import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sequelize } from "../Config/db.config.js";

const User = sequelize.define(
    "User",
    {
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.STRING, defaultValue: "user" },
        bio: { type: DataTypes.STRING, allowNull: true },
        description: { type: DataTypes.TEXT, allowNull: true },
        profile: { type: DataTypes.STRING, allowNull: true },
        linkedIn: { type: DataTypes.STRING, allowNull: false },
        gitHub: { type: DataTypes.STRING, allowNull: false },
        phoneNumber: { type: DataTypes.STRING, allowNull: false },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        street: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        governorate: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        skills: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        freelancePlatforms: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [], 
        },
        cv: {
    type: DataTypes.STRING,
    allowNull: true
        },
        refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true,      
    }

    },
    {
        hooks: {
            beforeSave: async (user) => {
                if (user.changed("password")) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
        },
    },
);

User.prototype.generateToken = function () {
    return jwt.sign(
        { id: this.id, role: this.role, email: this.email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" },
    );
};

User.prototype.generateRefreshToken = function () {
    return jwt.sign(
        { id: this.id }, 
        process.env.JWT_REFRESH_SECRET_KEY, 
        { expiresIn: "7d" } 
    );
};
export default User;
