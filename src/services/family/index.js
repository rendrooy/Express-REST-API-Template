'use strict';
const uuidv4 = require('uuid');
const moment = require('moment');
const { sequelizeConnection } = require('../../connection/db');

const locales = require('../../config/locales');
const Family = require('../../model/familyModel');
const Member = require('../../model/memberModel');
const { whereBuilder } = require('../../connection/db');
const { timeConfig } = require('../../config');
const {
  operatorTypes,
  queryOption,
} = require('../../connection/query-builder');

const getFamily = async (params) => {
  try {
    const families = await Family.findByPk(params);
    return families;
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

const findFamily = async (params) => {
  try {
    const limit = parseInt(params.limit || queryOption.limit);
    const page = parseInt(params.page || queryOption.page);
    const offset = (page - 1) * limit;
    const conditions = [];
    const order = {
      order_by: params.order_by || 'createdat',
      order_dir: params.order_dir || 'DESC',
    };

    const families = await Family.findAll({
      order: [[order.order_by, order.order_dir]],
      offset,
      include: [
        {
          model: Member,
          attributes: ['id', 'name', 'nik'],
        },
      ],
      limit: limit,
    });

    const filteredCount = families.length;
    const totalCount = await Family.count();
    console.log(totalCount);
    return { totalCount: totalCount, count: filteredCount, data: families };
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

const insertFamily = async (params) => {
  try {
    const now = moment().format(timeConfig.moment);

    let dataRaw = {
      id: uuidv4.v4(),
      nokk: params.nokk,
      nopbb: params.nopbb,
      statusadm: params.statusadm,
      statusdom: params.statusdom,
      address: params.address,
      postalcode: params.postalcode,
      RT: params.rt,
      familyheadid: params.familyheadid,
      createdat: now,
      updatedat: now,
    };

    const newFamily = await Family.create({
      ...dataRaw,
    });
    return newFamily;
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

const updateFamily = async (query, params) => {
  try {
    const familyIdToUpdate = params.id;

    const [rowCount, [updatedFamily]] = await Family.update(params, {
      where: {
        id: familyIdToUpdate,
      },
      returning: true,
    });

    if (rowCount > 0) {
      console.log('Data yang telah di-update:', updatedFamily.toJSON());
      return updatedFamily;
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

const deleteFamily = async (params) => {
  console.log(params.id);
  try {
    const familyIdToDelete = params.id;
    await Member.update(
      { familyid: null },
      { where: { familyid: familyIdToDelete } }
    );
    const rowCount = await Family.destroy({
      where: {
        id: familyIdToDelete,
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
  getFamily,
  findFamily,
  insertFamily,
  updateFamily,
  deleteFamily,
};
