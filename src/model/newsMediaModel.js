const { Sequelize, DataTypes } = require('sequelize');

const { sequelizeConnection } = require('../connection/db');
const sequelize = sequelizeConnection;

const FileType = {
  newsImage: 'news-image',
};

const ValidFileTypes = [FileType.newsImage];

const NewsMedia = sequelize.define('newsmedia', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  newsid: {
    type: DataTypes.UUID,
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
    console.log('Tabel NewsMedia berhasil disinkronisasi.');
  })
  .catch((error) => {
    console.error('Terjadi kesalahan:', error);
  });

module.exports = { NewsMedia, FileType, ValidFileTypes };
