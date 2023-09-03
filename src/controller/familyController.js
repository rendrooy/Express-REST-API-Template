'use strict';

const appResponse = require('./app-response');
const family = require('../services/family');
const { request } = require('express');

const getFamily = async (req, res) => {
  appResponse.build(res, await family.getFamily(req.query));
};
const findFamily = async (req, res) => {
  appResponse.build(res, await family.findFamily(req.query));
};

const insertFamily = async (req, res) => {
  appResponse.build(res, await family.insertFamily(req.body));
};

const updateFamily = async (req, res) => {
  appResponse.build(res, await family.updateFamily(req.query, req.body));
};

const deleteFamily = async (req, res) => {
  appResponse.build(res, await family.deleteFamily(req.params));
};

module.exports = {
  getFamily,
  findFamily,
  insertFamily,
  updateFamily,
  deleteFamily,
};
