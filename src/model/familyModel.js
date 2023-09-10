const { Sequelize, DataTypes } = require('sequelize');
const { sequelizeConnection } = require('../connection/db');
const Member = require('./memberModel');

// Konfigurasi koneksi ke database PostgreSQL
const sequelize = sequelizeConnection;

// Membuat model 'Family'
const Family = sequelize.define(
  'families',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    nokk: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postalcode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nopbb: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    statusadm: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    statusdom: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    familyheadid: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: 'families',
    timestamps: false,
  }
);

Family.associate = (models) => {
  Family.hasMany(Member, {
    foreignKey: 'id',
    as: 'familyhead',
  });
};

// Sinkronkan model dengan database jika diperlukan
// Family.sync({ force: true }); // Hati-hati dengan menggunakan { force: true }, ini akan menghapus tabel yang ada
sequelize
  .sync()
  .then(() => {
    console.log('Tabel Family berhasil disinkronisasi.');
  })
  .catch((error) => {
    console.error('Terjadi kesalahan:', error);
  });
// Ekspor model untuk digunakan dalam aplikasi Anda
module.exports = Family;
