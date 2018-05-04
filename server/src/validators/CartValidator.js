import validator from "validator";

export function validateCart(data, callback) {
    var errors = {};
    if (!data.sku) {
        errors["sku"] = "SKU is Required";
    }
    if (!data.quantity) {
        errors["quantity"] = "Quantity is Required";
    }
    if (!data.mainSku) {
        errors["mainSku"] = "Main SKU is Required";
    }
    if (Object.keys(errors).length === 0) {
        callback();
    }
    else {
        callback(errors);
    }
}
