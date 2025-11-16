'use strict';

const {timeConfig} = require('../config');

const dataTypes = {
    string: 'string',
    number: 'number',
    timestamp: 'timestamp',
    date: 'date',
};

const tableNames = {
    members: 'members',
};

const queryOption = {
    limit: 100,
    offset: 0,
    page: 1,
};

const operatorTypes = {
    equal: 'equal',
    not_equal: 'not_equal',
    less_than: 'less_than',
    less_than_equal: 'less_than_equal',
    greater_than: 'greater_than',
    greater_than_equal: 'greater_than_equal',
    like: 'like',
    in: 'in',
    is_not_null: 'is_not_null',
};

const buildInsertQuery = (columnDefinition, data) => {
    const inputColumns = [];
    const bindColumns = [];
    const bindValues = [];
    Object.keys(data).forEach((key) => {
        inputColumns.push(`"${key}"`);
        console.log(key);
        bindValues.push(data[key]);

        if (columnDefinition[key] === dataTypes.timestamp) {
            bindColumns.push(`to_timestamp(${key}, '${timeConfig.oracle}')`);
        } else if (columnDefinition[key] === dataTypes.date) {
            bindColumns.push(`${key}=to_date(${key}, '${timeConfig.oracleDate}')`);
        } else {
            bindColumns.push(`${key}`);
        }
    });

    return {
        inputColumns: inputColumns.join(', '),
        bindValues,
        bindColumns: bindColumns.join(', '),
    };
};

const buildUpdateQuery = (columnDefinition, data, condition) => {
    const bindColumns = [];
    const bindValues = [];
    // console.log(data);
    Object.keys(data).forEach((key) => {
        bindValues.push(data[key]);

        // if (columnDefinition[key] === dataTypes.timestamp) {
        //   bindColumns.push(`${key}=to_timestamp(${key}, '${timeConfig.oracle}')`);
        // } else if (columnDefinition[key] === dataTypes.date) {
        //   bindColumns.push(`${key}=to_date(${key}, '${timeConfig.oracleDate}')`);
        // } else {
        bindColumns.push(`${key}=${key}`);
        // }
    });

    const conditionColumns = [];
    Object.keys(condition).forEach((key) => {
        conditionColumns.push(`${key}=${key}`);
        bindValues.push(condition[key]);
    });

    return {
        bindValues,
        bindColumns: bindColumns.join(', '),
        conditionColumns: conditionColumns.join(' AND '),
    };
};

/**
 * Conditinal Query
 */

const buildConditionOperator = (
    columnName,
    bindColumn,
    value,
    operator = operatorTypes.equal,
    index
) => {
    let conditionalOperator = '';

    switch (operator) {
        case operatorTypes.like:
            conditionalOperator = `LOWER(${columnName}) LIKE '%${(
                value || ''
            ).toLowerCase()}%'`;
            break;
        case operatorTypes.not_equal:
            conditionalOperator = `${columnName}!=$${index}`;
            break;
        case operatorTypes.less_than:
            conditionalOperator = `${columnName}<$${index}`;
            break;
        case operatorTypes.less_than_equal:
            conditionalOperator = `${columnName}<=$${index}`;
            break;
        case operatorTypes.greater_than:
            conditionalOperator = `${columnName}>$${index}`;
            break;
        case operatorTypes.greater_than_equal:
            conditionalOperator = `${columnName}>=$${index}`;
            break;
        case operatorTypes.in:
            conditionalOperator = `${columnName} IN (${value})`;
            break;
        case operatorTypes.is_not_null:
            conditionalOperator = `${columnName} IS NOT NULL`;
            break;
        default:
            conditionalOperator = `${columnName}=$${index}`;
    }

    return conditionalOperator;
};

const buildConditionQuery = (conditions = []) => {
    // const conditions = [
    //   { column: '', value: '', tableAlias: '', operator: '' },
    // ];

    const bindValues = [];
    const bindConditions = [];
    let conditionQuery = '';

    for (let i = 0; i < conditions.length; i++) {
        const element = conditions[i];
        let columnName = '';
        if (element.tableAlias) {
            columnName = `${element.tableAlias}.${element.column}`;
        } else {
            columnName = element.column;
        }
        // bindConditions.push(`${columnName}=${element.column}`);
        bindConditions.push(
            buildConditionOperator(
                columnName,
                element.column,
                element.value,
                element.operator,
                i + 1
            )
        );

        const unbindOperators = [
            operatorTypes.like,
            operatorTypes.is_not_null,
            operatorTypes.in,
        ];
        if (!unbindOperators.includes(element.operator)) {
            bindValues.push(element.value);
        }
    }

    // conditions.forEach(condition => {
    //   let columnName = '';
    //   if (condition.tableAlias) {
    //     columnName = `${condition.tableAlias}.${condition.column}`;
    //   } else {
    //     columnName = condition.column;
    //   }
    //   // bindConditions.push(`${columnName}=${condition.column}`);
    //   bindConditions.push(buildConditionOperator(columnName, condition.column, condition.value, condition.operator));

    //   const unbindOperators = [operatorTypes.like, operatorTypes.is_not_null, operatorTypes.in];
    //   if (!unbindOperators.includes(condition.operator)) {
    //     bindValues.push(condition.value);
    //   }
    // });

    if (bindConditions.length > 0) {
        conditionQuery = `WHERE ${bindConditions.join(' AND ')}`;
    }

    return {
        bindValues,
        bindQuery: conditionQuery,
    };
};
/** End Conditinal Query */

const buildOrderQuery = (order = {}) => {
    // const order = {
    //   order_by: '',
    //   order_dir: '',
    // }

    const orderBy = order.order_by;
    const orderDir = order.order_dir || 'ASC';
    let orderQuery = '';
    if (orderBy) {
        orderQuery = `ORDER BY ${orderBy} ${orderDir}`;
    }

    return orderQuery;
};

module.exports = {
    dataTypes,
    operatorTypes,
    tableNames,
    queryOption,
    buildInsertQuery,
    buildUpdateQuery,
    buildConditionQuery,
    buildOrderQuery,
};
