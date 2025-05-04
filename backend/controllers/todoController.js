// Sample data (replace with database in production)
let todos = [
  { id: 1, text: 'Learn React', completed: false },
  { id: 2, text: 'Learn Express', completed: false },
  { id: 3, text: 'Build a project', completed: false }
];

// Get all todos
const getTodos = (req, res) => {
  res.json(todos);
};

// Get single todo
const getTodoById = (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(todo => todo.id === id);
  
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  
  res.json(todo);
};

// Create new todo
const createTodo = (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ message: 'Please provide a todo text' });
  }
  
  const newId = todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;
  
  const newTodo = {
    id: newId,
    text,
    completed: false
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
};

// Update todo
const updateTodo = (req, res) => {
  const id = parseInt(req.params.id);
  const { text, completed } = req.body;
  
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  
  const updatedTodo = {
    ...todos[todoIndex],
    text: text || todos[todoIndex].text,
    completed: completed !== undefined ? completed : todos[todoIndex].completed
  };
  
  todos[todoIndex] = updatedTodo;
  res.json(updatedTodo);
};

// Delete todo
const deleteTodo = (req, res) => {
  const id = parseInt(req.params.id);
  
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  
  todos = todos.filter(todo => todo.id !== id);
  res.json({ message: 'Todo deleted' });
};

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
}; 