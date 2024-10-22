const { MAX_FILE_SIZE: maxFileSize = 50000000 } = process.env;

export default {
  maxFileSize: +maxFileSize,
};
