const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

router.use(auth);

// GET /api/tasks
router.get('/', getTasks);
// POST /api/tasks
router.post('/', createTask);
// PUT /api/tasks/:id
router.put('/:id', updateTask);
// DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

module.exports = router; 