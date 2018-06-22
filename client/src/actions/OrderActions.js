import axios from "axios";
import { URL } from "./URL";

export const GET_PENDING_ORDERS_STARTED = "GET_PENDING_ORDERS_STARTED";
export const GET_PENDING_ORDERS_FULFILLED = "GET_PENDING_ORDERS_FULFILLED";
export const GET_PENDING_ORDERS_REJECTED = "GET_PENDING_ORDERS_REJECTED";

export const GET_PROCESSED_ORDERS_STARTED = "GET_PROCESSED_ORDERS_STARTED";
export const GET_PROCESSED_ORDERS_FULFILLED = "GET_PROCESSED_ORDERS_FULFILLED";
export const GET_PROCESSED_ORDERS_REJECTED = "GET_PROCESSED_ORDERS_REJECTED";

export const APPROVE_ORDER_STARTED = "APPROVE_ORDER_STARTED";
export const APPROVE_ORDER_FULFILLED = "APPROVE_ORDER_FULFILLED";
export const APPROVE_ORDER_REJECTED = "APPROVE_ORDER_REJECTED";

export const CHANGE_ORDER_STARTED = "CHANGE_ORDER_STARTED";
export const CHANGE_ORDER_FULFILLED = "CHANGE_ORDER_FULFILLED";
export const CHANGE_ORDER_REJECTED = "CHANGE_ORDER_REJECTED";

export const DELETE_ORDER_STARTED = "DELETE_ORDER_STARTED";
export const DELETE_ORDER_FULFILLED = "DELETE_ORDER_FULFILLED";
export const DELETE_ORDER_REJECTED = "DELETE_ORDER_REJECTED";

export const CANCEL_ORDER_STARTED = "CANCEL_ORDER_STARTED";
export const CANCEL_ORDER_FULFILLED = "CANCEL_ORDER_FULFILLED";
export const CANCEL_ORDER_REJECTED = "CANCEL_ORDER_REJECTED";

export const CHANGE_POPUP = "CHANGE_POPUP";
export const CLOSE_POPUP = "CLOSE_POPUP";
export const TRACK_NUMBER = "TRACK_NUMBER";
export const SET_VIEWING_ORDER = "SET_VIEWING_ORDER";
export const SET_VIEWING_PROCESSED_ORDER = "SET_VIEWING_PROCESSED_ORDER";
export const ERROR_INPUT_ORDER = "ERROR_INPUT_ORDER";
export const SORT_ORDER = "SORT_ORDER";
export const REV_ORDER = "REV_ORDER";
export const FILTER_STATUS = "FILTER_STATUS";
export const FILTER_COMPANY = "FILTER_COMPANY";
export const RENDER_PAGE = "RENDER_PAGE";
export const RECOVER_PAGE = "RECOVER_PAGE";

const WS_URL = URL + "/orders/";

export function getPendingOrders(data) {
    return function (dispatch) {
        dispatch({ type: GET_PENDING_ORDERS_STARTED });
        return axios.get(WS_URL + "all", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_PENDING_ORDERS_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_PENDING_ORDERS_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getPendingOrderByCompany(data) {
    return function (dispatch) {
        dispatch({ type: GET_PENDING_ORDERS_STARTED });
        return axios.get(WS_URL, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_PENDING_ORDERS_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_PENDING_ORDERS_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getProcessedOrders(data) {
    return function (dispatch) {
        dispatch({ type: GET_PROCESSED_ORDERS_STARTED });
        return axios.get(WS_URL + "allProcessedOrders", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_PROCESSED_ORDERS_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_PROCESSED_ORDERS_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getProcessedOrdersByCompany(data) {
    return function (dispatch) {
        dispatch({ type: GET_PROCESSED_ORDERS_STARTED });
        return axios.get(WS_URL + "processedOrders", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_PROCESSED_ORDERS_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_PROCESSED_ORDERS_REJECTED, payload: response });
                throw response;
            })
    }
}

export function approveOrder(data) {
    const id = data.orderId;
    return function (dispatch) {
        dispatch({ type: APPROVE_ORDER_STARTED });
        return axios.put(WS_URL + id + "/approveOrder", null, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: APPROVE_ORDER_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: APPROVE_ORDER_REJECTED, payload: response });
                throw response;
            })
    }
}

export function changeOrder(data) {
    const change = data.change;
    return function (dispatch) {
        dispatch({ type: CHANGE_ORDER_STARTED });
        return axios.put(WS_URL + "changeOrder", data.change, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: CHANGE_ORDER_FULFILLED, payload: {type: "Change" , change: change} });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: CHANGE_ORDER_REJECTED, payload: response });
                throw response;
            })
    }
}

export function deleteItem(data) {
    const item = data.item;
    return function (dispatch) {
        dispatch({ type: CHANGE_ORDER_STARTED });
        return axios.put(WS_URL + "deleteItem", data.item, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: CHANGE_ORDER_FULFILLED, payload: {type: "Delete", item: item} });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: CHANGE_ORDER_REJECTED, payload: response });
                throw response;
            })
    }
}

export function cancelOrder(data) {
    const id = data.orderId;
    return function (dispatch) {
        dispatch({ type: CANCEL_ORDER_STARTED });
        return axios.put(WS_URL + id + "/cancelOrder", null, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: CANCEL_ORDER_FULFILLED, payload: id });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: CANCEL_ORDER_REJECTED, payload: response });
                throw response;
            })
    }
}

export function deleteOrder(data) {
    const id = data.orderId;
    return function (dispatch) {
        dispatch({ type: DELETE_ORDER_STARTED });
        return axios.delete(WS_URL + id, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: DELETE_ORDER_FULFILLED, payload: id });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: DELETE_ORDER_REJECTED, payload: response });
                throw response;
            })
    }
}

export function setViewingOrder(id) {
    return function (dispatch) {
        dispatch({ type: SET_VIEWING_ORDER, payload: id });
    }
}

export function setViewingProcessedOrder(id) {
    return function (dispatch) {
        dispatch({ type: SET_VIEWING_PROCESSED_ORDER, payload: id });
    }
}

export function changePopUp(id){
    return function (dispatch){
        dispatch({ type: CHANGE_POPUP, payload: id });
    }
}

export function closePopUp(){
  return function (dispatch){
      dispatch({ type: CLOSE_POPUP });
  }
}

export function trackNumber(data){
   return function (dispatch){
       dispatch({ type : TRACK_NUMBER, payload: data})
   }
}
export function errorInput(data){
    return function (dispatch) {
        dispatch({type: ERROR_INPUT_ORDER, payload: data});
    }
}

export function sortOrder(data){
   return function (dispatch){
       dispatch({ type : SORT_ORDER, payload: data})
   }
}

export function reverseOrder(){
   return function (dispatch){
       dispatch({ type : REV_ORDER })
   }
}

export function filterStatus(data){
   return function (dispatch){
       dispatch({ type : FILTER_STATUS, payload: data })
   }
}

export function filterCompany(data){
   return function (dispatch){
       dispatch({ type : FILTER_COMPANY, payload: data })
   }
}

export function renderPage(data){
   return function (dispatch){
       dispatch({ type : RENDER_PAGE, payload: data })
   }
}

export function recoverPage(){
   return function (dispatch){
       dispatch({ type : RECOVER_PAGE })
   }
}
