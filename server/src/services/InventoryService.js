import async from "async";

import {
    createInventory as createInventoryDAO,
    getInventoryById as getInventoryByIdDAO,
    updateInventoryById as updateInventoryByIdDAO,
    removeInventoryById as removeInventoryByIdDAO,
    getInventories as getInventoriesDAO,
    getPendingInventories as getPendingInventoriesDAO,
    getInventoryBySku as getInventoryBySkuDAO,
    createSubInventory as createSubInventoryDAO,
    updateInventoryBySku as updateInventoryBySkuDAO
} from "./../dao/mongo/impl/InventoryDAO";

import { createImport as createImportDAO,
        getPendingImports as getPendingImportsDAO,
        getImportById as getImportByIdDAO,
        removeImportById as removeImportByIdDAO
    } from "./../dao/mongo/impl/ImportDAO";

import { createInventoryInTrash as createInventoryInTrashDAO } from "./../dao/mongo/impl/TrashDAO";

import { getNextInventoryId, getNextSubInventoryId, getNextTrashId, getNextImportId } from "./CounterService";
import { getCompanyByName as getCompanyByNameDAO } from "./../dao/mongo/impl/CompanyDAO";
import { getCodeByKey as getCodeByKeyDAO } from "./../dao/mongo/impl/CodeDAO";

export function createInventory(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const { roles, company } = data.userSession;
            const { isStoreManager, isWorker } = getUserRoles(roles);
            if (isStoreManager) {
                data.status = "approved";
            }
            if (isWorker) {
                data.status = "pending";
            }
            if (data.status) {
                waterfallCallback();
            }
            else {
                const err = new Error("Not Enough Permission to create Inventory");
                waterfallCallback(err);
            }
        },
        function (waterfallCallback) {
            getInventoryBySkuDAO(data.sku, waterfallCallback);
        },
        function (inventory, waterfallCallback) {
            if (inventory) {
                const err = new Error("SKU Already Exists");
                waterfallCallback(err);
            }
            else {
                waterfallCallback();
            }
        },
        function (waterfallCallback) {
            getNextInventoryId(function (err, counterDoc) {
                waterfallCallback(err, data, counterDoc);
            });
        },
        function (data, counterDoc, waterfallCallback) {
            data.id = counterDoc.counter;
            //console.log(data.userSession);
            data.history = [{
                action: "created",
                userId: data.userSession.userId,
                timestamp: new Date()
            }]
            createInventoryDAO(data, waterfallCallback);
        }
    ], callback);
}

export function updateInventory(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const { roles, company } = data.userSession;
            const { isStoreManager, isWorker } = getUserRoles(roles);
            if (company !== 'ISRA') {
                const err = new Error("Only ISRA can edit Inventory");
                waterfallCallback(err)
            }
            else if (isWorker || isStoreManager) {
                waterfallCallback();
            }
            else {
                const err = new Error("Not Enough Permission to update Inventory");
                waterfallCallback(err);
            }
        },
        function (waterfallCallback) {
            const id = data.id;
            getInventoryByIdDAO(id, function (err, inventory) {
                if (err) {
                    waterfallCallback(err);
                }
                else if (inventory) {
                    if (inventory.status == "approved") {
                        waterfallCallback(null, inventory);
                    }
                    else {
                        const err = new Error("An Operation is Pending on the Inventory");
                        waterfallCallback(err);
                    }
                }
                else {
                    const err = new Error("Inventory Not Found");
                    waterfallCallback(err);
                }
            });
        },
        function (inventory, waterfallCallback) {
            const { roles } = data.userSession;
            const { isStoreManager, isWorker } = getUserRoles(roles);
            if (isStoreManager) {
                const update = {
                    status: "approved",
                    sku: data.sku,
                    productName: data.productName,
                    price: data.price,
                    stock: data.stock,
                    $push: {
                        history: {
                            action: "updated",
                            userId: data.userSession.userId,
                            timestamp: new Date(),
                            payload: {
                                sku: data.sku,
                                productName: data.productName,
                                price: data.price,
                                stock: data.stock,
                            }
                        }
                    }
                }
                const id = data.id;
                updateInventoryByIdDAO(id, update, waterfallCallback);
            }
            else if (isWorker) {
                const update = {
                    status: "pending",
                    $push: {
                        history: {
                            action: "updated",
                            userId: data.userSession.userId,
                            timestamp: new Date(),
                            payload: {
                                sku: data.sku,
                                productName: data.productName,
                                price: data.price,
                                stock: data.stock,
                            }
                        }
                    }
                }
                const id = data.id;
                updateInventoryByIdDAO(id, update, waterfallCallback);
            }
        }
    ], callback);
}

