import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Container, Button,
          Input, Item, Grid, Accordion, Divider } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

//import { getInventories, deleteInventory, rejectEdit, getSubInventories, addToCart, trackNumber } from "./../../actions/InventoryActions";
import { getApprovedOrders, getApprovedOrdersByCompany } from "./../../actions/OrderActions";

class ViewApprovedOrders extends Component {
    state = { activeIndex: 0 };
    componentWillMount() {
        const { token, dispatch } = this.props;
        const { user } = this.props.auth;
        if (user.company === 'ISRA'){
            dispatch(getApprovedOrders({ token: token }));
        }
        else {
            dispatch(getApprovedOrdersByCompany({ token: token}));
        }

    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    }

    render() {
        const { activeIndex } = this.state;
        const { user } = this.props.auth;
        const { approvedOrders, isFetchingApprovedOrders, fetchingApprovedOrdersError } = this.props.order;
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
                        {/*<Item.Header as='a'>ID {cart.id}</Item.Header>*/}
                        <Item.Description>
                          { (user.company !== 'ISRA') ? <p>SKU : <strong>{cart.sku}</strong></p> : null }
                          { (user.company === 'ISRA') ? <p>SKU : <strong>{cart.mainSku}</strong></p> : null }
                          <p>Description : {cart.desc}</p>
                          <p>Request : {cart.quantity}</p>
                          <p>Accept : {cart.accept}</p>
                        </Item.Description>
                      </Item.Content>
                      <Divider horizontal></Divider>
                    </Item>
                )
            }, this);
            return (
                <Table.Row key={order.id}>
                    <Table.Cell>{order.id}</Table.Cell>
                    <Table.Cell>
                        <Item.Group>
                          <Accordion fluid styled>
                            <Accordion.Title active={activeIndex === order.id} index={order.id} onClick={this.handleClick}>
                              <Icon name='dropdown' />
                               See Details
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === order.id}>
                              {detailsView}
                            </Accordion.Content>
                          </Accordion>
                        </Item.Group>
                    </Table.Cell>
                    <Table.Cell >{order.status}</Table.Cell>
                    <Table.Cell >{order.createdBy}</Table.Cell>
                    <Table.Cell >{order.processedBy}</Table.Cell>
                    { (user.company === 'ISRA') ? <Table.Cell >{order.company}</Table.Cell> : null }
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
                            <Table.HeaderCell width={1}>Created By</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Approved By</Table.HeaderCell>
                            { (user.company === 'ISRA') ? <Table.HeaderCell width={1}>Company</Table.HeaderCell> : null }
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
                  { (user.company === 'ISRA') ? <Header as="h2">Approved Inventory List</Header> : <Header as="h2">{user.company} - Approved Order List</Header> }
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
