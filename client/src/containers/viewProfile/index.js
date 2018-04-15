import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Container, Button, Input, Grid } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { getAllCode, addPopUp, closePopUp, trackInput, submitCode, deleteCode } from "./../../actions/CodeActions";

class ViewProfile extends Component {
    componentWillMount() {
        const { token, dispatch } = this.props;
        const { user } = this.props.auth;
        //dispatch(getAllCode({token: token}));
    }
    onPressAdd(sku) {
        const { dispatch } = this.props;
        dispatch(addPopUp(sku));

    }
    onPressDelete(keyCode) {
        const { token, dispatch } = this.props;
        dispatch(deleteCode({ token: token, keyCode: keyCode })).then(function(data){
            dispatch(getAllCode({token: token}));
        });
    }

    handleInput(e){
        const { dispatch } = this.props;
        dispatch(trackInput(e.target.value));
    }

    onPressConfirm(code){
        const { dispatch, token } = this.props;
        const { codeInput } = this.props.code;
        const data = {
           token: token,
           sku: code.sku,
           key: codeInput
        }
        dispatch(submitCode(data)).then(function(data){
            dispatch(getAllCode({token: token}));
        });
    }

    onCloseAdd(){
        const { dispatch } = this.props;
        dispatch(closePopUp());
    }

    render() {
        const { user } = this.props.auth;
        const { codes, fetchingCodesError, addingCodeError, openAdd, codeInput } = this.props.code;
        let error = null;
        if (fetchingCodesError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Fetching Code</Message.Header>
                    <p>{fetchingCodesError}</p>
                </Message>
            )
        }
        else if (addingCodeError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Adding Code</Message.Header>
                    <p>{addingCodeError}</p>
                </Message>
            )
        }
        const skuView = codes.map(function (code, index) {
            return (
                <Table.Row key={index}>
                    <Table.Cell>{code.sku}</Table.Cell>
                    <Table.Cell>
                        {codeView}
                        <hr />
                        { (openAdd === code.sku) ?
                          <Grid columns={2} divided>
                            <Grid.Row>
                              <Grid.Column className="columnForInput" textAlign='center'>
                                  <Input placeholder='Code' className="inputBox" size='mini' defaultValue={codeInput} onChange={this.handleInput.bind(this)} />
                              </Grid.Column>
                                  <Grid.Column className="columnForButton" textAlign='center'>
                                      <Grid columns={2}>
                                          <Grid.Row>
                                              <Grid.Column textAlign='center'>
                                                 <Icon name='checkmark' size='large' onClick={this.onPressConfirm.bind(this, code)} />
                                              </Grid.Column>
                                              <Grid.Column textAlign='center'>
                                                  <Icon name='close' size='large' onClick={this.onCloseAdd.bind(this)} />
                                              </Grid.Column>
                                          </Grid.Row>
                                      </Grid>
                                  </Grid.Column>
                              </Grid.Row>
                            </Grid> : null}
                    </Table.Cell>
                    <Table.Cell>
                        <Button onClick={this.onPressAdd.bind(this, code.sku)}>Add Code</Button>
                    </Table.Cell>
                </Table.Row>
            )
        }, this);
        let tableView = <h4>No Code Found. Please Add Some </h4>
        if (codes.length > 0) {
            tableView = (
                <Table celled color='blue'>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1}>SKU</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Paring Codes</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Options</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {skuView}
                    </Table.Body>
                </Table>
            )
        }
        return (
            <BaseLayout>
                <Segment textAlign='center' >
                    <Header as="h2">Code List</Header>
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
        user: state.user,
        auth: state.auth
    }
}

export default connect(mapStatesToProps)(ViewProfile);
