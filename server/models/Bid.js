// submitted by supplier 

const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const Bid  = sequelize.define("Bid",{
    // id,freight,origin,destination,transitTime,validity,totalPrice,rank
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },

    freight : {
        type : DataTypes.FLOAT,
        allowNull : false
    },

    origin : {
        type : DataTypes.FLOAT,
        allowNull : false
    },

    destination : {
        type : DataTypes.FLOAT,
        allowNull : false
    },

  transitTime: {
    type: DataTypes.STRING
  },

  validity: {
    type: DataTypes.STRING
  },

  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  rank: {
    type: DataTypes.INTEGER
  }


});

module.exports = Bid;