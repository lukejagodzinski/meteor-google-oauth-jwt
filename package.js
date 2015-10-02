Package.describe({
  summary: 'Implementation of Google OAuth 2.0 for server-to-server interactions',
  version: '1.1.0',
  name: 'jagi:google-oauth-jwt',
  git: 'https://github.com/jagi/meteor-google-oauth-jwt.git'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.0');

  api.use([
    'underscore',
    'http'
  ], 'server');

  api.addFiles([
    'lib/google-oauth-jwt.js',
    'lib/tokens.js',
    'lib/http-jwt.js'
  ], 'server');

  api.export(['GoogleOAuthJWT', 'HTTPJWT'], 'server');
});
