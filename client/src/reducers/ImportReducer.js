import { APPROVE_IMPORT_STARTED, APPROVE_IMPORT_FULFILLED, APPROVE_IMPORT_REJECTED,
         GET_PENDING_IMPORTS_STARTED, GET_PENDING_IMPORTS_FULFILLED, GET_PENDING_IMPORTS_REJECTED,
         GET_APPROVED_IMPORTS_STARTED, GET_APPROVED_IMPORTS_FULFILLED, GET_APPROVED_IMPORTS_REJECTED,
         CHANGE_IMPORT_STARTED, CHANGE_IMPORT_FULFILLED, CHANGE_IMPORT_REJECTED,
         DELETE_IMPORT_STARTED, DELETE_IMPORT_FULFILLED, DELETE_IMPORT_REJECTED,
         CHANGE_POPUP, CLOSE_POPUP, TRACK_NUMBER
         } from "./../actions/ImportActions";

const initialState = {
    pendingImports: [],
    approvedImports: [],
    isFetchingPendingImports: false,
    fetchingPendingImportsError: null,
    isFetchingApprovedImports: false,
    fetchingApprovedImportsError: null,
    isApprovingImport: false,
    approvingImportError: null,
    isChangingImport: false,
    changingImportError: null,
    isDeletingImport: false,
    deletingImportError: null,
    import: null,
    response: null,
    change: null,
    quantity: null,
    add: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_PENDING_IMPORTS_STARTED: {
            return { ...state, isFetchingPendingImports: true };
        }
        case GET_PENDING_IMPORTS_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingPendingImports: false, pendingImports: data };
        }
        case GET_PENDING_IMPORTS_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingPendingImports: false, fetchingPendingImportsError: error };
        }
        case GET_APPROVED_IMPORTS_STARTED: {
            return { ...state, isFetchingApprovedImports: true };
        }
        case GET_APPROVED_IMPORTS_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingApprovedImports: false, approvedImports: data };
        }
        case GET_APPROVED_IMPORTS_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingApprovedImports: false, fetchingApprovedImportsError: error };
        }
        case APPROVE_IMPORT_STARTED: {
            return { ...state, isApprovingImport: true };
        }
        case APPROVE_IMPORT_FULFILLED: {
            const importData = action.payload;
            var index = 0;
            for (var i = 0; i < state.pendingImports.length; i++){
                if (state.pendingImports[i].id === importData.id ){
                    index = i;
                }
            }
            var newImports = state.pendingImports;
            newImports.splice(index,1);
            return { ...state, isApprovingImport: false, pendingImports: newImports, approvingImportError: null  };
        }
        case APPROVE_IMPORT_REJECTED: {
            const error = action.payload.data;
            return { ...state, isApprovingImport: false, approvingImportError: error };
        }
        case CHANGE_IMPORT_STARTED: {
            return {...state, isChangingImport: true };
        }
        case CHANGE_IMPORT_FULFILLED: {
            const data = action.payload;
            return {...state, isChangingImport: false, change: false, quantity: null };
        }
        case CHANGE_IMPORT_REJECTED: {
            const data = action.payload.data;
            return {...state, isChangingImport: false, changingImportError: data};
        }
        case DELETE_IMPORT_STARTED: {
            return {...state, isDeletingImport: true };
        }
        case DELETE_IMPORT_FULFILLED: {
            const data = action.payload;
            return {...state, isDeletingImport: false, deletingImportError: null };
        }
        case DELETE_IMPORT_REJECTED: {
            const data = action.payload.data;
            return {...state, isDeletingImport: false, deletingImportError: data};
        }
        case CHANGE_POPUP: {
            const data = action.payload;
            return {...state, change: data}
        }
        case CLOSE_POPUP: {
            return {...state, change: null}
        }
        case TRACK_NUMBER: {
            var data = action.payload;
            const number = parseInt(data);
            return { ...state, quantity : number};
        }
        default: {
            return state;
        }
    }
}
