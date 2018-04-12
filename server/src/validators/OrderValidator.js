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
