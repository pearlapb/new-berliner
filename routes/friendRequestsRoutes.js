var express = require('express'), router = express.Router();
const db = require('../config/dbFriendReq.js');
const dbProfiles = require('../config/dbGeneral.js');

router.route('/getAllPendingRequests')

    .get( (req, res) => {
        db.getAllPendingRequests(req.session.user).then((result) => {
            let senderIds = result.rows.map(function(userResult) {
                return userResult.sender_id;
            });
            dbProfiles.getManyProfileSummaries(senderIds).then((summaryResults) => {
                res.json({ results: summaryResults });
            }).catch((err) => {
                console.log(err);
                res.json({ error: true });
            });
        }).catch((err) => {
            console.log(err);
            res.json({ error: true });
        });
    });

router.route('/getAllFriends')

    .get( (req, res) => {
        db.getAllFriends(req.session.user).then((result) => {
            let friendIds = result.rows.map(function(friendResult) {
                if (friendResult.sender_id == req.session.user.userId) {
                    return friendResult.recipient_id;
                } else {
                    return friendResult.sender_id;
                }
            });
            dbProfiles.getManyProfileSummaries(friendIds).then((summaryResults) => {
                res.json({ results: summaryResults });
            }).catch((err) => {
                console.log(err);
                res.json({ error: true });
            });
        }).catch((err) => {
            console.log(err);
            res.json({ error: true });
        });
    });

router.route('/getFriendStatus')

    .get( (req, res) => {
        const requestedId = req.query.otherUserId;
        db.getFriendStatus(requestedId, req.session.user).then((result) => {
            if (!result.rows[0]) {
                res.json({ noRelation: true, results: result });
            } else if (result.rows[0]) {
                if (result.rows[0].status == "pending") {
                    if (result.rows[0].sender_id == req.session.user.userId) {
                        res.json({ pendingRequest: true, results: result.rows[0] });
                    } else {
                        res.json({ pendingAnswer: true, results: result.rows[0] });
                    }
                } else if (result.rows[0].status == "cancelled") {
                    res.json({ cancelled: true, results: result.rows[0] });
                } else if (result.rows[0].status == "accepted") {
                    res.json({ accepted: true, results: result.rows[0] });
                } else if (result.rows[0].status == "rejected") {
                    res.json({ rejected: true, results: result.rows[0] });
                } else if (result.rows[0].status == "terminated") {
                    res.json({ terminated: true, results: result.rows[0] });
                }
            }
        }).catch((err) => {
            console.log(err);
            res.json({ err: true });
        });
    });

router.route('/sendFriendRequest')

    .post( (req, res) => {
        const requestedId = req.body.otherUserId, friendStatus = req.body.friendStatus;
        db.sendFriendRequest(requestedId, req.session.user, friendStatus).then(() => {
            res.json({ status: 'pendingRequest' });
        }).catch((err) => {
            console.log(err);
            res.json({ error: true });
        });
    });

router.route('/cancelFriendRequest')

    .post( (req, res) => {
        const requestedId = req.body.otherUserId;
        console.log(requestedId);
        db.cancelFriendRequest(requestedId, req.session.user).then(() => {
            res.json({ status: 'cancelled' });
        }).catch((err) => {
            console.log(err);
            res.json({ error: true });
        });
    });

router.route('/acceptFriendRequest')

    .post( (req, res) => {
        const requestedId = req.body.otherUserId;
        db.acceptFriendRequest(requestedId, req.session.user).then(() => {
            res.json({ status: 'accepted' });
        }).catch((err) => {
            console.log(err);
            res.json({ error: true });
        });
    });

router.route('/rejectFriendRequest')

    .post( (req, res) => {
        console.log('hello');
        const requestedId = req.body.otherUserId;
        db.rejectFriendRequest(requestedId, req.session.user).then(() => {
            res.json({ status: 'rejected' });
        }).catch((err) => {
            console.log(err);
            res.json({ error: true });
        });
    });

router.route('/unFriend')

    .post( (req, res) => {
        const requestedId = req.body.otherUserId;
        db.unFriend(requestedId, req.session.user).then(() => {
            res.json({ status: 'terminated' });
        }).catch((err) => {
            console.log(err);
            res.json({ error: true });
        });
    });


module.exports = router;
