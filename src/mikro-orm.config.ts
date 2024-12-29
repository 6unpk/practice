import { Options } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';

const config: Options = {
  driver: MySqlDriver,
  dbName: 'mydb',
  host: '127.0.0.1',
  port: 3306,
  user: 'admin',
  password: 'qwer1234',
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  debug: true,
};

export default config;
