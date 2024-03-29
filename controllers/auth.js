const passport = require('passport');
const Vacant = require('../models/Vacant');
const User = require('../models/User');
const crypto = require('crypto')
const sendEmail = require('../handlers/email');

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
        img: req.user.image,
        vacants
    })
}

exports.forgotPasswordForm = (req, res) => {
    res.render('restorePassword', {
        pageName: 'Reestablecer contraseña',
        tagLine: 'Si tenés una cuenta pero olvidaste tu contraseña, colocá tu email'
    })
}

exports.sendToken = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({
        email
    });
    if(!user){
        req.flash('No existe ese usuario')
        res.redirect('/login');
        return;
    }
    user.token = crypto.randomBytes(20).toString('hex');
    user.expires = Date.now() + 3600000;
    await user.save();
    const resetUrl = `http://${req.headers.host}/forgotPassword/${user.token}`;
    await sendEmail.send({
        user,
        subject: 'Reestablecer contraseña',
        resetUrl,
        file: 'reset'
    });
    req.flash('correcto', 'Se envió un correo a tu email para reestablecer tu contraseñas')
    res.redirect('/login'); 

}

exports.restorePassword = async (req, res) => {
    const user = await User.findOne({
        token: req.params.token,
        expires:  {
            $gt : Date.now()
        }
    });

    if(!user){
        req.flash('error', 'El formulario ya expiró. Intenta de nuevo');
        res.redirect('/forgotPassword');
    }
    res.render('newPassword', {
        pageName: 'Modificá tu contraseña'
    })
}

exports.saveNewPassword = async (req, res) => {
    const user = await User.findOne({
        token: req.params.token,
        expires: {
            $gt: Date.now()
        }
    });
    if(!user){
        req.flash('error', 'El formulario ya expiró. Intenta de nuevo');
        res.redirect('/forgotPassword');
    }
    user.password = req.body.password;
    user.token = undefined;
    user.expires = undefined;
    user.save();
    req.flash('correcto', 'La contraseña se modificó exitosamente');
    res.redirect('/login');
}