import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import pg from 'pg'
import pgHstore from "pg-hstore";
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
        dialectModule: pg,
        dialectModuleHstore: pgHstore,
        dialectOptions: {
            ssl: {
                require: true,
            }
        },
        logging: false
    });
}

export { sequelize };