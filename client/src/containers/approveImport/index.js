import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Container, Button, Responsive, Input, Grid } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { getPendingImports, deleteImport, inputCapacity, inputCount, updateImport } from "./../../actions/ImportActions";

import { approveInventory } from "./../../actions/InventoryActions";

class ApproveImport extends Component {
    state = {
        capacity: null,
        count: null,
        errorInput: null
    }
    componentWillMount() {
        const { token, dispatch } = this.props;
        dispatch(getPendingImports({ token: token }));
    }
    onPressApprove = (importData) => {
        const { dispatch, token } = this.props;
        dispatch(approveInventory({token: token, importData: importData})).then(function(data){
            dispatch(getPendingImports({ token: token }));
        });
    }

    onPressEdit = (importData) => {
        const { dispatch, token } = this.props;
        const { capacity, count } = this.props.import;
        if (isNaN(capacity) || !Number.isInteger(Number(capacity)) || capacity === null || capacity <= 0 ||
            isNaN(count) || !Number.isInteger(Number(count)) || count === null || count <= 0){
            this.setState({errorInput: "Invalid Input"});
        }
        else {
            const data = {
                token,
                id: importData.id,
                code: importData.code,
                capacity,
                count,
                quantity: capacity * count
            }
            //console.log(data);
            dispatch(updateImport(data)).then(function(data){
                  dispatch(getPendingImports({ token: token }));
            });
            this.setState({capacity: null, count: null, errorInput: null})
        }
    }

    onPressDelete = (importData) => {
          const { dispatch, token } = this.props;
          dispatch(deleteImport({token: token, importData: importData})).then(function(data){
              dispatch(getPendingImports({ token: token }));
          });
    }

    triggerChange = (importData) => {
        const { dispatch } = this.props;
        this.setState({capacity: importData.id, count: importData.id});
        dispatch(inputCapacity(importData.capacity));
        dispatch(inputCount(importData.count));
    }

    handleCapacity = (e) => {
        const { dispatch } = this.props;
        dispatch(inputCapacity(e.target.value));
    }

    handleCount = (e) => {
        const { dispatch } = this.props;
        dispatch(inputCount(e.target.value));
    }

    render() {
        const { capacity, count, errorInput } = this.state;
        const { user } = this.props.auth;
        const isWorker = user.roles.indexOf("worker") >= 0;
        const isStoreManager = user.roles.indexOf("storeManager") >= 0;
        const isAdmin = user.roles.indexOf("admin") >= 0;
        const { pendingImports, isFetchingImports, fetchingImportsError, deletingsImportsError } = this.props.import;
        let error = null;
        if (fetchingImportsError || deletingsImportsError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Fetching Import</Message.Header>
                    <p>{fetchingImportsError}</p>
                    <p>{deletingsImportsError}</p>
                </Message>
            )
        }
        if (errorInput) {
            error = (
                <Message negative>
                    <Message.Header>Error while Inputing Value</Message.Header>
                    <p>{errorInput}</p>
                </Message>
            )
        }
        const importsView = pendingImports.map(function (importData) {
            return (
                <Table.Row key={importData.id}>
                    <Table.Cell>{importData.sku}</Table.Cell>
                    <Table.Cell>{importData.code}</Table.Cell>
                    <Table.Cell>
                          {(capacity !== importData.id) ? <div>{importData.capacity}</div> : null}
                          {(capacity === importData.id) ?
                            <div>
                              <Input defaultValue={importData.capacity} onChange={this.handleCapacity} className="mainContainer" />
                            </div> : null }
                    </Table.Cell>
                    <Table.Cell>
                          {(count !== importData.id) ? <div>{importData.count}</div> : null}
                          {(count === importData.id) ?
                            <div>
                              <Input defaultValue={importData.count} onChange={this.handleCount} className="mainContainer" />
                            </div> : null }
                    </Table.Cell>
                    <Table.Cell>{importData.quantity}</Table.Cell>
                    <Table.Cell>{importData.createdAt.slice(0,10)}</Table.Cell>
                    <Table.Cell>{importData.username}</Table.Cell>
                    <Table.Cell >
                          { (isStoreManager || isAdmin) && (capacity !== importData.id) ? <Button size='tiny' color='teal'  onClick={() => this.triggerChange(importData)}><Icon name='pencil' /></Button> : null }
                          { (isStoreManager || isAdmin) && (capacity !== importData.id) ? <Button size='tiny' color='green'  onClick={() => this.onPressApprove(importData)}><Icon name='checkmark' /></Button> : null }
                          { (capacity !== importData.id) ? <Button size='tiny' color='red' onClick={() => this.onPressDelete(importData)}><Icon name='trash outline' /></Button> : null }
                          { (capacity === importData.id) ? <Button size='tiny' color='blue' onClick={() => this.onPressEdit(importData)}>Save</Button> : null }
                          { (capacity === importData.id) ? <Button size='tiny' color='black' onClick={() => this.setState({capacity: null, count: null, errorInput: null})}>Close</Button> : null }
                    </Table.Cell>
                </Table.Row>
            )
        }, this);
        let tableView = <h4>No Imports Found. Please Add Some </h4>
        if (pendingImports.length > 0) {
            tableView = (
                <Table celled fixed>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={2}>SKU</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Code</Table.HeaderCell>
                            <Table.HeaderCell>Box Capacity</Table.HeaderCell>
                            <Table.HeaderCell>Count</Table.HeaderCell>
                            <Table.HeaderCell>Quantity</Table.HeaderCell>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>Imported By</Table.HeaderCell>
                            <Table.HeaderCell width={3}>Options</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {importsView}
                    </Table.Body>
                </Table>
            )
        }
        const importsPhoneView = pendingImports.map(function (importData) {
            return (
                <div key={importData.id}>
                    <p>SKU: {importData.sku}</p>
                    <p>Code: {importData.code}</p>
                    <p>Box Capacity: {importData.capacity}</p>
                    <p>Box Count: {importData.count}</p>
                    <p>Quantity: {importData.quantity}</p>
                    <p>Status: {importData.status}</p>
                    <p>Imported By: {importData.username}</p>
                    { (isStoreManager) ? <Button color='green'  onClick={() => this.onPressApprove(importData)}><Icon name='checkmark' />Approve</Button> : null }
                    <Button color='red' onClick={() => this.onPressDelete(importData)}><Icon name='trash outline' />Delete</Button>
                    <hr />
                </div>
            )
        }, this);

        let phoneView = <h4>No Imports Found. Please Add Some </h4>
        if (pendingImports.length > 0){
            phoneView = (
                <div>{importsPhoneView}</div>
            )
        }
        return (
            <BaseLayout>
                <Segment textAlign='center' >
                    <Header as="h2">Pending Import List</Header>
                    {error}
                    <Container>
                      <Responsive maxWidth={414}>
                          {phoneView}
                      </Responsive>
                      <Responsive minWidth={415}>
                          {tableView}
                      </Responsive>
                    </Container>
                </Segment>
            </BaseLayout>
        )
    }
}

function mapStatesToProps(state) {
    return {
        token: state.auth.token,
        import: state.importData,
        auth: state.auth,
        inventory: state.inventory
    }
}

export default connect(mapStatesToProps)(ApproveImport);
