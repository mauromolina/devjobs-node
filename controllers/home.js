const Vacant = require('../models/Vacant');

exports.showJobs = async (req, res, next) => {

    const vacants = await Vacant.find();
    console.log(vacants);

    if(!vacants) return next();

    res.render('home', {
        pageName: 'Inicio',
        tagLine: 'Encontrá y publicá trabajos para desarrolladores web!',
        bar: true,
        btn: true,
        vacants
    })
}