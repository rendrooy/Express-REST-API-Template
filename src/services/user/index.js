'use strict';
const uuidv4 = require('uuid');
const moment = require('moment');
const bcrypt = require('bcrypt');
const locales = require('../../config/locales');
const User = require('../../model/userModel');
const Member = require('../../model/memberModel');
const { whereBuilder } = require('../../connection/db');
const { timeConfig } = require('../../config');
const {
  operatorTypes,
  queryOption,
} = require('../../connection/query-builder');

const getUser = async (params) => {
  try {
    const users = await User.findByPk(params);
    return users;
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

const findUser = async (params) => {
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
    const users = await User.findAll({
      where: await whereBuilder(conditions),

      order: [[order.order_by, order.order_dir]],
      offset,
      limit: limit,
    });

    const filteredCount = users.length;
    const totalCount = await User.count();
    console.log(totalCount);
    return { totalCount: totalCount, count: filteredCount, data: users };
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

const insertUser = async (params) => {
  try {
    const now = moment().format(timeConfig.moment);
    const saltRounds = 10;

    const member = await Member.findByPk(params.memberid);
    if (member == null) {
      return {
        status: 404,
        error: {
          message: locales.member_not_registered,
        },
      };
    }

    // const hash =
    let dataRaw = {
      id: uuidv4.v4(),
      email: params.email,
      password: bcrypt.hashSync(params.password, saltRounds),
      memberid: params.memberid,
      role: params.role || 'USERS',
      createdat: now,
      updatedat: now,
    };

    const newUser = await User.create({
      ...dataRaw,
    });
    return newUser;
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

const updateUser = async (query, params) => {
  try {
    const userIdToUpdate = params.id;

    const [rowCount, [updatedUser]] = await User.update(params, {
      where: {
        id: userIdToUpdate,
      },
      returning: true,
    });

    if (rowCount > 0) {
      console.log('Data yang telah di-update:', updatedUser.toJSON());
      return updatedUser;
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

const deleteUser = async (params) => {
  try {
    const userIdToDelete = params.id;

    const rowCount = await User.destroy({
      where: {
        id: userIdToDelete,
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
  getUser,
  findUser,
  insertUser,
  updateUser,
  deleteUser,
};
