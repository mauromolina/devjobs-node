const mongoose = require('mongoose');
const db = require('./config/db');
const express = require('express');
const exphbs = require('express-handlebars');
const router = require('./routes');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config({ path: 'variables.env'});
const MongoStore = require('connect-mongo')(session);

const app = express();

app.engine('.hbs', 
    exphbs({
        defaultLayout: 'layout',
        extname: '.hbs'
    })
);

app.set('view engine', '.hbs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection : mongoose.connection
    })
}));

app.use('/', router());

app.listen(process.env.PORT);