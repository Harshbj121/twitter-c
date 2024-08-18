const express = require('express');
const router = express.Router();
const multer = require('multer');
const UserModel = require("../Models/user_models");
const varifiedToken = require("../Middleware/protected");
const PostModel = require('../Models/post_models');

const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({
    storage: Storage,
    limits: {
        fileSize: 1024 * 1024 * 1
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
            cb(null, true);
        } else {
            cb(null, false);
            res.status(400).json({ error: 'File types not allowed' })
        }
    }
})

router.post('/uploadFile', upload.single('file'), function (req, res) {
    res.json({ "filename": req.file.filename });
})

const downloadFile = (req, res) => {
    const fileName = req.params.filename;
    const path = __basedir + '/uploads';

    res.download(path + fileName, (error) => {
        res.status(500).send({ message: "File cannot be downloade" + error })
    })
}

router.get('/files/:filename', downloadFile)

// to update profile photo of the user
router.post('/uploadFile/:id', varifiedToken, upload.single('file'), async (req, res) => {
    try {
        // Assuming you have a User model with 'profileImage' field to store filename
        const userId = req.params.id;  // Assuming userId is passed in request body

        // Update user's profileImage field in MongoDB
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { profileImg: req.file.filename }, { new: true });
        res.json(updatedUser);
    } catch (error) {
        console.error('Error uploading file and updating user profile:', error);
        res.status(500).json({ error: 'Failed to upload file and update profile' });
    }
});

router.post("/createtweet", varifiedToken, upload.single('image'), (req, res) => {
    const { description } = req.body;
    const image = req.file ? req.file.filename : null; // Check if image file was uploaded

    if (!description.trim() && !image) {
        return res.status(400).json({ error: "Write something to tweet" });
    }

    const postObj = new PostModel({
        description: description,
        image: image,
        author: req.user // Assuming req.user contains user information from authentication middleware
    });

    postObj.save()
        .then(newPost => {
            res.status(201).json({ post: newPost });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Failed to create tweet' });
        });
});

module.exports = router;