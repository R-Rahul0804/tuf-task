const sequelize = require('sequelize');
//const {createClient} = require('redis');
const dotenv = require('dotenv'); dotenv.config();

const db = new sequelize('sde-task', process.env.MYSQL_NAME, process.env.MYSQL_PASSWORD,{
    dialect: 'mysql',
    host: 'localhost',
    logging: false
});

db
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });



// async function setupRedis() {
//   try {
//       const client = await createClient(6379).on('error', err => console.log('Redis Client Error', err)).connect();
// //       await client.set('key', 'value');
// // await client.set('key', 'value');
// // const value = await client.get('key');
//  await client.disconnect();
//   await client.ping();
//   } catch (error) {
//       console.error('Error setting up Redis:', error);
//       throw error;
//   }
// }


module.exports = db;