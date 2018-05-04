import axios from "axios";

export const GET_QUALITY_STARTED = "GET_QUALITY_STARTED";
export const GET_QUALITY_FULFILLED = "GET_QUALITY_FULFILLED";
export const GET_QUALITY_REJECTED = "GET_QUALITY_REJECTED";

export const GET_TYPE_STARTED = "GET_TYPE_STARTED";
export const GET_TYPE_FULFILLED = "GET_TYPE_FULFILLED";
export const GET_TYPE_REJECTED = "GET_TYPE_REJECTED";

export const GET_PATTERN_STARTED = "GET_PATTERN_STARTED";
export const GET_PATTERN_FULFILLED = "GET_PATTERN_FULFILLED";
export const GET_PATTERN_REJECTED = "GET_PATTERN_REJECTED";

export const GET_COLOR_STARTED = "GET_COLOR_STARTED";
export const GET_COLOR_FULFILLED = "GET_COLOR_FULFILLED";
export const GET_COLOR_REJECTED = "GET_COLOR_REJECTED";

export const GET_SIZE_STARTED = "GET_SIZE_STARTED";
export const GET_SIZE_FULFILLED = "GET_SIZE_FULFILLED";
export const GET_SIZE_REJECTED = "GET_SIZE_REJECTED";

export const GET_UNIT_STARTED = "GET_UNIT_STARTED";
export const GET_UNIT_FULFILLED = "GET_UNIT_FULFILLED";
export const GET_UNIT_REJECTED = "GET_UNIT_REJECTED";

export const ADD_FEATURE_STARTED = "ADD_FEATURE_STARTED";
export const ADD_FEATURE_FULFILLED = "ADD_FEATURE_FULFILLED";
export const ADD_FEATURE_REJECTED = "ADD_FEATURE_REJECTED";

export const CHANGE_FEATURE_STARTED = "CHANGE_FEATURE_STARTED";
export const CHANGE_FEATURE_FULFILLED = "CHANGE_FEATURE_FULFILLED";
export const CHANGE_FEATURE_REJECTED = "CHANGE_FEATURE_REJECTED";

export const DELETE_FEATURE_STARTED = "DELETE_FEATURE_STARTED";
export const DELETE_FEATURE_FULFILLED = "DELETE_FEATURE_FULFILLED";
export const DELETE_FEATURE_REJECTED = "DELETE_FEATURE_REJECTED";

export const ADD_QUALITY = "ADD_QUALITY";
export const ADD_TYPE = "ADD_TYPE";
export const ADD_PATTERN = "ADD_PATTERN";
export const ADD_COLOR = "ADD_COLOR";
export const ADD_SIZE = "ADD_SIZE";
export const ADD_UNIT = "ADD_UNIT";
export const INPUT_KEY = "INPUT_KEY";
export const INPUT_DESC = "INPUT_DESC";

export const CHOOSE_QUALITY = "CHOOSE_QUALITY";
export const CHOOSE_TYPE = "CHOOSE_TYPE";
export const CHOOSE_PATTERN = "CHOOSE_PATTERN";
export const CHOOSE_COLOR = "CHOOSE_COLOR";
export const CHOOSE_SIZE = "CHOOSE_SIZE";
export const CHOOSE_UNIT = "CHOOSE_UNIT";

const WS_URL = "https://api.israhospitality.com/features/";

export function getQualities(data) {
    return function (dispatch) {
        dispatch({ type: GET_QUALITY_STARTED });
        return axios.get(WS_URL + "quality", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_QUALITY_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_QUALITY_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getTypes(data) {
    return function (dispatch) {
        dispatch({ type: GET_TYPE_STARTED });
        return axios.get(WS_URL + "type", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_TYPE_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_TYPE_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getPatterns(data) {
    return function (dispatch) {
        dispatch({ type: GET_PATTERN_STARTED });
        return axios.get(WS_URL + "pattern", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_PATTERN_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_PATTERN_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getColors(data) {
    return function (dispatch) {
        dispatch({ type: GET_COLOR_STARTED });
        return axios.get(WS_URL + "color", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_COLOR_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_COLOR_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getSizes(data) {
    return function (dispatch) {
        dispatch({ type: GET_SIZE_STARTED });
        return axios.get(WS_URL + "size", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_SIZE_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_SIZE_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getUnits(data) {
    return function (dispatch) {
        dispatch({ type: GET_UNIT_STARTED });
        return axios.get(WS_URL + "unit", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_UNIT_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_UNIT_REJECTED, payload: response });
                throw response;
            })
    }
}

export function addFeature(data) {
    return function (dispatch) {
        dispatch({ type: ADD_FEATURE_STARTED });
        return axios.post(WS_URL, data)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: ADD_FEATURE_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: ADD_FEATURE_REJECTED, payload: response });
                throw response;
            })
    }
}

export function deleteFeature(data) {
    return function (dispatch) {
        dispatch({ type: DELETE_FEATURE_STARTED });
        return axios.delete(WS_URL + data.kind + "/" + data.id, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: DELETE_FEATURE_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: DELETE_FEATURE_REJECTED, payload: response });
                throw response;
            })
    }
}

export function addQuality(){
    return function (dispatch) {
        dispatch({type: ADD_QUALITY });
    }
}

export function addType(){
    return function (dispatch) {
        dispatch({type: ADD_TYPE });
    }
}
export function addPattern(){
    return function (dispatch) {
        dispatch({type: ADD_PATTERN });
    }
}
export function addColor(){
    return function (dispatch) {
        dispatch({type: ADD_COLOR });
    }
}
export function addSize(){
    return function (dispatch) {
        dispatch({type: ADD_SIZE });
    }
}
export function addUnit(){
    return function (dispatch) {
        dispatch({type: ADD_UNIT });
    }
}

export function handleInputKey(data){
    return function (dispatch) {
        dispatch({type: INPUT_KEY, payload: data });
    }
}

export function handleInputDescription(data){
    return function (dispatch) {
        dispatch({type: INPUT_DESC, payload: data });
    }
}

export function chooseQuality(data){
    return function (dispatch) {
        dispatch({type: CHOOSE_QUALITY, payload: data });
    }
}

export function chooseType(data){
    return function (dispatch) {
        dispatch({type: CHOOSE_TYPE, payload: data });
    }
}

export function choosePattern(data){
    return function (dispatch) {
        dispatch({type: CHOOSE_PATTERN, payload: data });
    }
}

export function chooseColor(data){
    return function (dispatch) {
        dispatch({type: CHOOSE_COLOR, payload: data });
    }
}

export function chooseSize(data){
    return function (dispatch) {
        dispatch({type: CHOOSE_SIZE, payload: data });
    }
}

export function chooseUnit(data){
    return function (dispatch) {
        dispatch({type: CHOOSE_UNIT, payload: data });
    }
}
