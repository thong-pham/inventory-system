import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Button, Container, Modal } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import { getUsers, deleteUser } from "./../../actions/UserActions";

class ViewUsers extends Component {
    componentWillMount() {
        const { token, dispatch } = this.props;
        const { user } = this.props.auth;
        const isAdmin = user.roles.indexOf("admin") >= 0;
        if ( !isAdmin ){
             dispatch(push("/inventory"));
        }
        dispatch(getUsers({ token: token }));
    }
    onPressEdit(user) {
        const { dispatch } = this.props;
        dispatch(push("/user/" + user.id));
    }
    onPressDelete(user) {
        const { token, dispatch } = this.props;
        dispatch(deleteUser({ token: token, user: user })).then(function (data) {
            dispatch(getUsers({ token: token }));
        });
    }
    onPressAdd() {
        const { dispatch } = this.props;
        dispatch(push("/adduser"));
    }

    render() {
        const { users, isFetchingUsers, fetchingUsersError, deletingsUsersError } = this.props.user;
        let error = null;
        if (fetchingUsersError || deletingsUsersError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Fetching User</Message.Header>
                    <p>{fetchingUsersError}</p>
                    <p>{deletingsUsersError}</p>
                </Message>
            )
        }
        const usersView = users.map(function (user) {
            if (!(user.roles.indexOf("admin") >= 0))
            {
                return (
                    <Table.Row key={user.id}>
                        <Table.Cell>{user.id}</Table.Cell>
                        <Table.Cell>{user.username}</Table.Cell>
                        <Table.Cell>{user.name.en}</Table.Cell>
                        <Table.Cell>{user.email}</Table.Cell>
                        <Table.Cell>{user.number}</Table.Cell>
                        <Table.Cell>{user.roles[0]}</Table.Cell>
                        <Table.Cell>{user.company}</Table.Cell>
                        <Table.Cell>{user.lastModifiedAt}</Table.Cell>
                        <Table.Cell>{user.createdAt}</Table.Cell>
                        <Table.Cell>
                            <Icon name='trash outline' size='large' onClick={this.onPressDelete.bind(this, user)} />
                            <Icon name='pencil' size='large' onClick={this.onPressEdit.bind(this, user)} />
                        </Table.Cell>
                    </Table.Row>
                )
            }
        }, this);
        let tableView = <h4>No Users Found. Please Add Some </h4>
        if (users.length > 0) {
            tableView = (
                <Table celled columns={10}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>User ID</Table.HeaderCell>
                            <Table.HeaderCell>Username</Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Email</Table.HeaderCell>
                            <Table.HeaderCell>Phone</Table.HeaderCell>
                            <Table.HeaderCell>Roles</Table.HeaderCell>
                            <Table.HeaderCell>Company</Table.HeaderCell>
                            <Table.HeaderCell>Last Modified At</Table.HeaderCell>
                            <Table.HeaderCell>Created At</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Edit</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {usersView}
                    </Table.Body>
                </Table>
            )
        }
        return (
            <BaseLayout>
                <Segment textAlign='center' padded='very' >
                    <Header as="h2">User List</Header>
                    {error}
                    <Container>
                        {tableView}
                        <Button floated='right' icon labelPosition='left' primary size='small' onClick={this.onPressAdd.bind(this)}>
                          <Icon name='user' /> Add User
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
        user: state.user,
        auth: state.auth
    }
}

export default connect(mapStatesToProps)(ViewUsers);
