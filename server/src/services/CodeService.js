import async from "async";

import {
    createCode as createCodeDAO,
    getCodeById as getCodeByIdDAO,
    updateCodeById as updateCodeByIdDAO,
    removeCodeById as removeCodeByIdDAO,
    getCodeByKey as getCodeByKeyDAO,
    getAllCode as getAllCodeDAO

} from "./../dao/mongo/impl/CodeDAO";

import { getSubInventoriesByCompany as getSubInventoriesByCompanyDAO } from "./../dao/mongo/impl/SubInventoryDAO";

import { getInventories as getInventoriesDAO } from "./../dao/mongo/impl/InventoryDAO";

import { getNextCodeId } from "./CounterService";

import { getCompanyByName as getCompanyByNameDAO } from "./../dao/mongo/impl/CompanyDAO";

export function createCode(data, callback){
   async.waterfall([
     function (waterfallCallback) {
         const { roles, company } = data.userSession;
         const { isStoreManager, isSales, isAdmin } = getUserRoles(roles);
         if (isStoreManager || isSales || isAdmin) {
             waterfallCallback();
         }
         else {
             const err = new Error("Not Enough Permission to create code");
             waterfallCallback(err);
         }
     },
     function(waterfallCallback){
        getCodeByKeyDAO(data.key, function(err, code){
            if (code){
                const err = new Error("Code Already Exists");
                waterfallCallback(err)
            }
            else {
                waterfallCallback();
            }
        });
     },
     function (waterfallCallback){
        getNextCodeId(function (err, counterDoc){
            waterfallCallback(err, data, counterDoc);
        });
     },
     function (data, counterDoc, waterfallCallback){
         const { company } = data.userSession;
         data.id = counterDoc.counter;
         data.company = company;
         createCodeDAO(data, waterfallCallback);
     }
   ],callback);
}

export function updateCode(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const id = data.id;
            getCodeByIdDAO(id, function (err, code) {
                if (err) {
                    waterfallCallback(err);
                }
                else if (code) {
                    if (code.status == "pending") {
                        var updateQuantity = code.quantity + data.quantity
                        const update = {
                            quantity : updateQuantity
                        }
                        updateCodeByIdDAO(id, update, waterfallCallback);
                    }
                    else {
                        const err = new Error("Only Pending Codes can be edited");
                        waterfallCallback(err);
                    }
                }
                else {
                    const err = new Error("Code Not Found");
                    waterfallCallback(err);
                }
            });
        }
    ], callback);
}

export function removeCode(data, callback){
    async.waterfall([
      function (waterfallCallback) {
          const { roles, company } = data.userSession;
          const { isStoreManager, isSales, isAdmin } = getUserRoles(roles);
          if (isStoreManager || isSales || isAdmin) {
              waterfallCallback();
          }
          else {
              const err = new Error("Not Enough Permission to delete code");
              waterfallCallback(err);
          }
      },
      function(waterfallCallback){
          const id = data.id;
          getCodeByIdDAO(id, function(err, code){
              if (err){
                  waterfallCallback(err);
              }
              else if (code) {
                  removeCodeByIdDAO(id, waterfallCallback);
              }
              else {
                  const err = new Error("Code Not Found");
                  waterfallCallback(err);
              }
          });
      }
    ],callback);
}

export function getAllCode(callback){
    async.waterfall([
      function(waterfallCallback){
         getInventoriesDAO(function(err, inventories){
            if (err){
                waterfallCallback(err);
            }
            else{
                var list = [];
                var temp = {};
                inventories.forEach(function(inventory){
                    temp = {
                      sku: inventory.sku,
                      keys: []
                    }
                    list.push(temp);
                });
                waterfallCallback(null, list);
            }
         });
      },
      function(list, waterfallCallback){
          getAllCodeDAO(function(err, codes){
              if (err){
                  waterfallCallback(err);
              }
              else if (codes === null){
                  waterfallCallback(null, list);
              }
              else{
                  list.forEach(function(item){
                      codes.forEach(function(code){
                          if (code.mainSku === item.sku){
                              const temp = {
                                 value: code.key,
                                 id: code.id,
                                 company: code.company
                              }
                              item.keys.push(temp);
                          }
                      });
                  });
                  //console.log(list);
                  waterfallCallback(null, list);
              }
          });
      }
    ],callback);
}

export function getCodeByCompany(company, callback){
    async.waterfall([
      function(waterfallCallback){
         getSubInventoriesByCompanyDAO(company, function(err, inventories){
            if (err){
                waterfallCallback(err);
            }
            else{
                var list = [];
                var temp = {};
                inventories.forEach(function(inventory){
                    temp = {
                      sku: inventory.sku,
                      mainSku: inventory.mainSku,
                      keys: []
                    }
                    list.push(temp);
                });
                waterfallCallback(null, list);
            }
         });
      },
      function(list, waterfallCallback){
          getAllCodeDAO(function(err, codes){
              if (err){
                  waterfallCallback(err);
              }
              else if (codes === null){
                  waterfallCallback(null, list);
              }
              else{
                  list.forEach(function(item){
                      codes.forEach(function(code){
                          if (code.sku === item.sku){
                              const temp = {
                                 value: code.key,
                                 id: code.id
                              }
                              item.keys.push(temp);
                          }
                      });
                  });
                  //console.log(list);
                  waterfallCallback(null, list);
              }
          });
      }
    ],callback);
}

export function getCodes(callback){
    getAllCodeDAO(callback);
}

function getUserRoles(roles) {
    const isStoreManager = roles.indexOf("storeManager") >= 0;
    const isSales = roles.indexOf("sales") >= 0;
    const isAdmin = roles.indexOf("admin") >= 0;
    return { isStoreManager, isSales, isAdmin };
}
