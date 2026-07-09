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

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));