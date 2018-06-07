import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Button, Container, Modal, Input, Loader, Dimmer } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { getPendingOrders, setViewingOrder, changePopUp, trackNumber, changeOrder,
        deleteItem, approveOrder, cancelOrder, deleteOrder } from "./../../actions/OrderActions";

class ViewOrder extends Component {
    state = {
        accept: null,
        errorInput: null,
        cartErrors: [],
        approvingOrderError: null
    }
    componentWillMount() {
        const { token, dispatch } = this.props;
        const { user } = this.props.auth;
        const idParam = this.props.location.pathname.split("/")[2];
        dispatch(setViewingOrder(idParam));
    }

    triggerChange = (cart) => {
        const { dispatch } = this.props;
        this.setState({accept: cart.id})
        dispatch(trackNumber(cart.accept));
    }

    handleAccept = (e) => {
          const { token, dispatch } = this.props;
          dispatch(trackNumber(e.target.value));
    }

    onPressChange = (cart) => {
        const { token, dispatch } = this.props;
        const { quantity } = this.props.order;
        const { cartErrors } = this.state;
        const orderId = this.props.location.pathname.split("/")[2];
        if (isNaN(quantity) || quantity === null || quantity <= 0 || !Number.isInteger(Number(quantity))){
            this.setState({errorInput: "Invalid Input"})
        }
        else if (quantity > cart.quantity){
            this.setState({errorInput: "You cannot accept more then request"})
        }
        else {
            const change = {
                orderId,
                cartId: cart.id,
                quantity
            }
            dispatch(changeOrder({token: token, change: change}));
            var index = 0;
            for (var i = 0; i < cartErrors.length; i++){
                if (cartErrors[i].id === cart.id ){
                    index = i;
                }
            }
            cartErrors.splice(index,1)
            this.setState({accept: null});
        }
    }

    onPressDeleteCart = (cartId) => {
        const { token, dispatch } = this.props;
        const { cartErrors } = this.state;
        const orderId = this.props.location.pathname.split("/")[2];
        const item = {
            orderId,
            cartId
        }
        dispatch(deleteItem({token: token, item: item}));
        var index = 0;
        for (var i = 0; i < cartErrors.length; i++){
            if (cartErrors[i].id === cartId ){
                index = i;
            }
        }
        cartErrors.splice(index,1)
        this.setState({})
    }

    onPressApprove = () => {
          const { token, dispatch } = this.props;
          const orderId = this.props.location.pathname.split("/")[2];
          const { backUpInv } = this.props.inventory;
          const { order } = this.props.order;
          var error = [];
          order.details.forEach(function(cart){
               backUpInv.forEach(function(inv){
                    if (cart.mainSku === inv.sku && cart.accept > inv.stock){
                        const data = {
                            cartId: cart.id,
                            mainStock: inv.stock
                        }
                        error.push(data);
                    }
               });
          });
          if (error.length > 0){
              this.setState({approvingOrderError: "Current stock", cartErrors: error});
          }
          else {
              dispatch(approveOrder({token: token, orderId: orderId })).then(function(data){
                  dispatch(push("/orders"));
              });
          }
    }

    onPressCancel = () => {
        const { token, dispatch } = this.props;
        const orderId = this.props.location.pathname.split("/")[2];
        dispatch(cancelOrder({token: token, orderId: orderId})).then(function(data){
            dispatch(push("/orders"));
        });;
    }

    onPressDelete = () => {
        const { token, dispatch } = this.props;
        const orderId = this.props.location.pathname.split("/")[2];
        dispatch(deleteOrder({token: token, orderId: orderId})).then(function(data){
            dispatch(push("/orders"));
        });
    }

