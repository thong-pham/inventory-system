import mongoose from "mongoose";
import Inventory from "./../schema/InventorySchema";

export function createInventory(data, callback) {
    const inventoryModel = new Inventory(data);
    inventoryModel.save(function (err, inventory) {
        callback(err, inventory);
    })
}

export function createSubInventory(data, callback) {
    const subInventoryModel = new SubInventory(data);
    subInventoryModel.save(function (err, inventory) {
        callback(err, inventory);
    })
}

export function getInventoryById(id, callback) {
    Inventory.findOne({ "id": parseInt(id) }, function (err, inventory) {
        callback(err, inventory)
    });
}

export function getInventoryBySku(sku, callback) {
    Inventory.findOne({ "sku": sku }, function (err, inventory) {
        callback(err, inventory)
    });
}

export function getInventories(callback) {
    Inventory.find({ "isRemoved": false, "status": "approved" }, function (err, inventories) {
        callback(err, inventories)
    });
}

export function getPendingInventories(callback) {
    Inventory.find({ "isRemoved": false, "status": "pending" }, function (err, inventories) {
        //console.log(inventories);
        callback(err, inventories)
    });
}

export function updateInventoryById(id, data, callback) {
    data.lastModifiedAt = new Date();
    Inventory.findOneAndUpdate({ "id": parseInt(id) }, data, { "new": true }, function (err, inventory) {
        callback(err, inventory);
    });
}

export function updateInventoryBySku(sku, data, callback) {
    data.lastModifiedAt = new Date();
    Inventory.findOneAndUpdate({ "sku": sku }, data, { "new": true }, function (err, inventory) {
        callback(err, inventory);
    });
}

export function removeInventoryById(id, callback) {
    //data.lastModifiedAt = new Date();
    Inventory.findOneAndRemove({ "id": parseInt(id) }, function (err, inventory) {
        callback(err, inventory);
    });
}
