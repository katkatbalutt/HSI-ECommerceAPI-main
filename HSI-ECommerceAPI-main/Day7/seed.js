// Same with day 6 since MongoDB is already connected.
const mongoose = require('mongoose');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (q) => new Promise(r => rl.question(q, r));

const userSchema = new mongoose.Schema({ name: String, email: String });
const User = mongoose.model('User', userSchema);

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected\n');

  const name = await question('Enter name: ');
  const email = await question('Enter email: ');

  const user = await User.create({ name, email });
  console.log('\nUser created:', user);

  const all = await User.find();
  console.log('All users in DB:', all);

  await mongoose.disconnect();
  rl.close();
}

main().catch(err => console.log('Error:', err) && rl.close());
