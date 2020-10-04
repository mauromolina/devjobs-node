const Vacant = require('../models/Vacant');
const multer = require('multer');
const shortid = require('shortid');

exports.newVacantForm = (req, res) => {
    res.render('newVacant', {
        pageName: 'Nueva Vacante',
        tagLine: 'Completa el formulario para agregar una vacante',
        logOut: true,
        name: req.user.name,
        img: req.user.image
    })
}

exports.validateVacant = (req, res, next) => {

    req.sanitizeBody('title').escape();
    req.sanitizeBody('company').escape();
    req.sanitizeBody('location').escape();
    req.sanitizeBody('salary').escape();
    req.sanitizeBody('contract').escape();
    req.sanitizeBody('skills').escape();

    req.checkBody('title', 'El título es obligatorio').notEmpty();
    req.checkBody('company', 'La empresa es obligatoria').notEmpty();
    req.checkBody('location', 'La ubicación es obligatoria').notEmpty();
    req.checkBody('contract', 'Selecciona un tipo de contrato').notEmpty();
    req.checkBody('skills', 'Agrega como mínimo un conocimiento').notEmpty();

    const errors = req.validationErrors();

    if(errors){
        req.flash('error', errors.map( error => error.msg));
        res.render('newVacant', {
            pageName: 'Nueva vacante',
            tagLine: 'Completa el formulario para agregar una vacante',
            msg: req.flash(),
            logOut: true,
            name: req.user.name,
            img: req.user.image
        })
        return;
    }

    next();

}

exports.newVacant = async (req, res) => {
    const vacant = new Vacant(req.body);
    vacant.skills = req.body.skills.split(',');
    vacant.author = req.user._id;
    const newVacant = await vacant.save();
    res.redirect(`/vacancies/${newVacant.url}`);
}

exports.getVacant = async (req, res, next) => {
    const vacant = await Vacant.findOne({
        url: req.params.url
    }).populate('author');
    if(!vacant) return next();
    res.render('vacant', {
        pageName: vacant.title,
        bar: true,
        vacant
    });
}

exports.editVacantForm = async (req, res, next) => {
    const vacant = await Vacant.findOne({
        url: req.params.url
    });
    if(!vacant) return next();
    res.render('editVacant', {
        pageName: ` Editar - ${vacant.title}`,
        vacant,
        logOut: true,
        name: req.user.name,
        img: req.user.image
    });
}

exports.editVacant = async (req, res)  => {
    const updatedVacant = req.body;
    updatedVacant.skills = req.body.skills.split(',');
    const vacant = await Vacant.findOneAndUpdate({
        url: req.params.url
    }, updatedVacant, {
        new: true,
        runValidators: true
    });
    res.redirect(`/vacancies/${vacant.url}`);
}

exports.deleteVacant = async (req, res) => {

    const { id } = req.params;

    const vacant = await Vacant.findById(id);

    if(verifyAuthor(vacant, req.user)){

        vacant.remove();
        res.status(200).send('La vacante se eliminó correctamente');
        
    } else {

        res.status(403).send('Error');

    }


}

const verifyAuthor = (vacant = {}, user = {}) => {

    if(!vacant.author.equals(user._id)){
        return false;
    }
    return true;

}

const multerConfig = {
    limits: { fileSize : 100000},
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname+'../../public/upload/cv')
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        } 
    }),
    fileFilter(req, file, cb) {
        if(file.mimetype === 'application/pdf'){
            cb(null, true) // valid file
        } else {
            cb(new Error('Formato de imágen no válido')); // invalid file
        }
    }
}

const upload = multer(multerConfig).single('cv');

exports.loadCv = (req, res, next) => {
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
            res.redirect('back');
            return;
        } else {
            return next();
        }
    });
}

exports.contactRecruiter = async (req, res, next) => {

    const vacant = await Vacant.findOne( { url: req.params.url });
    const { name, email, cv } = req.body;
    if(!vacant) return next();
    const candidate = {
        name,
        email,
        cv: req.file.filename
    }
    vacant.candidates.push(candidate);
    await vacant.save();
    req.flash('correcto', 'Tu CV se envió correctamente');
    res.redirect('/');
}

exports.getCandidates = async (req, res) => {
    const vacant = await Vacant.findById(req.params.id);

    if(vacant.author != req.user._id.toString()){
        return next()
    }

    if(!vacant) return next();

    res.render('candidates', {
        pageName: `Candidatos para ${vacant.title}`,
        logOut: true,
        name: req.user.name,
        img: req.user.image,
        candidates: vacant.candidates
    })
}

exports.searchVacants = async (req, res) => {
    const vacants = await Vacant.find({
        $text: {
            $search: req.body.q
        }
    });
    res.render('home', {
        pageName: `Resultados para la búsqueda: ${req.body.q}`,
        bar: true,
        vacants
    });
}