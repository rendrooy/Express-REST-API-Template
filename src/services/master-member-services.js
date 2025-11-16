'use strict';
const uuidv4 = require('uuid');
const moment = require('moment');
const bcrypt = require('bcrypt');
const locales = require('../config/locales');
const masterMemberModel = require('../model/master-member-model');
const {whereBuilder} = require('../connection/db');
const {timeConfig} = require('../config');
const {
    operatorTypes,
    queryOption,
} = require('../connection/query-builder');
const {Op} = require('sequelize');


const getMember = async (currentUser, params) => {
    try {
        const memberData = await masterMemberModel.findOne({
            where: {
                id: params.id,
                is_deleted: 0,
            },
        });
        if (memberData == null) {
            return {
                status: 404,
                error: {
                    message: locales.resource_not_found,
                },
            };
        } else return memberData;
    } catch (error) {
        console.error(
            'Error: Unable to execute masterMemberService.getAll => ',
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

const findMember = async (currentUser, params) => {
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
        const members = await masterMemberModel.findAll({
            where: await whereBuilder(conditions),

            order: [[order.order_by, order.order_dir]],
            offset,
            limit: limit,
        });

        const filteredCount = members.length;
        const totalCount = await masterMemberModel.count(
            {
                where: {
                    is_deleted: 0, // ✅ cuma hitung yang belum dihapus
                },
            }
        );
        console.log(totalCount);
        return {totalCount: totalCount, count: filteredCount, data: members};
    } catch (error) {
        console.error(
            'Error: Unable to execute masterMemberService.getAll => ',
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

const insertMember = async (currentUser, params) => {
    try {
        const now = moment().toDate();
        // CHECK USERNAME / EMAIL
        const memberData = await masterMemberModel.findOne({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            {nik: params.nik},
                        ],
                    },
                    {is_deleted: 0},
                ],
            },
        });

        if (memberData != null) return {
            status: 401,
            error: {
                message: locales.resource_already_exists,
            },
        };

        // INSERT DATA
        const newMember = await masterMemberModel.create({
            ...params,
            id: uuidv4.v4(),
            created_time: now,
            created_by_id: currentUser.id,
            is_deleted: 0
        });
        return newMember
    } catch (error) {
        console.error(
            'Error: Unable to execute masterMemberService.getAll => ',
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

const updateMember = async (currentUser, params) => {
    try {
        const now = moment().toDate();
        const memberIdToUpdate = params.id;
        const [rowCount, [updatedMember]] = await masterMemberModel.update(
            {
                ...params,
                updated_by_id: currentUser.id,
                updated_time: now
            }, {
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
        console.error(
            'Error: Unable to execute masterMemberService.update => ',
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

const deleteMember = async (currentUser, params) => {
    try {
        const now = moment().toDate();
        const memberIdToDelete = params.id;
        const paramsDelete = {
            is_deleted: 1
        }
        const [rowCount, [updatedMember]] = await masterMemberModel.update(
            {
                ...paramsDelete,
                updated_by_id: currentUser.id,
                updated_time: now
            }, {
                where: {
                    id: memberIdToDelete,
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
            'Error: Unable to execute masterMemberService.delete => ',
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
    getMember,
    findMember,
    insertMember,
    updateMember,
    deleteMember,
};
