const dotenv = require('dotenv');

dotenv.config();
module.exports = {
    env: process.env.environment,
    dbUrl: process.env.dbUrl,
    secret: process.env.secret,
};
