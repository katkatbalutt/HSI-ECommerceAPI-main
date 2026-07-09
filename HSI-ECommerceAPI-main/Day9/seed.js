const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (q) => new Promise(r => rl.question(q, r));

const userSchema = new mongoose.Schema({ name: String, email: { type: String, unique: true }, password: String });
const User = mongoose.model('User', userSchema);

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected\n');

  const name = await question('Enter name: ');
  const email = await question('Enter email: ');
  const password = await question('Enter password (min 6 chars): ');

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  console.log('\nUser created:', { id: user._id, name: user.name, email: user.email });

  const all = await User.find().select('-password');
  console.log('All users in DB:', all);

  await mongoose.disconnect();
  rl.close();
}

main().catch(err => console.log('Error:', err) && rl.close());
