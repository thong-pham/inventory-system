import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Button, Container, Modal, Grid, Input } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { getCompanies, deleteCompany, triggerChange, cancelChange, trackName, editCompany } from "./../../actions/CompanyActions";

//import { getUsers } from "./../../actions/UserActions";

class ViewCompanies extends Component {
    componentWillMount() {
        const { token, dispatch } = this.props;
        dispatch(getCompanies({ token: token }));
        //dispatch(getUsers({ token: token }));
    }
    onPressEdit = (company) => {
        const { dispatch } = this.props;
        dispatch(triggerChange(company.id));
    }
    onPressDelete = (company) => {
        const { token, dispatch } = this.props;
        dispatch(deleteCompany({ token: token, company: company })).then(function (data) {
            dispatch(getCompanies({ token: token }));
        });
    }
    onPressAdd() {
        const { dispatch } = this.props;
        dispatch(push("/addcompany"));
    }

    handleName = (e) => {
        const { dispatch } = this.props;
        dispatch(trackName(e.target.value));
    }

    onCancel = () => {
        const { dispatch } = this.props;
        dispatch(cancelChange());
    }

    onSaveName = (id) => {
        const { dispatch, token } = this.props;
        const { newName } = this.props.company;
        const data = {
            id: id,
            name: newName,
            token: token
        }
        dispatch(editCompany(data)).then(function(data){
            dispatch(getCompanies({ token: token }));
        });
    }

    render() {
        const { companies, isFetchingCompanies, fetchingCompaniesError, deletingsCompaniesError,
                nameChange, newName } = this.props.company;

        let error = null;
        if (fetchingCompaniesError || deletingsCompaniesError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Fetching Companies</Message.Header>
                    <p>{fetchingCompaniesError}</p>
                    <p>{deletingsCompaniesError}</p>
                </Message>
            )
        }
        const companiesView = companies.map(function (company) {
            return (
                <Table.Row key={company.id}>
                    <Table.Cell>
                    {company.name.en}
                    <hr />
                    { (nameChange === company.id) ? <Grid divided>
                            <Grid.Row textAlign='center'>
                                <Grid.Column width={8}>
                                  <Input style={{width: '160px'}} defaultValue={newName} onChange={this.handleName}/>
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    <Button onClick={() => this.onSaveName(company.id)}><Icon name='checkmark' /></Button>
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    <Button onClick={this.onCancel}><Icon name='close'/></Button>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid> : null }
                    </Table.Cell>
                    <Table.Cell>
                        <Button color='teal' onClick={() => this.onPressEdit(company)}><Icon name='pencil' />Edit</Button>
                        <Button color='red' onClick={() => this.onPressDelete(company)}><Icon name='trash outline' />Delete</Button>
                    </Table.Cell>
                </Table.Row>
            )
        }, this);
        let tableView = <h4>No Companies Found. Please Add Some </h4>
        if (companies.length > 0) {
            tableView = (
                <Table celled columns={4}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={2}>Name</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Options</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {companiesView}
                    </Table.Body>
                </Table>
            )
        }
        return (
            <BaseLayout>
                <Segment textAlign='center' padded='very'>
                    <Header as="h2">Company List</Header>
                    {error}
                    <Container>
                        {tableView}
                        <Button floated='right' icon labelPosition='left' primary size='small' onClick={this.onPressAdd.bind(this)}>
                          <Icon name='user' /> Add Company
                        </Button>
                    </Container>
                </Segment>
            </BaseLayout>
        )
    }
}

function mapStatesToProps(state) {
    return {
        token: state.auth.token,
        company: state.company,
    }
}

export default connect(mapStatesToProps)(ViewCompanies);
