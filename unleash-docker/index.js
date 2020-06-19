'use strict';

const unleash = require('unleash-server');
const crypto = require('crypto');

const authHook = require('./auth/hook/simple-api-key-auth-hook');

const secret = process.env['unleash:secret'] || crypto.randomBytes(32).toString('hex');

let options = {
    adminAuthentication: 'custom',
    // Function performing very simple shared key authentication for the admin API
    // Something more sophisticated than this would be required in production scenarios
    // Or put this service in a private subnet and proxy API requests through the application server
    preRouterHook: authHook
};

unleash
    .start(options)
    .then(unleash => {
        console.log(`Unleash started on http://localhost:${unleash.app.get('port')}`);
        // console.log('WARNING! It\'s not secure to print this, for demo purposes only. Include request header:');
        // console.log(`authorization: ${secret}`);
        console.log('API documentation: https://github.com/Unleash/unleash/tree/master/docs/api/admin');
    });
