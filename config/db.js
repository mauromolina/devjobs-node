const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'});

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
});

mongoose.connection.on('error', error => {
    console.log(error);
})

// importar modelos 
require('../models/Vacant');