# Meteor Google OAuth JWT

Implementation of Google OAuth 2.0 for server-to-server interactions for [Meteor](https://meteor.com) (v0.9.0+).

This library is mostly based on the [Google OAuth JWT](https://github.com/extrabacon/google-oauth-jwt) library by [Nicolas Mercier (extrabacon)](https://github.com/extrabacon). However it was rewritten to support Meteor HTTP package and to work synchronously.

The library generates JWT tokens to establish identity for an API, without an end-user being involved. This is the preferred scenario for server-side communications. It can be used to interact with Google APIs requiring access to user data (such as Google Drive, Calendar, etc.) for which URL-based callbacks and user authorization prompts are not appropriate.

Tokens are generated for a service account, which is created from the Google API console. Service accounts must also be granted access to resources, using traditional assignation of permissions using the unique service account email address.

The authentication process is implemented following the specifications found [here](https://developers.google.com/accounts/docs/OAuth2ServiceAccount).

This package also integrates with HTTP package to seamlessly query Google RESTful APIs. Integration with the package provides automatic requesting for tokens, as well as built-in token caching.

## Installation

Google OAuth JWT package can be installed using new Meteor package system introduced with Meteor v9.0.0. You type in the command line:

```sh
$ meteor add jagi:google-oauth-jwt
```

## Encoding JWT

You can encode JSON Web Token (JWT) manually...

```js
var JWT = GoogleOAuthJWT.encodeJWT({
  email: '<google_service_account_email_local_part>@developer.gserviceaccount.com',
  key: '/Users/jagi/application/key.pem', // Path to key file on the server
  scopes: [
    'https://www.googleapis.com/auth/plus.profile.emails.read', // New scope name
    'https://www.googleapis.com/auth/userinfo.email' // Old scope name
  ]
});
```

## Requesting access token

... or you can accquire access token directly.

```js
var accessToken = GoogleOAuthJWT.authenticate({
  email: '<google_service_account_email_local_part>@developer.gserviceaccount.com',
  key: '/Users/jagi/application/key.pem', // Path to key file on the server
  scopes: [
    'https://www.googleapis.com/auth/plus.profile.emails.read', // New scope name
    'https://www.googleapis.com/auth/userinfo.email' // Old scope name
  ]
});
```

## Making HTTP request

The library provides easy way to make an HTTP calls without thinkig about access tokens and JWTs. It also supports caching so it limits number of calls to the Google servers and makes things faster.

```js
HTTPJWT.setJWTOptions({ // Just call this once to set JWT
  email: '<google_service_account_email_local_part>@developer.gserviceaccount.com',
  key: '/Users/jagi/application/key.pem', // Path to key file on the server
  scopes: [
    'https://www.googleapis.com/auth/plus.profile.emails.read', // New scope name
    'https://www.googleapis.com/auth/userinfo.email' // Old scope name
  ]
});

// Accessing endpoints REST api
var url = 'https://<application_name>.appspot.com/_ah/api/<application_name>/<version>/<rest_api>';
var result = HTTPJWT.get(url);

console.log(result.data); // Access your data
```

## License

MIT
