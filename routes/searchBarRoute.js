var express = require('express'), router = express.Router();
const dbProfiles = require('../config/dbGeneral.js');

router.route('/getProfileSearchSummaries')

    .post( (req, res) => {
        dbProfiles.getManyProfileSummaries(req.body).then((summaryResults) => {
            res.json({ results: summaryResults });
        }).catch((err) => {
            console.log(err);
            res.json({ error: true });
        });
    });

module.exports = router;
