require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const notificationRoutes = require("./routes/notifications");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
connectDB();

app.use("/auth", authRoutes); // Auth routes do not require auth

// Protect /users and /notifications with auth middleware
app.use("/users", authMiddleware, userRoutes);
app.use("/notifications", authMiddleware, notificationRoutes);

app.get("/", (req, res) => {
  res.send("✅ Notification Service API is running");
});

// Global error handling middleware (to catch errors in async routes)
app.use((err, req, res, next) => {
  console.error("🚨 Unhandled error:", err.stack || err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
