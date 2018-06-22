import { ADD_INVENTORY_STARTED, ADD_INVENTORY_FULFILLED, ADD_INVENTORY_REJECTED,
         GET_INVENTORIES_STARTED, GET_INVENTORIES_FULFILLED, GET_INVENTORIES_REJECTED,
         GET_INVENTORIES_TRASH_STARTED, GET_INVENTORIES_TRASH_FULFILLED, GET_INVENTORIES_TRASH_REJECTED,
         DELETE_INVENTORY_STARTED, DELETE_INVENTORY_FULFILLED, DELETE_INVENTORY_REJECTED,
         UPDATE_INVENTORY_STARTED, UPDATE_INVENTORY_FULFILLED, UPDATE_INVENTORY_REJECTED,
         SET_UPDATING_INVENTORY_FULFILLED, CLEAR_INVENTORY_FULFILLED, REJECT_UPDATING_INVENTORY,
         APPROVE_INVENTORY_STARTED, APPROVE_INVENTORY_FULFILLED, APPROVE_INVENTORY_REJECTED,
         TRACK_NUMBER, OPEN_PLUS, CLOSE_PLUS, ERROR_INPUT, FILL_DATA, OPEN_MINUS, CLOSE_MINUS,
         FILTER_INVENTORY, SORT_INVENTORY, REV_INVENTORY, CHANGE_INVENTORY,
         RECOVER_INVENTORY_STARTED, RECOVER_INVENTORY_FULFILLED, RECOVER_INVENTORY_REJECTED,
         DELETE_INVENTORY_TRASH_STARTED, DELETE_INVENTORY_TRASH_FULFILLED, DELETE_INVENTORY_TRASH_REJECTED,
         CLEAR_FAIL, CLEAR_COMPLETE, RENDER_PAGE, RECOVER_PAGE
         } from "./../actions/InventoryActions";

