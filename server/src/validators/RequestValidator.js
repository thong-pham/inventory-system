import validator from "validator";

export function validateRequestInventory(data, callback) {
    var errors = {};
    if (!data.sku) {
        errors["sku"] = "SKU is Required";
    }
    if (!data.stock) {
        errors["stock"] = "Stock is Required";
    }
    if (Object.keys(errors).length === 0) {
        callback();
    }
    else {
        callback(errors);
    }
}
