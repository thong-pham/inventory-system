import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Header, Segment, Input, Label, Form, Button, Message, Menu, Dropdown, Container } from "semantic-ui-react";
import { push } from 'react-router-redux';
import axios from 'axios';

import BaseLayout from "./../baseLayout";

import { addUser, getCompanies } from "./../../actions/UserActions";

function validate(values) {
    var errors = {};
    const { username, roles, company, password } = values;
    if (!username || username.trim() === "") {
        errors.username = "Username is Required";
    }
    if (!roles || roles.trim() === "") {
        errors.roles = "Role is Required";
    }
    if (!company || company.trim() === "") {
        errors.company = "Company is Required";
    }
    if (!password || password.trim() === "") {
        errors.password = "Password is Required";
    }
    return errors;
}

class AddUser extends Component {
    componentWillMount() {
        const { token } = this.props.auth;
        const { dispatch } = this.props;
        //dispatch(getUsers({token:token}));
        dispatch(getCompanies({ token: token }));
        //if (token) {
        //    dispatch(push("/inventory"));
        //}
    }
    renderField({ input, meta: { touched, error }, ...custom }) {
        const hasError = touched && error !== undefined;
        return (
            <div>
                <Input type="text" error={hasError} fluid {...input} {...custom} />
                {hasError && <Label basic color="red" pointing>{error}</ Label>}
            </div>
        )
    }
    onSubmit(values, dispatch) {
        return dispatch(addUser(values)).then(function (data) {
            dispatch(push("/users"));
        });
    }
    render() {
        const { handleSubmit, pristine, initialValues, errors, submitting } = this.props;
        const { addingUserError, isAddingUser, pendingUsers, companies } = this.props.user;
        const renderSelectField = ({ input, label, type, meta: { touched, error }, children }) => (
              <div >
                  <label>{label}</label>
                  <select {...input}>
                    {children}
                  </select>
                  {touched && error && <span>{error}</span>}
               </div>
            )
        let error = null;
        if (addingUserError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Add User</Message.Header>
                    <p>{addingUserError}</p>
                </Message>
            )
        }
        return (
          <BaseLayout>
            <Segment textAlign='center'>
                <Container>
                <Header as="h2">Add User</Header>
                {error}
                <Form onSubmit={handleSubmit(this.onSubmit.bind(this))} loading={isAddingUser}>
                    <Form.Field inline>
                        <Field name="username" placeholder="Enter the username" component={this.renderField}></Field>
                    </Form.Field>
                    <Form.Field inline>
                        <label>Select Role</label>
                        <Field name="roles" component="select">
                          <option />
                          <option value="storeManager">Store Manager</option>
                          <option value="worker">Worker</option>
                        </Field>
                    </Form.Field>
                    <Form.Field inline>
                        <Field name="company" component={renderSelectField} label="Select Company">
                            <option />
                             {Object.keys(companies).map(key =>
                                <option key={key} value={companies[key].name.en}>{companies[key].name.en}</option>)}
                        </Field>
                    </Form.Field>
                    <Form.Field inline>
                        <Field name="password" type="password" placeholder="Enter the Password" component={this.renderField}></Field>
                    </Form.Field>
                    <Button loading={submitting} disabled={submitting}>Add User</Button>
                </Form>
                </Container>
            </Segment>
          </BaseLayout>
        )
    }
}

function mapStatesToProps(state) {
    const initialValues = state.user.user;
    if (initialValues && initialValues.name && initialValues.id) {
        initialValues.name = initialValues.name.en;
    }
    return {
        initialValues: initialValues,
        auth: state.auth,
        user: state.user,
        location: state.router.location
    }
}



export default reduxForm({
    form: "AddUser",
    validate
})(connect(mapStatesToProps)(AddUser));
