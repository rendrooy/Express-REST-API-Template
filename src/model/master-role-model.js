const {DataTypes} = require('sequelize');
const {sequelizeConnection} = require('../connection/db');

const MasterRole = sequelizeConnection.define('master_role', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
    },
    code: {
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
    tableName: 'master_role',
    timestamps: false, // karena pakai created_time & updated_time manual
    freezeTableName: true,
});


sequelizeConnection
    .sync()
    .then(() => {
        console.log('Tabel master_role berhasil disinkronisasi.');
    })
    .catch((error) => {
        console.error('Terjadi kesalahan:', error);
    });

module.exports = MasterRole;
