const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const authMiddleware = require("../middleware/auth");

// Validation middleware for POST /notifications
const validateNotification = [
  body("userId").isMongoId().withMessage("Valid userId is required"),
  body("type")
    .isIn(["email", "sms", "push"])
    .withMessage("Type must be one of: email, sms, push"),
  body("message").isString().notEmpty().withMessage("Message is required"),
];

// POST /notifications - Send a notification with validation and auth
router.post("/", authMiddleware, validateNotification, async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId, type, message } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create notification
    const notification = new Notification({
      userId,
      type,
      message,
      status: "pending",
    });

    await notification.save();

    res.status(201).json({ success: true, notification });
  } catch (error) {
    console.error("❌ Error sending notification:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Other routes (GET /notifications etc.) can stay the same, but add authMiddleware if not added yet.

module.exports = router;
