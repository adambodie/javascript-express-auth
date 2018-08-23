const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name:{
        type: String,
        required: true,
        trim: true
    },
    dreamdestination:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true
    }  
});

// hash password before saving
UserSchema.pre('save', function(next){
    var user = this;
    bcrypt.hash(user.password, 10, function(err, hash){
        if(err) {
            return next(err);
        }
        user.password = hash;
        next();
        
    })
})
const User = mongoose.model('User', UserSchema);
module.exports = User;