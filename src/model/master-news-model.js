const {DataTypes} = require('sequelize');
const {sequelizeConnection} = require('../connection/db');

const MasterNews = sequelizeConnection.define('master_news', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
    },
    media_id: {
        type: DataTypes.STRING,
        // references: {
        //     model: 'master_media',
        //     key: 'id',
        // }
    },
    created_time: {
        type: DataTypes.DATE,
    },
    updated_time: {
        type: DataTypes.DATE,
    },
    created_by_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    updated_by_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_deleted: {
        type: DataTypes.INTEGER,
    },
}, {
    tableName: 'master_news',
    timestamps: false, // karena sudah pakai created_time & updated_time
    freezeTableName: true, // biar nama tabel gak dijamakkan
});

sequelizeConnection
    .sync()
    .then(() => {
        console.log('Tabel master_news berhasil disinkronisasi.');
    })
    .catch((error) => {
        console.error('Terjadi kesalahan:', error);
    });

module.exports = MasterNews;
