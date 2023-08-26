// connection/db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432, // Port default PostgreSQL
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
