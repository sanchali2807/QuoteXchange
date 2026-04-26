const { RFQ } = require("../models");

/* ---------------- HELPERS ---------------- */

const parseLocal = (val) => {
  const s = String(val).replace("T", " ").slice(0, 19);

  const [datePart, timePart] = s.split(" ");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm, ss] = timePart.split(":").map(Number);

  return new Date(y, m - 1, d, hh, mm, ss);
};

const getISTNow = () => {
  return new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    })
  );
};

const pad = (n) => String(n).padStart(2, "0");

const formatDT = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
  `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

/* ---------------- STATUS ---------------- */

const getAuctionStatus = (rfq) => {
  const now = getISTNow();

  const start = parseLocal(rfq.startTime);
  const close = parseLocal(rfq.endTime);
  const forced = parseLocal(rfq.forcedCloseTime);

  if (now < start) return "UPCOMING";

  if (now > close) return "CLOSED";

  if (rfq.wasExtended) {
    if (close.getTime() === forced.getTime()) {
      return "FORCED CLOSED";
    }

    return "EXTENDED";
  }

  return "ACTIVE";
};

/* ---------------- TRIGGER WINDOW ---------------- */

const isInsideTriggerWindow = (rfq) => {
  const now = getISTNow();
  const close = parseLocal(rfq.endTime);

  const diffTime = (close - now) / (1000 * 60);

  console.log("NOW:", now);
  console.log("CLOSE:", close);
  console.log("DIFF MIN:", diffTime);
  console.log("X MIN:", rfq.xMinutes);

  return diffTime <= rfq.xMinutes && diffTime >= 0;
};

/* ---------------- EXTENSION ---------------- */

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

  if (now > forced) return false;

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
    default:
      shouldExtend = orderChanged || l1Changed;
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
    endTime: formatDT(newClose),
    wasExtended: true,
  });

  return true;
};

module.exports = {
  getAuctionStatus,
  checkAndExtendAuction,
};