const express = require('express');
const path = require('path');
const app = express();
const PORT = 8000;

app.engine('html', require('ejs').renderFile);
app.set('views', __dirname);

app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => res.render('html/index.html', { title: 'Hey', message: 'Hello there!' }));

app.listen(PORT);