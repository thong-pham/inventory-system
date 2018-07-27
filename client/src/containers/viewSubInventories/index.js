import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Container, Button, Grid, Input, Modal, Dropdown, Pagination } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { getSubInventories, getSubInventoriesByCompany, deleteSubInventory,
        openAdd, closeAdd, trackNumber, showModal, closeModal,
        addCart, updateCart, deleteCart, submitOrder, getCarts, clearError, clearInventory, filterInventory, recoverPage, renderPage, changeDisplay,
        sortInventory, reverseInventory
      } from "./../../actions/SubInventoryActions";

class ViewSubInventory extends Component {
    state = {
        column: null,
        direction: null,
        errorInput: null
    }
    componentWillMount() {
        const { token, dispatch } = this.props;
        const { user } = this.props.auth;
        dispatch(getSubInventoriesByCompany({ token: token }));
        dispatch(getCarts({token: token}));
        dispatch(clearError());
    }
    onPressEdit(inventory) {
        const { user } = this.props.auth;
        const { dispatch } = this.props;
        dispatch(push("/subInventory/" + inventory.id));

    }
    onPressDelete(inventory) {
        const { token, dispatch } = this.props;
        dispatch(deleteSubInventory({ token: token, inventory: inventory }));
    }

    onOpenAdd (inventory) {
        const { dispatch } = this.props;
        dispatch(openAdd(inventory.id));
    }

    onCloseAdd () {
        const { dispatch } = this.props;
        dispatch(closeAdd());
        this.setState({errorInput: null});
    }

    handleInput(e){
        const { token, dispatch } = this.props;
        dispatch(trackNumber(e.target.value));
    }

