import React, { Component } from 'react';
import { connect } from "react-redux";
import { Container, Segment, Sidebar, Menu, Icon, Message } from 'semantic-ui-react';
import { push } from 'react-router-redux';

import { logoutUser } from "./../../actions/AuthActions";

import './../../styles/custom.css';

class BaseLayout extends Component {
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
            dispatch(push('/inventory/add'));
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
        else if (menuItem === "approveInventory") {
            dispatch(push('/inventory/approve'));
        }
        else if (menuItem === "viewOrders") {
            dispatch(push('/orders'));
        }
        else if (menuItem === "viewApprovedOrders") {
            dispatch(push('/approvedOrders'));
        }
        else if (menuItem === "viewCode") {
            dispatch(push('/code'));
        }
        else if (menuItem === "logout") {
            dispatch(logoutUser());
            dispatch(push('/login'));
        }
    }
    render() {
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
        if (company === 'Mother Company'){
          if (isStoreManager) {
              dedicatedMenuItem = (
                <Sidebar as={Menu} animation='slide along' className="side-left"  visible={true} icon='labeled' vertical inverted>
                    <Menu.Item onClick={this.handleClick.bind(this, "viewInventories")} >
                      <Icon name='cube' />
                        View Whole Inventories
                    </Menu.Item>
                    <Menu.Item onClick={this.handleClick.bind(this, "viewSubInventories")} >
                      <Icon name='cube' />
                         View Sub-Inventories
                    </Menu.Item>
                    <Menu.Item onClick={this.handleClick.bind(this, "addInventory")} >
                      <Icon name='add' />
                        Add Inventory
                    </Menu.Item>
                    <Menu.Item onClick={this.handleClick.bind(this, "approveInventory")} >
                      <Icon name='list ul' />
                        Pending Inventories
                    </Menu.Item>
                    <Menu.Item onClick={this.handleClick.bind(this, "viewOrders")} >
                      <Icon name='list ul' />
                        Pending Orders
                    </Menu.Item>
                    <Menu.Item onClick={this.handleClick.bind(this, "viewApprovedOrders")} >
                      <Icon name='checkmark box' />
                        Approved Orders
                    </Menu.Item>
                    <Menu.Item onClick={this.handleClick.bind(this, "viewCode")} >
                      <Icon name='barcode' />
                        Code Management
                    </Menu.Item>
                    <Menu.Item onClick={this.handleClick.bind(this, "logout")} >
                      <Icon name='log out' />
                        Logout
                    </Menu.Item>
                    <Menu.Item>
                      <Message>
                        <Message.Header>Account Information</Message.Header>
                        <Message.List>
                          <Message.Item>Username: {user.username}</Message.Item>
                          <Message.Item>Role: {user.roles[0]}</Message.Item>
                          <Message.Item>Company: {user.company}</Message.Item>
                        </Message.List>
                      </Message>
                    </Menu.Item>
                </Sidebar>
              );
          }
          if (isWorker) {
              dedicatedMenuItem = (
              <Sidebar as={Menu} animation='slide along' className="side-left" visible={true} icon='labeled' vertical inverted>
                <Menu.Item onClick={this.handleClick.bind(this, "viewInventories")} >
                  <Icon name='cube' />
                    View Whole Inventories
                </Menu.Item>
                <Menu.Item onClick={this.handleClick.bind(this, "addInventory")} >
                  <Icon name='add' />
                    Add Inventory
                </Menu.Item>
                <Menu.Item onClick={this.handleClick.bind(this, "logout")} >
                  <Icon name='log out' />
                    Logout
                </Menu.Item>
                <Menu.Item>
                  <Message>
                    <Message.Header>Account Information</Message.Header>
                    <Message.List>
                      <Message.Item>Username: {user.username}</Message.Item>
                      <Message.Item>Role: {user.roles[0]}</Message.Item>
                      <Message.Item>Company: {user.company}</Message.Item>
                    </Message.List>
                  </Message>
                </Menu.Item>
              </Sidebar>
              );
          }
          if (isAdmin) {
              dedicatedMenuItem = (
              <Sidebar as={Menu} animation='slide along' className="side-left" visible={true} icon='labeled' vertical inverted>
                <Menu.Item onClick={this.handleClick.bind(this, "viewUsers")}>
                  <Icon name='users' />
                    View Users
                </Menu.Item>
                <Menu.Item onClick={this.handleClick.bind(this, "viewCompanies")}>
                  <Icon name='building' />
                    View Companies
                </Menu.Item>
                <Menu.Item onClick={this.handleClick.bind(this, "viewInventories")} >
                  <Icon name='cube' />
                    View Whole Inventories
                </Menu.Item>
                <Menu.Item onClick={this.handleClick.bind(this, "logout")} >
                 <Icon name='log out' />
                    Logout
                </Menu.Item>
                <Menu.Item>
                  <Message>
                    <Message.Header>Account Information</Message.Header>
                    <Message.List>
                      <Message.Item>Username: {user.username}</Message.Item>
                      <Message.Item>Role: {user.roles[0]}</Message.Item>
                      <Message.Item>Company: {user.company}</Message.Item>
                    </Message.List>
                  </Message>
                </Menu.Item>
              </Sidebar>
              );
          }
        }
        else {
            dedicatedMenuItem = (
              <Sidebar as={Menu} animation='slide along' className="side-left" visible={true} icon='labeled' vertical inverted>
                  <Menu.Item onClick={this.handleClick.bind(this, "viewInventories")} >
                    <Icon name='cube' />
                      View Whole Inventories
                  </Menu.Item>
                  <Menu.Item onClick={this.handleClick.bind(this, "viewSubInventories")} >
                    <Icon name='cube' />
                       {user.company} Inventory
                  </Menu.Item>
                  <Menu.Item onClick={this.handleClick.bind(this, "viewOrders")} >
                    <Icon name='list ul' />
                      Pending Orders
                  </Menu.Item>
                  <Menu.Item onClick={this.handleClick.bind(this, "logout")} >
                   <Icon name='log out' />
                      Logout
                  </Menu.Item>
                  <Menu.Item>
                    <Message>
                      <Message.Header>Account Information</Message.Header>
                      <Message.List>
                        <Message.Item>Username: {user.username}</Message.Item>
                        <Message.Item>Role: {user.roles[0]}</Message.Item>
                        <Message.Item>Company: {user.company}</Message.Item>
                      </Message.List>
                    </Message>
                  </Menu.Item>
              </Sidebar>
            )
        }

        return (
            <Container textAlign='center' className="mainContainer">
                <Sidebar.Pushable as={Segment} className="mainContainer">
                    {dedicatedMenuItem}
                    <Sidebar.Pusher className="side-right">
                        {this.props.children}
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </Container>
        )
    }
}

function mapStatesToProps(state) {
    return {
        auth: state.auth
    }
}

export default connect(mapStatesToProps)(BaseLayout);
