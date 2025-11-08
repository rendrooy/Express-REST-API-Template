'use strict';
const bcrypt = require('bcrypt');
const locales = require('../config/locales');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const masterUserModel = require('../model/master-user-model');
const masterUserService = require('./master-user-service');

const loginTokenGenerator = async (currentUser) => {
    const now = moment().toDate();
    const secretKey = 'rahasia'; // Gantilah ini dengan kunci rahasia yang kuat
    const userResponse = {
        ...currentUser.dataValues,
    };

    // generate token
    let token = jwt.sign(userResponse, secretKey, { expiresIn: '90 days' });
    const [rowCount, [updatedUser]] = await masterUserModel.update({
        token: token,
        updated_time: now
    }, {
        where: {
            id: userResponse.id,
        },
        returning: true,
    });
    // save to redis
    //   authToken.login();

    return {
        data: userResponse,
        key: token,
    };
};

const login = async (params) => {
    try {
        const resUser = await masterUserModel.findOne({
            where: {
                email: params.email,
                is_deleted: 0
            },
        });

        if (!resUser) {
            return {
                status: 401,
                error: {
                    message: locales.invalid_login,
                },
            };
        }
        // check account and password
        const match = await bcrypt.compare(params.password, resUser.password);
        if (!match) {
            return {
                status: 401,
                error: {
                    message: locales.invalid_login,
                },
            };
        }

        return loginTokenGenerator(resUser);
    } catch (error) {
        console.log(error)
        return {
            status: 500,
            error: {
                message: locales.unable_to_handle_request,
            },
        };
    }
};

const register = async (params) => {
    try {
        return await masterUserService.insertUser(params);
    } catch (error) {
        return {
            status: 500,
            message: locales.unable_to_handle_request,
        };
    }
};

module.exports = {
    login,
    register,
};
