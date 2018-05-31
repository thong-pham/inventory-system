import React, { Component } from "react";
import { render } from "react-dom";
import { compose, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createHashHistory';
import { Route } from 'react-router';
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { ConnectedRouter, routerMiddleware, push } from 'react-router-redux';

import rootReducers from './reducers';

import Login from "./containers/login";
import AddUser from "./containers/users/addUser";
import EditUser from "./containers/users/editUser";
import ViewUsers from "./containers/users/viewUsers";

import ViewAccount from "./containers/viewAccount";

import AddInventory from "./containers/inventory/addInventory";
import ViewInventories from "./containers/inventory/viewInventories";
import ImportInventory from "./containers/inventory/importInventory";
import UpdateInventory from "./containers/inventory/updateInventory";
import ApproveImport from "./containers/inventory/approveImport";

import ImportInventoryByCamera from "./containers/importInventoryByCamera";

import AddSubInventory from "./containers/addSubInventory";
import ViewSubInventories from "./containers/viewSubInventories";
import UpdateSubInventory from "./containers/updateSubInventory";

import ViewInventoriesTrash from "./containers/trash/mainInventories";
import ViewSubInventoriesTrash from "./containers/trash/subInventories";

import AddCompany from "./containers/company/addCompany";
import ViewCompanies from "./containers/company/viewCompanies";

import ViewFeatures from "./containers/viewFeatures";
import ViewCode from "./containers/viewCode";

import ViewOrders from "./containers/viewOrders/pendingOrders";
import ViewProcessedOrders from "./containers/viewOrders/processedOrders";

const history = createHistory();
const logger = createLogger();

const middleware = routerMiddleware(history)

const config = {
    key: 'primary',
    storage: storage,
    whitelist: ['auth']
 }

const reducers = persistReducer(config, rootReducers);

const store = createStore(
    reducers,
    undefined,
    compose(
        applyMiddleware(middleware, thunk)
    )
)

class App extends Component {
    state = {
        isLoading: true
    }
    componentWillMount() {
        persistStore(store, null, () => {
            this.setState({ isLoading: false });
            store.dispatch(push('/login'));
        })
    }
    render() {
        if (this.state.isLoading) {
            return (
                <div>Loading...</div>
            );
        }
        else {
            return (
                <Provider store={store}>
                    <ConnectedRouter history={history}>
                        <div>
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/addUser" component={AddUser} />
                            <Route exact path="/users" component={ViewUsers} />
                            <Route path="/user/:id" component={EditUser} />
                            <Route exact path="/addInventory" component={AddInventory} />
                            <Route exact path="/addSubInventory" component={AddSubInventory} />
                            <Route exact path="/importInventory" component={ImportInventory} />
                            <Route exact path="/importByCamera" component={ImportInventoryByCamera} />
                            <Route exact path="/addcompany" component={AddCompany} />
                            <Route exact path="/companies" component={ViewCompanies} />
                            <Route exact path="/imports" component={ApproveImport} />
                            <Route path="/inventory/:id" component={UpdateInventory} />
                            <Route path="/subInventory/:id" component={UpdateSubInventory} />
                            <Route exact path="/inventory" component={ViewInventories} />
                            <Route exact path="/subInventory" component={ViewSubInventories} />
                            <Route exact path="/orders" component={ViewOrders} />
                            <Route exact path="/processedOrders" component={ViewProcessedOrders} />
                            <Route exact path="/code" component={ViewCode} />
                            <Route exact path="/account" component={ViewAccount} />
                            <Route exact path="/feature" component={ViewFeatures} />
                            <Route exact path="/inventoriesInTrash" component={ViewInventoriesTrash} />
                            <Route exact path="/subInventoriesInTrash" component={ViewSubInventoriesTrash} />
                        </div>
                    </ConnectedRouter>
                </Provider>
            );
        }
    }
}

render(
    <App />
    , document.getElementById('app')
)
