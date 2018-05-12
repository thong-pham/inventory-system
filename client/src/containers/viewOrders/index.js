import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Container,
        Button, Input, Item, Grid, Accordion, Divider } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

//import { getInventories, deleteInventory, rejectEdit, getSubInventories, addToCart, trackNumber } from "./../../actions/InventoryActions";
import { getPendingOrders, getPendingOrderByCompany, approveOrder, changePopUp, closePopUp,
        changeOrder, trackNumber, deleteOrder } from "./../../actions/OrderActions";

class ViewOrders extends Component {
    state = { activeIndex: 0 };
    componentWillMount() {
        const { token, dispatch } = this.props;
        const { user } = this.props.auth;
        if (user.company === 'ISRA'){
            dispatch(getPendingOrders({ token: token }));
        }
        else {
            dispatch(getPendingOrderByCompany({ token: token }));
        }

    }
    onPressEdit(cart){
        const { token, dispatch } = this.props;
        dispatch(changePopUp(cart.id));
    }

    onPressDelete(order) {
        const { token, dispatch } = this.props;
        const { user } = this.props.auth;
        dispatch(deleteOrder({token: token, order: order})).then(function(data){
              if (user.company === 'ISRA'){
                  dispatch(getPendingOrders({ token: token }));
              }
              else {
                  dispatch(getPendingOrderByCompany({ token: token }));
              }
        });
    }

    onPressChange(orderId, cartId){
        const { token, dispatch } = this.props;
        const { quantity } = this.props.order;
        const { user } = this.props.auth;
        /*pendingOrders.forEach(function(order){
            if (order.id === orderId){
                order.details.forEach(function(cart){
                    if (cart.id === cartId){
                        cart.quantity = quantity;
                    }
                });
            }
        });*/
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

    onCloseChange(){
        const { dispatch } = this.props;
        dispatch(closePopUp());
    }

    onPressApprove(order){
          const { token, dispatch } = this.props;
          const { pendingOrders } = this.props.order;
          dispatch(approveOrder({token: token, order: order })).then(function(data){
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
    render() {
        const { activeIndex } = this.state;
        const { user } = this.props.auth;
        const { pendingOrders, fetchingPendingOrdersError, approvingOrderError,
                change, quantity, cartErrors, orderError } = this.props.order;
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
        else if (approvingOrderError) {
            approveError = (
                <Message negative>
                    <p>{approvingOrderError}</p>
                </Message>
            )
        }
        /*else if (updatingInventoriesError){
          error = (
              <Message negative>
                  <Message.Header>Error while Updating Inventory</Message.Header>
                  <p>{updatingInventoriesError}</p>
              </Message>
          )
        }*/
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
                          <p>Quantity : {cart.quantity}</p>
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
                                                  <Icon name='checkmark' size='large' onClick={this.onPressChange.bind(this, order.id, cart.id)} />
                                              </Grid.Column>
                                              <Grid.Column textAlign='center'>
                                                  <Icon name='close' size='large' onClick={this.onCloseChange.bind(this)} />
                                              </Grid.Column>
                                          </Grid.Row>
                                      </Grid>
                                  </Grid.Column>
                              </Grid.Row>
                            </Grid>
                        </Item.Extra> : null}
                      </Item.Content>
                      { (user.company === 'ISRA' && change !== cart.id) ? <Icon name='pencil' size='large' onClick={this.onPressEdit.bind(this, cart)} /> : null }
                      { (approvingOrderError && this.checkOrderError(cart.id).check) ? <Message negative>
                                                    <p>{approvingOrderError} {this.checkOrderError(cart.id).stock}</p>
                                                </Message> : null }
                      <Divider horizontal>{cart.id}</Divider>
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
                    <Table.Cell >{order.company}</Table.Cell>
                    <Table.Cell >
                        { (user.company !== 'ISRA') ? <Button color='red' onClick={this.onPressDelete.bind(this, order)}><Icon name='trash outline' />Delete</Button> : null }
                        { (user.company === 'ISRA') ? <Button color='green' onClick={this.onPressApprove.bind(this, order)}><Icon name='checkmark' />Approve</Button> : null}
                    </Table.Cell>
                </Table.Row>
            )
        }, this);
        let tableView = <h4>No Orders Found. Please Add Some </h4>
        if (pendingOrders.length > 0) {
            tableView = (
                <Table celled fixed color='blue'>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1}>Order Number</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Description</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Status</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Created By</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Company</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Options</Table.HeaderCell>
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
        auth: state.auth
    }
}

export default connect(mapStatesToProps)(ViewOrders);
