import async from "async";

import {
    createSubInventory as createSubInventoryDAO,
    getSubInventoriesByCompany as getSubInventoriesByCompanyDAO,
    getSubInventories as getSubInventoriesDAO,
    getSubInventoryById as getSubInventoryByIdDAO,
    getSubInventoryBySku as getSubInventoryBySkuDAO,
    updateSubInventoryById as updateSubInventoryByIdDAO,
    removeSubInventoryById as removeSubInventoryByIdDAO
} from "./../dao/mongo/impl/SubInventoryDAO";
import { getInventoryBySku as getInventoryBySkuDAO } from "./../dao/mongo/impl/InventoryDAO";
//import { getCompanyByName as getCompanyByNameDAO } from "./../dao/mongo/impl/CompanyDAO";
import { getNextInventoryId, getNextRequestId, getNextSubInventoryId } from "./CounterService";
import { getCompanyByName as getCompanyByNameDAO } from "./../dao/mongo/impl/CompanyDAO";

export function createSubInventory(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const { roles, company } = data.userSession;
            const { isSales } = getUserRoles(roles);
            if (isSales) {
                data.status = "approved";
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
            getSubInventoryBySkuDAO(data.sku, waterfallCallback);
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
            getNextSubInventoryId(function (err, counterDoc) {
                waterfallCallback(err, data, counterDoc);
            });
        },
        function (data, counterDoc, waterfallCallback) {
            const { company } = data.userSession;
            data.id = counterDoc.counter;
            data.company = company;
            data.history = [{
                action: "created",
                userId: data.userSession.userId,
                timestamp: new Date()
            }]
            createSubInventoryDAO(data, waterfallCallback);
        }
    ], callback);
}

export function updateSubInventory(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const { roles, company } = data.userSession;
            const { isSales } = getUserRoles(roles);
            if (company === 'Mother Company') {
                const err = new Error("Only Child Company can edit SubInventory");
                waterfallCallback(err)
            }
            else if (isSales) {
                waterfallCallback();
            }
            else {
                const err = new Error("Not Enough Permission to update Inventory");
                waterfallCallback(err);
            }
        },
        function (waterfallCallback) {
            const id = data.id;
            getSubInventoryByIdDAO(id, function (err, inventory) {
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
            const { isSales } = getUserRoles(roles);
            if (isSales) {
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
                updateSubInventoryByIdDAO(id, update, waterfallCallback);
            }
            /*else if (isWorker) {
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
                updateSubInventoryByIdDAO(id, update, waterfallCallback);
            }*/
        }
    ], callback);
}

function getUserRoles(roles) {
    const isSales = roles.indexOf("sales") >= 0;
    return { isSales };
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

export function removeSubInventory(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const { roles, company } = data.userSession;
            const { isSales } = getUserRoles(roles);
            if (company === 'Mother Company') {
                const err = new Error("Only Child Company can remove Inventory");
                waterfallCallback(err)
            }
            else if (isSales) {
                waterfallCallback();
            }
            else {
                const err = new Error("Not Enough Permission to remove Inventory");
                waterfallCallback(err);
            }
        },
        function (waterfallCallback) {
            const id = data.id;
            getSubInventoryByIdDAO(id, function (err, inventory) {
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
            const { isSales } = getUserRoles(roles);
            if (isSales) {
                const id = data.id;
                //updateInventoryByIdDAO(id, update, waterfallCallback);
                removeSubInventoryByIdDAO(id, waterfallCallback);
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
        }

    ], callback);
}

export function getSubInventoriesByCompany(company, callback){
     getSubInventoriesByCompanyDAO(company, function(err, inventories){
          if (err){
              waterfallCallback(err);
          }
          else {
              var newInv = [];
              var count = 0;
              inventories.forEach(function(inventory){
                  getInventoryBySkuDAO(inventory.mainSku, function(err, inv){
                      if (err){
                          callback(err);
                      }
                      else if (inv) {
                          inventory.mainStock = inv.stock;
                          newInv.push(inventory);
                          count += 1;
                            if (count === inventories.length){
                                //console.log(newInv);
                                callback(null, newInv);
                            }
                      }
                      else {
                          inventory.mainStock = 0;
                          newInv.push(inventory);
                          count += 1;
                          if (count === inventories.length){
                              //console.log(newInv);
                              callback(null, newInv);
                          }
                      }
                  });
              });
          }
     });
}

export function getSubInventories (callback){
    getSubInventoriesDAO(callback);
}

function getUserRoles(roles) {
    const isSales = roles.indexOf("sales") >= 0;
    return { isSales };
}
