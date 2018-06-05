import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Header, Segment, Input, Label, Form, Button, Message, Container } from "semantic-ui-react";

import { push } from 'react-router-redux';

//import { toastr } from 'react-redux-toastr';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { exportInventory, clearExport } from "./../../actions/ExportActions";

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

class ExportInventory extends Component {
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
        return dispatch(exportInventory(data)).then(function (data) {
            //toastr.success('Message', 'Export Successfully');
            alert("Export Successfully");
        });
    }
    render() {
        const { handleSubmit, pristine, errors, submitting } = this.props;
        const { isExportingInventory, exportingInventoryError } = this.props.export;
        let error = null;
        if (exportingInventoryError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Exporting Inventory</Message.Header>
                    <p>{exportingInventoryError}</p>
                </Message>
            )
            //toastr.error(exportingInventoryError);
        }
        return (
            <BaseLayout>
                <Segment textAlign='center'>
                  <Container>
                    <Header as="h2">Export Inventory</Header>
                    {error}
                    <Form onSubmit={handleSubmit(this.onSubmit.bind(this))} loading={isExportingInventory}>
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

    const initialValues = state.exportData.defaultExport;

    return {
        initialValues: initialValues,
        auth: state.auth,
        export: state.exportData
    }
}

export default connect(mapStatesToProps)(reduxForm({
    form: "ExportInventory",
    validate
})(ExportInventory));
