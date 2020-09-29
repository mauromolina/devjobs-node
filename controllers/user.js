const User = require('../models/User');
const { body, validationResult } = require('express-validator');

exports.createAccountForm = (req, res) => {
    res.render('newAccount', {
        pageName: 'Nueva cuenta',
        tagLine: 'Creá tu cuenta y empezá a publicar tus vacantes gratis en devJobs'
    });
}

exports.validateRegistration = (req, res, next) => {
    
    req.sanitizeBody('name').escape();
    req.sanitizeBody('email').escape();
    req.sanitizeBody('password').escape();
    req.sanitizeBody('confirm').escape();

    req.checkBody('name', 'El nombre es obligatorio').notEmpty();
    req.checkBody('email', 'El email debe ser válido').isEmail();
    req.checkBody('password', 'La contraseña es obligatoria').notEmpty();
    req.checkBody('confirm', 'La confirmación es obligatoria').notEmpty();

    req.checkBody('confirm', 'Las contraseñas no coinciden').equals(req.body.password);
    
    const errors = req.validationErrors();

    if(errors){
        req.flash('error', errors.map( error => error.msg));
        res.render('newAccount', {
            pageName: 'Nueva cuenta',
            tagLine: 'Creá tu cuenta y empezá a publicar tus vacantes gratis en devJobs',
            msg: req.flash(),
        })
        return;
    }

    next();
}

exports.createAccount = async (req, res, next) => {
    const user = new User(req.body);
    try {
        const newUser = await user.save();
        res.redirect('/login');
    } catch (error) {
        req.flash('error', error);
        res.redirect('/newAccount');
    }
    if(!newUser) return next();
}

exports.loginForm = (req, res) => {
    res.render('login', {
        pageName: 'Iniciar sesión en devJobs'
    })
}

exports.editProfileForm = (req, res) => {

    res.render('editProfile', {
        pageName: 'Editar Perfil',
        user: req.user,
        logOut: true,
        name: req.user.name
    });

}

exports.validateProfile = (req, res, next) => {

    req.sanitizeBody('name').escape();
    req.sanitizeBody('email').escape();
    if(req.body.password){
        req.sanitizeBody('password').escape();
    }
    req.checkBody('name', 'El nombre es obligatorio').notEmpty();
    req.checkBody('email', 'El email debe ser válido').isEmail();

    const errors = req.validationErrors();

    if(errors){
        req.flash('error', errors.map( error => error.msg));
        res.render('editProfile', {
            pageName: 'Editar Perfil',
            user: req.user,
            logOut: true,
            name: req.user.name,
            msg: req.flash()
        });
        return;
    }

    next();

}

exports.editProfile = async (req, res) => {

    const user = await User.findById(req.user._id);

    user.name = req.body.name;
    if(req.body.password){
        user.password = req.body.password
    }
    await user.save();
    req.flash('correcto', 'Los cambios se guardaron correctamente')

    res.redirect('/admin');

}