    onCart (inventory) {
          const { dispatch } = this.props;
          const { quantity } = this.props.inventory;
          const { user } = this.props.auth;
          if (isNaN(quantity) || quantity === null || quantity <= 0 || !Number.isInteger(Number(quantity))){
              this.setState({errorInput: "Invalid Input"});
          }
          else if (quantity > inventory.mainStock) {
              this.setState({errorInput: "Request cannot be larger than the current stock"});
          }
          else {
            var data = {
                sku : inventory.sku,
                mainSku: inventory.mainSku,
                desc: inventory.productName.en,
                quantity: quantity,
                capacity: inventory.capacity,
                username: user.username
            }
            dispatch(showModal(data));
            this.setState({errorInput: null});
          }
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
            dispatch(updateCart(modalCart));
        }
        else {
            dispatch(addCart(modalCart));
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
                accept: cart.quantity,
                mainSku: cart.mainSku,
                capacity: cart.capacity,
                desc: cart.desc,
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

    handleSearch = (e) => {
        const { dispatch } = this.props;
        if (e.target.value !== "") dispatch(filterInventory(e.target.value));
        else dispatch(recoverPage());
    }

    handlePaginationChange = (e, data) => {
        const { dispatch } = this.props;
        //this.setState({column: null});
        dispatch(renderPage(data.activePage));
    }

    handleDisplay = (e, data) => {
        const { dispatch } = this.props;
        dispatch(changeDisplay(data.value));
    }

    handleSort = clickedColumn => () => {
        const { dispatch } = this.props;
        const { column, direction } = this.state;
        const { inventories } = this.props.inventory;
        //console.log(column);
        if (column !== clickedColumn){
            this.setState({
              column: clickedColumn,
              direction: 'ascending',
            });
            dispatch(sortInventory(clickedColumn));
        }
        else {
            this.setState({
               direction: direction === 'ascending' ? 'descending' : 'ascending',
            });
            dispatch(reverseInventory());
        }
    }

    handlePaginationChange = (e, data) => {
        const { dispatch } = this.props;
        //this.setState({column: null});
        dispatch(renderPage(data.activePage));
    }

    render() {
        const { column, direction, errorInput } = this.state;
        const { user } = this.props.auth;
        const { inventories, isFetchingInventories, fetchingInventoriesError, deletingsInventoriesError, updatingInventoriesError,
                openAdd, closeAdd, quantity, modalCart, modal,
                pendingCarts, activePage, allPages, displayNumber  } = this.props.inventory;
        var displayOptions = [
                              {key:1, text:'15', value: 15},
                              {key:2, text:'50', value: 50},
                              {key:3, text:'100', value: 100},
                              {key:4, text:'250', value: 250}
                            ];
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
        if (errorInput){
          error = (
              <Message negative>
                  <Message.Header>Error while Inputing Data</Message.Header>
                  <p>{errorInput}</p>
              </Message>
          )
        }
        const inventoriesView = inventories.map(function (inventory) {
            return (
                <Table.Row key={inventory.id}>
                    <Table.Cell>{inventory.sku}</Table.Cell>
                    <Table.Cell>{inventory.productName.en}</Table.Cell>
                    <Table.Cell>
                        {inventory.mainStock}
                        <hr />
                        { (openAdd === inventory.id) ?
                            <Grid columns={2} divided>
                              <Grid.Row>
                                <Grid.Column className="columnForInput" textAlign='center'>
                                    <Input placeholder='Quantity' className="inputBox" size='mini' defaultValue={quantity} onChange={this.handleInput.bind(this)} />
                                </Grid.Column>
                                    <Grid.Column className="columnForButton" textAlign='center'>
                                        <Grid columns={2}>
                                            <Grid.Row>
                                                <Grid.Column textAlign='center'>
                                                    <Icon name='add' size='large' onClick={this.onCart.bind(this, inventory)} />
                                                </Grid.Column>
                                                <Grid.Column textAlign='center'>
                                                    <Icon name='close' size='large' onClick={this.onCloseAdd.bind(this)} />
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Grid.Column>
                                </Grid.Row>
                              </Grid>  : null }
                    </Table.Cell>
                    <Table.Cell>{inventory.capacity}</Table.Cell>
                    <Table.Cell>{inventory.unit}</Table.Cell>
                    <Table.Cell >
                        { (openAdd !== inventory.id) ? <Button color='blue' onClick={this.onOpenAdd.bind(this, inventory)}><Icon name='plus square' /></Button> : null }
                        <Button color='teal' onClick={this.onPressEdit.bind(this, inventory)}><Icon name='pencil' /></Button>
                        <Button color='red' onClick={this.onPressDelete.bind(this, inventory)}><Icon name='trash outline' /></Button>
                    </Table.Cell>
                </Table.Row>
            )
        }, this);
        const cartsView = pendingCarts.map(function(cart){
            return(
              <Table.Row key={cart.id}>
                  <Table.Cell>{cart.sku}</Table.Cell>
                  <Table.Cell>{cart.desc}</Table.Cell>
                  <Table.Cell>{cart.capacity}</Table.Cell>
                  <Table.Cell>{cart.quantity}</Table.Cell>
                  <Table.Cell>{cart.status}</Table.Cell>
                  <Table.Cell >
                      <Button color='red' onClick={this.onRemoveCart.bind(this, cart)}>Remove</Button>
                  </Table.Cell>
              </Table.Row>
            )
        },this);
        let tableView = <h4>No Inventories Found. Please Add Some </h4>
        if (inventories.length > 0) {
            tableView = (
                <Table sortable celled fixed color='blue'>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1} sorted={column === 'sku' ? direction : null} onClick={this.handleSort('sku')}>SKU</Table.HeaderCell>
                            <Table.HeaderCell width={3} sorted={column === 'productName.en' ? direction : null} onClick={this.handleSort('productName.en')}>Product Description</Table.HeaderCell>
                            <Table.HeaderCell width={2} sorted={column === 'stock' ? direction : null} onClick={this.handleSort('stock')}>Main Stock</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Box Capacity</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Unit</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Options</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {inventoriesView}
                    </Table.Body>
                    <Table.Footer>
                      <Table.Row>
                        <Table.HeaderCell colSpan='6' textAlign='right'>
                            <Pagination pointing activePage={activePage} onPageChange={this.handlePaginationChange} totalPages={allPages.length} />
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Footer>
                </Table>
            )
        }
        let cartList = <h4>Cart Empty. Please Add Some </h4>
        if (pendingCarts.length > 0) {
            cartList = (
                <Table celled fixed color='red'>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1}>SKU</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Description</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Box Capcity</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Quantity</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Status</Table.HeaderCell>
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
                      <p>Product Description : {modalCart.desc}</p>
                      <p>Box Capacity : {modalCart.capacity}</p>
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
                    <Header as="h2">Inventory List</Header>
                    {error}
                    <Container>

                        <Grid columns={2}>
                          <Grid.Row>
                            <Grid.Column className="columnForInput" textAlign='left'>
                              <Dropdown
                                onChange={this.handleDisplay}
                                options={displayOptions}
                                placeholder=''
                                selection
                                compact
                                value={displayNumber}
                              />
                            </Grid.Column>
                                <Grid.Column className="columnForButton" textAlign='right'>
                                    <Input onChange={this.handleSearch} placeholder='Search by description...' />
                                </Grid.Column>
                            </Grid.Row>
                          </Grid>
                        {tableView}
                        {modalView}
                    </Container>
                </Segment>
                <Segment textAlign='center'>
                      <Container>
                          <Header as="h2">Cart List</Header>
                          {cartList}
                          { (pendingCarts.length > 0) ? <Button primary onClick={this.onSubmit.bind(this)}>Submit</Button> : null}
                      </Container>
                </Segment>
            </BaseLayout>
        )
    }
}

function mapStatesToProps(state) {
    return {
        token: state.auth.token,
        inventory: state.subInventory,
        auth: state.auth
    }
}

export default connect(mapStatesToProps)(ViewSubInventory);
