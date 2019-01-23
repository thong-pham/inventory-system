import axios from "axios";
import { URL } from "./URL";

export const ADD_LOCATION_STARTED = "ADD_LOCATION_STARTED";
export const ADD_LOCATION_FULFILLED = "ADD_LOCATION_FULFILLED";
export const ADD_LOCATION_REJECTED = "ADD_LOCATION_REJECTED";

export const GET_LOCATIONS_STARTED = "GET_LOCATIONS_STARTED";
export const GET_LOCATIONS_FULFILLED = "GET_LOCATIONS_FULFILLED";
export const GET_LOCATIONS_REJECTED = "GET_LOCATIONS_REJECTED";

export const DELETE_LOCATION_STARTED = "DELETE_LOCATION_STARTED";
export const DELETE_LOCATION_FULFILLED = "DELETE_LOCATION_FULFILLED";
export const DELETE_LOCATION_REJECTED = "DELETE_LOCATION_REJECTED";

export const GET_PENDING_LOCATIONS_STARTED = "GET_PENDING_LOCATIONS_STARTED";
export const GET_PENDING_LOCATIONS_FULFILLED = "GET_PENDING_LOCATIONS_FULFILLED";
export const GET_PENDING_LOCATIONS_REJECTED = "GET_PENDING_LOCATIONS_REJECTED";

export const APPROVE_LOCATION_STARTED = "APPROVE_LOCATION_STARTED";
export const APPROVE_LOCATION_FULFILLED = "APPROVE_LOCATION_FULFILLED";
export const APPROVE_LOCATION_REJECTED = "APPROVE_LOCATION_REJECTED";

export const UPDATE_LOCATION_STARTED = "UPDATE_LOCATION_STARTED";
export const UPDATE_LOCATION_FULFILLED = "UPDATE_LOCATION_FULFILLED";
export const UPDATE_LOCATION_REJECTED = "UPDATE_LOCATION_REJECTED";

export const MOVE_PRODUCT_STARTED = "MOVE_PRODUCT_STARTED";
export const MOVE_PRODUCT_FULFILLED = "MOVE_PRODUCT_FULFILLED"
export const MOVE_PRODUCT_REJECTED = "MOVE_PRODUCT_REJECTED"

export const SET_UPDATING_LOCATION_FULFILLED = "SET_UPDATING_LOCATION_FULFILLED";

export const CHANGE_LOCATION = "CHANGE_LOCATION";
export const CANCEL_CHANGE = "CANCEL_CHANGE";
export const TRACK_LOCATION = "TRACK_LOCATION";
export const ERROR_INPUT_LOCATION = "ERROR_INPUT_LOCATION";
export const CHANGE_PRODUCT_LOCATION = "CHANGE_PRODUCT_LOCATION";
export const CANCEL_LOCATION_CHANGE = "CANCEL_LOCATION_CHANGE";
export const TRACK_NEW_LOCATION = "TRACK_NEW_LOCATION";
export const TRACK_NEW_QUANTITY = "TRACK_NEW_QUANTITY";

const WS_URL = URL + "/locations/";

export function addLocation(data) {
    return function (dispatch) {
        dispatch({ type: ADD_LOCATION_STARTED });
        return axios.post(WS_URL + "createLocation", data)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: ADD_LOCATION_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: ADD_LOCATION_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getLocations(data) {
    return function (dispatch) {
        dispatch({ type: GET_LOCATIONS_STARTED });
        return axios.get(WS_URL, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_LOCATIONS_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_LOCATIONS_REJECTED, payload: response });
                throw response;
            })
    }
}

export function deleteLocation(data) {
    const location = data.location;
    return function (dispatch) {
        dispatch({ type: DELETE_LOCATION_STARTED });
        return axios.delete(WS_URL + location.id, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: DELETE_LOCATION_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: DELETE_LOCATION_REJECTED, payload: response });
                throw response;
            })
    }
}

export function editLocation(location) {
    return function (dispatch) {
        dispatch({ type: UPDATE_LOCATION_STARTED });
        return axios.put(WS_URL + location.id, location)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: UPDATE_LOCATION_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: UPDATE_LOCATION_REJECTED, payload: response });
                throw response;
            })
    }
}

export function moveProduct(data) {
    return function (dispatch) {
        dispatch({ type: MOVE_PRODUCT_STARTED });
        return axios.put(WS_URL + 'moveProduct/' + data.location_id, data, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                console.log(data);
                dispatch({ type: MOVE_PRODUCT_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: MOVE_PRODUCT_REJECTED, payload: response });
                throw response;
            })
    }
}

export function setUpdatingLocation(id) {
    return function (dispatch) {
        dispatch({ type: SET_UPDATING_LOCATION_FULFILLED, payload: id });
    }
}

export function triggerChange(data) {
    return function (dispatch) {
        dispatch({ type: CHANGE_LOCATION, payload: data });
    }
}
export function cancelChange() {
    return function (dispatch) {
        dispatch({ type: CANCEL_CHANGE });
    }
}

export function trackLocation(data) {
    return function (dispatch) {
        dispatch({ type: TRACK_LOCATION, payload: data });
    }
}

export function errorInput(data) {
    return function (dispatch) {
        dispatch({ type: ERROR_INPUT_LOCATION, payload: data });
    }
}

export function changeProductLocation (data) {
    return function(dispatch) {
        dispatch({ type: CHANGE_PRODUCT_LOCATION, payload: data });
    }
}

export function cancelLocationChange () {
    return function(dispatch){
        dispatch({ type: CANCEL_LOCATION_CHANGE })
    }
}

export function trackNewLocation (data) {
    return function(dispatch){
        dispatch({ type: TRACK_NEW_LOCATION, payload: data })
    }
}

export function trackQuantity (data) {
    return function(dispatch){
        dispatch({ type: TRACK_NEW_QUANTITY, payload: data })
    }
}



