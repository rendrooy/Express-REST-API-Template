const multer = require('multer');
const uuidv4 = require('uuid');
const { timeConfig } = require('../config');

const moment = require('moment');
const { NewsMedia } = require('../model/newsMediaModel');

let resFileName = '';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      'C:/Users/1473/Desktop/Project/Express-REST-API-Template/src/storages'
    );
  },
  filename: function (req, file, cb) {
    console.log(req.headers);
    const now = moment().format(timeConfig.moment);
    NewsMedia.create({
      id: uuidv4.v4(),
      filename: Date.now() + '-' + file.originalname,
      newsid: req.headers['news-id'],
      originalname: file.originalname,
      createdat: now,
      updatedat: now,
    });
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = { upload, resFileName };
