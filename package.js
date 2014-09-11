Package.describe({
  summary: "Implementation of Google OAuth 2.0 for server-to-server interactions",
  version: "1.0.2",
  git: "https://github.com/jagi/meteor-google-oauth-jwt.git"
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.0.1');
  
  api.use(['underscore', 'http']);
  
  api.addFiles(['lib/google-oauth-jwt.js', 'lib/http-jwt.js'], 'server');
  
  api.export(['GoogleOAuthJWT', 'HTTPJWT'], 'server');
});

Package.onTest(function(api) {
  api.use(['tinytest', 'jagi:google-oauth-jwt']);
  
  api.addFiles('test/tests.js');
});