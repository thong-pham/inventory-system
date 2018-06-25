import axios from "axios";
import { URL } from "./URL";

export const GET_PENDING_EXPORTS_STARTED = "GET_PENDING_EXPORTS_STARTED";
export const GET_PENDING_EXPORTS_FULFILLED = "GET_PENDING_EXPORTS_FULFILLED";
export const GET_PENDING_EXPORTS_REJECTED = "GET_PENDING_EXPORTS_REJECTED";

export const GET_APPROVED_EXPORTS_STARTED = "GET_APPROVED_EXPORTS_STARTED";
export const GET_APPROVED_EXPORTS_FULFILLED = "GET_APPROVED_EXPORTS_FULFILLED";
export const GET_APPROVED_EXPORTS_REJECTED = "GET_APPROVED_EXPORTS_REJECTED";

export const APPROVE_EXPORT_STARTED = "APPROVE_EXPORT_STARTED";
export const APPROVE_EXPORT_FULFILLED = "APPROVE_EXPORT_FULFILLED";
export const APPROVE_EXPORT_REJECTED = "APPROVE_EXPORT_REJECTED";

export const CHANGE_EXPORT_STARTED = "CHANGE_EXPORT_STARTED";
export const CHANGE_EXPORT_FULFILLED = "CHANGE_EXPORT_FULFILLED";
export const CHANGE_EXPORT_REJECTED = "CHANGE_EXPORT_REJECTED";

export const DUPLICATE_EXPORT_STARTED = "DUPLICATE_EXPORT_STARTED";
export const DUPLICATE_EXPORT_FULFILLED = "DUPLICATE_EXPORT_FULFILLED";
export const DUPLICATE_EXPORT_REJECTED = "DUPLICATE_EXPORT_REJECTED";

export const DELETE_EXPORT_STARTED = "DELETE_EXPORT_STARTED";
export const DELETE_EXPORT_FULFILLED = "DELETE_EXPORT_FULFILLED";
export const DELETE_EXPORT_REJECTED = "DELETE_EXPORT_REJECTED";

export const EXPORT_INVENTORY_STARTED = "EXPORT_INVENTORY_STARTED";
export const EXPORT_INVENTORY_FULFILLED = "EXPORT_INVENTORY_FULFILLED";
export const EXPORT_INVENTORY_REJECTED = "EXPORT_INVENTORY_REJECTED";

export const FILL_CODE_EXPORT = "FILL_CODE_EXPORT";
export const CLEAR_EXPORT = "CLEAR_EXPORT";
export const INPUT_CAPACITY_EXPORT = "INPUT_CAPACITY_EXPORT";
export const INPUT_COUNT_EXPORT = "INPUT_COUNT_EXPORT";

export const SORT_EXPORT = "SORT_EXPORT";
export const REV_EXPORT = "REV_EXPORT";
export const NEXT_EXPORT = "NEXT_EXPORT";
export const MODIRY_EXPORT = "MODIRY_EXPORT";

export const ADD_EXPORT = "ADD_EXPORT";
export const ADD_CAPACITY_EXPORT = "ADD_CAPACITY_EXPORT";
export const ADD_COUNT_EXPORT = "ADD_COUNT_EXPORT";
export const TRACK_TEXT_EXPORT = "TRACK_TEXT_EXPORT";
export const REMOVE_FORM_EXPORT = "REMOVE_FORM_EXPORT";

const WS_URL = URL + "/inventories/";

export function getPendingExports(data) {
    return function (dispatch) {
        dispatch({ type: GET_PENDING_EXPORTS_STARTED });
        return axios.get(WS_URL + "pendingExports", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_PENDING_EXPORTS_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_PENDING_EXPORTS_REJECTED, payload: response });
                throw response;
            })
    }
}

export function exportInventory(data) {
    return function (dispatch) {
        dispatch({ type: EXPORT_INVENTORY_STARTED });
        return axios.post(WS_URL + "exportInventory", data)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: EXPORT_INVENTORY_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: EXPORT_INVENTORY_REJECTED, payload: response });
                throw response;
            })
    }
}

export function approveExport(data) {
    const exportData = data.exportData;
    return function (dispatch) {
        dispatch({ type: APPROVE_EXPORT_STARTED });
        return axios.put(WS_URL + exportData.id + "/approveOut", null, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: APPROVE_EXPORT_FULFILLED, payload: exportData });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: APPROVE_EXPORT_REJECTED, payload: response });
                throw response;
            })
    }
}

export function duplicateExport(data) {
    return function (dispatch) {
        dispatch({ type: DUPLICATE_EXPORT_STARTED });
        return axios.post(WS_URL + "duplicateExport", data)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: DUPLICATE_EXPORT_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: DUPLICATE_EXPORT_REJECTED, payload: response });
                throw response;
            })
    }
}

export function deleteExport(data) {
    const exportData = data.exportData;
    return function (dispatch) {
        dispatch({ type: DELETE_EXPORT_STARTED });
        return axios.delete(WS_URL + exportData.id + "/export", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: DELETE_EXPORT_FULFILLED, payload: exportData });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: DELETE_EXPORT_REJECTED, payload: response });
                throw response;
            })
    }
}

export function updateExport(exportData) {
    return function (dispatch) {
        dispatch({ type: CHANGE_EXPORT_STARTED });
        return axios.put(WS_URL + exportData.id + "/export", exportData)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: CHANGE_EXPORT_FULFILLED, payload: exportData });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: CHANGE_EXPORT_REJECTED, payload: response });
                throw response;
            })
    }
}

export function fillingCode(data){
   return function (dispatch){
       dispatch({ type : FILL_CODE_EXPORT, payload: data})
   }
}

export function clearExport(data){
   return function (dispatch){
       dispatch({ type : CLEAR_EXPORT })
   }
}

export function inputCapacity(data){
   return function (dispatch){
       dispatch({ type : INPUT_CAPACITY_EXPORT, payload: data })
   }
}

export function inputCount(data){
   return function (dispatch){
       dispatch({ type : INPUT_COUNT_EXPORT, payload: data })
   }
}

export function sortExport(data){
   return function (dispatch){
       dispatch({ type : SORT_EXPORT, payload: data})
   }
}

export function reverseExport(){
   return function (dispatch){
       dispatch({ type : REV_EXPORT })
   }
}

export function putNextExport(data){
   return function (dispatch){
       dispatch({ type : NEXT_EXPORT, payload: data })
   }
}

export function modifyExport(data){
   return function (dispatch){
       dispatch({ type : MODIRY_EXPORT, payload: data })
   }
}

export function addToList(data){
   return function (dispatch){
       dispatch({ type : ADD_EXPORT, payload: data })
   }
}

export function addCapacity(data){
   return function (dispatch){
       dispatch({ type : ADD_CAPACITY_EXPORT, payload: data })
   }
}

export function addCount(data){
   return function (dispatch){
       dispatch({ type : ADD_COUNT_EXPORT, payload: data })
   }
}

export function trackText(data){
   return function (dispatch){
       dispatch({ type : TRACK_TEXT_EXPORT, payload: data })
   }
}

export function removeForm(data){
   return function (dispatch){
       dispatch({ type : REMOVE_FORM_EXPORT, payload: data })
   }
}
