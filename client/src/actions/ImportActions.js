import axios from "axios";

export const GET_PENDING_IMPORTS_STARTED = "GET_PENDING_IMPORTS_STARTED";
export const GET_PENDING_IMPORTS_FULFILLED = "GET_PENDING_IMPORTS_FULFILLED";
export const GET_PENDING_IMPORTS_REJECTED = "GET_PENDING_IMPORTS_REJECTED";

export const GET_APPROVED_IMPORTS_STARTED = "GET_APPROVED_IMPORTS_STARTED";
export const GET_APPROVED_IMPORTS_FULFILLED = "GET_APPROVED_IMPORTS_FULFILLED";
export const GET_APPROVED_IMPORTS_REJECTED = "GET_APPROVED_IMPORTS_REJECTED";

export const APPROVE_IMPORT_STARTED = "APPROVE_IMPORT_STARTED";
export const APPROVE_IMPORT_FULFILLED = "APPROVE_IMPORT_FULFILLED";
export const APPROVE_IMPORT_REJECTED = "APPROVE_IMPORT_REJECTED";

export const CHANGE_IMPORT_STARTED = "CHANGE_IMPORT_STARTED";
export const CHANGE_IMPORT_FULFILLED = "CHANGE_IMPORT_FULFILLED";
export const CHANGE_IMPORT_REJECTED = "CHANGE_IMPORT_REJECTED";

export const DELETE_IMPORT_STARTED = "DELETE_IMPORT_STARTED";
export const DELETE_IMPORT_FULFILLED = "DELETE_IMPORT_FULFILLED";
export const DELETE_IMPORT_REJECTED = "DELETE_IMPORT_REJECTED";

export const IMPORT_INVENTORY_STARTED = "IMPORT_INVENTORY_STARTED";
export const IMPORT_INVENTORY_FULFILLED = "IMPORT_INVENTORY_FULFILLED";
export const IMPORT_INVENTORY_REJECTED = "IMPORT_INVENTORY_REJECTED";

export const FILL_CODE = "FILL_CODE";
export const CLEAR_IMPORT = "CLEAR_IMPORT";
export const INPUT_CAPACITY = "INPUT_CAPACITY";
export const INPUT_COUNT = "INPUT_COUNT";

const WS_URL = "https://api.israhospitality.com/inventories/";

export function getPendingImports(data) {
    return function (dispatch) {
        dispatch({ type: GET_PENDING_IMPORTS_STARTED });
        return axios.get(WS_URL + "pendingImports", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_PENDING_IMPORTS_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_PENDING_IMPORTS_REJECTED, payload: response });
                throw response;
            })
    }
}

export function importInventory(data) {
    return function (dispatch) {
        dispatch({ type: IMPORT_INVENTORY_STARTED });
        return axios.post(WS_URL + "importInventory", data)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: IMPORT_INVENTORY_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: IMPORT_INVENTORY_REJECTED, payload: response });
                throw response;
            })
    }
}

export function deleteImport(data) {
    const importData = data.importData;
    return function (dispatch) {
        dispatch({ type: DELETE_IMPORT_STARTED });
        return axios.delete(WS_URL + importData.id + "/import", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: DELETE_IMPORT_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: DELETE_IMPORT_REJECTED, payload: response });
                throw response;
            })
    }
}

export function updateImport(importData) {
    return function (dispatch) {
        dispatch({ type: CHANGE_IMPORT_STARTED });
        return axios.put(WS_URL + importData.id + "/import", importData)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: CHANGE_IMPORT_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: CHANGE_IMPORT_REJECTED, payload: response });
                throw response;
            })
    }
}

export function fillingCode(data){
   return function (dispatch){
       dispatch({ type : FILL_CODE, payload: data})
   }
}

export function clearImport(data){
   return function (dispatch){
       dispatch({ type : CLEAR_IMPORT })
   }
}

export function inputCapacity(data){
   return function (dispatch){
       dispatch({ type : INPUT_CAPACITY, payload: data })
   }
}

export function inputCount(data){
   return function (dispatch){
       dispatch({ type : INPUT_COUNT, payload: data })
   }
}
