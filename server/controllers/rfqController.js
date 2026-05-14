// buyer can post put and delete 
// buyer and supplier both can get list and details 
// rules are ForcedcloseTime > closeTime
// closeTime > startTime
// xMinutes > 0 , yMinutes > 0

// buyer can post put and delete 
// buyer and supplier both can get list and details 
// rules are ForcedcloseTime > closeTime
// closeTime > startTime
// xMinutes > 0 , yMinutes > 0

const { RFQ, User, ActivityLog, Bid } = require("../models");
const { addLog } = require("../services/logService");
const { getAuctionStatus, fixIST } = require("../services/auctionService");
const { buildLeaderboard } = require("../services/LeaderboardService");

const generateReferenceId = () => {
  return "RFQ - " + Date.now();
};

const validateRfqInput = ({
  name,
  startTime,
  endTime,
  forcedCloseTime,
  xMinutes,
  yMinutes,
}) => {
  if (!name || !startTime || !endTime || !forcedCloseTime) {
    return "Required fields missing";
  }

  if (new Date(startTime) <= new Date()) {
    return "Start time must be in future";
  }

  if (new Date(startTime) >= new Date(endTime)) {
    return "Start time must be before close time";
  }

  if (new Date(endTime) >= new Date(forcedCloseTime)) {
    return "Forced close must be later than close time";
  }

  if (Number(xMinutes) <= 0 || Number(yMinutes) <= 0) {
    return "X and Y minutes must be positive";
  }

  return null;
};

// CREATE RFQ
const createRfq = async (req, res) => {
  try {
    const {
      name,
      startTime,
      endTime,
      forcedCloseTime,
      pickupDate,
      xMinutes,
      yMinutes,
      triggerType,
    } = req.body;

    const error = validateRfqInput(req.body);

    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    // fixIST is now a passthrough — just wraps the value in new Date()
    // The client should send UTC ISO strings (e.g. "2025-06-01T10:00:00.000Z")
    // Sequelize will store them as UTC automatically
    const rfq = await RFQ.create({
      name,
      referenceId: generateReferenceId(),
      startTime: fixIST(startTime),
      endTime: fixIST(endTime),
      forcedCloseTime: fixIST(forcedCloseTime),
      pickupDate,
      xMinutes,
      yMinutes,
      triggerType,
      buyerId: req.user.id,
    });

    console.log("SAVED START:", rfq.startTime);
    console.log("SAVED END:", rfq.endTime);
    console.log("SAVED FORCED:", rfq.forcedCloseTime);

    await addLog(rfq.id, "RFQ_CREATED", "RFQ created", {
      buyerId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Successfully created a RFQ",
      rfq,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL RFQs
const getAllRfq = async (req, res) => {
  try {
    const rfqs = await RFQ.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name", "companyName"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ success: true, rfqs });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error Getting RFQ" });
  }
};

// GET ONE RFQ
const getRfqById = async (req, res) => {
  try {
    const rfq = await RFQ.findByPk(req.params.id, {
      include: [{ model: User, attributes: ["id", "name", "companyName"] }],
    });

    if (!rfq) {
      return res.status(404).json({ success: false, message: "RFQ not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully extracted RFQ by id",
      rfq,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error Getting RFQ by Id" });
  }
};

// UPDATE RFQ
const updateRfq = async (req, res) => {
  try {
    const rfq = await RFQ.findByPk(req.params.id);

    if (!rfq) {
      return res.status(404).json({ success: false, message: "Rfq does not exist" });
    }

    if (Number(rfq.buyerId) !== Number(req.user.id)) {
      return res.status(403).json({ success: false, message: "Not your Rfq to update" });
    }

    const mergedData = { ...rfq.dataValues, ...req.body };
    const error = validateRfqInput(mergedData);

    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const payload = { ...req.body };

    // fixIST is now a passthrough — no offset subtraction
    if (payload.startTime) payload.startTime = fixIST(payload.startTime);
    if (payload.endTime) payload.endTime = fixIST(payload.endTime);
    if (payload.forcedCloseTime) payload.forcedCloseTime = fixIST(payload.forcedCloseTime);

    await rfq.update(payload);

    return res.status(200).json({ success: true, message: "Successfully updated!!" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error Updating RFQ" });
  }
};

// DELETE RFQ
const deleteRfq = async (req, res) => {
  try {
    const rfq = await RFQ.findByPk(req.params.id);

    if (!rfq) {
      return res.status(404).json({ success: false, message: "Rfq does not exist" });
    }

    if (rfq.buyerId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not your Rfq to delete" });
    }

    await rfq.destroy();
    return res.status(200).json({ success: true, message: "RFQ deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error Deleting RFQ" });
  }
};

// GET AUCTION LISTINGS
const getAuctionListings = async (req, res) => {
  try {
    const rfqs = await RFQ.findAll({ order: [["createdAt", "DESC"]] });

    const result = [];
    for (const rfq of rfqs) {
      const leaderboard = await buildLeaderboard(rfq.id);
      const lowestBid = leaderboard.length > 0 ? leaderboard[0].totalPrice : null;
      result.push({
        id: rfq.id,
        name: rfq.name,
        referenceId: rfq.referenceId,
        endTime: rfq.endTime,
        forcedCloseTime: rfq.forcedCloseTime,
        status: getAuctionStatus(rfq),
        lowestBid,
        wasExtended: rfq.wasExtended,
      });
    }

    return res.status(200).json({ success: true, auctions: result });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET RFQ DETAILS
const getRfqDetails = async (req, res) => {
  try {
    const rfq = await RFQ.findByPk(req.params.id, {
      include: [{ model: User, attributes: ["id", "name", "companyName"] }],
    });

    if (!rfq) {
      return res.status(404).json({ message: "RFQ not found" });
    }

    const bids = await Bid.findAll({
      where: { rfqId: rfq.id },
      order: [["createdAt", "DESC"]],
    });

    const leaderboard = await buildLeaderboard(rfq.id);

    const logs = await ActivityLog.findAll({
      where: { rfqId: rfq.id },
      order: [["createdAt", "DESC"]],
    });

    const status = getAuctionStatus(rfq);

    return res.status(200).json({
      rfq: { ...rfq.toJSON(), status },
      bids,
      leaderboard,
      logs,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createRfq,
  getAllRfq,
  getRfqById,
  updateRfq,
  deleteRfq,
  getAuctionListings,
  getRfqDetails,
};