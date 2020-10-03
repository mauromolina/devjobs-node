const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const shortid = require('shortid');

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
        name: req.user.name,
        img: req.user.image
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
            msg: req.flash(),
            img: req.user.image
        });
        return;
    }

    next();

}

const multerConfig = {
    limits: { fileSize : 100000},
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname+'../../public/upload/profiles')
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        } 
    }),
    fileFilter(req, file, cb) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
            cb(null, true) // valid file
        } else {
            cb(new Error('Formato de imágen no válido')); // invalid file
        }
    }
}

const upload = multer(multerConfig).single('image');

exports.loadImage = (req, res, next) => {
    upload(req, res, function(error){
        if(error){
            if(error instanceof multer.MulterError){
                if(error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo supera los 100kb');
                } else {
                    req.flash('error', error.message);
                }
            } else {
                req.flash('error', error.message)
            }
            res.redirect('/admin');
            return;
        } else {
            return next();
        }
    });
}

exports.editProfile = async (req, res) => {

    const user = await User.findById(req.user._id);

    user.name = req.body.name;
    if(req.body.password){
        user.password = req.body.password
    }

    if(req.file){
        user.image = req.file.filename;
    }
    

    await user.save();
    req.flash('correcto', 'Los cambios se guardaron correctamente')
    return res.redirect('/admin');

}


