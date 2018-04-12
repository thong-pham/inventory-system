import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Container, Button, Input, Item, Grid } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

//import { getInventories, deleteInventory, rejectEdit, getSubInventories, addToCart, trackNumber } from "./../../actions/InventoryActions";
import { getApprovedOrders } from "./../../actions/OrderActions";

class ViewApprovedOrders extends Component {
    componentWillMount() {
        const { token, dispatch } = this.props;
        const { user } = this.props.auth;
        if (user.company === 'Mother Company'){
            dispatch(getApprovedOrders({ token: token }));
        }
        else {
            dispatch(push("/inventory"));
        }

    }

    render() {
        const { user } = this.props.auth;
        const { approvedOrders, fetchingApprovedOrdersError } = this.props.order;
        let error = null;
        if (fetchingApprovedOrdersError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Fetching Orders</Message.Header>
                    <p>{fetchingApprovedOrdersError}</p>
                </Message>
            )
        }
        const ordersView = approvedOrders.map(function (order) {
            const detailsView = order.details.map(function(cart){
                return (
                    <Item key={cart.id}>
                      <Item.Content>
                        <Item.Header as='a'>ID {cart.id}</Item.Header>
                        <Item.Meta>Description</Item.Meta>
                        <Item.Description>
                          <p>SKU : {cart.sku}</p>
                          <p>Product Name : {cart.productName.en}</p>
                          <p>Quantity : {cart.quantity}</p>
                        </Item.Description>
                      </Item.Content>
                    </Item>
                )
            }, this);
            return (
                <Table.Row key={order.id}>
                    <Table.Cell>{order.id}</Table.Cell>
                    <Table.Cell>
                        <Item.Group>
                            {detailsView}
                        </Item.Group>
                    </Table.Cell>
                    <Table.Cell >{order.status}</Table.Cell>
                    <Table.Cell >{order.username}</Table.Cell>
                    <Table.Cell >{order.company}</Table.Cell>
                </Table.Row>
            )
        }, this);
        let tableView = <h4>No Approved Orders Found.</h4>
        if (approvedOrders.length > 0) {
            tableView = (
                <Table celled fixed color='blue'>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1}>Order Number</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Details</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Status</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Username</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Company</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {ordersView}
                    </Table.Body>
                </Table>
            )
        }
        return (
          <BaseLayout>
              <Segment textAlign='center' >
                  <Header as="h2">Approved Order List</Header>
                  {error}
                  <Container>
                      {tableView}
                  </Container>
              </Segment>
          </BaseLayout>
        )
    }
}

function mapStatesToProps(state) {
    return {
        token: state.auth.token,
        order: state.order,
        auth: state.auth
    }
}

export default connect(mapStatesToProps)(ViewApprovedOrders);
