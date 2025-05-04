const express = require('express');
const router = express.Router();
const {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
} = require('../controllers/todoController');

// Get all todos
router.get('/', getTodos);

// Get single todo
router.get('/:id', getTodoById);

// Create new todo
router.post('/', createTodo);

// Update todo
router.put('/:id', updateTodo);

// Delete todo
router.delete('/:id', deleteTodo);

module.exports = router; 