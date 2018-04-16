import axios from "axios";

export const ADD_USER_STARTED = "ADD_USER_STARTED";
export const ADD_USER_FULFILLED = "ADD_USER_FULFILLED";
export const ADD_USER_REJECTED = "ADD_USER_REJECTED";

export const GET_USERS_STARTED = "GET_USERS_STARTED";
export const GET_USERS_FULFILLED = "GET_USERS_FULFILLED";
export const GET_USERS_REJECTED = "GET_USERS_REJECTED";

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

export const SET_UPDATING_USER_FULFILLED = "SET_UPDATING_USER_FULFILLED";

export const VIEW_COMPANIES = "VIEW_COMPANIES";

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
          number: ""
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

/*export function getPendingUsers(data) {
    return function (dispatch) {
        dispatch({ type: GET_PENDING_USERS_STARTED });
        return axios.get(WS_URL + "pending", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_PENDING_USERS_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_PENDING_USERS_REJECTED, payload: response });
                throw response;
            })
    }
}

export function approveUser(data) {
    const user = data.user;
    return function (dispatch) {
        dispatch({ type: APPROVE_USER_STARTED });
        return axios.put(WS_URL + user.id + "/approve", null, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: APPROVE_USER_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: APPROVE_USER_REJECTED, payload: response });
                throw response;
            })
    }
}*/

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

export function setUpdatingUser(id) {
    return function (dispatch) {
        dispatch({ type: SET_UPDATING_USER_FULFILLED, payload: id });
    }
}

export function updateUser(user) {
    return function (dispatch) {
        dispatch({ type: UPDATE_USER_STARTED });
        return axios.put(WS_URL + user.id, user)
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

export function getCompanies(data) {
    return function (dispatch) {
        //dispatch({ type: GET_COMPANIES_STARTED });
        return axios.get("http://localhost:3000/companies/", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: VIEW_COMPANIES, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                //dispatch({ type: GET_COMPANIES_REJECTED, payload: response });
                throw response;
            })
    }
}
