import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Container } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import { getPendingImports } from "./../../actions/ImportActions";

class ApproveImport extends Component {
    componentWillMount() {
        const { token, dispatch } = this.props;
        dispatch(getPendingImports({ token: token }));
    }
    onPressApprove(importData) {

    }
    render() {
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
        const importsView = pendingImports.map(function (importData) {
            return (
                <Table.Row key={importData.id}>
                    <Table.Cell>{importData.sku}</Table.Cell>
                    <Table.Cell>{importData.quantity}</Table.Cell>
                    <Table.Cell>{importData.status}</Table.Cell>
                    <Table.Cell >
                      <Icon name='checkmark' size='large' onClick={this.onPressApprove.bind(this, importData)} /> 
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
                            <Table.HeaderCell>SKU</Table.HeaderCell>
                            <Table.HeaderCell>Quantity</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Options</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {importsView}
                    </Table.Body>
                </Table>
            )
        }
        return (
            <BaseLayout>
                <Segment textAlign='center' >
                    <Header as="h2">Import List</Header>
                    {error}
                    {/* <Segment loading={isFetchingImports}> */}
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
        import: state.imports
    }
}

export default connect(mapStatesToProps)(ApproveImport);
