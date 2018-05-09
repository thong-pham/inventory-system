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
