import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Container, Button, Input } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import { getInventories, deleteInventory, rejectEdit, getSubInventories, addToCart, trackNumber } from "./../../actions/InventoryActions";
import { setRequestingInventory } from "./../../actions/RequestActions";

class ViewInventory extends Component {
    componentWillMount() {
        const { token, dispatch } = this.props;
        //console.log(this.props);
        const { user } = this.props.auth;
        dispatch(getInventories({ token: token }));
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
        //console.log(e.target.value);
        dispatch(trackNumber(e.target.value));
    }
    /*onRequest(inventory){
       const { dispatch } = this.props;
       dispatch(setRequestingInventory(this.props.inventory.inventories, inventory.id));
       dispatch(push("/request/" + inventory.id));
    }*/
    onRequest(inventory){
        const { token, dispatch } = this.props;
        dispatch(addToCart(inventory))
    }

    render() {
        const { user } = this.props.auth;
        const { inventories, isFetchingInventories, fetchingInventoriesError, deletingsInventoriesError, updatingInventoriesError } = this.props.inventory;
        const { quantity } = this.props.inventory;
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
        const inventoriesView = inventories.map(function (inventory) {
            return (
                <Table.Row key={inventory.id}>
                    <Table.Cell>{inventory.sku}</Table.Cell>
                    <Table.Cell>{inventory.productName.en}</Table.Cell>
                    <Table.Cell>{inventory.status}</Table.Cell>
                    <Table.Cell >{inventory.price}</Table.Cell>
                    <Table.Cell >{inventory.stock}</Table.Cell>
                    <Table.Cell >
                        { (user.company === 'Mother Company') ? <Icon name='trash outline' size='large' onClick={this.onPressDelete.bind(this, inventory)} /> : null }
                        { (user.company === 'Mother Company') ? <Icon name='pencil' size='large' onClick={this.onPressEdit.bind(this, inventory)} /> : null }
                        { (user.company !== 'Mother Company') ? <Input placeholder='Quantity' onChange={this.handleOrder.bind(this)} /> : null}
                        { (user.company !== 'Mother Company') ? <Button onClick={this.onRequest.bind(this, inventory)}>Request</Button> : null}
                    </Table.Cell>
                </Table.Row>
            )
        }, this);
        let tableView = <h4>No Inventories Found. Please Add Some </h4>
        if (inventories.length > 0) {
            tableView = (
                <Table celled fixed>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1}>SKU</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Product Name</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Status</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Price</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Stock</Table.HeaderCell>
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
                <Container>
                    <Header as="h2">Inventory List</Header>
                        {error}
                        {/* <Segment loading={isFetchingInventories}> */}
                        {tableView}
                        {quantity}
                </Container>
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

export default connect(mapStatesToProps)(ViewInventory);
