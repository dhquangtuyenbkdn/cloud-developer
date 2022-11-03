import { Sequelize } from 'sequelize-typescript';

import { config } from './config/config';

// import { V0MODELS } from './controllers/v0/model.index';

// Instantiate new Sequelize instance!
// export const sequelize = new Sequelize({
//   username: c.username,
//   password: c.password,
//   database: c.database,
//   host:     c.host,

//   dialect: 'postgres',
//   storage: ':memory:',
//   models: V0MODELS
// });

const c = config.postgres;
export const sequelize = new Sequelize({
  username: c.username,
  password: c.password,
  database: c.database,
  host: c.host,

  dialect: 'postgres',
  storage: ':memory:'
});

// export const sequelize = new Sequelize(c.database, c.username, c.password, {
//   dialect: 'postgres',
//   host: c.host
// });
