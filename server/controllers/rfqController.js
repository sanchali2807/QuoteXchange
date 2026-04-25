// buyer can post put and delete 
// buyer and supplier both can get list and details 
// rules are ForcedcloseTime > closeTime
// closeTime > startTime
// xMinutes > 0 , yMinutes > 0

const {RFQ,User,ActivityLog,Bid} = require("../models");
// const {Op} = require("sequelize");
const {addLog} = require("../services/logService");
const { getAuctionStatus } = require("../services/auctionService");
const { buildLeaderboard } = require("../services/LeaderboardService");
const generateReferenceId=()=>{
    return "RFQ - " + Date.now();
    // Date.now is used because Returns current timestamp in milliseconds 
}

// CREATE RFQ
const createRfq = async(req,res)=>{
    try{
        const{
            name,
            startTime,
            endTime,
            forcedCloseTime,
            pickupDate,
            xMinutes,
            yMinutes,
            triggerType
        } = req.body;

        if (!name || !startTime || !endTime || !forcedCloseTime) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({
        success: false,
        message: "Start time must be before close time"
      });
    }

    if (new Date(endTime) >= new Date(forcedCloseTime)) {
      return res.status(400).json({
        success: false,
        message: "Forced close must be later than close time"
      });
    }

    if (xMinutes <= 0 || yMinutes <= 0) {
      return res.status(400).json({
        success: false,
        message: "X and Y minutes must be positive"
      });
    }

    const rfq = await RFQ.create({
        name,
        referenceId : generateReferenceId(),
        startTime,
        endTime,
        forcedCloseTime,
        pickupDate,
        xMinutes,
        yMinutes,
        triggerType,
        buyerId : req.user.id
    });

    await addLog(
        rfq.id,
        "RFQ_CREATED",
        "RFQ created",
        {
            buyerId : req.user.id
        }

    )
    return res.status(200).json({
        success : true,
        message : "Successfully created a RFQ",
        rfq
    });
    

    }catch(err){
        return res.status(500).json({
            success : false,
            message : err.message
        })
    }
}


// GET ALL RFQs

const getAllRfq = async(req,res)=>{
    try{
        const rfqs = await RFQ.findAll({
// find all return all rows of RFQ and 
// what include does Fetch related model data using previously defined foreign-key relationships.
// and attributes defines which column we need and DESC so that the latest comes first
// RFQ is associated with User.
// I already know which foreign key connects them.
// Let me JOIN both tables and return combined data.
            include : [
                {
                    model : User,
                    attributes : ["id","name","companyName"]
                }
            ],
            order : [["createdAt","DESC"]]
        })

        return res.status(200).json({
            success : true,
            rfqs
        })

    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Error Getting RFQ"
        })
    }
}

// GET ONE RFQQs

const getRfqById = async (req,res)=>{
    try{
        const rfq = await RFQ.findByPk(req.params.id,{
            include : [{
                model : User,
                attributes : ["id","name","companyName"]
            }]
        });
         if (!rfq) {
      return res.status(404).json({
        success: false,
        message: "RFQ not found"
      });
    }
    return res.status(200).json({
        success : true,
        message : "Successfully extracted RFQ by id",
        rfq
    })

    }catch(err){
         return res.status(500).json({
            success : false,
            message : "Error Getting RFQ by Id"
        })
    }
}

// UPDATE RFQS

const updateRfq = async(req,res)=>{
    try{
        const rfq = await RFQ.findByPk(req.params.id);
        if(!rfq){
            return res.status(404).json({
                success :false,
                message : "Rfq does not exist"
            })
        }
        // rfq contains the id generated row and we chdck that rows buyeriD
        if(rfq.buyerId !== req.user.id){
            return res.status(403).json({
                success : false,
                message : "Not your Rfq to update"
            })
        }
        await rfq.update(req.body);
        return res.status(200).json({
            success : true,
            message : "Successfully updated!!"
        })

    }catch(err){
         return res.status(500).json({
            success : false,
            message : "Error Updating RFQ"
        })
    }
}

//DELETE RFQ

const deleteRfq = async (req,res)=>{
    try{
        const rfq = await RFQ.findByPk(req.params.id);
        if(!rfq){
            return res.status(404).json({
                success :false,
                message : "Rfq does not exist"
            })
        }
        if(rfq.buyerId !== req.user.id){
             return res.status(403).json({
                success : false,
                message : "Not your Rfq to delete"
            })
        }
        await rfq.destroy();
            return res.status(200).json({
                success: true,
                message: "RFQ deleted"
             });

    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Error Updating RFQ"
        })
    }
}

//get auction listings
const getAuctionListings = async(req,res)=>{
    try{
         console.log("STEP 1");
        const rfqs = await RFQ.findAll({
            order :[["createdAt","DESC"]]
        })

        // console.log("STEP 2", rfqs.length);/
        const result = [];
        for(const rfq of rfqs){
            const leaderboard = await buildLeaderboard(rfq.id);
            const lowestBid = leaderboard.length > 0 ? leaderboard[0].totalPrice : null;
            result.push({
                id : rfq.id,
                name : rfq.name,
                referenceId : rfq.referenceId,
                endTime : rfq.endTime,
                forcedCloseTime : rfq.forcedCloseTime,
                status : getAuctionStatus(rfq),
                lowestBid : lowestBid
            }
            )
        }
        return res.status(200).json({
            success : true,
            auctions : result
            // data:rfqs
        })
    }catch(err){
        return res.status(500).json({
            message : err.message
        })
    }
}

const getRfqDetails= async(req,res)=>{
    try{
        const rfq = await RFQ.findByPk(req.params.id,{
            include : [{
                model : User,
                attributes : ["id","name","companyName"]
            }]
        });

        if(!rfq){
            return res.status(404).json({
                message : "RFQ not found"
            })
        }
        const bids = await Bid.findAll({
            where : {rfqId : rfq.id},
            order : [["createdAt","DESC"]]
        })
        const leaderboard = await buildLeaderboard(rfq.id);

        const logs = await ActivityLog.findAll({
            where : {rfqId : rfq.id},
            order : [["createdAt","DESC"]]
        })
        return res.status(200).json({
            rfq,
            bids,
            leaderboard,
            logs
        })

    }catch(err){
        return res.status(500).json({
            message : err.message
        })
    }
}

module.exports = {
    createRfq,
    getAllRfq,
    getRfqById,
    updateRfq,
    deleteRfq,
    getAuctionListings,
    getRfqDetails
}