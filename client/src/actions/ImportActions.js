import axios from "axios";
import { URL } from "./URL";

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

export const DUPLICATE_IMPORT_STARTED = "DUPLICATE_IMPORT_STARTED";
export const DUPLICATE_IMPORT_FULFILLED = "DUPLICATE_IMPORT_FULFILLED";
export const DUPLICATE_IMPORT_REJECTED = "DUPLICATE_IMPORT_REJECTED";

export const DELETE_IMPORT_STARTED = "DELETE_IMPORT_STARTED";
export const DELETE_IMPORT_FULFILLED = "DELETE_IMPORT_FULFILLED";
export const DELETE_IMPORT_REJECTED = "DELETE_IMPORT_REJECTED";

export const IMPORT_INVENTORY_STARTED = "IMPORT_INVENTORY_STARTED";
export const IMPORT_INVENTORY_FULFILLED = "IMPORT_INVENTORY_FULFILLED";
export const IMPORT_INVENTORY_REJECTED = "IMPORT_INVENTORY_REJECTED";

export const IMPORT_ALLINVENTORY_STARTED = "IMPORT_ALLINVENTORY_STARTED";
export const IMPORT_ALLINVENTORY_FULFILLED = "IMPORT_ALLINVENTORY_FULFILLED";
export const IMPORT_ALLINVENTORY_REJECTED = "IMPORT_ALLINVENTORY_REJECTED";

export const FILL_CODE_IMPORT = "FILL_CODE_IMPORT";
export const CLEAR_IMPORT = "CLEAR_IMPORT";
export const INPUT_CAPACITY_IMPORT = "INPUT_CAPACITY_IMPORT";
export const INPUT_COUNT_IMPORT = "INPUT_COUNT_IMPORT";

export const SORT_IMPORT = "SORT_IMPORT";
export const REV_IMPORT = "REV_IMPORT";
export const NEXT_IMPORT = "NEXT_IMPORT";
export const MODIRY_IMPORT = "MODIRY_IMPORT";

export const ADD_IMPORT = "ADD_IMPORT";
export const ADD_IMPORT_MANUAL = "ADD_IMPORT_MANUAL";
export const ADD_CAPACITY_IMPORT = "ADD_CAPACITY_IMPORT";
export const ADD_COUNT_IMPORT = "ADD_COUNT_IMPORT";
export const TRACK_TEXT_IMPORT = "TRACK_TEXT_IMPORT";
export const TRACK_TEXT_MANUAL_IMPORT = "TRACK_TEXT_MANUAL_IMPORT";
export const REMOVE_FORM_IMPORT = "REMOVE_FORM_IMPORT";
export const TRACK_LOCATION_IMPORT = "TRACK_LOCATION_IMPORT";
export const TRACK_LOCATION_SCAN_IMPORT = "TRACK_LOCATION_SCAN_IMPORT";
export const RESET_LOCATION_IMPORT = "RESET_LOCATION_IMPORT";

const WS_URL = URL + "/inventories/";

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

export function importAllInventory(data) {
    return function (dispatch) {
        dispatch({ type: IMPORT_ALLINVENTORY_STARTED });
        return axios.post(WS_URL + "importAllInventory", data)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: IMPORT_ALLINVENTORY_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: IMPORT_ALLINVENTORY_REJECTED, payload: response });
                throw response;
            })
    }
}

export function duplicateImport(data) {
    return function (dispatch) {
        dispatch({ type: DUPLICATE_IMPORT_STARTED });
        return axios.post(WS_URL + "duplicateImport", data)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: DUPLICATE_IMPORT_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: DUPLICATE_IMPORT_REJECTED, payload: response });
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
                dispatch({ type: DELETE_IMPORT_FULFILLED, payload: importData });
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
                dispatch({ type: CHANGE_IMPORT_FULFILLED, payload: importData });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: CHANGE_IMPORT_REJECTED, payload: response });
                throw response;
            })
    }
}

export function approveImport(data) {
    const importData = data.importData;
    return function (dispatch) {
        dispatch({ type: APPROVE_IMPORT_STARTED });
        return axios.put(WS_URL + importData.id + "/approve", null, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: APPROVE_IMPORT_FULFILLED, payload: importData });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: APPROVE_IMPORT_REJECTED, payload: response });
                throw response;
            })
    }
}

export function fillingCode(data){
   return function (dispatch){
       dispatch({ type : FILL_CODE_IMPORT, payload: data})
   }
}

export function clearImport(data){
   return function (dispatch){
       dispatch({ type : CLEAR_IMPORT })
   }
}

export function inputCapacity(data){
   return function (dispatch){
       dispatch({ type : INPUT_CAPACITY_IMPORT, payload: data })
   }
}

export function inputCount(data){
   return function (dispatch){
       dispatch({ type : INPUT_COUNT_IMPORT, payload: data })
   }
}

export function sortImport(data){
   return function (dispatch){
       dispatch({ type : SORT_IMPORT, payload: data})
   }
}

export function reverseImport(){
   return function (dispatch){
       dispatch({ type : REV_IMPORT })
   }
}

export function putNextImport(data){
   return function (dispatch){
       dispatch({ type : NEXT_IMPORT, payload: data })
   }
}

export function modifyImport(data){
   return function (dispatch){
       dispatch({ type : MODIRY_IMPORT, payload: data })
   }
}

export function addToList(data){
   return function (dispatch){
       dispatch({ type : ADD_IMPORT, payload: data })
   }
}

export function addToListManual(data){
   return function (dispatch){
       dispatch({ type : ADD_IMPORT_MANUAL, payload: data })
   }
}

export function addCapacity(data){
   return function (dispatch){
       dispatch({ type : ADD_CAPACITY_IMPORT, payload: data })
   }
}

export function addCount(data){
   return function (dispatch){
       dispatch({ type : ADD_COUNT_IMPORT, payload: data })
   }
}

export function trackText(data){
   return function (dispatch){
       dispatch({ type : TRACK_TEXT_IMPORT, payload: data })
   }
}

export function trackTextManual(data){
   return function (dispatch){
       dispatch({ type : TRACK_TEXT_MANUAL_IMPORT, payload: data })
   }
}

export function trackLocation(data){
   return function (dispatch){
       dispatch({ type : TRACK_LOCATION_IMPORT, payload: data })
   }
}

export function removeForm(data){
   return function (dispatch){
       dispatch({ type : REMOVE_FORM_IMPORT, payload: data })
   }
}

export function resetLocation(){
    return function (dispatch){
        dispatch({ type: RESET_LOCATION_IMPORT })
    }
}

export function trackLocationScan(data){
    return function (dispatch){
        dispatch({ type: TRACK_LOCATION_SCAN_IMPORT, payload: data })
    }
}