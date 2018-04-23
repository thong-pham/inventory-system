import axios from 'axios';

export const GET_SUBINVENTORIES_STARTED = "GET_SUBINVENTORIES_STARTED";
export const GET_SUBINVENTORIES_FULFILLED = "GET_SUBINVENTORIES_FULFILLED";
export const GET_SUBINVENTORIES_REJECTED = "GET_SUBINVENTORIES_REJECTED";

export const UPDATE_SUBINVENTORY_STARTED = "UPDATE_SUBINVENTORY_STARTED";
export const UPDATE_SUBINVENTORY_FULFILLED = "UPDATE_SUBINVENTORY_FULFILLED";
export const UPDATE_SUBINVENTORY_REJECTED = "UPDATE_SUBINVENTORY_REJECTED";

export const SET_UPDATING_SUBINVENTORY_FULFILLED = "SET_UPDATING_SUBINVENTORY_FULFILLED";

const WS_URL = "https://chakir-inventory-1808761996.us-east-1.elb.amazonaws.com/subInventories/";

export function getSubInventoriesByCompany(data) {
    return function (dispatch) {
        dispatch({ type: GET_SUBINVENTORIES_STARTED });
        return axios.get(WS_URL + "sub", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_SUBINVENTORIES_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_SUBINVENTORIES_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getSubInventories(data) {
    return function (dispatch) {
        dispatch({ type: GET_SUBINVENTORIES_STARTED });
        return axios.get(WS_URL, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_SUBINVENTORIES_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_SUBINVENTORIES_REJECTED, payload: response });
                throw response;
            })
    }
}

export function updateSubInventory(inventory) {
    return function (dispatch) {
        dispatch({ type: UPDATE_SUBINVENTORY_STARTED });
        return axios.put(WS_URL + inventory.id, inventory)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: UPDATE_SUBINVENTORY_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: UPDATE_SUBINVENTORY_REJECTED, payload: response });
                throw response;
            })
    }
}

export function setUpdatingSubInventory(id) {
    return function (dispatch) {
        dispatch({ type: SET_UPDATING_SUBINVENTORY_FULFILLED, payload: id });
    }
}
