import axios from "axios";

export const GET_PENDING_ORDERS_STARTED = "GET_PENDING_ORDERS_STARTED";
export const GET_PENDING_ORDERS_FULFILLED = "GET_PENDING_ORDERS_FULFILLED";
export const GET_PENDING_ORDERS_REJECTED = "GET_PENDING_ORDERS_REJECTED";

export const GET_APPROVED_ORDERS_STARTED = "GET_APPROVED_ORDERS_STARTED";
export const GET_APPROVED_ORDERS_FULFILLED = "GET_APPROVED_ORDERS_FULFILLED";
export const GET_APPROVED_ORDERS_REJECTED = "GET_APPROVED_ORDERS_REJECTED";

export const APPROVE_ORDER_STARTED = "APPROVE_ORDER_STARTED";
export const APPROVE_ORDER_FULFILLED = "APPROVE_ORDER_FULFILLED";
export const APPROVE_ORDER_REJECTED = "APPROVE_ORDER_REJECTED";

export const CHANGE_ORDER_STARTED = "CHANGE_ORDER_STARTED";
export const CHANGE_ORDER_FULFILLED = "CHANGE_ORDER_FULFILLED";
export const CHANGE_ORDER_REJECTED = "CHANGE_ORDER_REJECTED";

export const DELETE_ORDER_STARTED = "DELETE_ORDER_STARTED";
export const DELETE_ORDER_FULFILLED = "DELETE_ORDER_FULFILLED";
export const DELETE_ORDER_REJECTED = "DELETE_ORDER_REJECTED";

export const CHANGE_POPUP = "CHANGE_POPUP";
export const CLOSE_POPUP = "CLOSE_POPUP";
export const TRACK_NUMBER = "TRACK_NUMBER";
export const SET_VIEWING_ORDER = "SET_VIEWING_ORDER";
export const ERROR_INPUT_ORDER = "ERROR_INPUT_ORDER";

const WS_URL = "https://api.israhospitality.com/orders/";

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

export function getApprovedOrders(data) {
    return function (dispatch) {
        dispatch({ type: GET_APPROVED_ORDERS_STARTED });
        return axios.get(WS_URL + "allApprovedOrders", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_APPROVED_ORDERS_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_APPROVED_ORDERS_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getApprovedOrdersByCompany(data) {
    return function (dispatch) {
        dispatch({ type: GET_APPROVED_ORDERS_STARTED });
        return axios.get(WS_URL + "approvedOrders", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_APPROVED_ORDERS_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_APPROVED_ORDERS_REJECTED, payload: response });
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

export function approveOrder(orderData) {
    const order = orderData.order;
    return function (dispatch) {
        dispatch({ type: APPROVE_ORDER_STARTED });
        return axios.put(WS_URL + order.id + "/approveOrder", null, { headers: { Authorization: orderData.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: APPROVE_ORDER_FULFILLED, payload: orderData.order });
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
    //const id = data.orderId;
    return function (dispatch) {
        dispatch({ type: CHANGE_ORDER_STARTED });
        return axios.put(WS_URL + "changeOrder", data.change, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: CHANGE_ORDER_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: CHANGE_ORDER_REJECTED, payload: response });
                throw response;
            })
    }
}

export function deleteOrder(data) {
    const order = data.order;
    return function (dispatch) {
        dispatch({ type: DELETE_ORDER_STARTED });
        return axios.delete(WS_URL + order.id, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: DELETE_ORDER_FULFILLED, payload: data });
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
