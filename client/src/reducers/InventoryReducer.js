import { ADD_INVENTORY_STARTED, ADD_INVENTORY_FULFILLED, ADD_INVENTORY_REJECTED,
         GET_INVENTORIES_STARTED, GET_INVENTORIES_FULFILLED, GET_INVENTORIES_REJECTED,
         GET_INVENTORIES_TRASH_STARTED, GET_INVENTORIES_TRASH_FULFILLED, GET_INVENTORIES_TRASH_REJECTED,
         DELETE_INVENTORY_STARTED, DELETE_INVENTORY_FULFILLED, DELETE_INVENTORY_REJECTED,
         UPDATE_INVENTORY_STARTED, UPDATE_INVENTORY_FULFILLED, UPDATE_INVENTORY_REJECTED,
         SET_UPDATING_INVENTORY_FULFILLED, CLEAR_INVENTORY_FULFILLED, REJECT_UPDATING_INVENTORY,
         APPROVE_INVENTORY_STARTED, APPROVE_INVENTORY_FULFILLED, APPROVE_INVENTORY_REJECTED,
         TRACK_NUMBER_INV, OPEN_PLUS, CLOSE_PLUS, ERROR_INPUT_INV, FILL_DATA_INV, OPEN_MINUS, CLOSE_MINUS,
         FILTER_INVENTORY, SORT_INVENTORY, REV_INVENTORY, CHANGE_INVENTORY,
         RECOVER_INVENTORY_STARTED, RECOVER_INVENTORY_FULFILLED, RECOVER_INVENTORY_REJECTED,
         DELETE_INVENTORY_TRASH_STARTED, DELETE_INVENTORY_TRASH_FULFILLED, DELETE_INVENTORY_TRASH_REJECTED,
         CLEAR_FAIL, CLEAR_COMPLETE, RENDER_PAGE_INV, RECOVER_PAGE_INV, CHANGE_DISPLAY
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
    activePage: 1,
    displayNumber: 15,
    filteredInv: [],
    search : false
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
        case GET_INVENTORIES_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingInventories: false, fetchingInventoriesError: error };
        }
        case RENDER_PAGE_INV:{
            const data = action.payload;
            return { ...state, inventories: state.allPages[data-1], activePage: data};
        }
        case RECOVER_PAGE_INV: {
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
        case DELETE_INVENTORY_STARTED: {
            return { ...state, isDeletingInventory: true };
        }
        case DELETE_INVENTORY_FULFILLED: {
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

        case TRACK_NUMBER_INV: {
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
        case ERROR_INPUT_INV: {
            const error = action.payload;
            return {...state };
        }
        case FILL_DATA_INV:{
            const data = action.payload;
            return { ...state, generatedSKU: data.sku, generatedDesc: data.desc, unitCode: data.unitCode }
        }
        case FILTER_INVENTORY: {
            const {key, type} = action.payload;
            const displayNumber = state.displayNumber;
            var list = key.split(' ');

            state.filteredInv = state.backUpInv.filter((element) => {
                  var count = 0;
                  if (type === 'SKU'){
                      for (var i = 0; i < list.length; i++){
                          if (element.sku.toLowerCase().includes(list[i].toLowerCase())){
                              count += 1;
                          }
                      }
                      if (count === list.length) return element;
                  }
                  else if (type === 'Description'){
                      for (var i = 0; i < list.length; i++){
                          if (element.productName.en.toLowerCase().includes(list[i].toLowerCase())){
                              count += 1;
                          }
                      }
                      if (count === list.length) return element;
                  }
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
        case SORT_INVENTORY:{
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
                else if (option === 'price') {
                    state.backUpInv.sort(comparePrice);
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
                else if (option === 'price') {
                    state.filteredInv.sort(comparePrice);
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
        case REV_INVENTORY:{
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
        case CHANGE_DISPLAY:{
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
