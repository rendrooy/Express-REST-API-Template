
const appResponse = require('./app-response');
const member = require('../services/master-member-services');
const { request } = require('express');

const getMember = async (req, res) => {
    appResponse.build(res, await member.getMember(req.currentUser, req.body));
};
const findMember = async (req, res) => {
    appResponse.build(res, await member.findMember(req.currentUser, req.body));
};

const insertMember = async (req, res) => {
    appResponse.build(res, await member.insertMember(req.currentUser, req.body));
};

const updateMember = async (req, res) => {
    appResponse.build(res, await member.updateMember(req.currentUser, req.body));
};

const deleteMember = async (req, res) => {
    appResponse.build(res, await member.deleteMember(req.currentUser, req.body));
};

module.exports = {
    getMember,
    findMember,
    insertMember,
    updateMember,
    deleteMember,
};