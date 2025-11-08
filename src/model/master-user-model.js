const { sequelize, DataTypes } = require('sequelize');
const { sequelizeConnection } = require('../connection/db');
const MasterRole = require('./master-role-model'); // pastikan ada model ini
const MasterMember = require('./master-member-model'); // pastikan ada model ini

const MasterUser = sequelizeConnection.define('master_user', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
    role_id: {
        type: DataTypes.STRING,
        references: {
            model: 'master_role',
            key: 'id',
        },
    },
    member_id: {
        type: DataTypes.STRING,
        references: {
            model: 'master_member',
            key: 'id',
        },
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
    tableName: 'master_user',
    timestamps: false, // karena kamu pakai created_time & updated_time manual
    freezeTableName: true, // biar nggak diubah jadi jamak oleh Sequelize
});

// --- Relasi (optional, tapi direkomendasikan) ---
MasterUser.belongsTo(MasterRole, {
    foreignKey: 'role_id',
    as: 'role',
});

MasterUser.belongsTo(MasterMember, {
    foreignKey: 'member_id',
    as: 'member',
});


// Anda juga dapat menentukan hubungan dengan tabel lain di sini jika diperlukan

sequelizeConnection
    .sync()
    .then(() => {
        console.log('Tabel master_user berhasil disinkronisasi.');
    })
    .catch((error) => {
        console.error('Terjadi kesalahan:', error);
    });

module.exports = MasterUser;
