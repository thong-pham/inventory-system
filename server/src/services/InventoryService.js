import async from "async";

import {
    createInventory as createInventoryDAO,
    getInventoryById as getInventoryByIdDAO,
    updateInventoryById as updateInventoryByIdDAO,
    removeInventoryById as removeInventoryByIdDAO,
    getInventories as getInventoriesDAO,
    getInventoriesInTrash as getInventoriesInTrashDAO,
    getInventoryBySku as getInventoryBySkuDAO,
    createSubInventory as createSubInventoryDAO,
    updateInventoryBySku as updateInventoryBySkuDAO
} from "./../dao/mongo/impl/InventoryDAO";

import { createImport as createImportDAO,
        getPendingImports as getPendingImportsDAO,
        getImportById as getImportByIdDAO,
        removeImportById as removeImportByIdDAO,
        updateImportById as updateImportByIdDAO
    } from "./../dao/mongo/impl/ImportDAO";

import { createInventoryInTrash as createInventoryInTrashDAO } from "./../dao/mongo/impl/TrashDAO";

import { getNextInventoryId, getNextSubInventoryId, getNextTrashId, getNextImportId, getNextCodeId } from "./CounterService";
import { getCompanyByName as getCompanyByNameDAO } from "./../dao/mongo/impl/CompanyDAO";
import {
      createCode as createCodeDAO,
      getCodeByKey as getCodeByKeyDAO,
      removeCodeBySku as removeCodeBySkuDAO
      } from "./../dao/mongo/impl/CodeDAO";

export function createInventory(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const { roles, company } = data.userSession;
            const { isStoreManager, isWorker, isAdmin } = getUserRoles(roles);
            if (isStoreManager || isAdmin) {
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
            data.stock = 0;
            data.history = [{
                action: "created",
                userId: data.userSession.userId,
                timestamp: new Date((new Date()).getTime() + (3600000*(-7)))
            }]
            createInventoryDAO(data, waterfallCallback);
        },
        function (inventory, waterfallCallback){
           getNextCodeId(function (err, counterDoc){
               waterfallCallback(err, inventory, counterDoc);
           });
        },
        function (inventory, counterDoc, waterfallCallback){
            const { company } = data.userSession;
            const code = {
                id: counterDoc.counter,
                key: inventory.sku,
                sku: "",
                mainSku: inventory.sku,
                company: company
            }
            createCodeDAO(code, waterfallCallback);
        }
    ], callback);
}

export function updateInventory(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const { roles, company } = data.userSession;
            const { isStoreManager, isWorker, isAdmin } = getUserRoles(roles);
            if (company !== 'ISRA') {
                const err = new Error("Only ISRA can update Inventory");
                waterfallCallback(err)
            }
            else if (isWorker || isStoreManager || isAdmin) {
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
            const { isStoreManager, isWorker, isAdmin } = getUserRoles(roles);
            if (isStoreManager || isAdmin) {
                const update = {
                    status: "approved",
                    sku: data.sku,
                    productName: data.productName,
                    price: data.price,
                    stock: data.stock,
                    unit: data.unit,
                    capacity: data.capacity,
                    $push: {
                        history: {
                            action: "updated",
                            userId: data.userSession.userId,
                            timestamp: new Date((new Date()).getTime() + (3600000*(-7))),
                            payload: {
                                sku: data.sku,
                                productName: data.productName,
                                price: data.price,
                                stock: data.stock,
                                unit: data.unit,
                                capacity: data.capacity
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
                            timestamp: new Date((new Date()).getTime() + (3600000*(-7))),
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
            const { roles, company } = data.userSession;
            const { isStoreManager, isWorker, isAdmin } = getUserRoles(roles);
            if (company !== 'ISRA') {
                const err = new Error("Only ISRA can approve Inventory");
                waterfallCallback(err)
            }
            else if (isStoreManager || isAdmin) {
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
                else if (importData) {
                    if (importData.status == "pending") {
                        waterfallCallback(null, importData);
                    }
                    else {
                        const err = new Error("Only Pending Inventories can be approved");
                        waterfallCallback(err);
                    }
                }
                else {
                    const err = new Error("Import Not Found");
                    waterfallCallback(err);
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
                                timestamp: new Date((new Date()).getTime() + (3600000*(-7))),
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
            const { isStoreManager, isWorker, isAdmin } = getUserRoles(roles);
            if (company !== 'ISRA') {
                const err = new Error("Only ISRA can remove Inventory");
                waterfallCallback(err)
            }
            else if (isStoreManager || isAdmin) {
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
            const { isStoreManager, isWorker, isAdmin } = getUserRoles(roles);
            if (isStoreManager || isAdmin) {
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
                updateInventoryByIdDAO(id, update, waterfallCallback);
                //removeInventoryByIdDAO(id, waterfallCallback);
                //createInventoryInTrashDAO(inventory, waterfallCallback);
            }
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
            }
        },
        function(inventory, waterfallCallback){
            getNextTrashId(function (err, counterDoc) {
                waterfallCallback(err, inventory, counterDoc);
            });
        },
        function(inventory, counterDoc, waterfallCallback){

            const data = {
                id: counterDoc.counter,
                inventory: {
                    id: inventory.id,
                    sku: inventory.sku,
                    price: inventory.price,
                    stock: inventory.stock,
                    unit: inventory.unit,
                    capacity: inventory.capacity,
                    status: inventory.status,
                    productName: inventory.productName,
                    history: inventory.history,
                    isRemoved: inventory.isRemoved
                },
                status: "pending"
            }
            createInventoryInTrashDAO(data, waterfallCallback);
        },*/
        // function(trash, waterfallCallback){
        //     removeCodeBySkuDAO(trash.sku, waterfallCallback);
        // }
    ], callback);
}

export function recoverInventory(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const { roles, company } = data.userSession;
            const { isStoreManager, isWorker, isAdmin } = getUserRoles(roles);
            if (company !== 'ISRA') {
                const err = new Error("Only ISRA can recover Inventory");
                waterfallCallback(err)
            }
            else if (isStoreManager || isAdmin) {
                waterfallCallback();
            }
            else {
                const err = new Error("Not Enough Permission to recover Inventory");
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
            const { isStoreManager, isWorker, isAdmin } = getUserRoles(roles);
            if (isStoreManager || isAdmin) {
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
                updateInventoryByIdDAO(id, update, waterfallCallback);
            }
          }
    ], callback);
}

export function removeInventoryInTrash(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const { roles, company } = data.userSession;
            const { isStoreManager, isWorker, isAdmin } = getUserRoles(roles);
            if (company !== 'ISRA') {
                const err = new Error("Only ISRA can remove Inventory");
                waterfallCallback(err)
            }
            else if (isStoreManager || isAdmin) {
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
            const { isStoreManager, isWorker, isAdmin } = getUserRoles(roles);
            if (isStoreManager || isAdmin) {
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
                removeInventoryByIdDAO(id, waterfallCallback);
            }
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
                type: "inventory"
            }
            createInventoryInTrashDAO(data, waterfallCallback);
        },
        function(trash, waterfallCallback){
             removeCodeBySkuDAO(trash.data.sku, waterfallCallback);
        }
    ], callback);
}


