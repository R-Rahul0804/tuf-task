const Sequelize = require('sequelize');
const db = require('../config/sqlConnection');

const UserCode = db.define('usercode',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username:{
        type: Sequelize.STRING,
        allowNull: false
    },
    codelanguage: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      stdin: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sourcecode: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      output:{
        type: Sequelize.TEXT,
        allowNull: false,
      }
});

module.exports = UserCode;