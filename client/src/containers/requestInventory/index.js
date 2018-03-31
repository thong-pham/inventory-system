import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field,  } from "redux-form";
import { Header, Segment, Input, Label, Form, Button, Message, Container } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import { requestInventory, setRequestingInventory } from "./../../actions/InventoryActions";

function validate(values) {
    var errors = {
        batch: {}
    };
    const { sku, productName, price, stock } = values;
    if (!sku || (sku + "").trim() === "") {
        errors.sku = "SKU is Required";
    }
    if (!stock || (stock + "").trim() === "") {
        errors.stock = "Stock is Required";
    }
    return errors;
}

class RequestInventory extends Component {
    componentWillMount() {
        const idParam = this.props.location.pathname.split("/")[2]; // Hacky Way
        const { dispatch } = this.props;
        dispatch(setRequestingInventory(idParam));
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
        const { handleSubmit, pristine, initialValues, errors, submitting } = this.props;
        const { token, user, isLoggingIn, requestInventoryError, inventory } = this.props.request;
        console.log(this.props.request);
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
            <BaseLayout>
                <Segment textAlign='center'>
                  <Container>
                    <Header as="h2">Request Inventory</Header>
                    {error}
                    <Form onSubmit={handleSubmit(this.onSubmit.bind(this))} loading={isLoggingIn}>
                        <Form.Field inline>
                            <Field name="sku" placeholder="Enter the SKU" component={this.renderField} disabled></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <Field name="stock" placeholder="Enter the Stock" component={this.renderField}></Field>
                        </Form.Field>
                        <Button loading={submitting} disabled={submitting}>Make A Request</Button>
                    </Form>
                  </Container>
                </Segment>
            </BaseLayout>
        )
    }
}

function mapStatesToProps(state) {
    const initialValues = state.request.request;
    return {
        initialValues: initialValues,
        auth: state.auth,
        request: state.request,
        location: state.router.location,
        inventory: state.inventory
    }
}

export default connect(mapStatesToProps)(reduxForm({
    form: "RequestInventory",
    validate
})(RequestInventory));
