
const appResponse = require('./app-response');
const user = require('../services/master-user-service');
const { request } = require('express');

const getUser = async (req, res) => {
    appResponse.build(res, await user.getUser(req.body));
};
const findUser = async (req, res) => {
    appResponse.build(res, await user.findUser(req.body));
};

const insertUser = async (req, res) => {
    appResponse.build(res, await user.insertUser(req.body));
};

const updateUser = async (req, res) => {
    appResponse.build(res, await user.updateUser(req.body));
};

const deleteUser = async (req, res) => {
    appResponse.build(res, await user.deleteUser(req.body));
};

module.exports = {
    getUser,
    findUser,
    insertUser,
    updateUser,
    deleteUser,
};