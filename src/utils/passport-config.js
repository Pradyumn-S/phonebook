const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

const initialize = (passport) => {
    const authenticateUser = async (username, password, done) => {
        try {
            const user = await User.findByCredentials(username, password);
            if(!user) {
                return done(undefined, false, { message: 'Invalid username or password' });
            }
            return done(undefined, user);
        } catch(e) {
            done(e);
        }        
    };

    passport.use(new LocalStrategy(authenticateUser));
    passport.serializeUser((user, done) => done(undefined, user._id));;
    passport.deserializeUser(async (id, done) => done(undefined, User.findById(id)));
};

module.exports = initialize;