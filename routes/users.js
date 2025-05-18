const authMiddleware = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST /users - Create a new user
router.post("/", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res
        .status(400)
        .json({ error: "Name, email, and phone are required" });
    }

    const user = new User({ name, email, phone });
    await user.save();

    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
const Notification = require("../models/Notification"); // import Notification model at the top if not already done

// GET /users/:id/notifications - Get all notifications for a user
router.get("/:id/notifications", async (req, res) => {
  try {
    const userId = req.params.id;

    // Step 1: Check if the user exists in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Step 2: Retrieve all notifications for this user
    // Sort by createdAt descending (newest first)
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });

    // Step 3: Send the notifications as a JSON response
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
