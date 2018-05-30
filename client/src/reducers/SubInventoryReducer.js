import { GET_SUBINVENTORIES_STARTED, GET_SUBINVENTORIES_FULFILLED, GET_SUBINVENTORIES_REJECTED,
          GET_SUBINVENTORIES_TRASH_STARTED, GET_SUBINVENTORIES_TRASH_FULFILLED, GET_SUBINVENTORIES_TRASH_REJECTED,
          UPDATE_SUBINVENTORY_STARTED, UPDATE_SUBINVENTORY_FULFILLED, UPDATE_SUBINVENTORY_REJECTED,
          ADD_SUBINVENTORY_STARTED, ADD_SUBINVENTORY_FULFILLED, ADD_SUBINVENTORY_REJECTED,
          DELETE_SUBINVENTORY_STARTED, DELETE_SUBINVENTORY_FULFILLED, DELETE_SUBINVENTORY_REJECTED,
          SET_UPDATING_SUBINVENTORY_FULFILLED, INPUT_SKU, INPUT_DESC, FILL_DATA, ERROR_INPUT, CLEAR_ERROR,
          TRACK_NUMBER, OPEN_MODAL, CLOSE_MODAL, OPEN_ADD, CLOSE_ADD,
          ADD_CART_STARTED, ADD_CART_FULFILLED, ADD_CART_REJECTED,
          GET_CARTS_STARTED, GET_CARTS_FULFILLED, GET_CARTS_REJECTED,
          UPDATE_CART_STARTED, UPDATE_CART_FULFILLED, UPDATE_CART_REJECTED,
          DELETE_CART_STARTED, DELETE_CART_FULFILLED, DELETE_CART_REJECTED,
          SUBMIT_ORDER_STARTED, SUBMIT_ORDER_FULFILLED, SUBMIT_ORDER_REJECTED, CLEAR_INVENTORY_FULFILLED,
          RECOVER_SUBINVENTORY_STARTED, RECOVER_SUBINVENTORY_FULFILLED, RECOVER_SUBINVENTORY_REJECTED,
          DELETE_SUBINVENTORY_TRASH_STARTED, DELETE_SUBINVENTORY_TRASH_FULFILLED, DELETE_SUBINVENTORY_TRASH_REJECTED
         } from "./../actions/SubInventoryActions";

