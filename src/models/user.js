const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const Contact = require('./contact')

const userSchema = new mongoose.Schema({
    username: {
       type: String,
       trim: true,
       required: true,
       unique: true
    },
    email: {
        type: String,
        unique: true,
        toLowerCase: true,
        trim: true,
        required: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('invalid email');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7
    },
});

userSchema.virtual('contact', {
    ref: 'Contact',
    localField: '_id',
    foreignField: 'author'
});

// removing password before sending json
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

// adding function for login/authentication
userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({ username });
    if(!user) {
        throw new Error('unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        throw new Error('unable to login');
    }

    return user;
};


userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({ username });
    if(!user) {
        throw new Error('unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        throw new Error('unable to login');
    }
    return user;
}

// hashing password before saving
userSchema.pre('save', async function(next) {
    const user = this;
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.pre('delete', async function(next) {
    const user = this;
    await Contact.deleteMany({ author: user._id });
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;