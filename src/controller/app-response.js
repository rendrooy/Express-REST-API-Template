'use strict';
const locales = require('../config/locales');

const build = (res, result = {error: {message: locales.unable_to_handle_request}}) => {
    if (result.error) res.status(result.status || 500);
    res.send(result);
};

module.exports = {
    build,
};
