var express = require('express'), router = express.Router();

router.route('/getRecentChatMessages')

    .get( (req, res) => {
        res.json({ success: true });
    });

module.exports = router;
