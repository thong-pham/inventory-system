import mongoose from "mongoose";
import Cart from "./../schema/CartSchema";

export function createCart(data, callback) {
    const cartModel = new Cart(data);
    cartModel.save(function (err, Cart) {
        callback(err, Cart);
    })
}

export function getCartById(id, callback) {
    Cart.findOne({ "id": parseInt(id) }, function (err, cart) {
        callback(err, cart)
    });
}

export function getCartBySku(sku, callback) {
    Cart.findOne({ "sku": sku }, function (err, cart) {
        callback(err, cart)
    });
}

export function updateCartById(id, data, callback) {
    data.lastModifiedAt = new Date();
    Cart.findOneAndUpdate({ "id": parseInt(id) }, data, { "new": true }, function (err, cart) {
        callback(err, cart);
    });
}

export function updateCartBySku(sku, data, callback) {
    data.lastModifiedAt = new Date();
    Cart.findOneAndUpdate({ "sku": sku }, data, { "new": true }, function (err, cart) {
        callback(err, cart);
    });
}

export function getPendingCarts(username, callback) {
    Cart.find({"status" : "pending", "username" : username}, function (err, carts) {
        //console.log(inventories);
        callback(err, carts)
    });
}

export function removeCartById(id, callback) {
    Cart.findOneAndRemove({ "id": parseInt(id) }, function (err, cart) {
        callback(err, cart);
    });
}
