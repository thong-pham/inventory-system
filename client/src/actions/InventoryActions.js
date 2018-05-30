import axios from "axios";
import { URL } from "./URL";

export const ADD_INVENTORY_STARTED = "ADD_INVENTORY_STARTED";
export const ADD_INVENTORY_FULFILLED = "ADD_INVENTORY_FULFILLED";
export const ADD_INVENTORY_REJECTED = "ADD_INVENTORY_REJECTED";

export const GET_INVENTORIES_STARTED = "GET_INVENTORIES_STARTED";
export const GET_INVENTORIES_FULFILLED = "GET_INVENTORIES_FULFILLED";
export const GET_INVENTORIES_REJECTED = "GET_INVENTORIES_REJECTED";

export const DELETE_INVENTORY_STARTED = "DELETE_INVENTORY_STARTED";
export const DELETE_INVENTORY_FULFILLED = "DELETE_INVENTORY_FULFILLED";
export const DELETE_INVENTORY_REJECTED = "DELETE_INVENTORY_REJECTED";

export const DELETE_INVENTORY_TRASH_STARTED = "DELETE_INVENTORY_TRASH_STARTED";
export const DELETE_INVENTORY_TRASH_FULFILLED = "DELETE_INVENTORY_TRASH_FULFILLED";
export const DELETE_INVENTORY_TRASH_REJECTED = "DELETE_INVENTORY_TRASH_REJECTED";

export const GET_INVENTORIES_TRASH_STARTED = "GET_INVENTORIES_TRASH_STARTED";
export const GET_INVENTORIES_TRASH_FULFILLED = "GET_INVENTORIES_TRASH_FULFILLED";
export const GET_INVENTORIES_TRASH_REJECTED = "GET_INVENTORIES_TRASH_REJECTED";

export const APPROVE_INVENTORY_STARTED = "APPROVE_INVENTORY_STARTED";
export const APPROVE_INVENTORY_FULFILLED = "APPROVE_INVENTORY_FULFILLED";
export const APPROVE_INVENTORY_REJECTED = "APPROVE_INVENTORY_REJECTED";

export const RECOVER_INVENTORY_STARTED = "RECOVER_INVENTORY_STARTED";
export const RECOVER_INVENTORY_FULFILLED = "RECOVER_INVENTORY_FULFILLED";
export const RECOVER_INVENTORY_REJECTED = "RECOVER_INVENTORY_REJECTED";

export const UPDATE_INVENTORY_STARTED = "UPDATE_INVENTORY_STARTED";
export const UPDATE_INVENTORY_FULFILLED = "UPDATE_INVENTORY_FULFILLED";
export const UPDATE_INVENTORY_REJECTED = "UPDATE_INVENTORY_REJECTED";

export const SET_UPDATING_INVENTORY_FULFILLED = "SET_UPDATING_INVENTORY_FULFILLED";
export const CLEAR_INVENTORY_FULFILLED = "CLEAR_INVENTORY_FULFILLED";
export const REJECT_UPDATING_INVENTORY = "REJECT_UPDATING_INVENTORY";

export const TRACK_NUMBER = "TRACK_NUMBER";
export const OPEN_MINUS = "OPEN_MINUS";
export const CLOSE_MINUS = "CLOSE_MINUS";
export const OPEN_PLUS = "OPEN_PLUS";
export const CLOSE_PLUS = "CLOSE_PLUS";
export const ERROR_INPUT = "ERROR_INPUT";
export const FILL_DATA = "FILL_DATA";
export const FILTER_INVENTORY = "FILTER_INVENTORY";
export const SORT_INVENTORY = "SORT_INVENTORY";
export const REV_INVENTORY = "REV_INVENTORY";
export const CHANGE_INVENTORY = "CHANGE_INVENTORY";

export const CLEAR_FAIL = "CLEAR_FAIL";
export const CLEAR_COMPLETE = "CLEAR_COMPLETE";

const WS_URL = URL + "/inventories/";

