const mongoose = require('mongoose');
const db = require('./config/db');
const express = require('express');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const router = require('./routes');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config({ path: 'variables.env'});
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const passport = require('./config/passport');
const createError = require('http-errors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(expressValidator());

app.engine('.hbs', 
    exphbs({
        handlebars: allowInsecurePrototypeAccess(handlebars),
        defaultLayout: 'layout',
        extname: '.hbs',
        helpers: require('./helpers/hbs')
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

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use( (req, res, next) => {
    res.locals.msg = req.flash();
    next();
})

app.use('/', router());

//error 404
app.use( (req, res, next) => {
    next(createError('404', 'Página no encontrada'));
});

app.use( (error, req, res, next) => {
    res.locals.message = error.message;
    const status = error.status || 500;
    res.locals.status = status;
    res.status(status);
    res.render('error');
})

app.listen(process.env.PORT);