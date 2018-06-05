import mongoose from "mongoose";
import Export from "./../schema/ExportSchema";

export function createExport(data, callback) {
    const exportModel = new Export(data);
    exportModel.save(function (err, exportData) {
        callback(err, exportData);
    })
}

export function getExportById(id, callback) {
    Export.findOne({ "id": parseInt(id) }, function (err, exportData) {
        callback(err, exportData)
    });
}

export function getExportBySku(sku, callback) {
    Export.find({ "sku": sku }, function (err, exportData) {
        callback(err, exportData)
    });
}

export function updateExportById(id, data, callback) {
    data.lastModifiedAt = new Date((new Date()).getTime() + (3600000*(-7)));
    Export.findOneAndUpdate({ "id": parseInt(id) }, data, { "new": true }, function (err, exportData) {
        callback(err, exportData);
    });
}

export function updateExportBySku(sku, data, callback) {
    data.lastModifiedAt = new Date((new Date()).getTime() + (3600000*(-7)));
    Export.findOneAndUpdate({ "sku": sku }, data, { "new": true }, function (err, exportData) {
        callback(err, exportData);
    });
}

export function getPendingExports(callback) {
    Export.find({"status" : "pending"}, function (err, exportData) {
        callback(err, exportData)
    });
}

export function removeExportById(id, callback) {
    Export.findOneAndRemove({ "id": parseInt(id) }, function (err, exportData) {
        callback(err, exportData);
    });
}
