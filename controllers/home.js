

exports.showJobs = (req, res) => {
    res.render('home', {
        pageName: 'Inicio',
        tagLine: 'Encontrá y publicá trabajos para desarrolladores web!',
        bar: true,
        btn: true
    })
}