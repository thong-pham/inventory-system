import validator from "validator";

export function validateCreateCompany(data, callback) {
    var errors = {};
    if (!data.name) {
        errors.name = "Company Name is Required";
    }
    if (!data.code) {
        errors.code = "Code is Required";
    }
    if (Object.keys(errors).length === 0) {
        callback();
    }
    else {
        callback(errors);
    }
}
