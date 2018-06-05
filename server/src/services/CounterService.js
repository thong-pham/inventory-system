import { incrementCounter } from "./../dao/mongo/impl/CounterDAO";

export function getNextUserId(callback) {
    incrementCounter("user", callback);
}

export function getNextInventoryId(callback) {
    incrementCounter("inventory", callback);
}

export function getNextSubInventoryId(callback) {
    incrementCounter("subInventory", callback);
}

export function getNextCompanyId(callback) {
    incrementCounter("company", callback);
}

export function getNextOrderId(callback) {
    incrementCounter("order", callback);
}

export function getNextCartId(callback) {
    incrementCounter("cart", callback);
}

export function getNextCodeId(callback) {
    incrementCounter("code", callback);
}

export function getNextTrashId(callback) {
    incrementCounter("trash", callback);
}

export function getNextImportId(callback) {
    incrementCounter("import", callback);
}

export function getNextExportId(callback) {
    incrementCounter("export", callback);
}

export function getNextQualityId(callback) {
    incrementCounter("quality", callback);
}

export function getNextTypeId(callback) {
    incrementCounter("type", callback);
}

export function getNextPatternId(callback) {
    incrementCounter("pattern", callback);
}

export function getNextColorId(callback) {
    incrementCounter("color", callback);
}

export function getNextSizeId(callback) {
    incrementCounter("size", callback);
}

export function getNextUnitId(callback) {
    incrementCounter("unit", callback);
}