const initialState = {
    inventories: [],
    inventory: null,
    inventoriesInTrash: [],
    isAddingInventory: false,
    addingInventoryError: null,
    isFetchingInventories: false,
    fetchingInventoriesError: null,
    isUpdatingInventory: false,
    updatingInventoriesError: null,
    isDeletingInventory: false,
    deletingsInventoriesError: null,
    isFetchingInventoriesInTrash: false,
    fetchingInventoriesInTrashError: null,
    isRecoveringInventory: false,
    recoveringInventoryError: null,
    isDeletingInventoryInTrash: false,
    deletingInventoryInTrashError: null,
    sku: null,
    desc: null,
    generatedSKU: null,
    generatedDesc: null,
    errorInput: null,
    quantity: null,
    modalCart: null,
    modal: false,
    dimmer: 'blurring',
    isAddingCart: false,
    addingCartError: null,
    pendingCarts: [],
    isFetchingCarts: false,
    fetchingCartsError: null,
    isUpdatingCart: false,
    updatingCartError: null,
    isDeletingCart: false,
    deletingCartError: null,
    order: null,
    isAddingOrder: false,
    addingOrderError: null,
    openAdd: null,
    addIcon: true,
    closeIcon: false,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_SUBINVENTORY_STARTED: {
            return { ...state, isAddingInventory: true };
        }
        case ADD_SUBINVENTORY_FULFILLED: {
            const data = action.payload;
            //const newInventory = state.inventories.concat([data]);
            return { ...state, isAddingInventory: false, addingInventoryError: null };
        }
        case ADD_SUBINVENTORY_REJECTED: {
            const error = action.payload.data;
            return { ...state, isAddingInventory: false, addingInventoryError: error };
        }
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
        case GET_SUBINVENTORIES_TRASH_STARTED: {
            return { ...state, isFetchingInventoriesInTrash: true };
        }
        case GET_SUBINVENTORIES_TRASH_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingInventoriesInTrash: false, inventoriesInTrash: data };
        }
        case GET_SUBINVENTORIES_TRASH_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingInventoriesInTrash: false, fetchingInventoriesInTrashError: error };
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
        case DELETE_SUBINVENTORY_STARTED: {
            return { ...state, isDeletingInventory: true };
        }
        case DELETE_SUBINVENTORY_FULFILLED: {
            const id = action.payload;
            var index = 0;
            for (var i = 0; i < state.inventories.length; i++){
                if (state.inventories[i].id === id ){
                    index = i;
                }
            }
            state.inventories.splice(index,1);
            //newInv.splice(index,1);
            return { ...state, isDeletingInventory: false, deletingsInventoriesError: null };
        }
        case DELETE_SUBINVENTORY_REJECTED: {
            const error = action.payload.data;
            return { ...state, isDeletingInventory: false, deletingsInventoriesError: error };
        }
        case INPUT_SKU: {
            const data = action.payload;
            return { ...state, sku: data };
        }
        case INPUT_DESC: {
            const data = action.payload;
            return { ...state, desc: data };
        }
        case FILL_DATA:{
            const data = action.payload;
            return { ...state, generatedSKU: data.sku, generatedDesc: data.desc }
        }
        case ERROR_INPUT: {
            const error = action.payload;
            return {...state, errorInput: error };
        }
        case OPEN_MODAL: {
            const data = action.payload;
            return { ...state, modal: true, modalCart: data };
        }
        case CLOSE_MODAL: {
            return { ...state, modal: false, modalCart: null, quantity : null };
        }
        case OPEN_ADD: {
          const data = action.payload;
            return { ...state, openAdd : data, quantity: null };
        }
        case CLOSE_ADD: {
            return { ...state, openAdd : null, quantity: null };
        }
        case TRACK_NUMBER: {
            var data = action.payload;
            //const number = parseInt(data);
            return { ...state, quantity : data};
        }
        case ADD_CART_STARTED: {
            return { ...state, isAddingCart: true };
        }
        case ADD_CART_FULFILLED: {
            const data = action.payload;
            const newCart = state.pendingCarts.concat([data]);
            return { ...state, isAddingCart: false, pendingCarts : newCart, modalCart: null,
                        modal : false, quantity : null, openAdd: null };
        }
        case ADD_CART_REJECTED: {
            const error = action.payload.data;
            return { ...state, isAddingCart: false, addingCartError: error, modalCart: null,
                        modal : false, quantity: null };
        }
        case GET_CARTS_STARTED: {
            return { ...state, isFetchingCarts: true };
        }
        case GET_CARTS_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingCarts: false, pendingCarts: data };
        }
        case GET_CARTS_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingCarts: false, fetchingCartsError: error };
        }
        case UPDATE_CART_STARTED: {
            return { ...state, isUpdatingCart: true };
        }
        case UPDATE_CART_FULFILLED: {
            const data = action.payload;
            state.pendingCarts.forEach(function(cart){
                if (cart.id === data.id){
                     cart.quantity = data.quantity;
                }
            });
            return { ...state, isUpdatingCart: false, modalCart: null, modal: false, quantity : null,
                        openAdd: null, addIcon: true, closeIcon: false  };
        }
        case UPDATE_CART_REJECTED: {
            const error = action.payload.data;
            return { ...state, isUpdatingCart: false, updatingCartError: error, modalCart: null,
                        modal: false, quantity : null };
        }
        case DELETE_CART_STARTED: {
            return {...state, isDeletingCart: true};
        }
        case DELETE_CART_FULFILLED: {
            const cart = action.payload;
            var index = 0;
            for (var i = 0; i < state.pendingCarts.length; i++){
                if (state.pendingCarts[i].id === cart.id ){
                    index = i;
                }
            }
            const newCarts = state.pendingCarts;
            newCarts.splice(index,1);
            return {...state, isDeletingCart: false, pendingCarts: newCarts};
        }
        case DELETE_CART_REJECTED: {
            const error = action.payload.data;
            return {...state, isDeletingCart: false, deletingCartError: error};
        }
        case SUBMIT_ORDER_STARTED: {
            return {...state, isAddingOrder: true};
        }
        case SUBMIT_ORDER_FULFILLED: {
            const data = action.payload;
            return {...state, isAddingOrder: false, order: data, pendingCarts: []};
        }
        case SUBMIT_ORDER_REJECTED: {
            const error = action.payload.data;
            return {...state, isAddingOrder: false, addingOrderError: error};
        }
        case CLEAR_INVENTORY_FULFILLED:{
            return { ...state, inventory: null};
        }
        case RECOVER_SUBINVENTORY_STARTED:{
            return { ...state, isRecoveringInventory: true };
        }
        case RECOVER_SUBINVENTORY_FULFILLED: {
            const id = action.payload;
            var index = 0;
            for (var i = 0; i < state.inventoriesInTrash.length; i++){
                if (state.inventoriesInTrash[i].id === id ){
                    index = i;
                }
            }
            state.inventoriesInTrash.splice(index,1);
            return { ...state, isRecoveringInventory: false };
        }
        case RECOVER_SUBINVENTORY_REJECTED:{
            const error = action.payload;
            return { ...state, isRecoveringInventory: false, recoveringInventoryError: error };
        }
        case DELETE_SUBINVENTORY_TRASH_STARTED: {
            return { ...state, isDeletingInventoryInTrash: true };
        }
        case DELETE_SUBINVENTORY_TRASH_FULFILLED: {
            const id = action.payload;
            var index = 0;
            for (var i = 0; i < state.inventoriesInTrash.length; i++){
                if (state.inventoriesInTrash[i].id === id ){
                    index = i;
                }
            }
            state.inventoriesInTrash.splice(index,1);
            return { ...state, isDeletingInventoryInTrash: false, deletingInventoryInTrashError: null };
        }
        case DELETE_SUBINVENTORY_TRASH_REJECTED: {
            const error = action.payload.data;
            return { ...state, isDeletingInventoryInTrash: false, deletingInventoryInTrashError: error };
        }
        default: {
            return state;
        }
    }
}
