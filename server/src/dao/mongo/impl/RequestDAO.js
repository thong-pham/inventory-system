import mongoose from "mongoose";
import Request from "./../schema/RequestSchema";

export function createRequest(data, callback) {
    const requestModel = new Request(data);
    requestModel.save(function (err, request) {
        callback(err, request);
    })
}

export function getRequestById(id, callback) {
    Request.findOne({ "id": parseInt(id) }, function (err, request) {
        callback(err, request)
    });
}

export function updateRequestById(id, data, callback) {
    data.lastModifiedAt = new Date();
    Request.findOneAndUpdate({ "id": parseInt(id) }, data, { "new": true }, function (err, request) {
        callback(err, request);
    });
}

export function getPendingRequests(callback) {
    Request.find({"status" : "pending"}, function (err, requests) {
        //console.log(inventories);
        callback(err, requests)
    });
}
