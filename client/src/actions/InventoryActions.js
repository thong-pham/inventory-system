import axios from "axios";

export const ADD_INVENTORY_STARTED = "ADD_INVENTORY_STARTED";
export const ADD_INVENTORY_FULFILLED = "ADD_INVENTORY_FULFILLED";
export const ADD_INVENTORY_REJECTED = "ADD_INVENTORY_REJECTED";

export const GET_INVENTORIES_STARTED = "GET_INVENTORIES_STARTED";
export const GET_INVENTORIES_FULFILLED = "GET_INVENTORIES_FULFILLED";
export const GET_INVENTORIES_REJECTED = "GET_INVENTORIES_REJECTED";

export const DELETE_INVENTORY_STARTED = "DELETE_INVENTORY_STARTED";
export const DELETE_INVENTORY_FULFILLED = "DELETE_INVENTORY_FULFILLED";
export const DELETE_INVENTORY_REJECTED = "DELETE_INVENTORY_REJECTED";

export const GET_PENDING_INVENTORIES_STARTED = "GET_PENDING_INVENTORIES_STARTED";
export const GET_PENDING_INVENTORIES_FULFILLED = "GET_PENDING_INVENTORIES_FULFILLED";
export const GET_PENDING_INVENTORIES_REJECTED = "GET_PENDING_INVENTORIES_REJECTED";

export const APPROVE_INVENTORY_STARTED = "APPROVE_INVENTORY_STARTED";
export const APPROVE_INVENTORY_FULFILLED = "APPROVE_INVENTORY_FULFILLED";
export const APPROVE_INVENTORY_REJECTED = "APPROVE_INVENTORY_REJECTED";

export const UPDATE_INVENTORY_STARTED = "UPDATE_INVENTORY_STARTED";
export const UPDATE_INVENTORY_FULFILLED = "UPDATE_INVENTORY_FULFILLED";
export const UPDATE_INVENTORY_REJECTED = "UPDATE_INVENTORY_REJECTED";

export const SET_UPDATING_INVENTORY_FULFILLED = "SET_UPDATING_INVENTORY_FULFILLED";

export const REJECT_UPDATING_INVENTORY = "REJECT_UPDATING_INVENTORY";

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

export const TRACK_NUMBER = "TRACK_NUMBER";
export const OPEN_MODAL = "OPEN_MODAL";
export const CLOSE_MODAL = "CLOSE_MODAL";
export const OPEN_ADD = "OPEN_ADD";
export const CLOSE_ADD = "CLOSE_ADD";
export const ERROR_INPUT = "ERROR_INPUT";

export const SUBMIT_ORDER_STARTED = "SUBMIT_ORDER_STARTED";
export const SUBMIT_ORDER_FULFILLED = "SUBMIT_ORDER_FULFILLED";
export const SUBMIT_ORDER_REJECTED = "SUBMIT_ORDER_REJECTED";

const WS_URL = "http://34.238.40.177:3000/inventories/";

const WS_URL_CART = "http://34.238.40.177:3000/carts/"

const WS_URL_ORDER = "http://34.238.40.177:3000/orders/"

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

export function getPendingInventories(data) {
    return function (dispatch) {
        dispatch({ type: GET_PENDING_INVENTORIES_STARTED });
        return axios.get(WS_URL + "pending", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_PENDING_INVENTORIES_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_PENDING_INVENTORIES_REJECTED, payload: response });
                throw response;
            })
    }
}

export function approveInventory(data) {
    const inventory = data.inventory;
    return function (dispatch) {
        dispatch({ type: APPROVE_INVENTORY_STARTED });
        return axios.put(WS_URL + inventory.id + "/approve", null, { headers: { Authorization: data.token } })
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
                dispatch({ type: DELETE_INVENTORY_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: DELETE_INVENTORY_REJECTED, payload: response });
                throw response;
            })
    }
}

export function setUpdatingInventory(id) {
    return function (dispatch) {
        dispatch({ type: SET_UPDATING_INVENTORY_FULFILLED, payload: id });
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

export function rejectEdit(){
    return function (dispatch){
        const data = "Only Mother Company can edit Inventory";
        dispatch({ type : REJECT_UPDATING_INVENTORY, payload : data});
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

export function showModal(data){
    return function (dispatch) {
        dispatch({type: OPEN_MODAL, payload: data });
    }
}

export function errorInput(){
    return function (dispatch) {
        dispatch({type: ERROR_INPUT});
    }
}


export function closeModal(){
    return function (dispatch) {
        dispatch({type: CLOSE_MODAL });
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
