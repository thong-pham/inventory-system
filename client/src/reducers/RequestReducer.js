import { REQUEST_INVENTORY_STARTED, REQUEST_INVENTORY_FULFILLED, REQUEST_INVENTORY_REJECTED } from "./../actions/RequestActions";
import { APPROVE_REQUEST_STARTED, APPROVE_REQUEST_FULFILLED, APPROVE_REQUEST_REJECTED } from "./../actions/RequestActions";
import { GET_PENDING_REQUESTS_STARTED, GET_PENDING_REQUESTS_FULFILLED, GET_PENDING_REQUESTS_REJECTED } from "./../actions/RequestActions";
import { SET_REQUESTING_INVENTORY_FULFILLED } from "./../actions/RequestActions";

const initialState = {
    isRequestingInventory: false,
    requestingInventoryError: null,
    pendingRequests: [],
    isFetchingPendingRequests: false,
    fetchingPendingRequestsError: null,
    isApprovingRequest: false,
    approvingRequestError: null,
    request: null,
    inventories: [],
    inventory: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case REQUEST_INVENTORY_STARTED: {
            return { ...state, isRequestingInventory: true };
        }
        case REQUEST_INVENTORY_FULFILLED: {
            const data = action.payload;
            return { ...state, isRequestingInventory: false, inventory: null };
        }
        case REQUEST_INVENTORY_REJECTED: {
            const error = action.payload.data;
            return { ...state, isRequestingInventory: false, requestingInventoryError: error };
        }
        case SET_REQUESTING_INVENTORY_FULFILLED: {
            const id = action.payload;
            const inv = state.inventories.filter(function (element) {
                return element.id == id;
            })[0];
            return Object.assign({}, state, { inventory : inv });
        }
        case GET_PENDING_REQUESTS_STARTED: {
            return { ...state, isFetchingPendingRequests: true };
        }
        case GET_PENDING_REQUESTS_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingPendingRequests: false, pendingRequests: data };
        }
        case GET_PENDING_REQUESTS_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingPendingRequests: false, fetchingPendingRequestsError: error };
        }
        case APPROVE_REQUEST_STARTED: {
            return { ...state, isApprovingRequest: true };
        }
        case APPROVE_REQUEST_FULFILLED: {
            const data = action.payload;
            return { ...state, isApprovingRequest: false, request: null };
        }
        case APPROVE_REQUEST_REJECTED: {
            const error = action.payload.data;
            return { ...state, isApprovingRequest: false, approvingRequestError: error };
        }
        default: {
            return state;
        }
    }
}
