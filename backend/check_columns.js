import { Sequelize } from 'sequelize';
import { env } from './src/config/env.js';

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
  host: env.db.host,
  dialect: 'mysql',
  logging: false
});

async function checkColumns() {
  try {
    await sequelize.authenticate();
    const [results] = await sequelize.query('DESCRIBE Bookings');
    console.log('Bookings Table Columns:');
    console.table(results);
  } catch (e) {
    console.error(e);
  } finally {
    await sequelize.close();
  }
}

checkColumns();
