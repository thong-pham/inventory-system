import async from "async";

import {
    getSubInventoriesByCompany as getSubInventoriesByCompanyDAO,
    getSubInventories as getSubInventoriesDAO,
} from "./../dao/mongo/impl/InventoryDAO";
//import { getCompanyByName as getCompanyByNameDAO } from "./../dao/mongo/impl/CompanyDAO";
import { getNextInventoryId, getNextRequestId, getNextSubInventoryId } from "./CounterService";
import { getCompanyByName as getCompanyByNameDAO } from "./../dao/mongo/impl/CompanyDAO";

export function updateSubInventory(data, callback) {
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
                //updateInventoryByIdDAO(id, update, waterfallCallback);
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
        }

    ], callback);
}

export function getSubInventories (userSession, callback){
     const company = userSession.company;
     getSubInventoriesByCompanyDAO(company, callback);
}

export function getAllSubInventories (){

}
