'use strict';
const uuidv4 = require('uuid');
const moment = require('moment');
const bcrypt = require('bcrypt');
const locales = require('../config/locales');
const masterVehicleModel = require('../model/master-vehicle-model');
const {whereBuilder} = require('../connection/db');
const {timeConfig} = require('../config');
const {
    operatorTypes,
    queryOption,
} = require('../connection/query-builder');
const {Op} = require('sequelize');


const getVehicle = async (currentUser, params) => {
    try {
        const vehicleData = await masterVehicleModel.findOne({
            where: {
                id: params.id,
                is_deleted: 0,
            },
        });
        if (vehicleData == null) {
            return {
                status: 404,
                error: {
                    message: locales.resource_not_found,
                },
            };
        } else return vehicleData;
    } catch (error) {
        console.error(
            'Error: Unable to execute masterVehicleService.getAll => ',
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

const findVehicle = async (currentUser, params) => {
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
        if (params.family_id) {
            conditions.push({
                column: 'family_id',
                operator: operatorTypes.equal,
                value: params.equal,
            });
        }
        if (params.license_plate) {
            conditions.push({
                column: 'license_plate',
                operator: operatorTypes.like,
                value: params.license_plate,
            });
        }
        const vehicles = await masterVehicleModel.findAll({
            where: await whereBuilder(conditions),

            order: [[order.order_by, order.order_dir]],
            offset,
            limit: limit,
        });

        const filteredCount = vehicles.length;
        const totalCount = await masterVehicleModel.count({
                where: {
                    is_deleted: 0, // ✅ cuma hitung yang belum dihapus
                },
            }
        );
        console.log(totalCount);
        return {totalCount: totalCount, count: filteredCount, data: vehicles};
    } catch (error) {
        console.error(
            'Error: Unable to execute masterVehicleService.getAll => ',
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

const insertVehicle = async (currentUser, params) => {
    try {
        const now = moment().toDate();
        // CHECK USERNAME / EMAIL
        const vehicleData = await masterVehicleModel.findOne({
            where: {
                [Op.and]: [
                    {license_plate: params.license_plate},
                    {is_deleted: 0},
                ],
            },
        });
        // return vehicleData.dataValues;

        if (vehicleData != null) return {
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
        return await masterVehicleModel.create(data);
    } catch (error) {
        console.error(
            'Error: Unable to execute masterVehicleService.getAll => ',
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

const updateVehicle = async (currentUser, params) => {
    try {
        const now = moment().toDate();
        const vehicleIdToUpdate = params.id;
        const [rowCount, [updatedVehicle]] = await masterVehicleModel.update(
            {
                ...params,
                updated_time: now,
                updated_by_id: currentUser.id
            }, {
                where: {
                    id: vehicleIdToUpdate,
                },
                returning: true,
            });

        if (rowCount > 0) {
            console.log('Data yang telah di-update:', updatedVehicle.toJSON());
            return updatedVehicle;
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
            'Error: Unable to execute masterVehicleService.update => ',
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

const deleteVehicle = async (currentUser, params) => {
    try {
        const now = moment().toDate();
        const vehicleIdToDelete = params.id;
        const paramsDelete = {
            is_deleted: 1,
            updated_by_id: currentUser.id,
            updated_time: now
        }
        const [rowCount, [updatedVehicle]] = await masterVehicleModel.update(
            {
                ...paramsDelete,
            }, {
                where: {
                    id: vehicleIdToDelete,
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
            'Error: Unable to execute masterVehicleService.delete => ',
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
    getVehicle,
    findVehicle,
    insertVehicle,
    updateVehicle,
    deleteVehicle,
};
