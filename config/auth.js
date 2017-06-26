var bcrypt = require('bcryptjs');

const hashPassword = (enteredPw) => {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                reject(err);
            } else {
                bcrypt.hash(enteredPw, salt, function(err, hash) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(hash);
                    }
                });
            }
        });
    });
};

const checkPassword = (enteredPwFromForm, hashedPwFromDb) => {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(enteredPwFromForm, hashedPwFromDb, function(err, pwMatches) {
            if (err) {
                reject(err);
            } else {
                resolve(pwMatches);
            }
        });
    });
};

module.exports.hashPassword = hashPassword;
module.exports.checkPassword = checkPassword;
