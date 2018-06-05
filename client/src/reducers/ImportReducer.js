import { APPROVE_IMPORT_STARTED, APPROVE_IMPORT_FULFILLED, APPROVE_IMPORT_REJECTED,
         GET_PENDING_IMPORTS_STARTED, GET_PENDING_IMPORTS_FULFILLED, GET_PENDING_IMPORTS_REJECTED,
         GET_APPROVED_IMPORTS_STARTED, GET_APPROVED_IMPORTS_FULFILLED, GET_APPROVED_IMPORTS_REJECTED,
         CHANGE_IMPORT_STARTED, CHANGE_IMPORT_FULFILLED, CHANGE_IMPORT_REJECTED,
         DELETE_IMPORT_STARTED, DELETE_IMPORT_FULFILLED, DELETE_IMPORT_REJECTED,
         DUPLICATE_IMPORT_STARTED, DUPLICATE_IMPORT_FULFILLED, DUPLICATE_IMPORT_REJECTED,
         CHANGE_POPUP, CLOSE_POPUP, TRACK_NUMBER, FILL_CODE, CLEAR_IMPORT, INPUT_CAPACITY, INPUT_COUNT,
         IMPORT_INVENTORY_STARTED, IMPORT_INVENTORY_FULFILLED, IMPORT_INVENTORY_REJECTED, SORT_IMPORT,
         REV_IMPORT, NEXT_IMPORT, MODIRY_IMPORT
         } from "./../actions/ImportActions";

const initialState = {
    pendingImports: [],
    approvedImports: [],
    nextImport: null,
    isImportingInventory: false,
    importingInventoryError: null,
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
    isDuplicatingImport: false,
    duplicatingImportError: null,
    import: null,
    response: null,
    change: null,
    quantity: null,
    add: false,
    defaultImport: {
        code: null,
        capacity: 24,
        box: null
    },
    capacity: null,
    count: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case IMPORT_INVENTORY_STARTED: {
            return { ...state, isImportingInventory: true };
        }
        case IMPORT_INVENTORY_FULFILLED: {
            const data = action.payload;
            return { ...state, isImportingInventory: false, importingInventoryError: null, nextImport: data };
        }
        case IMPORT_INVENTORY_REJECTED: {
            const error = action.payload.data;
            return { ...state, isImportingInventory: false, importingInventoryError: error };
        }
        case GET_PENDING_IMPORTS_STARTED: {
            return { ...state, isFetchingPendingImports: true };
        }
        case GET_PENDING_IMPORTS_FULFILLED: {
            const data = action.payload;
            //data.sort(compareSku);
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
            state.pendingImports.splice(index,1);
            return { ...state, isApprovingImport: false, approvingImportError: null  };
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
            state.pendingImports.forEach(function(item){
                if (item.id === data.id) {
                    item.quantity = data.quantity;
                    item.capacity = data.capacity;
                    item.count = data.count;
                }
            });
            return {...state, isChangingImport: false  };
        }
        case CHANGE_IMPORT_REJECTED: {
            const error = action.payload.data;
            return {...state, isChangingImport: false, changingImportError: error };
        }
        case DELETE_IMPORT_STARTED: {
            return {...state, isDeletingImport: true };
        }
        case DELETE_IMPORT_FULFILLED: {
            const data = action.payload;
            var index = 0;
            for (var i = 0; i < state.pendingImports.length; i++){
                if (state.pendingImports[i].id === data.id ){
                    index = i;
                }
            }
            state.pendingImports.splice(index,1);
            return {...state, isDeletingImport: false, deletingImportError: null };
        }
        case DELETE_IMPORT_REJECTED: {
            const data = action.payload.data;
            return {...state, isDeletingImport: false, deletingImportError: data};
        }
        case DUPLICATE_IMPORT_STARTED:{
            return { ...state, isDuplicatingImport: true };
        }
        case DUPLICATE_IMPORT_FULFILLED:{
            const data = action.payload;
            return { ...state, isDuplicatingImport: false };
        }
        case DUPLICATE_IMPORT_REJECTED:{
            const error = action.payload;
            return { ...state, isDuplicatingImport: false, duplicatingImportError: error };
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
        case FILL_CODE:{
            const data = action.payload;
            return { ...state, defaultImport: {code: data, capacity: 24, box: null} };
        }
        case CLEAR_IMPORT:{
            return { ...state, defaultImport: {code: null, capacity: 24, box: null} };
        }
        case INPUT_CAPACITY:{
            const data = action.payload;
            return { ...state, capacity: data };
        }
        case INPUT_COUNT:{
            const data = action.payload;
            return { ...state, count: data };
        }
        case SORT_IMPORT:{
            const data = action.payload;
            if (data === 'sku') state.pendingImports.sort(compareSku);
            else if (data === 'quantity') state.inventories.sort(compareQuantity);
            else if (data === 'data') state.inventories.sort(compareDate);
            return { ...state };
        }
        case REV_IMPORT:{
            state.pendingImports.reverse();
            return { ...state };
        }
        case NEXT_IMPORT:{
            const { importData, response } = action.payload;
            var index = state.pendingImports.indexOf(importData);
            state.pendingImports[index].count = state.pendingImports[index].count - response.count;
            state.pendingImports[index].quantity = state.pendingImports[index].count * state.pendingImports[index].capacity;
            state.pendingImports.splice(index + 1, 0, response);
            return { ...state};
        }
        default: {
            return state;
        }
    }
}

function compareSku(a,b){
    const idA = a.sku;
    const idB = b.sku;

    let comparision = 0;
    if (idA > idB) {
        comparision = 1;
    }
    else if (idA < idB){
        comparision = -1;
    }
    return comparision;
}
