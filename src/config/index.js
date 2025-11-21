const timeConfig = {
    momentDate: 'YYYY-MM-DD',
    oracleDate: 'YYYY-MM-DD',
    clock: 'HH:mm:ss',
    moment: 'YYYY-MM-DD HH:mm:ss',
    oracle: 'YYYY-MM-DD HH24:MI:SS',
};

const dbConection = {
    user: 'homehub',
    host: 'localhost',
    database: 'homehubd',
    password: 'homehub',
    port: 5432, // Port default PostgreSQL
};

const fileTypes = {
    news: 'news-media',
    transaction: "transaction-mmedia"
}

module.exports = {
    timeConfig,
    dbConection,
    fileTypes,
};
