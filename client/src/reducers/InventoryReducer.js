import { ADD_INVENTORY_STARTED, ADD_INVENTORY_FULFILLED, ADD_INVENTORY_REJECTED,
         IMPORT_INVENTORY_STARTED, IMPORT_INVENTORY_FULFILLED, IMPORT_INVENTORY_REJECTED,
         GET_INVENTORIES_STARTED, GET_INVENTORIES_FULFILLED, GET_INVENTORIES_REJECTED,
         DELETE_INVENTORY_STARTED, DELETE_INVENTORY_FULFILLED, DELETE_INVENTORY_REJECTED,
         GET_PENDING_INVENTORIES_STARTED, GET_PENDING_INVENTORIES_FULFILLED, GET_PENDING_INVENTORIES_REJECTED,
         UPDATE_INVENTORY_STARTED, UPDATE_INVENTORY_FULFILLED, UPDATE_INVENTORY_REJECTED,
         SET_UPDATING_INVENTORY_FULFILLED, CLEAR_INVENTORY_FULFILLED, REJECT_UPDATING_INVENTORY,
         APPROVE_INVENTORY_STARTED, APPROVE_INVENTORY_FULFILLED, APPROVE_INVENTORY_REJECTED,
         TRACK_NUMBER, OPEN_PLUS, CLOSE_PLUS, ERROR_INPUT, FILL_DATA, OPEN_MINUS, CLOSE_MINUS
         } from "./../actions/InventoryActions";

const initialState = {
    inventories: [],
    isAddingInventory: false,
    addingInventoryError: null,
    isFetchingInventories: false,
    fetchingInventoriesError: null,
    isDeletingInventory: false,
    deletingsInventoriesError: null,
    pendingInventories: [],
    isFetchingPendingInventories: false,
    fetchingPendingInventoriesError: null,
    inventory: null,
    isUpdatingInventory: false,
    updatingInventoriesError: null,
    isApprovingInventory: false,
    approvingInventoryError: null,
    isImportingInventory: false,
    importingInventoryError: null,
    quantity: null,
    errorInput: null,
    openPlus: null,
    openMinus: null,
    generatedSKU: null,
    generatedDesc: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_INVENTORY_STARTED: {
            return { ...state, isAddingInventory: true };
        }
        case ADD_INVENTORY_FULFILLED: {
            const data = action.payload;
            const newInventory = state.inventories.concat([data]);
            return { ...state, isAddingInventory: false, inventories: newInventory };
        }
        case ADD_INVENTORY_REJECTED: {
            const error = action.payload.data;
            return { ...state, isAddingInventory: false, addingInventoryError: error };
        }
        case GET_INVENTORIES_STARTED: {
            return { ...state, isFetchingInventories: true };
        }
        case GET_INVENTORIES_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingInventories: false, inventories: data };
        }
        case GET_INVENTORIES_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingInventories: false, fetchingInventoriesError: error };
        }
        case DELETE_INVENTORY_STARTED: {
            return { ...state, isDeletingInventory: true };
        }
        case DELETE_INVENTORY_FULFILLED: {
            const data = action.payload;
            return { ...state, isDeletingInventory: false };
        }
        case DELETE_INVENTORY_REJECTED: {
            const error = action.payload.data;
            return { ...state, isDeletingInventory: false, deletingsInventoriesError: error };
        }
        case GET_PENDING_INVENTORIES_STARTED: {
            return { ...state, isFetchingPendingInventories: true };
        }
        case GET_PENDING_INVENTORIES_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingPendingInventories: false, pendingInventories: data };
        }
        case GET_PENDING_INVENTORIES_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingPendingInventories: false, fetchingPendingInventoriesError: error };
        }
        case UPDATE_INVENTORY_STARTED: {
            return { ...state, isUpdatingInventory: true };
        }
        case UPDATE_INVENTORY_FULFILLED: {
            const data = action.payload;
            return { ...state, isUpdatingInventory: false, inventory: null, openPlus: null, openMinus: null, quantity: null };
        }
        case UPDATE_INVENTORY_REJECTED: {
            const error = action.payload.data;
            return { ...state, isUpdatingInventory: false, updatingInventoriesError: error, openPlus: null, openMinus: null, quantity: null };
        }
        case APPROVE_INVENTORY_STARTED: {
            return { ...state, isApprovingInventory: true };
        }
        case APPROVE_INVENTORY_FULFILLED: {
            const data = action.payload;
            return { ...state, isApprovingInventory: false, inventory: null };
        }
        case APPROVE_INVENTORY_REJECTED: {
            const error = action.payload.data;
            return { ...state, isApprovingInventory: false, approvingInventoryError: error };
        }
        case SET_UPDATING_INVENTORY_FULFILLED: {
            const id = action.payload;
            const newInv = state.inventories.filter(function (element) {
                return element.id == id;
            })[0];
            return { ...state, inventory: newInv };
        }
        case CLEAR_INVENTORY_FULFILLED:{
            return { ...state, inventory: null};
        }
        case REJECT_UPDATING_INVENTORY: {
            const error = action.payload;
            return { ...state, updatingInventoriesError: error, deletingsInventoriesError: null };
        }
        case IMPORT_INVENTORY_STARTED: {
            return { ...state, isImportingInventory: true };
        }
        case IMPORT_INVENTORY_FULFILLED: {
            const data = action.payload;
            return { ...state, isImportingInventory: false, };
        }
        case IMPORT_INVENTORY_REJECTED: {
            const error = action.payload.data;
            return { ...state, isImportingInventory: false, importingInventoryError: error };
        }
        case TRACK_NUMBER: {
            var data = action.payload;
            const number = parseInt(data);
            return { ...state, quantity : number};
        }
        case OPEN_PLUS: {
          const data = action.payload;
            return { ...state, openPlus : data, quantity: null, openMinus: null };
        }
        case CLOSE_PLUS: {
            return { ...state, openPlus : null, quantity: null, errorInput: null };
        }
        case OPEN_MINUS: {
          const data = action.payload;
            return { ...state, openMinus : data, quantity: null, openPlus: null };
        }
        case CLOSE_MINUS: {
            return { ...state, openMinus : null, quantity: null, errorInput: null };
        }
        case ERROR_INPUT: {
            const error = "Invalid Input";
            return {...state, errorInput: error };
        }
        case FILL_DATA:{
            const data = action.payload;
            return { ...state, generatedSKU: data.sku, generatedDesc: data.desc, errorInput: null }
        }
        default: {
            return state;
        }
    }
}
