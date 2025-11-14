'use strict';
const uuidv4 = require('uuid');
const moment = require('moment');
const bcrypt = require('bcrypt');
const locales = require('../config/locales');
const masterUserModel = require('../model/master-user-model');
const masterRoleModel = require('../model/master-role-model');
const masterMemberModel = require('../model/master-member-model');
const { whereBuilder } = require('../connection/db');
const { timeConfig } = require('../config');
const {
  operatorTypes,
  queryOption,
} = require('../connection/query-builder');
const { Op } = require('sequelize'); 


const getUser = async (currentUser, params) => {
  try {
    const userData = await masterUserModel.findOne({
      where: {
        id: params.id,
        is_deleted: 0,
      },
      include: [
        {
          model: masterRoleModel,
          as: 'role',
          attributes: ['id', 'name', 'code'],
        },
        {
          model: masterMemberModel,
          as: 'member',
          attributes: ['id', 'name', 'address', 'phone'],
        },
      ],
    });
    if(userData == null) {
      return {
        status: 404,
        error: {
          message: locales.resource_not_found,
        },
      };
    } else return userData;
  } catch (error) {
    console.error(
      'Error: Unable to execute masterUserService.getAll => ',
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

const findUser = async (currentUser, params) => {
    try {
      return currentUser;
      // console.log(currentUser);
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
      if (params.username) {
        conditions.push({
          column: 'username',
          operator: operatorTypes.like,
          value: params.name,
        });
      }
      if (params.email) {
        conditions.push({
          column: 'email',
          operator: operatorTypes.like,
          value: params.email,
        });
      }
      if (params.role_id) {
        conditions.push({
          column: 'role_id',
          operator: operatorTypes.equal,
          value: params.role_id,
        });
      }
      const users = await masterUserModel.findAll({
        where: await whereBuilder(conditions),

        order: [[order.order_by, order.order_dir]],
        offset,
        limit: limit,
      });

      const filteredCount = users.length;
      const totalCount = await masterUserModel.count(
        {
          where: {
            is_deleted: 0, // ✅ cuma hitung yang belum dihapus
          },
        }
      );
      console.log(totalCount);
      return { totalCount: totalCount, count: filteredCount, data: users };
    } catch (error) {
      console.error(
        'Error: Unable to execute masterUserService.getAll => ',
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

const insertUser = async (currentUser, params) => {
  try {
    const now = moment().toDate();
    const saltRounds = 10;
    //CHECK MEMBER
    const memberData = await masterMemberModel.findByPk(params.member_id);
    if (memberData == null) {
      return {
        status: 404,
        error: {
          message: locales.member_not_registered,
        },
      };
    }
    // CHECK ROLE
    let roleData = {};
    if (params.role_id == null) {
      roleData = await masterRoleModel.findOne({
          where: {
              code: 'WRG',
          },
        }
      )
    } else {
        roleData = await masterRoleModel.findByPk(params.role_id)
    }

    // CHECK USERNAME / EMAIL
    const userData = await masterUserModel.findOne({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { email: params.email },
              { username: params.username },
            ],
          },
          { is_deleted: 0 },
        ],
      },
    });


    if (userData != null) return {
      status: 401,
      error: {
        message: locales.email_already_registered,
      },
    };

    
    // INSERT DATA
    const newUser = await masterUserModel.create({
        ... {
            id: uuidv4.v4(),
            email: params.email,
            password: bcrypt.hashSync(params.password, saltRounds),
            member_id: memberData.id,
            role_id: roleData.id,
            username: params.username,
            created_time: now,
            updated_time: now,
            is_deleted: 0
        },
    });
    return newUser
  } catch (error) {
    console.error(
      'Error: Unable to execute masterUserService.getAll => ',
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

const updateUser = async (currentUser, params) => {
  try {
    const now = moment().toDate();
    const userIdToUpdate = params.id;

    const [rowCount, [updatedUser]] = await masterUserModel.update({
      ...params,
      updated_time: now
    }, {
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
    console.error(
      'Error: Unable to execute masterUserService.update => ',
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

const deleteUser = async (currentUser, params) => {
  try {
    const userIdToDelete = params.id;
    const now = moment().toDate();
    const paramsDelete = {
      is_deleted: 1
    }
    const [rowCount, [updatedUser]] = await masterUserModel.update(
      {
        ...paramsDelete,
        updated_time: now
      }, {
      where: {
        id: userIdToDelete,
      },
      returning: true,
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
    console.error(
      'Error: Unable to execute masterUserService.delete => ',
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

module.exports = {
    getUser,
    findUser,
    insertUser,
    updateUser,
    deleteUser,
};
