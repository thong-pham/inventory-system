import validator from "validator";

export function validateUpdateSubInventory(data, callback) {
    var errors = {};
    if (!data.sku) {
        errors["sku"] = "SKU is Required";
    }
    if (!data.productName) {
        errors["productName"] = "Product Name is Required";
    }
    // if (!data.price) {
    //     errors["price"] = "Price is Required";
    // }
    // if (!data.stock) {
    //     errors["stock"] = "Stock is Required";
    // }
    if (Object.keys(errors).length === 0) {
        callback();
    }
    else {
        callback(errors);
    }
}

export function validateCreateSubInventory(data, callback) {
    var errors = {};
    if (!data.sku) {
        errors["sku"] = "SKU is Required";
    }
    if (!data.mainSku) {
        errors["mainSku"] = "Main SKU is Required";
    }
    if (!data.productName) {
        errors["productName"] = "Product Name is Required";
    }
    if (Object.keys(errors).length === 0) {
        callback();
    }
    else {
        callback(errors);
    }
}
