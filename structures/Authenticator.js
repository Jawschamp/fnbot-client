const authenticator = require("authenticator");

class Authenticator {
    static GetAuthToken(key) {
        return authenticator.generateToken(key);
    };
};

module.exports = Authenticator;