import axios from "axios";

export const SET_REQUESTING_INVENTORY_FULFILLED = "SET_REQUESTING_INVENTORY_FULFILLED";

export const REQUEST_INVENTORY_STARTED = "REQUEST_INVENTORY_STARTED";
export const REQUEST_INVENTORY_FULFILLED = "REQUEST_INVENTORY_FULFILLED";
export const REQUEST_INVENTORY_REJECTED = "REQUEST_INVENTORY_REJECTED";

export const GET_PENDING_REQUESTS_STARTED = "GET_PENDING_REQUESTS_STARTED";
export const GET_PENDING_REQUESTS_FULFILLED = "GET_PENDING_REQUESTS_FULFILLED";
export const GET_PENDING_REQUESTS_REJECTED = "GET_PENDING_REQUESTS_REJECTED";

export const APPROVE_REQUEST_STARTED = "APPROVE_REQUEST_STARTED";
export const APPROVE_REQUEST_FULFILLED = "APPROVE_REQUEST_FULFILLED";
export const APPROVE_REQUEST_REJECTED = "APPROVE_REQUEST_REJECTED";

const WS_URL = "http://localhost:3000/requests/";

export function setRequestingInventory(id) {
    return function (dispatch) {
        dispatch({ type: SET_REQUESTING_INVENTORY_FULFILLED, payload: id });
    }
}

export function requestInventory(data) {
    return function (dispatch) {
        dispatch({ type: REQUEST_INVENTORY_STARTED });
        return axios.post(WS_URL + "requestInventory", data)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: REQUEST_INVENTORY_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: REQUEST_INVENTORY_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getPendingRequests(data) {
    return function (dispatch) {
        dispatch({ type: GET_PENDING_REQUESTS_STARTED });
        return axios.get(WS_URL + "pendingRequests", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_PENDING_REQUESTS_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_PENDING_REQUESTS_REJECTED, payload: response });
                throw response;
            })
    }
}

export function approveRequest(data) {
    const request = data.request;
    return function (dispatch) {
        dispatch({ type: APPROVE_REQUEST_STARTED });
        return axios.put(WS_URL + request.id + "/approveRequest", null, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: APPROVE_REQUEST_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: APPROVE_REQUEST_REJECTED, payload: response });
                throw response;
            })
    }
}
