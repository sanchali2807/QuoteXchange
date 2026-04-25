const getAuctionStatus=(rfq)=>{
    const now = new Date();
    const close = new Date(rfq.endTime);
    const forcedClose = new Date(rfq.forcedCloseTime);

    if(now > forcedClose){
        return "FORCED CLOSED";
    }
    else if(now > close){
        return "CLOSED";
    }
    else{
        return "ACTIVE";
    }
    
}

module.exports = getAuctionStatus;