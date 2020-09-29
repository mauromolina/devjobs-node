const Vacant = require('../models/Vacant');

exports.newVacantForm = (req, res) => {
    res.render('newVacant', {
        pageName: 'Nueva Vacante',
        tagLine: 'Completa el formulario para agregar una vacante',
        logOut: true,
        name: req.user.name,
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
    });
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