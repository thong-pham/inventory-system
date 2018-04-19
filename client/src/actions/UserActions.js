import axios from "axios";

export const ADD_USER_STARTED = "ADD_USER_STARTED";
export const ADD_USER_FULFILLED = "ADD_USER_FULFILLED";
export const ADD_USER_REJECTED = "ADD_USER_REJECTED";

export const GET_USERS_STARTED = "GET_USERS_STARTED";
export const GET_USERS_FULFILLED = "GET_USERS_FULFILLED";
export const GET_USERS_REJECTED = "GET_USERS_REJECTED";

export const GET_USER_STARTED = "GET_USER_STARTED";
export const GET_USER_FULFILLED = "GET_USER_FULFILLED";
export const GET_USER_REJECTED = "GET_USER_REJECTED";

export const DELETE_USER_STARTED = "DELETE_USER_STARTED";
export const DELETE_USER_FULFILLED = "DELETE_USER_FULFILLED";
export const DELETE_USER_REJECTED = "DELETE_USER_REJECTED";

export const GET_PENDING_USERS_STARTED = "GET_PENDING_USERS_STARTED";
export const GET_PENDING_USERS_FULFILLED = "GET_PENDING_USERS_FULFILLED";
export const GET_PENDING_USERS_REJECTED = "GET_PENDING_USERS_REJECTED";

export const APPROVE_USER_STARTED = "APPROVE_USER_STARTED";
export const APPROVE_USER_FULFILLED = "APPROVE_USER_FULFILLED";
export const APPROVE_USER_REJECTED = "APPROVE_USER_REJECTED";

export const UPDATE_USER_STARTED = "UPDATE_USER_STARTED";
export const UPDATE_USER_FULFILLED = "UPDATE_USER_FULFILLED";
export const UPDATE_USER_REJECTED = "UPDATE_USER_REJECTED";

export const CHANGE_PASSWORD_STARTED = "CHANGE_PASSWORD_STARTED";
export const CHANGE_PASSWORD_FULFILLED = "CHANGE_PASSWORD_FULFILLED";
export const CHANGE_PASSWORD_REJECTED = "CHANGE_PASSWORD_REJECTED";

export const CHANGE_INFO_STARTED = "CHANGE_INFO_STARTED";
export const CHANGE_INFO_FULFILLED = "CHANGE_INFO_FULFILLED";
export const CHANGE_INFO_REJECTED = "CHANGE_INFO_REJECTED";

export const SET_UPDATING_USER_FULFILLED = "SET_UPDATING_USER_FULFILLED";
export const CLEAR_USER_FULFILLED = "CLEAR_USER_FULFILLED";

export const GET_USER = "GET_USER";
export const CHANGE_PASSWORD = "CHANGE_PASSWORD";
export const CLOSE_PASSWORD = "CLOSE_PASSWORD";
export const CHANGE_NAME = "CHANGE_NAME";
export const CLOSE_NAME = "CLOSE_NAME";
export const CHANGE_NUMBER = "CHANGE_NUMBER";
export const CLOSE_NUMBER = "CLOSE_NUMBER";
export const CHANGE_EMAIL = "CHANGE_EMAIL";
export const CLOSE_EMAIL = "CLOSE_EMAIL";
export const TRACK_CURRENT = "TRACK_CURRENT";
export const TRACK_NEW = "TRACK_NEW";
export const TRACK_NAME = "TRACK_NAME";
export const TRACK_NUMBER = "TRACK_NUMBER";
export const TRACK_EMAIL = "TRACK_EMAIL";
export const ERROR_INPUT = "ERROR_INPUT";

const WS_URL = "http://34.238.40.177:3000/users/";

export function addUser(data) {
    return function (dispatch) {
        dispatch({ type: ADD_USER_STARTED });
        var user = {
          username : data.username,
          roles : data.roles,
          company: data.company,
          password: data.password,
          name: "",
          email: "",
          number: "",
          token: data.token
        };
        return axios.post(WS_URL + "createUser", user)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: ADD_USER_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: ADD_USER_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getUsers(data) {
    return function (dispatch) {
        dispatch({ type: GET_USERS_STARTED });
        return axios.get(WS_URL, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_USERS_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_USERS_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getUser(data) {
    return function (dispatch) {
        dispatch({ type: GET_USER_STARTED });
        return axios.get(WS_URL + data.id, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_USER_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_USER_REJECTED, payload: response });
                throw response;
            })
    }
}

export function deleteUser(data) {
    const user = data.user;
    return function (dispatch) {
        dispatch({ type: DELETE_USER_STARTED });
        return axios.delete(WS_URL + user.id, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: DELETE_USER_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: DELETE_USER_REJECTED, payload: response });
                throw response;
            })
    }
}

export function editUser(user) {
    return function (dispatch) {
        dispatch({ type: UPDATE_USER_STARTED });
        return axios.put(WS_URL + "editUser", user)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: UPDATE_USER_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: UPDATE_USER_REJECTED, payload: response });
                throw response;
            })
    }
}

export function submitNewPass(data){
    return function (dispatch) {
        dispatch({type: CHANGE_PASSWORD_STARTED});
        return axios.put(WS_URL + "changePassword", data.submit, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: CHANGE_PASSWORD_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: CHANGE_PASSWORD_REJECTED, payload: response });
                throw response;
            })
    }
}

export function updateInfo(data){
    return function (dispatch) {
        dispatch({type: CHANGE_INFO_STARTED});
        return axios.put(WS_URL + "updateInfo", data.submit, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: CHANGE_INFO_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: CHANGE_INFO_REJECTED, payload: response });
                throw response;
            })
    }
}

export function setUpdatingUser(id) {
    return function (dispatch) {
        dispatch({ type: SET_UPDATING_USER_FULFILLED, payload: id });
    }
}

export function clearUser() {
    return function (dispatch) {
        dispatch({ type: CLEAR_USER_FULFILLED });
    }
}

export function changePass(){
    return function (dispatch) {
        dispatch({type: CHANGE_PASSWORD});
    }
}

export function changePassClose(){
    return function (dispatch) {
        dispatch({type: CLOSE_PASSWORD});
    }
}

export function changeName(){
    return function (dispatch) {
        dispatch({type: CHANGE_NAME});
    }
}

export function changeNameClose(){
    return function (dispatch) {
        dispatch({type: CLOSE_NAME});
    }
}

export function changeNumber(){
    return function (dispatch) {
        dispatch({type: CHANGE_NUMBER});
    }
}

export function changeNumberClose(){
    return function (dispatch) {
        dispatch({type: CLOSE_NUMBER});
    }
}

export function changeEmail(){
    return function (dispatch) {
        dispatch({type: CHANGE_EMAIL});
    }
}

export function changeEmailClose(){
    return function (dispatch) {
        dispatch({type: CLOSE_EMAIL});
    }
}

export function trackCurrent(currentPass){
    return function (dispatch) {
        dispatch({type: TRACK_CURRENT, payload: currentPass});
    }
}
export function trackNew(newPass){
    return function (dispatch) {
        dispatch({type: TRACK_NEW, payload: newPass});
    }
}

export function trackName(name){
    return function (dispatch) {
        dispatch({type: TRACK_NAME, payload: name});
    }
}
export function trackNumber(number){
    return function (dispatch) {
        dispatch({type: TRACK_NUMBER, payload: number});
    }
}
export function trackEmail(email){
    return function (dispatch) {
        dispatch({type: TRACK_EMAIL, payload: email});
    }
}

export function errorInput(){
    return function (dispatch) {
        dispatch({type: ERROR_INPUT});
    }
}
