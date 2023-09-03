'use strict';
const uuidv4 = require('uuid');
const moment = require('moment');
const locales = require('../../config/locales');
const Member = require('../../model/memberModel');
const { whereBuilder } = require('../../connection/db');
const { timeConfig } = require('../../config');
const {
  operatorTypes,
  queryOption,
} = require('../../connection/query-builder');

const getMember = async (params) => {
  try {
    const members = await Member.findByPk(params);
    return members;
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

const findMember = async (params) => {
  try {
    const limit = parseInt(params.limit || queryOption.limit);
    const page = parseInt(params.page || queryOption.page);
    const offset = (page - 1) * limit;
    const conditions = [];
    const order = {
      order_by: params.order_by || 'createdat',
      order_dir: params.order_dir || 'DESC',
    };
    if (params.name) {
      conditions.push({
        column: 'name',
        operator: operatorTypes.like,
        value: params.name,
      });
    }
    if (params.nik) {
      conditions.push({
        column: 'nik',
        operator: operatorTypes.like,
        value: params.nik,
      });
    }
    if (params.religion) {
      conditions.push({
        column: 'religion',
        operator: operatorTypes.equal,
        value: params.religion,
      });
    }
    if (params.sex) {
      conditions.push({
        column: 'sex',
        operator: operatorTypes.equal,
        value: params.sex,
      });
    }
    if (params.bloodtype) {
      conditions.push({
        column: 'bloodtype',
        operator: operatorTypes.equal,
        value: params.bloodtype,
      });
    }
    if (params.familyrelation) {
      conditions.push({
        column: 'familyrelation',
        operator: operatorTypes.equal,
        value: params.familyrelation,
      });
    }
    const members = await Member.findAll({
      where: await whereBuilder(conditions),
      order: [[order.order_by, order.order_dir]],
      offset,
      limit: limit,
    });

    const filteredCount = members.length;
    const totalCount = await Member.count();
    console.log(totalCount);
    return { totalCount: totalCount, count: filteredCount, data: members };
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

const insertMember = async (params) => {
  try {
    const now = moment().format(timeConfig.moment);

    let dataRaw = {
      id: uuidv4.v4(),
      name: params.name,
      nik: params.nik,
      address: params.address,
      birthdate: params.birthdate,
      birthplace: params.birthplace,
      sex: params.sex,
      profession: params.profession,
      religion: params.religion,
      phone: params.phone,
      bloodtype: params.bloodtype,
      familyid: params.familyid,
      familyrelation: params.familyrelation,
      createdat: now,
      updatedat: now,
    };

    const newMember = await Member.create({
      ...dataRaw,
    });
    return newMember;
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

const updateMember = async (query, params) => {
  try {
    const memberIdToUpdate = params.id;

    const [rowCount, [updatedMember]] = await Member.update(params, {
      where: {
        id: memberIdToUpdate,
      },
      returning: true,
    });

    if (rowCount > 0) {
      console.log('Data yang telah di-update:', updatedMember.toJSON());
      return updatedMember;
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

const deleteMember = async (params) => {
  try {
    const memberIdToDelete = params.id;

    const rowCount = await Member.destroy({
      where: {
        id: memberIdToDelete,
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
    return {
      status: 500,
      error: {
        message: locales.unable_to_handle_request,
      },
    };
  }
};

module.exports = {
  getMember,
  findMember,
  insertMember,
  updateMember,
  deleteMember,
};
