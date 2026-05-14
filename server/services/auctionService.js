const { RFQ } = require("../models");

// Sequelize now returns real UTC Date objects (no timezone/dateStrings config).
// parseLocal: just ensure we have a Date — no string manipulation needed.
const parseLocal = (val) => {
  return new Date(val);
};

// Returns current time as an IST Date (for comparisons against IST-based auction windows)
const getISTNow = () => {
  return new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    })
  );
};

// fixIST: previously subtracted 330 min to convert IST→UTC before saving.
// Now Sequelize handles UTC natively — just return the value as-is.
const fixIST = (val) => {
  return new Date(val);
};

const getAuctionStatus = (rfq) => {
  const now = getISTNow();
  const start = parseLocal(rfq.startTime);
  const close = parseLocal(rfq.endTime);
  const forced = parseLocal(rfq.forcedCloseTime);

  if (now < start) return "UPCOMING";

  // Only when DB values were updated to forced close
  if (
    rfq.wasExtended &&
    close.getTime() === forced.getTime()
  ) {
    return "FORCED CLOSED";
  }

  if (now > close) return "CLOSED";
  if (rfq.wasExtended) return "EXTENDED";
  return "ACTIVE";
};

const isInsideTriggerWindow = (rfq) => {
  const now = getISTNow();
  const close = parseLocal(rfq.endTime);
  const diffTime = (close - now) / (1000 * 60);

  console.log("NOW:", now);
  console.log("CLOSE:", close);
  console.log("DIFF MIN:", diffTime);
  console.log("X MIN:", rfq.xMinutes);

  return diffTime <= Number(rfq.xMinutes) && diffTime >= 0;
};

const checkAndExtendAuction = async (
  rfqId,
  oldRank,
  newRank,
  prevL1,
  currL1
) => {
  const rfq = await RFQ.findByPk(rfqId);
  if (!rfq) return false;

  const now = getISTNow();
  const forced = parseLocal(rfq.forcedCloseTime);
  const currentClose = parseLocal(rfq.endTime);

  if (now > forced) return false;

  if (currentClose.getTime() === forced.getTime()) {
    return false;
  }

  if (!isInsideTriggerWindow(rfq)) return false;

  const oldOrder = oldRank.join(",");
  const newOrder = newRank.join(",");
  const orderChanged = oldOrder !== newOrder;
  const l1Changed = prevL1 !== currL1;

  let shouldExtend = false;

  switch (rfq.triggerType) {
    case "BID_LAST_X":
      shouldExtend = true;
      break;
    case "RANK_CHANGE":
      shouldExtend = orderChanged;
      break;
    case "L1_CHANGE":
      shouldExtend = l1Changed;
      break;
    case "ANY":
      shouldExtend = true;
      break;
    default:
      shouldExtend = false;
  }

  if (!shouldExtend) return false;

  let newClose = parseLocal(rfq.endTime);
  newClose.setMinutes(
    newClose.getMinutes() + Number(rfq.yMinutes)
  );

  if (newClose > forced) {
    newClose = forced;
  }

  await rfq.update({
    endTime: fixIST(newClose),   // fixIST is now a no-op passthrough
    wasExtended: true,
  });

  return true;
};

module.exports = {
  parseLocal,
  getISTNow,
  fixIST,
  getAuctionStatus,
  checkAndExtendAuction,
};