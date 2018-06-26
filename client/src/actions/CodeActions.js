import axios from "axios";
import { URL } from "./URL";

export const GET_CODES_STARTED = "GET_CODES_STARTED";
export const GET_CODES_FULFILLED = "GET_CODES_FULFILLED";
export const GET_CODES_REJECTED = "GET_CODES_REJECTED";

export const GET_ALLCODE_STARTED = "GET_ALLCODE_STARTED";
export const GET_ALLCODE_FULFILLED = "GET_ALLCODE_FULFILLED";
export const GET_ALLCODE_REJECTED = "GET_ALLCODE_REJECTED";

export const APPROVE_CODE_STARTED = "APPROVE_CODE_STARTED";
export const APPROVE_CODE_FULFILLED = "APPROVE_CODE_FULFILLED";
export const APPROVE_CODE_REJECTED = "APPROVE_CODE_REJECTED";

export const ADD_CODE_STARTED = "ADD_CODE_STARTED";
export const ADD_CODE_FULFILLED = "ADD_CODE_FULFILLED";
export const ADD_CODE_REJECTED = "ADD_CODE_REJECTED";

export const DELETE_CODE_STARTED = "DELETE_CODE_STARTED";
export const DELETE_CODE_FULFILLED = "DELETE_CODE_FULFILLED";
export const DELETE_CODE_REJECTED = "DELETE_CODE_REJECTED";

export const ADD_POPUP = "ADD_POPUP";
export const CLOSE_POPUP = "CLOSE_POPUP";
export const TRACK_INPUT = "TRACK_INPUT";
export const ERROR_INPUT_CODE = "ERROR_INPUT_CODE";

const WS_URL = URL + "/code/";

export function getAllCode(data) {
    return function (dispatch) {
        dispatch({ type: GET_CODES_STARTED });
        return axios.get(WS_URL, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_CODES_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_CODES_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getCodes(data) {
    return function (dispatch) {
        dispatch({ type: GET_ALLCODE_STARTED });
        return axios.get(WS_URL + "codes", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_ALLCODE_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_ALLCODE_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getCodeByCompany(data) {
    return function (dispatch) {
        dispatch({ type: GET_CODES_STARTED });
        return axios.get(WS_URL + "company", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_CODES_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_CODES_REJECTED, payload: response });
                throw response;
            })
    }
}

export function addPopUp(sku){
    return function (dispatch){
        dispatch({ type: ADD_POPUP, payload: sku });
    }
}

export function closePopUp(){
  return function (dispatch){
      dispatch({ type: CLOSE_POPUP });
  }
}

export function trackInput(data){
   return function (dispatch){
       dispatch({ type : TRACK_INPUT, payload: data})
   }
}

export function submitCode(data) {
    return function (dispatch) {
        dispatch({ type: ADD_CODE_STARTED });
        return axios.post(WS_URL, data, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: ADD_CODE_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: ADD_CODE_REJECTED, payload: response });
                throw response;
            })
    }
}

export function deleteCode(data) {
    const code = data.keyCode;
    return function (dispatch) {
        dispatch({ type: DELETE_CODE_STARTED });
        return axios.delete(WS_URL + code.id, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: DELETE_CODE_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: DELETE_CODE_REJECTED, payload: response });
                throw response;
            })
    }
}

export function errorInput(data){
    return function (dispatch) {
        dispatch({type: ERROR_INPUT_CODE, payload: data});
    }
}
