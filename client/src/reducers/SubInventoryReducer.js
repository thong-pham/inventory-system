import { GET_SUBINVENTORIES_STARTED, GET_SUBINVENTORIES_FULFILLED, GET_SUBINVENTORIES_REJECTED,
          GET_SUBINVENTORIES_TRASH_STARTED, GET_SUBINVENTORIES_TRASH_FULFILLED, GET_SUBINVENTORIES_TRASH_REJECTED,
          UPDATE_SUBINVENTORY_STARTED, UPDATE_SUBINVENTORY_FULFILLED, UPDATE_SUBINVENTORY_REJECTED,
          ADD_SUBINVENTORY_STARTED, ADD_SUBINVENTORY_FULFILLED, ADD_SUBINVENTORY_REJECTED,
          DELETE_SUBINVENTORY_STARTED, DELETE_SUBINVENTORY_FULFILLED, DELETE_SUBINVENTORY_REJECTED,
          SET_UPDATING_SUBINVENTORY_FULFILLED, INPUT_SKU, INPUT_DESC, FILL_DATA_SINV, ERROR_INPUT_SINV, CLEAR_ERROR,
          TRACK_NUMBER_SINV, OPEN_MODAL, CLOSE_MODAL, OPEN_ADD, CLOSE_ADD,
          ADD_CART_STARTED, ADD_CART_FULFILLED, ADD_CART_REJECTED,
          GET_CARTS_STARTED, GET_CARTS_FULFILLED, GET_CARTS_REJECTED,
          UPDATE_CART_STARTED, UPDATE_CART_FULFILLED, UPDATE_CART_REJECTED,
          DELETE_CART_STARTED, DELETE_CART_FULFILLED, DELETE_CART_REJECTED,
          SUBMIT_ORDER_STARTED, SUBMIT_ORDER_FULFILLED, SUBMIT_ORDER_REJECTED, CLEAR_INVENTORY_FULFILLED,
          RECOVER_SUBINVENTORY_STARTED, RECOVER_SUBINVENTORY_FULFILLED, RECOVER_SUBINVENTORY_REJECTED,
          DELETE_SUBINVENTORY_TRASH_STARTED, DELETE_SUBINVENTORY_TRASH_FULFILLED, DELETE_SUBINVENTORY_TRASH_REJECTED,
          FILTER_SUBINVENTORY, RECOVER_PAGE_SINV, RENDER_PAGE_SINV, CHANGE_DISPLAY_SUB, SORT_SUBINVENTORY, REV_SUBINVENTORY
         } from "./../actions/SubInventoryActions";

