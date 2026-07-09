//Day 3 -npm & modules
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    console.log('Get / was visited');
     res.send('You are now at home');
    });
app.post('/', (req, res) => res.send('You are now at home'));

app.get('/about', (req, res) => {
    res.send('You are now at about');
    console.log('Get /about was visited');
    });
app.post('/about', (req, res) => res.send('You are now at about'));

app.get('/contact', (req, res) => {
    console.log('Get /contact was visited');
    res.send('You are now at contact');
    });
app.post('/contact', (req, res) => res.send('You are now at contact'));

// Day - 4 REST API Basics 
let users = [
    { id: 1, name: 'Jason Calalo', email: 'jcalalo@gmail.com' },
    { id: 2, name: 'Barack Obema', email: 'obema@gmail.com'}
]; 

app.get('/users', (req, res) => res.json(users));

app.post('/users', (req, res) => {
  const user = { id: users.length + 1, ...req.body };
  users.push(user);
  res.status(201).json(user);
});

// Day 5 - CRUD API with Express
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ message: 'User not found' });
  users[index] = { ...users[index], ...req.body, id };
  res.json(users[index]);
});

app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ message: 'User not found' });
  users.splice(index, 1);
  res.status(204).send();
});

// Task Manager - Full CRUD
let tasks = [
  { id: 1, title: 'Learn Express', completed: false },
  { id: 2, title: 'Build CRUD API', completed: false }
];

app.get('/tasks', (req, res) => res.json(tasks));

app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

app.post('/tasks', (req, res) => {
  const task = { id: tasks.length + 1, ...req.body };
  tasks.push(task);
  res.status(201).json(task);
});

app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ message: 'Task not found' });
  tasks[index] = { ...tasks[index], ...req.body, id };
  res.json(tasks[index]);
});

app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ message: 'Task not found' });
  tasks.splice(index, 1);
  res.status(204).send();
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
