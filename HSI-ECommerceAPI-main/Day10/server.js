const express = require('express');
const mongoose = require('mongoose');
const { body, param, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

const mongoUri = process.env.MONGO_URI + (process.env.MONGO_URI.includes('retryWrites') ? '' : '&retryWrites=true&w=majority');
mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err.message));

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  imageUrl: String,
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
  }],
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
  }],
  totalAmount: Number,
  status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Cart = mongoose.model('Cart', cartSchema);
const Order = mongoose.model('Order', orderSchema);

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

const validateAuth = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const validateProduct = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('description').optional().trim(),
  body('category').optional().trim(),
  body('imageUrl').optional().trim(),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

const validateId = [
  param('id').isMongoId().withMessage('Invalid ID format'),
];

const validateCartItem = [
  body('productId').isMongoId().withMessage('Valid product ID is required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

const validateQuantity = [
  param('productId').isMongoId().withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

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

app.get('/health', (req, res) => {
  const state = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({ dbStatus: states[state] || 'unknown', uptime: process.uptime() });
});

app.get('/', (req, res) => {
  res.json({
    message: 'HSI E-Commerce API',
    version: '1.0.0',
    routes: [
      { method: 'GET', path: '/', auth: false, description: 'API overview' },
      { method: 'POST', path: '/auth/register', auth: false, description: 'Register a new user' },
      { method: 'POST', path: '/auth/login', auth: false, description: 'Login and get JWT token' },
      { method: 'GET', path: '/auth/me', auth: true, description: 'Get current user profile' },
      { method: 'GET', path: '/users', auth: true, description: 'List all users' },
      { method: 'POST', path: '/users', auth: true, description: 'Create a user' },
      { method: 'PUT', path: '/users/:id', auth: true, description: 'Update a user' },
      { method: 'DELETE', path: '/users/:id', auth: true, description: 'Delete a user' },
      { method: 'GET', path: '/products', auth: false, description: 'List all products (public)' },
      { method: 'GET', path: '/products/:id', auth: false, description: 'Get a product by ID' },
      { method: 'POST', path: '/products', auth: true, description: 'Create a product' },
      { method: 'PUT', path: '/products/:id', auth: true, description: 'Update a product' },
      { method: 'DELETE', path: '/products/:id', auth: true, description: 'Delete a product' },
      { method: 'GET', path: '/cart', auth: true, description: 'Get your cart' },
      { method: 'POST', path: '/cart', auth: true, description: 'Add item to cart' },
      { method: 'PUT', path: '/cart/:productId', auth: true, description: 'Update item quantity in cart' },
      { method: 'DELETE', path: '/cart/:productId', auth: true, description: 'Remove item from cart' },
      { method: 'DELETE', path: '/cart', auth: true, description: 'Clear entire cart' },
      { method: 'POST', path: '/orders', auth: true, description: 'Checkout and place order' },
      { method: 'GET', path: '/orders', auth: true, description: 'View your order history' },
      { method: 'GET', path: '/orders/:id', auth: true, description: 'View a specific order' },
    ],
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: err.message });
});

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

app.get('/auth/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

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

app.get('/products', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

app.get('/products/:id', validateId, handleValidation, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

app.post('/products', auth, validateProduct, handleValidation, async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

app.put('/products/:id', auth, validateId, handleValidation, validateProduct, handleValidation, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

app.delete('/products/:id', auth, validateId, handleValidation, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.status(204).send();
});

app.get('/cart', auth, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
  if (!cart) return res.json({ items: [] });
  res.json(cart);
});

app.post('/cart', auth, validateCartItem, handleValidation, async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  let cart = await Cart.findOne({ userId: req.user.id });

  if (!cart) {
    cart = await Cart.create({ userId: req.user.id, items: [{ productId, quantity }] });
  } else {
    const existing = cart.items.find(item => item.productId.toString() === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    await cart.save();
  }

  const populated = await Cart.findById(cart._id).populate('items.productId');
  res.json(populated);
});

app.put('/cart/:productId', auth, validateQuantity, handleValidation, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const item = cart.items.find(i => i.productId.toString() === req.params.productId);
  if (!item) return res.status(404).json({ message: 'Item not found in cart' });

  item.quantity = req.body.quantity;
  await cart.save();

  const populated = await Cart.findById(cart._id).populate('items.productId');
  res.json(populated);
});

app.delete('/cart/:productId', auth, param('productId').isMongoId(), handleValidation, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter(i => i.productId.toString() !== req.params.productId);
  await cart.save();

  const populated = await Cart.findById(cart._id).populate('items.productId');
  res.json(populated);
});

app.delete('/cart', auth, async (req, res) => {
  await Cart.findOneAndDelete({ userId: req.user.id });
  res.status(204).send();
});

app.post('/orders', auth, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const orderItems = [];
  let totalAmount = 0;

  for (const item of cart.items) {
    const product = item.productId;
    if (!product) continue;

    if (product.stock < item.quantity) {
      return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
    }

    orderItems.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    });
    totalAmount += product.price * item.quantity;

    await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } });
  }

  const order = await Order.create({
    userId: req.user.id,
    items: orderItems,
    totalAmount,
  });

  await Cart.findOneAndDelete({ userId: req.user.id });

  res.status(201).json(order);
});

app.get('/orders', auth, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

app.get('/orders/:id', auth, param('id').isMongoId(), handleValidation, async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
