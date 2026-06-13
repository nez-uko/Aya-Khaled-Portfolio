import { sequelize } from './Config/db.config.js';
await sequelize.sync({ alter: true }); 