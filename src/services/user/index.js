"use strict";
const { json, query } = require("express");

const uuidv4 = require("uuid");
const moment = require("moment");
const locales = require("../../config/locales");
const userModel = require("../../model/userModel");
const { operatorTypes, queryOption } = require("../../connection/query-builder");
const { param } = require("../../routes");
const {timeConfig} = require("../../config")


const getUser = async (currentUser, params) => {
  try {
    const limit = parseInt(queryOption.limit);
    const page = parseInt(queryOption.page);
    const conditions = [];
    var resModel = await userModel.find({
      conditions,
      limit,
      page,
      order: {
        order_by: params.order_by || "created_at",
        order_dir: params.order_dir || "DESC",
      },
    });
    return resModel
  } catch (error) {
    console.error(
      "Error: Unable to execute promotionService.getAll => ",
      error
    );
    return {
      status: 500,
      error: {
        message: locales.unable_to_handle_request,
      },
    };
  }
};

const insertUser = async(params) => {
  try {
    // return params;
    const now = moment().format(timeConfig.moment);
    const limit = parseInt(1);
    const page = parseInt(queryOption.page);
    const conditions = [
      {
        column: "nik",
          operator: operatorTypes.equal,
          value: params.nik,
      }
    ];

  const checkUser = await userModel.findOne({
    conditions,
    limit,
    page,
    order: {
      order_by: params.order_by || "created_at",
      order_dir: params.order_dir || "DESC",
    },
  });
  if(checkUser){
    return checkUser 
    // {
    //   status: 500,
    //   error: {
    //     message: locales.already_attendance,
    //   },
    // };
  }

  let dataRaw = {
    id: uuidv4.v4(),
    name:params.name,
    nik:params.nik,
    address:params.address,
    birth_date:params.birth_date,
    birth_place:params.birth_place,
    sex: params.sex,
    profession : params.profession,
    religion: params.religion,
    phone: params.phone,
    blood_type: params.blood_type,
    family_id:params.family_id,
    family_relation:params.family_relation,
    created_at: now,
    updated_at: now
  }
  const resInsert = await userModel.insert(dataRaw);
  return resInsert
  // return dataRaw;
  // return checkUser;

  } catch (error) {
    console.error(
      "Error: Unable to execute promotionService.getAll => ",
      error
    );
    return {
      status: 500,
      error: {
        message: locales.unable_to_handle_request,
      },
    };
  }
  
}

const updateUser = async(query, params) => {
  try {
    const now = moment().format(timeConfig.moment);
    const limit = parseInt(1);
    const page = parseInt(queryOption.page);
    const conditions = [
      {
        column: "id",
          operator: operatorTypes.equal,
          value: params.id,
      }
    ];

  const checkUser = await userModel.findOne({
    conditions,
    limit,
    page,
    order: {
      order_by: params.order_by || "created_at",
      order_dir: params.order_dir || "DESC",
    },
  });
  if(checkUser != null){
    // let dataRaw = {
    //   id: params.id,
    //   name:params.name,
    //   nik:params.nik,
    //   address:params.address,
    //   birth_date:params.birth_date,
    //   birth_place:params.birth_place,
    //   sex: params.sex,
    //   profession : params.profession,
    //   religion: params.religion,
    //   phone: params.phone,
    //   blood_type: params.blood_type,
    //   // family_id:params.family_id,
    //   // family_relation:params.family_relation,
    //   // created_at: params.created_at.format(timeConfig.moment),
    //   // updated_at: now
    // }
    return await userModel.update(params);
  
  } else {
      return {
        status: 404,
        error: {
          message: locales.resource_not_found,
        },
      };
    }
  } catch (error) {
      return {
        status: 500,
        error: {
          message: locales.unable_to_handle_request,
        },
      };
  }
}

const deleteUser = async (params) => {
  try {
    const limit = parseInt(queryOption.limit);
    const page = parseInt(queryOption.page);
    const conditions = [];
    console.log(params);
    conditions.push({
      column: "id",
      operator: operatorTypes.equal,
      value: params.id,
    });

    const res = await userModel.destroy({
      conditions,
    });
    return res
  } catch (error) {
    return {
      status: 500,
      error: {
        message: locales.unable_to_handle_request,
      },
    };
  }
}

module.exports = {
  getUser,
  insertUser,
  updateUser,
  deleteUser,
};
