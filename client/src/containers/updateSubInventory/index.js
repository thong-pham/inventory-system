import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Header, Segment, Input, Label, Form, Button, Message, Container } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { setUpdatingSubInventory, updateSubInventory, clearInventory } from "./../../actions/SubInventoryActions";

function validate(values) {
    var errors = {
        batch: {}
    };
    const { sku, productName } = values;
    if (!sku || (sku + "").trim() === "") {
        errors.sku = "SKU is Required";
    }
    if (!productName || productName.trim() === "") {
        errors.productName = "Product Name is Required";
    }
    /*if (!price || (price + "").trim() === "") {
        errors.price = "Price is Required";
    }
    else if (isNaN(Number(price))) {
        errors.price = "Price must be a number";
    }
    if (!stock || (stock + "").trim() === "") {
        errors.stock = "Stock is Required";
    }
    else if (isNaN(Number(stock))){
        errors.stock = "Stock must be a number";
    }*/
    return errors;
}

class UpdateSubInventory extends Component {
    componentWillMount() {
        const idParam = this.props.location.pathname.split("/")[2]; // Hacky Way
        const { dispatch } = this.props;
        dispatch(setUpdatingSubInventory(idParam));
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
        values.productName = values.productName.trim();
        return dispatch(updateSubInventory(values)).then(function (data) {
            dispatch(push("/subInventory"));
        });
    }
    onBack(){
      const { dispatch } = this.props;
      dispatch(clearInventory());
      dispatch(push("/subInventory"));
    }
    render() {
        const { handleSubmit, pristine, initialValues, errors, submitting } = this.props;
        const { token, user, isUpdatingInventory, updatingInventoriesError, inventory } = this.props.inventory;
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
                    <Form onSubmit={handleSubmit(this.onSubmit.bind(this))} loading={isUpdatingInventory}>
                        <Form.Field inline>
                            <Field name="sku" placeholder="Enter the SKU" component={this.renderField} disabled={true}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <Field name="productName" placeholder="Enter the Product Description" component={this.renderField}></Field>
                        </Form.Field>
                        {/*<Form.Field inline>
                            <Field name="price" placeholder="Enter the Price" component={this.renderField}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <Field name="stock" placeholder="Enter the Stock" component={this.renderField}></Field>
                        </Form.Field>*/}
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
    const initialValues = state.subInventory.inventory;
    //console.log(state.inventory);
    if (initialValues && initialValues.productName && initialValues.productName.en) {
        initialValues.productName = initialValues.productName.en;
    }
    return {
        initialValues: initialValues,
        auth: state.auth,
        inventory: state.subInventory,
        location: state.router.location
    }
}

export default connect(mapStatesToProps)(reduxForm({
    form: "UpdateSubInventory",
    validate
})(UpdateSubInventory));
