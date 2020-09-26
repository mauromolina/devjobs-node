

exports.newVacantForm = (req, res) => {
    res.render('newVacant', {
        pageName: 'Nueva Vacante',
        tagLine: 'Completa el formulario para agregar una vacante',
    })
}

exports.newVacant = (req, res) => {
    console.log(req.body);
    res.send('Ingresaste: ', title);
}