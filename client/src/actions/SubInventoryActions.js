import axios from 'axios';
import { URL } from "./URL";

export const ADD_SUBINVENTORY_STARTED = "ADD_SUBINVENTORY_STARTED";
export const ADD_SUBINVENTORY_FULFILLED = "ADD_SUBINVENTORY_FULFILLED";
export const ADD_SUBINVENTORY_REJECTED = "ADD_SUBINVENTORY_REJECTED";

export const GET_SUBINVENTORIES_STARTED = "GET_SUBINVENTORIES_STARTED";
export const GET_SUBINVENTORIES_FULFILLED = "GET_SUBINVENTORIES_FULFILLED";
export const GET_SUBINVENTORIES_REJECTED = "GET_SUBINVENTORIES_REJECTED";

export const UPDATE_SUBINVENTORY_STARTED = "UPDATE_SUBINVENTORY_STARTED";
export const UPDATE_SUBINVENTORY_FULFILLED = "UPDATE_SUBINVENTORY_FULFILLED";
export const UPDATE_SUBINVENTORY_REJECTED = "UPDATE_SUBINVENTORY_REJECTED";

export const DELETE_SUBINVENTORY_STARTED = "DELETE_SUBINVENTORY_STARTED";
export const DELETE_SUBINVENTORY_FULFILLED = "DELETE_SUBINVENTORY_FULFILLED";
export const DELETE_SUBINVENTORY_REJECTED = "DELETE_SUBINVENTORY_REJECTED";

export const GET_SUBINVENTORIES_TRASH_STARTED = "GET_SUBINVENTORIES_TRASH_STARTED";
export const GET_SUBINVENTORIES_TRASH_FULFILLED = "GET_SUBINVENTORIES_TRASH_FULFILLED";
export const GET_SUBINVENTORIES_TRASH_REJECTED = "GET_SUBINVENTORIES_TRASH_REJECTED";

export const RECOVER_SUBINVENTORY_STARTED = "RECOVER_SUBINVENTORY_STARTED";
export const RECOVER_SUBINVENTORY_FULFILLED = "RECOVER_SUBINVENTORY_FULFILLED";
export const RECOVER_SUBINVENTORY_REJECTED = "RECOVER_SUBINVENTORY_REJECTED";

export const DELETE_SUBINVENTORY_TRASH_STARTED = "DELETE_SUBINVENTORY_TRASH_STARTED";
export const DELETE_SUBINVENTORY_TRASH_FULFILLED = "DELETE_SUBINVENTORY_TRASH_FULFILLED";
export const DELETE_SUBINVENTORY_TRASH_REJECTED = "DELETE_SUBINVENTORY_TRASH_REJECTED";

export const ADD_CART_STARTED = "ADD_CART_STARTED";
export const ADD_CART_FULFILLED = "ADD_CART_FULFILLED";
export const ADD_CART_REJECTED = "ADD_CART_REJECTED";

export const GET_CARTS_STARTED = "GET_CARTS_STARTED";
export const GET_CARTS_FULFILLED = "GET_CARTS_FULFILLED";
export const GET_CARTS_REJECTED = "GET_CARTS_REJECTED";

export const UPDATE_CART_STARTED = "UPDATE_CART_STARTED";
export const UPDATE_CART_FULFILLED = "UPDATE_CART_FULFILLED";
export const UPDATE_CART_REJECTED = "UPDATE_CART_REJECTED";

export const DELETE_CART_STARTED = "DELETE_CART_STARTED";
export const DELETE_CART_FULFILLED = "DELETE_CART_FULFILLED";
export const DELETE_CART_REJECTED = "DELETE_CART_REJECTED";

export const SUBMIT_ORDER_STARTED = "SUBMIT_ORDER_STARTED";
export const SUBMIT_ORDER_FULFILLED = "SUBMIT_ORDER_FULFILLED";
export const SUBMIT_ORDER_REJECTED = "SUBMIT_ORDER_REJECTED";

export const INPUT_SKU = "INPUT_SKU";
export const INPUT_DESC = "INPUT_DESC";
export const FILL_DATA = "FILL_DATA";
export const ERROR_INPUT = "ERROR_INPUT";
export const CLEAR_ERROR = "CLEAR_ERROR";

export const TRACK_NUMBER = "TRACK_NUMBER";
export const OPEN_MODAL = "OPEN_MODAL";
export const CLOSE_MODAL = "CLOSE_MODAL";
export const OPEN_ADD = "OPEN_ADD";
export const CLOSE_ADD = "CLOSE_ADD";

export const SET_UPDATING_SUBINVENTORY_FULFILLED = "SET_UPDATING_SUBINVENTORY_FULFILLED";
export const CLEAR_INVENTORY_FULFILLED = "CLEAR_INVENTORY_FULFILLED";

const WS_URL = URL + "/subInventories/";

const WS_URL_CART = URL + "/carts/"

const WS_URL_ORDER = URL + "/orders/"

