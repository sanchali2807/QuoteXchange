const {ActivityLog} = require("../models");

const getLogs=async(req,res)=>{
    try{
        const logs = await ActivityLog.findAll({
            where :{rfqId : req.params.id},
            order : [["createdAt","DESC"]]
        });
        return res.status(200).json({
            success : true,
            message : "Activity Logs",
            logs
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

module.exports = getLogs;