export function addInventory(data) {
    return function (dispatch) {
        dispatch({ type: ADD_INVENTORY_STARTED });
        return axios.post(WS_URL, data)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: ADD_INVENTORY_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: ADD_INVENTORY_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getInventories(data) {
    return function (dispatch) {
        dispatch({ type: GET_INVENTORIES_STARTED });
        return axios.get(WS_URL, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_INVENTORIES_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_INVENTORIES_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getInventoriesInTrash(data) {
    return function (dispatch) {
        dispatch({ type: GET_INVENTORIES_TRASH_STARTED });
        return axios.get(WS_URL + "trash", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_INVENTORIES_TRASH_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_INVENTORIES_TRASH_REJECTED, payload: response });
                throw response;
            })
    }
}

export function approveInventory(data) {
    const importData = data.importData;
    return function (dispatch) {
        dispatch({ type: APPROVE_INVENTORY_STARTED });
        return axios.put(WS_URL + importData.id + "/approve", null, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: APPROVE_INVENTORY_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: APPROVE_INVENTORY_REJECTED, payload: response });
                throw response;
            })
    }
}

export function deleteInventory(data) {
    const inventory = data.inventory;
    return function (dispatch) {
        dispatch({ type: DELETE_INVENTORY_STARTED });
        return axios.delete(WS_URL + inventory.id, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: DELETE_INVENTORY_FULFILLED, payload: inventory.id });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: DELETE_INVENTORY_REJECTED, payload: response });
                throw response;
            })
    }
}

export function updateInventory(inventory) {
    return function (dispatch) {
        dispatch({ type: UPDATE_INVENTORY_STARTED });
        return axios.put(WS_URL + inventory.id, inventory)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: UPDATE_INVENTORY_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: UPDATE_INVENTORY_REJECTED, payload: response });
                throw response;
            })
    }
}

export function recoverInventory(data) {
    const inventory = data.inventory;
    return function (dispatch) {
        dispatch({ type: RECOVER_INVENTORY_STARTED });
        return axios.put(WS_URL + inventory.id + "/recover", null, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: RECOVER_INVENTORY_FULFILLED, payload: inventory.id });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: RECOVER_INVENTORY_REJECTED, payload: response });
                throw response;
            })
    }
}

export function deleteInventoryInTrash(data) {
    const inventory = data.inventory;
    return function (dispatch) {
        dispatch({ type: DELETE_INVENTORY_TRASH_STARTED });
        return axios.delete(WS_URL + inventory.id + "/trash", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: DELETE_INVENTORY_TRASH_FULFILLED, payload: inventory.id });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: DELETE_INVENTORY_TRASH_REJECTED, payload: response });
                throw response;
            })
    }
}


export function setUpdatingInventory(id) {
    return function (dispatch) {
        dispatch({ type: SET_UPDATING_INVENTORY_FULFILLED, payload: id });
    }
}

export function clearInventory() {
    return function (dispatch) {
        dispatch({ type: CLEAR_INVENTORY_FULFILLED });
    }
}

export function errorInput(data){
    return function (dispatch) {
        dispatch({type: ERROR_INPUT, payload: data});
    }
}

export function openMinus(id){
    return function (dispatch) {
        dispatch({type: OPEN_MINUS, payload: id });
    }
}

export function closeMinus(){
    return function (dispatch) {
        dispatch({type: CLOSE_MINUS });
    }
}

export function openPlus(id){
    return function (dispatch) {
        dispatch({type: OPEN_PLUS, payload: id });
    }
}

export function closePlus(){
    return function (dispatch) {
        dispatch({type: CLOSE_PLUS });
    }
}

export function trackNumber(data){
   return function (dispatch){
       dispatch({ type : TRACK_NUMBER, payload: data})
   }
}

export function rejectEdit(){
    return function (dispatch){
        const data = "Only Mother Company can edit Inventory";
        dispatch({ type : REJECT_UPDATING_INVENTORY, payload : data});
    }
}

export function fillingData(data){
   return function (dispatch){
       dispatch({ type : FILL_DATA, payload: data})
   }
}

export function filterInventory(data){
   return function (dispatch){
       dispatch({ type : FILTER_INVENTORY, payload: data})
   }
}

export function sortInventory(data){
   return function (dispatch){
       dispatch({ type : SORT_INVENTORY, payload: data})
   }
}

export function reverseInventory(){
   return function (dispatch){
       dispatch({ type : REV_INVENTORY })
   }
}

export function changeInventory(data){
    return function (dispatch){
        dispatch({ type : CHANGE_INVENTORY, payload: data })
    }
 }

export function clearFailedProducts(){
   return function (dispatch){
       dispatch({ type : CLEAR_FAIL })
   }
}

export function clearCompletedProducts(){
   return function (dispatch){
       dispatch({ type : CLEAR_COMPLETE })
   }
}
