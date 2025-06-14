const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getTaskHistory,
  getCompletedTasksByDate,
  getTaskStats
} = require('../controllers/taskHistoryController');

router.use(auth);

// GET /api/history - Get task history grouped by date
router.get('/', getTaskHistory);

// GET /api/history/stats - Get task statistics
router.get('/stats', getTaskStats);

// GET /api/history/date/:date - Get completed tasks for specific date
router.get('/date/:date', getCompletedTasksByDate);

module.exports = router; 