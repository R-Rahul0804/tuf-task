const sequelize = require('sequelize');
const dotenv = require('dotenv'); dotenv.config();

const db = new sequelize(process.env.MYSQL_DBNAME, process.env.MYSQL_NAME, process.env.MYSQL_PASSWORD,{
    dialect: 'mysql',
    host: process.env.MYSQL_HOST,
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


