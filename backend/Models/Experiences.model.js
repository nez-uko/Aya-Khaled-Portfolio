import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/db.config.js';

const Experience = sequelize.define('Experience', {
    title: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    company: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    description: { 
        type: DataTypes.TEXT, 
        allowNull: true 
    },
    startDate: { 
        type: DataTypes.DATE, 
        allowNull: false 
    },
    endDate: { 
        type: DataTypes.DATE, 
        allowNull: true 
    },
    currentlyWorking: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false 
    }
}, {
    
    validate: {
        isAfterStart() {
            if (this.endDate && this.endDate < this.startDate) {
                throw new Error("End date must be after start date!");
            }
        }
    }
});

export default Experience;