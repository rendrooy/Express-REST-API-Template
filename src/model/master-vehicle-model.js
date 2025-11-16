const {DataTypes} = require('sequelize');
const {sequelizeConnection} = require('../connection/db');

const MasterVehicle = sequelizeConnection.define('master_vehicle', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    model: {
        type: DataTypes.STRING,
    },
    brand: {
        type: DataTypes.STRING,
    },
    license_plate: {
        type: DataTypes.STRING,
    },
    family_id: {
        type: DataTypes.STRING,
        references: {
            model: 'master_family',
            key: 'id',
        },
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
    tableName: 'master_vehicle',
    timestamps: false, // karena sudah pakai created_time & updated_time
    freezeTableName: true, // biar nama tabel gak dijamakkan
});


sequelizeConnection
    .sync()
    .then(() => {
        console.log('Tabel master_vehicle berhasil disinkronisasi.');
    })
    .catch((error) => {
        console.error('Terjadi kesalahan:', error);
    });

module.exports = MasterVehicle;
