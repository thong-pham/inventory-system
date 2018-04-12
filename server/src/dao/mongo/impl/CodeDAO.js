import mongoose from "mongoose";
import Code from "./../schema/CodeSchema";

export function createCode(data, callback) {
    const codeModel = new Code(data);
    codeModel.save(function (err, code) {
        callback(err, code);
    })
}

export function getAllCode(callback) {
    Code.find({}, function (err, codes) {
        callback(err, codes);
    });
}

export function getCodeById(id, callback) {
    Code.findOne({ "id": parseInt(id) }, function (err, code) {
        callback(err, code);
    });
}

export function getCodeByKey(key, callback) {
    Code.findOne({ "key": key }, function (err, code) {
        callback(err, code);
    });
}

export function updateCodeById(id, data, callback) {
    data.lastModifiedAt = new Date();
    Code.findOneAndUpdate({ "id": parseInt(id) }, data, { "new": true }, function (err, code) {
        callback(err, code);
    });
}

export function removeCodeById(id, callback) {
    Code.findOneAndRemove({ "id": parseInt(id) }, function (err, code) {
        callback(err, code);
    });
}
