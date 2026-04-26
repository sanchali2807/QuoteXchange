const { RFQ, User, ActivityLog, Bid } = require("../models");
const { addLog } = require("../services/logService");
const { getAuctionStatus } = require("../services/auctionService");
const { buildLeaderboard } = require("../services/LeaderboardService");

/* ---------------- HELPERS ---------------- */

const generateReferenceId = () => {
  return "RFQ - " + Date.now();
};

const formatDT = (val) => {
  return val ? val.replace("T", " ") + ":00" : null;
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

/* ---------------- CREATE RFQ ---------------- */

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
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    const rfq = await RFQ.create({
      name,
      referenceId: generateReferenceId(),
      startTime: formatDT(startTime),
      endTime: formatDT(endTime),
      forcedCloseTime: formatDT(forcedCloseTime),
      pickupDate,
      xMinutes,
      yMinutes,
      triggerType,
      buyerId: req.user.id,
    });

    await addLog(rfq.id, "RFQ_CREATED", "RFQ created", {
      buyerId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Successfully created RFQ",
      rfq,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ---------------- GET ALL RFQs ---------------- */

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

    return res.status(200).json({
      success: true,
      rfqs,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error Getting RFQ",
    });
  }
};

/* ---------------- GET RFQ BY ID ---------------- */

const getRfqById = async (req, res) => {
  try {
    const rfq = await RFQ.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["id", "name", "companyName"],
        },
      ],
    });

    if (!rfq) {
      return res.status(404).json({
        success: false,
        message: "RFQ not found",
      });
    }

    return res.status(200).json({
      success: true,
      rfq,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error Getting RFQ",
    });
  }
};

/* ---------------- UPDATE RFQ ---------------- */

const updateRfq = async (req, res) => {
  try {
    const rfq = await RFQ.findByPk(req.params.id);

    if (!rfq) {
      return res.status(404).json({
        success: false,
        message: "RFQ does not exist",
      });
    }

    if (rfq.buyerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not your RFQ to update",
      });
    }

    const mergedData = {
      ...rfq.dataValues,
      ...req.body,
    };

    const error = validateRfqInput(mergedData);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    const payload = { ...req.body };

    if (payload.startTime) {
      payload.startTime = formatDT(payload.startTime);
    }

    if (payload.endTime) {
      payload.endTime = formatDT(payload.endTime);
    }

    if (payload.forcedCloseTime) {
      payload.forcedCloseTime = formatDT(
        payload.forcedCloseTime
      );
    }

    await rfq.update(payload);

    return res.status(200).json({
      success: true,
      message: "Successfully updated RFQ",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error Updating RFQ",
    });
  }
};

/* ---------------- DELETE RFQ ---------------- */

const deleteRfq = async (req, res) => {
  try {
    const rfq = await RFQ.findByPk(req.params.id);

    if (!rfq) {
      return res.status(404).json({
        success: false,
        message: "RFQ does not exist",
      });
    }

    if (rfq.buyerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not your RFQ to delete",
      });
    }

    await rfq.destroy();

    return res.status(200).json({
      success: true,
      message: "RFQ deleted",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error deleting RFQ",
    });
  }
};

/* ---------------- AUCTION LISTINGS ---------------- */

const getAuctionListings = async (req, res) => {
  try {
    const rfqs = await RFQ.findAll({
      order: [["createdAt", "DESC"]],
    });

    const result = [];

    for (const rfq of rfqs) {
      const leaderboard = await buildLeaderboard(rfq.id);

      const lowestBid =
        leaderboard.length > 0
          ? leaderboard[0].totalPrice
          : null;

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

    return res.status(200).json({
      success: true,
      auctions: result,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

/* ---------------- RFQ DETAILS ---------------- */

const getRfqDetails = async (req, res) => {
  try {
    const rfq = await RFQ.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["id", "name", "companyName"],
        },
      ],
    });

    if (!rfq) {
      return res.status(404).json({
        message: "RFQ not found",
      });
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
      rfq: {
        ...rfq.toJSON(),
        status,
      },
      bids,
      leaderboard,
      logs,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
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