const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const Fuse = require('fuse.js');
const Contact = require('../models/contact');
const { auth } = require('../middleware/auth');

const router = express.Router();

const upload = multer();

router.post('/contacts', auth, upload.single('avatar'), async (req, res) => {
    try {
        const contact = new Contact({
            ...req.body,
            author: req.user._id
        });

        if(req.file) {
            const buffer = await sharp(req.file.buffer).resize({height: 250, width: 250}).png().toBuffer();
            contact.avatar = buffer;
        }
        await contact.save();
        res.status(201).send(contact);
    } catch(e) {
        console.log(e);
        res.send(400).send(e);
    };
});

router.get('/contacts', auth, async (req, res) => {
    const sort = {};

    if(req.query.sortBy && req.query.order) {
        sort[req.query.sortBy] = req.query.order === 'desc'? -1: 1;
    }

    try {
        let contacts = await Contact.find(
            { author: req.user._id },
            undefined,
            { sort }
        );
        if (req.query.search) {
            const options = {
                shouldSort: true,
                threshold: 0.4,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: [
                    "name",
                    "phone",
                    "email"
                ]
            };
            const fuse = new Fuse(contacts, options);
            const result = fuse.search(req.query.search);
            return res.send(result);
        }
        res.send(contacts);
    } catch(e) {
        console.log(e);
        res.status(500).send();
    };
});

router.get('/contacts/:id', auth, async (req, res) => {    
    try {
        const contact = await Contact.findOne({
            _id: req.params.id,
            author: req.user.id
        });
        if(!contact) {
            console.log('no');
            return res.status(404).send();
        }
        res.send(contact);
    } catch(e) {
        console.log(e);
        res.status(500).send();
    };
});

router.patch('/contacts/:id', auth, upload.single('avatar'), async (req, res) => {
    console.log('hello');
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'phone', 'email'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation) {
        return res.status(400).send({error: 'invalid fields'});
    }

    try {
        const contact = await Contact.findOne({
            _id: req.params.id,
            author: req.user._id
        });
        
        if(!contact) {
            return res.status(404).send();
        }

        updates.forEach((update) => contact[update] = req.body[update]);
        if(req.file) {
            const buffer = await sharp(req.file.buffer).resize({height: 250, width: 250}).png().toBuffer();
            contact.avatar = buffer;
        }
        contact.save();
        res.send(contact);
    } catch(e) {
        console.log(e);
        res.status(500).send();
    }
});

router.delete('/contacts/:id', auth, async (req, res) => {
    try {
        const contact = await Contact.findOneAndDelete({
            _id: req.params.id,
            author: req.user._id
        });
        
        if(!contact) {
            return res.status(404).send();
        }
        res.send(contact);
    } catch(e) {
        res.status(500).send();
    }
});

router.get('/contacts/:id/avatar', async (req, res) => {
    try {
        const contact= await Contact.findById(req.params.id);
        if(!contact || !contact.avatar) {
            throw new Error();
        }

        res.set('Content-Type', 'image/png');
        res.send(contact.avatar);
    } catch(e) {
        res.status(404).send();
    }
});

module.exports = router;