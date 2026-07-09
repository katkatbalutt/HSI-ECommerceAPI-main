const express = require('express');
const mongoose = require('mongoose');
const { body, param, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const port = 3000;

//Custom Logger Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

const userSchema = new mongoose.Schema({ name: String, email: String });
const taskSchema = new mongoose.Schema({ title: String, completed: Boolean });

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

// Validation Error Handler Middleware
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation Rules
const validateUser = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
];

const validateTask = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('completed').optional().isBoolean().withMessage('Completed must be a boolean'),
];

const validateId = [
  param('id').isMongoId().withMessage('Invalid ID format'),
];

// Users CRUD
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post('/users', validateUser, handleValidation, async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
});

app.put('/users/:id', validateId, handleValidation, validateUser, handleValidation, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

app.delete('/users/:id', validateId, handleValidation, async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.status(204).send();
});

// Tasks CRUD
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.get('/tasks/:id', validateId, handleValidation, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

app.post('/tasks', validateTask, handleValidation, async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json(task);
});

app.put('/tasks/:id', validateId, handleValidation, validateTask, handleValidation, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

app.delete('/tasks/:id', validateId, handleValidation, async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.status(204).send();
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
