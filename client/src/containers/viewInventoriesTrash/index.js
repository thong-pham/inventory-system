import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Container, Button, Input, Modal, Grid, Search } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { getInventoriesInTrash, recoverInventory, deleteInventoryInTrash } from "./../../actions/InventoryActions";

class ViewTrash extends Component {

    state = {
      errorInput: null
    }

    componentWillMount() {
        const { token, dispatch } = this.props;
        const { user } = this.props.auth;
        if (user.company !== 'ISRA'){
            dispatch(push("/subInventory"));
        }
        dispatch(getInventoriesInTrash({ token: token }));
    }

    onPressRecover = (inventory) => {
        const { dispatch, token } = this.props;
        dispatch(recoverInventory({token: token, inventory: inventory}));
    }

    onPressDelete = (inventory) => {
        const { token, dispatch } = this.props;
        dispatch(deleteInventoryInTrash({token: token, inventory: inventory}));
    }

    render() {
        const { errorInput } = this.state;
        const { user } = this.props.auth;
        const { inventoriesInTrash, isFetchingInventoriesInTrash,
                fetchingInventoriesInTrashError, recoveringInventoryError, deleteInventoryInTrash } = this.props.inventory;

        let error = null;
        if (fetchingInventoriesInTrashError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Fetching Inventory</Message.Header>
                    <p>{fetchingInventoriesInTrashError}</p>
                </Message>
            )
        }
        else if (recoveringInventoryError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Recovering Inventory</Message.Header>
                    <p>{recoveringInventoryError}</p>
                </Message>
            )
        }
        else if (deleteInventoryInTrash) {
            error = (
                <Message negative>
                    <Message.Header>Error while Deleting Inventory</Message.Header>
                    <p>{deleteInventoryInTrash}</p>
                </Message>
            )
        }
        const inventoriesView = inventoriesInTrash.map(function (inventory) {
            return (
                <Table.Row key={inventory.id}>
                    <Table.Cell>{inventory.sku}</Table.Cell>
                    <Table.Cell>{inventory.productName.en}</Table.Cell>
                    <Table.Cell>{inventory.price}</Table.Cell>
                    <Table.Cell>{inventory.unit}</Table.Cell>
                    <Table.Cell>{inventory.capacity}</Table.Cell>
                    <Table.Cell>{inventory.stock}</Table.Cell>
                    <Table.Cell>
                        <Button color='teal' onClick={() => this.onPressRecover(inventory)}><Icon name='repeat' />Recover</Button>
                        <Button color='red' onClick={() => this.onPressDelete(inventory)}><Icon name='trash outline' />Delete</Button>
                    </Table.Cell>
                </Table.Row>
            )
        }, this);
        let tableView = <h4>No Inventories Found</h4>
        if (inventoriesInTrash.length > 0) {
            tableView = (
                <Table celled fixed color='blue'>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1}>SKU</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Product Description</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Price</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Unit</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Box Capacity</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Stock</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Options</Table.HeaderCell>
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
                        <Header as="h2">Inventories In Trash</Header>
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

export default connect(mapStatesToProps)(ViewTrash);
