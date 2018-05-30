import mongoose from "mongoose";
import Order from "./../schema/OrderSchema";

export function createOrder(data, callback) {
    const orderModel = new Order(data);
    orderModel.save(function (err, order) {
        callback(err, order);
    })
}

export function getOrderById(id, callback) {
    Order.findOne({ "id": parseInt(id) }, function (err, order) {
        callback(err, order)
    });
}

export function updateOrderById(id, data, callback) {
    data.lastModifiedAt = new Date((new Date()).getTime() + (3600000*(-7)));
    Order.findOneAndUpdate({ "id": parseInt(id) }, data, { "new": true }, function (err, order) {
        callback(err, order);
    });
}

export function changeOrderDetails(id, data, callback) {
    data.lastModifiedAt = new Date((new Date()).getTime() + (3600000*(-7)));
    Order.findOneAndUpdate({ "id": parseInt(id) }, data, { "new": true }, function (err, order) {
        callback(err, order);
    });
}

export function getPendingOrders(callback) {
    Order.find({"status" : "pending"}, function (err, orders) {
        callback(err, orders)
    });
}

export function getProcessedOrders(callback) {
    Order.find({"status" : ["approved","canceled"] }, function (err, orders) {
        callback(err, orders)
    });
}

export function getCanceledOrders(callback) {
    Order.find({"status" : "canceled"}, function (err, orders) {
        callback(err, orders)
    });
}


export function getPendingOrderByCompany(company, callback) {
    Order.find({"status" : "pending", "company" : company}, function (err, orders) {
        callback(err, orders)
    });
}

export function getProcessedOrdersByCompany(company, callback) {
    Order.find({"status" : ["approved","canceled"], "company": company}, function (err, orders) {
        callback(err, orders)
    });
}

export function getCanceledOrdersByCompany(company, callback) {
    Order.find({"status" : "canceled", "company": company}, function (err, orders) {
        callback(err, orders)
    });
}

export function removeOrderById(id, callback) {
    //data.lastModifiedAt = new Date();
    Order.findOneAndRemove({ "id": parseInt(id) }, function (err, order) {
        callback(err, order);
    });
}
