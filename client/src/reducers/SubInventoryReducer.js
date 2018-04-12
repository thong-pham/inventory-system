import { GET_SUBINVENTORIES_STARTED, GET_SUBINVENTORIES_FULFILLED, GET_SUBINVENTORIES_REJECTED } from "./../actions/SubInventoryActions";
//import { DELETE_INVENTORY_STARTED, DELETE_INVENTORY_FULFILLED, DELETE_INVENTORY_REJECTED } from "./../actions/InventoryActions";
import { UPDATE_SUBINVENTORY_STARTED, UPDATE_SUBINVENTORY_FULFILLED, UPDATE_SUBINVENTORY_REJECTED } from "./../actions/SubInventoryActions";
import { SET_UPDATING_SUBINVENTORY_FULFILLED } from "./../actions/SubInventoryActions";

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
        case GET_SUBINVENTORIES_STARTED: {
            return { ...state, isFetchingInventories: true };
        }
        case GET_SUBINVENTORIES_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingInventories: false, inventories: data };
        }
        case GET_SUBINVENTORIES_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingInventories: false, fetchingInventoriesError: error };
        }
        case SET_UPDATING_SUBINVENTORY_FULFILLED: {
            const id = action.payload;
            const inv = state.inventories.filter(function (element) {
                return element.id == id;
            })[0];
            return Object.assign({}, state, { inventory: inv });
        }
        case UPDATE_SUBINVENTORY_STARTED: {
              return {...state, isUpdatingInventory: true};
        }
        case UPDATE_SUBINVENTORY_FULFILLED: {
            const data = action.payload;
            return {...state, isUpdatingInventory: false, inventory: null};
        }
        case UPDATE_SUBINVENTORY_REJECTED: {
            const data = action.payload.data;
            return {...state, isUpdatingInventory: false, updatingInventoriesError: data};
        }
        default: {
            return state;
        }
    }
}
