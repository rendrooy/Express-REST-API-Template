
const appResponse = require('./app-response');
const lookup = require('../services/master-lookup-services');
const { request } = require('express');

const getLookup = async (req, res) => {
    appResponse.build(res, await lookup.getLookup(req.currentUser, req.body));
};
const findLookup = async (req, res) => {
    appResponse.build(res, await lookup.findLookup(req.currentUser, req.body));
};

const insertLookup = async (req, res) => {
    appResponse.build(res, await lookup.insertLookup(req.currentUser, req.body));
};

const updateLookup = async (req, res) => {
    appResponse.build(res, await lookup.updateLookup(req.currentUser, req.body));
};

const deleteLookup = async (req, res) => {
    appResponse.build(res, await lookup.deleteLookup(req.currentUser, req.body));
};

module.exports = {
    getLookup,
    findLookup,
    insertLookup,
    updateLookup,
    deleteLookup,
};