const db = require('../connection/db'); // Sesuaikan path jika diperlukan
const {
    findQuery,
    insertQuery,
    findOneQuery,
    updateQuery,
    deleteQuery,
} = require('../connection/query-runner')

const {
    dataTypes,
    tableNames
} = require('../connection/query-builder');
const { param } = require('../routes');

const columnDefinition = {
    id: dataTypes.string,
    name: dataTypes.string,
    nik: dataTypes.string,
    address: dataTypes.string,
    birth_date: dataTypes.timestamp,
    birth_place: dataTypes.string,
    sex: dataTypes.string,
    profession: dataTypes.string,
    religion: dataTypes.string,
    phone: dataTypes.string,
    blood_type: dataTypes.string,
    family_id: dataTypes.string,
    family_relation: dataTypes.string,
    created_at: dataTypes.timestamp,
    udpated_at: dataTypes.timestamp,
};

const tableName = tableNames.members;

const getAll =async  (params)=>{
    const result = await db.query('SELECT * FROM members')
    const data = result.rows;
    return data;
}

const find = async (params) => {
    return await findQuery(tableName, columnDefinition, params);
}
const findOne = async (params) => {
    return await findOneQuery(tableName, columnDefinition, params);
}

const insert = async (params) => {
    return await insertQuery(tableName, columnDefinition, params);
}

const update = async (params) => {
    return await updateQuery(tableName, columnDefinition, params)
}

const destroy = async (params) => {
    return await deleteQuery(tableName, params);
  };

 module.exports = {
    getAll,
    find,
    insert,
    findOne,
    update,
    destroy
 }