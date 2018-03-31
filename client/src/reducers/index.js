import { combineReducers } from 'redux';

import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from "redux-form";

import authReducer from "./../reducers/AuthReducer";
import inventoryReducer from "./../reducers/InventoryReducer";
import userReducer from "./../reducers/UserReducer";
import companyReducer from "./../reducers/CompanyReducer";
import subInventoryReducer from "./../reducers/SubInventoryReducer";
import requestReducer from "./../reducers/RequestReducer";

export default combineReducers({
    router: routerReducer,
    form: formReducer,
    auth: authReducer,
    inventory: inventoryReducer,
    user: userReducer,
    company: companyReducer,
    subInventory: subInventoryReducer,
    request: requestReducer
});
