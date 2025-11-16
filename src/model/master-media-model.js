const { DataTypes } = require('sequelize');
const { sequelizeConnection } = require('../connection/db');

const MasterMedia = sequelizeConnection.define('master_media', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    file_path: {
        type: DataTypes.STRING,
    },
    file_type: {
        type: DataTypes.STRING,
    },
    file_name: {
        type: DataTypes.STRING,
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
    tableName: 'master_media',
    timestamps: false, // karena sudah pakai created_time & updated_time
    freezeTableName: true, // biar nama tabel gak dijamakkan
});

sequelizeConnection
    .sync()
    .then(() => {
        console.log('Tabel master_media berhasil disinkronisasi.');
    })
    .catch((error) => {
        console.error('Terjadi kesalahan:', error);
    });

module.exports = MasterMedia;
