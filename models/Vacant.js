const mongoose = require('mongoose');
const slug = require('slug');
const shortid = require('shortid');

const vacantSchema = mongoose.Schema({
    title: {
        type: String,
        required: 'El nombre de la vacante es obligatorio',
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true,
        required: 'La ubicación es obligatoria'
    },
    salary: {
        type: String,
        default: 0
    },
    contract: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    url: {
        type: String,
        lowercase: true
    },
    skills: [String],
    candidates: [{
        name: String,
        email: String,
        cv: String
    }],
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'El autor es obligatorio'
    }

});

vacantSchema.pre('save', function(next) {

    const url = slug(this.title);
    this.url = `${url}-${shortid.generate()}`;

    next();
})

module.exports = mongoose.model('Vacant', vacantSchema);