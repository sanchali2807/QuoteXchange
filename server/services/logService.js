const {ActivityLog} = require("../models");

const addLog = async(rfqId,type,message,meta={})=>{
    await ActivityLog.create(
        {
            rfqId,
            type,
            message,
            meta
        }
    )
}

module.exports = {addLog};