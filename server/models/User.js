//  buyer or supplier 

const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");
// Go one folder up, then enter the config folder, then load the db.js file.

const User = sequelize.define("User",{
    // id,name,email,password,role,companyName
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },
    name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    email : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false
    },
    role : {
        type : DataTypes.ENUM("buyer","supplier"),
        allowNull : false
    },
    companyName : {
        type : DataTypes.STRING,
        allowNull : true
    }
});
module.exports = {User};

