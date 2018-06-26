import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Container, Button, Responsive, Input, Grid, Modal, Label } from "semantic-ui-react";
import { push } from 'react-router-redux';
import axios from 'axios';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

const WAIT_INTERVAL = 1000;

import { addToList, addCapacity, addCount, trackText, exportInventory, removeForm
        } from "./../../actions/ExportActions";

import { getCodes } from "./../../actions/CodeActions";

import { getInventories } from "./../../actions/InventoryActions";

class ExportInventory extends Component {
    state = {
        errorInput: null,
        successInput: null
    }
    componentWillMount() {
        const { token, dispatch } = this.props;
        dispatch(getCodes({token: token}));
        dispatch(getInventories({token: token}));
        this.timer = null;
    }

    handleChange = (e) => {
        const { dispatch } = this.props;
        clearTimeout(this.timer);
        dispatch(trackText(e.target.value));
        this.timer = setTimeout(this.handleCode, WAIT_INTERVAL);
    }

    handleCode = () => {
        const { dispatch } = this.props;
        const { text } = this.props.export;
        const { allCode } = this.props.code;
        const { backUpInv } = this.props.inventory;
        var data = {note: null};
        var mainSku = null;
        if (text && (text + "").trim() !== ""){
            allCode.forEach(function(code){
                  if (code.key === text){
                      data.text = text;
                      mainSku = code.mainSku;
                  }
            });
            if (data.text === text){
                backUpInv.forEach(function(inv){
                    if (mainSku === inv.sku){
                        data.capacity = inv.capacity;
                    }
                });

                if (!data.capacity){
                    data.note = "This product is not available!!!";
                }
            }
            else {
                data.text = text;
                data.note = "This code does not exists!!!";
            }

        }
        else {
            data.text = "";
        }
        dispatch(addToList(data));
    }

    handleCapacity = (e, id) => {
        const data = e.target.value;
        const { dispatch } = this.props;
        dispatch(addCapacity({id: id, data: data}));
    }

    handleCount = (e, id) => {
        const data = e.target.value;
        const { dispatch } = this.props;
        dispatch(addCount({id: id, data: data}));
    }

    onExport = (id) => {
        const { token, user } = this.props.auth;
        const { formList } = this.props.export;
        const { dispatch } = this.props;
        var data = null;
        var index = null;

        formList.forEach(function(form){
            if (form.id === id){
                var capacity = form.capacity;
                var count = form.count;
                if (isNaN(capacity) || !Number.isInteger(Number(capacity)) || capacity === null || capacity <= 0 ||
                    isNaN(count) || !Number.isInteger(Number(count)) || count === null || count <= 0){
                    alert("Invalid Input");
                }
                else {
                    data = {
                      code: form.code,
                      quantity: form.count * form.capacity,
                      capacity: form.capacity,
                      count: form.count,
                      token: token
                    }
                    dispatch(exportInventory(data)).then(function(data){
                          dispatch(removeForm(id));
                    });
                }
            }
        });

    }

    onDelete = (id) => {
        const { dispatch } = this.props;
        dispatch(removeForm(id));
    }

    closeError = () => {
        this.setState({errorInput: null});
    }

    closeSuccess = () => {
        this.setState({successInput: null});
    }

    render() {
        const { errorInput, successInput } = this.state;
        const { formList, text } = this.props.export;
        let error = null;
        let success = null;

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
        let exportsView = null;
        if (formList.length > 0){
            exportsView = formList.map(function (exportData) {
                return (
                    <Table.Row key={exportData.id}>
                        <Table.Cell>
                            {exportData.code}
                        </Table.Cell>
                        <Table.Cell>
                              {(exportData.capacity) ? <p>{exportData.capacity}</p> : <p>{exportData.note}</p>}
                        </Table.Cell>
                        <Table.Cell>
                              {(exportData.capacity) ? <Input defaultValue={exportData.count} onChange={(e) => this.handleCount(e, exportData.id)}/> : null}
                        </Table.Cell>
                        <Table.Cell>
                            {(exportData.capacity) ? <Button size='tiny' primary onClick={() => this.onImport(exportData.id)}>Import</Button> : null}
                            <Button size='tiny' color='red' onClick={() => this.onDelete(exportData.id)}>Remove</Button>
                        </Table.Cell>
                    </Table.Row>
                )
            }, this);
        }

        let tableView = <h4>No Exports Found. Please Add Some </h4>
        if (formList.length > 0) {
            tableView = (
                <Table celled fixed sortable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Scanning Code</Table.HeaderCell>
                            <Table.HeaderCell>Box Capacity</Table.HeaderCell>
                            <Table.HeaderCell>Box Count</Table.HeaderCell>
                            <Table.HeaderCell>Options</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {exportsView}
                    </Table.Body>
                </Table>
            )
        }

        return (
            <BaseLayout>
                <Segment textAlign='center' >
                    <Header as="h2">Export Inventory</Header>
                    {error}
                    {success}
                    <Container>
                      <Responsive minWidth={415}>
                          <Input value={text} onChange={this.handleChange}/>
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
        export: state.exportData,
        auth: state.auth,
        inventory: state.inventory,
        code: state.code
    }
}

export default connect(mapStatesToProps)(ExportInventory);
