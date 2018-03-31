import validator from "validator";

export function validateCreateMember(data, callback) {
    var errors = {};
    if (!data.username) {
        errors.username = "Username is Required";
    }
    /*else {
        if (!validator.isEmail(data.email)) {
            errors.email = "Email Not Valid";
        }
    }*/
    if (!data.roles) {
        errors.roles = "Role is Required";
    }
    if (!data.company) {
        errors.company = "Company is Required";
    }
    if (!data.password) {
        errors.password = "Password is Required";
    }
    if (Object.keys(errors).length === 0) {
        callback();
    }
    else {
        callback(errors);
    }
}

export function validateLoginMember(data, callback) {
    var errors = {};
    if (!data.username) {
        errors.username = "Username is Required";
    }
    if (!data.password) {
        errors.password = "Password is Required";
    }
    if (Object.keys(errors).length === 0) {
        callback();
    }
    else {
        callback(errors);
    }
}
