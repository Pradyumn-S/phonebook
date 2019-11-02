const express = require('express');
const passport = require('passport');
const { auth, noAuth }= require('../middleware/auth');
const Contact = require('../models/contact');

const router = express.Router();

router.get('/', auth, (req, res) => {
    res.render('index');
});

router.get('/login', noAuth, async (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/register', noAuth, (req, res) => {
    res.render('register');
});

router.get('/edit/:id', auth, async (req, res) => {
    try {
        const contact = await Contact.findOne({
            _id: req.params.id,
            author: req.user.id
        });
        if(!contact) {
            res.render('404');
        }
        res.render('editContact', contact);
    } catch(e) {
        console.log(e);
        res.render('500');
    };
});

router.get('/logout', auth, (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;