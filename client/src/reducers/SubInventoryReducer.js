import { GET_SUB_INVENTORIES_STARTED, GET_SUB_INVENTORIES_FULFILLED, GET_SUB_INVENTORIES_REJECTED } from "./../actions/SubInventoryActions";
//import { DELETE_INVENTORY_STARTED, DELETE_INVENTORY_FULFILLED, DELETE_INVENTORY_REJECTED } from "./../actions/InventoryActions";
//import { GET_PENDING_INVENTORIES_STARTED, GET_PENDING_INVENTORIES_FULFILLED, GET_PENDING_INVENTORIES_REJECTED } from "./../actions/InventoryActions";
//import { UPDATE_INVENTORY_STARTED, UPDATE_INVENTORY_FULFILLED, UPDATE_INVENTORY_REJECTED } from "./../actions/InventoryActions";

const initialState = {
    inventories: [],
    isFetchingInventories: false,
    fetchingInventoriesError: null,
    isDeletingInventory: false,
    deletingsInventoriesError: null,
    pendingInventories: [],
    isFetchingPendingInventories: false,
    fetchingPendingInventoriesError: null,
    inventory: null,
    isUpdatingInventory: false,
    updatingInventoriesError: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_SUB_INVENTORIES_STARTED: {
            return { ...state, isFetchingInventories: true };
        }
        case GET_SUB_INVENTORIES_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingInventories: false, inventories: data };
        }
        case GET_SUB_INVENTORIES_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingInventories: false, fetchingInventoriesError: error };
        }
        default: {
            return state;
        }
    }
}
