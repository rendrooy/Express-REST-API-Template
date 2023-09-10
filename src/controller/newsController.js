'use strict';

const appResponse = require('./app-response');
const news = require('../services/news');

const { request } = require('express');
const multer = require('multer');
const storage = require('../connection/multer-config');

const getNews = async (req, res) => {
  appResponse.build(res, await news.getNews(req.query));
};
const findNews = async (req, res) => {
  appResponse.build(res, await news.findNews(req.query));
};

const insertNews = async (req, res) => {
  appResponse.build(res, await news.insertNews(req.body));
};

const uploadFile = async (req, res) => {
  appResponse.build(res, await news.uploadFile(req));
};

const updateNews = async (req, res) => {
  appResponse.build(res, await news.updateNews(req.query, req.body));
};

const deleteNews = async (req, res) => {
  appResponse.build(res, await news.deleteNews(req.params));
};

module.exports = {
  getNews,
  findNews,
  insertNews,
  uploadFile,
  updateNews,
  deleteNews,
};
