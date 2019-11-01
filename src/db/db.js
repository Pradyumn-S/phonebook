const mongoose = require('mongoose');
const dbURL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/phonebook';

mongoose.connect(dbURL , {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});