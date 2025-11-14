'use strict';
const uuidv4 = require('uuid');
const moment = require('moment');
const bcrypt = require('bcrypt');
const locales = require('../config/locales');
const masterRoleModel = require('../model/master-role-model');
const masterMemberModel = require('../model/master-member-model');
const { whereBuilder } = require('../connection/db');
const { timeConfig } = require('../config');
const {
    operatorTypes,
    queryOption,
} = require('../connection/query-builder');
const { Op } = require('sequelize');


const getRole = async (currentUser, params) => {
    try {
        const roleData = await masterRoleModel.findOne({
            where: {
                id: params.id,
                is_deleted: 0,
            },
        });
        if (roleData == null) {
            return {
                status: 404,
                error: {
                    message: locales.resource_not_found,
                },
            };
        } else return roleData;
    } catch (error) {
        console.error(
            'Error: Unable to execute masterRoleService.getAll => ',
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

const findRole = async (currentUser, params) => {
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
        if (params.name) {
            conditions.push({
                column: 'name',
                operator: operatorTypes.like,
                value: params.name,
            });
        }
        if (params.code) {
            conditions.push({
                column: 'code',
                operator: operatorTypes.like,
                value: params.code,
            });
        }
        const roles = await masterRoleModel.findAll({
            where: await whereBuilder(conditions),

            order: [[order.order_by, order.order_dir]],
            offset,
            limit: limit,
        });

        const filteredCount = roles.length;
        const totalCount = await masterRoleModel.count({
            where: {
                is_deleted: 0, // ✅ cuma hitung yang belum dihapus
            },
        }
);
        console.log(totalCount);
        return { totalCount: totalCount, count: filteredCount, data: roles };
    } catch (error) {
        console.error(
            'Error: Unable to execute masterRoleService.getAll => ',
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

const insertRole = async (currentUser, params) => {
    try {
        const now = moment().toDate();
        // CHECK USERNAME / EMAIL
        const roleData = await masterRoleModel.findOne({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            { code: params.code },
                            { name: params.name },
                        ],
                    },
                    { is_deleted: 0 },
                ],
            },
        });

        if (roleData != null) return {
            status: 401,
            error: {
                message: locales.resource_already_exists,
            },
        };

        // INSERT DATA
        const newRole = await masterRoleModel.create({
            ...params,
            id: uuidv4.v4(),
            created_time: now,
            updated_time: now,
            is_deleted: 0
        });
        return newRole
    } catch (error) {
        console.error(
            'Error: Unable to execute masterRoleService.getAll => ',
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

const updateRole = async (currentUser, params) => {
    try {
        const now = moment().toDate();
        const roleIdToUpdate = params.id;
        const [rowCount, [updatedRole]] = await masterRoleModel.update(
            {
                ...params,
                updated_time: now
            }, {
            where: {
                id: roleIdToUpdate,
            },
            returning: true,
        });

        if (rowCount > 0) {
            console.log('Data yang telah di-update:', updatedRole.toJSON());
            return updatedRole;
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
            'Error: Unable to execute masterRoleService.update => ',
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

const deleteRole = async (currentUser, params) => {
    try {
        const now = moment().toDate();
        const roleIdToDelete = params.id;
        const paramsDelete = {
            is_deleted: 1
        }
        const [rowCount, [updatedRole]] = await masterRoleModel.update(
            {
                ...paramsDelete,
                updated_time: now
            }, {
            where: {
                id: roleIdToDelete,
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
            'Error: Unable to execute masterRoleService.delete => ',
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
    getRole,
    findRole,
    insertRole,
    updateRole,
    deleteRole,
};
