const crypto = require('crypto');

const unleash = require('unleash-server');
const passport = require('passport');
const formidable = require('formidable');
const APIKeyStrategy = require('@passport-next/passport-apikey').Strategy;

const apiKeys = new Set();

loadAPIKeys();

function configureAuth(app) {
    configureSessionMiddleware(app);
    registerLoginRoute(app);
    registerAuthCallbackRoute(app);
    registerAuthMiddleware(app);
    console.log('API key authentication configured for admin API');
}

function configureSessionMiddleware(app) {
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));
    passport.use('apikey', new APIKeyStrategy((apiKey, done) => {
        if (isValidApiKey(apiKey)) {
            return done(null, { id: generateAPIKey(), username: apiKey });
        } else {
            return done(null, false, { message: 'Unauthorized' }, 403);
        }
    }));
}

function registerAuthMiddleware(app) {
    app.use('/api/admin', (req, res, next) => {
        if (!authenticated(req)) {
            return createChallengeResponse(res);
        } else {
            next();
        }
    });
}

function createChallengeResponse(res) {
    return res
        .status('401')
        .json(
            new unleash.AuthenticationRequired({
                path: '/api/admin/login',
                type: 'custom',
                message: `Please authenticate to continue`,
            }))
        .end();
}

function registerLoginRoute(app, redirectPath = '/') {
    app.get('/api/admin/login', (req, res, next) => {
        return res
            .set('Content-Type', 'text/html')
            .send(`
            <html>
                <head>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/kognise/water.css@latest/dist/dark.min.css">
                    <style>
                        div {
                            width: 150px;
                            height: 100px;
                        
                            position: absolute;
                            top: 0;
                            bottom: 0;
                            left: 0;
                            right: 0;
                        
                            margin: auto;
                        }
                    </style>
                </head>
                <body>
                    <div>
                        <form action="auth-callback" method="POST">
                            <label for="apiKey">Enter API key:</label>
                            <input type="password" id="apikey" name="apikey"></input>
                        </form>
                    </div>
                </body>
            </html>
            `);
    });
}

function registerAuthCallbackRoute(app) {
    app.post('/api/admin/auth-callback',
        parsePayload,
        passport.authenticate('apikey', { failureRedirect: '/', }),
        (req, res) => { res.redirect('/'); }
    );
}

function parsePayload(req, res, next) {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res
                .status('400')
                .json({
                    message: 'Bad request'
                })
                .end();
        }
        req.body = fields;
        req.files = files;
        next();
    });
}

function authenticated(req) {
    return isValidApiKey(req.get('apikey')) // Has header 
        || req.user;                        // Has session
}

function isValidApiKey(key) {
    return apiKeys.has(key);
}

function loadAPIKeys() {
    if (process.env['LOAD_KEYS_FROM_REMOTE']) {
        loadAPIKeysFromRemote();
    } else if (isModuleAvailable('../config/api-keys')) {
        loadAPIKeysFromFile();
    } else {
        generateAPIKeys();
    }
}

function loadAPIKeysFromRemote() {
    console.log('Loading API keys from remote storage');
    throw new Error('Not implemented');
}

function loadAPIKeysFromFile() {
    console.log('Loading API keys from file');
    const keys = require('../config/api-keys');
    try {
        keys.forEach(key => apiKeys.add(key));
    } catch (e) {
        console.log('Error occurred loading keys, expected exported array');
        console.log(e);
    }
}

function generateAPIKeys() {
    console.log('Generating new API keys');
    for (let i = 0; i < 5; i++) {
        apiKeys.add(generateAPIKey());
    }
}

function generateAPIKey() {
    return crypto.randomBytes(20).toString('hex');
}

function isModuleAvailable(path) {
    try {
        require.resolve('../config/api-keys');
        return true;
    } catch (e) {
        return false;
    }
}

module.exports.hook = configureAuth;
module.exports.keys = apiKeys;