'use strict';

const resultMapper = (result) => {
    try {
        if (result.rows) {
            const rows = [];
            result.rows.forEach((values) => {
                rows.push(values);
            });
            return rows;
        }
        return [];
    } catch (error) {
        console.log('Error: resultMapper => ', error);
        return [];
    }
};

module.exports = {
    resultMapper,
};
