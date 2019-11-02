const express = require('express');
const User = require('../models/user');
const { auth } = require('../middleware/auth');

const router = express.Router();


// route to create user
router.post('/users', async (req, res) => {
    try {
        console.log(req.body);
        const user = new User(req.body);
        await user.save();
        req.flash('success_msg', 'You are registered and can now login');
        res.redirect('/');
    } catch(e) {
        res.status(400).send(e);
    }
});

// route to get user's own profile
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
}); 

// route for updating user
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation) {
       return  res.status(400).send({error: 'invalid fields'});
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch(e) {
        res.status(500).send(e);
    }
});

// route for deleting user
router.delete('/users/me', auth, async (req, res) => {
    try {
        sendMail.cancel(req.user.email, req.user.name);
        await req.user.remove();
        res.send(req.user);
    } catch(e) {
        res.status(500).send();
    }
});

module.exports = router;