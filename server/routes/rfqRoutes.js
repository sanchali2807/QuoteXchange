const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const{
  createRfq,
  getAllRfq,
  getRfqById,
  updateRfq,
  deleteRfq,
  getAuctionListings,
  getRfqDetails
} = require("../controllers/rfqController");

router.post("/",authMiddleware,roleMiddleware("buyer"),createRfq);
router.get("/",authMiddleware,getAllRfq);
router.get("/auctions", authMiddleware, getAuctionListings);
router.get("/:id/details",authMiddleware,getRfqDetails);
router.get("/:id",authMiddleware,getRfqById);
router.put("/:id",authMiddleware,roleMiddleware("buyer"),updateRfq);
router.delete("/:id",authMiddleware,roleMiddleware("buyer"),deleteRfq);

module.exports = router ;