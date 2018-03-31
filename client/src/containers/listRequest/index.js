import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field, FieldArray } from "redux-form";
import { Header, Segment, Input, Label, Button, Message, Container, Form } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import { requestInventory, setRequestingInventory } from "./../../actions/InventoryActions";

function validate(values) {
    var errors = {
        batch: {}
    };
    const { sku, stock } = values;
    if (!sku || (sku + "").trim() === "") {
        errors.sku = "SKU is Required";
    }
    if (!stock || (stock + "").trim() === "") {
        errors.stock = "Stock is Required";
    }
    return errors;
}

class ListRequest extends Component {
    componentWillMount() {
        const idParam = this.props.location.pathname.split("/")[2]; // Hacky Way
        const { dispatch } = this.props;
        //dispatch(setRequestingInventory(idParam));
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
        return dispatch(requestInventory(values)).then(function (data) {
            dispatch(push("/inventory"));
        });
    }
    render() {
        const members = [];
        const { handleSubmit, pristine, initialValues, errors, submitting, reset, array: { push } } = this.props;
        const { token, user, isLoggingIn, requestInventoryError, request } = this.props.request;
        let error = null;
        if (requestInventoryError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Requesting Inventory</Message.Header>
                    <p>{requestInventoryError}</p>
                </Message>
            )
        }

        return (
                <Container>
                    <Header as="h2">Request Inventory</Header>
                    {error}
                </Container>
        )
    }
}

function mapStatesToProps(state) {
    const initialValues = state.request.request;
    return {
        initialValues: initialValues,
        auth: state.auth,
        request: state.request,
        location: state.router.location
    }
}

export default connect(mapStatesToProps)(reduxForm({
    form: "ListRequest",
    validate
})(ListRequest));
