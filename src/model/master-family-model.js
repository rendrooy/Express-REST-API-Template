const {DataTypes} = require('sequelize');
const {sequelizeConnection} = require('../connection/db');

const MasterFamily = sequelizeConnection.define('master_family', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    no_kk: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    no_pbb: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    postal_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status_adm: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    status_dom: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    created_time: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    updated_time: {
        type: DataTypes.DATE,
        allowNull: true,
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
        allowNull: true,
    },
}, {
    tableName: 'master_family',
    timestamps: false, // karena sudah pakai created_time & updated_time manual
    freezeTableName: true, // biar gak dijamak jadi 'master_families'
});

sequelizeConnection
    .sync()
    .then(() => {
        console.log('Tabel master_family berhasil disinkronisasi.');
    })
    .catch((error) => {
        console.error('Terjadi kesalahan:', error);
    });

module.exports = MasterFamily;
