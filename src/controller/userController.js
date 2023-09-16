'use strict';

const appResponse = require('./app-response');
const user = require('../services/user');
const { request } = require('express');

const getUser = async (req, res) => {
  appResponse.build(res, await user.getUser(req.query));
};
const findUser = async (req, res) => {
  appResponse.build(res, await user.findUser(req.query));
};

const insertUser = async (req, res) => {
  appResponse.build(res, await user.insertUser(req.body));
};

const updateUser = async (req, res) => {
  appResponse.build(res, await user.updateUser(req.query, req.body));
};

const deleteUser = async (req, res) => {
  appResponse.build(res, await user.deleteUser(req.params));
};

module.exports = {
  getUser,
  findUser,
  insertUser,
  updateUser,
  deleteUser,
};
