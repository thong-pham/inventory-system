import mongoose from "mongoose";
import Location from "./../schema/LocationSchema";

export function createLocation(data, callback) {
    const locationModel = new Location(data);
    locationModel.save(function (err, location) {
        callback(err, location);
    })
}

export function getLocations(callback) {
    Location.find({}, function (err, locations) {
        callback(err, locations)
    });
}

export function getLocationById(id, callback) {
    Location.findOne({ "id": parseInt(id) }, function (err, location) {
        callback(err, location)
    });
}

export function getLocationByName(name, callback) {
    Location.findOne({ "name": name }, function (err, location) {
        callback(err, location)
    });
}

export function updateLocationById(id, data, callback) {
    data.lastModifiedAt = new Date((new Date()).getTime() + (3600000*(-8)));
    Location.findOneAndUpdate({ "id": parseInt(id) }, data, { "new": true }, function (err, location) {
        callback(err, location);
    });
}

export function updateLocationByName(name, data, callback) {
    data.lastModifiedAt = new Date((new Date()).getTime() + (3600000*(-8)));
    Location.findOneAndUpdate({ "name": name }, data, { "new": true }, function (err, location) {
        callback(err, location);
    });
}

export function removeLocationById(id, callback) {
    Location.findOneAndRemove({ "id": parseInt(id) }, function (err, location) {
        callback(err, location);
    });
}
