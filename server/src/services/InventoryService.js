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
        getImportBySku as getImportBySkuDAO,
        removeImportById as removeImportByIdDAO,
        updateImportById as updateImportByIdDAO
    } from "./../dao/mongo/impl/ImportDAO";

import { createExport as createExportDAO,
        getPendingExports as getPendingExportsDAO,
        getExportById as getExportByIdDAO,
        getExportBySku as getExportBySkuDAO,
        removeExportById as removeExportByIdDAO,
        updateExportById as updateExportByIdDAO
    } from "./../dao/mongo/impl/ExportDAO";

import { createInventoryInTrash as createInventoryInTrashDAO } from "./../dao/mongo/impl/TrashDAO";

import { getNextInventoryId, getNextSubInventoryId, getNextTrashId, getNextImportId, getNextExportId, getNextCodeId } from "./CounterService";
import { getCompanyByName as getCompanyByNameDAO } from "./../dao/mongo/impl/CompanyDAO";
import {
      createCode as createCodeDAO,
      getCodeByKey as getCodeByKeyDAO,
      removeCodeBySku as removeCodeBySkuDAO,
      removeCodeByMainSku as removeCodeByMainSkuDAO
      } from "./../dao/mongo/impl/CodeDAO";

import {
        getLocationById as getLocationByIdDAO,
        getLocationByName as getLocationByNameDAO,
        updateLocationByName as updateLocationByNameDAO,
        updateLocationById as updateLocationByIdDAO
        } from "./../dao/mongo/impl/LocationDAO";

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
                    let update = null
                    if (inventory.location.indexOf(importData.location) >= 0) {
                        update = {
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
                    } else {
                        update = {
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
                                },
                                location: importData.location
                            }
                        }
                    }
                    
                    updateInventoryByIdDAO(inventory.id, update, function(err, inventory){
                        if (err){
                            waterfallCallback(err);
                        }
                        else if (inventory){
                            waterfallCallback(null, importData)
                        }
                    });
                }
            });
        },
        function(importData, waterfallCallback){
            getLocationByNameDAO(importData.location, function(err, location){
                if (err){
                    waterfallCallback(err);
                }
                else if (location){
                    let update = null;
                    let exist = false;
                    if (location.products.length > 0){
                        location.products.forEach(product => {
                            if (product.sku === importData.sku){
                                product.quantity += Number(importData.quantity);
                                exist = true;
                            }
                        })
                        if (exist){
                            update = {
                                products: location.products,
                                total: location.total + Number(importData.quantity)
                            }
                        }
                        else {
                            location.products.push({
                                sku: importData.sku,
                                quantity: Number(importData.quantity)
                            })
                            update = {
                                products: location.products,
                                total: location.total + Number(importData.quantity)
                            }
                        }
                        console.log(update);
                        updateLocationByNameDAO(importData.location, update, waterfallCallback);
                    }
                    else {
                        update = {
                            $push: {
                                products: {
                                    sku: importData.sku,
                                    quantity: Number(importData.quantity)
                                }
                            },
                            total: location.total + Number(importData.quantity)
                        };
                        console.log(update);
                        updateLocationByNameDAO(importData.location, update, waterfallCallback);
                    }
                }
            })
        },
        function(location, waterfallCallback){
            const id = data.id;
            removeImportByIdDAO(id, waterfallCallback);
        }
    ], callback);
}

