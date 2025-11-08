const { DataTypes } = require('sequelize');
const { sequelizeConnection } = require('../connection/db');

const MasterMember = sequelizeConnection.define('master_member', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.STRING,
    },
    phone: {
        type: DataTypes.STRING,
    },
    blood_type: {
        type: DataTypes.STRING,
    },
    sex: {
        type: DataTypes.STRING,
    },
    bod: {
        type: DataTypes.DATE, // birth of date
    },
    boc: {
        type: DataTypes.STRING, // birth of city
    },
    profession: {
        type: DataTypes.STRING,
    },
    religion: {
        type: DataTypes.STRING,
    },
    family_relation: {
        type: DataTypes.STRING,
    },
    family_id: {
        type: DataTypes.STRING,
    },
    created_time: {
        type: DataTypes.DATE,
    },
    updated_time: {
        type: DataTypes.DATE,
    },
    is_deleted: {
        type: DataTypes.INTEGER,
    },
}, {
    tableName: 'master_member',
    timestamps: false, // karena sudah pakai created_time & updated_time
    freezeTableName: true, // biar nama tabel gak dijamakkan
});


sequelizeConnection
    .sync()
    .then(() => {
        console.log('Tabel master_member berhasil disinkronisasi.');
    })
    .catch((error) => {
        console.error('Terjadi kesalahan:', error);
    });

module.exports = MasterMember;
