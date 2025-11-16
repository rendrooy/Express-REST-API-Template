const multer = require('multer');
const uuid = require('uuid');
const {timeConfig} = require('../config');

const moment = require('moment');
const {MasterMediaModel} = require('../model/master-media-model');

let resFileName = '';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(
            null,
            'D:/Project/Web/BE/Express-REST-API-Template/src/storages'
        );
    },
    filename: function (req, file, cb) {
        console.log(req.headers);
        const now = moment().format(timeConfig.moment);
        MasterMediaModel.create({
            id: uuid.v4(),
            file_name: Date.now() + '-' + file.originalname,
            created_time: now,
        });

        cb(null, Date.now() + '-' + file.originalname)
    },
});

const upload = multer({storage: storage});

module.exports = {upload, resFileName};
