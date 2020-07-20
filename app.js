const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const logger = require('morgan');
const cors = require('cors');
// Import the mongoose module
const mongoose = require('mongoose');
// eslint-disable-next-line no-unused-vars
const model = require('./models');
const config = require('./config.js');
const indexRouter = require('./routes/index');
const HTTPCodes = require('./helpers/httpStatusCodes');

const app = express();

// Set up default mongoose url and options
const mongoDB = config.dbUrl;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
};

mongoose.connect(mongoDB, options).then(
    () => {
        console.log('mongoose is connected');
    },
    (err) => {
        console.log(`mongoose is not connected ${err}`);
    },
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
    secret: config.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        path: '/', httpOnly: true, secure: false, maxAge: null,
    },
    maxAge: (60 * 1000),
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors(
    {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: HTTPCodes.NoContentCode,
    },
));
app.use('/api', (req, res, next) => {
    if (!req.session.user_session) {
        req.session.user_session = req.session.id;
    }
    return next();
}, indexRouter);

// catch 404 and forward to error handler
app.use((req, res) => {
    res.status(HTTPCodes.NotFoundCode);
    // respond with json
    if (req.accepts('json')) {
        return res.send({ error: 'Not Found' });
    }
    // default to plain-text. send()
    return res.type('txt').send('Not found');
});

module.exports = app;
