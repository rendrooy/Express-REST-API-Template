'use strict';

const appResponse = require('./app-response');
const member = require('../services/member');
const { request } = require('express');

const getMember = async (req, res) => {
  appResponse.build(res, await member.getMember(req.query));
};
const findMember = async (req, res) => {
  appResponse.build(res, await member.findMember(req.query));
};

const insertMember = async (req, res) => {
  appResponse.build(res, await member.insertMember(req.body));
};

const updateMember = async (req, res) => {
  appResponse.build(res, await member.updateMember(req.query, req.body));
};

const deleteMember = async (req, res) => {
  appResponse.build(res, await member.deleteMember(req.params));
};

module.exports = {
  getMember,
  findMember,
  insertMember,
  updateMember,
  deleteMember,
};
