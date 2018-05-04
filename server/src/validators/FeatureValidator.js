import validator from "validator";

export function validateFeature(data, callback) {
    var errors = {};
    if (!data.description) {
        errors["description"] = "description is Required";
    }
    if (!data.key) {
        errors["key"] = "Key is Required";
    }
    if (!data.kind) {
        errors["kind"] = "Kind is Required";
    }
    if (Object.keys(errors).length === 0) {
        callback();
    }
    else {
        callback(errors);
    }
}
