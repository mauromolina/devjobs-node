const passport = require('passport');
const Vacant = require('../models/Vacant');

exports.authUser = passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

exports.logOut = (req, res) => {
    req.session.destroy( () => {
        res.redirect('/login')
    })
}

exports.verifyUser = (req, res, next) => {

    if(req.isAuthenticated()){
        console.log('autenticado', req.user);
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
        vacants
    })
}