export function importInventory(data, callback){
    async.waterfall([
      function(waterfallCallback){
          const { roles, company, username } = data.userSession;
          const { isStoreManager, isWorker, isAdmin } = getUserRoles(roles);
          const key = data.code;
          if (company === 'ISRA'){
              /*if(isStoreManager || isAdmin)
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
                                      stock : newStock
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
              }*/
              if (isWorker || isStoreManager || isAdmin) {
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
                                        capacity: data.capacity,
                                        count: data.count,
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

export function removeImport(data, callback){
    async.waterfall([
      function(waterfallCallback){
         const { roles, company } = data.userSession;
         const { isStoreManager, isWorker, isAdmin } = getUserRoles(roles);
         if (isWorker || isStoreManager || isAdmin){
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
              else if (importData){
                  if (importData.status !== "pending"){
                      const err = new Error("Only pending import can be removed");
                      waterfallCallback(err);
                  }
                  else{
                      removeImportByIdDAO(id, waterfallCallback);
                  }
              }
              else {
                  const err = new Error("Import Not Found");
                  waterfallCallback(err);
              }
          });
      }
    ],callback)
}

export function updateImport(data, callback){
    async.waterfall([
      function(waterfallCallback){
         const { roles, company } = data.userSession;
         const { isStoreManager, isWorker, isAdmin } = getUserRoles(roles);
         if (company !== 'ISRA') {
             const err = new Error("Only ISRA can change Import");
             waterfallCallback(err)
         }
         if (isStoreManager || isAdmin){
            waterfallCallback()
         }
         else{
           const err = new Error("Not Enough Permission to change Import");
           waterfallCallback(err);
         }
      },
      function(waterfallCallback){
          const id = data.id;
          getImportByIdDAO(id, function(err, importData){
              if (err){
                waterfallCallback(err);
              }
              else if (importData){
                  if (importData.status !== "pending"){
                      const err = new Error("Only pending import can be removed");
                      waterfallCallback(err);
                  }
                  else {
                      updateImportByIdDAO(id, data, waterfallCallback);
                  }
              }
              else {
                  const err = new Error("Import Not Found");
                  waterfallCallback(err);
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

export function getInventoriesInTrash(callback) {
    getInventoriesInTrashDAO(callback);
}

function getUserRoles(roles) {
    const isStoreManager = roles.indexOf("storeManager") >= 0;
    const isWorker = roles.indexOf("worker") >= 0;
    const isAdmin = roles.indexOf("admin") >= 0;
    return { isStoreManager, isWorker, isAdmin };
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
