import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Container,
        Button, Input, Item, Grid, Accordion, Divider } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { getPendingOrders, getPendingOrderByCompany, approveOrder, changePopUp, closePopUp,
        changeOrder, deleteItem, trackNumber, deleteOrder, cancelOrder, errorInput, sortOrder, reverseOrder } from "./../../actions/OrderActions";

import { getInventories } from "./../../actions/InventoryActions";

class ViewOrders extends Component {
    state = {
        activeIndex: 0,
        column: null,
        direction: null,
    };
    componentWillMount() {
        const { token, dispatch } = this.props;
        const { user } = this.props.auth;
        if (user.company === 'ISRA'){
            dispatch(getPendingOrders({ token: token }));
            dispatch(getInventories({token: token}));
        }
        else {
            dispatch(getPendingOrderByCompany({ token: token }));
        }

    }
    onPressEdit = (cart) => {
        const { token, dispatch } = this.props;
        dispatch(changePopUp(cart.id));
    }

    onPressDeleteCart = (orderId, cartId) => {
        const { token, dispatch } = this.props;
        const { user } = this.props.auth;
        const item = {
            orderId: orderId,
            cartId: cartId
        }
        dispatch(deleteItem({token: token, item: item})).then(function(data){
              if (user.company === 'ISRA'){
                  dispatch(getPendingOrders({ token: token }));
              }
              else {
                  dispatch(getPendingOrderByCompany({ token: token }));
              }
        });
    }

    onPressDelete = (order) => {
        const { token, dispatch } = this.props;
        const { user } = this.props.auth;
        dispatch(deleteOrder({token: token, order: order}));
    }

    onPressCancel = (order) => {
        const { token, dispatch } = this.props;
        const { user } = this.props.auth;
        dispatch(cancelOrder({token: token, orderId: order.id}));
    }

    onPressChange(orderId, cartId){
        const { token, dispatch } = this.props;
        const { quantity } = this.props.order;
        const { user } = this.props.auth;
        if (isNaN(quantity) || quantity === null || quantity < 0 || !Number.isInteger(Number(quantity))){
            dispatch(errorInput("Invalid Input"));
        }
        else {
            const change = {
                orderId: orderId,
                cartId: cartId,
                quantity: quantity
            }
            dispatch(changeOrder({token: token, change: change})).then(function(data){
                  if (user.company === 'ISRA'){
                      dispatch(getPendingOrders({ token: token }));
                  }
                  else {
                      dispatch(getPendingOrderByCompany({ token: token }));
                  }
            });
        }
        /*pendingOrders.forEach(function(order){
            if (order.id === orderId){
                order.details.forEach(function(cart){
                    if (cart.id === cartId){
                        cart.quantity = quantity;
                    }
                });
            }
        });*/
    }

    onCloseChange = () => {
        const { dispatch } = this.props;
        dispatch(closePopUp());
    }

    onPressApprove = (order) => {
          const { token, dispatch } = this.props;
          const { pendingOrders } = this.props.order;
          dispatch(approveOrder({token: token, orderId: order.id })).then(function(data){
              //dispatch(push("/inventory"));
          });
    }

    handleInput = (e) => {
        const { token, dispatch } = this.props;
        dispatch(trackNumber(e.target.value));
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    }

    checkOrderError = (id) => {
        const { cartErrors, orderError } = this.props.order;
        var check = false;
        var stock = null;
        cartErrors.forEach(function(data){
            if (data.cartId === id){
                check = true;
                stock = data.mainStock
            }
        });
        const data = {
            check: check,
            stock: stock
        }
        return data;
    }

    handleSort = clickedColumn => () => {
        const { dispatch } = this.props;
        const { column, direction } = this.state;

        if (column !== clickedColumn){
            this.setState({
              column: clickedColumn,
              direction: 'ascending',
            });
            dispatch(sortOrder(clickedColumn));
        }
        else {
            this.setState({
               direction: direction === 'ascending' ? 'descending' : 'ascending',
            });
            dispatch(reverseOrder());
        }
    }

    onDetails = (id) => {
        const { dispatch } = this.props;
        dispatch(push("/order/" + id))
    }

    render() {
        const { activeIndex, column, direction } = this.state;
        const { user } = this.props.auth;
        const { pendingOrders, fetchingPendingOrdersError, approvingOrderError,
                change, quantity, cartErrors, orderError, errorInput } = this.props.order;

        let error = null;
        let approveError = null;
        if (fetchingPendingOrdersError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Fetching Orders</Message.Header>
                    <p>{fetchingPendingOrdersError}</p>
                </Message>
            )
        }
        else if (errorInput) {
            error = (
                <Message negative>
                    <p>{errorInput}</p>
                </Message>
            )
        }

