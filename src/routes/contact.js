const express = require('express');
const Contact = require('../models/contact');
// const auth = require('../middleware/auth');

const router = express.Router();

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return cb(new Error('file format should be .jpg, .jpeg or .png'));
        }
        cb(undefined, true);
    }
});

router.post('/contact', auth, upload, async (req, res) => {
    try {
        const contact = new Contact({
            ...req.body,
            author: req.user._id
        });
        
        await contact.save();
        res.status(201).send(task);
    } catch(e) {
        res.send(400).send(e);
    };
});

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt&order=desc
router.get('/contacts', auth, async (req, res) => {
    const sort = {};

    if(req.query.sortBy && req.query.order) {
        sort[req.query.sortBy] = req.query.order === 'desc'? -1: 1;
    }

    try {
        await req.user.populate({
            path: 'contacts',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            },
        }).execPopulate();
        res.send(req.user.contacts);
    } catch(e) {
        res.status(500).send();
    };
});

router.get('/contacts/:id', auth, async (req, res) => {    
    try {
        const contact = await Contact.findOne({
            _id: req.params.id,
            author: req.user._id
        });
        if(!contact) {
            return res.status(404).send();
        }
        res.send(contact);
    } catch(e) {
       res.status(500).send();
    };
});

router.patch('/contacts/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['firstName', 'lastName', 'phone', 'email'];
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
        contact.save();
        res.send(contact);
    } catch(e) {
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

module.exports = router;