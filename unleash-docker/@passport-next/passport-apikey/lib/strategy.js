const Strategy = require('@passport-next/passport-strategy').Strategy;

class APIKeyStrategy extends Strategy {

    constructor(options, verify) {
        super(options, verify);
        if (typeof options === 'function') {
            verify = options;
            options = {};
        }
        this.options = options;
        this.verify = verify;

        if (!verify) { 
            throw new TypeError('APIKeyStrategy requires a verify callback'); 
        }

        this.apiKeyField = options.apikeyField || 'apikey';
    }

    authenticate(req, options) {
        const apiKey = this.tryGetAPIKey(req);
        const verifiedCallback = (err, user, info, status) => {
            if (err) {
                return this.error(err);
            }
            if (!user) {
                return this.fail(info, status);
            }
            return this.success(user, info);
        }

        if (apiKey) {
            this.verify(apiKey, verifiedCallback);
        } else {
            this.fail({ message: options.badRequestMessage || 'Missing api key' }, 400);
        }
    }

    // Try and get the API key from either the request header or body
    tryGetAPIKey(req) {
        return req.get(this.apiKeyField)
            || req.body[this.apiKeyField];
    }

}

module.exports = APIKeyStrategy;