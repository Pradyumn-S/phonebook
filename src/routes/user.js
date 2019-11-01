const express = require('express');
const User = require('../models/user');
const multer = require('multer');
const sharp = require('sharp');

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

// route to create user
router.post('/users', upload.single('avatar'), async (req, res) => {
    try {
        const user = new User(req.body);
        if(req.file.buffer) {
            const buffer = await sharp(req.file.buffer).resize({height: 250, width: 250}).png().toBuffer();
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
            }); user.avatar = buffer;
        }
        await user.save();
        sendMail.welcome(user.email, user.name);
        res.status(201).send({ user, token });
    } catch(e) {
        res.status(400).send(e);
    }
});

// route to get user's own profile
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
}); 

// route for updating user
router.patch('/users/me', auth, upload.single('avatar'), async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation) {
       return  res.status(400).send({error: 'invalid fields'});
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        if(req.file.buffer) {
            const buffer = await sharp(req.file.buffer).resize({height: 250, width: 250}).png().toBuffer();
            req.user.avatar = buffer;
        }
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

// route for user login
// router.post('/users/login', async (req, res) => {
//     try {
//         const user = await User.findByCredentials(req.body.email, req.body.password);
//         const token = await user.generateAuthToken();
//         res.send({ user, token });
//     } catch(e) {
//         res.status(400).send();
//     }
// });

// // route for logging out
// router.post('/users/logout', auth, async (req, res) => {
//     try {
//         req.user.tokens = req.user.tokens.filter((token) => {
//             return token.token != req.token;
//         });
//         await req.user.save();
//         res.send();
//     } catch(e) {
//         res.status(500).send();
//     }
// });

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar) {
            throw new Error();
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch(e) {
        res.status(404).send();
    }
})

module.exports = router;