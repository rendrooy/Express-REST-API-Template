'use strict';
const uuidv4 = require('uuid');
const moment = require('moment');
const { Sequelize } = require('sequelize');

const locales = require('../../config/locales');
const Family = require('../../model/familyModel');
const Member = require('../../model/memberModel');
const { whereBuilder, sequelizeConnection } = require('../../connection/db');
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

    const families = await sequelizeConnection.query(
      `select
      f.id,
      f.nokk,
      f.postalcode,
      f.rt,
      f.nopbb,
      f.statusadm,
      f.statusdom,
      f.createdat,
      f.updatedat,
      m.id as kepalakeluargaid,
      m.name as kepalakeluarganame
    from
      delabel.families f
    inner join delabel.members m on
      m.familyid = f.id and m.familyrelation = 'Kepala Keluarga'
        ORDER by f.createdat  DESC LIMIT ${limit} OFFSET ${offset}  
        `,
      {
        raw: true,
      }
    );
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
      familyheadid: params.familyheadid || null,
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
  const t = await sequelizeConnection.transaction();
  try {
    const familyIdToDelete = params.id;

    await Member.update(
      { familyid: null, familyrelation: null },
      { where: { familyid: familyIdToDelete } },
      { transaction: t }
    );
    const rowCount = await Family.destroy(
      {
        where: {
          id: familyIdToDelete,
        },
      },
      { transaction: t }
    );
    await t.commit();

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
    await t.rollback();

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
