'use strict';

const fs = require('fs');
const path = require("path");
const uuidv4 = require('uuid');
const moment = require('moment');
const bcrypt = require('bcrypt');
const locales = require('../config/locales');
const {verfyToken} = require('./auth-services');
const masterNewsModel = require('../model/master-news-model');
const masterMediaModel = require('../model/master-media-model');
const {whereBuilder} = require('../connection/db');

const {formidable} = require('formidable');
const {timeConfig, fileTypes} = require('../config');
const {operatorTypes, queryOption} = require('../connection/query-builder');
const {Op} = require('sequelize');

const getNews = async (currentUser, params) => {
    try {
        const newsData = await masterNewsModel.findOne({
            where: {
                id: params.id,
                is_deleted: 0,
            },
        });
        if (newsData == null) {
            return {
                status: 404,
                error: {
                    message: locales.resource_not_found,
                },
            };
        } else return newsData;
    } catch (error) {
        console.error(
            'Error: Unable to execute masterNewsService.getAll => ',
            error
        );
        return {
            status: 500,
            error: {
                message: locales.unable_to_handle_request,
            },
        };
    }
};

const findNews = async (currentUser, params) => {
    try {
        const limit = parseInt(params.limit || queryOption.limit);
        const page = parseInt(params.page || queryOption.page);
        const offset = (page - 1) * limit;
        const conditions = [];
        const order = {
            order_by: params.order_by || 'created_time',
            order_dir: params.order_dir || 'DESC',
        };
        conditions.push({
            column: 'is_deleted',
            operator: operatorTypes.equal,
            value: 0,
        });
        const news = await masterNewsModel.findAll({
            where: await whereBuilder(conditions),

            order: [[order.order_by, order.order_dir]],
            offset,
            limit: limit,
        });

        const filteredCount = news.length;
        const totalCount = await masterNewsModel.count({
                where: {
                    is_deleted: 0, // ✅ cuma hitung yang belum dihapus
                },
            }
        );
        console.log(totalCount);
        return {totalCount: totalCount, count: filteredCount, data: newss};
    } catch (error) {
        console.error(
            'Error: Unable to execute masterNewsService.getAll => ',
            error
        );
        return {
            status: 500,
            error: {
                message: locales.unable_to_handle_request,
            },
        };
    }
};

const insertNews = async (currentUser, params) => {
    try {
        const now = moment().toDate();
        // CHECK USERNAME / EMAIL
        const newsData = await masterNewsModel.findOne({
            where: {
                [Op.and]: [
                    {value: params.value},
                    {type: params.type},
                    {is_deleted: 0},
                ],
            },
        });
        // return newsData.dataValues;

        if (newsData != null) return {
            status: 401,
            error: {
                message: locales.resource_already_exists,
            },
        };

        const data = {
            ...params,
            id: uuidv4.v4(),
            created_by_id: currentUser.id,
            created_time: now,
            is_deleted: 0
        }

        // INSERT DATA
        return await masterNewsModel.create(data);
    } catch (error) {
        console.error(
            'Error: Unable to execute masterNewsService.getAll => ',
            error
        );
        return {
            status: 500,
            error: {
                message: locales.unable_to_handle_request,
            },
        };
    }
};

const updateNews = async (currentUser, params) => {
    try {
        const now = moment().toDate();
        const newsIdToUpdate = params.id;
        const [rowCount, [updatedNews]] = await masterNewsModel.update(
            {
                ...params,
                updated_time: now,
                updated_by_id: currentUser.id
            }, {
                where: {
                    id: newsIdToUpdate,
                },
                returning: true,
            });

        if (rowCount > 0) {
            console.log('Data yang telah di-update:', updatedNews.toJSON());
            return updatedNews;
        } else {
            console.log('Data tidak ditemukan atau tidak ada perubahan.');
            return {
                status: 404,
                error: {
                    message: locales.unable_to_handle_request,
                },
            };
        }
    } catch (error) {
        console.error(
            'Error: Unable to execute masterNewsService.update => ',
            error
        );
        return {
            status: 500,
            error: {
                message: locales.unable_to_handle_request,
            },
        };
    }
};

const deleteNews = async (currentUser, params) => {
    try {
        const now = moment().toDate();
        const newsIdToDelete = params.id;
        const paramsDelete = {
            is_deleted: 1,
            updated_by_id: currentUser.id,
            updated_time: now
        }
        const [rowCount, [updatedNews]] = await masterNewsModel.update(
            {
                ...paramsDelete,
            }, {
                where: {
                    id: newsIdToDelete,
                },
                returning: true,
            });
        if (rowCount > 0) {
            console.log('Data telah dihapus.');
            return {...params, rowsAffected: rowCount};
        } else {
            console.log('Data tidak ditemukan atau tidak ada yang dihapus.');
            return {
                status: 404,
                error: {
                    message: locales.unable_to_handle_request,
                },
            };
        }
    } catch (error) {
        console.error(
            'Error: Unable to execute masterNewsService.delete => ',
            error
        );
        return {
            status: 500,
            error: {
                message: locales.unable_to_handle_request,
            },
        };
    }
};

const uploadFile = async (req, callback) => {
    try {
        const currentUser = await verfyToken(req)
        console.log(currentUser)
        const news_id = req.headers["id"];
        const fileType = req.headers["type"];
        const now = moment().toDate();

        const newsData = await masterNewsModel.findOne({
            where: {
                id: news_id,
                is_deleted: 0,
            },
        });

        if (!newsData) {
            return callback({
                status: 404,
                error: {message: locales.resource_not_found},
            });
        }

        if (fileType !== fileTypes.news) {
            return callback({
                status: 500,
                error: {message: locales.unable_to_handle_request},
            });
        }

        const form = formidable({
            multiples: false,
            keepExtensions: true,
        });

        let finalFileName = "";

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error(err);
                return callback({
                    status: 500,
                    error: {message: locales.unable_to_handle_request},
                });
            }
            const file = files.file?.[0];
            if (!file) {
                return callback({
                    status: 400,
                    error: {message: "No file received"},
                });
            }

            // >>> FIX: ext harus diambil dari nama file, bukan seluruh filename
            const ext = path.extname(file.originalFilename);

            finalFileName = `${fileType}-${news_id}-${moment().unix()}${ext}`;

            const oldPath = file.filepath;  // path temp (C:\Users...)
            const storagePath = path.join(
                process.cwd(),
                "src",
                "storages",
                finalFileName
            );

            try {
                // ensure folder exists
                await fs.promises.mkdir(
                    path.join(process.cwd(), "src", "storages"),
                    {recursive: true}
                );

                // >>> FIX: rename diganti copy → delete
                await fs.promises.copyFile(oldPath, storagePath);
                await fs.promises.unlink(oldPath);

                // const data = 


                const dataMediaModel = await masterMediaModel.create(
                    {
                        id: uuidv4.v4(),
                        file_type: fileType,
                        file_name: finalFileName,
                        created_by_id: currentUser.id,
                        created_time: now,
                        is_deleted: 0
                    }
                )

                return callback(dataMediaModel);

            } catch (moveErr) {
                console.error("MOVE FILE ERROR:", moveErr);
                return callback({
                    status: 500,
                    error: {message: locales.unable_to_handle_request},
                });
            }
        });

    } catch (error) {
        console.error("Error uploadFile => ", error);
        callback({
            status: 500,
            error: {message: locales.unable_to_handle_request},
        });
    }
};

module.exports = {
    getNews,
    findNews,
    insertNews,
    updateNews,
    deleteNews,
    uploadFile
};
