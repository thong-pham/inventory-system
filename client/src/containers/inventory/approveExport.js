import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Container, Button, Responsive, Input, Grid, Modal, Label } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { getPendingExports, deleteExport, inputCapacity, inputCount,
        updateExport, exportInventory, sortExport, reverseExport, putNextExport, approveExport,
        modifyExport, duplicateExport } from "./../../actions/ExportActions";

class ApproveExport extends Component {
    state = {
        capacity: null,
        count: null,
        errorInput: null,
        successInput: null,
        column: null,
        direction: null,
        modalCart: null,
        openModal: false,
        boxCount: null
    }
    componentWillMount() {
        const { token, dispatch } = this.props;
        dispatch(getPendingExports({ token: token }));
    }
    onPressApprove = (exportData) => {
        const { dispatch, token } = this.props;
        dispatch(approveExport({token: token, exportData: exportData})).then(function(data){
            //dispatch(getPendingExports({ token: token }));
        });
        //this.setState({column: null});
    }

    onPressEdit = (exportData) => {
        const { dispatch, token } = this.props;
        const { capacity, count } = this.props.export;
        if (isNaN(capacity) || !Number.isInteger(Number(capacity)) || capacity === null || capacity <= 0 ||
            isNaN(count) || !Number.isInteger(Number(count)) || count === null || count <= 0){
            this.setState({errorInput: "Invalid Input"});
        }
        else {
            const data = {
                token,
                id: exportData.id,
                code: exportData.code,
                capacity,
                count,
                quantity: capacity * count
            }
            //console.log(data);
            dispatch(updateExport(data)).then(function(data){
                  //dispatch(getPendingExports({ token: token }));
            });
            this.setState({capacity: null, count: null, errorInput: null})
        }
    }

    onPressDelete = (exportData) => {
          const { dispatch, token } = this.props;
          dispatch(deleteExport({token: token, exportData: exportData})).then(function(data){
              //dispatch(getPendingExports({ token: token }));
          });
          //this.setState({column: null});
    }

    onDuplicate = () => {
        const { dispatch, token } = this.props;
        const { modalCart, boxCount } = this.state;
        //console.log(boxCount);
        if (isNaN(boxCount) || !Number.isInteger(Number(boxCount)) || boxCount === null || boxCount <= 0){
            this.setState({errorInput: "Invalid Input", openModal: null});
        }
        else if (boxCount >= modalCart.count){
            this.setState({errorInput: "Box number has to be less than the current one", openModal: null, boxCount: null});
        }
        else {
            const data = {
               id: modalCart.id,
               count: Number(boxCount),
               token: token
            }
            //console.log(data);
            dispatch(duplicateExport(data)).then(function (response) {
                  dispatch(putNextExport({exportData: modalCart,response}));
            });
            this.setState({openModal: null, boxCount: null, successInput:"A new export has been created"});
        }
    }

    handleBoxCount = (e) => {
        this.setState({boxCount: e.target.value});
        //console.log(this.state.boxCount);
    }

    triggerChange = (exportData) => {
        const { dispatch } = this.props;
        this.setState({capacity: exportData.id, count: exportData.id});
        dispatch(inputCapacity(exportData.capacity));
        dispatch(inputCount(exportData.count));
    }

    handleCapacity = (e) => {
        const { dispatch } = this.props;
        dispatch(inputCapacity(e.target.value));
    }

    handleCount = (e) => {
        const { dispatch } = this.props;
        dispatch(inputCount(e.target.value));
    }

    handleSort = clickedColumn => () => {
        const { dispatch } = this.props;
        const { column, direction } = this.state;
        if (column !== clickedColumn){
            this.setState({
              column: clickedColumn,
              direction: 'ascending',
            });
            dispatch(sortExport(clickedColumn));
        }
        else {
            this.setState({
               direction: direction === 'ascending' ? 'descending' : 'ascending',
            });
            dispatch(reverseExport());
        }
    }

    openModal = (exportData) => {
          const { dispatch } = this.props;
          this.setState({openModal: true, modalCart: exportData, errorInput: null, successInput: null});
    }

    closeModal = () => {
        this.setState({openModal: false, modalCart: null, boxCount: null});
    }

    closeError = () => {
        this.setState({errorInput: null});
    }

    closeSuccess = () => {
        this.setState({successInput: null});
    }

