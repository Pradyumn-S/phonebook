if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

const mongoose = require('mongoose');
const dbURL = process.env.MONGODB_URL;

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});