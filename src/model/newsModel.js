const { Sequelize, DataTypes } = require('sequelize');

const { sequelizeConnection } = require('../connection/db');
const sequelize = sequelizeConnection;

const FileType = {
  newsImage: 'news-image',
};

const ValidFileTypes = [FileType.newsImage];

const News = sequelize.define('news', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdat: {
    type: DataTypes.DATE,
  },
  updatedat: {
    type: DataTypes.DATE,
  },
});

// Sinkronkan model dengan database jika diperlukan
// News.sync({ force: true }); // Hati-hati dengan menggunakan { force: true }, ini akan menghapus tabel yang ada
// News.belongsTo(File, { foreignKey: 'fileid', as: 'thumbnail' });

sequelize
  .sync()
  .then(() => {
    console.log('Tabel News berhasil disinkronisasi.');
  })
  .catch((error) => {
    console.error('Terjadi kesalahan:', error);
  });

module.exports = { News, FileType, ValidFileTypes };
