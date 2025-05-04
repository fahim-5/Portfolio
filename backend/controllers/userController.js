// Sample user data (replace with database in production)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// Get all users
const getUsers = (req, res) => {
  res.json(users);
};

// Get user by ID
const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(user => user.id === id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json(user);
};

// Create new user
const createUser = (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ message: 'Please provide name and email' });
  }
  
  // Check if email already exists
  if (users.some(user => user.email === email)) {
    return res.status(400).json({ message: 'User with that email already exists' });
  }
  
  const newId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
  
  const newUser = {
    id: newId,
    name,
    email
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
};

// Update user
const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // Check if updating email to one that already exists
  if (email && email !== users[userIndex].email && 
      users.some(user => user.email === email)) {
    return res.status(400).json({ message: 'User with that email already exists' });
  }
  
  const updatedUser = {
    ...users[userIndex],
    name: name || users[userIndex].name,
    email: email || users[userIndex].email
  };
  
  users[userIndex] = updatedUser;
  res.json(updatedUser);
};

// Delete user
const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  users = users.filter(user => user.id !== id);
  res.json({ message: 'User deleted' });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
}; 