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

import { createInventoryInTrash as createInventoryInTrashDAO } from "./../dao/mongo/impl/TrashDAO";

import { getNextInventoryId, getNextSubInventoryId, getNextTrashId } from "./CounterService";
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
            if (company !== 'Mother Company') {
                const err = new Error("Only Mother Company can edit Inventory");
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

function getUserRoles(roles) {
    const isStoreManager = roles.indexOf("storeManager") >= 0;
    const isWorker = roles.indexOf("worker") >= 0;
    return { isStoreManager, isWorker };
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
            getInventoryByIdDAO(id, function (err, inventory) {
                if (err) {
                    waterfallCallback(err);
                }
                else {
                    if (inventory.status == "pending") {
                        waterfallCallback(null, inventory);
                    }
                    else {
                        const err = new Error("Only Pending Inventories can be approved");
                        waterfallCallback(err);
                    }
                }
            })
        },
        function (inventory, waterfallCallback) {
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
        }
    ], callback);
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

export function removeInventory(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const { roles, company } = data.userSession;
            const { isStoreManager, isWorker } = getUserRoles(roles);
            if (company !== 'Mother Company') {
                const err = new Error("Only Mother Company can remove Inventory");
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
                      else{
                          var newStock = inventory.stock + data.quantity;
                          const update = {
                              stock : newStock
                          }
                          updateInventoryBySkuDAO(code.sku, update, waterfallCallback);
                      }
                  });
              }
          });
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

export function getInventories(callback) {
    getInventoriesDAO(callback);
}

export function getPendingInventories(callback) {
    getPendingInventoriesDAO(callback);
}
