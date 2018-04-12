import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Container, Button, Input, Modal, Grid } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { getInventories, deleteInventory, rejectEdit,
          getSubInventories, addCart, trackNumber, showModal, closeModal,
          getCarts, updateCart, submitOrder, openAdd, closeAdd, errorInput, deleteCart } from "./../../actions/InventoryActions";

class ViewAndRequest extends Component {
    componentWillMount() {
        const { token, dispatch } = this.props;
        const { user } = this.props.auth;
        dispatch(getInventories({ token: token }));
        dispatch(getCarts({ token: token }));
    }
    onPressEdit(inventory) {
        const { user } = this.props.auth;
        const { dispatch } = this.props;
        if (user.company !== 'Mother Company'){
            dispatch(rejectEdit());
        }
        else{
           dispatch(push("/inventory/" + inventory.id));
        }

    }
    onPressDelete(inventory) {
        const { token, dispatch } = this.props;
        dispatch(deleteInventory({ token: token, inventory: inventory })).then(function (data) {
            dispatch(getInventories({ token: token }));
        });
    }
    handleOrder(e){
        const { token, dispatch } = this.props;
        dispatch(trackNumber(e.target.value));
    }

    onOpenAdd (inventory) {
        const { dispatch } = this.props;
        dispatch(openAdd(inventory.id));
    }

    onCloseAdd () {
        const { dispatch } = this.props;
        dispatch(closeAdd());
    }

    onAdd(){
        const { token, dispatch } = this.props;
        const { user } = this.props.auth;
        const { modalCart, pendingCarts } = this.props.inventory;
        var option = false;
        modalCart.token = token;
        pendingCarts.forEach(function(cart){
            if (modalCart.sku === cart.sku && modalCart.username === user.username){
                modalCart.id = cart.id;
                option = true;
            }
        });
        if (option){
            dispatch(updateCart(modalCart)).then(function(data){
                //window.location.reload();
            });
        }
        else {
            dispatch(addCart(modalCart)).then(function(data){
                //window.location.reload();
            });
        }
    }

    onCart (inventory) {
          const { dispatch } = this.props;
          const { quantity } = this.props.inventory;
          const { user } = this.props.auth;
          if (isNaN(quantity) || quantity === null){
              dispatch(errorInput());
          }
          else {
            var data = {
                sku : inventory.sku,
                productName : inventory.productName.en,
                quantity: quantity,
                username: user.username
            }
            dispatch(showModal(data));
          }
    }

    onClose(){
        const { dispatch } = this.props;
        dispatch(closeModal());
    }

    onSubmit(){
        const { dispatch, token} = this.props;
        const { pendingCarts } = this.props.inventory;
        var temp = [];
        pendingCarts.forEach(function(cart){
            temp.push({
                id: cart.id,
                sku: cart.sku,
                quantity: cart.quantity,
                productName: cart.productName,
                status: "added"
            });
        });
        const data = {
            token: token,
            carts: temp
        }
        dispatch(submitOrder(data)).then(function(data){
            dispatch(push("/orders"));
        });
    }

    onRemoveCart(cart){
        const { dispatch, token } = this.props;
        cart.token = token;
        dispatch(deleteCart(cart));
    }

