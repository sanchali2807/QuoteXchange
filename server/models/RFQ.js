// auction created by buyer 

const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const RFQ = sequelize.define("RFQ",{
    //id, name,referenceiD , startTime , closeTIme, forcesCloseTime ,pickupdate , xMinutes,yMinutes, triggerType , status
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },

    name :  {
        type : DataTypes.STRING,
        allowNull : false
    },
    
    referenceId : {
        type : DataTypes.INTEGER,
        allowNull : false
    },

    startTime : {
        type : DataTypes.DATE,
        allowNull : false
    },

    endTime : {
        type : DataTypes.DATE,
        allowNull : false
    },

    forcedCloseTime : {
        type : DataTypes.DATE,
        allowNull : false
    },

    pickupDate: {
    type: DataTypes.DATEONLY
  },

  xMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },

  yMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },

  triggerType: {
    type: DataTypes.ENUM(
      "ANY",
      "BID_LAST_X",
      "RANK_CHANGE",
      "L1_CHANGE"
    ),
    defaultValue: "ANY"
  },

  status: {
    type: DataTypes.ENUM(
      "Active",
      "Closed",
      "ForceClosed"
    ),
    defaultValue: "Active"
  }
});

module.exports = "RFQ";