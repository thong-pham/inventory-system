import { ADD_LOCATION_STARTED, ADD_LOCATION_FULFILLED, ADD_LOCATION_REJECTED,
         GET_LOCATIONS_STARTED, GET_LOCATIONS_FULFILLED, GET_LOCATIONS_REJECTED,
         DELETE_LOCATION_STARTED, DELETE_LOCATION_FULFILLED, DELETE_LOCATION_REJECTED,
         GET_PENDING_LOCATIONS_STARTED, GET_PENDING_LOCATIONS_FULFILLED, GET_PENDING_LOCATIONS_REJECTED,
         UPDATE_LOCATION_STARTED, UPDATE_LOCATION_FULFILLED, UPDATE_LOCATION_REJECTED,
         SET_UPDATING_LOCATION_FULFILLED, CHANGE_LOCATION, CANCEL_CHANGE, TRACK_LOCATION, ERROR_INPUT_LOCATION,
         CHANGE_PRODUCT_LOCATION, CANCEL_LOCATION_CHANGE, TRACK_NEW_LOCATION, TRACK_NEW_QUANTITY,
         MOVE_PRODUCT_STARTED, MOVE_PRODUCT_FULFILLED, MOVE_PRODUCT_REJECTED
         } from "./../actions/LocationActions";

const initialState = {
    locations: [],
    isAddingLocation: false,
    addingLocationError: null,
    isFetchingLocations: false,
    fetchingLocationsError: null,
    isDeletingLocation: false,
    deletingsLocationsError: null,
    pendingLocations: [],
    isFetchingPendingLocations: false,
    fetchingPendingLocationsError: null,
    isMovingProduct: false,
    movingProductError: null,
    location: null,
    isUpdatingLocation: false,
    updatingLocationsError: null,
    nameChange: null,
    newName: null,
    errorInput: null,
    locationChange: null,
    productChange: null,
    newLocation: null,
    newQuantity: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_LOCATION_STARTED: {
            return { ...state, isAddingLocation: true };
        }
        case ADD_LOCATION_FULFILLED: {
            const data = action.payload;
            const newLocation = state.locations.concat([data]);
            return { ...state, isAddingLocation: false, locations: newLocation, addingLocationError: null };
        }
        case ADD_LOCATION_REJECTED: {
            const error = action.payload.data;
            return { ...state, isAddingLocation: false, addingLocationError: error };
        }
        case GET_LOCATIONS_STARTED: {
            return { ...state, isFetchingLocations: true };
        }
        case GET_LOCATIONS_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingLocations: false, locations: data };
        }
        case GET_LOCATIONS_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingLocations: false, fetchingLocationsError: error };
        }
        case DELETE_LOCATION_STARTED: {
            return { ...state, isDeletingLocation: true };
        }
        case DELETE_LOCATION_FULFILLED: {
            const data = action.payload;
            return { ...state, isDeletingLocation: false, deletingsLocationsError: null };
        }
        case DELETE_LOCATION_REJECTED: {
            const error = action.payload.data;
            return { ...state, isDeletingLocation: false, deletingsLocationsError: error };
        }
        case GET_PENDING_LOCATIONS_STARTED: {
            return { ...state, isFetchingPendingLocations: true };
        }
        case GET_PENDING_LOCATIONS_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingPendingLocations: false, pendingLocations: data };
        }
        case GET_PENDING_LOCATIONS_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingPendingLocations: false, fetchingPendingLocationsError: error };
        }
        case UPDATE_LOCATION_STARTED: {
            return { ...state, isUpdatingLocation: true };
        }
        case UPDATE_LOCATION_FULFILLED: {
            const data = action.payload;
            return { ...state, isUpdatingLocation: false, location: null, updatingLocationsError: null, nameChange: null, errorInput: null };
        }
        case UPDATE_LOCATION_REJECTED: {
            const error = action.payload.data;
            return { ...state, isUpdatingLocation: false, updatingLocationsError: error, nameChange: null, errorInput: null };
        }
        case SET_UPDATING_LOCATION_FULFILLED: {
            const id = action.payload;
            const inv = state.inventories.filter(function (element) {
                return element.id == id;
            })[0];
            return Object.assign({}, state, { location: inv });
        }
        case CHANGE_LOCATION: {
           const data = action.payload;
           return { ...state, nameChange: data };
        }
        case CANCEL_CHANGE:{
            return { ...state, nameChange: null, errorInput: null };
        }
        case TRACK_LOCATION:{
            const data = action.payload;
            return { ...state, newName: data };
        }
        case ERROR_INPUT_LOCATION: {
            const data = action.payload;
            return { ...state, errorInput: data};
        }
        case CHANGE_PRODUCT_LOCATION: {
            const data = action.payload;
            return { ...state, productChange: data.productId, locationChange: data.locationId}
        }
        case CANCEL_LOCATION_CHANGE: {
            return { ...state, productChange: null, locationChange: null}
        }
        case TRACK_NEW_LOCATION: {
            const data = action.payload;
            return { ...state, newLocation: data }
        }
        case TRACK_NEW_QUANTITY: {
            const data = action.payload;
            return { ...state, newQuantity: data }
        }
        case MOVE_PRODUCT_STARTED: {
            return { ...state, isMovingProduct: true}
        }
        case MOVE_PRODUCT_FULFILLED: {
            return { ...state, isMovingProduct: false, productChange: null, locationChange: null}
        }
        case MOVE_PRODUCT_REJECTED: {
            const error = action.payload.data;
            return { ...state, movingProductError: error}
        }
        default: {
            return state;
        }
    }
}
