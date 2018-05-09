import validator from "validator";

export function validateCode(data, callback) {
    var errors = {};
    if (!data.key) {
        errors["key"] = "Key is Required";
    }
    if (!data.sku) {
        errors["sku"] = "SKU is Required";
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
