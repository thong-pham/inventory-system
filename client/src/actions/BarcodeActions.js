import axios from "axios";

export const GENERATE_CODE_STARTED = "GENERATE_CODE_STARTED";
export const GENERATE_CODE_FULFILLED = "GENERATE_CODE_FULFILLED";
export const GENERATE_CODE_REJECTED = "GENERATE_CODE_REJECTED";

export const TRACK_INPUT_BARCODE = "TRACK_INPUT_BARCODE";

const WS_URL = "http://bwipjs-api.metafloor.com/?bcid=code128&scaleY=1&text=";

export function generateBarcode(data) {
    return function (dispatch) {
        dispatch({ type: GENERATE_CODE_STARTED });
        return axios.get(WS_URL + data, {responseType: 'blob'})
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GENERATE_CODE_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GENERATE_CODE_REJECTED, payload: response });
                throw response;
            })
    }
}

export function trackInput(data){
    return function (dispatch) {
        dispatch({type: TRACK_INPUT_BARCODE, payload: data});
    }
}
