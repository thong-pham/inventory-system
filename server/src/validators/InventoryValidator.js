import validator from "validator";

export function validateCreateInventory(data, callback) {
    var errors = {};
    // if (!data.sku) {
    //     errors["sku"] = "SKU is Required";
    // }
    // if (!data.productName) {
    //     errors["productName"] = "Product Name is Required";
    // }
    if (!data.price) {
        errors["price"] = "Price is Required";
    }
    if (!data.stock) {
        errors["stock"] = "Stock is Required";
    }
    if (!data.unit) {
        errors["unit"] = "Unit is Required";
    }
    if (Object.keys(errors).length === 0) {
        callback();
    }
    else {
        callback(errors);
    }
}

export function validateUpdateByPhone(data, callback) {
    var errors = {};
    if (!data.code) {
        errors["code"] = "Code is Required";
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
