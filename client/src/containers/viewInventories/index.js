import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Container, Button, Input, Modal, Grid, Search } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { getInventories, deleteInventory, rejectEdit, updateInventory, sortInventory, reverseInventory, changeInventory,
         trackNumber, openPlus, closePlus, openMinus, closeMinus, filterInventory } from "./../../actions/InventoryActions";

class ViewInventories extends Component {

    state = {
      column: null,
      direction: null,
      errorInput: null
    }

    componentWillMount() {
        const { token, dispatch } = this.props;
        const { user } = this.props.auth;
        if (user.company !== 'ISRA'){
            dispatch(push("/subInventory"));
        }
        dispatch(getInventories({ token: token }));
    }

    onPressEdit(inventory) {
        const { user } = this.props.auth;
        const { dispatch } = this.props;
        if (user.company !== 'ISRA'){
            dispatch(rejectEdit());
        }
        else{
           dispatch(push("/inventory/" + inventory.id));
        }

    }

    onOpenPlus(inventory){
        const { dispatch } = this.props;
        dispatch(openPlus(inventory.id));
        this.setState({errorInput: null});
    }

    onClosePlus () {
        const { dispatch } = this.props;
        dispatch(closePlus());
        this.setState({errorInput: null});
    }

    onOpenMinus(inventory){
        const { dispatch } = this.props;
        dispatch(openMinus(inventory.id));
        this.setState({errorInput: null});
    }

    onCloseMinus () {
        const { dispatch } = this.props;
        dispatch(closeMinus());
        this.setState({errorInput: null});
    }

    onAddInv(inventory){
        const { dispatch, token } = this.props;
        const { quantity } = this.props.inventory;
        const { user } = this.props.auth;
        if (isNaN(quantity) || quantity === null || (quantity + "").trim() === ""){
            this.setState({errorInput: "Quantity cannot be empty and must be a number"});
        }
        else if (quantity <= 0){
            this.setState({errorInput: "Quantity has to be larger than 0"});
        }
        else if(!Number.isInteger(Number(quantity))) {
            this.setState({errorInput: "Quantity has to be integer"});
        }
        else {
            const newStock = (inventory.stock + Number(quantity)).toString();
            const data = {
                id: inventory.id,
                sku: inventory.sku,
                productName: inventory.productName.en,
                price: inventory.price,
                capacity: inventory.capacity,
                unit: inventory.unit,
                stock: newStock,
                token: token
            }
            //console.log(data);
            dispatch(updateInventory(data)).then(function(data){
                dispatch(changeInventory({id: inventory.id, stock: inventory.stock + Number(quantity)}));
            });
            this.setState({column: null, errorInput: null});
        }
    }

    onMinusInv(inventory){
        const { dispatch, token } = this.props;
        const { quantity } = this.props.inventory;
        const { user } = this.props.auth;
        if (isNaN(quantity) || quantity === null || (quantity + "").trim() === ""){
            this.setState({errorInput: "Quantity cannot be empty and must be a number"});
        }
        else if (quantity <= 0){
            this.setState({errorInput: "Quantity has to be larger than 0"});
        }
        else if(!Number.isInteger(Number(quantity))) {
            this.setState({errorInput: "Quantity has to be integer"});
        }
        else if(quantity > inventory.stock){
            this.setState({errorInput: "Quantity must be less than or equal to stock"});
        }
        else {
            const newStock = (inventory.stock - Number(quantity)).toString();
            const data = {
                id: inventory.id,
                sku: inventory.sku,
                productName: inventory.productName.en,
                price: inventory.price,
                unit: inventory.unit,
                capacity: inventory.capacity,
                unit: inventory.unit,
                stock: newStock,
                token: token
            }
            dispatch(updateInventory(data)).then(function(data){
                dispatch(changeInventory({id: inventory.id, stock: inventory.stock - Number(quantity)}));
            });
            this.setState({column: null, errorInput: null});
        }
    }

    onPressDelete(inventory) {
        const { token, dispatch } = this.props;
        dispatch(deleteInventory({ token: token, inventory: inventory }));
    }

    handleInput(e){
        const { token, dispatch } = this.props;
        dispatch(trackNumber(e.target.value));
    }

    handleSearch = (e) => {
        const { dispatch } = this.props;
        dispatch(filterInventory(e.target.value));
    }

