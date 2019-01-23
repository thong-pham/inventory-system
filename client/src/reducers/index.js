import { combineReducers } from 'redux';

import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from "redux-form";
//import { reducer as toastrReducer } from "react-redux-toastr";

import authReducer from "./../reducers/AuthReducer";
import inventoryReducer from "./../reducers/InventoryReducer";
import userReducer from "./../reducers/UserReducer";
import companyReducer from "./../reducers/CompanyReducer";
import subInventoryReducer from "./../reducers/SubInventoryReducer";
import orderReducer from "./../reducers/OrderReducer";
import codeReducer from "./../reducers/CodeReducer";
import importReducer from "./../reducers/ImportReducer";
import exportReducer from "./../reducers/ExportReducer";
import featureReducer from "./../reducers/FeatureReducer";
import barcodeReducer from "./../reducers/BarcodeReducer";
import locationReducer from "./../reducers/LocationReducer";

export default combineReducers({
    router: routerReducer,
    form: formReducer,
    auth: authReducer,
    inventory: inventoryReducer,
    user: userReducer,
    company: companyReducer,
    subInventory: subInventoryReducer,
    order: orderReducer,
    code: codeReducer,
    importData: importReducer,
    exportData: exportReducer,
    feature: featureReducer,
    barcode: barcodeReducer,
    location: locationReducer
});
