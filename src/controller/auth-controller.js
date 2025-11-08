const appResponse = require('./app-response');
const auth = require('../services/auth-services');
const { request } = require('express');

const login = async (req, res) => {
    appResponse.build(res, await auth.login(req.body));
};
const register = async (req, res) => {
    appResponse.build(res, await auth.register(req.body));
};

module.exports = {
    login,
    register,
};
