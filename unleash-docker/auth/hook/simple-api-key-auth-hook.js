const unleash = require('unleash-server');
const passport = require('@passport-next/passport');
// const CustomStrategy = require('passport-custom').Strategy;
const { Strategy } = require('@passport-next/passport-local');

const apiKeys = require('../config/api-keys');


passport.use('local', new Strategy({ usernameField: 'apikey', passwordField: 'apikey', passReqToCallback: true }, (username, password, done) => {
    console.log('In strategy');
    return done(null, { username: 'api-client' });
}));  

function configureAuth(app) {
    registerLoginRoute(app);
    registerAuthCallbackRoute(app);
    registerAuthMiddleware(app);
    configureSessionMiddleware(app);
    console.log('API key authentication configured for admin API');
}

function configureSessionMiddleware(app) {
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));
    // passport.use('apikey', new CustomStrategy(
    //     (req, callback) => {
    //         console.log('In strategy');
    //         // Do your custom user finding logic here, or set to false based on req object
    //         callback(null, { username: 'api-client' });
    //     }
    // )); 
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
                            <input id="apikey" name="apikey"></input>
                        </form>
                    </div>
                </body>
            </html>
            `);
    });
}

function registerAuthCallbackRoute(app) {
    app.post('/api/admin/auth-callback',
        passport.authenticate('local', { failureRedirect: '/', }),
        (req, res) => { console.log('Auth completed'); return res.redirect('/'); }
    );
}
function authenticated(req) {
    return isValidApiKey(req.get('apikey')) // Has header 
        || req.user;                        // Has session
}

function isValidApiKey(key) {
    return apiKeys.includes(key)
}

module.exports = configureAuth;