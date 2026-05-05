import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/db.config.js';

const Certificate = sequelize.define('Certificate', {
    title: { 
        type: DataTypes.STRING, 
        allowNull: false,
        trim: true 
    },
    issuer: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    description: { 
        type: DataTypes.TEXT, 
        allowNull: true 
    },
    certificateImage: { 
        type: DataTypes.STRING, 
        defaultValue: "" 
    },
    issueDate: { 
        type: DataTypes.DATE,
        allowNull: true
    }
});

export default Certificate;