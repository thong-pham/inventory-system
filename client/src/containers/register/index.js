import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Header, Segment, Input, Label, Form, Button, Message, Menu, Dropdown } from "semantic-ui-react";
import { push } from 'react-router-redux';

import { registerUser } from "./../../actions/AuthActions";

function validate(values) {
    var errors = {};
    const { name, email, roles, password, company, number } = values;
    if (!email || email.trim() === "") {
        errors.email = "Email is Required";
    }
    if (!name || name.trim() === "") {
        errors.name = "Name is Required";
    }
    if (!roles || roles.trim() === "") {
        errors.roles = "Role is Required";
    }
    if (!company || company.trim() === "") {
        errors.company = "Company is Required";
    }
    if (!number || email.trim() === "") {
        errors.number = "Number is Required";
    }
    if (!password || password.trim() === "") {
        errors.password = "Password is Required";
    }
    return errors;
}

class Register extends Component {
    componentWillMount() {
        const { token } = this.props.auth;
        const { dispatch } = this.props;
        if (token) {
            dispatch(push("/inventory"));
        }
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
        return dispatch(registerUser(values)).then(function (data) {
            dispatch(push("/inventory"));
        });
    }
    render() {
        const { handleSubmit, pristine, initialValues, errors, submitting } = this.props;
        const { token, user, isLoggingIn, loggingInError } = this.props.auth;
        const roles = [
              { key: 1, text: 'Store Manager', value: 1 },
              { key: 2, text: 'Delivery Manager', value: 2 },
        ]
        const companies = [
              { key: 1, text: 'Mother Company', value: 1 },
              { key: 2, text: 'Company 1', value: 2 },
              { key: 3, text: 'Company 2', value: 3 },
              { key: 4, text: 'Company 3', value: 3 },
        ]
        let error = null;
        if (loggingInError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Register</Message.Header>
                    <p>{loggingInError}</p>
                </Message>
            )
        }
        return (
            <Segment textAlign='center'>
                <Header as="h2">Register</Header>
                {error}
                <Form onSubmit={handleSubmit(this.onSubmit.bind(this))} loading={isLoggingIn}>
                    <Form.Field inline>
                        <Field name="email" placeholder="Enter your email" component={this.renderField}></Field>
                    </Form.Field>
                    <Form.Field inline>
                        <Field name="name" placeholder="Enter your name " component={this.renderField}></Field>
                    </Form.Field>
                    <Form.Field inline>
                        <Field name="number" placeholder="Enter your phone number" component={this.renderField}></Field>
                    </Form.Field>
                    <Form.Field inline>
                        <Dropdown placeholder='Select Your Role' fluid selection options={roles} />
                    </Form.Field>
                    <Form.Field inline>
                        <Dropdown placeholder='Select Your Company' fluid selection options={companies} />
                    </Form.Field>
                    <Form.Field inline>
                        <Field name="password" type="password" placeholder="Enter the Password" component={this.renderField}></Field>
                    </Form.Field>
                    <Button loading={submitting} disabled={submitting}>Register</Button>
                </Form>
            </Segment>
        )
    }
}

function mapStatesToProps(state) {
    return {
        auth: state.auth
    }
}

export default reduxForm({
    form: "Register",
    validate
})(connect(mapStatesToProps)(Register));
