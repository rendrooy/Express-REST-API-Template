const { Sequelize, DataTypes } = require('sequelize');
const { sequelizeConnection } = require('../connection/db');
const Family = require('./familyModel');

const sequelize = sequelizeConnection;

const Member = sequelize.define('members', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  nik: {
    type: DataTypes.STRING(20),
    unique: true,
  },
  address: {
    type: DataTypes.TEXT,
  },
  birthdate: {
    type: DataTypes.DATE,
  },
  birthplace: {
    type: DataTypes.STRING(100),
  },
  sex: {
    type: DataTypes.CHAR(1),
  },
  profession: {
    type: DataTypes.STRING(100),
  },
  religion: {
    type: DataTypes.STRING(50),
  },
  phone: {
    type: DataTypes.STRING(15),
  },
  bloodtype: {
    type: DataTypes.STRING(5),
  },
  familyid: {
    type: DataTypes.UUID,
    references: {
      model: Family,
      key: 'id',
    },
  },
  familyrelation: {
    type: DataTypes.STRING(100),
  },
  createdat: {
    type: DataTypes.DATE,
  },
  updatedat: {
    type: DataTypes.DATE,
  },
});

// Member.belongsTo(Family, { foreignKey: 'familyid', targetKey: 'id' });

sequelize
  .sync()
  .then(() => {
    console.log('Tabel Member berhasil disinkronisasi.');
  })
  .catch((error) => {
    console.error('Terjadi kesalahan:', error);
  });

module.exports = Member;
