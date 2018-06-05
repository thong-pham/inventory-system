import React, { Component } from 'react';
import { connect } from "react-redux";
import { Container, Segment, Sidebar, Menu, Icon, Message, Header, Button, Popup, Dropdown } from 'semantic-ui-react';
import { push } from 'react-router-redux';

import { logoutUser } from "./../../actions/AuthActions";

import './../../styles/custom.css';

class BaseLayout extends Component {
    state = {
        visible: false
    }
    componentWillMount() {
        const { token } = this.props.auth;
        const { dispatch } = this.props;
        if (!token) {
            dispatch(push("/login"));
        }
    }
    handleClick(menuItem) {
        const { dispatch } = this.props;
        if (menuItem === "addInventory") {
            dispatch(push('/addInventory'));
        }
        else if (menuItem === "addSubInventory") {
            dispatch(push('/addSubInventory'));
        }
        else if (menuItem === "importInventory") {
            dispatch(push('/importInventory'));
        }
        else if (menuItem === "exportInventory") {
            dispatch(push('/exportInventory'));
        }
        else if (menuItem === "importByCamera") {
            dispatch(push('/importByCamera'));
        }
        else if (menuItem === "viewUsers") {
            dispatch(push('/users'));
        }
        else if (menuItem === "viewCompanies") {
            dispatch(push('/companies'));
        }
        else if (menuItem === "viewInventories") {
            dispatch(push('/inventory'));
        }
        else if (menuItem === "viewSubInventories") {
            dispatch(push('/subInventory'));
        }
        else if (menuItem === "approveImport") {
            dispatch(push('/imports'));
        }
        else if (menuItem === "approveExport") {
            dispatch(push('/exports'));
        }
        else if (menuItem === "viewOrders") {
            dispatch(push('/orders'));
        }
        else if (menuItem === "viewProcessedOrders") {
            dispatch(push('/processedOrders'));
        }
        else if (menuItem === "viewCode") {
            dispatch(push('/code'));
        }
        else if (menuItem === "viewAccount") {
            dispatch(push('/account'));
        }
        else if (menuItem === "viewFeatures") {
            dispatch(push('/feature'));
        }
        else if (menuItem === "viewInventoriesTrash") {
            dispatch(push('/inventoriesInTrash'));
        }
        else if (menuItem === "viewSubInventoriesTrash") {
            dispatch(push('/subInventoriesInTrash'));
        }
        else if (menuItem === "logout") {
            dispatch(logoutUser());
            dispatch(push('/login'));
        }
    }
    render() {
        const { visible } = this.state;
        const { user } = this.props.auth;
        //console.log(user);
        const isStoreManager = user.roles.indexOf("storeManager") >= 0;
        const isAdmin = user.roles.indexOf("admin") >= 0;
        const isWorker = user.roles.indexOf("worker") >= 0;
        const company = user.company;

        let approveInventoryMenuItem = null;
        let addInventoryMenuItem = null;
        let dedicatedMenuItem = null;
        let viewSubInventoriesMenuItem = null;
        if (company === 'ISRA'){
          if (isStoreManager) {
              dedicatedMenuItem = (
                <Menu inverted className="menuTop">
                    <Menu.Item>
                      <Dropdown item text='Inventory'>
                        <Dropdown.Menu className="inventoryDropdown">
                          <Dropdown.Item onClick={this.handleClick.bind(this, "viewInventories")}><Icon name='cube' />ISRA Inventories</Dropdown.Item>
                          <Dropdown.Item onClick={this.handleClick.bind(this, "addInventory")}><Icon name='add' />Add Product</Dropdown.Item>
                          <Dropdown.Item onClick={this.handleClick.bind(this, "importInventory")}><Icon name='add' />Import Inventory</Dropdown.Item>
                          <Dropdown.Item onClick={this.handleClick.bind(this, "approveImport")}><Icon name='unordered list' />Pending Imports</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Menu.Item>
                    <Menu.Item>
                      <Dropdown item text='Order'>
                        <Dropdown.Menu className="orderDropdown">
                          <Dropdown.Item onClick={this.handleClick.bind(this, "viewOrders")}><Icon name='list ul' />Pending Orders</Dropdown.Item>
                          <Dropdown.Item onClick={this.handleClick.bind(this, "viewProcessedOrders")}><Icon name='checkmark box' />Processed Orders</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Menu.Item>
                    <Menu.Item onClick={this.handleClick.bind(this, "viewCode")} >
                      <Icon name='barcode' />
                        Code
                    </Menu.Item>
                    <Menu.Item onClick={this.handleClick.bind(this, "viewFeatures")} >
                      <Icon name='file text' />
                        Features
                    </Menu.Item>
                    <Menu.Item onClick={this.handleClick.bind(this, "viewInventoriesTrash")} >
                      <Icon name='trash outline' />
                        Trash
                    </Menu.Item>
                    <Menu.Item onClick={this.handleClick.bind(this, "viewAccount")} >
                      <Icon name='user' />
                        User Account
                    </Menu.Item>
                    <Menu.Item onClick={this.handleClick.bind(this, "logout")} >
                      <Icon name='log out' />
                        Logout
                    </Menu.Item>
                    <Menu.Item>
                        <Popup
                          trigger={<Icon name='info' />}
                          flowing
                          position='bottom right'
                        >
                          <Message.Header>Account Information</Message.Header>
                            <Message.List>
                              <Message.Item>Username: {user.username}</Message.Item>
                              <Message.Item>Role: {user.roles[0]}</Message.Item>
                              <Message.Item>Company: {user.company}</Message.Item>
                            </Message.List>
                        </Popup>
                    </Menu.Item>
                </Menu>
              );
          }
          if (isWorker) {
              dedicatedMenuItem = (
              <Sidebar as={Menu} animation='push' visible={true} direction='top' inverted>
                <Menu.Item onClick={this.handleClick.bind(this, "importInventory")} >
                  <Icon name='add' />
                    Import Inventory
                </Menu.Item>
                <Menu.Item onClick={this.handleClick.bind(this, "importByCamera")} >
                  <Icon name='add' />
                    Import By Camera
                </Menu.Item>
                <Menu.Item onClick={this.handleClick.bind(this, "approveImport")} >
                  <Icon name='list ul' />
                    Pending Import
                </Menu.Item>
                <Menu.Item onClick={this.handleClick.bind(this, "viewAccount")} >
                  <Icon name='user' />
                    User Account
                </Menu.Item>
                <Menu.Item onClick={this.handleClick.bind(this, "logout")} >
                  <Icon name='log out' />
                    Logout
                </Menu.Item>
                <Menu.Item>
                    <Popup
                      trigger={<Icon name='info' />}
                      flowing
                      position='bottom right'
                    >
                      <Message.Header>Account Information</Message.Header>
                        <Message.List>
                          <Message.Item>Username: {user.username}</Message.Item>
                          <Message.Item>Role: {user.roles[0]}</Message.Item>
                          <Message.Item>Company: {user.company}</Message.Item>
                        </Message.List>
                    </Popup>
                </Menu.Item>
              </Sidebar>
              );
          }
          if (isAdmin) {
              dedicatedMenuItem = (
              <Menu inverted className="menuTop">
                <Menu.Item onClick={this.handleClick.bind(this, "viewUsers")}>
                  <Icon name='users' />
                    Users
                </Menu.Item>
                <Menu.Item onClick={this.handleClick.bind(this, "viewCompanies")}>
                  <Icon name='building' />
                    Companies
                </Menu.Item>
                <Menu.Item>
                  <Dropdown item text='Inventory'>
                    <Dropdown.Menu className="inventoryDropdown">
                      <Dropdown.Item onClick={this.handleClick.bind(this, "viewInventories")}><Icon name='cube' />ISRA Inventories</Dropdown.Item>
                      <Dropdown.Item onClick={this.handleClick.bind(this, "addInventory")}><Icon name='add' />Add Product</Dropdown.Item>
                      <Dropdown.Item onClick={this.handleClick.bind(this, "importInventory")}><Icon name='add' />Import Inventory</Dropdown.Item>
                      <Dropdown.Item onClick={this.handleClick.bind(this, "exportInventory")}><Icon name='add' />Export Inventory</Dropdown.Item>
                      <Dropdown.Item onClick={this.handleClick.bind(this, "approveImport")}><Icon name='unordered list' />Pending Imports</Dropdown.Item>
                      <Dropdown.Item onClick={this.handleClick.bind(this, "approveExport")}><Icon name='unordered list' />Pending Exports</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Menu.Item>
                <Menu.Item>
                  <Dropdown item text='Order'>
                    <Dropdown.Menu className="orderDropdown">
                      <Dropdown.Item onClick={this.handleClick.bind(this, "viewOrders")}><Icon name='list ul' />Pending Orders</Dropdown.Item>
                      <Dropdown.Item onClick={this.handleClick.bind(this, "viewProcessedOrders")}><Icon name='checkmark box' />Processed Orders</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Menu.Item>
                <Menu.Item onClick={this.handleClick.bind(this, "viewCode")} >
                  <Icon name='barcode' />
                    Code
                </Menu.Item>
                <Menu.Item onClick={this.handleClick.bind(this, "viewFeatures")} >
                  <Icon name='file text' />
                    Features
                </Menu.Item>
                <Menu.Item onClick={this.handleClick.bind(this, "viewInventoriesTrash")} >
                  <Icon name='trash outline' />
                    Trash
                </Menu.Item>
                <Menu.Item onClick={this.handleClick.bind(this, "viewAccount")} >
                  <Icon name='user' />
                    User Account
                </Menu.Item>
                <Menu.Item onClick={this.handleClick.bind(this, "logout")} >
                 <Icon name='log out' />
                    Logout
                </Menu.Item>
                <Menu.Item>
                    <Popup
                      trigger={<Icon name='info' />}
                      flowing
                      position='bottom right'
                    >
                      <Message.Header>Account Information</Message.Header>
                        <Message.List>
                          <Message.Item>Username: {user.username}</Message.Item>
                          <Message.Item>Role: {user.roles[0]}</Message.Item>
                          <Message.Item>Company: {user.company}</Message.Item>
                        </Message.List>
                    </Popup>
                </Menu.Item>
              </Menu>
              );
          }
        }
        else {
            dedicatedMenuItem = (
              <Sidebar as={Menu} animation='push' visible={true} direction='top' inverted>
                  <Menu.Item onClick={this.handleClick.bind(this, "viewSubInventories")} >
                    <Icon name='cube' />
                       {user.company} Inventory
                  </Menu.Item>
                  <Menu.Item onClick={this.handleClick.bind(this, "addSubInventory")} >
                    <Icon name='add' />
                      Add Product
                  </Menu.Item>
                  <Menu.Item onClick={this.handleClick.bind(this, "viewOrders")} >
                    <Icon name='list ul' />
                      Pending Orders
                  </Menu.Item>
                  <Menu.Item onClick={this.handleClick.bind(this, "viewProcessedOrders")} >
                    <Icon name='checkmark box' />
                      Processed Orders
                  </Menu.Item>
                  <Menu.Item onClick={this.handleClick.bind(this, "viewCode")} >
                    <Icon name='barcode' />
                      Code
                  </Menu.Item>
                  <Menu.Item onClick={this.handleClick.bind(this, "viewSubInventoriesTrash")} >
                    <Icon name='trash outline' />
                      Trash
                  </Menu.Item>
                  <Menu.Item onClick={this.handleClick.bind(this, "viewAccount")} >
                    <Icon name='user' />
                      User Account
                  </Menu.Item>
                  <Menu.Item onClick={this.handleClick.bind(this, "logout")} >
                   <Icon name='log out' />
                      Logout
                  </Menu.Item>
                  <Menu.Item>
                      <Popup
                        trigger={<Icon name='info' />}
                        flowing
                        position='bottom right'
                      >
                        <Message.Header>Account Information</Message.Header>
                          <Message.List>
                            <Message.Item>Username: {user.username}</Message.Item>
                            <Message.Item>Role: {user.roles[0]}</Message.Item>
                            <Message.Item>Company: {user.company}</Message.Item>
                          </Message.List>
                      </Popup>
                  </Menu.Item>
              </Sidebar>
            )
        }

        return (
            <div style={{textAlign: 'center'}} className="mainContainer">
                <Sidebar.Pushable as={Segment} className="mainContainer">
                    {dedicatedMenuItem}
                    <Sidebar.Pusher>
                        {this.props.children}
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
        )
    }
}

function mapStatesToProps(state) {
    return {
        auth: state.auth
    }
}

export default connect(mapStatesToProps)(BaseLayout);
