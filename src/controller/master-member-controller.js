
const appResponse = require('./app-response');
const member = require('../services/master-member-services');
const { request } = require('express');

const getMember = async (req, res) => {
    appResponse.build(res, await member.getMember(req.body));
};
const findMember = async (req, res) => {
    appResponse.build(res, await member.findMember(req.body));
};

const insertMember = async (req, res) => {
    appResponse.build(res, await member.insertMember(req.body));
};

const updateMember = async (req, res) => {
    appResponse.build(res, await member.updateMember(req.body));
};

const deleteMember = async (req, res) => {
    appResponse.build(res, await member.deleteMember(req.body));
};

module.exports = {
    getMember,
    findMember,
    insertMember,
    updateMember,
    deleteMember,
};