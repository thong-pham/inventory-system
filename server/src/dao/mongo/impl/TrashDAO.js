import mongoose from "mongoose";
import Trash from "./../schema/TrashSchema";

export function createInventoryInTrash(data, callback) {
    const trashModel = new Trash(data);
    trashModel.save(function (err, inventory) {
        callback(err, inventory);
    })
}
