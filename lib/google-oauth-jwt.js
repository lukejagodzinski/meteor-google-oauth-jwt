var fs = Npm.require('fs');
var crypto = Npm.require('crypto');

// Constants.
var GOOGLE_OAUTH2_URL = 'https://accounts.google.com/o/oauth2/token';

GoogleOAuthJWT = {};

/**
 * Encode a JSON Web Token (JWT) using the supplied options.
 *
 * The token represents an authentication request for a specific user and is signed with a private key to ensure
 * authenticity.
 *
 * Available options are:
 *   `options.email`: the email address of the service account (required)
 *   `options.scopes`: an array of scope URIs to demand access for (required)
 *   `options.key` a path to the private key to use to sign the token (required)
 *   `options.expiration`: the duration of the requested token, in milliseconds (default: 1 hour)
 *   `options.delegationEmail`: an email address for which access is being granted on behalf of (optional)
 *
 * @param {Object} options The options to use to generate the JWT.
 * @return {String} Generated JWT.
 */
GoogleOAuthJWT.encodeJWT = function(options) {
  if (!options) {
    throw new Error('The "options" argument is required');
  }
  if (!options.email) {
    throw new Error('The "email" option is required');
  }
  if (!options.scopes) {
    throw new Error('The "scopes" option is required');
  }
  if (!_.isArray(options.scopes)) {
    throw new Error('The "scopes" option must be an array');
  }
  if (options.scopes.length == 0) {
    throw new Error('The "scopes" option must contain at least one scope');
  }
  if (!options.key) {
    throw new Error('The "key" option is required');
  }

  var iat = Math.floor(new Date().getTime() / 1000);
  var exp = iat + Math.floor((options.expiration || 60 * 60 * 1000) / 1000);
  var claims = {
    iss: options.email,
    scope: options.scopes.join(' '),
    aud: GOOGLE_OAUTH2_URL,
    exp: exp,
    iat: iat,
    sub: options.sub
  };

  if (options.delegationEmail) {
    claims.sub = options.delegationEmail;
  }

  var jwtHeader = new Buffer(JSON.stringify({
    alg: 'RS256',
    typ: 'JWT'
  })).toString('base64');
  var jwtClaimset = new Buffer(JSON.stringify(claims)).toString('base64');
  var unsignedJWT = [jwtHeader, jwtClaimset].join('.');

  var jwtSignature = crypto.
    createSign('RSA-SHA256').
    update(unsignedJWT).
    sign(options.key, 'base64');
  var signedJWT = [unsignedJWT, jwtSignature].join('.');

  if (jwtSignature === '') {
    throw new Error('Failed to sign JWT, the key is probably invalid');
  }

  return signedJWT;
};

/**
 * Request an authentication token by submitting a signed JWT to Google OAuth2 service.
 *
 * @param {Object} jwtOptions The JWT generation options.
 * @return {String} Authentication token from Google OAuth2 service.
 */
GoogleOAuthJWT.authenticate = function(jwtOptions, fullResponse) {
  var JWT = GoogleOAuthJWT.encodeJWT(jwtOptions);

  var res = HTTP.post(GOOGLE_OAUTH2_URL, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: JWT
    }
  });

  var body;
  try {
    body = JSON.parse(res.content);
  } catch (err) {
    throw new Error('Failed to parse response body: ' + res.content);
  }

  if (fullResponse) {
    return body;
  } else {
    return body.access_token;
  }
};
