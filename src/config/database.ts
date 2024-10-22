const {
  DB_HOST: host = 'localhost',
  DB_PORT: port = 3306,
  DB_USERNAME: username,
  DB_PASSWORD: password,
  DB_DATABASE: database,
} = process.env;

export default {
  host,
  port: +port,
  username,
  password,
  database,
};
