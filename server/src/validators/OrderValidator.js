import validator from "validator";

export function validateOrderInventory(data, callback) {
    var errors = {};
    if (Object.keys(errors).length === 0) {
        callback();
    }
    else {
        callback(errors);
    }
}

export function validateChangeOrder(data, callback) {
    var errors = {};
    if (!data.orderId) {
        errors["orderId"] = "Order Id is Required";
    }
    if (!data.cartId) {
        errors["cartId"] = "Cart Id is Required";
    }
    if (!data.quantity) {
        errors["quantity"] = "Quantity is Required";
    }
    if (Object.keys(errors).length === 0) {
        callback();
    }
    else {
        callback(errors);
    }
}

export function validateDeleteItem(data, callback) {
    var errors = {};
    if (!data.orderId) {
        errors["orderId"] = "Order Id is Required";
    }
    if (!data.cartId) {
        errors["cartId"] = "Cart Id is Required";
    }
    if (Object.keys(errors).length === 0) {
        callback();
    }
    else {
        callback(errors);
    }
}
