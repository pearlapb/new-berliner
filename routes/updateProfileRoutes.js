var express = require('express'), router = express.Router();
const db = require('../database/dbGeneral.js');
const s3 = require('../config/toS3.js');
const path = require('path');

const multer = require('multer');
var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, path.resolve(__dirname, '../uploads')); // use path.resolve so that multer can read the url
    },
    filename: function(req, file, callback) {
        callback(null, Date.now() + '_' + Math.floor(Math.random() * 99999999) + '_' + file.originalname);
    }
});
var uploader = multer({
    storage: diskStorage,
    limits: {
        filesize: 2097152
    }
});


router.route('/uploadProfilePicture')

    .post( uploader.single('file'), (req, res) => {
        if (req.file) {
            s3.makeS3Request( req, res, () => {
                db.saveImageS3UrlToDb(req.file, req.session.user).then(function(result) {
                    res.json({
                        success: true,
                        file: result
                    });
                }).catch(function(err) {
                    console.log(err);
                });
            })
        } else {
            res.json({ error: true });
        }
    });

router.route('/updateUserBio')

    .post( (req, res) => {
        db.updateUserBio(req.body.bioText, req.session.user).then(function(result) {
            res.json({
                success: true,
                bio: result.rows[0].description
            });
        }).catch(function(err) {
            console.log(err);
            res.json({ error: true });
        });
    });

router.route('/updateUserHobbies')

    .post( (req, res) => {
        console.log(req.body.hobbiesText);
        db.updateUserHobbies(req.body.hobbiesText, req.session.user).then(function(result) {
            res.json({
                success: true,
                hobbies: result.rows[0].hobbies
            });
        }).catch(function(err) {
            console.log(err);
        });
    });


module.exports = router;
