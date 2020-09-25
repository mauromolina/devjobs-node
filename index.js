const express = require('express');
const exphbs = require('express-handlebars');
const router = require('./routes');
const path = require('path')

const app = express();

app.engine('.hbs', 
    exphbs({
        defaultLayout: 'layout',
        extname: '.hbs'
    })
);

app.set('view engine', '.hbs');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router());

app.listen(5000);