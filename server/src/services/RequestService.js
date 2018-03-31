import async from "async";

import {
    createRequest as createRequestDAO,
    getPendingRequests as getPendingRequestsDAO,
    getRequestById as getRequestByIdDAO,
    updateRequestById as updateRequestByIdDAO

} from "./../dao/mongo/impl/RequestDAO";

import {
    createSubInventory as createSubInventoryDAO,
    getSubInventoryBySku as getSubInventoryBySkuDAO,
    updateSubInventoryById as updateSubInventoryByIdDAO,
} from "./../dao/mongo/impl/SubInventoryDAO";
import { getCompanyByName as getCompanyByNameDAO } from "./../dao/mongo/impl/CompanyDAO";

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

export function createRequest(data, callback){
   async.waterfall([
     function (waterfallCallback){
        getNextRequestId(function (err, counterDoc){
            waterfallCallback(err, data, counterDoc);
        });
     },
     function (data, counterDoc, waterfallCallback){
         const { company, username } = data.userSession;
         data.id = counterDoc.counter;
         data.company = company;
         data.username = username;
         createRequestDAO(data, waterfallCallback);
     }
   ],callback);
}

export function approveRequest(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const { roles, company } = data.userSession;
            const { isStoreManager, isWorker } = getUserRoles(roles);
            if (isStoreManager && company === 'Mother Company') {
                waterfallCallback();
            }
            else {
                const err = new Error("Not Enough Permission to approve Request");
                waterfallCallback(err);
            }
        },
        function (waterfallCallback) {
            const { company } = data.userSession;
            const id = data.id;
            getRequestByIdDAO(id, function (err, request) {
                if (err) {
                    waterfallCallback(err);
                }
                else {
                    if (request.status !== "pending"){
                          const err = new Error("Only Pending Requests can be approved");
                          waterfallCallback(err);
                    }
                    else {
                          getInventoryBySkuDAO(request.sku, function(err, inventory){
                                if(err){
                                    waterfallCallback(err);
                                }
                                else {
                                     if (request.quantity <= inventory.stock){
                                           waterfallCallback(null, inventory);
                                     }
                                     else {
                                          const err = new Error("This request exceed the current stock");
                                          waterfallCallback(err);
                                     }
                                }
                          });
                     }
                }
            });
        },
        function (inventory, waterfallCallback) {
            const latestHistory = getLatestHistory(inventory);
            const id = data.id;
            if (latestHistory.action === "created" || latestHistory.action === "updated" || latestHistory.action === "approvedOut") {
                getRequestByIdDAO(id, function(err, request){
                    if (err){
                       waterfallCallback(err);
                    }
                    else {
                      const newStock = inventory.stock - request.quantity;
                      const update = {
                          stock: newStock,
                          $push: {
                              history: {
                                  action: "approvedOut",
                                  userId: data.userSession.userId,
                                  timestamp: new Date()
                              }
                          }
                      }
                      updateInventoryByIdDAO(inventory.id, update, waterfallCallback);
                    }
                });
            }
            else if (latestHistory.action === "removed") {
                const update = {
                    status: "approved",
                    isRemoved: true,
                    $push: {
                        history: {
                            action: "approved",
                            userId: data.userSession.userId,
                            timestamp: new Date()
                        }
                    }
                }
                updateInventoryByIdDAO(id, update, waterfallCallback);
            }
            else {
                const err = new Error("Weird Flow in Inventory Approval");
                waterfallCallback(err);
            }
        },
        function (inventory, waterfallCallback){
             const id = data.id;
             const { company } = data.userSession;
             console.log(inventory);
             getRequestByIdDAO(id, function(err, request){
                 if (err){
                    waterfallCallback(err);
                 }
                 else {
                   getCompanyByNameDAO(request.company, function (err, company){
                        if (err){
                            waterfallCallback(err)
                        }
                        else {
                              var subSku = company.code.concat("-").concat(request.sku);
                              getSubInventoryBySkuDAO(subSku, function (err, subInv){
                                    if (subInv) {
                                        var updateStock = subInv.stock + request.quantity;
                                        const update = {
                                            stock: updateStock,
                                            $push: {
                                                history: {
                                                    action: "updated",
                                                    userId: data.userSession.userId,
                                                    timestamp: new Date(),
                                                    payload: {
                                                        sku: subInv.sku,
                                                        productName: subInv.productName,
                                                        price: subInv.price,
                                                        stock: updateStock,
                                                    }
                                                }
                                            }
                                        }
                                        updateSubInventoryByIdDAO(subInv.id, update, waterfallCallback);
                                    }
                                    else {
                                      getNextSubInventoryId(function(err, counterDoc){
                                            const subInv = {
                                                id: counterDoc.counter,
                                                sku: subSku,
                                                stock: request.quantity,
                                                productName: { en: inventory.productName.en},
                                                price: inventory.price,
                                                company: company.name.en,
                                                status: "approved",
                                                history: [{
                                                    action: "accepted",
                                                    userId: data.userSession.userId,
                                                    timestamp: new Date()
                                                }]
                                            };
                                            createSubInventoryDAO(subInv, waterfallCallback);
                                        });
                                    }
                            });
                        }
                    });
                 }
             });
        },
        function (subInv, waterfallCallback){
              const id = data.id;
              const update = {
                   status: "approved"
              }
              updateRequestByIdDAO(id, update, waterfallCallback);
        }
    ], callback);
}

export function getPendingRequests(callback) {
    getPendingRequestsDAO(callback);
}
