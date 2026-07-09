const express = require('express');
const mongoose = require('mongoose');
const { body, param, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const port = 3000;

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});
const taskSchema = new mongoose.Schema({ title: String, completed: Boolean });

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

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

// Auth Middleware
const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const validateAuth = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// Auth Routes
app.post('/auth/register', validateAuth, handleValidation, async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name: name || email.split('@')[0], email, password: hashed });
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

  res.status(201).json({ message: 'User registered', token, user: { id: user._id, name: user.name, email: user.email } });
});

app.post('/auth/login', validateAuth, handleValidation, async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid email or password' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid email or password' });

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ message: 'Login successful', token, user: { id: user._id, name: user.name, email: user.email } });
});

// JWT auth needed - get current user info
app.get('/auth/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// Users CRUD w/ jwt auth
app.get('/users', auth, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

app.post('/users', auth, validateUser, handleValidation, async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
});

app.put('/users/:id', auth, validateId, handleValidation, validateUser, handleValidation, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

app.delete('/users/:id', auth, validateId, handleValidation, async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.status(204).send();
});

// Tasks CRUD w/ jwt auth
app.get('/tasks', auth, async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.get('/tasks/:id', auth, validateId, handleValidation, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

app.post('/tasks', auth, validateTask, handleValidation, async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json(task);
});

app.put('/tasks/:id', auth, validateId, handleValidation, validateTask, handleValidation, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

app.delete('/tasks/:id', auth, validateId, handleValidation, async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.status(204).send();
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
