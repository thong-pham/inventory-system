import { ADD_INVENTORY_STARTED, ADD_INVENTORY_FULFILLED, ADD_INVENTORY_REJECTED } from "./../actions/InventoryActions";
import { GET_INVENTORIES_STARTED, GET_INVENTORIES_FULFILLED, GET_INVENTORIES_REJECTED } from "./../actions/InventoryActions";
import { DELETE_INVENTORY_STARTED, DELETE_INVENTORY_FULFILLED, DELETE_INVENTORY_REJECTED } from "./../actions/InventoryActions";
import { GET_PENDING_INVENTORIES_STARTED, GET_PENDING_INVENTORIES_FULFILLED, GET_PENDING_INVENTORIES_REJECTED } from "./../actions/InventoryActions";
import { UPDATE_INVENTORY_STARTED, UPDATE_INVENTORY_FULFILLED, UPDATE_INVENTORY_REJECTED } from "./../actions/InventoryActions";
import { SET_UPDATING_INVENTORY_FULFILLED } from "./../actions/InventoryActions";
import { REJECT_UPDATING_INVENTORY } from "./../actions/InventoryActions";
import { APPROVE_INVENTORY_STARTED, APPROVE_INVENTORY_FULFILLED, APPROVE_INVENTORY_REJECTED } from "./../actions/InventoryActions";
import { ADD_CART_STARTED } from "./../actions/InventoryActions";

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
    inCartRequests: [],
    quantity: null,
    completeRequest: null
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
            console.log(error);
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
            return { ...state, isUpdatingInventory: false, inventory: null };
        }
        case UPDATE_INVENTORY_REJECTED: {
            const error = action.payload.data;
            return { ...state, isUpdatingInventory: false, updatingInventoriesError: error };
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
            const inv = state.inventories.filter(function (element) {
                return element.id == id;
            })[0];
            return Object.assign({}, state, { inventory: inv });
        }
        case REJECT_UPDATING_INVENTORY: {
            const error = action.payload;
            return { ...state, updatingInventoriesError: error, deletingsInventoriesError: null };
        }
        case ADD_CART_STARTED: {
            const number = action.payload;
            return { ...state, quantity : number};
        }
        default: {
            return state;
        }
    }
}
