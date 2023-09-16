'use strict';
const bcrypt = require('bcrypt');
const locales = require('../../config/locales');
const jwt = require('jsonwebtoken');
const User = require('../../model/userModel');
const UserService = require('../user');

const loginTokenGenerator = (currentUser) => {
  // generate response
  const secretKey = 'rahasia'; // Gantilah ini dengan kunci rahasia yang kuat

  const userResponse = {
    ...currentUser.dataValues,
  };

  // generate token
  let token = jwt.sign(userResponse, secretKey, { expiresIn: '90 days' });

  // save to redis
  //   authToken.login();

  return {
    key: token,
    data: userResponse,
  };
};

const login = async (params) => {
  try {
    const resUser = await User.findOne({
      where: { email: params.email },
    });
    if (!resUser) {
      return {
        status: 404,
        error: {
          message: locales.account_not_registered,
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
    return await UserService.insertUser(params);
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
