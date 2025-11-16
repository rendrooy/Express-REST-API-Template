const appResponse = require('./app-response');
const family = require('../services/master-family-services');
const {request} = require('express');

const getFamily = async (req, res) => {
    appResponse.build(res, await family.getFamily(req.currentUser, req.body));
};
const findFamily = async (req, res) => {
    appResponse.build(res, await family.findFamily(req.currentUser, req.body));
};

const insertFamily = async (req, res) => {
    appResponse.build(res, await family.insertFamily(req.currentUser, req.body));
};

const updateFamily = async (req, res) => {
    appResponse.build(res, await family.updateFamily(req.currentUser, req.body));
};

const deleteFamily = async (req, res) => {
    appResponse.build(res, await family.deleteFamily(req.currentUser, req.body));
};

module.exports = {
    getFamily,
    findFamily,
    insertFamily,
    updateFamily,
    deleteFamily,
};