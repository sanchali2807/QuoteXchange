const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    createBid,
    getAllBid,
    getLeaderboard
} = require("../controllers/bidController");

router.post("/:id/bids",authMiddleware,roleMiddleware("supplier"),createBid);
router.get("/:id/bids",authMiddleware,getAllBid);
router.get("/:id/leaderboard",authMiddleware,getLeaderboard);

module.exports = router;