const initialState = {
    inventories: [],
    backUpInv: [],
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
    allPages: [],
    activePage: 1,
    displayNumber: 15,
    filteredInv: [],
    search : false
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
            const displayNumber = state.displayNumber;
            const data = action.payload;
            const page = Math.ceil(data.length/displayNumber);
            const max = displayNumber;
            var newInv = [];

            for (var i = 0; i < page; i++){
                var temp = [];
                for (var j = i*max; j < (i+1)*max; j++){
                    if (j < data.length) {
                        temp.push(data[j]);
                    }
                }
                newInv.push(temp);
            }
            return { ...state, isFetchingInventories: false, inventories: newInv[0], allPages: newInv, backUpInv: data, activePage: 1 };
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
            var backIndex = 0;
            for (var i = 0; i < state.inventories.length; i++){
                if (state.inventories[i].id === id ){
                    index = i;
                }
            }
            for (var i = 0; i < state.backUpInv.length; i++){
                if (state.backUpInv[i].id === id ){
                    backIndex = i;
                }
            }
            state.inventories.splice(index,1);
            state.backUpInv.splice(backIndex,1);
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
        case FILL_DATA_SINV:{
            const data = action.payload;
            return { ...state, generatedSKU: data.sku, generatedDesc: data.desc }
        }
        case ERROR_INPUT_SINV: {
            const error = action.payload;
            return {...state, errorInput: error };
        }
        case OPEN_MODAL: {
            const data = action.payload;
            return { ...state, modal: true, modalCart: data };
        }
        case CLOSE_MODAL: {
            return { ...state, modal: false, modalCart: null, quantity : null, openAdd: null };
        }
        case OPEN_ADD: {
          const data = action.payload;
            return { ...state, openAdd : data, quantity: null };
        }
        case CLOSE_ADD: {
            return { ...state, openAdd : null, quantity: null };
        }
        case TRACK_NUMBER_SINV: {
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
            const error = action.payload.data;
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
        case FILTER_SUBINVENTORY: {
            const data = action.payload;
            const displayNumber = state.displayNumber;
            var list = data.split(' ');

            state.filteredInv = state.backUpInv.filter((element) => {
                  var count = 0;
                  for (var i = 0; i < list.length; i++){
                      if (element.productName.en.toLowerCase().includes(list[i])){
                          count += 1;
                      }
                  }
                  if (count === list.length) return element;
            });
            if (state.filteredInv.length > 0){
                const page = Math.ceil(state.filteredInv.length/displayNumber);
                const max = displayNumber;
                var newInv = [];

                for (var i = 0; i < page; i++){
                    var temp = [];
                    for (var j = i*max; j < (i+1)*max; j++){
                        if (j < state.filteredInv.length) {
                            temp.push(state.filteredInv[j]);
                        }
                    }
                    newInv.push(temp);
                }
                state.inventories = newInv[0];
                state.allPages = newInv;
            }
            else {
                state.inventories = [];
                state.allPages = [];
            }

            return { ...state, activePage: 1, search: true };
        }
        case RENDER_PAGE_SINV:{
            const data = action.payload;
            return { ...state, inventories: state.allPages[data-1], activePage: data};
        }
        case RECOVER_PAGE_SINV: {
            const displayNumber = state.displayNumber;
            const data = state.backUpInv;
            const page = Math.ceil(data.length/displayNumber);
            const max = displayNumber;
            var newInv = [];

            for (var i = 0; i < page; i++){
                var temp = [];
                for (var j = i*max; j < (i+1)*max; j++){
                    if (j < data.length) {
                        temp.push(data[j]);
                    }
                }
                newInv.push(temp);
            }
            return { ...state, inventories: newInv[0], allPages: newInv, activePage: 1, search: false, filteredInv: [] };
        }
        case CHANGE_DISPLAY_SUB:{
            const displayNumber = action.payload;
            var data = [];
            if (!state.search) {
                data = state.backUpInv;
            }
            else {
                data = state.filteredInv;
            }
            if (data.length > 0){
                const page = Math.ceil(data.length/displayNumber);
                const max = displayNumber;
                var newInv = [];

                for (var i = 0; i < page; i++){
                    var temp = [];
                    for (var j = i*max; j < (i+1)*max; j++){
                        if (j < data.length) {
                            temp.push(data[j]);
                        }
                    }
                    newInv.push(temp);
                }
                state.inventories = newInv[0];
                state.allPages = newInv;
            }
            else {
                state.inventories = [];
                state.allPages = [];
            }
            return { ...state, displayNumber, activePage: 1 };
        }
        case SORT_SUBINVENTORY:{
            const option = action.payload;
            const displayNumber = state.displayNumber;
            //var data = [];
            if (!state.search) {
                if (option === 'sku'){
                    state.backUpInv.sort(compareSku);
                    const page = Math.ceil(state.backUpInv.length/displayNumber);
                    const max = displayNumber;
                    var newInv = [];

                    for (var i = 0; i < page; i++){
                        var temp = [];
                        for (var j = i*max; j < (i+1)*max; j++){
                            if (j < state.backUpInv.length) {
                                temp.push(state.backUpInv[j]);
                            }
                        }
                        newInv.push(temp);
                    }
                }
                else if (option === 'productName.en') {
                    state.backUpInv.sort(compareDesc);
                    const page = Math.ceil(state.backUpInv.length/displayNumber);
                    const max = displayNumber;
                    var newInv = [];

                    for (var i = 0; i < page; i++){
                        var temp = [];
                        for (var j = i*max; j < (i+1)*max; j++){
                            if (j < state.backUpInv.length) {
                                temp.push(state.backUpInv[j]);
                            }
                        }
                        newInv.push(temp);
                    }
                }
                else if (option === 'stock') {
                    state.backUpInv.sort(compareStock);
                    const page = Math.ceil(state.backUpInv.length/displayNumber);
                    const max = displayNumber;
                    var newInv = [];

                    for (var i = 0; i < page; i++){
                        var temp = [];
                        for (var j = i*max; j < (i+1)*max; j++){
                            if (j < state.backUpInv.length) {
                                temp.push(state.backUpInv[j]);
                            }
                        }
                        newInv.push(temp);
                    }
                }
            }
            else {
                if (option === 'sku'){
                    state.filteredInv.sort(compareSku);
                    const page = Math.ceil(state.filteredInv.length/displayNumber);
                    const max = displayNumber;
                    var newInv = [];

                    for (var i = 0; i < page; i++){
                        var temp = [];
                        for (var j = i*max; j < (i+1)*max; j++){
                            if (j < state.filteredInv.length) {
                                temp.push(state.filteredInv[j]);
                            }
                        }
                        newInv.push(temp);
                    }
                }
                else if (option === 'productName.en') {
                    state.filteredInv.sort(compareDesc);
                    const page = Math.ceil(state.filteredInv.length/displayNumber);
                    const max = displayNumber;
                    var newInv = [];

                    for (var i = 0; i < page; i++){
                        var temp = [];
                        for (var j = i*max; j < (i+1)*max; j++){
                            if (j < state.filteredInv.length) {
                                temp.push(state.filteredInv[j]);
                            }
                        }
                        newInv.push(temp);
                    }
                }
                else if (option === 'stock') {
                    state.filteredInv.sort(compareStock);
                    const page = Math.ceil(state.filteredInv.length/displayNumber);
                    const max = displayNumber;
                    var newInv = [];

                    for (var i = 0; i < page; i++){
                        var temp = [];
                        for (var j = i*max; j < (i+1)*max; j++){
                            if (j < state.filteredInv.length) {
                                temp.push(state.filteredInv[j]);
                            }
                        }
                        newInv.push(temp);
                    }
                }
            }


            return { ...state, inventories: newInv[0], allPages: newInv, activePage: 1 };
        }
        case REV_SUBINVENTORY:{
            const displayNumber = state.displayNumber;
            if (!state.search){
                state.backUpInv.reverse();
                const page = Math.ceil(state.backUpInv.length/displayNumber);
                const max = displayNumber;
                var newInv = [];

                for (var i = 0; i < page; i++){
                    var temp = [];
                    for (var j = i*max; j < (i+1)*max; j++){
                        if (j < state.backUpInv.length) {
                            temp.push(state.backUpInv[j]);
                        }
                    }
                    newInv.push(temp);
                }
            }
            else {
                state.filteredInv.reverse();
                const page = Math.ceil(state.filteredInv.length/displayNumber);
                const max = displayNumber;
                var newInv = [];

                for (var i = 0; i < page; i++){
                    var temp = [];
                    for (var j = i*max; j < (i+1)*max; j++){
                        if (j < state.filteredInv.length) {
                            temp.push(state.filteredInv[j]);
                        }
                    }
                    newInv.push(temp);
                }
            }

            return { ...state, inventories: newInv[0], allPages: newInv, activePage: 1 };
        }
        default: {
            return state;
        }
    }
}

function compareSku(a,b){
    const idA = a.sku;
    const idB = b.sku;

    let comparision = 0;
    if (idA > idB) {
        comparision = 1;
    }
    else if (idA < idB){
        comparision = -1;
    }
    return comparision;
}

function compareDesc(a,b){
    const idA = a.productName.en;
    const idB = b.productName.en;

    let comparision = 0;
    if (idA > idB) {
        comparision = 1;
    }
    else if (idA < idB){
        comparision = -1;
    }
    return comparision;
}

function compareStock(a,b){
    const idA = a.mainStock;
    const idB = b.mainStock;

    let comparision = 0;
    if (idA > idB) {
        comparision = 1;
    }
    else if (idA < idB){
        comparision = -1;
    }
    return comparision;
}
