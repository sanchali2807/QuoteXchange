const User = require("./User");
const RFQ = require("./RFQ");
const Bid = require("./Bid");
const ActivityLog = require("./ActivityLog");

// buyers create RFQs
// const User = require("./User");
console.log("User import:", User);
console.log("typeof User:", typeof User);
console.log("hasMany:", User && User.hasMany);
User.hasMany(RFQ,{
    foreignKey : "buyerId"
});
RFQ.belongsTo(User,{
    foreignKey : "buyerId"
});

// supplier bids
User.hasMany(Bid,{
    foreignKey: "supplierId"
});
Bid.belongsTo(User,{
    foreignKey : "supplierId"
});

//RFQs has many bids
RFQ.hasMany(Bid,{
    foreignKey : "rfqId"
});
Bid.belongsTo(RFQ,{
    foreignKey : "rfqId"
});

//RFQs has logs
RFQ.hasMany(ActivityLog,{
    foreignKey : "rfqId"
});
ActivityLog.belongsTo(RFQ,{
    foreignKey : "rfqId"
});

module.exports = {
    User,
    RFQ,
    Bid,
    ActivityLog
}
// We export from models/index.js so all models and their associations can be imported from one central place in a clean and organized way.