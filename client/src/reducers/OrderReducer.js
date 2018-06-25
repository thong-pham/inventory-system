import { APPROVE_ORDER_STARTED, APPROVE_ORDER_FULFILLED, APPROVE_ORDER_REJECTED,
         GET_PENDING_ORDERS_STARTED, GET_PENDING_ORDERS_FULFILLED, GET_PENDING_ORDERS_REJECTED,
         GET_PROCESSED_ORDERS_STARTED, GET_PROCESSED_ORDERS_FULFILLED, GET_PROCESSED_ORDERS_REJECTED,
         CHANGE_ORDER_STARTED, CHANGE_ORDER_FULFILLED, CHANGE_ORDER_REJECTED,
         DELETE_ORDER_STARTED, DELETE_ORDER_FULFILLED, DELETE_ORDER_REJECTED,
         CANCEL_ORDER_STARTED, CANCEL_ORDER_FULFILLED, CANCEL_ORDER_REJECTED,
         CHANGE_POPUP, CLOSE_POPUP, TRACK_NUMBER_ORDER, SET_VIEWING_ORDER, ERROR_INPUT_ORDER, SET_VIEWING_PROCESSED_ORDER,
         SORT_ORDER, REV_ORDER, FILTER_STATUS, FILTER_COMPANY, RENDER_PAGE, RECOVER_PAGE
         } from "./../actions/OrderActions";

