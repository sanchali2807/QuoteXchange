const {Bid ,User} = require("../models");
const buildLeaderboard = async(rfqId)=>{
    const bids = await Bid.findAll({
    where: { rfqId },
    include: [
      {
        model: User,
        attributes: ["id", "name", "companyName"]
      }
    ],
    order: [
      ["supplierId", "ASC"],
      ["createdAt", "DESC"]
    ]
  });
  const latestMap = new Map();
  for(const bid of bids){
    if(!latestMap.has(bid.supplierId)){
        latestMap.set(bid.supplierId,bid);
    }
  }

  const leaderboard = Array.from(latestMap.values());
  leaderboard.sort(
      (a, b) => a.totalPrice - b.totalPrice
    );

    leaderboard.forEach((bid, index) => {
      bid.dataValues.rank = index + 1;
    });

    return leaderboard;

}

module.exports = {
    buildLeaderboard
}