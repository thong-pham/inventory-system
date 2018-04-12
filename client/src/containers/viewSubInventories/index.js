import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Container, Button } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import { getSubInventories, getSubInventoriesByCompany } from "./../../actions/SubInventoryActions";

class ViewSubInventory extends Component {
    componentWillMount() {
        const { token, dispatch } = this.props;
        const { user } = this.props.auth;
        if (user.company !== 'Mother Company'){
            dispatch(getSubInventoriesByCompany({ token: token }));
        }
        else {
            dispatch(getSubInventories({ token: token }));
        }
    }
    onPressEdit(inventory) {
        const { user } = this.props.auth;
        const { dispatch } = this.props;
        dispatch(push("/subInventory/" + inventory.id));

    }
    onPressDelete(inventory) {
        const { token, dispatch } = this.props;
        dispatch(deleteInventory({ token: token, inventory: inventory })).then(function (data) {
            dispatch(getInventories({ token: token }));
        });
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
                    <Table.Cell>{inventory.price}</Table.Cell>
                    <Table.Cell>{inventory.stock}</Table.Cell>
                    { (user.company !== 'Mother Company') ? <Table.Cell >
                        <Icon name='trash outline' size='large' onClick={this.onPressDelete.bind(this, inventory)} />
                        <Icon name='pencil' size='large' onClick={this.onPressEdit.bind(this, inventory)} />
                    </Table.Cell> : null }
                    { (user.company === 'Mother Company') ? <Table.Cell >{inventory.company}</Table.Cell> : null}
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
                            { (user.company !== 'Mother Company') ? <Table.HeaderCell width={1}>Options</Table.HeaderCell> : null}
                            { (user.company === 'Mother Company') ? <Table.HeaderCell width={1}>Company</Table.HeaderCell> : null}
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
                    { (user.company !== 'Mother Company') ? <Header as="h2">{user.company} - Inventory List</Header> : null}
                    { (user.company === 'Mother Company') ? <Header as="h2">All Companies Inventory List</Header> : null}
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
        inventory: state.subInventory,
        auth: state.auth
    }
}

export default connect(mapStatesToProps)(ViewSubInventory);
