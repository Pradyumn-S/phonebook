const mongoose = require('mongoose');
const validator = require('validator');

const contactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        validate(value) {
            if(!validator.isNumeric(value)) {
                throw new Error('invalid phone');
            }
        }
    },
    email: {
        type: String,
        toLowerCase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('invalid email');
            }
        }
    },
    avatar: {
        type: Buffer
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;