    checkOrderError = (id) => {
        const { cartErrors } = this.state;
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

    onAll = (quantity, cartId) => {
        const { dispatch, token } = this.props;
        const orderId = this.props.location.pathname.split("/")[2];
        const { cartErrors } = this.state;
        const change = {
            orderId,
            cartId,
            quantity
        }
        //console.log(change);
        if (quantity === 0){
            this.setState({errorInput:"This product is empty"});
        }
        else {
            dispatch(changeOrder({token: token, change: change}));
            var index = 0;
            for (var i = 0; i < cartErrors.length; i++){
                if (cartErrors[i].id === cartId ){
                    index = i;
                }
            }
            cartErrors.splice(index,1)
            this.setState({});
        }
    }

    render() {
        const { user } = this.props.auth;
        const { accept, errorInput, cartErrors, approvingOrderError } = this.state;
        const { order, fetchingPendingOrdersError, orderError, loader } = this.props.order;
        let error = null;
        if (fetchingPendingOrdersError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Fetching Order</Message.Header>
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
        let orderView = null;
        if (order !== null) {
            orderView = order.details.map(function (cart) {
                return (
                    <Table.Row key={cart.id}>
                        <Table.Cell>{cart.mainSku}</Table.Cell>
                        <Table.Cell>{cart.desc}</Table.Cell>
                        <Table.Cell>{cart.quantity}</Table.Cell>
                        <Table.Cell>
                            {(accept !== cart.id) ? <div>{cart.accept} </div> : null}
                            {(accept === cart.id) ?
                              <div>
                                <Input defaultValue={cart.accept} onChange={this.handleAccept} className="mainContainer" />
                              </div> : null }
                              { (approvingOrderError && this.checkOrderError(cart.id).check) ? <Message negative>
                                                            <p>{approvingOrderError} {this.checkOrderError(cart.id).stock}</p>
                                                            {(this.checkOrderError(cart.id).stock !== 0) ? <Button onClick={() => this.onAll(this.checkOrderError(cart.id).stock, cart.id)}>All</Button> : null }
                                                        </Message> : null }
                        </Table.Cell>
                        <Table.Cell>{cart.capacity}</Table.Cell>
                        { (user.company === 'ISRA') ? <Table.Cell>
                            { (accept !== cart.id) ? <Button size='tiny' color='teal'  onClick={() => this.triggerChange(cart)}>Edit</Button> : null}
                            { (accept !== cart.id) ? <Button size='tiny' color='red' onClick={() => this.onPressDeleteCart(cart.id)}>Delete</Button> : null}
                            { (accept === cart.id) ? <Button size='tiny' color='blue' onClick={() => this.onPressChange(cart)}>Save</Button> : null }
                            { (accept === cart.id) ? <Button size='tiny' color='black' onClick={() => this.setState({accept: null, errorInput: null})}>Close</Button> : null }
                        </Table.Cell> : null }
                    </Table.Row>
                )
            }, this);
        }

        let tableView = <h4>No Order Found. Please Add Some </h4>
        if (order !== null) {
            tableView = (
                <Table celled columns={9}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>SKU</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Request</Table.HeaderCell>
                            <Table.HeaderCell>Accept</Table.HeaderCell>
                            <Table.HeaderCell>Box Capacity</Table.HeaderCell>
                            { (user.company === 'ISRA') ? <Table.HeaderCell>Option</Table.HeaderCell> : null }
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {orderView}
                    </Table.Body>
                    <Table.Footer>
                      <Table.Row>
                        <Table.HeaderCell colSpan='8' textAlign='right'>
                            { (user.company === 'ISRA') ? <Button floated='right' icon labelPosition='left' secondary size='small' onClick={() => this.onPressCancel()}>
                              <Icon name='close' /> Cancel
                            </Button> : null }
                            { (user.company === 'ISRA') ? <Button floated='right' icon labelPosition='left' primary size='small' onClick={() => this.onPressApprove()}>
                              <Icon name='checkmark' /> Approve
                            </Button> : null }
                            { (user.company !== 'ISRA') ? <Button floated='right' icon labelPosition='left' color='red' size='small' onClick={() => this.onPressDelete()}>
                              <Icon name='trash outline' /> Delete
                            </Button> : null }
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Footer>
                </Table>
            )
        }
        return (
            <BaseLayout>
                <Segment textAlign='center' padded='very' >
                    <Header as="h2">Order Details</Header>
                    {error}
                    {(!loader) ? <Container>
                        {tableView}
                    </Container> : null }
                </Segment>
                {(loader) ? <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                  </Dimmer> : null}
            </BaseLayout>
        )
    }
}

function mapStatesToProps(state) {
    return {
        token: state.auth.token,
        order: state.order,
        auth: state.auth,
        location: state.router.location,
        inventory: state.inventory
    }
}

export default connect(mapStatesToProps)(ViewOrder);