    render() {
        const { capacity, count, errorInput, successInput, column, direction, openModal, modalCart } = this.state;
        const { user } = this.props.auth;
        const isWorker = user.roles.indexOf("worker") >= 0;
        const isStoreManager = user.roles.indexOf("storeManager") >= 0;
        const isAdmin = user.roles.indexOf("admin") >= 0;
        const { pendingExports, isFetchingExports, fetchingExportsError, deletingsExportsError, approvingExportError } = this.props.export;
        let error = null;
        let success = null;
        if (fetchingExportsError || deletingsExportsError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Fetching Export</Message.Header>
                    <p>{fetchingExportsError}</p>
                    <p>{deletingsExportsError}</p>
                </Message>
            )
        }
        else if (approvingExportError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Approving Export</Message.Header>
                    <p>{approvingExportError}</p>
                </Message>
            )
        }
        if (errorInput) {
            error = (
                <Message negative onDismiss={this.closeError}>
                    <Message.Header>ERROR</Message.Header>
                    <p>{errorInput}</p>
                </Message>
            )
        }
        if (successInput) {
            success = (
                <Message positive onDismiss={this.closeSuccess}>
                    <Message.Header>SUCCESS</Message.Header>
                    <p>{successInput}</p>
                </Message>
            )
        }
        const exportsView = pendingExports.map(function (exportData) {
            return (
                <Table.Row key={exportData.id}>
                    <Table.Cell>{exportData.sku}</Table.Cell>
                    <Table.Cell>{exportData.code}</Table.Cell>
                    <Table.Cell>
                          {(capacity !== exportData.id) ? <div>{exportData.capacity}</div> : null}
                          {(capacity === exportData.id) ?
                            <div>
                              <Input defaultValue={exportData.capacity} onChange={this.handleCapacity} className="mainContainer" />
                            </div> : null }
                    </Table.Cell>
                    <Table.Cell>
                          {(count !== exportData.id) ? <div>{exportData.count}</div> : null}
                          {(count === exportData.id) ?
                            <div>
                              <Input defaultValue={exportData.count} onChange={this.handleCount} className="mainContainer" />
                            </div> : null }
                    </Table.Cell>
                    <Table.Cell>{exportData.quantity}</Table.Cell>
                    <Table.Cell>{exportData.createdAt.slice(0,10)}</Table.Cell>
                    <Table.Cell>{exportData.username}</Table.Cell>
                    <Table.Cell >
                          { (isStoreManager || isAdmin) && (capacity !== exportData.id) ? <Button size='tiny' color='teal'  onClick={() => this.triggerChange(exportData)}><Icon name='pencil' /></Button> : null }
                          { (isStoreManager || isAdmin) && (capacity !== exportData.id) ? <Button size='tiny' color='green'  onClick={() => this.onPressApprove(exportData)}><Icon name='checkmark' /></Button> : null }
                          
                          { (capacity !== exportData.id) ? <Button size='tiny' color='red' onClick={() => this.onPressDelete(exportData)}><Icon name='trash outline' /></Button> : null }
                          { (capacity === exportData.id) ? <Button size='tiny' color='blue' onClick={() => this.onPressEdit(exportData)}>Save</Button> : null }
                          { (capacity === exportData.id) ? <Button size='tiny' color='black' onClick={() => this.setState({capacity: null, count: null, errorInput: null})}>Close</Button> : null }
                    </Table.Cell>
                </Table.Row>
            )
        }, this);
        let tableView = <h4>No Exports Found. Please Add Some </h4>
        if (pendingExports.length > 0) {
            tableView = (
                <Table celled fixed sortable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={2} sorted={column === 'sku' ? direction : null} onClick={this.handleSort('sku')}>SKU</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Code</Table.HeaderCell>
                            <Table.HeaderCell>Box Capacity</Table.HeaderCell>
                            <Table.HeaderCell>Box Count</Table.HeaderCell>
                            <Table.HeaderCell>Quantity</Table.HeaderCell>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>Exported By</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Options</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {exportsView}
                    </Table.Body>
                </Table>
            )
        }
        const exportsPhoneView = pendingExports.map(function (exportData) {
            return (
                <div key={exportData.id}>
                    <p>SKU: {exportData.sku}</p>
                    <p>Code: {exportData.code}</p>
                    <p>Box Capacity: {exportData.capacity}</p>
                    <p>Box Count: {exportData.count}</p>
                    <p>Quantity: {exportData.quantity}</p>
                    <p>Status: {exportData.status}</p>
                    <p>Exported By: {exportData.username}</p>
                    { (isStoreManager) ? <Button color='green'  onClick={() => this.onPressApprove(exportData)}><Icon name='checkmark' />Approve</Button> : null }
                    <Button color='red' onClick={() => this.onPressDelete(exportData)}><Icon name='trash outline' />Delete</Button>
                    <hr />
                </div>
            )
        }, this);
        let modalView = null;
        if (modalCart !== null){
            modalView = (
              <Modal open={openModal} size='mini' onClose={this.closeModal}>
                  <Modal.Header>How many Boxes ? </Modal.Header>
                  <Modal.Content>
                      <Input onChange={this.handleBoxCount} />
                  </Modal.Content>
                  <Modal.Actions>
                    <Button color='black' onClick={this.closeModal}>
                      Cancel
                    </Button>
                    <Button positive icon='checkmark' labelPosition='right' content="Confirm" onClick={() => this.onDuplicate()}/>
                  </Modal.Actions>
                </Modal>
            )
        }
        let phoneView = <h4>No Exports Found. Please Add Some </h4>
        if (pendingExports.length > 0){
            phoneView = (
                <div>{exportsPhoneView}</div>
            )
        }
        return (
            <BaseLayout>
                <Segment textAlign='center' >
                    <Header as="h2">Pending Export List</Header>
                    {error}
                    {success}
                    <Container>
                      <Responsive maxWidth={414}>
                          {phoneView}
                      </Responsive>
                      <Responsive minWidth={415}>
                          {tableView}
                          {modalView}
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
        export: state.exportData,
        auth: state.auth,
        inventory: state.inventory
    }
}

export default connect(mapStatesToProps)(ApproveExport);
