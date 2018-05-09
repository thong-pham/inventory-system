import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Button, Container, Modal } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { getCompanies, deleteCompanies } from "./../../actions/CompanyActions";

class ViewCompanies extends Component {
    componentWillMount() {
        const { token, dispatch } = this.props;
        dispatch(getCompanies({ token: token }));
    }
    onPressEdit(company) {
        const { dispatch } = this.props;
        dispatch(push("/company/" + company.id));
    }
    onPressDelete(company) {
        const { token, dispatch } = this.props;
        dispatch(deleteCompany({ token: token, company: company })).then(function (data) {
            dispatch(getCompanies({ token: token }));
        });
    }
    onPressAdd() {
        const { dispatch } = this.props;
        dispatch(push("/addcompany"));
    }

    render() {
        const { companies, isFetchingCompanies, fetchingCompaniesError, deletingsCompaniesError } = this.props.company;
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
                    <Table.Cell>{company.name.en}</Table.Cell>
                    <Table.Cell>{company.code}</Table.Cell>
                    <Table.Cell>List Users Here</Table.Cell>
                    <Table.Cell>
                        <Icon name='trash outline' size='large' onClick={this.onPressDelete.bind(this, company)} />
                        <Icon name='pencil' size='large' onClick={this.onPressEdit.bind(this, company)} />
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
                            <Table.HeaderCell width={2}>Code</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Users</Table.HeaderCell>
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
        company: state.company
    }
}

export default connect(mapStatesToProps)(ViewCompanies);