export function approveInventoryOut(data, callback) {
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
            getExportByIdDAO(id, function (err, exportData) {
                if (err) {
                    waterfallCallback(err);
                }
                else if (exportData) {
                    if (exportData.status == "pending") {
                        waterfallCallback(null, exportData);
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
        function(exportData, waterfallCallback) {
            getInventoryBySkuDAO(exportData.sku, function(err, inventory){
                if (err){
                    waterfallCallback(err);
                }
                else {
                    if (exportData.quantity > inventory.stock){
                        const err = new Error("Export is larger than the current stock");
                        waterfallCallback(err);
                    }
                    else {
                        const newStock = inventory.stock - exportData.quantity;
                        let update = null;
                        update = {
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
                        updateInventoryByIdDAO(inventory.id, update, function(err, inventory){
                            if (err){
                                waterfallCallback(err);
                            }
                            else if (inventory){
                                waterfallCallback(null, exportData)
                            }
                        });
                    }
                 }
            });
        },
        function(exportData, waterfallCallback) {
            getLocationByNameDAO(exportData.location, function(err, location){
                let empty = false;
                if (err){
                    waterfallCallback(err);
                }
                else if (location){
                    let update = null;
                    let exist = false;
                    if (location.products.length > 0){
                        location.products.forEach(product => {
                            if (product.sku === exportData.sku){
                                product.quantity -= Number(exportData.quantity);
                                exist = true;
                                if (product.quantity === 0) {
                                    location.products.splice(location.products.indexOf(product), 1)
                                    empty = true;
                                }
                            }
                        })
                        if (exist){
                            update = {
                                products: location.products,
                                total: location.total - Number(exportData.quantity)
                            }
                        }
                        else {
                            const err = new Error("This product does not exist");
                            waterfallCallback(err);
                        }
                        // console.log(update);
                        updateLocationByNameDAO(exportData.location, update, function(err, location) {
                            if (err) {
                                waterfallCallback(err);
                            } else if (location) {
                                waterfallCallback(null, empty, exportData);
                            }
                        });
                        
                    }
                    else {
                        const err = new Error("This location is empty");
                        waterfallCallback(err);
                    }
                }
            })
        },
        function(empty, exportData, waterfallCallback) {
            if (empty) {
                getInventoryBySkuDAO(exportData.sku, function(err, inventory) {
                    if (err) {
                        waterfallCallback(err);
                    } else if (inventory) {
                        inventory.location.splice(inventory.location.indexOf(exportData.location), 1);
                        const update = {
                            location: inventory.location
                        }
                        updateInventoryByIdDAO(inventory.id, update, waterfallCallback);
                    }
                })
            } else {
                waterfallCallback();
            }
            
        },
        function(inventory, waterfallCallback) {
            const id = data.id;
            removeExportByIdDAO(id, waterfallCallback);
        }
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
             removeCodeByMainSkuDAO(trash.data.sku, waterfallCallback);
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
              if (isWorker || isStoreManager || isAdmin) {
                  const key = data.code;
                  getCodeByKeyDAO(key, function(err, code){
                       if (err){
                          waterfallCallback(err);
                       }
                       else if (code){
                           getNextImportId(function(err, counterDoc){
                               if (err){
                                  waterfallCallback(err);
                               }
                               else {
                                   const importData = {
                                      id: counterDoc.counter,
                                      code: data.code,
                                      sku: code.mainSku,
                                      quantity: data.quantity,
                                      capacity: data.capacity,
                                      count: data.count,
                                      location: data.location,
                                      username: username,
                                      status: "pending"
                                   }
                                   createImportDAO(importData, waterfallCallback);
                               }
                           });

                       }
                       else {
                           const err = new Error("This code does not exists");
                           waterfallCallback(err);
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

export function exportInventory(data, callback){
    async.waterfall([
      function(waterfallCallback){
          const { roles, company, username } = data.userSession;
          const { isStoreManager, isWorker, isAdmin } = getUserRoles(roles);
          const key = data.code;
          if (company === 'ISRA'){
              if (isStoreManager || isAdmin || isWorker) {
                  const key = data.code
                  getCodeByKeyDAO(key, function(err, code){
                       if (err){
                          waterfallCallback(err);
                       }
                       else if (code){
                            getNextExportId(function (err, counterDoc){
                                if (err){
                                    waterfallCallback(err);
                                }
                                else {
                                    const exportData = {
                                       id: counterDoc.counter,
                                       code: data.code,
                                       sku: code.mainSku,
                                       quantity: data.quantity,
                                       capacity: data.capacity,
                                       count: data.count,
                                       location: data.location,
                                       username: username,
                                       status: "pending"
                                    }
                                    createExportDAO(exportData, waterfallCallback);
                                }
                            });
                       }
                       else {
                           const err = new Error("This code does not exists");
                           waterfallCallback(err);
                       }
                  });
              }
              else {
                  const err = new Error("Not Enough Permission to export Inventory");
                  waterfallCallback(err);
              }
          }
          else {
              const err = new Error("Not Enough Permission to export Inventory");
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

export function removeExport(data, callback){
    async.waterfall([
      function(waterfallCallback){
         const { roles, company } = data.userSession;
         const { isStoreManager, isWorker, isAdmin } = getUserRoles(roles);
         if (isWorker || isStoreManager || isAdmin){
            waterfallCallback()
         }
         else{
           const err = new Error("Not Enough Permission to remove export");
           waterfallCallback(err);
         }
      },
      function(waterfallCallback){
          const id = data.id;
          getExportByIdDAO(id, function(err, exportData){
              if (err){
                waterfallCallback(err);
              }
              else if (exportData){
                  if (exportData.status !== "pending"){
                      const err = new Error("Only pending export can be removed");
                      waterfallCallback(err);
                  }
                  else{
                      removeExportByIdDAO(id, waterfallCallback);
                  }
              }
              else {
                  const err = new Error("Export Not Found");
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

export function updateExport(data, callback){
    async.waterfall([
      function(waterfallCallback){
         const { roles, company } = data.userSession;
         const { isStoreManager, isWorker, isAdmin } = getUserRoles(roles);
         if (company !== 'ISRA') {
             const err = new Error("Only ISRA can change export");
             waterfallCallback(err)
         }
         if (isStoreManager || isAdmin){
            waterfallCallback()
         }
         else{
           const err = new Error("Not Enough Permission to change export");
           waterfallCallback(err);
         }
      },
      function(waterfallCallback){
          const id = data.id;
          getExportByIdDAO(id, function(err, exportData){
              if (err){
                waterfallCallback(err);
              }
              else if (exportData){
                  if (exportData.status !== "pending"){
                      const err = new Error("Only pending export can be removed");
                      waterfallCallback(err);
                  }
                  else {
                      updateExportByIdDAO(id, data, waterfallCallback);
                  }
              }
              else {
                  const err = new Error("Export Not Found");
                  waterfallCallback(err);
              }
          });
      }
    ],callback)
}

export function duplicateImport(data, callback){
    async.waterfall([
      function(waterfallCallback){
         const { roles, company } = data.userSession;
         const { isStoreManager, isWorker, isAdmin } = getUserRoles(roles);
         if (company !== 'ISRA') {
             const err = new Error("Only ISRA can duplicate Import");
             waterfallCallback(err)
         }
         if (isStoreManager || isAdmin){
            waterfallCallback()
         }
         else{
           const err = new Error("Not Enough Permission to duplicate Import");
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
                      const err = new Error("Only pending import can be duplicate");
                      waterfallCallback(err);
                  }
                  else {

                      const newCount = importData.count - data.count;
                      const newQuantity = newCount * importData.capacity;
                      const update = {
                          count: newCount,
                          quantity: newQuantity
                      }
                      updateImportByIdDAO(id, update, waterfallCallback);
                  }
              }
              else {
                  const err = new Error("Import Not Found");
                  waterfallCallback(err);
              }
          });
      },
      function(importData, waterfallCallback){
          const { username } = data.userSession;
          getNextImportId(function (err, counterDoc) {
                if (err){
                    waterfallCallback(err);
                }
                else {
                     const count = data.count;
                     const quantity = count * importData.capacity;
                     const submit = {
                        id: counterDoc.counter,
                        code: importData.code,
                        sku: importData.sku,
                        quantity: quantity,
                        capacity: importData.capacity,
                        count: count,
                        username: username,
                        status: "pending"
                     }
                     createImportDAO(submit, waterfallCallback);
                }
          });
      }
    ],callback)
}

export function duplicateExport(data, callback){
    async.waterfall([
      function(waterfallCallback){
         const { roles, company } = data.userSession;
         const { isStoreManager, isWorker, isAdmin } = getUserRoles(roles);
         if (company !== 'ISRA') {
             const err = new Error("Only ISRA can duplicate export");
             waterfallCallback(err)
         }
         if (isStoreManager || isAdmin){
            waterfallCallback()
         }
         else{
           const err = new Error("Not Enough Permission to duplicate export");
           waterfallCallback(err);
         }
      },
      function(waterfallCallback){
          const id = data.id;
          getExportByIdDAO(id, function(err, exportData){
              if (err){
                waterfallCallback(err);
              }
              else if (exportData){
                  if (exportData.status !== "pending"){
                      const err = new Error("Only pending export can be duplicate");
                      waterfallCallback(err);
                  }
                  else {

                      const newCount = exportData.count - data.count;
                      const newQuantity = newCount * exportData.capacity;
                      const update = {
                          count: newCount,
                          quantity: newQuantity
                      }
                      updateExportByIdDAO(id, update, waterfallCallback);
                  }
              }
              else {
                  const err = new Error("Export Not Found");
                  waterfallCallback(err);
              }
          });
      },
      function(exportData, waterfallCallback){
          const { username } = data.userSession;
          getNextExportId(function (err, counterDoc) {
                if (err){
                    waterfallCallback(err);
                }
                else {
                     const count = data.count;
                     const quantity = count * exportData.capacity;
                     const submit = {
                        id: counterDoc.counter,
                        code: exportData.code,
                        sku: exportData.sku,
                        quantity: quantity,
                        capacity: exportData.capacity,
                        count: count,
                        username: username,
                        status: "pending"
                     }
                     createExportDAO(submit, waterfallCallback);
                }
          });
      }
    ],callback)
}

export function getPendingImports(callback){
    getPendingImportsDAO(callback);
}

export function getPendingExports(callback){
    getPendingExportsDAO(callback);
}

export function getInventories(callback) {
    getInventoriesDAO(function(err, inventories){
        if (err){
            callback(err);
        }
        else if(inventories){
            var count = 0;
            inventories.forEach(function(inventory){
                getImportBySkuDAO(inventory.sku, function(err, importData){
                     if (err){
                        callback(err);
                     }
                     else if(importData){
                          inventory.pending = 0;
                          importData.forEach(function(item){
                              inventory.pending = inventory.pending + item.quantity;
                          });

                         count += 1;
                         if (count === inventories.length){
                             //console.log(newInv);
                             callback(null, inventories);
                         }
                     }
                     else {
                        inventory.pending = 0;
                        count += 1;
                        if (count === inventories.length){
                            //console.log(newInv);
                            callback(null, inventories);
                        }
                     }
                });

            });
        }
        else {
            const err = new Error("Error");
            callback(err);
        }
    });
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
