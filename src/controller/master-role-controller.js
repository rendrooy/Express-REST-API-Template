const appResponse = require('./app-response');
const role = require('../services/master-role-services');
const {request} = require('express');

const getRole = async (req, res) => {
    appResponse.build(res, await role.getRole(req.currentUser, req.body));
};
const findRole = async (req, res) => {
    appResponse.build(res, await role.findRole(req.currentUser, req.body));
};

const insertRole = async (req, res) => {
    appResponse.build(res, await role.insertRole(req.currentUser, req.body));
};

const updateRole = async (req, res) => {
    appResponse.build(res, await role.updateRole(req.currentUser, req.body));
};

const deleteRole = async (req, res) => {
    appResponse.build(res, await role.deleteRole(req.currentUser, req.body));
};

module.exports = {
    getRole,
    findRole,
    insertRole,
    updateRole,
    deleteRole,
};