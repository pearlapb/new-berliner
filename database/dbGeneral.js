var spicedPg = require('spiced-pg');
let dbUrl;
if (!process.env.DATABASE_URL) {
    dbUrl = require('../config/secrets.json').dbUrl;
} else {
    dbUrl = process.env.DATABASE_URL;
}
var db = spicedPg(dbUrl);

const checkIfUserExists = (userInfo) => {
    return new Promise(function(resolve, reject) {
        const q = 'SELECT * FROM users WHERE email = $1;';
        const params = [userInfo.email];
        db.query(q, params).then(function(results) {
            resolve(results);
        }).catch(function(err) {
            reject(err);
        });
    });
};

const addNewUserToDb = (newUserInfo) => {
    return new Promise(function(resolve, reject) {
        const q = 'INSERT INTO users (first_name, last_name, email, hashed_pw, profile_pic_url) VALUES ($1, $2, $3, $4, $5) RETURNING *;';
        const params = [newUserInfo.firstName, newUserInfo.lastName, newUserInfo.email, newUserInfo.hashedPw, '/public/assets/unknown.png'];
        db.query(q, params).then(function(results) {
            resolve(results);
        }).catch(function(err) {
            reject(err);
        });
    });
};

const getUserProfileInfo = (requestedId) => {
    return new Promise(function(resolve, reject) {
        const q = 'SELECT * FROM users WHERE id = $1;';
        const params = [requestedId];
        db.query(q, params).then(function(result) {
            resolve(result);
        }).catch(function(err) {
            reject(err);
        });
    });
};

const getManyProfileSummaries = (arrayOfIds) => {
    return new Promise(function(resolve, reject) {
        let counter = 0, profileSummaries = [];
        for (var i = 0; i < arrayOfIds.length; i++) {
            getUserProfileInfo(arrayOfIds[i]).then((infoResults) => {
                profileSummaries.push({
                    id: infoResults.rows[0].id,
                    userUrl: `/user/${infoResults.rows[0].id}`,
                    name: `${infoResults.rows[0].first_name} ${infoResults.rows[0].last_name}`,
                    imageUrl: infoResults.rows[0].profile_pic_url
                });
                counter++;
                if (counter == arrayOfIds.length) {
                    resolve(profileSummaries);
                }
            }).catch((err) => {
                reject(err);
            });
        }
    });
};

const saveImageUrlToDb = (file, session) => {
    return new Promise(function(resolve, reject) {
        const q = 'UPDATE users SET profile_pic_url = $1 WHERE id = $2 RETURNING profile_pic_url;';
        const params = [`/uploads/${file.filename}`, session.userId];
        db.query(q, params).then(function(result) {
            resolve(result);
        }).catch(function(err) {
            reject(err);
        });
    });
};

const updateUserBio = (bioText, session) => {
    return new Promise(function(resolve, reject) {
        const q = 'UPDATE users SET description = $1 WHERE id = $2 RETURNING description;';
        const params = [bioText, session.userId];
        db.query(q, params).then(function(result) {
            resolve(result);
        }).catch(function(err) {
            reject(err);
        });
    });
};

const updateUserHobbies = (hobbiesText, session) => {
    return new Promise(function(resolve, reject) {
        const q = 'UPDATE users SET hobbies = $1 WHERE id = $2 RETURNING hobbies;';
        const params = [hobbiesText, session.userId];
        db.query(q, params).then(function(result) {
            resolve(result);
        }).catch(function(err) {
            reject(err);
        });
    });
};

const getAllUserNames = () => {
    return new Promise((resolve, reject) => {
        const q = 'SELECT first_name, last_name, id FROM users;';
        db.query(q, []).then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        });
    });
};

const postToProfileFeed = (profileId, session, message) => {
    return new Promise((resolve, reject) => {
        const q = 'INSERT INTO profile_feed (profile_id, sender_id, message) VALUES ($1, $2, $3) RETURNING *;';
        const params = [profileId, session.userId, message];
        db.query(q, params).then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        });
    });
};

const getAllProfileFeed = (profileId) => {
    return new Promise((resolve, reject) => {
        const q = `SELECT *
                    FROM profile_feed
                    JOIN users
                    ON profile_feed.sender_id = users.id
                    WHERE profile_id = $1;`;
        const params = [profileId];
        db.query(q, params).then((result) => {
            console.log('result in query', result);
            resolve(result);
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports.addNewUserToDb = addNewUserToDb;
module.exports.checkIfUserExists = checkIfUserExists;
module.exports.getUserProfileInfo = getUserProfileInfo;
module.exports.getManyProfileSummaries = getManyProfileSummaries;
module.exports.saveImageUrlToDb = saveImageUrlToDb;
module.exports.updateUserBio = updateUserBio;
module.exports.updateUserHobbies = updateUserHobbies;
module.exports.getAllUserNames = getAllUserNames;
module.exports.postToProfileFeed = postToProfileFeed;
module.exports.getAllProfileFeed = getAllProfileFeed;
