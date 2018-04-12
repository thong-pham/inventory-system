import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Container } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import { getPendingRequests, approveRequest } from "./../../actions/OrderActions";

class ApproveRequest extends Component {
    componentWillMount() {
        const { token, dispatch } = this.props;
        dispatch(getPendingRequests({ token: token }));
    }
    onPressApprove(request) {
        const { token, dispatch } = this.props;
        dispatch(approveRequest({ token: token, request: request })).then(function (data) {
            dispatch(push("/inventory"));
        });
    }
    render() {

        const { pendingRequests, isFetchingPendingRequests, fetchingPendingRequestsError } = this.props.request;
        let error = null;
        if (fetchingPendingRequestsError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Fetching Inventory</Message.Header>
                    <p>{fetchingPendingRequestsError}</p>
                </Message>
            )
        }
        const requestsView = pendingRequests.map(function (request) {
            /*const latestHistory = getLatestHistory(inventory);
            let operationText = null;
            switch (latestHistory.action) {
                case "created": {
                    operationText = "Creation";
                    break;
                }
                case "updated": {
                    operationText = "Updation";
                    break;
                }
                case "removed": {
                    operationText = "Removal";
                    break;
                }
            }*/
            return (
                <Table.Row key={request.id}>
                    <Table.Cell>{request.sku}</Table.Cell>
                    <Table.Cell>{request.quantity}</Table.Cell>
                    <Table.Cell>{request.company}</Table.Cell>
                    <Table.Cell>{request.username}</Table.Cell>
                    <Table.Cell ><Icon name='checkmark' size='large' onClick={this.onPressApprove.bind(this, request)} /></Table.Cell>
                </Table.Row>
            )
        }, this);
        let tableView = <h4>No Requests Found.</h4>
        if (pendingRequests.length > 0) {
            tableView = (
                <Table celled fixed>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>SKU</Table.HeaderCell>
                            <Table.HeaderCell>Quantity</Table.HeaderCell>
                            <Table.HeaderCell>Company</Table.HeaderCell>
                            <Table.HeaderCell>Username</Table.HeaderCell>
                            <Table.HeaderCell>Options</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {requestsView}
                    </Table.Body>
                </Table>
            )
        }
        return (
            <BaseLayout>
                <Segment textAlign='center' >
                    <Header as="h2">Request List</Header>
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

function getLatestHistory(inventory) {
    let latestHistory = null
    inventory.history.every(function (history) {
        if (latestHistory) {
            if ((new Date(history.timestamp)).getTime() > (new Date(latestHistory.timestamp)).getTime()) {
                latestHistory = history;
            }
        }
        else {
            latestHistory = history;
        }
        return true;
    });
    return latestHistory;
}

function mapStatesToProps(state) {
    return {
        token: state.auth.token,
        inventory: state.inventory,
        request: state.request
    }
}

export default connect(mapStatesToProps)(ApproveRequest);
