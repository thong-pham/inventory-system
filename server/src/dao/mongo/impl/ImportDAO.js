import mongoose from "mongoose";
import Import from "./../schema/ImportSchema";

export function createImport(data, callback) {
    const importModel = new Import(data);
    importModel.save(function (err, importData) {
        callback(err, importData);
    })
}

export function getImportById(id, callback) {
    Import.findOne({ "id": parseInt(id) }, function (err, importData) {
        callback(err, importData)
    });
}

export function getImportBySku(sku, callback) {
    Import.findOne({ "sku": sku }, function (err, importData) {
        callback(err, importData)
    });
}

export function updateImportById(id, data, callback) {
    data.lastModifiedAt = new Date((new Date()).getTime() + (3600000*(-7)));
    Import.findOneAndUpdate({ "id": parseInt(id) }, data, { "new": true }, function (err, importData) {
        callback(err, importData);
    });
}

export function updateImportBySku(sku, data, callback) {
    data.lastModifiedAt = new Date((new Date()).getTime() + (3600000*(-7)));
    Import.findOneAndUpdate({ "sku": sku }, data, { "new": true }, function (err, importData) {
        callback(err, importData);
    });
}

export function getPendingImports(callback) {
    Import.find({"status" : "pending"}, function (err, importData) {
        callback(err, importData)
    });
}

export function removeImportById(id, callback) {
    Import.findOneAndRemove({ "id": parseInt(id) }, function (err, importData) {
        callback(err, importData);
    });
}
