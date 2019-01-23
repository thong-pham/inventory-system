import async from "async";

import {
    createLocation as createLocationDAO,
    getLocationById as getLocationByIdDAO,
    getLocations as getLocationsDAO,
    getLocationByName as getLocationByNameDAO,
    updateLocationById as updateLocationByIdDAO,
    removeLocationById as removeLocationByIdDAO,
    updateLocationByName as updateLocationByNameDAO
} from "./../dao/mongo/impl/LocationDAO";

import {
    getInventoryBySku as getInventoryBySkuDAO
} from "./../dao/mongo/impl/InventoryDAO";

import { getNextLocationId } from "./CounterService";

import { getCompanyByName as getCompanyByNameDAO } from "./../dao/mongo/impl/CompanyDAO";

export function createLocation(data, callback){
   async.waterfall([
     function(waterfallCallback){
        //const { username } = data.userSession;
        getLocationByNameDAO(data.name, function(err, location){
            if (location){
                const err = new Error("Name Already Exists");
                waterfallCallback(err);
            }
            else {
                waterfallCallback();
            }
        });
     },
     function (waterfallCallback){
        getNextLocationId(function (err, counterDoc){
            waterfallCallback(err, data, counterDoc);
        });
     },
     function (data, counterDoc, waterfallCallback){
         data.id = counterDoc.counter;
         createLocationDAO(data, waterfallCallback);
     }
   ],callback);
}

export function editLocation(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const id = data.id;
            getLocationByIdDAO(id, function (err, location) {
                if (err) {
                    waterfallCallback(err);
                }
                else if (location) {
                    const update = {
                        name : data.name
                    }
                    updateLocationByIdDAO(id, update, waterfallCallback);
                }
                else {
                    const err = new Error("Location Not Found");
                    waterfallCallback(err);
                }
            });
        }
    ], callback);
}

export function addProduct(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const id = data.id;
            getLocationByIdDAO(id, function (err, location) {
                if (err) {
                    waterfallCallback(err);
                }
                else if (location) {
                    const products = location.products.push(data.product)
                    const update = {
                        products : products
                    }
                    updateLocationByIdDAO(id, update, waterfallCallback);
                }
                else {
                    const err = new Error("Location Not Found");
                    waterfallCallback(err);
                }
            });
        }
    ], callback);
}

export function moveProduct(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const id = data.id;
            getLocationByIdDAO(id, function (err, location) {
                if (err) {
                    waterfallCallback(err);
                }
                else if (location) {
                    location.products.forEach(product => { 
                        if (product.sku === data.product_sku){
                            product.quantity -= data.quantity;
                            if (product.quantity === 0){
                                const index = location.products.indexOf(product);
                                location.products.splice(index,1);
                            }
                        }
                    })
                    location.total -= data.quantity;
                    const update = {
                        products: location.products,
                        total: location.total
                    }
                    updateLocationByIdDAO(id, update, waterfallCallback)
                }
                else {
                    const err = new Error("Location Not Found");
                    waterfallCallback(err);
                }
            });
        },
        function(location, waterfallCallback){
            getLocationByNameDAO(data.newLocation, function(err, loc){
                if (err) {
                    waterfallCallback(err);
                }
                else if (loc) {
                    let exits = false;
                    loc.products.forEach(product => {
                        if (product.sku === data.product_sku){
                            product.quantity += data.quantity;
                            exits = true;
                        }
                    })
                    loc.total += data.quantity;
                    
                    if (exits){
                        const update = {
                            products: loc.products,
                            total: loc.total
                        }
                        updateLocationByNameDAO(data.newLocation, update, waterfallCallback)
                    }
                    else {
                        const update = {
                            $push: {
                                products: {
                                    sku: data.product_sku,
                                    quantity: data.quantity
                                }
                            },
                            total: location.total + data.quantity
                        };
                        updateLocationByNameDAO(data.newLocation, update, waterfallCallback)
                    }
                }
            })
        }
    ], callback);
}

export function deleteProduct(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const id = data.id;
            getLocationByIdDAO(id, function (err, location) {
                if (err) {
                    waterfallCallback(err);
                }
                else if (location) {
                    const products = location.products.push(data.product)
                    const update = {
                        products : products
                    }
                    updateLocationByIdDAO(id, update, waterfallCallback);
                }
                else {
                    const err = new Error("Location Not Found");
                    waterfallCallback(err);
                }
            });
        }
    ], callback);
}

export function removeLocation(data, callback){
    async.waterfall([
        function(waterfallCallback){
            const { roles } = data.userSession;
            const { isAdmin, isStoreManager } = getUserRoles(roles);
            if (isAdmin || isStoreManager){
                waterfallCallback();
            }
            else{
                const err = new Error("Not Enough Permission to remove Location");
                waterfallCallback(err);
            }
        },
        function(waterfallCallback){
            const id = data.id;
            getLocationByIdDAO(id, function(err, location){
                if (err){
                    waterfallCallback(err);
                }
                else if (location){
                    removeLocationByIdDAO(id, waterfallCallback);
                }
                else {
                    const err = new Error("Location Not Found");
                    waterfallCallback(err);
                }
            });
        }
    ],callback)
}

export function getLocations(callback) {
    getLocationsDAO(callback);
}

function getUserRoles(roles) {
    const isStoreManager = roles.indexOf("storeManager") >= 0;
    const isWorker = roles.indexOf("worker") >= 0;
    const isAdmin = roles.indexOf("admin") >= 0;
    return { isStoreManager, isWorker, isAdmin };
}
