import axios from "axios";

export const ADD_COMPANY_STARTED = "ADD_COMPANY_STARTED";
export const ADD_COMPANY_FULFILLED = "ADD_COMPANY_FULFILLED";
export const ADD_COMPANY_REJECTED = "ADD_COMPANY_REJECTED";

export const GET_COMPANIES_STARTED = "GET_COMPANIES_STARTED";
export const GET_COMPANIES_FULFILLED = "GET_COMPANIES_FULFILLED";
export const GET_COMPANIES_REJECTED = "GET_COMPANIES_REJECTED";

export const DELETE_COMPANY_STARTED = "DELETE_COMPANY_STARTED";
export const DELETE_COMPANY_FULFILLED = "DELETE_COMPANY_FULFILLED";
export const DELETE_COMPANY_REJECTED = "DELETE_COMPANY_REJECTED";

export const GET_PENDING_COMPANIES_STARTED = "GET_PENDING_COMPANIES_STARTED";
export const GET_PENDING_COMPANIES_FULFILLED = "GET_PENDING_COMPANIES_FULFILLED";
export const GET_PENDING_COMPANIES_REJECTED = "GET_PENDING_COMPANIES_REJECTED";

export const APPROVE_COMPANY_STARTED = "APPROVE_COMPANY_STARTED";
export const APPROVE_COMPANY_FULFILLED = "APPROVE_COMPANY_FULFILLED";
export const APPROVE_COMPANY_REJECTED = "APPROVE_COMPANY_REJECTED";

export const UPDATE_COMPANY_STARTED = "UPDATE_COMPANY_STARTED";
export const UPDATE_COMPANY_FULFILLED = "UPDATE_COMPANY_FULFILLED";
export const UPDATE_COMPANY_REJECTED = "UPDATE_COMPANY_REJECTED";

export const SET_UPDATING_COMPANY_FULFILLED = "SET_UPDATING_COMPANY_FULFILLED";

export const CHANGE_COMPANY = "CHANGE_COMPANY";
export const CANCEL_CHANGE = "CANCEL_CHANGE";
export const TRACK_NAME = "TRACK_NAME";
export const ERROR_INPUT_COMPANY = "ERROR_INPUT_COMPANY";

const WS_URL = "https://api.israhospitality.com/companies/";

export function addCompany(data) {
    return function (dispatch) {
        dispatch({ type: ADD_COMPANY_STARTED });
        return axios.post(WS_URL + "createCompany", data)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: ADD_COMPANY_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: ADD_COMPANY_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getCompanies(data) {
    return function (dispatch) {
        dispatch({ type: GET_COMPANIES_STARTED });
        return axios.get(WS_URL, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_COMPANIES_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_COMPANIES_REJECTED, payload: response });
                throw response;
            })
    }
}

export function deleteCompany(data) {
    const company = data.company;
    return function (dispatch) {
        dispatch({ type: DELETE_COMPANY_STARTED });
        return axios.delete(WS_URL + company.id, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: DELETE_COMPANY_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: DELETE_COMPANY_REJECTED, payload: response });
                throw response;
            })
    }
}

export function editCompany(company) {
    return function (dispatch) {
        dispatch({ type: UPDATE_COMPANY_STARTED });
        return axios.put(WS_URL + company.id, company)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: UPDATE_COMPANY_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: UPDATE_COMPANY_REJECTED, payload: response });
                throw response;
            })
    }
}

export function setUpdatingCompany(id) {
    return function (dispatch) {
        dispatch({ type: SET_UPDATING_COMPANY_FULFILLED, payload: id });
    }
}

export function triggerChange(data) {
    return function (dispatch) {
        dispatch({ type: CHANGE_COMPANY, payload: data });
    }
}
export function cancelChange(data) {
    return function (dispatch) {
        dispatch({ type: CANCEL_CHANGE });
    }
}

export function trackName(data) {
    return function (dispatch) {
        dispatch({ type: TRACK_NAME, payload: data });
    }
}

export function errorInput(data) {
    return function (dispatch) {
        dispatch({ type: ERROR_INPUT_COMPANY, payload: data });
    }
}
