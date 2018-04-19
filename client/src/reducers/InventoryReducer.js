import { ADD_INVENTORY_STARTED, ADD_INVENTORY_FULFILLED, ADD_INVENTORY_REJECTED } from "./../actions/InventoryActions";
import { GET_INVENTORIES_STARTED, GET_INVENTORIES_FULFILLED, GET_INVENTORIES_REJECTED } from "./../actions/InventoryActions";
import { DELETE_INVENTORY_STARTED, DELETE_INVENTORY_FULFILLED, DELETE_INVENTORY_REJECTED } from "./../actions/InventoryActions";
import { GET_PENDING_INVENTORIES_STARTED, GET_PENDING_INVENTORIES_FULFILLED, GET_PENDING_INVENTORIES_REJECTED } from "./../actions/InventoryActions";
import { UPDATE_INVENTORY_STARTED, UPDATE_INVENTORY_FULFILLED, UPDATE_INVENTORY_REJECTED } from "./../actions/InventoryActions";
import { SET_UPDATING_INVENTORY_FULFILLED, CLEAR_INVENTORY_FULFILLED } from "./../actions/InventoryActions";
import { REJECT_UPDATING_INVENTORY } from "./../actions/InventoryActions";
import { APPROVE_INVENTORY_STARTED, APPROVE_INVENTORY_FULFILLED, APPROVE_INVENTORY_REJECTED } from "./../actions/InventoryActions";
import { ADD_CART_STARTED, ADD_CART_FULFILLED, ADD_CART_REJECTED } from "./../actions/InventoryActions";
import { UPDATE_CART_STARTED, UPDATE_CART_FULFILLED, UPDATE_CART_REJECTED } from "./../actions/InventoryActions";
import { DELETE_CART_STARTED, DELETE_CART_FULFILLED, DELETE_CART_REJECTED } from "./../actions/InventoryActions";
import { GET_CARTS_STARTED, GET_CARTS_FULFILLED, GET_CARTS_REJECTED } from "./../actions/InventoryActions";
import { TRACK_NUMBER, OPEN_MODAL, CLOSE_MODAL, OPEN_ADD, CLOSE_ADD, OPEN_PLUS, CLOSE_PLUS, ERROR_INPUT } from "./../actions/InventoryActions";
import { SUBMIT_ORDER_STARTED, SUBMIT_ORDER_FULFILLED, SUBMIT_ORDER_REJECTED } from "./../actions/InventoryActions";

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
    isAddingCart: false,
    addingCartError: null,
    pendingCarts: [],
    isFetchingCarts: false,
    fetchingCartsError: null,
    isUpdatingCart: false,
    updatingCartError: null,
    isDeletingCart: false,
    deletingCartError: null,
    quantity: null,
    modalCart: null,
    modal: false,
    dimmer: 'blurring',
    order: null,
    isAddingOrder: false,
    addingOrderError: null,
    openAdd: null,
    addIcon: true,
    closeIcon: false,
    errorInput: null,
    openPlus: null
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
            return { ...state, isUpdatingInventory: false, inventory: null, openPlus: null, quantity: null };
        }
        case UPDATE_INVENTORY_REJECTED: {
            const error = action.payload.data;
            return { ...state, isUpdatingInventory: false, updatingInventoriesError: error, openPlus: null, quantity: null };
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
        case TRACK_NUMBER: {
            var data = action.payload;
            const number = parseInt(data);
            return { ...state, quantity : number};
        }
        case ADD_CART_STARTED: {
            return { ...state, isAddingCart: true };
        }
        case ADD_CART_FULFILLED: {
            const data = action.payload;
            const newCart = state.pendingCarts.concat([data]);
            return { ...state, isAddingCart: false, pendingCarts : newCart, modalCart: null,
                        modal : false, quantity : null, openAdd: null, addIcon: true, closeIcon: false };
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
            return { ...state, openAdd : null, quantity: null, errorInput: null };
        }
        case OPEN_PLUS: {
          const data = action.payload;
            return { ...state, openPlus : data, quantity: null };
        }
        case CLOSE_PLUS: {
            return { ...state, openPlus : null, quantity: null, errorInput: null };
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
        case ERROR_INPUT: {
            const error = "Invalid Input";
            return {...state, errorInput: error };
        }
        default: {
            return state;
        }
    }
}