const initialState = {
    pendingOrders: [],
    processedOrders: [],
    isFetchingPendingOrders: false,
    fetchingPendingOrdersError: null,
    isFetchingProcessedOrders: false,
    fetchingProcessedOrdersError: null,
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
    errorInput: null,
    checkApproved: false,
    checkCanceled: false,
    checkCompany: null,
    backUpOrders: null,
    loader: false,
    allPages: [],
    activePage: 1
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
        case RENDER_PAGE:{
            const data = action.payload;
            return { ...state, processedOrders: state.allPages[data-1], activePage: data};
        }
        case RECOVER_PAGE: {
            const data = state.backUpOrders;
            const page = Math.ceil(data.length/10);
            const max = 10;
            var newOrder = [];

            for (var i = 0; i < page; i++){
                var temp = [];
                for (var j = i*max; j < (i+1)*max; j++){
                    if (j < data.length) {
                        temp.push(data[j]);
                    }
                }
                newOrder.push(temp);
            }
            return { ...state, processedOrders: newOrder[0], allPages: newOrder, activePage: 1 };
        }
        case GET_PROCESSED_ORDERS_STARTED: {
            return { ...state, isFetchingProcessedOrders: true };
        }
        case GET_PROCESSED_ORDERS_FULFILLED: {
            const data = action.payload;
            const page = Math.ceil(data.length/10);
            const max = 10;
            var newOrder = [];

            for (var i = 0; i < page; i++){
                var temp = [];
                for (var j = i*max; j < (i+1)*max; j++){
                    if (j < data.length) {
                        temp.push(data[j]);
                    }
                }
                newOrder.push(temp);
            }
            return { ...state, isFetchingProcessedOrders: false, processedOrders: newOrder[0], allPages: newOrder, backUpOrders: data, activePage: 1 };
        }
        case GET_PROCESSED_ORDERS_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingProcessedOrders: false, fetchingProcessedOrdersError: error };
        }
        case APPROVE_ORDER_STARTED: {
            return { ...state, isApprovingOrder: true, loader: true };
        }
        case APPROVE_ORDER_FULFILLED: {
            const data = action.payload;
            // var index = 0;
            // for (var i = 0; i < state.pendingOrders.length; i++){
            //     if (state.pendingOrders[i].id === id ){
            //         index = i;
            //     }
            // }
            // state.pendingOrders.splice(index,1);
            return { ...state, isApprovingOrder: false, approvingOrderError: null, loader: false  };
        }
        case APPROVE_ORDER_REJECTED: {
            //console.log(action.payload.data);
            const error = action.payload.data.message;
            const { denies, id } = action.payload.data;
            return { ...state, isApprovingOrder: false, approvingOrderError: error, cartErrors: denies, orderError: id, loader: false };
        }
        case CHANGE_ORDER_STARTED: {
            return {...state, isChangingOrder: true };
        }
        case CHANGE_ORDER_FULFILLED: {
            if (action.payload.type === "Change"){
                const { cartId, quantity } = action.payload.change;
                state.order.details.forEach(function(cart){
                    if (cart.id === cartId){
                        cart.accept = quantity;
                    }
                });
            }
            if (action.payload.type === "Delete"){
                const { cartId } = action.payload.item;
                var index = 0;
                for (var i = 0; i < state.order.details.length; i++){
                    if (state.order.details[i].id === cartId ){
                        index = i;
                    }
                }
                state.order.details.splice(index,1);
            }
            return {...state, isChangingOrder: false, quantity: null, changingOrderError: null, cartError: null, approvingOrderError: null };
        }
        case CHANGE_ORDER_REJECTED: {
            const error = action.payload.data;
            return {...state, isChangingOrder: false, changingOrderError: error };
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
        case TRACK_NUMBER_ORDER: {
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
        case SET_VIEWING_PROCESSED_ORDER: {
            const id = action.payload;
            const newOrder = state.processedOrders.filter(function (element) {
                return element.id == id;
            })[0];
            return { ...state, order: newOrder };
        }
        case ERROR_INPUT_ORDER: {
            const error = action.payload;
            return {...state, errorInput: error };
        }
        case SORT_ORDER:{
            const data = action.payload;
            if (data === 'time') state.pendingOrders.sort(compareTime);
            return { ...state };
        }
        case REV_ORDER:{
            state.pendingOrders.reverse();
            return { ...state };
        }
        case FILTER_STATUS:{
            const data = action.payload;
            var orders = [];
            if (data === "Approved"){
                if (state.checkApproved === true){
                    state.checkApproved = false;
                    orders = state.backUpOrders;
                }
                else {
                    state.checkApproved = true;
                    state.checkCanceled = false;
                    orders = state.backUpOrders.filter(element => element.status === data.toLowerCase());
                    state.checkCompany = 'All';
                }
            }
            if (data === "Canceled"){
                if (state.checkCanceled === true){
                    state.checkCanceled = false;
                    orders = state.backUpOrders;
                }
                else {
                    state.checkApproved = false;
                    state.checkCanceled = true;
                    orders = state.backUpOrders.filter(element => element.status === data.toLowerCase());
                    state.checkCompany = 'All';
                }
            }
            const page = Math.ceil(orders.length/10);
            const max = 10;
            var newOrder = [];

            for (var i = 0; i < page; i++){
                var temp = [];
                for (var j = i*max; j < (i+1)*max; j++){
                    if (j < orders.length) {
                        temp.push(orders[j]);
                    }
                }
                newOrder.push(temp);
            }
            return { ...state, processedOrders: newOrder[0], allPages: newOrder, activePage: 1 };
        }
        case FILTER_COMPANY:{
              const data = action.payload;
              var orders = [];
              if (data !== "All"){
                  orders = state.backUpOrders.filter(element => element.company === data);
                  state.checkApproved = false;
                  state.checkCanceled = false;
              }
              else {
                  orders = state.backUpOrders;
                  state.checkApproved = false;
                  state.checkCanceled = false;
              }
              const page = Math.ceil(orders.length/10);
              const max = 10;
              var newOrder = [];

              for (var i = 0; i < page; i++){
                  var temp = [];
                  for (var j = i*max; j < (i+1)*max; j++){
                      if (j < orders.length) {
                          temp.push(orders[j]);
                      }
                  }
                  newOrder.push(temp);
              }
              return { ...state, checkCompany: data, processedOrders: newOrder[0], allPages: newOrder, activePage: 1 };
        }
        default: {
            return state;
        }
    }
}

function compareTime(a,b){
    const idA = a.createdAt;
    const idB = b.createdAt;

    let comparision = 0;
    if (idA > idB) {
        comparision = 1;
    }
    else if (idA < idB){
        comparision = -1;
    }
    return comparision;
}
