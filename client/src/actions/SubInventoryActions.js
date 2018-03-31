import axios from 'axios';

export const GET_SUB_INVENTORIES_STARTED = "GET_SUB_INVENTORIES_STARTED";
export const GET_SUB_INVENTORIES_FULFILLED = "GET_SUB_INVENTORIES_FULFILLED";
export const GET_SUB_INVENTORIES_REJECTED = "GET_SUB_INVENTORIES_REJECTED";

const WS_URL = "http://localhost:3000/inventories/sub";

export function getSubInventories(data) {
    return function (dispatch) {
        dispatch({ type: GET_SUB_INVENTORIES_STARTED });
        return axios.get(WS_URL, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_SUB_INVENTORIES_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_SUB_INVENTORIES_REJECTED, payload: response });
                throw response;
            })
    }
}
