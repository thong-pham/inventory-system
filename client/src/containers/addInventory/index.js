import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Header, Segment, Input, Label, Form, Button, Message, Container } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import { addInventory, setUpdatingInventory, updateInventory } from "./../../actions/InventoryActions";

function validate(values) {
    var errors = {
        batch: {}
    };
    const { sku, productName, price, stock } = values;
    if (!sku || (sku + "").trim() === "") {
        errors.sku = "SKU is Required";
    }
    if (!productName || productName.trim() === "") {
        errors.productName = "Product Name is Required";
    }
    if (!price || (price + "").trim() === "") {
        errors.price = "Price is Required";
    }
    if (!stock || (stock + "").trim() === "") {
        errors.stock = "Stock is Required";
    }
    return errors;
}

class AddInventory extends Component {
    componentWillMount() {
        //const idParam = this.props.location.pathname.split("/")[2]; // Hacky Way
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
        return dispatch(addInventory(values)).then(function (data) {
            dispatch(push("/inventory"));
        });
    }
    render() {
        const { handleSubmit, pristine, initialValues, errors, submitting } = this.props;
        const { token, user, isLoggingIn, addingInventoryError, inventory } = this.props.inventory;
        let error = null;
        if (addingInventoryError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Adding Inventory</Message.Header>
                    <p>{addingInventoryError}</p>
                </Message>
            )
        }
        return (
            <BaseLayout>
                <Segment textAlign='center'>
                  <Container>
                    <Header as="h2">Add Inventory</Header>
                    {error}
                    <Form onSubmit={handleSubmit(this.onSubmit.bind(this))} loading={isLoggingIn}>
                        <Form.Field inline>
                            <Field name="sku" placeholder="Enter the SKU" component={this.renderField}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <Field name="productName" placeholder="Enter the Product Name" component={this.renderField}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <Field name="price" placeholder="Enter the Price" component={this.renderField}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <Field name="stock" placeholder="Enter the Stock" component={this.renderField}></Field>
                        </Form.Field>
                        <Button loading={submitting} disabled={submitting} disabled={pristine || submitting}>Add Inventory</Button>
                    </Form>
                    </Container>
                </Segment>
            </BaseLayout>
        )
    }
}

function mapStatesToProps(state) {
    const initialValues = state.inventory.inventory;
    console.log(state.inventory);
    if (initialValues && initialValues.productName && initialValues.productName.en) {
        initialValues.productName = initialValues.productName.en;
    }
    return {
        initialValues: initialValues,
        auth: state.auth,
        inventory: state.inventory,
        location: state.router.location
    }
}

export default connect(mapStatesToProps)(reduxForm({
    form: "AddInventory",
    validate
})(AddInventory));
