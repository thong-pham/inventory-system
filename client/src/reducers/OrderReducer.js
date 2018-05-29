import { APPROVE_ORDER_STARTED, APPROVE_ORDER_FULFILLED, APPROVE_ORDER_REJECTED,
         GET_PENDING_ORDERS_STARTED, GET_PENDING_ORDERS_FULFILLED, GET_PENDING_ORDERS_REJECTED,
         GET_APPROVED_ORDERS_STARTED, GET_APPROVED_ORDERS_FULFILLED, GET_APPROVED_ORDERS_REJECTED,
         GET_CANCELED_ORDERS_STARTED, GET_CANCELED_ORDERS_FULFILLED, GET_CANCELED_ORDERS_REJECTED,
         CHANGE_ORDER_STARTED, CHANGE_ORDER_FULFILLED, CHANGE_ORDER_REJECTED,
         DELETE_ORDER_STARTED, DELETE_ORDER_FULFILLED, DELETE_ORDER_REJECTED,
         CANCEL_ORDER_STARTED, CANCEL_ORDER_FULFILLED, CANCEL_ORDER_REJECTED,
         CHANGE_POPUP, CLOSE_POPUP, TRACK_NUMBER, SET_VIEWING_ORDER, ERROR_INPUT_ORDER
         } from "./../actions/OrderActions";

const initialState = {
    pendingOrders: [],
    approvedOrders: [],
    canceledOrders: [],
    isFetchingPendingOrders: false,
    fetchingPendingOrdersError: null,
    isFetchingApprovedOrders: false,
    fetchingApprovedOrdersError: null,
    isFetchingCanceledOrders: false,
    fetchingCanceledOrdersError: null,
    isApprovingOrder: false,
    approvingOrderError: null,
    isChangingOrder: false,
    changingOrderError: null,
    isDeletingOrder: false,
    deletingOrderError: null,
    isCancelingOrder: false,
    cancelingOrderError: null,
    order: null,
    response: null,
    change: null,
    quantity: null,
    add: false,
    cartErrors: null,
    orderError: null,
    errorInput: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_PENDING_ORDERS_STARTED: {
            return { ...state, isFetchingPendingOrders: true };
        }
        case GET_PENDING_ORDERS_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingPendingOrders: false, pendingOrders: data };
        }
        case GET_PENDING_ORDERS_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingPendingOrders: false, fetchingPendingOrdersError: error };
        }
        case GET_APPROVED_ORDERS_STARTED: {
            return { ...state, isFetchingApprovedOrders: true };
        }
        case GET_APPROVED_ORDERS_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingApprovedOrders: false, approvedOrders: data };
        }
        case GET_APPROVED_ORDERS_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingApprovedOrders: false, fetchingApprovedOrdersError: error };
        }
        case GET_CANCELED_ORDERS_STARTED:{
            return { ...state, isFetchingCanceledOrders: true };
        }
        case GET_CANCELED_ORDERS_FULFILLED:{
            const data = action.payload;
            return { ...state, isFetchingCanceledOrders: false, canceledOrders: data };
        }
        case GET_CANCELED_ORDERS_REJECTED:{
            const error = action.payload.data;
            return { ...state, isFetchingCanceledOrders: false, fetchingCanceledOrdersError: error };
        }
        case APPROVE_ORDER_STARTED: {
            return { ...state, isApprovingOrder: true };
        }
        case APPROVE_ORDER_FULFILLED: {
            const id = action.payload;
            var index = 0;
            for (var i = 0; i < state.pendingOrders.length; i++){
                if (state.pendingOrders[i].id === id ){
                    index = i;
                }
            }
            state.pendingOrders.splice(index,1);
            return { ...state, isApprovingOrder: false, approvingOrderError: null  };
        }
        case APPROVE_ORDER_REJECTED: {
            //console.log(action.payload.data);
            const error = action.payload.data.message;
            const { denies, id } = action.payload.data;
            return { ...state, isApprovingOrder: false, approvingOrderError: error, cartErrors: denies, orderError: id };
        }
        case CHANGE_ORDER_STARTED: {
            return {...state, isChangingOrder: true };
        }
        case CHANGE_ORDER_FULFILLED: {
            const data = action.payload;
            return {...state, isChangingOrder: false, change: false, quantity: null, changingOrderError: null, cartError: null, approvingOrderError: null };
        }
        case CHANGE_ORDER_REJECTED: {
            const data = action.payload.data;
            return {...state, isChangingOrder: false, changingOrderError: data };
        }
        case DELETE_ORDER_STARTED: {
            return {...state, isDeletingOrder: true };
        }
        case DELETE_ORDER_FULFILLED: {
            const id = action.payload;
            var index = 0;
            for (var i = 0; i < state.pendingOrders.length; i++){
                if (state.pendingOrders[i].id === id ){
                    index = i;
                }
            }
            state.pendingOrders.splice(index,1);
            return {...state, isDeletingOrder: false, deletingOrderError: null };
        }
        case DELETE_ORDER_REJECTED: {
            const error = action.payload.data;
            return {...state, isDeletingOrder: false, deletingOrderError: error };
        }
        case CANCEL_ORDER_STARTED:{
            return {...state, isCancelingOrder: true };
        }
        case CANCEL_ORDER_FULFILLED:{
            const id = action.payload;
            var index = 0;
            for (var i = 0; i < state.pendingOrders.length; i++){
                if (state.pendingOrders[i].id === id ){
                    index = i;
                }
            }
            state.pendingOrders.splice(index,1);
            return { ...state, isCancelingOrder: false, cancelingOrderError: null };
        }
        case CANCEL_ORDER_REJECTED:{
            const error = action.payload.data;
            return { ...state, isCancelingOrder: false, cancelingOrderError: error };
        }
        case CHANGE_POPUP: {
            const data = action.payload;
            return {...state, change: data, quantity: null}
        }
        case CLOSE_POPUP: {
            return {...state, change: null, errorInput: null, quantity: null }
        }
        case TRACK_NUMBER: {
            var data = action.payload;
            //const number = parseInt(data);
            return { ...state, quantity : data};
        }
        case SET_VIEWING_ORDER: {
            const id = action.payload;
            const newOrder = state.pendingOrders.filter(function (element) {
                return element.id == id;
            })[0];
            return { ...state, order: newOrder };
        }
        case ERROR_INPUT_ORDER: {
            const error = action.payload;
            return {...state, errorInput: error };
        }
        default: {
            return state;
        }
    }
}
