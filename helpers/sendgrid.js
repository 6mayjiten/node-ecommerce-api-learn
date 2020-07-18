const sgMail = require('@sendgrid/mail');
const config = require('../config');

module.exports = {
    sendMail: (to, subject, text, html) => {
        const txtMsg = 'hello';
        sgMail.setApiKey(config.sendgridApiKey);
        const msg = {
            to,
            from: 'Ecommerce Team <6mayjitenshahi@gmail.com>',
            subject,
            text: txtMsg,
            html,
        };

        sgMail.send(msg).then((result) => {
            console.log(`${result}`);
        }, (err) => {
            console.error(err);
        });
    },
};
