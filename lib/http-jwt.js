HTTPJWT = {
  _options: null
};

var createProxy = function(method) {
  return function(url, options, callback) {
    options = options || {};

    options.headers = options.headers || {};
    options.headers.authorization = 'Bearer ' + Tokens.get();

    return method(url, options, callback);
  };
};

HTTPJWT.get = createProxy(HTTP.get);
HTTPJWT.post = createProxy(HTTP.post);
HTTPJWT.put = createProxy(HTTP.put);
HTTPJWT.del = createProxy(HTTP.del);

HTTPJWT.call = function(method, url, options) {
  HTTPJWT[method](url, options);
};

HTTPJWT.setJWTOptions = function(options) {
  if (!options) {
    throw new Error('The options argument is required');
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

  this._options = options;
};

HTTPJWT.clearTokens = function() {
  Tokens.clear();
};
