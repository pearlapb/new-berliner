var express = require('express'), router = express.Router();
const db = require('../database/dbGeneral.js');

router.route('/postToProfileFeed')

    .post( (req, res) => {
        console.log(req.body);
        db.postToProfileFeed(req.body.profileId, req.session.user, req.body.message).then(() => {
            db.getAllProfileFeed(req.body.profileId).then((results) => {
                console.log(results);
                res.json({ results: results.rows });
            });
        });
    });

router.route('/getProfileFeed')

    .get( (req, res) => {
        db.getAllProfileFeed(req.session.user.userId).then((feedPosts) => {
            let feed =  feedPosts.rows;
            res.json({
                success: true,
                feedPosts: feed
            });
        });
    });


module.exports = router;
