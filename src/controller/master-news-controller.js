const appResponse = require('./app-response');
const news = require('../services/master-news-services');
const {request} = require('express');

const getNews = async (req, res) => {
    appResponse.build(res, await news.getNews(req.currentUser, req.body));
};
const findNews = async (req, res) => {
    appResponse.build(res, await news.findNews(req.currentUser, req.body));
};

const insertNews = async (req, res) => {
    appResponse.build(res, await news.insertNews(req.currentUser, req.body));
};

const updateNews = async (req, res) => {
    appResponse.build(res, await news.updateNews(req.currentUser, req.body));
};

const uploadNews = async (req, res) => {
    news.uploadFile(req, (response) => {
        appResponse.build(res, response);
    });
};


const deleteNews = async (req, res) => {
    appResponse.build(res, await news.deleteNews(req.currentUser, req.body));
};

module.exports = {
    getNews,
    findNews,
    insertNews,
    updateNews,
    deleteNews,
    uploadNews
};