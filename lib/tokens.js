Tokens = {
  _cache: {},

  get: function() {
    if (!HTTPJWT._options) {
      throw new Error(
        'The JWT options are required, ' +
        'set them using the "HTTPJWT.setJWTOptions" method'
      );
    }
    if (!HTTPJWT._options.email) {
      throw new Error('The "email" option is required');
    }
    if (!HTTPJWT._options.scopes) {
      throw new Error('The "scopes" option is required');
    }
    if (!_.isArray(HTTPJWT._options.scopes)) {
      throw new Error('The "scopes" option must be an array');
    }
    if (HTTPJWT._options.scopes.length == 0) {
      throw new Error('The "scopes" option must contain at least one scope');
    }
    if (!HTTPJWT._options.key) {
      throw new Error('The "key" option is required');
    }

    // Generate token key.
    var tokenKey = HTTPJWT._options.email + ':' +
      HTTPJWT._options.scopes.join(',');

    // If impersonation mail is provided then include it to token key.
    if (HTTPJWT._options.sub) {
      tokenKey = tokenKey + ':' + HTTPJWT._options.sub;
    }
     
    // Check if there is already cached token.
    var cachedToken = this._cache[tokenKey];

    // If cached token does not exist or it's expired then we have to request a
    // new one.
    if (!cachedToken || cachedToken.expires < Date.now()) {
      var issued = Date.now();
      var duration = HTTPJWT._options.expiration || 60 * 60 * 1000;
      var expires = issued + duration;
      var token = GoogleOAuthJWT.authenticate(HTTPJWT._options);

      cachedToken = this._cache[tokenKey] = {
        issued: issued,
        duration: duration,
        expires: expires,
        token: token
      };
    }

    return cachedToken.token;
  },

  clear: function() {
    this._cache = {};
  }
};
