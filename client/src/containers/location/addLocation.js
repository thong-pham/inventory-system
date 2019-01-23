import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Header, Segment, Input, Label, Form, Button, Message, Menu, Dropdown } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { addLocation } from "./../../actions/LocationActions";

function validate(values) {
    var errors = {};
    const { name, code} = values;
    if (!name || name.trim() === "") {
        errors.name = "Name is Required";
    }
    return errors;
}

class AddLocation extends Component {
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
        const { token } = this.props.auth;
        values.token = token;
        values.name = values.name.trim();
        return dispatch(addLocation(values)).then(function (data) {
            dispatch(push("/locations"));
        });
    }
    onBack = () => {
        const { dispatch } = this.props;
        dispatch(push("/locations"));
    }
    render() {
        const { handleSubmit, pristine, initialValues, errors, submitting } = this.props;
        const { addingLocationError, isAddingLocation, pendingLocations } = this.props.location;
        console.log(addingLocationError);
        let error = null;
        if (addingLocationError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Adding Location</Message.Header>
                    <p>{addingLocationError}</p>
                </Message>
            )
        }
        return (
          <BaseLayout>
            <Segment textAlign='center'>
                <Header as="h2">Add Location</Header>
                {error}
                <Form onSubmit={handleSubmit(this.onSubmit.bind(this))} loading={isAddingLocation}>
                    <Form.Field inline>
                        <Field name="name" placeholder="Enter the name" component={this.renderField}></Field>
                    </Form.Field>
                    <Button primary loading={submitting} disabled={submitting}>Add</Button>
                    <Button secondary onClick={this.onBack}>Cancel</Button>
                </Form>
            </Segment>
          </BaseLayout>
        )
    }
}

function mapStatesToProps(state) {
    const initialValues = state.location.location;
    if (initialValues && initialValues.name && initialValues.id) {
        initialValues.name = initialValues.name.en;
    }
    return {
        initialValues: initialValues,
        auth: state.auth,
        location: state.location,
    }
}

export default reduxForm({
    form: "AddLocation",
    validate
})(connect(mapStatesToProps)(AddLocation));
