var spicedPg = require('spiced-pg');
let dbUrl;
if (!process.env.DATABASE_URL) {
    dbUrl = require('../config/secrets.json').dbUrl;
} else {
    dbUrl = process.env.DATABASE_URL;
}
var db = spicedPg(dbUrl);
var dbGen = require('./dbGeneral.js');

const getFriendStatus = (requestedId, session) => {
    return new Promise((resolve, reject) => {
        const q = `SELECT status, recipient_id, sender_id
                    FROM friend_requests
                    WHERE (recipient_id = $1 OR sender_id = $1)
                    AND (recipient_id = $2 OR sender_id = $2);`;
        const params = [requestedId, session.userId];
        db.query(q, params).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        });
    });
};

const sendFriendRequest = (requestedId, session, friendStatus) => {
    return new Promise((resolve, reject) => {
        if (friendStatus == 'none') {
            const q = `INSERT INTO friend_requests (recipient_id, sender_id, status)
                        VALUES ($1, $2, 'pending')
                        RETURNING status;`;
            const params = [requestedId, session.userId];
            db.query(q, params).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        } else {
            const q = `UPDATE friend_requests
                        SET status = 'pending', recipient_id = $1, sender_id = $2, updated_at = CURRENT_TIMESTAMP
                        WHERE (recipient_id = $1 AND sender_id = $2)
                        OR (recipient_id = $2 AND sender_id = $1)
                        RETURNING status;`;
            const params = [requestedId, session.userId];
            db.query(q, params).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        }
    });
};

const cancelFriendRequest = (requestedId, session) => {
    return new Promise((resolve, reject) => {
        const q = `UPDATE friend_requests
                    SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
                    WHERE recipient_id = $1 AND sender_id = $2
                    RETURNING status;`;
        const params = [requestedId, session.userId];
        db.query(q, params).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        });
    });
};



const acceptFriendRequest = (requestedId, session) => {
    return new Promise((resolve, reject) => {
        const q = `UPDATE friend_requests
                    SET status = 'accepted', updated_at = CURRENT_TIMESTAMP
                    WHERE recipient_id = $2 AND sender_id = $1
                    RETURNING status;`;
        const params = [requestedId, session.userId];
        db.query(q, params).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        });
    });
};

const rejectFriendRequest = (requestedId, session) => {
    return new Promise((resolve, reject) => {
        const q = `UPDATE friend_requests
                    SET status = 'rejected', updated_at = CURRENT_TIMESTAMP
                    WHERE recipient_id = $2 AND sender_id = $1
                    RETURNING status;`;
        const params = [requestedId, session.userId];
        db.query(q, params).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        });
    });
};


const unFriend = (requestedId, session) => {
    return new Promise((resolve, reject) => {
        const q = `UPDATE friend_requests
                    SET status = 'terminated', updated_at = CURRENT_TIMESTAMP
                    WHERE (recipient_id = $1 AND sender_id = $2)
                    OR (recipient_id = $2 AND sender_id = $1)
                    RETURNING status;`;
        const params = [requestedId, session.userId];
        db.query(q, params).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        });
    });
};

const getAllPendingRequests = (session) => {
    return new Promise((resolve, reject) => {
        const q = `SELECT *
                    FROM friend_requests
                    WHERE recipient_id = $1
                    AND status = 'pending'`;
        const params = [session.userId];
        db.query(q, params).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        });
    });
};

const getAllFriends = (session) => {
    return new Promise((resolve, reject) => {
        const q = `SELECT *
                FROM friend_requests
                WHERE (recipient_id = $1 OR sender_id = $1)
                AND status = 'accepted';`;
        const params = [session.userId];
        db.query(q, params).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        });
    });
};


module.exports.getFriendStatus = getFriendStatus;
module.exports.sendFriendRequest = sendFriendRequest;
module.exports.cancelFriendRequest = cancelFriendRequest;
module.exports.acceptFriendRequest = acceptFriendRequest;
module.exports.unFriend = unFriend;
module.exports.getAllPendingRequests = getAllPendingRequests;
module.exports.getAllFriends = getAllFriends;
module.exports.rejectFriendRequest = rejectFriendRequest;
