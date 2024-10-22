import * as dotenv from 'dotenv';
dotenv.config();

import database from './database';
import jwt from './jwt';
import google from './google';
import file from './file';

export default () => ({
  database,
  jwt,
  google,
  file,
});
