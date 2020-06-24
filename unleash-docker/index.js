'use strict';

const unleash = require('unleash-server');

const auth = require('./auth/hook/simple-api-key-auth-hook');

let options = {
    adminAuthentication: 'custom',
    // Function performing very simple shared key authentication for the admin API
    preRouterHook: auth.hook
};

unleash
    .start(options)
    .then(unleash => {
        console.log(`Unleash started on http://localhost:${unleash.app.get('port')}`);
        console.log('WARNING! It\'s not secure to print this, for demo purposes only. Include request header:');
        console.log('apikey: <key_value>');
        console.log('API keys:');
        auth.keys.forEach(key => console.log(key));
        console.log('API documentation: https://github.com/Unleash/unleash/tree/master/docs/api/admin');
    });
