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
import AddUser from "./containers/addUser";
import ViewUsers from "./containers/viewUsers";
import AddInventory from "./containers/addInventory";
import AddCompany from "./containers/addCompany";
import ViewCompanies from "./containers/viewCompanies";
import UpdateInventory from "./containers/updateInventory";
import UpdateSubInventory from "./containers/updateSubInventory";
import ViewInventories from "./containers/viewInventories";
import ViewSubInventories from "./containers/viewSubInventories";
import ApproveInventory from "./containers/approveInventory";
import ApproveRequest from "./containers/approveRequest";
import ViewAndRequest from "./containers/viewAndRequest";
import ViewOrders from "./containers/viewOrders";
import ViewApprovedOrders from "./containers/viewApprovedOrders";
import ViewCode from "./containers/viewCode";
import ViewAccount from "./containers/viewAccount";

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
        applyMiddleware(middleware, logger, thunk)
    )
)

class App extends Component {
    state = {
        isLoading: true
    }
    componentWillMount() {
        persistStore(store, null, () => {
            this.setState({ isLoading: false });
            store.dispatch(push('/login'))
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
                            {/* <Route exact path="/" component={AddInventory} /> */}
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/adduser" component={AddUser} />
                            <Route exact path="/users" component={ViewUsers} />
                            <Route exact path="/inventory/add" component={AddInventory} />
                            <Route exact path="/addcompany" component={AddCompany} />
                            <Route exact path="/companies" component={ViewCompanies} />
                            <Route exact path="/inventory/approve" component={ApproveInventory} />
                            <Route path="/inventory/:id" component={UpdateInventory} />
                            <Route path="/subInventory/:id" component={UpdateSubInventory} />
                            <Route exact path="/inventory" component={ViewAndRequest} />
                            <Route exact path="/subInventory" component={ViewSubInventories} />
                            <Route exact path="/requests/approve" component={ApproveRequest} />
                            <Route exact path="/orders" component={ViewOrders} />
                            <Route exact path="/approvedOrders" component={ViewApprovedOrders} />
                            <Route exact path="/code" component={ViewCode} />
                            <Route exact path="/account" component={ViewAccount} />
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
