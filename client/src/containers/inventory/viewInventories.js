import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Container, Button, Input, Modal, Grid, Search, Pagination, Dropdown } from "semantic-ui-react";
import { push } from 'react-router-redux';
import axios from 'axios';
import jsPDF from 'jspdf';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { getInventories, deleteInventory, rejectEdit, updateInventory, sortInventory, reverseInventory, changeInventory,
         trackNumber, openPlus, closePlus, openMinus, closeMinus, filterInventory, renderPage, recoverPage, changeDisplay } from "./../../actions/InventoryActions";

import { generateBarcode } from "./../../actions/BarcodeActions";

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

    onPressEdit = (inventory) => {
        const { user } = this.props.auth;
        const { dispatch } = this.props;
        if (user.company !== 'ISRA'){
            dispatch(rejectEdit());
        }
        else{
           dispatch(push("/inventory/" + inventory.id));
        }

    }

    onOpenPlus = (inventory) => {
        const { dispatch } = this.props;
        dispatch(openPlus(inventory.id));
        this.setState({errorInput: null});
    }

    onClosePlus = () => {
        const { dispatch } = this.props;
        dispatch(closePlus());
        this.setState({errorInput: null});
    }

    onOpenMinus = (inventory) => {
        const { dispatch } = this.props;
        dispatch(openMinus(inventory.id));
        this.setState({errorInput: null});
    }

    onCloseMinus = () => {
        const { dispatch } = this.props;
        dispatch(closeMinus());
        this.setState({errorInput: null});
    }

    onAddInv = (inventory) => {
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

    onMinusInv = (inventory) => {
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

    onPressDelete = (inventory) => {
        const { token, dispatch } = this.props;
        dispatch(deleteInventory({ token: token, inventory: inventory }));
    }

    handleInput = (e) => {
        const { token, dispatch } = this.props;
        dispatch(trackNumber(e.target.value));
    }

    handleSearch = (e) => {
        const { dispatch } = this.props;
        if (e.target.value !== "") dispatch(filterInventory(e.target.value));
        else dispatch(recoverPage());
    }

    handleSort = clickedColumn => () => {
        const { dispatch } = this.props;
        const { column, direction } = this.state;
        const { inventories } = this.props.inventory;
        console.log(column);
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

    saveBarcode = (sku) => {
        const { dispatch } = this.props;
        axios.get('https://api-bwipjs.metafloor.com/?bcid=code128&scaleY=1&text=' + sku, {responseType: 'blob'})
            .then(function (response) {
                const data = response.data;
                var reader = new window.FileReader();
                reader.readAsDataURL(data);
                reader.onload = function () {
                    var imageDataUrl = reader.result;
                    var doc = new jsPDF('l', 'in', [1, 2.5]);
                    doc.setFontSize(12);
                    doc.addImage(imageDataUrl, 'JPEG', 0.4, 0.2, 1.7, 0.25);
                    doc.text(0.4,0.7,sku);
                    doc.save(sku + ".pdf");
                }
            })
            .catch(function(error){
                const response = error.response;
                throw response
            })
    }

    handleDisplay = (e, data) => {
        const { dispatch } = this.props;
        dispatch(changeDisplay(data.value));
    }

    render() {
        const { column, direction, errorInput } = this.state;
        const { user } = this.props.auth;
        const { inventories, isFetchingInventories, fetchingInventoriesError, isDeletingInventory,
                deletingInventoryError, isUpdatingInventory, updatingInventoryError } = this.props.inventory;
        const { quantity, openPlus, openMinus, activePage, allPages, displayNumber } = this.props.inventory;
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
        const page = Math.ceil(inventories.length/3);

        const inventoriesView = inventories.map(function (inventory) {
            return (
                <Table.Row key={inventory.id}>
                    <Table.Cell>{inventory.sku}</Table.Cell>
                    <Table.Cell>{inventory.productName.en}</Table.Cell>
                    <Table.Cell>{inventory.price}</Table.Cell>
                    <Table.Cell>{inventory.unit}</Table.Cell>
                    <Table.Cell>{inventory.capacity}</Table.Cell>
                    <Table.Cell>
                        <div>{inventory.stock}</div>
                        <hr />
                        { (openPlus === inventory.id) ?
                            <Grid columns={2} divided>
                              <Grid.Row>
                                <Grid.Column className="columnForInput" textAlign='center'>
                                    <Input placeholder='Quantity' className="inputBox" size='mini' defaultValue={quantity} onChange={this.handleInput} />
                                </Grid.Column>
                                    <Grid.Column className="columnForButton" textAlign='center'>
                                        <Grid columns={2}>
                                            <Grid.Row>
                                                <Grid.Column textAlign='center'>
                                                    <Icon name='add' size='large' onClick={() => this.onAddInv(inventory)} />
                                                </Grid.Column>
                                                <Grid.Column textAlign='center'>
                                                    <Icon name='close' size='large' onClick={this.onClosePlus} />
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
                                          <Input placeholder='Quantity' className="inputBox" size='mini' defaultValue={quantity} onChange={this.handleInput} />
                                      </Grid.Column>
                                          <Grid.Column className="columnForButton" textAlign='center'>
                                              <Grid columns={2}>
                                                  <Grid.Row>
                                                      <Grid.Column textAlign='center'>
                                                          <Icon name='minus' size='large' onClick={() => this.onMinusInv(inventory)} />
                                                      </Grid.Column>
                                                      <Grid.Column textAlign='center'>
                                                          <Icon name='close' size='large' onClick={this.onCloseMinus} />
                                                      </Grid.Column>
                                                  </Grid.Row>
                                              </Grid>
                                          </Grid.Column>
                                      </Grid.Row>
                                    </Grid>  : null }
                    </Table.Cell>
                    <Table.Cell>{inventory.pending}</Table.Cell>
                    <Table.Cell>
                        <Icon name='pencil' size='large' onClick={() => this.onPressEdit(inventory)} />
                        <Icon name='add' size='large' onClick={() => this.onOpenPlus(inventory)} />
                        <Icon name='minus' size='large' onClick={() => this.onOpenMinus(inventory)} />
                        <Icon name='trash outline' size='large' onClick={() => this.onPressDelete(inventory)} />
                        <Icon name='barcode' size='large' onClick={() => this.saveBarcode(inventory.sku)} />
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
                            <Table.HeaderCell width={1}>Pending Import</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Options</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {inventoriesView}
                    </Table.Body>
                    <Table.Footer>
                      <Table.Row>
                        <Table.HeaderCell colSpan='8' textAlign='right'>
                            <Pagination pointing activePage={activePage} onPageChange={this.handlePaginationChange} totalPages={allPages.length} />
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Footer>
                </Table>
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
