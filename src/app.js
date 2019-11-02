const path = require('path');

const express = require('express');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

require('./db/db');

const initializePassport = require('./utils/passport-config');
const userRouter = require('./routes/user');
const contactRouter = require('./routes/contact');
const siteRouter = require('./routes/site')

const app = express();
const port = 3000;

// define path for express config
const publicDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../views');

// setup views
app.set('view engine', 'ejs');
app.set('views', viewsPath);

// setup static directory to serve
app.use(express.static(publicDirPath));

// setup parser
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(methodOverride('_method'));

// setup passport
initializePassport(passport);
app.use(flash());
app.use(session({
    secret: 'pradyumn',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// setting up routes
app.use(userRouter);
app.use(contactRouter);
app.use(siteRouter);

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});