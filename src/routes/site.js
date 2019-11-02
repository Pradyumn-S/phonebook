const express = require('express');
const passport = require('passport');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, (req, res) => {
    res.send('hello world');
});

router.get('/login', async (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/register', (req, res) => {
    res.render('register');
})

module.exports = router;