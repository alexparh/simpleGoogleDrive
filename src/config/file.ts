const {
  MAX_FILE_SIZE: maxFileSize = 50000000,
  TEMP_FILE_EXPIRES_IN: tempFileExpiresIn = 60000,
} = process.env;

export default {
  maxFileSize: +maxFileSize,
  tempFileExpiresIn: +tempFileExpiresIn,
};
