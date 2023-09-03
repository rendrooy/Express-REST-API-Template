const { Sequelize, DataTypes } = require('sequelize');
const { sequelizeConnection } = require('../connection/db');
const Member = require('./memberModel');

// Konfigurasi koneksi ke database PostgreSQL
const sequelize = sequelizeConnection;

// Membuat model 'Family'
const Family = sequelize.define('families', {
  // Definisikan atribut sesuai dengan struktur tabel
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  nokk: {
    type: DataTypes.STRING,
    unique: true,
  },
  familyhead: {
    type: DataTypes.STRING,
    unique: true,
  },
  address: {
    type: DataTypes.STRING,
  },
  postalcode: {
    type: DataTypes.STRING,
  },
  rt: {
    type: DataTypes.STRING,
  },
  nopbb: {
    type: DataTypes.STRING,
    unique: true,
  },
  statusadm: {
    type: DataTypes.BOOLEAN, // Menggunakan tipe data BOOLEAN untuk statusadm
  },
  statusdom: {
    type: DataTypes.BOOLEAN, // Menggunakan tipe data BOOLEAN untuk statusdom
  },
  familyheadid: {
    type: DataTypes.UUID,
    references: {
      model: Member, // Model yang diacu adalah 'Member'
      key: 'id', // Kolom yang diacu adalah 'id' dalam 'Member'
    },
  },
  createdat: {
    type: DataTypes.DATE,
  },
  updatedat: {
    type: DataTypes.DATE,
  },
});

// Sinkronkan model dengan database jika diperlukan
// Family.sync({ force: true }); // Hati-hati dengan menggunakan { force: true }, ini akan menghapus tabel yang ada
sequelize
  .sync()
  .then(() => {
    console.log('Tabel Member berhasil disinkronisasi.');
  })
  .catch((error) => {
    console.error('Terjadi kesalahan:', error);
  });
// Ekspor model untuk digunakan dalam aplikasi Anda
module.exports = Family;
