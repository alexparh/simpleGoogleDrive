import { DataSource } from 'typeorm';
import { join } from 'path';

import config from '../config';

const { database } = config();

const entities = [join(process.cwd(), 'dist/**/*.entity.js')];
if (process.env.NODE_ENV === 'test')
  entities.push(join(process.cwd(), 'src/**/*.entity.ts'));

const dataSourceObj = new DataSource({
  ...database,
  type: 'postgres',
  entities,
  migrations: [join(process.cwd(), 'dist/database/migrations/**/*.js')],
  synchronize: true,
});

export const dataSource = dataSourceObj;
