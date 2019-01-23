import validator from "validator";

export function validateCreateLocation(data, callback) {
    var errors = {};
    if (!data.name) {
        errors.name = "Location Name is Required";
    }
    if (Object.keys(errors).length === 0) {
        callback();
    }
    else {
        callback(errors);
    }
}