    handleSort = clickedColumn => () => {
        const { dispatch } = this.props;
        const { column, direction } = this.state;
        const { inventories } = this.props.inventory;
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

    render() {
        const { column, direction, errorInput } = this.state;
        const { user } = this.props.auth;
        const { inventories, isFetchingInventories, fetchingInventoriesError, isDeletingInventory,
                deletingInventoryError, isUpdatingInventory, updatingInventoryError } = this.props.inventory;
        const { quantity, openPlus, openMinus } = this.props.inventory;
        let error = null;
        if (fetchingInventoriesError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Fetching Inventory</Message.Header>
                    <p>{fetchingInventoriesError}</p>
                </Message>
            )
        }
        else if (deletingInventoryError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Deleting Inventory</Message.Header>
                    <p>{deletingsInventoriesError}</p>
                </Message>
            )
        }
        else if (updatingInventoryError){
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
                    <Table.Cell >{inventory.price}</Table.Cell>
                    <Table.Cell >{inventory.unit}</Table.Cell>
                    <Table.Cell >{inventory.capacity}</Table.Cell>
                    <Table.Cell >
                        {inventory.stock}
                        <hr />
                        { (openPlus === inventory.id) ?
                            <Grid columns={2} divided>
                              <Grid.Row>
                                <Grid.Column className="columnForInput" textAlign='center'>
                                    <Input placeholder='Quantity' className="inputBox" size='mini' defaultValue={quantity} onChange={this.handleInput.bind(this)} />
                                </Grid.Column>
                                    <Grid.Column className="columnForButton" textAlign='center'>
                                        <Grid columns={2}>
                                            <Grid.Row>
                                                <Grid.Column textAlign='center'>
                                                    <Icon name='add' size='large' onClick={this.onAddInv.bind(this, inventory)} />
                                                </Grid.Column>
                                                <Grid.Column textAlign='center'>
                                                    <Icon name='close' size='large' onClick={this.onClosePlus.bind(this)} />
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Grid.Column>
                                </Grid.Row>
                              </Grid>  : null }
                              { (openMinus === inventory.id) ?
                                  <Grid columns={2} divided>
                                    <Grid.Row>
                                      <Grid.Column className="columnForInput" textAlign='center'>
                                          <Input placeholder='Quantity' className="inputBox" size='mini' defaultValue={quantity} onChange={this.handleInput.bind(this)} />
                                      </Grid.Column>
                                          <Grid.Column className="columnForButton" textAlign='center'>
                                              <Grid columns={2}>
                                                  <Grid.Row>
                                                      <Grid.Column textAlign='center'>
                                                          <Icon name='minus' size='large' onClick={this.onMinusInv.bind(this, inventory)} />
                                                      </Grid.Column>
                                                      <Grid.Column textAlign='center'>
                                                          <Icon name='close' size='large' onClick={this.onCloseMinus.bind(this)} />
                                                      </Grid.Column>
                                                  </Grid.Row>
                                              </Grid>
                                          </Grid.Column>
                                      </Grid.Row>
                                    </Grid>  : null }
                    </Table.Cell>
                    <Table.Cell >
                        <Icon name='pencil' size='large' onClick={this.onPressEdit.bind(this, inventory)} />
                        <Icon name='add' size='large' onClick={this.onOpenPlus.bind(this, inventory)} />
                        <Icon name='minus' size='large' onClick={this.onOpenMinus.bind(this, inventory)} />
                        <Icon name='trash outline' size='large' onClick={this.onPressDelete.bind(this, inventory)} />
                    </Table.Cell>
                </Table.Row>
            )
        }, this);
        let tableView = <h4>No Inventories Found. Please Add Some </h4>
        if (inventories.length > 0) {
            tableView = (
                <Table sortable celled fixed color='blue'>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1} sorted={column === 'sku' ? direction : null} onClick={this.handleSort('sku')}>SKU</Table.HeaderCell>
                            <Table.HeaderCell width={2} sorted={column === 'productName.en' ? direction : null} onClick={this.handleSort('productName.en')}>Product Description</Table.HeaderCell>
                            <Table.HeaderCell width={1} sorted={column === 'price' ? direction : null} onClick={this.handleSort('price')}>Price</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Unit</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Box Capacity</Table.HeaderCell>
                            <Table.HeaderCell width={2} sorted={column === 'stock' ? direction : null} onClick={this.handleSort('stock')}>Stock</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Options</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {inventoriesView}
                    </Table.Body>
                </Table>
            )
        }

        return (
          <BaseLayout>
              <Segment textAlign='center'>
                  <Container>
                        <Header as="h2">Inventory List</Header>
                        <div style={{textAlign: 'right'}}>
                          <Input onChange={this.handleSearch} placeholder='Search...' />
                        </div>
                      {error}
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
        inventory: state.inventory,
        auth: state.auth
    }
}

export default connect(mapStatesToProps)(ViewInventories);