export function approveInventory(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const { roles } = data.userSession;
            const { isStoreManager, isWorker } = getUserRoles(roles);
            if (isStoreManager) {
                waterfallCallback();
            }
            else {
                const err = new Error("Not Enough Permission to approve Inventory");
                waterfallCallback(err);
            }
        },
        function (waterfallCallback) {
            const id = data.id;
            getImportByIdDAO(id, function (err, importData) {
                if (err) {
                    waterfallCallback(err);
                }
                else {
                    if (importData.status == "pending") {
                        waterfallCallback(null, importData);
                    }
                    else {
                        const err = new Error("Only Pending Inventories can be approved");
                        waterfallCallback(err);
                    }
                }
            })
        },
        function(importData, waterfallCallback){
            getInventoryBySkuDAO(importData.sku, function(err, inventory){
                if (err){
                    waterfallCallback(err);
                }
                else {
                    const newStock = importData.quantity + inventory.stock;
                    const update = {
                        status: "approved",
                        stock: newStock,
                        $push: {
                            history: {
                                action: "updated",
                                userId: data.userSession.userId,
                                timestamp: new Date(),
                                payload: {
                                    sku: inventory.sku,
                                    productName: inventory.productName,
                                    price: inventory.price,
                                    stock: newStock,
                                }
                            }
                        }
                    }
                    updateInventoryByIdDAO(inventory.id, update, waterfallCallback);
                }
            });
        },
        function(inventory, waterfallCallback){
            const id = data.id;
            removeImportByIdDAO(id, waterfallCallback);
        }
        /*function (inventory, waterfallCallback) {
            const latestHistory = getLatestHistory(inventory);
            if (latestHistory.action === "created") {
                const update = {
                    status: "approved",
                    $push: {
                        history: {
                            action: "approvedIn",
                            userId: data.userSession.userId,
                            timestamp: new Date()
                        }
                    }
                }
                const id = data.id;
                updateInventoryByIdDAO(id, update, waterfallCallback);
            }
            else if (latestHistory.action === "removed") {
                const update = {
                    status: "approved",
                    isRemoved: true,
                    $push: {
                        history: {
                            action: "approvedIn",
                            userId: data.userSession.userId,
                            timestamp: new Date()
                        }
                    }
                }
                const id = data.id;
                updateInventoryByIdDAO(id, update, waterfallCallback);
            }
            else if (latestHistory.action === "updated") {
                const payload = latestHistory.payload;
                const update = {
                    status: "approved",
                    sku: payload.sku,
                    productName: payload.productName,
                    price: payload.price,
                    stock: payload.stock,
                    $push: {
                        history: {
                            action: "approvedIn",
                            userId: data.userSession.userId,
                            timestamp: new Date()
                        }
                    }
                }
                const id = data.id;
                updateInventoryByIdDAO(id, update, waterfallCallback);
            }
            else {
                const err = new Error("Weird Flow in Inventory Approval");
                waterfallCallback(err);
            }
        }*/
    ], callback);
}

export function removeInventory(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const { roles, company } = data.userSession;
            const { isStoreManager, isWorker } = getUserRoles(roles);
            if (company !== 'ISRA') {
                const err = new Error("Only ISRA can remove Inventory");
                waterfallCallback(err)
            }
            else if (isStoreManager) {
                waterfallCallback();
            }
            else {
                const err = new Error("Not Enough Permission to remove Inventory");
                waterfallCallback(err);
            }
        },
        function (waterfallCallback) {
            const id = data.id;
            getInventoryByIdDAO(id, function (err, inventory) {
                if (err) {
                    waterfallCallback(err);
                }
                else if (inventory) {
                    if (inventory.status == "approved") {
                        waterfallCallback(null, inventory);
                    }
                    else {
                        const err = new Error("An Operation is Pending on the Inventory");
                        waterfallCallback(err);
                    }
                }
                else {
                    const err = new Error("Inventory Not Found");
                    waterfallCallback(err);
                }
            });
        },
        function (inventory, waterfallCallback) {
            const { roles } = data.userSession;
            const { isStoreManager, isWorker } = getUserRoles(roles);
            if (isStoreManager) {
                const update = {
                    status: "approved",
                    isRemoved: true,
                    $push: {
                        history: {
                            action: "removed",
                            userId: data.userSession.userId,
                            timestamp: new Date()
                        }
                    }
                }
                const id = data.id;
                removeInventoryByIdDAO(id, waterfallCallback);
                //createInventoryInTrashDAO(inventory, waterfallCallback);
            }
            /*else if (isWorker) {
                const update = {
                    status: "pending",
                    isRemoved: false,
                    $push: {
                        history: {
                            action: "removed",
                            userId: data.userSession.userId,
                            timestamp: new Date()
                        }
                    }
                }
                const id = data.id;
                updateInventoryByIdDAO(id, update, waterfallCallback);
            }*/
        },
        function(inventory, waterfallCallback){
            getNextTrashId(function (err, counterDoc) {
                waterfallCallback(err, inventory, counterDoc);
            });
        },
        function(inventory, counterDoc, waterfallCallback){
            const trash = {
                id: counterDoc.counter,
                sku: inventory.sku,
                price: inventory.price,
                stock: inventory.stock,
                status: "removed",
                productName: inventory.productName
            }
            createInventoryInTrashDAO(trash, waterfallCallback);
        }

    ], callback);
}

