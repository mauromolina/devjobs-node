const passport = require('passport');

exports.authUser = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});