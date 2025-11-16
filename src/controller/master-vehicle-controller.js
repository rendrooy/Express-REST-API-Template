const appResponse = require('./app-response');
const vehicle = require('../services/master-vehicle-services');
const {request} = require('express');

const getVehicle = async (req, res) => {
    appResponse.build(res, await vehicle.getVehicle(req.currentUser, req.body));
};
const findVehicle = async (req, res) => {
    appResponse.build(res, await vehicle.findVehicle(req.currentUser, req.body));
};

const insertVehicle = async (req, res) => {
    appResponse.build(res, await vehicle.insertVehicle(req.currentUser, req.body));
};

const updateVehicle = async (req, res) => {
    appResponse.build(res, await vehicle.updateVehicle(req.currentUser, req.body));
};

const deleteVehicle = async (req, res) => {
    appResponse.build(res, await vehicle.deleteVehicle(req.currentUser, req.body));
};

module.exports = {
    getVehicle,
    findVehicle,
    insertVehicle,
    updateVehicle,
    deleteVehicle,
};