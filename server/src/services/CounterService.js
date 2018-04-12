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
