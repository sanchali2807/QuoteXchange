const { RFQ, Bid} = require("../models");

const getAuctionStatus = (rfq) => {
  const now = new Date();

  const start = new Date(rfq.startTime);
  const close = new Date(rfq.endTime);
  const forced = new Date(rfq.forcedCloseTime);

  if (now < start) {
    return "UPCOMING";
  }

  if (now > close) {
    return "CLOSED";
  }

  // now is between start and close

  if (rfq.wasExtended) {
    if (close.getTime() === forced.getTime()) {
      return "FORCED CLOSED";
    }

    return "EXTENDED";
  }

  return "ACTIVE";
};


const isInsideTriggerWindow = (rfq) => {
    const now = new Date();
    const close = new Date(rfq.endTime);

    console.log("NOW:", now);
    console.log("CLOSE:", close);

    const diffTime = (close - now) / (1000 * 60);

    console.log("DIFF MIN:", diffTime);
    console.log("X MIN:", rfq.xMinutes);

    return diffTime <= rfq.xMinutes && diffTime >= 0;
}

const checkAndExtendAuction = async(rfqId,oldRank,newRank,prevL1,currL1)=>{
    const rfq = await RFQ.findByPk(rfqId);
    if(!rfq)return false;

    const now = new Date();
    const forced = new Date(rfq.forcedCloseTime);

    if(now > forced)return false;

    if(!isInsideTriggerWindow(rfq))return false;

    const oldOrder = oldRank.join(",");
    const newOrder = newRank.join(",");
    const orderChanged = oldOrder !== newOrder;
    
    const L1Changed = prevL1 !== currL1;

    let shouldExtend = false;

    switch (rfq.triggerType){
           case "BID_LAST_X":
      shouldExtend = true;
      break;

    case "RANK_CHANGE":
      shouldExtend = orderChanged;
      break;

    case "L1_CHANGE":
      shouldExtend = L1Changed;
      break;

    case "ANY":
    default:
      shouldExtend = orderChanged||L1Changed;
    }

    if(!shouldExtend)return false;

    let newClose = new Date(rfq.endTime);
    newClose.setMinutes(
        newClose.getMinutes() + rfq.yMinutes
    )

    if(newClose > forced){
         newClose = forced
    }
    await rfq.update({
  endTime: newClose,
  wasExtended: true
});
    return true;

}


module.exports = {
    getAuctionStatus,
    checkAndExtendAuction
}


