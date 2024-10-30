const { PORT: port = 3000, HOST: host = 'http://localhost:3000' } = process.env;

export default {
  port: +port,
  host,
};
