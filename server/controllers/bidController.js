// Only suppliers can bid
// Auction must be active
// Cannot bid after forced close
// Total = freight + origin + destination
// Rankings = L1, L2, L3...
// same supplier can bid as many times as possible

const { Model } = require("sequelize");
const {Bid,RFQ,User} = require("../models");
const {getAuctionStatus,checkAndExtendAuction}= require("../services/auctionService");
const {buildLeaderboard} = require("../services/LeaderboardService")
const {addLog} = require("../services/logService");
// const { USE } = require("sequelize/lib/index-hints");

// SUBMIT BID
const createBid = async (req,res) =>{
    try{
        // will need to pass the rfq id
        const rfq = await RFQ.findByPk(req.params.id);
        console.log("params =", req.params);
console.log("id =", req.params.id);
        if(!rfq){
            return res.status(404).json({
                success : false,
                message : "RFQ not found"
            })
        }
        const status = getAuctionStatus(rfq);
        if(status !== "ACTIVE"){
            return res.status(400).json({
                success : false,
                message : `Auction is ${status}`
            })
        }

        const {
            freight,
            origin,
            destination,
            transitTime,
            validity
        } = req.body;

        if (
            freight == null ||
            origin == null ||
            destination == null
        ) {
        return res.status(400).json({
            success: false,
            message: "Charges are required"
        });
        }   

        if (
            freight < 0 ||
            origin < 0 ||
            destination < 0
        ) {
        return res.status(400).json({
            success: false,
            message: "Charges cannot be negative"
        });
        }

        //old board
        const oldBoard = await buildLeaderboard(rfq.id);
        const oldRank = oldBoard.map(
            item => item.supplierId
        )
        
console.log(" RANK:", oldRank);
        const prevL1 = oldBoard.length > 0 ? oldBoard[0].supplierId : null;

        // save bid 
        const totalPrice = Number(freight) + Number(origin) + Number(destination);

        const bids = await Bid.create({
            rfqId : rfq.id,
            supplierId : req.user.id,
            freight,
            origin,
            destination,
            transitTime,
            validity,
            totalPrice
        })

         await addLog(
        rfq.id,
        "Bid_CREATED",
        "Bid created",
        {
            supplierId : req.user.id,
            totalPrice
        }

    )
        // new leader board
        const newBoard = await buildLeaderboard(rfq.id);
        const newRank =newBoard.map(
            item => item.supplierId
        )
               
console.log("NEW RANK:", newRank);
        const currL1 = newBoard.length > 0 ? newBoard[0].supplierId : null;

        const extended = await checkAndExtendAuction(
            rfq.id,
            oldRank,
            newRank,
            prevL1,
            currL1
        
        )
        if(extended === true){
            await addLog(
        rfq.id,
        "AUCTION_EXTENDED",
        "Auction extended",
        {
            triggerType: rfq.triggerType
        }
    );
        }
        return res.status(200).json({
            success : true,
            message : "Bid submitted",
            bids,
            extended
        })

    }catch(Err){
        return res.status(500).json({
            success : false,
            message : Err.message
        })
    }
}


// GET ALL BID OF RQF
const getAllBid=async(req,res)=>{
    try{

        const bids = await Bid.findAll({
            where : {rfqId : req.params.id},
            include : [{
                model : User,
                attributes : ["id","name","companyName"]
            }],
            order : [
                ["rank","ASC"],
                ["createdAt","DESC"]
            ]
        })
         return res.status(200).json({
            success: true,
            bids
        });

    }catch(err){
         res.status(500).json({
            success : false,
            message : err
        })
    }
}

// RANKING
// Ranks every bid ever placed in DB.
// If same supplier bids 5 times, all 5 bids get ranks.
// Used after submitting bid.
const recalculateRank=async(rfqId)=>{
    const bids = await Bid.findAll({
        where :{rfqId},
        order : [
            ["totalPrice","ASC"],
        ]
    })
    for(let i=0;i<bids.length;i++){
        await bids[i].update({
            rank : i+1
        })
    }
}

async function getLeaderboard(req, res) {
  try {
    const bids = await Bid.findAll({
      where: { rfqId: req.params.id },
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

    for (const bid of bids) {
      if (!latestMap.has(bid.supplierId)) {
        latestMap.set(bid.supplierId, bid);
      }
    }

    const leaderboard = Array.from(
      latestMap.values()
    );

    leaderboard.sort(
      (a, b) => a.totalPrice - b.totalPrice
    );

    leaderboard.forEach((bid, index) => {
      bid.dataValues.rank = index + 1;
    });

    return res.status(200).json({
      success: true,
      leaderboard
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
    createBid,
    getAllBid,
    getLeaderboard
}