    render() {
        const { user } = this.props.auth;
        const { inventories, isFetchingInventories, fetchingInventoriesError, deletingsInventoriesError, updatingInventoriesError } = this.props.inventory;
        const { quantity, pendingCarts, modal, dimmer, modalCart, openAdd, addIcon, closeIcon, errorInput } = this.props.inventory;
        let error = null;
        if (fetchingInventoriesError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Fetching Inventory</Message.Header>
                    <p>{fetchingInventoriesError}</p>
                </Message>
            )
        }
        else if (deletingsInventoriesError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Deleting Inventory</Message.Header>
                    <p>{deletingsInventoriesError}</p>
                </Message>
            )
        }
        else if (updatingInventoriesError){
          error = (
              <Message negative>
                  <Message.Header>Error while Updating Inventory</Message.Header>
                  <p>{updatingInventoriesError}</p>
              </Message>
          )
        }
        else if (errorInput){
          error = (
              <Message negative>
                  <Message.Header>Error while Inputing Value</Message.Header>
                  <p>{errorInput}</p>
              </Message>
          )
        }
        const inventoriesView = inventories.map(function (inventory) {
            return (
                <Table.Row key={inventory.id}>
                    <Table.Cell>{inventory.sku}</Table.Cell>
                    <Table.Cell>{inventory.productName.en}</Table.Cell>
                    <Table.Cell>{inventory.status}</Table.Cell>
                    <Table.Cell >{inventory.price}</Table.Cell>
                    <Table.Cell >
                        {inventory.stock}
                        <hr />
                        { (openAdd === inventory.id) ?
                                        <Grid columns={2} divided>
                                          <Grid.Row>
                                            <Grid.Column className="columnForInput" textAlign='center'>
                                                { (user.company !== 'Mother Company') ? <Input placeholder='Quantity' className="inputBox" size='mini' defaultValue={quantity} onChange={this.handleOrder.bind(this)} /> : null}
                                            </Grid.Column>
                                                <Grid.Column className="columnForButton" textAlign='center'>
                                                    <Grid columns={2}>
                                                        <Grid.Row>
                                                            <Grid.Column textAlign='center'>
                                                                { (user.company !== 'Mother Company') ? <Icon name='add' size='large' onClick={this.onCart.bind(this, inventory)} /> : null}
                                                            </Grid.Column>
                                                            <Grid.Column textAlign='center'>
                                                                { (user.company !== 'Mother Company' && closeIcon) ? <Icon name='close' size='large' onClick={this.onCloseAdd.bind(this)} /> : null }
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                    </Grid>
                                                </Grid.Column>
                                            </Grid.Row>
                                          </Grid>  : null }
                    </Table.Cell>
                    <Table.Cell >
                        { (user.company === 'Mother Company') ? <Icon name='trash outline' size='large' onClick={this.onPressDelete.bind(this, inventory)} /> : null }
                        { (user.company === 'Mother Company') ? <Icon name='pencil' size='large' onClick={this.onPressEdit.bind(this, inventory)} /> : null }
                        { (user.company !== 'Mother Company') ? <Button size='large' onClick={this.onOpenAdd.bind(this, inventory)}>Add</Button> : null }
                    </Table.Cell>
                </Table.Row>
            )
        }, this);
        const cartsView = pendingCarts.map(function(cart){
            return(
              <Table.Row key={cart.id}>
                  <Table.Cell>{cart.sku}</Table.Cell>
                  <Table.Cell>{cart.productName.en}</Table.Cell>
                  <Table.Cell>{cart.status}</Table.Cell>
                  <Table.Cell >{cart.quantity}</Table.Cell>
                  <Table.Cell >
                      <Button onClick={this.onRemoveCart.bind(this, cart)}>Remove</Button>
                  </Table.Cell>
              </Table.Row>
            )
        },this);
        let tableView = <h4>No Inventories Found. Please Add Some </h4>
        let cartList = <h4>Cart Empty. Please Add Some </h4>
        if (inventories.length > 0) {
            tableView = (
                <Table celled fixed color='blue'>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1}>SKU</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Product Name</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Status</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Price</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Stock</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Options</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {inventoriesView}
                    </Table.Body>
                </Table>
            )
        }
        if (pendingCarts.length > 0) {
            cartList = (
                <Table celled fixed color='red'>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1}>SKU</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Product Name</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Status</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Quantity</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Options</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {cartsView}
                    </Table.Body>
                </Table>
            )
        }
        let modalView = null;
        if (modalCart !== null){
            modalView = (
              <Modal open={modal} size='mini' onClose={this.close}>
                  <Modal.Header>Add To Cart</Modal.Header>
                  <Modal.Content>
                      <Header>Description</Header>
                      <p>SKU : {modalCart.sku}</p>
                      <p>Product Name : {modalCart.productName}</p>
                      <p>Quantity : {modalCart.quantity}</p>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button color='black' onClick={this.onClose.bind(this)}>
                      Cancel
                    </Button>
                    <Button positive icon='checkmark' labelPosition='right' content="Confirm" onClick={this.onAdd.bind(this)} />
                  </Modal.Actions>
                </Modal>
            )
        }
        return (
          <BaseLayout>
              <Segment textAlign='center'>
                  <Container>
                      <Header as="h2">Inventory List</Header>
                      {error}
                      {tableView}
                      {modalView}
                  </Container>
              </Segment>
              { (user.company !== 'Mother Company') ? <Segment textAlign='center'>
                    <Container>
                        <Header as="h2">Cart List</Header>
                        {cartList}
                        { (pendingCarts.length > 0) ? <Button onClick={this.onSubmit.bind(this)}>Submit</Button> : null}
                    </Container>
              </Segment> : null }
          </BaseLayout>
        )
    }
}

function mapStatesToProps(state) {
    return {
        token: state.auth.token,
        inventory: state.inventory,
        auth: state.auth
    }
}

export default connect(mapStatesToProps)(ViewAndRequest);
