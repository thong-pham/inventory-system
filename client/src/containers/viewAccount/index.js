import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Container, Button, Input, Grid, Label } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { getUsers, changePass, changePassClose, updateInfo, errorInput, getUser,
        trackCurrent, trackNew, submitNewPass, trackName, trackNumber, trackEmail,
        changeName, changeNameClose, changeNumber, changeNumberClose, changeEmail, changeEmailClose
       } from "./../../actions/UserActions";

function validateEmail(email){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

class ViewAccount extends Component {
    componentWillMount() {
        const { token, dispatch } = this.props;
        const { user } = this.props.auth;
        dispatch(getUser({token: token, id: user.id}));
    }
    onSavePass() {
        const { dispatch, token } = this.props;
        const { currentPass, newPass } = this.props.user;
        if (currentPass === null || (currentPass + "").trim() === "" || newPass === null || (newPass + "").trim() === ""){
            dispatch(errorInput());
        }
        else {
            const submit = {
                currentPass: currentPass,
                newPass: newPass
            }
            dispatch(submitNewPass({token: token, submit: submit}));
        }
    }

    onSaveName() {
        const { dispatch, token } = this.props;
        const { user, newName, newNumber, newEmail } = this.props.user;
        if (newName === null || (newName + "").trim() === ""){
            dispatch(errorInput());
        }
        else{
            const submit = {
                newName: newName,
                newNumber: user.number,
                newEmail: user.email
            }
            dispatch(updateInfo({token: token, submit: submit})).then(function(data){
                  dispatch(getUser({token: token, id: user.id}));
            });
        }
    }

    onSaveNumber() {
        const { dispatch, token } = this.props;
        const { user, ewName, newNumber, newEmail } = this.props.user;
        if (newNumber === null || (newNumber + "").trim() === ""){
            dispatch(errorInput());
        }
        else{
            const submit = {
                newNumber: newNumber,
                newName: user.name.en,
                newEmail: user.email
            }
            dispatch(updateInfo({token: token, submit: submit})).then(function(data){
                dispatch(getUser({token: token, id: user.id}));
            });
        }
    }

    onSaveEmail() {
        const { dispatch, token } = this.props;
        const { user, newName, newNumber, newEmail } = this.props.user;
        if (newEmail === null || (newEmail + "").trim() === ""){
            dispatch(errorInput());
        }
        else if(!validateEmail(newEmail)){
            alert("Invalid Email");
        }
        else{
            const submit = {
                newEmail: newEmail,
                newNumber: user.number,
                newName: user.name.en
            }
            dispatch(updateInfo({token: token, submit: submit})).then(function(data){
                  dispatch(getUser({token: token, id: user.id}));
            });
        }
    }

    handleCurrent(e){
        const { dispatch } = this.props;
        dispatch(trackCurrent(e.target.value));
    }

    handleNew(e){
        const { dispatch } = this.props;
        dispatch(trackNew(e.target.value));
    }

    handleName(e){
        const { dispatch } = this.props;
        dispatch(trackName(e.target.value));
    }
    handleNumber(e){
        const { dispatch } = this.props;
        dispatch(trackNumber(e.target.value));
    }
    handleEmail(e){
        const { dispatch } = this.props;
        dispatch(trackEmail(e.target.value));
    }

    onChangePass(){
        const { dispatch } = this.props;
        dispatch(changePass());
    }

    onChangePassClose(){
        const { dispatch } = this.props;
        dispatch(changePassClose());
    }

    onChangeName(){
        const { dispatch } = this.props;
        dispatch(changeName());
    }

    onChangeNameClose(){
        const { dispatch } = this.props;
        dispatch(changeNameClose());
    }

    onChangeNumber(){
        const { dispatch } = this.props;
        dispatch(changeNumber());
    }

    onChangeNumberClose(){
        const { dispatch } = this.props;
        dispatch(changeNumberClose());
    }

    onChangeEmail(){
        const { dispatch } = this.props;
        dispatch(changeEmail());
    }

    onChangeEmailClose(){
        const { dispatch } = this.props;
        dispatch(changeEmailClose());
    }

    validate( ){

    }

    render() {
        //const { user } = this.props.auth;
        const { user, fetchingUsersError, passChange, currentPass, newPass, changingPassError } = this.props.user;
        const { nameChange, numberChange, emailChange, newName, newNumber, newEmail, errorInput } = this.props.user;
        let error = null;
        if (fetchingUsersError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Fetching User</Message.Header>
                    <p>{fetchingUsersError}</p>
                </Message>
            )
        }
        if (changingPassError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Changing Password</Message.Header>
                    <p>{changingPassError}</p>
                </Message>
            )
        }
        if (errorInput) {
            error = (
                <Message negative>
                    <Message.Header>Error while Saving</Message.Header>
                    <p>{errorInput}</p>
                </Message>
            )
        }

        let tableView = <h4>No User Found. Please Add Some </h4>
        if (user !== null) {
            tableView = (
                <Table celled color='blue' fixed>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1}></Table.HeaderCell>
                            <Table.HeaderCell width={2}></Table.HeaderCell>
                            <Table.HeaderCell width={1}></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>Username</Table.Cell>
                            <Table.Cell>{user.username}</Table.Cell>
                            <Table.Cell>

                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Name</Table.Cell>
                            <Table.Cell>
                                {user.name.en}
                                <hr />
                                { (nameChange) ? <Grid divided>
                                        <Grid.Row textAlign='center'>
                                            <Grid.Column width={8}>
                                              <Input className="pwdBox" defaultValue={newName} onChange={this.handleName.bind(this)}/>
                                            </Grid.Column>
                                            <Grid.Column width={6}>
                                                <Button color='green' onClick={this.onSaveName.bind(this)}>Save Changes</Button>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid> : null}
                            </Table.Cell>
                            <Table.Cell>
                                { (!nameChange) ? <Button primary onClick={this.onChangeName.bind(this)}>Edit</Button> : null }
                                { (nameChange) ? <Button secondary onClick={this.onChangeNameClose.bind(this)}>Close</Button> : null}
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Email</Table.Cell>
                            <Table.Cell>
                                {user.email}
                                <hr />
                                { (emailChange) ? <Grid divided>
                                        <Grid.Row textAlign='center'>
                                            <Grid.Column width={8}>
                                              <Input className="pwdBox" defaultValue={newEmail} onChange={this.handleEmail.bind(this)}/>
                                            </Grid.Column>
                                            <Grid.Column width={6}>
                                                <Button color='green' onClick={this.onSaveEmail.bind(this)}>Save Changes</Button>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid> : null}
                            </Table.Cell>
                            <Table.Cell>
                                { (!emailChange) ? <Button primary onClick={this.onChangeEmail.bind(this)}>Edit</Button> : null }
                                { (emailChange) ? <Button secondary onClick={this.onChangeEmailClose.bind(this)}>Close</Button> : null}
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Contact</Table.Cell>
                            <Table.Cell>
                                {user.number}
                                <hr />
                                { (numberChange) ? <Grid divided>
                                        <Grid.Row textAlign='center'>
                                            <Grid.Column width={8}>
                                              <Input className="pwdBox" defaultValue={newNumber} onChange={this.handleNumber.bind(this)}/>
                                            </Grid.Column>
                                            <Grid.Column width={6}>
                                                <Button color='green' onClick={this.onSaveNumber.bind(this)}>Save Changes</Button>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid> : null}
                            </Table.Cell>
                            <Table.Cell>
                                { (!numberChange) ? <Button primary onClick={this.onChangeNumber.bind(this)}>Edit</Button> : null }
                                { (numberChange) ? <Button secondary onClick={this.onChangeNumberClose.bind(this)}>Close</Button> : null}
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Roles</Table.Cell>
                            <Table.Cell>{user.roles[0]}</Table.Cell>
                            <Table.Cell>

                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Company</Table.Cell>
                            <Table.Cell>{user.company}</Table.Cell>
                            <Table.Cell>

                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Password</Table.Cell>
                            <Table.Cell>
                                { (!passChange) ? <p>##############</p> : null}
                                <hr />
                                { (passChange) ? <Grid divided>
                                        <Grid.Row textAlign='center'>
                                            <Grid.Column width={8}>
                                              <Label>Current Password</Label>
                                            </Grid.Column>
                                            <Grid.Column width={6}>
                                              <Input className="pwdBox" type='password' defaultValue={currentPass} onChange={this.handleCurrent.bind(this)}/>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row textAlign='center'>
                                            <Grid.Column width={8}>
                                              <Label>New Password</Label>
                                            </Grid.Column>
                                            <Grid.Column width={6}>
                                              <Input className="pwdBox" type='password' defaultValue={newPass} onChange={this.handleNew.bind(this)}/>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row textAlign='center'>
                                            <Grid.Column>
                                              <Button color='green' onClick={this.onSavePass.bind(this)}>Save Changes</Button>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid> : null}
                            </Table.Cell>
                            <Table.Cell>
                                  { (!passChange) ? <Button primary onClick={this.onChangePass.bind(this)}>Edit</Button> : null }
                                  { (passChange) ? <Button secondary onClick={this.onChangePassClose.bind(this)}>Close</Button> : null}
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            )
        }
        const loginView = (
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Login</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                <Table.Row>
                    <Table.Cell>
                        <Icon name='key' />Change Password
                        <Button>Edit</Button>
                    </Table.Cell>
                </Table.Row>
                </Table.Body>
            </Table>
        )
        return (
            <BaseLayout>
                <Segment textAlign='center' >
                    <Header as="h2">User Account</Header>
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

export default connect(mapStatesToProps)(ViewAccount);
