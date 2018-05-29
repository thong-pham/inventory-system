import async from "async";

import {
    createSubInventory as createSubInventoryDAO,
    getSubInventoriesByCompany as getSubInventoriesByCompanyDAO,
    getSubInventories as getSubInventoriesDAO,
    getSubInventoryById as getSubInventoryByIdDAO,
    getSubInventoryBySku as getSubInventoryBySkuDAO,
    updateSubInventoryById as updateSubInventoryByIdDAO,
    removeSubInventoryById as removeSubInventoryByIdDAO,
    getSubInventoriesInTrash as getSubInventoriesInTrashDAO
} from "./../dao/mongo/impl/SubInventoryDAO";
import { getInventoryBySku as getInventoryBySkuDAO } from "./../dao/mongo/impl/InventoryDAO";
//import { getCompanyByName as getCompanyByNameDAO } from "./../dao/mongo/impl/CompanyDAO";
import { getNextInventoryId, getNextRequestId, getNextSubInventoryId, getNextTrashId } from "./CounterService";
import { getCompanyByName as getCompanyByNameDAO } from "./../dao/mongo/impl/CompanyDAO";

import { createInventoryInTrash as createInventoryInTrashDAO } from "./../dao/mongo/impl/TrashDAO";

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
        function(waterfallCallback){
            getInventoryBySkuDAO(data.mainSku, function(err, inventory){
                if (err){
                    waterfallCallback(err);
                }
                else if (inventory){
                   // if (inventory.stock === 0){
                   //    const err = new Error("This product is currently out of stock")
                   //    waterfallCallback(err);
                   // }
                   waterfallCallback();

                }
                else {
                    const err = new Error("This product does not exist in the main inventory");
                    waterfallCallback(err);
                }
            });
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
                timestamp: new Date((new Date()).getTime() + (3600000*(-7)))
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
            if (company === 'ISRA') {
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
                    $push: {
                        history: {
                            action: "updated",
                            userId: data.userSession.userId,
                            timestamp: new Date((new Date()).getTime() + (3600000*(-7))),
                            payload: {
                                sku: data.sku,
                                productName: data.productName,
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
            if (company === 'ISRA') {
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
                        const update = {
                            isRemoved: true
                        }
                        updateSubInventoryByIdDAO(id, update, waterfallCallback);
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
      }
    ], callback);
}

export function getSubInventoriesByCompany(company, callback){
     getSubInventoriesByCompanyDAO(company, function(err, inventories){
          if (err){
              callback(err);
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
                          inventory.unit = inv.unit;
                          newInv.push(inventory);
                          count += 1;
                            if (count === inventories.length){
                                //console.log(newInv);
                                callback(null, newInv);
                            }
                      }
                      else {
                          inventory.mainStock = 0;
                          inventory.unit = "N/A"
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

export function recoverSubInventory(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const { roles, company } = data.userSession;
            const { isSales } = getUserRoles(roles);
            if (company === 'ISRA') {
                const err = new Error("Only Child can recover Inventory");
                waterfallCallback(err)
            }
            else if (isSales) {
                waterfallCallback();
            }
            else {
                const err = new Error("Not Enough Permission to recover Inventory");
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
                          const update = {
                              isRemoved: false,
                              $push: {
                                  history: {
                                      action: "recovered",
                                      userId: data.userSession.userId,
                                      timestamp: new Date((new Date()).getTime() + (3600000*(-7)))
                                  }
                              }
                          }
                          const id = data.id;
                          updateSubInventoryByIdDAO(id, update, waterfallCallback);
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
        }
    ], callback);
}

export function removeSubInventoryInTrash(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const { roles, company } = data.userSession;
            const { isSales } = getUserRoles(roles);
            if (company === 'ISRA') {
                const err = new Error("Only Child can remove Inventory");
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
                        const update = {
                            isRemoved: true,
                            $push: {
                                history: {
                                    action: "removed",
                                    userId: data.userSession.userId,
                                    timestamp: new Date((new Date()).getTime() + (3600000*(-7)))
                                }
                            }
                        }
                        const id = data.id;
                        removeSubInventoryByIdDAO(id, waterfallCallback);
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
        function(inventory, waterfallCallback){
            getNextTrashId(function (err, counterDoc) {
                waterfallCallback(err, inventory, counterDoc);
            });
        },
        function(inventory, counterDoc, waterfallCallback){
            const data = {
                id: counterDoc.counter,
                data: inventory,
                type: "subInventory"
            }
            createInventoryInTrashDAO(data, waterfallCallback);
        }
    ], callback);
}

export function getSubInventories (callback){
    getSubInventoriesDAO(callback);
}

export function getSubInventoriesInTrash (company, callback){
    getSubInventoriesInTrashDAO(company, callback);
}

function getUserRoles(roles) {
    const isSales = roles.indexOf("sales") >= 0;
    return { isSales };
}
