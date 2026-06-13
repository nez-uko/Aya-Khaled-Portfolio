import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/db.config.js';

const Project = sequelize.define('Project', {
    title: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true,
        validate: { len: [3, 50] } 
    },
    description: { 
        type: DataTypes.TEXT, 
        defaultValue: null 
    },
    projectImages: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        validate: {
            isArray(value) {
                if (!Array.isArray(value)) {
                    throw new Error('Project images must be an array of objects');
                }
            }
        }
    },
    liveDemo: { 
        type: DataTypes.STRING, 
        defaultValue: null 
    },
    githubLink: { 
        type: DataTypes.STRING, 
        defaultValue: null 
    },
    usedSkills: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
});

export default Project;