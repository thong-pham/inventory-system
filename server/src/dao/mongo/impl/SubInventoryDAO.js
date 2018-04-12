import mongoose from "mongoose";
import Trash from "./../schema/TrashSchema";
import SubInventory from "./../schema/SubInventorySchema";

export function createSubInventory(data, callback) {
    const subInventoryModel = new SubInventory(data);
    subInventoryModel.save(function (err, inventory) {
        callback(err, inventory);
    })
}

export function createSubInventoryInTrash(data, callback) {
    const trashModel = new Trash(data);
    trashModel.save(function (err, inventory) {
        callback(err, inventory);
    })
}

export function getSubInventoryBySku(sku, callback) {
    SubInventory.findOne({ "sku": sku }, function (err, inventory) {
        callback(err, inventory)
    });
}

export function getSubInventoryById(id, callback) {
    SubInventory.findOne({ "id": parseInt(id) }, function (err, inventory) {
        callback(err, inventory)
    });
}

export function getSubInventoriesByCompany(company, callback) {
    SubInventory.find({ "isRemoved": false, "company" : company }, function (err, inventories) {
        callback(err, inventories)
    });
}

export function getSubInventories(callback) {
    SubInventory.find({ "isRemoved": false}, function (err, inventories) {
        callback(err, inventories)
    });
}

export function updateSubInventoryById(id, data, callback) {
    data.lastModifiedAt = new Date();
    SubInventory.findOneAndUpdate({ "id": parseInt(id) }, data, { "new": true }, function (err, inventory) {
        callback(err, inventory);
    });
}

export function removeSubInventoryById(id, callback) {
    //data.lastModifiedAt = new Date();
    SubInventory.findOneAndRemove({ "id": parseInt(id) }, function (err, inventory) {
        callback(err, inventory);
    });
}
