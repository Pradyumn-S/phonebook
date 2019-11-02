const mongoose = require('mongoose');
const validator = require('validator');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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

// remove image before sending json
contactSchema.methods.toJSON = function() {
    const contact = this;
    const contactObject = contact.toObject();
    delete contactObject.avatar;
    
    return contactObject;
}
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;