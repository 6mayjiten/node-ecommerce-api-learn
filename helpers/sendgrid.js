const sgMail = require('@sendgrid/mail');
const config = require('../config');

module.exports = {
    sendMail: (to, subject, text, html = '') => {
        sgMail.setApiKey(config.SENDGRID_API_KEY);
        const msg = {
            to,
            from: 'Ecommerce Team',
            subject,
            text,
            html,
        };
        sgMail.send(msg);
    },
};
