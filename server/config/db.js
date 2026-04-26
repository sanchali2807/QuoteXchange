const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: "mysql",
  timezone: "+05:30",
  logging: false
});

module.exports = sequelize;

