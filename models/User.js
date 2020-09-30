const mongoose = require('mongoose');
const slug = require('slug');
const shortid = require('shortid');
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    token: String,
    expires: Date,
    image: String

});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')){
        return next();
    }
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
})

userSchema.post('save', function(error, doc, next){
    if(error.name === 'MongoError' && error.code === 11000){
        next('Ya existe una cuenta con ese email');
    } else {
        next(error);
    }
})

userSchema.methods = {
    comparePassword: function(password) {
        return bcrypt.compareSync(password, this.password);
    }
}


module.exports = mongoose.model('User', userSchema);