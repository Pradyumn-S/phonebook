const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

const initialize = (passport) => {
    const authenticateUser = async (username, password, done) => {
        try {
            const user = await User.findByCredentials(username, password);
            return done(undefined, user);
        } catch(e) {
            return done(undefined, false, { message: 'Invalid username or password' });
        }
    };
    
    passport.use(new LocalStrategy(authenticateUser));
    passport.serializeUser((user, done) => done(undefined, user.id));;
    passport.deserializeUser(async (id, done) => done(undefined, await User.findById(id)));
};

module.exports = initialize;