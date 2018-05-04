import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Header, Segment, Input, Label, Form, Button, Message, Container, Dropdown, Grid } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import { addSubInventory, inputSKU, inputDesc, fillingData, errorInput } from "./../../actions/SubInventoryActions";

import { getQualities, getTypes, getPatterns, getColors, getSizes, getUnits,
          chooseQuality, chooseType, choosePattern, chooseColor, chooseSize, chooseUnit
        } from "./../../actions/FeatureActions";

class AddSubInventory extends Component {
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
                    sku = sku.concat("-").concat(item.key).concat("-");
                    desc = desc.concat("-").concat(item.description).concat("-");
                }
            });
            units.forEach(function(item){
                if (item.description === unit){
                    sku = sku.concat(item.key);
                    desc = desc.concat(item.description);
                }
            });
            //console.log(sku);
            //console.log(desc);
            const data = {
                sku: sku,
                desc: desc
            }
            //dispatch(fillingData(data));
            return data;
        }
    }

    handleSKU(e){
        const { dispatch } = this.props;
        dispatch(inputSKU(e.target.value));
    }

    handleDesc(e){
        const { dispatch } = this.props;
        dispatch(inputDesc(e.target.value));
    }
    onCreate() {
        const { dispatch } = this.props;
        const { token } = this.props.auth;
        this.generateData();
        var { sku, desc } = this.props.inventory;
        const generatedSKU = this.generateData().sku;
        const generatedDesc = this.generateData().desc;
        //console.log(generatedSKU);
        //console.log(generatedDesc);
        if (desc === null){
            desc = generatedDesc;
        }
        if (sku === null){
            dispatch(errorInput());
        }
        else {
            const inv = {
                token: token,
                sku: sku,
                mainSku: generatedSKU,
                productName: desc
            }
            //console.log(inv);
            dispatch(addSubInventory(inv)).then(function(data){
                dispatch(push("/subInventory"));
            });
        }

    }
    render() {
        const { handleSubmit, pristine, initialValues, errors, submitting } = this.props;
        const { token, user, isAddingInventory, addingInventoryError, inventory,
                generatedSKU, generatedDesc, errorInput } = this.props.inventory;
        const { qualities, types, patterns, colors, sizes, units,
                quality, type, pattern, color, size, unit } = this.props.feature;

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
                        <Grid.Row className="generatedRow">
                          <Label basic pointing='right'>SKU</Label><Input className="generatedText" onChange={this.handleSKU.bind(this)}/>
                        </Grid.Row>
                        <Grid.Row>
                          <Label basic pointing='right'>Description</Label><Input className="generatedText" onChange={this.handleDesc.bind(this)}/>
                        </Grid.Row>
                      </Container>
                      <Container className="featureBox">
                          <Button onClick={this.onCreate.bind(this)}>Create</Button>
                      </Container>
                    </Container>
                </Segment>
            </BaseLayout>
        )
    }
}

function mapStatesToProps(state) {

    return {
        auth: state.auth,
        inventory: state.subInventory,
        feature: state.feature,
        location: state.router.location
    }
}

export default connect(mapStatesToProps)(AddSubInventory);