export function addSubInventory(data) {
    return function (dispatch) {
        dispatch({ type: ADD_SUBINVENTORY_STARTED });
        return axios.post(WS_URL, data)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: ADD_SUBINVENTORY_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: ADD_SUBINVENTORY_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getSubInventoriesByCompany(data) {
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

export function deleteSubInventory(data) {
    const inventory = data.inventory;
    return function (dispatch) {
        dispatch({ type: DELETE_SUBINVENTORY_STARTED });
        return axios.delete(WS_URL + inventory.id, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: DELETE_SUBINVENTORY_FULFILLED, payload: inventory.id });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: DELETE_SUBINVENTORY_REJECTED, payload: response });
                throw response;
            })
    }
}

export function recoverInventory(data) {
    const inventory = data.inventory;
    return function (dispatch) {
        dispatch({ type: RECOVER_SUBINVENTORY_STARTED });
        return axios.put(WS_URL + inventory.id + "/recover", null, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: RECOVER_SUBINVENTORY_FULFILLED, payload: inventory.id });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: RECOVER_SUBINVENTORY_REJECTED, payload: response });
                throw response;
            })
    }
}

export function addCart(data) {
    return function (dispatch) {
        dispatch({ type: ADD_CART_STARTED });
        return axios.post(WS_URL_CART + "createCart", data)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: ADD_CART_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: ADD_CART_REJECTED, payload: response });
                throw response;
            })
    }
}

export function updateCart(cart) {
    return function (dispatch) {
        dispatch({ type: UPDATE_CART_STARTED });
        return axios.put(WS_URL_CART + "updateCart/" + cart.id, cart)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: UPDATE_CART_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: UPDATE_CART_REJECTED, payload: response });
                throw response;
            })
    }
}

export function deleteCart(cart) {
    return function (dispatch) {
        dispatch({ type: DELETE_CART_STARTED });
        return axios.delete(WS_URL_CART + cart.id, { headers: { Authorization: cart.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: DELETE_CART_FULFILLED, payload: cart });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: DELETE_CART_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getCarts(data) {
    return function (dispatch) {
        dispatch({ type: GET_CARTS_STARTED });
        return axios.get(WS_URL_CART, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_CARTS_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_CARTS_REJECTED, payload: response });
                throw response;
            })
    }
}

export function submitOrder(data) {
    return function (dispatch) {
        dispatch({ type: SUBMIT_ORDER_STARTED });
        return axios.post(WS_URL_ORDER, data)
            .then(function (response){
                return response.data;
            })
            .then(function (data){
                dispatch({ type : SUBMIT_ORDER_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error){
                  const response = error.response;
                  dispatch({ type: SUBMIT_ORDER_REJECTED, payload: response });
                  throw response;
            })
    }
}

export function getInventoriesInTrash(data) {
    return function (dispatch) {
        dispatch({ type: GET_SUBINVENTORIES_TRASH_STARTED });
        return axios.get(WS_URL + "trash", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_SUBINVENTORIES_TRASH_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_SUBINVENTORIES_TRASH_REJECTED, payload: response });
                throw response;
            })
    }
}

export function deleteInventoryInTrash(data) {
    const inventory = data.inventory;
    return function (dispatch) {
        dispatch({ type: DELETE_SUBINVENTORY_TRASH_STARTED });
        return axios.delete(WS_URL + inventory.id + "/trash", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: DELETE_SUBINVENTORY_TRASH_FULFILLED, payload: inventory.id });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: DELETE_SUBINVENTORY_TRASH_REJECTED, payload: response });
                throw response;
            })
    }
}

export function setUpdatingSubInventory(id) {
    return function (dispatch) {
        dispatch({ type: SET_UPDATING_SUBINVENTORY_FULFILLED, payload: id });
    }
}

export function inputSKU(data) {
    return function (dispatch) {
        dispatch({ type: INPUT_SKU, payload: data });
    }
}

export function inputDesc(data) {
    return function (dispatch) {
        dispatch({ type: INPUT_DESC, payload: data });
    }
}

export function fillingData(data){
   return function (dispatch){
       dispatch({ type : FILL_DATA, payload: data})
   }
}

export function errorInput(data){
    return function (dispatch) {
        dispatch({type: ERROR_INPUT, payload: data});
    }
}

export function clearError(){
    return function (dispatch) {
        dispatch({type: CLEAR_ERROR});
    }
}

export function openAdd(id){
    return function (dispatch) {
        dispatch({type: OPEN_ADD, payload: id });
    }
}

export function closeAdd(){
    return function (dispatch) {
        dispatch({type: CLOSE_ADD });
    }
}

export function trackNumber(data){
   return function (dispatch){
       dispatch({ type : TRACK_NUMBER, payload: data})
   }
}

export function showModal(data){
    return function (dispatch) {
        dispatch({type: OPEN_MODAL, payload: data });
    }
}

export function closeModal(){
    return function (dispatch) {
        dispatch({type: CLOSE_MODAL });
    }
}

export function clearInventory() {
    return function (dispatch) {
        dispatch({ type: CLEAR_INVENTORY_FULFILLED });
    }
}
