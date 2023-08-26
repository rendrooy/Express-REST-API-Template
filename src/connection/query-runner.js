
const db = require("../connection/db");
const { resultMapper } = require("./mapper");
const {
    buildInsertQuery,
    buildUpdateQuery,
    buildConditionQuery,
    tableNames,
    queryOption,
    buildOrderQuery,
  } = require("./query-builder");
  

const findQuery = async (tableName, columnDefinition, params) => {
    let connection = null;
    try {
      const limit = parseInt(params.limit || queryOption.limit);
      let bindValues = [];
      const conditionQuery = buildConditionQuery(params.conditions);
      const orderQuery = buildOrderQuery(params.order);
      const selectedColumns = params.selectedColumns || "*";
      const query = `
        SELECT ${selectedColumns} FROM ${tableName}
        ${conditionQuery.bindQuery}
        ${orderQuery}
        LIMIT ${limit}
      `;
        bindValues = bindValues.concat(conditionQuery.bindValues);
        console.info("findQuery: SQL query => ", query);
        console.info("findQuery: SQL bindValues => ", bindValues);
        const result = await db.query(query)
        console.info(
        "findQuery: Result (rows counter) => ",
        (result.rows || []).length
      );
  
      return resultMapper(result) || [];
    } catch (err) {
      console.error("Error: execute appOracleModel.findQuery => ", err);
      return [];
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(
            "Error: execute appOracleModel.findQuery.closeConnection => ",
            err
          );
        }
      }
    }
  };
  
  const findOneQuery = async (tableName, columnDefinition, params) => {
    let connection = null;
    try {
      const limit = parseInt(params.limit || queryOption.limit);
      let bindValues = [];
      const conditionQuery = buildConditionQuery(params.conditions);
      const orderQuery = buildOrderQuery(params.order);
      const selectedColumns = params.selectedColumns || "*";
      const query = `
        SELECT ${selectedColumns} FROM ${tableName}
        ${conditionQuery.bindQuery}
        ${orderQuery}
        LIMIT ${limit}
      `;
        bindValues = bindValues.concat(conditionQuery.bindValues);
        console.info("findQuery: SQL query => ", query);
        console.info("findQuery: SQL bindValues => ", bindValues);
        const result = await db.query(query, bindValues)
        console.info(
        "findQuery: Result (rows counter) => ",
        (result.rows || []).length
      );
  
      return resultMapper(result)[0] || [];
    } catch (err) {
      console.error("Error: execute appOracleModel.findQuery => ", err);
      return [];
    } finally {
      // if (connection) {
      //   try {
      //     await connection.close();
      //   } catch (err) {
      //     console.error(
      //       "Error: execute appOracleModel.findQuery.closeConnection => ",
      //       err
      //     );
      //   }
      // }
    }
  };

  const insertQuery = async (tableName, columnDefinition, params) => {
    let connection = null;
    try {
      const columns = Object.keys(params).join(', ');
      const placeholders = Object.keys(params).map((_, index) => `$${index + 1}`).join(', ');
      const values = Object.values(params); 
      const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
      console.info("insertQuery: SQL query => ", query);
      console.info("insertQuery: SQL bindValues => ", values);
      const result = await db.query(query, values)
      console.info("insertQuery: Result => ", result);
      return {
        id: result.lastRowid,
        data: params,
      };
    } catch (error) {
      console.error("Error: appOracleModel.dmlQuery.insertQuery => ", error);
      return {};
    } finally {
      if (connection) {
        try {
          // await connection.close();
        } catch (error) {
          console.error("Error: orcacle close connection => ", error);
        }
      }
    }
  };

  const updateQuery = async (tableName, columnDefinition, params, conditionData) => {
      try {
        const conditions = [{id: params.id}];
        // connection = await oracleConnection();
        // const queryBuilder = buildUpdateQuery(
        //   columnDefinition,
        //   params, {
        //     id: params.id
        //   }
        // );

        // const query = `UPDATE ${tableName} SET ${queryBuilder.bindColumns} WHERE ${queryBuilder.conditionColumns}`;
        const setClauses = Object.keys(params).map((key, index) => `${key} = $${index + 1}`).join(', ');
        const whereClauses = conditions.map((condition, index) => `${Object.keys(condition)} = $${index + 1}`);
      
        const values = [...Object.values(params)]
        // [...Object.values(params), ...conditions.map(condition => condition.value)];
        
        const query = `UPDATE ${tableName} SET ${setClauses} WHERE ${whereClauses}`;
      

        console.info("updateQuery: SQL query => ", query);
        console.info("updateQuery: SQL  => ", query);
        console.info("updateQuery: SQL bindValues => ", values);
          const result = await db.query(query, values)
        // const result = await connection.execute(query, queryBuilder.bindValues, {
        //   autoCommit: true,
        // });
    
        console.info("updateQuery: Result => ", result.rowCount);
    // if(result.rowCount >0){

      return params
    // }
        //  {
          // rowsAffected: result.rowCount,
          // data: params,
        // };
      } catch (error) {
        console.error("Error: appOracle.dmlQuery.updateQuery => ", error);
        return {};
      } finally {
        // if (connection) {
        //   try {
        //     await connection.close();
        //   } catch (error) {
        //     console.error("Error: orcacle close connection => ", error);
        //   }
        // }
      }
    
  }

  const deleteQuery = async (tableName, params) => {
    let connection = null;
    try {
      // connection = await oracleConnection();
      const queryBuilder = buildConditionQuery(params.conditions);
  
      const query = `DELETE FROM ${tableName} ${queryBuilder.bindQuery}`;
  
      console.info("deleteQuery: SQL query => ", query);
      console.info("deleteQuery: SQL bindValues => ", queryBuilder.bindValues);
      const result  = await db.query(query, queryBuilder.bindValues)
      // const result = await connection.execute(query, queryBuilder.bindValues, {
      //   autoCommit: true,
      // });
  
      console.info("deleteQuery: Result => ", result);
  
      return {
        status: 200,
        data: {
          message: "Delete Success",
        },
      };
    } catch (error) {
      console.error("Error: invoiceModel.update => ", error);
      return {};
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.error("Error: orcacle close connection => ", error);
        }
      }
    }
  };
  
module.exports = {
  insertQuery,
  findQuery,
  findOneQuery,
  updateQuery,
  deleteQuery,
  };
  