// stores event

const {DataTypes, Model} = require("sequelize");
const sequelize = require("../config/db");

const ActivityLog = sequelize.define("ActivityLog" , {
// id , type , message , meta
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  type: {
    type: DataTypes.STRING,
    allowNull: false
  },

  message: {
    type: DataTypes.STRING,
    allowNull: false
  },

  meta: {
    type: DataTypes.JSON
  }
});

module.exports ={ ActivityLog} ; 