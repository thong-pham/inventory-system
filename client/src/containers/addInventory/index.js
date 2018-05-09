import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Header, Segment, Input, Label, Form, Button, Message, Container, Dropdown, Grid } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { addInventory, setUpdatingInventory, updateInventory, fillingData, errorInput } from "./../../actions/InventoryActions";

import { getQualities, getTypes, getPatterns, getColors, getSizes, getUnits,
          chooseQuality, chooseType, choosePattern, chooseColor, chooseSize, chooseUnit
        } from "./../../actions/FeatureActions";

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
    else if (isNaN(Number(price))) {
        errors.price = "Price must be a number";
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
    return errors;
}

class AddInventory extends Component {
    state = {};
    componentWillMount() {
        const { dispatch } = this.props;
        const { token } = this.props.auth;
        dispatch(getQualities({ token: token }));
        dispatch(getTypes({ token: token }));
        dispatch(getPatterns({ token: token }));
        dispatch(getColors({ token: token }));
        dispatch(getSizes({ token: token }));
        dispatch(getUnits({ token: token }));
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
    handleChange(e, data){
          const { dispatch } = this.props;
          if (data.placeholder == "Choose an quality"){
              dispatch(chooseQuality(data.value));
          }
          else if (data.placeholder == "Choose an type"){
              dispatch(chooseType(data.value));
          }
          else if (data.placeholder == "Choose an pattern"){
              dispatch(choosePattern(data.value));
          }
          else if (data.placeholder == "Choose an color"){
              dispatch(chooseColor(data.value));
          }
          else if (data.placeholder == "Choose an size"){
              dispatch(chooseSize(data.value));
          }
          else if (data.placeholder == "Choose an unit"){
              dispatch(chooseUnit(data.value));
          }
          else {
              alert("undefined");
          }
    }
    generateData(){
        const { dispatch } = this.props;
        const { quality, type, pattern, color, size, unit,
                qualities, types, patterns, colors, sizes, units } = this.props.feature;
        var sku = "";
        var desc = "";
        if ((quality === null) || (type === null) || (pattern === null) || (color === null)){
            dispatch(errorInput());
        }
        else {
            qualities.forEach(function(item){
                if (item.description === quality){
                    sku = sku.concat(item.key).concat("-");
                    desc = desc.concat(item.description).concat("-");
                }
            });
            types.forEach(function(item){
                if (item.description === type){
                    sku = sku.concat(item.key).concat("-");
                    desc = desc.concat(item.description).concat("-");
                }
            });
            patterns.forEach(function(item){
                if (item.description === pattern){
                    sku = sku.concat(item.key).concat("-");
                    desc = desc.concat(item.description).concat("-");
                }
            });
            colors.forEach(function(item){
                if (item.description === color){
                    sku = sku.concat(item.key);
                    desc = desc.concat(item.description);
                }
            });
            sizes.forEach(function(item){
                if (item.description === size){
                    sku = sku.concat("-").concat(item.key);
                    desc = desc.concat("-").concat(item.description);
                }
            });
            units.forEach(function(item){
                if (item.description === unit){
                    sku = sku.concat("-").concat(item.key);
                    desc = desc.concat("-").concat(item.description);
                }
            });
            //console.log(sku);
            //console.log(desc);
            const data = {
                sku: sku,
                desc: desc
            }
            dispatch(fillingData(data));
        }
    }
    onSubmit(values, dispatch) {
        const { token } = this.props.auth;
        const { generatedSKU, generatedDesc } = this.props.inventory;
        if ((generatedSKU === null) || (generatedDesc === null)){
            dispatch(errorInput());
        }
        else {
            values.token = token;
            values.sku = generatedSKU;
            values.productName = generatedDesc;
            //console.log(values);
            return dispatch(addInventory(values)).then(function (data) {
                dispatch(push("/inventory"));
            });
        }

    }
    render() {
        const { handleSubmit, pristine, initialValues, errors, submitting } = this.props;
        const { token, user, isAddingInventory, addingInventoryError, inventory,
                generatedSKU, generatedDesc, errorInput } = this.props.inventory;
        const { qualities, types, patterns, colors, sizes, units,
                quality, type, pattern, color, size, unit } = this.props.feature;
        const { value } = this.state;
        var qualityList = [];
        var typeList = [];
        var patternList = [];
        var colorList = [];
        var sizeList = [{key:1, text:'No Size', value:''}];
        var unitList = [{key:1, text:'No Unit', value:''}];

        var qualityKey = 1;
        var typeKey = 1;
        var patternKey = 1;
        var colorKey = 1;
        var sizeKey = 2;
        var unitKey = 2;

        if (qualities.length > 0){
            qualities.forEach(function(quality){
                const data = {
                    key: qualityKey,
                    text: quality.description,
                    value: quality.description
                }
                qualityList.push(data);
                qualityKey += 1;
            });
        }

        if (types.length > 0){
            types.forEach(function(type){
                const data = {
                    key: typeKey,
                    text: type.description,
                    value: type.description
                }
                typeList.push(data);
                typeKey += 1;
            });
        }

        if (patterns.length > 0){
            patterns.forEach(function(pattern){
                const data = {
                    key: patternKey,
                    text: pattern.description,
                    value: pattern.description
                }
                patternList.push(data);
                patternKey += 1;
            });
        }

        if (colors.length > 0){
            colors.forEach(function(color){
                const data = {
                    key: colorKey,
                    text: color.description,
                    value: color.description
                }
                colorList.push(data);
                colorKey += 1;
            });
        }

        if (sizes.length > 0){
            sizes.forEach(function(size){
                const data = {
                    key: sizeKey,
                    text: size.description,
                    value: size.description
                }
                sizeList.push(data);
                sizeKey += 1;
            });
        }

        if (units.length > 0){
            units.forEach(function(unit){
                const data = {
                    key: unitKey,
                    text: unit.description,
                    value: unit.description
                }
                unitList.push(data);
                unitKey += 1;
            });
        }
        //console.log(qualityList);
        let error = null;
        if (addingInventoryError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Adding Inventory</Message.Header>
                    <p>{addingInventoryError}</p>
                </Message>
            )
        }
        if (errorInput) {
            error = (
                <Message negative>
                    <Message.Header>Error while Adding Inventory</Message.Header>
                    <p>{errorInput}</p>
                </Message>
            )
        }
        return (
            <BaseLayout>
                <Segment textAlign='center'>
                  <Container>
                    <Header as="h2">Add Inventory</Header>
                    {error}
                    <Container className="featureBox">
                      <Grid columns={3} divided>
                        <Grid.Row>
                          <Grid.Column>
                            <Dropdown
                              onChange={this.handleChange.bind(this)}
                              options={qualityList}
                              placeholder='Choose an quality'
                              selection
                              value={quality}
                            />
                          </Grid.Column>
                          <Grid.Column>
                            <Dropdown
                              onChange={this.handleChange.bind(this)}
                              options={typeList}
                              placeholder='Choose an type'
                              selection
                              value={type}
                            />
                          </Grid.Column>
                          <Grid.Column>
                            <Dropdown
                              onChange={this.handleChange.bind(this)}
                              options={patternList}
                              placeholder='Choose an pattern'
                              selection
                              value={pattern}
                            />
                          </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                          <Grid.Column>
                            <Dropdown
                              onChange={this.handleChange.bind(this)}
                              options={colorList}
                              placeholder='Choose an color'
                              selection
                              value={color}
                            />
                          </Grid.Column>
                          <Grid.Column>
                            <Dropdown
                              onChange={this.handleChange.bind(this)}
                              options={sizeList}
                              placeholder='Choose an size'
                              selection
                              value={size}
                            />
                          </Grid.Column>
                          <Grid.Column>
                            <Dropdown
                              onChange={this.handleChange.bind(this)}
                              options={unitList}
                              placeholder='Choose an unit'
                              selection
                              value={unit}
                            />
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Container>
                    <Container className="featureBox">
                        <Button onClick={this.generateData.bind(this)}>Generate</Button>
                    </Container>
                    <Container className="featureBox">
                      <Grid.Row className="generatedRow">
                        <Label basic pointing='right'>SKU</Label><p className="generatedText">{generatedSKU}</p>
                      </Grid.Row>
                      <Grid.Row>
                        <Label basic pointing='right'>Description</Label><p className="generatedText">{generatedDesc}</p>
                      </Grid.Row>
                    </Container>
                    <Form onSubmit={handleSubmit(this.onSubmit.bind(this))} loading={isAddingInventory}>
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
    //console.log(initialValues);
    return {
        initialValues: initialValues,
        auth: state.auth,
        inventory: state.inventory,
        feature: state.feature,
        location: state.router.location
    }
}

export default connect(mapStatesToProps)(reduxForm({
    form: "AddInventory",
    validate
})(AddInventory));
