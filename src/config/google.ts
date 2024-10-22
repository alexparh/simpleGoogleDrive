const {
  AUTH_GOOGLE_CLIENT_ID: clientID,
  AUTH_GOOGLE_CLIENT_SECRET: clientSecret,
  AUTH_GOOGLE_CALLBACK_URL: callbackURL,
  AUTH_GOOGLE_SCOPE: scopeString = 'profile,email',
} = process.env;

export default {
  clientID,
  clientSecret,
  callbackURL,
  scope: scopeString.split(','),
};
