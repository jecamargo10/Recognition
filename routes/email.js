const express = require("express");
const router = express.Router();

// Sendgrid stuff
const sendGridCredentials = require("../config/sendgrid");
const sendgrid = require("@sendgrid/mail");
sendgrid.setApiKey(sendGridCredentials.apiKey);

router.post('/sendEmail', (req, res) => {
    const msg = {
        to: req.body.to,
        from: 'notifications@vtrapp.com',
        subject: req.body.subject,
        html: req.body.html,
    };
    const sendEmail = sendgrid.send(msg);
    sendEmail.then(function () {
        res.json({success: true, msg:'Email sent'});
    }).catch(function () {
        res.json({success: false, msg:'Error sending email'});
    });
});

module.exports = router;
