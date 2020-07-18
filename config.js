const dotenv = require('dotenv');

dotenv.config();
module.exports = {
    env: process.env.ENVIRONMENT,
    dbUrl: process.env.DB_URL,
    secret: process.env.SECRET,
    sendgridApiKey: process.env.SENDGRID_API_KEY,
};
