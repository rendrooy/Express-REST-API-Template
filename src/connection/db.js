// connection/db.js
const { Pool } = require('pg');
const { Sequelize, Op } = require('sequelize');
const { dbConection } = require('../config');
const { operatorTypes } = require('./query-builder');

const pool = new Pool({
  user: dbConection.user,
  host: dbConection.host,
  database: dbConection.database,
  password: dbConection.password,
  port: 5432, // Port default PostgreSQL
});

const sequelizeConnection = new Sequelize(
  dbConection.database,
  dbConection.user,
  dbConection.password,
  {
    host: dbConection.host,
    dialect: 'postgres',
    port: 5432, // Port default PostgreSQL
    define: {
      timestamps: false,
    },
  }
);

const whereBuilder = async (conditions) => {
  const resultWhere = {}; // Initialize the result WHERE object

  for (let i = 0; i < conditions.length; i++) {
    const element = conditions[i];

    const column = element.column;
    const value = element.value;
    const operator = element.operator || operatorTypes.equal;
    switch (operator) {
      case operatorTypes.like:
        resultWhere[column] = {
          [Op.iLike]: `%${(value || '').toLowerCase()}%`,
        };
        break;
      case operatorTypes.equal:
        resultWhere[column] = value;
        break;
      // Handle other operator types as needed
    }
  }
  // conditions.forEach((condition, index) => {
  // });
  console.log(resultWhere);
  // console.log(operator);
  return resultWhere;
};

module.exports = {
  sequelizeConnection,
  whereBuilder,
  query: (text, params) => pool.query(text, params),
};
