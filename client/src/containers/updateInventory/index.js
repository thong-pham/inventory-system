import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Header, Segment, Input, Label, Form, Button, Message, Container } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { setUpdatingInventory, updateInventory, clearInventory } from "./../../actions/InventoryActions";

function validate(values) {
    var errors = {
        batch: {}
    };
    const { sku, productName, price, stock, unit, capacity } = values;
    if (!sku || (sku + "").trim() === "") {
        errors.sku = "SKU is Required";
    }
    if (!productName || productName.trim() === "") {
        errors.productName = "Product Name is Required";
    }
    if (!unit || unit.trim() === "") {
        errors.unit = "Unit is Required";
    }
    if (!price || (price + "").trim() === "") {
        errors.price = "Price is Required";
    }
    else if (isNaN(Number(price))) {
        errors.price = "Price must be a number";
    }
    else if (price <= 0){
        errors.price = "Price must be larger than or equal to 0";
    }
    if (!stock || (stock + "").trim() === "") {
        errors.stock = "Stock is Required";
    }
    else if (isNaN(Number(stock))){
        errors.stock = "Stock must be a number";
    }
    else if (stock < 0){
        errors.stock = "Stock must be larger than or equal to 0";
    }
    if (!capacity || (capacity + "").trim() === "") {
        errors.capacity = "Box Capacity is Required";
    }
    else if (isNaN(Number(capacity))){
        errors.capacity = "Box Capacity must be a number";
    }
    else if (capacity <= 0){
        errors.capacity = "Box Capacity must be larger than or equal to 0";
    }
    return errors;
}

class UpdateInventory extends Component {
    componentWillMount() {
        const idParam = this.props.location.pathname.split("/")[2]; // Hacky Way
        const { dispatch } = this.props;
        dispatch(setUpdatingInventory(idParam));
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
        const { inventory } = this.props.inventory;
        values.sku = inventory.sku;
        values.token = token;
        //console.log(values);
        return dispatch(updateInventory(values)).then(function (data) {
            dispatch(push("/inventory"));
        });
    }
    onBack(){
      const { dispatch } = this.props;
      dispatch(clearInventory());
      dispatch(push("/inventory"));
    }
    render() {
        const { handleSubmit, pristine, initialValues, errors, submitting } = this.props;
        const { token, isUpdatingInventory, updatingInventoriesError, inventory } = this.props.inventory;
        let error = null;
        if (updatingInventoriesError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Adding Inventory</Message.Header>
                    <p>{updatingInventoriesError}</p>
                </Message>
            )
        }
        return (
            <BaseLayout>
                <Segment textAlign='center'>
                  <Container>
                    <Header as="h2">Update Inventory</Header>
                    {error}
                    {(inventory !== null) ? <h3>{inventory.sku}</h3> : null}
                    <Form onSubmit={handleSubmit(this.onSubmit.bind(this))} loading={isUpdatingInventory}>
                        {/*<Form.Field inline>
                            <Label>SKU</Label>
                            <Field name="sku" placeholder="Enter the SKU" component={this.renderField} disabled={true}></Field>
                        </Form.Field>*/}
                        <Form.Field inline>
                            <Label>Product Description</Label>
                            <Field name="productName" placeholder="Enter the Product Description" component={this.renderField}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <Label>Price</Label>
                            <Field name="price" placeholder="Enter the Price" component={this.renderField}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <Label>Unit</Label>
                            <Field name="unit" placeholder="Enter the Unit" component={this.renderField}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <Label>Box Capacity</Label>
                            <Field name="capacity" placeholder="Enter the Box Capacity" component={this.renderField}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <Label>Stock</Label>
                            <Field name="stock" placeholder="Enter the Stock" component={this.renderField}></Field>
                        </Form.Field>
                        <Button primary loading={submitting} disabled={submitting}>Update</Button>
                        <Button secondary onClick={this.onBack.bind(this)}>Cancel</Button>
                    </Form>
                    </Container>
                </Segment>
            </BaseLayout>
        )
    }
}

function mapStatesToProps(state) {
    const initialValues = state.inventory.inventory;
    //console.log(state.inventory);
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
    form: "UpdateInventory",
    validate
})(UpdateInventory));
