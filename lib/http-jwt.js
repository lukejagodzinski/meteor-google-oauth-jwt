HTTPJWT = {};

var cachedTokens = {};
var JWT_options = null;

var createProxy = function (method) {
  return function (url, options) {
    options = options || {};

    if (!JWT_options) throw new Error('JWT options are required, set them using `setJWTOptions` method');
    if (!JWT_options.email) throw new Error('JWT option `email` is required');
    if (!JWT_options.scopes) throw new Error('JWT option `scopes` is required');
    if (!_.isArray(JWT_options.scopes)) throw new Error('JWT option `scopes` must be an array');
    if (JWT_options.scopes.length == 0) throw new Error('JWT option `scopes` must contain at least one scope');
    if (!JWT_options.key) throw new Error('JWT option `key` is required');

    var tokenKey = JWT_options.email + ':' + JWT_options.scopes.join(',');
    var token = '';

    if (!cachedTokens[tokenKey]) {
      cachedTokens[tokenKey] = {
        issued: Date.now(),
        duration: JWT_options.expiration || 60 * 60 * 1000,
        token: GoogleOAuthJWT.authenticate(JWT_options)
      };
    }

    options.headers = options.headers || {};
    options.headers.authorization = 'Bearer ' + cachedTokens[tokenKey].token;

    return method(url, options);
  };
};

HTTPJWT.get = createProxy(HTTP.get);
HTTPJWT.post = createProxy(HTTP.post);
HTTPJWT.put = createProxy(HTTP.put);
HTTPJWT.del = createProxy(HTTP.del);

HTTPJWT.call = function (method, url, options) {
  HTTPJWT[method](url, options);
};

HTTPJWT.setJWTOptions = function (options) {
  if (!options) throw new Error('JWT options are required, set them using `setJWTOptions` method');
  if (!options.email) throw new Error('JWT option `email` is required');
  if (!options.scopes) throw new Error('JWT option `scopes` is required');
  if (!_.isArray(options.scopes)) throw new Error('JWT option `scopes` must be an array');
  if (options.scopes.length == 0) throw new Error('JWT option `scopes` must contain at least one scope');
  if (!options.key) throw new Error('JWT option `key` is required');

  JWT_options = options;
};

HTTPJWT.clearTokens = function () {
  cachedTokens = {};
};
