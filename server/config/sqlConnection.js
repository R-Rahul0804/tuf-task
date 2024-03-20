const sequelize = require('sequelize');
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



module.exports = db;


