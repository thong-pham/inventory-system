import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Header, Segment, Input, Label, Form, Button, Message, Menu, Dropdown, Container } from "semantic-ui-react";
import { push } from 'react-router-redux';
import axios from 'axios';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { setUpdatingUser, editUser, clearUser } from "./../../actions/UserActions";
import { getCompanies } from "./../../actions/CompanyActions";

function validate(values) {
    var errors = {};
    const { username, roles, company, password } = values;
    if (!username || username.trim() === "") {
        errors.username = "Username is Required";
    }
    if (!roles || roles.trim() === "") {
        errors.roles = "Role is Required";
    }
    if (!company || company.trim() === "") {
        errors.company = "Company is Required";
    }
    if (!password || password.trim() === "") {
        errors.password = "Password is Required";
    }
    return errors;
}

class EditUser extends Component {
    componentWillMount() {
        const { token } = this.props.auth;
        const { dispatch } = this.props;
        const idParam = this.props.location.pathname.split("/")[2];
        dispatch(setUpdatingUser(idParam));
        dispatch(getCompanies({ token: token }));

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
        return dispatch(editUser(values)).then(function (data) {
            dispatch(push("/users"));
        });
    }
    onBack(){
      const { dispatch } = this.props;
      dispatch(clearUser());
      dispatch(push("/users"));
    }
    render() {
        const { handleSubmit, pristine, initialValues, errors, submitting, roleOptions } = this.props;
        const { updatingUserError, isUpdatingUser, user } = this.props.user;
        const { companies } = this.props.company;

        const renderSelectField = ({ input, type, meta: { touched, error }, children }) => (
              <div className="selectDiv">
                  <select {...input}>
                    {children}
                  </select>
                  {touched && error && <span>{error}</span>}
               </div>
        )
        const renderSelectRoles = ({ input, type, meta: { touched, error }, children }) => (
              <div className="selectDiv">
                  <select {...input}>
                    {children}
                  </select>
                  {touched && error && <span>{error}</span>}
               </div>
        )
        let error = null;
        if (updatingUserError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Editing User</Message.Header>
                    <p>{updatingUserError}</p>
                </Message>
            )
        }
        return (
          <BaseLayout>
            <Segment textAlign='center'>
                <Container>
                <Header as="h2">Edit User</Header>
                {error}
                <Form onSubmit={handleSubmit(this.onSubmit.bind(this))} loading={isUpdatingUser}>
                    <Form.Field inline>
                        <Field name="username" placeholder="Enter the username" component={this.renderField}></Field>
                    </Form.Field>
                    <Form.Field inline>
                        <label>Select Company</label>
                        <Field name="company" component={renderSelectField}>
                            <option />
                             {Object.keys(companies).map(key =>
                                <option key={key} value={companies[key].name.en}>{companies[key].name.en}</option>)}
                        </Field>
                    </Form.Field>
                    { ((roleOptions) && (roleOptions === 'ISRA')) ?
                      <Form.Field inline>
                        <label>Select Role</label>
                          <Field name="roles" component={renderSelectRoles}>
                            <option />
                            <option value="storeManager">Store Manager</option>
                            <option value="worker">Worker</option>
                          </Field>
                    </Form.Field> : null}
                    { ((roleOptions) && (roleOptions !== 'ISRA')) ?
                      <Form.Field inline>
                        <label>Select Role</label>
                          <Field name="roles" component={renderSelectRoles}>
                            <option />
                            <option value="sales">Sales</option>
                          </Field>
                    </Form.Field> : null}

                    <Button primary loading={submitting} disabled={submitting}>Save Changes</Button>
                    <Button secondary onClick={this.onBack.bind(this)}>Cancel</Button>
                </Form>
                </Container>
            </Segment>
          </BaseLayout>
        )
    }
}

function mapStatesToProps(state) {
    const user = state.user.user;
    var initialValues = null;
    var roleOptions = null;
    if (user){
        roleOptions = user.company;
        initialValues = {
            id: user.id,
            username: user.username,
            roles: user.roles[0],
            company: user.company
        }
    }
    return {
        initialValues: initialValues,
        auth: state.auth,
        user: state.user,
        company: state.company,
        location: state.router.location,
        roleOptions: roleOptions
    }
}

export default connect(mapStatesToProps)(reduxForm({
    form: "EditUser",
    validate
})(EditUser));
