import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Header, Segment, Input, Label, Form, Button, Message, Container } from "semantic-ui-react";

import { push } from 'react-router-redux';

//import { toastr } from 'react-redux-toastr';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';
import './../../styles/react-redux-toastr.min.css';

import { importInventory, clearImport } from "./../../actions/ImportActions";

function validate(values) {
    var errors = {
        batch: {}
    };
    const { code, capacity, count } = values;
    if (!code || (code + "").trim() === "") {
        errors.code = "Code is Required";
    }
    if (!capacity || (capacity + "").trim() === "") {
        errors.capacity = "Box Capacity is Required";
    }
    else if (isNaN(Number(capacity)) || !Number.isInteger(Number(capacity))){
        errors.capacity = "Box Capacity must be an integer";
    }
    else if (capacity <= 0){
        errors.capacity = "Box Capacity must be larger than 0";
    }
    if (!count || (count + "").trim() === "") {
        errors.count = "Box Count is Required";
    }
    else if (isNaN(Number(count)) || !Number.isInteger(Number(count))){
        errors.count = "Box Count must be an integer";
    }
    else if (count <= 0){
        errors.count = "Box Count must be larger than 0";
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
        const { token, user } = this.props.auth;
        values.code = values.code.trim();
        const data = {
           code: values.code,
           quantity: values.count * values.capacity,
           capacity: values.capacity,
           count: values.count,
           token: token
        }
        //console.log(data);
        return dispatch(importInventory(data)).then(function (data) {
            //toastr.success('Message', 'Import Successfully');
            alert("Import Successfully");
        });
    }
    render() {
        const { handleSubmit, pristine, errors, submitting } = this.props;
        const { isImportingInventory, importingInventoryError } = this.props.import;
        let error = null;
        if (importingInventoryError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Importing Inventory</Message.Header>
                    <p>{importingInventoryError}</p>
                </Message>
            )
            //toastr.error(importingInventoryError);
        }
        return (
            <BaseLayout>
                <Segment textAlign='center'>
                  <Container>
                    <Header as="h2">Import Inventory</Header>
                    {error}
                    <Form onSubmit={handleSubmit(this.onSubmit.bind(this))} loading={isImportingInventory}>
                        <Form.Field inline>
                            <Label>Scanning Code</Label>
                            <Field name="code" placeholder="Scanning Code" component={this.renderField}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <Label>Box Capacity</Label>
                            <Field name="capacity" placeholder="Box Capacity" component={this.renderField}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <Label>Box Count</Label>
                            <Field name="count" placeholder="Box Count" component={this.renderField}></Field>
                        </Form.Field>
                        <Button primary loading={submitting} disabled={submitting} disabled={pristine || submitting}>Submit</Button>
                    </Form>
                    </Container>
                </Segment>
            </BaseLayout>
        )
    }
}

function mapStatesToProps(state) {

    const initialValues = state.importData.defaultImport;

    return {
        initialValues: initialValues,
        auth: state.auth,
        import: state.importData
    }
}

export default connect(mapStatesToProps)(reduxForm({
    form: "ImportInventory",
    validate
})(ImportInventory));
