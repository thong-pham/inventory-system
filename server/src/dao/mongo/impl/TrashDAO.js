import mongoose from "mongoose";
import Trash from "./../schema/TrashSchema";

export function createInventoryInTrash(data, callback) {
    const trashModel = new Trash(data);
    trashModel.save(function (err, trash) {
        callback(err, trash);
    })
}

export function getInventoriesInTrash(callback) {
    Trash.find({ "status": "removed" }, function (err, inventories) {
        callback(err, inventories)
    });
}
