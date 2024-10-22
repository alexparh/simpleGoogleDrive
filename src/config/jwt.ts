const { TOKEN_SECRET: secret, TOKEN_EXPIRES_IN: expiresIn } = process.env;

export default {
  secret,
  expiresIn,
};
