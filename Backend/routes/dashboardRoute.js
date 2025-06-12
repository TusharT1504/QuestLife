const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getUserProfile,
  getTodayTasks,
  updateTaskCompletion,
} = require("../controllers/dashboardController");
const auth = require("../middleware/auth");

// All dashboard routes require authentication
router.use(auth);

// GET /api/dashboard/stats - Get user stats (XP, Level, Coins, Streak)
router.get("/stats", getDashboardStats);

// GET /api/dashboard/profile - Get user profile with motivation
router.get("/profile", getUserProfile);

// GET /api/dashboard/tasks/today - Get today's tasks
router.get("/tasks/today", getTodayTasks);

// PUT /api/dashboard/tasks/:taskId/complete - Update task completion status
router.put("/tasks/:taskId/complete", updateTaskCompletion);

module.exports = router; 