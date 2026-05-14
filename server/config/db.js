const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: "mysql",
  logging: false,
  timezone: "+05:30",
  dialectOptions: {
    dateStrings: true,
    typeCast: true
  }
});
module.exports = sequelize;

