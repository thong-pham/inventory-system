import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Header, Segment, Input, Label, Form, Button, Message, Menu, Dropdown } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import { addCompany } from "./../../actions/CompanyActions";

function validate(values) {
    var errors = {};
    const { name, code} = values;
    if (!name || name.trim() === "") {
        errors.name = "Name is Required";
    }
    if (!code || code.trim() === "") {
        errors.code = "Code is Required";
    }
    return errors;
}

class AddCompany extends Component {
    componentWillMount() {
        const { token } = this.props.auth;
        const { dispatch } = this.props;
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
        return dispatch(addCompany(values)).then(function (data) {
            dispatch(push("/companies"));
        });
    }
    render() {
        const { handleSubmit, pristine, initialValues, errors, submitting } = this.props;
        const { addingCompanyError, isAddingCompany, pendingCompanies } = this.props.company;
        let error = null;
        if (addingCompanyError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Add User</Message.Header>
                    <p>{addingCompanyError}</p>
                </Message>
            )
        }
        return (
          <BaseLayout>
            <Segment textAlign='center'>
                <Header as="h2">Add Company</Header>
                {error}
                <Form onSubmit={handleSubmit(this.onSubmit.bind(this))} loading={isAddingCompany}>
                    <Form.Field inline>
                        <Field name="name" placeholder="Enter the name" component={this.renderField}></Field>
                    </Form.Field>
                    <Form.Field inline>
                        <Field name="code" placeholder="Enter the code" component={this.renderField}></Field>
                    </Form.Field>
                    <Button loading={submitting} disabled={submitting}>Add Company</Button>
                </Form>
            </Segment>
          </BaseLayout>
        )
    }
}

function mapStatesToProps(state) {
    const initialValues = state.company.company;
    if (initialValues && initialValues.name && initialValues.id) {
        initialValues.name = initialValues.name.en;
    }
    return {
        initialValues: initialValues,
        auth: state.auth,
        company: state.company,
        location: state.router.location
    }
}

export default reduxForm({
    form: "AddCompany",
    validate
})(connect(mapStatesToProps)(AddCompany));