const initialState = {
    inventories: [],
    backUpInv: [],
    inventoriesInTrash: [],
    inventory: null,
    isAddingInventory: false,
    addingInventoryError: null,
    isFetchingInventories: false,
    fetchingInventoriesError: null,
    isDeletingInventory: false,
    deletingInventoryError: null,
    isDeletingInventoryInTrash: false,
    deletingInventoryInTrashError: null,
    pendingInventories: [],
    isFetchingInventoriesInTrash: false,
    fetchingInventoriesInTrashError: null,
    isRecoveringInventory: false,
    recoveringInventoryError: null,
    isUpdatingInventory: false,
    updatingInventoryError: null,
    isApprovingInventory: false,
    approvingInventoryError: null,
    quantity: null,
    openPlus: null,
    openMinus: null,
    generatedSKU: [],
    generatedDesc: [],
    unitCode: null,
    defaultValue: {
        capacity: "0",
        price: "0"
    },
    completedProducts: null,
    failedProducts: null,
    allPages: [],
    activePage: 1
}

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_INVENTORY_STARTED: {
            return { ...state, isAddingInventory: true };
        }
        case ADD_INVENTORY_FULFILLED: {
            const data = action.payload;
            //console.log(data);
            //state.inventories.concat([data]);
            return { ...state, isAddingInventory: false, addingInventoryError: null, completedProducts: data.completeMessage, failedProducts: data.errorMessage };
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
            const page = Math.ceil(data.length/10);
            const max = 10;
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
        case GET_INVENTORIES_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingInventories: false, fetchingInventoriesError: error };
        }
        case RENDER_PAGE:{
            const data = action.payload;
            return { ...state, inventories: state.allPages[data-1], activePage: data};
        }
        case RECOVER_PAGE: {
            const data = state.backUpInv;
            const page = Math.ceil(data.length/10);
            const max = 10;
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
            return { ...state, inventories: newInv[0], allPages: newInv, activePage: 1 };
        }
        case DELETE_INVENTORY_STARTED: {
            return { ...state, isDeletingInventory: true };
        }
        case DELETE_INVENTORY_FULFILLED: {
            const id = action.payload;
            var index = 0;
            for (var i = 0; i < state.inventories.length; i++){
                if (state.inventories[i].id === id ){
                    index = i;
                }
            }
            state.inventories.splice(index,1);
            return { ...state, isDeletingInventory: false, deletingInventoryError: null };
        }
        case DELETE_INVENTORY_REJECTED: {
            const error = action.payload.data;
            return { ...state, isDeletingInventory: false, deletingInventoryError: error };
        }
        case GET_INVENTORIES_TRASH_STARTED: {
            return { ...state, isFetchingInventoriesInTrash: true };
        }
        case GET_INVENTORIES_TRASH_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingInventoriesInTrash: false, inventoriesInTrash: data };
        }
        case GET_INVENTORIES_TRASH_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingInventoriesInTrash: false, fetchingInventoriesInTrashError: error };
        }
        case UPDATE_INVENTORY_STARTED: {
            return { ...state, isUpdatingInventory: true };
        }
        case UPDATE_INVENTORY_FULFILLED: {
            const data = action.payload;
            return { ...state, isUpdatingInventory: false, inventory: null, openPlus: null, openMinus: null, quantity: null, updatingInventoryError: null };
        }
        case UPDATE_INVENTORY_REJECTED: {
            const error = action.payload.data;
            return { ...state, isUpdatingInventory: false, updatingInventoryError: error, openPlus: null, openMinus: null, quantity: null };
        }
        case APPROVE_INVENTORY_STARTED: {
            return { ...state, isApprovingInventory: true };
        }
        case APPROVE_INVENTORY_FULFILLED: {
            const data = action.payload;
            return { ...state, isApprovingInventory: false, inventory: null, approvingInventoryError: null };
        }
        case APPROVE_INVENTORY_REJECTED: {
            const error = action.payload.data;
            return { ...state, isApprovingInventory: false, approvingInventoryError: error };
        }
        case RECOVER_INVENTORY_STARTED:{
            return { ...state, isRecoveringInventory: true };
        }
        case RECOVER_INVENTORY_FULFILLED:{
            const id = action.payload;
            var index = 0;
            for (var i = 0; i < state.inventoriesInTrash.length; i++){
                if (state.inventoriesInTrash[i].id === id ){
                    index = i;
                }
            }
            state.inventoriesInTrash.splice(index,1);
            return { ...state, isRecoveringInventory: false }
        }
        case RECOVER_INVENTORY_REJECTED: {
            const error = action.payload.data;
            return { ...state, isRecoveringInventory: false, recoveringInventoryError: error };
        }
        case DELETE_INVENTORY_TRASH_STARTED: {
            return { ...state, isDeletingInventoryInTrash: true };
        }
        case DELETE_INVENTORY_TRASH_FULFILLED: {
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
        case DELETE_INVENTORY_TRASH_REJECTED: {
            const error = action.payload.data;
            return { ...state, isDeletingInventoryInTrash: false, deletingInventoryInTrashError: error };
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
            return { ...state, updatingInventoryError: error, deletingInventoryError: null };
        }

        case TRACK_NUMBER: {
            var data = action.payload;
            //const number = parseInt(data);
            return { ...state, quantity : data};
        }
        case OPEN_PLUS: {
          const data = action.payload;
            return { ...state, openPlus : data, quantity: null, openMinus: null };
        }
        case CLOSE_PLUS: {
            return { ...state, openPlus : null, quantity: null };
        }
        case OPEN_MINUS: {
          const data = action.payload;
            return { ...state, openMinus : data, quantity: null, openPlus: null };
        }
        case CLOSE_MINUS: {
            return { ...state, openMinus : null, quantity: null };
        }
        case ERROR_INPUT: {
            const error = action.payload;
            return {...state };
        }
        case FILL_DATA:{
            const data = action.payload;
            return { ...state, generatedSKU: data.sku, generatedDesc: data.desc, unitCode: data.unitCode }
        }
        case FILTER_INVENTORY: {
            const data = action.payload;
            state.inventories = state.backUpInv;
            var list = data.split(' ');

            const newInv = state.inventories.filter((element) => {
                  var count = 0;
                  for (var i = 0; i < list.length; i++){
                      if (element.productName.en.toLowerCase().includes(list[i])){
                          count += 1;
                      }
                  }
                  if (count === list.length) return element;
            });

            return { ...state, inventories: newInv };
        }
        case SORT_INVENTORY:{
            const data = action.payload;
            if (data === 'sku') state.inventories.sort(compareSku);
            else if (data === 'productName.en') state.inventories.sort(compareDesc);
            else if (data === 'price') state.inventories.sort(comparePrice);
            else if (data === 'stock') state.inventories.sort(compareStock);
            return { ...state };
        }
        case REV_INVENTORY:{
            state.inventories.reverse();
            return { ...state };
        }
        case CHANGE_INVENTORY: {
            const data = action.payload;
            state.inventories.forEach(function(inventory){
                if (inventory.id === data.id) inventory.stock = data.stock;
            });
            return { ...state };
        }
        case CLEAR_FAIL:{
            return { ...state, failedProducts: null };
        }
        case CLEAR_COMPLETE:{
            return { ...state, completedProducts: null };
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
    const idA = a.stock;
    const idB = b.stock;

    let comparision = 0;
    if (idA > idB) {
        comparision = 1;
    }
    else if (idA < idB){
        comparision = -1;
    }
    return comparision;
}

function comparePrice(a,b){
    const idA = a.price;
    const idB = b.price;

    let comparision = 0;
    if (idA > idB) {
        comparision = 1;
    }
    else if (idA < idB){
        comparision = -1;
    }
    return comparision;
}