        if (approvingOrderError) {
            approveError = (
                <Message negative>
                    <p>{approvingOrderError}</p>
                </Message>
            )
        }

        const ordersView = pendingOrders.map(function (order) {
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
                        <hr />
                        { (change === cart.id) ? <Item.Extra className="extra">
                          <Grid columns={2} divided>
                            <Grid.Row className="columnForChange">
                              <Grid.Column className="columnForInput" textAlign='center'>
                                  <Input placeholder='Quantity' className="inputBox" size='mini' defaultValue={quantity} onChange={this.handleInput} />
                              </Grid.Column>
                                  <Grid.Column className="columnForButton" textAlign='center'>
                                      <Grid columns={2}>
                                          <Grid.Row>
                                              <Grid.Column textAlign='center'>
                                                  <Icon name='checkmark' size='large' onClick={() => this.onPressChange(order.id, cart.id)} />
                                              </Grid.Column>
                                              <Grid.Column textAlign='center'>
                                                  <Icon name='close' size='large' onClick={() => this.onCloseChange()} />
                                              </Grid.Column>
                                          </Grid.Row>
                                      </Grid>
                                  </Grid.Column>
                              </Grid.Row>
                            </Grid>
                        </Item.Extra> : null}
                      </Item.Content>
                      { (user.company === 'ISRA' && change !== cart.id) ? <Icon name='pencil' size='large' onClick={() => this.onPressEdit(cart)} /> : null }
                      { (user.company === 'ISRA' && change !== cart.id && order.details.length > 1) ? <Icon name='trash outline' size='large' onClick={() => this.onPressDeleteCart(order.id, cart.id)} /> : null }
                      { (approvingOrderError && this.checkOrderError(cart.id).check) ? <Message negative>
                                                    <p>{approvingOrderError} {this.checkOrderError(cart.id).stock}</p>
                                                </Message> : null }
                      <Divider horizontal></Divider>
                    </Item>
                )
            }, this);
            return (
                <Table.Row key={order.id}>
                    <Table.Cell>{order.id}</Table.Cell>
                    <Table.Cell>
                       {/*<Item.Group>
                          <Accordion fluid styled>
                            <Accordion.Title active={activeIndex === order.id} index={order.id} onClick={this.handleClick}>
                              <Icon name='dropdown' />
                               See Details
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === order.id}>
                              {detailsView}
                            </Accordion.Content>
                          </Accordion>
                        </Item.Group>*/}
                        <Button onClick={() => this.onDetails(order.id)}>See Details</Button>
                      </Table.Cell>
                    <Table.Cell >{order.status}</Table.Cell>
                    <Table.Cell >{order.createdBy}</Table.Cell>
                    <Table.Cell >
                        {order.createdAt.slice(5,7)}/{order.createdAt.slice(8,10)}/{order.createdAt.slice(0,4)}
                         <hr />
                        {order.createdAt.slice(11,19)} PST
                    </Table.Cell>
                    <Table.Cell >{order.company}</Table.Cell>
                    {/*<Table.Cell >
                        { (user.company !== 'ISRA') ? <Button size='tiny' color='red' onClick={() => this.onPressDelete(order)}><Icon name='trash outline' />Delete</Button> : null }
                        { (user.company === 'ISRA') ? <Button size='tiny' color='green' onClick={() => this.onPressApprove(order)}><Icon name='checkmark' /></Button> : null }
                        { (user.company === 'ISRA') ? <Button size='tiny' color='black' onClick={() => this.onPressCancel(order)}><Icon name='cancel' /></Button> : null }
                    </Table.Cell>*/}
                </Table.Row>
            )
        }, this);
        let tableView = <h4>No Pending Orders Found</h4>
        if (pendingOrders.length > 0) {
            tableView = (
                <Table celled fixed color='blue' sortable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1}>Order Number</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Description</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Status</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Created By</Table.HeaderCell>
                            <Table.HeaderCell width={1} sorted={column === 'time' ? direction : null} onClick={this.handleSort('time')}>Created At</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Company</Table.HeaderCell>
                            {/*<Table.HeaderCell width={1}>Options</Table.HeaderCell>*/}
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
                  <Header as="h2">Order List</Header>
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
        auth: state.auth,
        inventory: state.inventory
    }
}

export default connect(mapStatesToProps)(ViewOrders);
