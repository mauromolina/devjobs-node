const passport = require('passport');
const Vacant = require('../models/Vacant');

exports.authUser = passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

exports.logOut = (req, res) => {
    req.logout();
    req.flash('correcto', 'Se cerró correctamente la sesión')
    return res.redirect('/login')
}

exports.verifyUser = (req, res, next) => {

    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');

}

exports.showAdminPanel = async (req, res) => {

    const vacants = await Vacant.find({
        author: req.user._id
    });

    res.render('adminPanel', {
        pageName: 'Panel de Administración',
        tagLine: 'Creá y administrá tus vacantes',
        logOut: true,
        name: req.user.name,
        vacants
    })
}