import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Header, Segment, Input, Label, Form, Button, Message, Container } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { importInventory } from "./../../actions/InventoryActions";

function validate(values) {
    var errors = {
        batch: {}
    };
    const { code, quantity } = values;
    if (!code || (code + "").trim() === "") {
        errors.code = "Code is Required";
    }
    if (!quantity || (quantity + "").trim() === "") {
        errors.quantity = "Quantity is Required";
    }
    else if (isNaN(Number(quantity))){
        errors.quantity = "Quantity must be a number";
    }
    else if (quantity < 0){
        errors.quantity = "Quantity must be larger than or equal to 0";
    }
    return errors;
}

class ImportInventory extends Component {
    componentWillMount() {
        const { dispatch } = this.props;
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
        return dispatch(importInventory(values)).then(function (data) {
            dispatch(push("/imports"));
        });
    }
    render() {
        const { handleSubmit, pristine, errors, submitting } = this.props;
        const { token, user, isImportingInventory, importingInventoryError, inventory } = this.props.inventory;
        let error = null;
        if (importingInventoryError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Importing Inventory</Message.Header>
                    <p>{importingInventoryError}</p>
                </Message>
            )
        }
        return (
            <BaseLayout>
                <Segment textAlign='center'>
                  <Container>
                    <Header as="h2">Import Inventory</Header>
                    {error}
                    <Form onSubmit={handleSubmit(this.onSubmit.bind(this))} loading={isImportingInventory}>
                        <Form.Field inline>
                            <Field name="code" placeholder="Enter the code" component={this.renderField}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <Field name="quantity" placeholder="Enter the quantity" component={this.renderField}></Field>
                        </Form.Field>
                        <Button loading={submitting} disabled={submitting} disabled={pristine || submitting}>Submit</Button>
                    </Form>
                    </Container>
                </Segment>
            </BaseLayout>
        )
    }
}

function mapStatesToProps(state) {

    return {
        auth: state.auth,
        inventory: state.inventory
    }
}


export default reduxForm({
    form: "ImportInventory",
    validate
})(connect(mapStatesToProps)(ImportInventory));
