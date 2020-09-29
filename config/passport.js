const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

passport.use( new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    const user = await User.findOne({ email });

    if(!user) return done(null, false, {
        message: 'No existe el usuario'
    });

    const verifyPassword = user.comparePassword(password);
    if(!verifyPassword) return done(null, false, {
        message: 'Contraseña incorrecta'
    });

    return done(null, user);

}));

passport.serializeUser( (user, done) => done(null, user._id));
passport.deserializeUser( async(id, done) => {
    const user = await User.findById(id);
    return done(null, user);
});

module.exports = passport;