'use strict';

const appResponse = require('./app-response');
const sessions = require('../services/sessions');

const login = async (req, res) => {
  appResponse.build(res, await sessions.login(req.body));
};
const register = async (req, res) => {
  appResponse.build(res, await sessions.register(req.body));
};

module.exports = {
  login,
  register,
};
