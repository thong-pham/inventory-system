import { GET_CODES_STARTED, GET_CODES_FULFILLED, GET_CODES_REJECTED,
        ADD_CODE_STARTED, ADD_CODE_FULFILLED, ADD_CODE_REJECTED,
        DELETE_CODE_STARTED, DELETE_CODE_FULFILLED, DELETE_CODE_REJECTED,
        ADD_POPUP, CLOSE_POPUP, TRACK_INPUT
        } from "./../actions/CodeActions";

const initialState = {
    codes: [],
    isFetchingCodes: false,
    fetchingCodesError: null,
    isAddingCode: false,
    addingCodeError: null,
    isDeletingCode: false,
    deletingCodeError: null,
    code: null,
    skuList: [],
    openAdd: null,
    codeInput: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_CODES_STARTED: {
            return { ...state, isFetchingCodes: true };
        }
        case GET_CODES_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingCodes: false, codes: data };
        }
        case GET_CODES_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingCodes: false, fetchingCodesError: error };
        }
        case ADD_CODE_STARTED: {
            return {...state, isAddingCode: true };
        }
        case ADD_CODE_FULFILLED: {
            const data = action.payload;
            /*state.codes.forEach(function(code){
                if (code.sku === data.sku){
                   code.keys.push(data.key);
                }
            });*/
            return {...state, isAddingCode: false, openAdd: false, codeInput: null, addingCodeError: null };
        }
        case ADD_CODE_REJECTED: {
            const data = action.payload.data;
            return {...state, isAddingCode: false, addingCodeError: data};
        }
        case DELETE_CODE_STARTED: {
            return {...state, isDeletingCode: true};
        }
        case DELETE_CODE_FULFILLED: {
            const data = action.payload;
            return {...state, isDeletingCode: false, deletingCodeError: null};
        }
        case DELETE_CODE_REJECTED: {
            const data = action.payload.data;
            return {...state, isDeletingCode: false, deletingCodeError: data}
        }
        case ADD_POPUP: {
            const data = action.payload;
            return {...state, openAdd: data}
        }
        case CLOSE_POPUP: {
            return {...state, openAdd: null, addingCodeError: null}
        }
        case TRACK_INPUT: {
            var data = action.payload;
            return { ...state, codeInput : data};
        }
        default: {
            return state;
        }
    }
}

function makeSkuList(list, codes) {
    list.forEach(function(item){

    });
}
