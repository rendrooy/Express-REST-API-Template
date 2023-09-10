'use strict';
const uuidv4 = require('uuid');
const moment = require('moment');
const locales = require('../../config/locales');
const { sequelizeConnection } = require('../../connection/db');
const formidable = require('formidable');
const fs = require('fs');
const multer = require('multer');
const { resFileName } = require('../../connection/multer-config');

const { News, FileType, ValidFileTypes } = require('../../model/newsModel');
const Member = require('../../model/memberModel');
const { whereBuilder } = require('../../connection/db');
const { timeConfig } = require('../../config');
const {
  operatorTypes,
  queryOption,
} = require('../../connection/query-builder');

const getNews = async (params) => {
  try {
    const news = await News.findByPk(params);
    return news;
  } catch (error) {
    console.error(
      'Error: Unable to execute promotionService.getAll => ',
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

const findNews = async (params) => {
  try {
    const limit = parseInt(params.limit || queryOption.limit);
    const page = parseInt(params.page || queryOption.page);
    const offset = (page - 1) * limit;
    const conditions = [];
    const order = {
      order_by: params.order_by || 'createdat',
      order_dir: params.order_dir || 'DESC',
    };

    const news = await News.findAll({
      offset,

      limit: limit,
    });

    const filteredCount = news.length;
    const totalCount = await News.count();
    console.log(totalCount);
    return { totalCount: totalCount, count: filteredCount, data: news };
  } catch (error) {
    console.error(
      'Error: Unable to execute promotionService.getAll => ',
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

const uploadFile = async (req) => {
  // const now = moment().format(timeConfig.moment);

  try {
    const news = await News.findByPk(req.headers['news-id']);

    if (news.id) {
      return resFileName;
    } else {
      return {
        status: 500,
        error: {
          message: locales.resource_not_found,
        },
      };
    }
  } catch (error) {
    console.error(
      'Error: Unable to execute promotionService.uploadFile => ',
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

const insertNews = async (params) => {
  try {
    const now = moment().format(timeConfig.moment);

    let dataRaw = {
      id: uuidv4.v4(),
      title: params.title,
      content: params.content,
      createdat: now,
      updatedat: now,
    };
    await News.create(dataRaw);
    return dataRaw;
  } catch (error) {
    console.error(
      'Error: Unable to execute promotionService.getAll => ',
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

const updateNews = async (query, params) => {
  try {
    const newsIdToUpdate = params.id;

    const [rowCount, [updatedNews]] = await News.update(params, {
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
    return {
      status: 500,
      error: {
        message: locales.unable_to_handle_request,
      },
    };
  }
};

const deleteNews = async (params) => {
  console.log(params.id);
  try {
    const newsIdToDelete = params.id;

    const rowCount = await News.destroy({
      where: {
        id: newsIdToDelete,
      },
    });

    if (rowCount > 0) {
      console.log('Data telah dihapus.');
      return { ...params, rowsAffected: rowCount };
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
    console.log(error);
    return {
      status: 500,
      error: {
        message: locales.unable_to_handle_request,
      },
    };
  }
};

module.exports = {
  getNews,
  findNews,
  insertNews,
  updateNews,
  uploadFile,
  deleteNews,
};
