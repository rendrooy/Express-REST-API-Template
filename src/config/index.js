const timeConfig = {
    momentDate: 'YYYY-MM-DD',
    oracleDate: 'YYYY-MM-DD',
    clock: 'HH:mm:ss',
    moment: 'YYYY-MM-DD HH:mm:ss',
    oracle: 'YYYY-MM-DD HH24:MI:SS',
};

const dbConnection = {
    user: 'homehub',
    host: 'localhost',
    database: 'homehub',
    password: 'homehub',
    port: 5432,
};

const fileTypes = {
    news: 'news-media',
    transaction: "transaction-mmedia"
}

module.exports = {
    timeConfig,
    dbConnection,
    fileTypes,
};
