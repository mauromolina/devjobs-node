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
    const newVacant = await vacant.save();
    res.redirect(`/vacancies/${newVacant.url}`);
}

exports.getVacant = (req, res) => {
    res.send('Vacante creada!');
}