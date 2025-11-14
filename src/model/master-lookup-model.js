const { DataTypes } = require('sequelize');
const { sequelizeConnection } = require('../connection/db');

const MasterMember = sequelizeConnection.define('master_lookup', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.STRING,
    },
    value: {
        type: DataTypes.INTEGER,
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
    tableName: 'master_lookup',
    timestamps: false, // karena sudah pakai created_time & updated_time
    freezeTableName: true, // biar nama tabel gak dijamakkan
});


sequelizeConnection
    .sync()
    .then(() => {
        console.log('Tabel master_lookup berhasil disinkronisasi.');
    })
    .catch((error) => {
        console.error('Terjadi kesalahan:', error);
    });

module.exports = MasterMember;
