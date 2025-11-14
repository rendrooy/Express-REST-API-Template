'use strict';
const uuidv4 = require('uuid');
const moment = require('moment');
const bcrypt = require('bcrypt');
const locales = require('../config/locales');
const masterLookupModel = require('../model/master-lookup-model');
const {whereBuilder} = require('../connection/db');
const {timeConfig} = require('../config');
const {
    operatorTypes,
    queryOption,
} = require('../connection/query-builder');
const {Op} = require('sequelize');


const getLookup = async (currentUser, params) => {
    try {
        const lookupData = await masterLookupModel.findOne({
            where: {
                id: params.id,
                is_deleted: 0,
            },
        });
        if (lookupData == null) {
            return {
                status: 404,
                error: {
                    message: locales.resource_not_found,
                },
            };
        } else return lookupData;
    } catch (error) {
        console.error(
            'Error: Unable to execute masterLookupService.getAll => ',
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

const findLookup = async (currentUser, params) => {
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
        if (params.type) {
            conditions.push({
                column: 'type',
                operator: operatorTypes.equal,
                value: params.type,
            });
        }
        const lookups = await masterLookupModel.findAll({
            where: await whereBuilder(conditions),

            order: [[order.order_by, order.order_dir]],
            offset,
            limit: limit,
        });

        const filteredCount = lookups.length;
        const totalCount = await masterLookupModel.count({
                where: {
                    is_deleted: 0, // ✅ cuma hitung yang belum dihapus
                },
            }
        );
        console.log(totalCount);
        return {totalCount: totalCount, count: filteredCount, data: lookups};
    } catch (error) {
        console.error(
            'Error: Unable to execute masterLookupService.getAll => ',
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

const insertLookup = async (currentUser, params) => {
    try {
        const now = moment().toDate();
        // CHECK USERNAME / EMAIL
        const lookupData = await masterLookupModel.findOne({
            where: {
                [Op.and]: [
                    {value: params.value},
                    {type: params.type},
                    {is_deleted: 0},
                ],
            },
        });
        // return lookupData.dataValues;

        if (lookupData != null) return {
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
        return await masterLookupModel.create(data);
    } catch (error) {
        console.error(
            'Error: Unable to execute masterLookupService.getAll => ',
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

const updateLookup = async (currentUser, params) => {
    try {
        const now = moment().toDate();
        const lookupIdToUpdate = params.id;
        const [rowCount, [updatedLookup]] = await masterLookupModel.update(
            {
                ...params,
                updated_time: now,
                updated_by_id: currentUser.id
            }, {
                where: {
                    id: lookupIdToUpdate,
                },
                returning: true,
            });

        if (rowCount > 0) {
            console.log('Data yang telah di-update:', updatedLookup.toJSON());
            return updatedLookup;
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
            'Error: Unable to execute masterLookupService.update => ',
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

const deleteLookup = async (currentUser, params) => {
    try {
        const now = moment().toDate();
        const lookupIdToDelete = params.id;
        const paramsDelete = {
            is_deleted: 1,
            updated_by_id: currentUser.id,
            updated_time: now
        }
        const [rowCount, [updatedLookup]] = await masterLookupModel.update(
            {
                ...paramsDelete,
            }, {
                where: {
                    id: lookupIdToDelete,
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
            'Error: Unable to execute masterLookupService.delete => ',
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
    getLookup,
    findLookup,
    insertLookup,
    updateLookup,
    deleteLookup,
};
