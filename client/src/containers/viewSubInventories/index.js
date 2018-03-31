import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Container, Button } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import { getInventories, deleteInventory, rejectEdit } from "./../../actions/InventoryActions";
import { getSubInventories } from "./../../actions/SubInventoryActions";

class ViewSubInventory extends Component {
    componentWillMount() {
        const { token, dispatch } = this.props;
        //console.log(this.props);
        const { user } = this.props.auth;
        if (user.company !== 'Mother Company'){
            dispatch(getSubInventories({ token: token }));
        }
        else {
            dispatch(push("/inventory"));
        }
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
    onRequest(inventory){
       const { dispatch } = this.props;
       dispatch(push("/request/" + inventory.id));
    }

    render() {
        const { user } = this.props.auth;
        const { inventories, isFetchingInventories, fetchingInventoriesError, deletingsInventoriesError, updatingInventoriesError } = this.props.inventory;
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
                        <Icon name='trash outline' size='large' onClick={this.onPressDelete.bind(this, inventory)} />
                        <Icon name='pencil' size='large' onClick={this.onPressEdit.bind(this, inventory)} />
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
            <BaseLayout>
                <Segment textAlign='center' >
                    <Header as="h2">{user.company} - Inventory List</Header>
                    {error}
                    {/* <Segment loading={isFetchingInventories}> */}
                    <Container>
                        {tableView}
                    </Container>
                    {/* </Segment> */}
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
