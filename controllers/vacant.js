const Vacant = require('../models/Vacant');

exports.newVacantForm = (req, res) => {
    res.render('newVacant', {
        pageName: 'Nueva Vacante',
        tagLine: 'Completa el formulario para agregar una vacante',
    })
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
        vacant
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