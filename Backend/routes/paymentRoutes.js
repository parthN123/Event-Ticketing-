const express = require("express");
const { processPayment, processRefund } = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/process", authMiddleware, processPayment);
router.post("/refund", authMiddleware, processRefund);

module.exports = router;