export function increaseByPhone(data, callback){
    async.waterfall([
      function(waterfallCallback){
          const { roles, company, username } = data.userSession;
          const { isStoreManager, isWorker } = getUserRoles(roles);
          const key = data.code;
          if (company === 'ISRA'){
              if(isStoreManager)
              {
                  getCodeByKeyDAO(key, function(err, code){
                      if (err){
                          waterfallCallback(err);
                      }
                      else if (code){
                          getInventoryBySkuDAO(code.sku, function(err, inventory){
                              if (err){
                                  waterfallCallback(err);
                              }
                              else {
                                  var add = 0;
                                  if (isNaN(data.quantity)){
                                      add = data.quantity;
                                  }
                                  else {
                                      add = parseInt(data.quantity)
                                  }
                                  var newStock = inventory.stock + add;
                                  const update = {
                                      quantity : newStock
                                  }
                                  updateInventoryBySkuDAO(code.sku, update, waterfallCallback);
                              }
                          });
                      }
                      else {
                          const err = new Error("This code does not exists");
                          waterfallCallback(err);
                      }
                  });
              }
              else if (isWorker) {
                  const key = data.code
                  getNextImportId(function (err, counterDoc) {
                        if (err){
                            waterfallCallback(err);
                        }
                        else{
                            getCodeByKeyDAO(key, function(err, code){
                                 if (err){
                                    waterfallCallback(err);
                                 }
                                 else if (code){
                                     const importData = {
                                        id: counterDoc.counter,
                                        code: data.code,
                                        sku: code.mainSku,
                                        quantity: data.quantity,
                                        username: username,
                                        status: "pending"
                                     }
                                     createImportDAO(importData, waterfallCallback);
                                 }
                                 else {
                                     const err = new Error("This code does not exists");
                                     waterfallCallback(err);
                                 }
                            });
                        }
                  });
              }
              else {
                  const err = new Error("Not Enough Permission to import Inventory");
                  waterfallCallback(err);
              }
          }
          else {
              const err = new Error("Not Enough Permission to import Inventory");
              waterfallCallback(err);
          }

      }
    ],callback)
}

export function decreaseByPhone(data, callback){
    async.waterfall([
      function(waterfallCallback){
          const key = data.code;
          getCodeByKeyDAO(key, function(err, code){
              if (err){
                  waterfallCallback(err);
              }
              else{
                  getInventoryBySkuDAO(code.sku, function(err, inventory){
                      if (err){
                          waterfallCallback(err);
                      }
                      else {
                          if (data.quantity > inventory.stock){
                              const err = new Error("Deduction exceeds the current stock");
                              waterfallCallback(err);
                          }
                          else {
                              var newStock = inventory.stock - data.quantity;
                              const update = {
                                 stock: newStock
                              }
                              updateInventoryBySkuDAO(code.sku, update, waterfallCallback);
                          }
                      }
                  });
              }
          });
      }
    ],callback)
}

export function removeImport(data, callback){
    async.waterfall([
      function(waterfallCallback){
         const { roles, company } = data.userSession;
         const { isStoreManager, isWorker } = getUserRoles(roles);
         if (isWorker || isStoreManager){
            waterfallCallback()
         }
         else{
           const err = new Error("Not Enough Permission to remove Import");
           waterfallCallback(err);
         }
      },
      function(waterfallCallback){
          const id = data.id;
          getImportByIdDAO(id, function(err, importData){
              if (err){
                waterfallCallback(err);
              }
              else{
                  if (importData.status !== "pending"){
                      const err = new Error("Only pending import can be removed");
                      waterfallCallback(err);
                  }
                  else{
                      removeImportByIdDAO(id, waterfallCallback);
                  }
              }
          });
      }
    ],callback)
}

export function getPendingImports(callback){
    getPendingImportsDAO(callback);
}

export function getInventories(callback) {
    getInventoriesDAO(callback);
}

export function getPendingInventories(callback) {
    getPendingInventoriesDAO(callback);
}

function getUserRoles(roles) {
    const isStoreManager = roles.indexOf("storeManager") >= 0;
    const isWorker = roles.indexOf("worker") >= 0;
    return { isStoreManager, isWorker };
}

function getLatestHistory(inventory) {
    let latestHistory = null
    inventory.history.every(function (history) {
        if (latestHistory) {
            if ((new Date(history.timestamp)).getTime() > (new Date(latestHistory.timestamp)).getTime()) {
                latestHistory = history;
            }
        }
        else {
            latestHistory = history;
        }
        return true;
    });
    return latestHistory;
}
