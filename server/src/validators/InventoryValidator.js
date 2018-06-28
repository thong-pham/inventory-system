import validator from "validator";

export function validateCreateInventory(data, callback) {
    var errors = {};
    if (data.list.length === 0) {
        errors["list"] = "List is Required";
    }
    if (data.price === null) {
        errors["price"] = "Price is Required";
    }
    if (data.capacity === null) {
        errors["capacity"] = "Capacity is Required";
    }
    if (!data.unit) {
        errors["unit"] = "Unit is Required";
    }
    if (Object.keys(errors).length === 0) {
        callback();
    }
    else {
        callback(errors);
    }
}

export function validateUpdateInventory(data, callback) {
    var errors = {};
    if (!data.sku) {
        errors["sku"] = "SKU is Required";
    }
    if (!data.productName) {
        errors["productName"] = "Product Name is Required";
    }
    if (data.price === null) {
        errors["price"] = "Price is Required";
    }
    if (data.stock === null) {
        errors["stock"] = "Stock is Required";
    }
    if (data.capacity === null) {
        errors["capacity"] = "Capacity is Required";
    }
    if (!data.unit) {
        errors["unit"] = "Unit is Required";
    }
    if (Object.keys(errors).length === 0) {
        callback();
    }
    else {
        callback(errors);
    }
}

export function validateImportInventory(data, callback) {
    var errors = {};
    if (!data.code) {
        errors["code"] = "Code is Required";
    }
    if (data.quantity === null) {
        errors["quantity"] = "Quantity is Required";
    }
    if (data.capacity === null) {
        errors["capacity"] = "Capacity is Required";
    }
    if (data.count === null) {
        errors["count"] = "Count is Required";
    }
    if (Object.keys(errors).length === 0) {
        callback();
    }
    else {
        callback(errors);
    }
}

export function validateImportAllInventory(data, callback) {
    var errors = {};
    if (Object.keys(errors).length === 0) {
        callback();
    }
    else {
        callback(errors);
    }
}

export function validateDuplicateImport(data, callback) {
    var errors = {};
    if (!data.id) {
        errors["id"] = "Id is Required";
    }
    if (data.count === null) {
        errors["count"] = "Count is Required";
    }
    if (Object.keys(errors).length === 0) {
        callback();
    }
    else {
        callback(errors);
    }
}
