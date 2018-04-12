import validator from "validator";

export function validateCart(data, callback) {
    var errors = {};
    if (!data.sku) {
        errors["sku"] = "SKU is Required";
    }
    if (!data.quantity) {
        errors["quantity"] = "Quantity is Required";
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
