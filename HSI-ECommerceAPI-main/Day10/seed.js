const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({ name: String, email: { type: String, unique: true }, password: String });
const User = mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  imageUrl: String,
  stock: Number,
  createdAt: { type: Date, default: Date.now },
});
const Product = mongoose.model('Product', productSchema);

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected\n');

  await Product.deleteMany({});
  const products = await Product.insertMany([
    { name: 'Wireless Headphones', description: 'Noise-cancelling Bluetooth headphones with 30h battery life', price: 79.99, category: 'Electronics', imageUrl: 'https://via.placeholder.com/300x300?text=Headphones', stock: 50 },
    { name: 'Running Shoes', description: 'Lightweight running shoes with responsive cushioning', price: 129.99, category: 'Sports', imageUrl: 'https://via.placeholder.com/300x300?text=Shoes', stock: 30 },
    { name: 'Coffee Maker', description: 'Programmable 12-cup drip coffee maker with timer', price: 49.99, category: 'Home', imageUrl: 'https://via.placeholder.com/300x300?text=Coffee', stock: 25 },
    { name: 'Backpack', description: 'Water-resistant 30L backpack with laptop compartment', price: 39.99, category: 'Accessories', imageUrl: 'https://via.placeholder.com/300x300?text=Backpack', stock: 100 },
    { name: 'Desk Lamp', description: 'LED desk lamp with adjustable brightness and color temperature', price: 29.99, category: 'Home', imageUrl: 'https://via.placeholder.com/300x300?text=Lamp', stock: 75 },
    { name: 'Yoga Mat', description: 'Non-slip exercise yoga mat with carrying strap', price: 24.99, category: 'Sports', imageUrl: 'https://via.placeholder.com/300x300?text=Yoga', stock: 60 },
  ]);
  console.log('Products seeded:', products.length);

  await User.deleteMany({ email: 'demo@example.com' });
  const hashed = await bcrypt.hash('password123', 10);
  const user = await User.create({ name: 'Demo User', email: 'demo@example.com', password: hashed });
  console.log('Demo user created:', { id: user._id, email: user.email, password: 'password123' });

  console.log('\nSeeding complete!');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => { console.log('Error:', err); process.exit(1); });
