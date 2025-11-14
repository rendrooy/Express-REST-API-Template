'use strict';
const uuidv4 = require('uuid');
const moment = require('moment');
const bcrypt = require('bcrypt');
const locales = require('../config/locales');
const masterFamilyModel = require('../model/master-family-model');
const masterMemberModel = require('../model/master-member-model');
const { whereBuilder } = require('../connection/db');
const { timeConfig } = require('../config');
const {
    operatorTypes,
    queryOption,
} = require('../connection/query-builder');
const { Op } = require('sequelize');
const MasterMember = require('../model/master-member-model');


const getFamily = async (currentUser,params) => {
    try {
        const familyData = await masterFamilyModel.findOne({
            where: {
                id: params.id,
                is_deleted: 0,
            },
        });
        const conditions = [];
        conditions.push({
            column: 'is_deleted',
            operator: operatorTypes.equal,
            value: 0,
        });
        conditions.push({
            column: 'family_id',
            operator: operatorTypes.equal,
            value: params.family_id,
        });

        const memberData = await MasterMember.findAll()

        if (familyData == null) {
            return {
                status: 404,
                error: {
                    message: locales.resource_not_found,
                },
            };
        } else return {
            ...familyData.dataValues,
            list_family: memberData
        };
    } catch (error) {
        console.error(
            'Error: Unable to execute masterFamilyService.getAll => ',
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

const findFamily = async (currentUser,params) => {
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
        if (params.no_kk) {
            conditions.push({
                column: 'no_kk',
                operator: operatorTypes.like,
                value: params.no_kk,
            });
        }
        if (params.no_pbb) {
            conditions.push({
                column: 'no_kk',
                operator: operatorTypes.like,
                value: params.no_kk,
            });
        }
        if (params.status_adm) {
            conditions.push({
                column: 'status_adm',
                operator: operatorTypes.equal,
                value: params.status_adm,
            });
        }
        if (params.status_dom) {
            conditions.push({
                column: 'status_dom',
                operator: operatorTypes.equal,
                value: params.status_dom,
            });
        }
        const familyData = await masterFamilyModel.findAll({
            where: await whereBuilder(conditions),
            order: [[order.order_by, order.order_dir]],
            offset,
            limit: limit,
        });


        const filteredCount = familyData.length;
        const totalCount = await masterFamilyModel.count(
            {
                where: {
                    is_deleted: 0, // ✅ cuma hitung yang belum dihapus
                },
            }
        );
        console.log(totalCount);
        return { totalCount: totalCount, count: filteredCount, data: familyData };
    } catch (error) {
        console.error(
            'Error: Unable to execute masterFamilyService.getAll => ',
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

const insertFamily = async (currentUser,params) => {
    try {
        const now = moment().toDate();
        // CHECK USERNAME / EMAIL
        const familyData = await masterFamilyModel.findOne({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            { no_kk: params.no_kk },
                            { no_pbb: params.no_pbb },
                        ],
                    },
                    { is_deleted: 0 },
                ],
            },
        });

        if (familyData != null) return {
            status: 401,
            error: {
                message: locales.resource_already_exists,
            },
        };

        // INSERT DATA
        const newFamily = await masterFamilyModel.create({
            ...params,
            id: uuidv4.v4(),
            created_time: now,
            updated_time: now,
            is_deleted: 0
        });
        return newFamily
    } catch (error) {
        console.error(
            'Error: Unable to execute masterFamilyService.getAll => ',
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

const updateFamily = async (currentUser,params) => {
    try {
        const now = moment().toDate();
        const familyIdToUpdate = params.id;
        const [rowCount, [updatedFamily]] = await masterFamilyModel.update(
            {
                ...params,
                updated_time: now
            }, {
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
        console.error(
            'Error: Unable to execute masterFamilyService.update => ',
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

const deleteFamily = async (currentUser,params) => {
    try {
        const now = moment().toDate();
        const familyIdToDelete = params.id;
        const paramsDelete = {
            is_deleted: 1
        }
        const [rowCount, [updatedFamily]] = await masterFamilyModel.update(
            {
                ...paramsDelete,
                updated_time: now
            }, {
            where: {
                id: familyIdToDelete,
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
            'Error: Unable to execute masterFamilyService.delete => ',
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
    getFamily,
    findFamily,
    insertFamily,
    updateFamily,
    deleteFamily,
};
