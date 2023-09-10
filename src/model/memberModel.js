const { Sequelize, DataTypes } = require('sequelize');
const { sequelizeConnection } = require('../connection/db');
const Family = require('./familyModel');

const sequelize = sequelizeConnection;

const Member = sequelize.define(
  'members',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nik: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    birthplace: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sex: {
      type: DataTypes.CHAR(1),
      allowNull: true,
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    religion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bloodtype: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    familyrelation: {
      type: DataTypes.STRING,
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
    familyid: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: 'members',
    timestamps: false,
  }
);

Member.associate = (models) => {
  Member.belongsTo(Family, {
    foreignKey: 'familyid',
    as: 'family',
  });
};

sequelize
  .sync()
  .then(() => {
    console.log('Tabel Member berhasil disinkronisasi.');
  })
  .catch((error) => {
    console.error('Terjadi kesalahan:', error);
  });

module.exports = Member;
