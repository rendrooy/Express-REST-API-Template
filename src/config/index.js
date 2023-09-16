const timeConfig = {
  momentDate: 'YYYY-MM-DD',
  oracleDate: 'YYYY-MM-DD',
  clock: 'HH:mm:ss',
  moment: 'YYYY-MM-DD HH:mm:ss',
  oracle: 'YYYY-MM-DD HH24:MI:SS',
};

const dbConection = {
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432, // Port default PostgreSQL
};

module.exports = {
  timeConfig,
  dbConection,
};
