import {
    GENERATE_CODE_STARTED, GENERATE_CODE_FULFILLED, GENERATE_CODE_REJECTED, TRACK_INPUT_BARCODE
} from "./../actions/BarcodeActions";

const initialState = {
    barcode: null,
    input: null,
    isGeneratingBarcode: false,
    generatingBarcodeError: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GENERATE_CODE_STARTED: {
            return { ...state, isGeneratingBarcode: true };
        }
        case GENERATE_CODE_FULFILLED: {
            const data = action.payload;
            var reader = new window.FileReader();
            reader.readAsDataURL(data);
            reader.onload = function () {
                var imageDataUrl = reader.result;
                localStorage.setItem('imageData', imageDataUrl);
            }
            return { ...state, isGeneratingBarcode: false };
        }
        case GENERATE_CODE_FULFILLED: {
            const error = action.payload.data;
            return { ...state, isGeneratingBarcode: false, generatingBarcodeError: error };
        }
        case TRACK_INPUT_BARCODE: {
            const data = action.payload;
            return { ...state, input: data}
        }
        default: {
            return state;
        }
    }
}
