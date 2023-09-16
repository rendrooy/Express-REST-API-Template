const { Sequelize, DataTypes } = require('sequelize');
const { sequelizeConnection } = require('../connection/db');
const sequelize = sequelizeConnection;

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    memberid: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedtime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'users', // Nama tabel yang sesuai dengan definisi Anda
    timestamps: false, // Sesuaikan dengan kebutuhan Anda
  }
);

// Anda juga dapat menentukan hubungan dengan tabel lain di sini jika diperlukan

sequelize
  .sync()
  .then(() => {
    console.log('Tabel Users berhasil disinkronisasi.');
  })
  .catch((error) => {
    console.error('Terjadi kesalahan:', error);
  });

module.exports = User;
