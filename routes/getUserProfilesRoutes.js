var express = require('express'), router = express.Router();
const db = require('../database/dbGeneral.js');


router.route('/userProfileInfo')

    .get( (req, res) => {
        let requestedId;
        if (req.query.otherUserId) {
            if (req.query.otherUserId == req.session.user.userId) {
                res.json({
                    redirect: true,
                });
                return;
            } else {
                requestedId = req.query.otherUserId;
            }
        } else {
            requestedId = req.session.user.userId;
        }
        db.getUserProfileInfo(requestedId).then(function(userInfo) {
            if (!userInfo.rows[0]) {
                res.json({
                    noUser: true
                });
                return;
            } else {
                db.getAllProfileFeed(requestedId).then((feedPosts) => {
                    let userProfileInfo = {
                        userId: userInfo.rows[0].id,
                        firstName: userInfo.rows[0].first_name,
                        lastName: userInfo.rows[0].last_name,
                        profilePicUrl: userInfo.rows[0].profile_pic_url,
                        profileBio: userInfo.rows[0].description,
                        hobbies: userInfo.rows[0].hobbies,
                        feedPosts: feedPosts.rows,
                    };
                    res.json({
                        success: true,
                        result: userProfileInfo
                    });
                })
            }
        }).catch(function(err) {
            res.json({
                error: true
            });
            console.log(err);
        });
    });

router.route('/getAllUserNames')

    .get( (req, res) => {
        db.getAllUserNames().then((result) => {
            let databaseResult = result.rows;
            let usernames = [], usernameIds = [];
            for (var i = 0; i < databaseResult.length; i++) {
                let userObj = databaseResult[i];
                let name = '';
                for (var key in userObj) {
                    if (key == 'first_name' || key == 'last_name') {
                        name += userObj[key] + ' ';
                    } else if (key == 'id') {
                        usernameIds.push(userObj[key]);
                    }
                }
                usernames.push(name.toLowerCase());
            }
            res.json({
                success: true,
                usernames: usernames
            });
        }).catch((err) => {
            console.log(err);
            res.json({
                success: false
            });
        });
    });


module.exports = router;
