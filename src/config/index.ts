import * as dotenv from 'dotenv';
dotenv.config();

import database from './database';
import jwt from './jwt';
import google from './google';
import file from './file';
import storage from './storage';
import system from './system';

export default () => ({
  database,
  jwt,
  google,
  file,
  storage,
  system,
});
