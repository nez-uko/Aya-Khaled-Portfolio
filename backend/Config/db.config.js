import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

let sequelize;

if (process.env.OFFLINE === 'true') {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './offline_database.sqlite', 
        logging: false
    });
} else {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false
    });
}

export { sequelize };