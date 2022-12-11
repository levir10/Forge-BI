const express = require('express');
const { UserProfileApi } = require('forge-apis');

const { OAuth } = require('./common/oauth');

let router = express.Router();
//GET  /api/forge/user/profile
router.get('/user/profile', async (req, res) => {
    const oauth = new OAuth(req.session);
    const internalToken = await oauth.getInternalToken();
    const user = new UserProfileApi();
    const profile = await user.getUserProfile(oauth.getClient(), internalToken);
    //the response would give the firstname, last name, and profile picture size  as a json file
    res.json({
        name: profile.body.firstName + ' ' + profile.body.lastName,
        picture: profile.body.profileImages.sizeX40
    });
});

module.exports = router;
