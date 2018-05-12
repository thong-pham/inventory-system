import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Container, Button, Input, Grid, Label, Tab } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { getQualities, getTypes, getPatterns, getColors, getSizes, getUnits,
          addQuality, addType, addPattern, addColor, addSize, addUnit,
          closeQuality, closeType, closePattern, closeColor, closeSize, closeUnit,
          handleInputKey, handleInputDescription, addFeature, changeFeature, deleteFeature, fillingData, clearData, errorInput
        } from "./../../actions/FeatureActions";

class ViewFeatures extends Component {
    componentWillMount() {
        const { token, dispatch } = this.props;
        const { user } = this.props.auth;
        dispatch(getQualities({ token: token }));
        dispatch(getTypes({ token: token }));
        dispatch(getPatterns({ token: token }));
        dispatch(getColors({ token: token }));
        dispatch(getSizes({ token: token }));
        dispatch(getUnits({ token: token }));
    }

    onPressEdit(feature, data) {
        const { dispatch } = this.props;
        if (data === "Quality"){
            dispatch(fillingData(feature));
            const option = {
                addButton: false,
                updateButton: true
            }
            dispatch(addQuality(option));
        }
        else if (data === "Type"){
            dispatch(fillingData(feature));
            const option = {
                addButton: false,
                updateButton: true
            }
            dispatch(addType(option));
        }
        else if (data === "Pattern"){
            dispatch(fillingData(feature));
            const option = {
                addButton: false,
                updateButton: true
            }
            dispatch(addPattern(option));
        }
        else if (data === "Color"){
            dispatch(fillingData(feature));
            const option = {
                addButton: false,
                updateButton: true
            }
            dispatch(addColor(option));
        }
        else if (data === "Size"){
            dispatch(fillingData(feature));
            const option = {
                addButton: false,
                updateButton: true
            }
            dispatch(addSize(option));
        }
        else if (data === "Unit"){
            dispatch(fillingData(feature));
            const option = {
                addButton: false,
                updateButton: true
            }
            dispatch(addUnit(option));
        }
        else {
            alert("undefined");
        }

    }

    onPressAdd(data) {
        const { dispatch } = this.props;
        if (data === "Quality"){
            dispatch(clearData());
            const option = {
                addButton: true,
                updateButton: false
            }
            dispatch(addQuality(option));
        }
        else if (data === "Type"){
            dispatch(clearData());
            const option = {
                addButton: true,
                updateButton: false
            }
            dispatch(addType(option));
        }
        else if (data === "Pattern"){
            dispatch(clearData());
            const option = {
                addButton: true,
                updateButton: false
            }
            dispatch(addPattern(option));
        }
        else if (data === "Color"){
            dispatch(clearData());
            const option = {
                addButton: true,
                updateButton: false
            }
            dispatch(addColor(option));
        }
        else if (data === "Size"){
            dispatch(clearData());
            const option = {
                addButton: true,
                updateButton: false
            }
            dispatch(addSize(option));
        }
        else if (data === "Unit"){
            dispatch(clearData());
            const option = {
                addButton: true,
                updateButton: false
            }
            dispatch(addUnit(option));
        }
        else {
            alert("undefined");
        }
    }

    onPressClose(data) {
        const { dispatch } = this.props;
        if (data === "Quality"){
            dispatch(closeQuality());
        }
        else if (data === "Type"){
            dispatch(closeType());
        }
        else if (data === "Pattern"){
            dispatch(closePattern());
        }
        else if (data === "Color"){
            dispatch(closeColor());
        }
        else if (data === "Size"){
            dispatch(closeSize());
        }
        else if (data === "Unit"){
            dispatch(closeUnit());
        }
        else {
            alert("undefined");
        }
    }



    onPressDelete(feature, kind){
          const { dispatch, token } = this.props;
          const data = {
              id: feature.id,
              kind: kind,
              token: token
          }
          dispatch(deleteFeature(data)).then(function(data){
                if (kind === "Quality"){
                    dispatch(getQualities({ token: token }));
                }
                else if (kind === "Type"){
                    dispatch(getTypes({ token: token }));
                }
                else if (kind === "Pattern"){
                    dispatch(getPatterns({ token: token }));
                }
                else if (kind === "Color"){
                    dispatch(getColors({ token: token }));
                }
                else if (kind === "Size"){
                    dispatch(getSizes({ token: token }));
                }
                else if (kind === "Unit"){
                    dispatch(getUnits({ token: token }));
                }
                else {
                    alert("undefined");
                }
          });
    }

    handleKey(e){
        const { dispatch } = this.props;
        dispatch(handleInputKey(e.target.value));
    }

    handleDescription(e){
        const { dispatch } = this.props;
        dispatch(handleInputDescription(e.target.value));
    }

    onSaveAdd(kind){
       const { dispatch, token } = this.props;
       const { key, description } = this.props.feature;
       if (!key || (key + "").trim() === "" || !description || (description + "").trim() === ""){
            const data = "Invalid Input";
            dispatch(errorInput(data));
       }
       else {
           const data = {
              token: token,
              kind: kind,
              key: key,
              description: description
           }
           dispatch(addFeature(data)).then(function(data){
                 if (kind === "Quality"){
                     dispatch(getQualities({ token: token }));
                 }
                 else if (kind === "Type"){
                     dispatch(getTypes({ token: token }));
                 }
                 else if (kind === "Pattern"){
                     dispatch(getPatterns({ token: token }));
                 }
                 else if (kind === "Color"){
                     dispatch(getColors({ token: token }));
                 }
                 else if (kind === "Size"){
                     dispatch(getSizes({ token: token }));
                 }
                 else if (kind === "Unit"){
                     dispatch(getUnits({ token: token }));
                 }
                 else {
                     alert("undefined");
                 }
           });
       }
    }

    onSaveUpdate(kind){
       const { dispatch, token } = this.props;
       const { key, description, currentId } = this.props.feature;
       if (!key || (key + "").trim() === "" || !description || (description + "").trim() === ""){
           const data = "Invalid Input";
           dispatch(errorInput(data));
       }
       else {
           const data = {
              id: currentId,
              token: token,
              kind: kind,
              key: key,
              description: description
           }
           dispatch(changeFeature(data)).then(function(data){
                 if (kind === "Quality"){
                     dispatch(getQualities({ token: token }));
                 }
                 else if (kind === "Type"){
                     dispatch(getTypes({ token: token }));
                 }
                 else if (kind === "Pattern"){
                     dispatch(getPatterns({ token: token }));
                 }
                 else if (kind === "Color"){
                     dispatch(getColors({ token: token }));
                 }
                 else if (kind === "Size"){
                     dispatch(getSizes({ token: token }));
                 }
                 else if (kind === "Unit"){
                     dispatch(getUnits({ token: token }));
                 }
                 else {
                     alert("undefined");
                 }
           });
       }
    }

    render() {
        const { user } = this.props.auth;
        const { qualities, types, patterns, colors, sizes, units, isAddingFeature, addingFeatureError, changingFeatureError,
                isFetchingQuality, fetchingQualityError, isFetchingType, fetchingTypeError,
                isFetchingPattern, fetchingPatternError, isFetchingColor, fetchingColorError,
                isFetchingSize, fetchingSizeError, isFetchingUnit, fetchingUnitError,
                addQuality, addType, addPattern, addColor, addSize, addUnit, key, description, addButton, updateButton, errorInput } = this.props.feature;
        let error = null;
        if (fetchingQualityError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Fetching Quality</Message.Header>
                    <p>{fetchingQualityError}</p>
                </Message>
            )
        }
        if (fetchingTypeError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Fetching Type</Message.Header>
                    <p>{fetchingTypeError}</p>
                </Message>
            )
        }
        if (fetchingPatternError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Fetching Pattern</Message.Header>
                    <p>{fetchingPatternError}</p>
                </Message>
            )
        }
        if (fetchingColorError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Fetching Color</Message.Header>
                    <p>{fetchingColorError}</p>
                </Message>
            )
        }
        if (fetchingSizeError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Fetching Size</Message.Header>
                    <p>{fetchingSizeError}</p>
                </Message>
            )
        }
        if (fetchingUnitError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Fetching Unit</Message.Header>
                    <p>{fetchingUnitError}</p>
                </Message>
            )
        }
        if (addingFeatureError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Adding Feature</Message.Header>
                    <p>{addingFeatureError}</p>
                </Message>
            )
        }
        if (changingFeatureError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Changing Feature</Message.Header>
                    <p>{changingFeatureError}</p>
                </Message>
            )
        }
        if (errorInput) {
            error = (
                <Message negative>
                    <Message.Header>Error while Inputing Data</Message.Header>
                    <p>{errorInput}</p>
                </Message>
            )
        }
        const qualityView = qualities.map(function (quality) {
            return (
                <Table.Row key={quality.id}>
                    <Table.Cell>{quality.key}</Table.Cell>
                    <Table.Cell>{quality.description}</Table.Cell>
                    <Table.Cell >
                       {(!addQuality) ? <Button color='teal' onClick={this.onPressEdit.bind(this, quality, "Quality")}><Icon name='pencil' />Edit</Button> : null }
                       {(!addQuality) ? <Button color='red' onClick={this.onPressDelete.bind(this, quality, "Quality")}><Icon name='trash outline' />Delete</Button> : null }
                    </Table.Cell>
                </Table.Row>
            )
        }, this);
        const typeView = types.map(function (type) {
            return (
                <Table.Row key={type.id}>
                    <Table.Cell>{type.key}</Table.Cell>
                    <Table.Cell>{type.description}</Table.Cell>
                    <Table.Cell >
                        {(!addType) ? <Button color='teal' onClick={this.onPressEdit.bind(this, type, "Type")}><Icon name='pencil' />Edit</Button> : null }
                        {(!addType) ? <Button color='red' onClick={this.onPressDelete.bind(this, type, "Type")}><Icon name='trash outline' />Delete</Button> : null }
                    </Table.Cell>
                </Table.Row>
            )
        }, this);
        const patternView = patterns.map(function (pattern) {
            return (
                <Table.Row key={pattern.id}>
                    <Table.Cell>{pattern.key}</Table.Cell>
                    <Table.Cell>{pattern.description}</Table.Cell>
                    <Table.Cell >
                        {(!addPattern) ? <Button color='teal' onClick={this.onPressEdit.bind(this, pattern, "Pattern")}><Icon name='pencil' />Edit</Button> : null }
                        {(!addPattern) ? <Button color='red' onClick={this.onPressDelete.bind(this, pattern, "Pattern")}><Icon name='trash outline' />Delete</Button> : null }
                    </Table.Cell>
                </Table.Row>
            )
        }, this);
        const colorView = colors.map(function (color) {
            return (
                <Table.Row key={color.id}>
                    <Table.Cell>{color.key}</Table.Cell>
                    <Table.Cell>{color.description}</Table.Cell>
                    <Table.Cell >
                        {(!addColor) ? <Button color='teal' onClick={this.onPressEdit.bind(this, color, "Color")}><Icon name='pencil' />Edit</Button> : null }
                        {(!addColor) ? <Button color='red' onClick={this.onPressDelete.bind(this, color, "Color")}><Icon name='trash outline' />Delete</Button> : null }
                    </Table.Cell>
                </Table.Row>
            )
        }, this);
        const sizeView = sizes.map(function (size) {
            return (
                <Table.Row key={size.id}>
                    <Table.Cell>{size.key}</Table.Cell>
                    <Table.Cell>{size.description}</Table.Cell>
                    <Table.Cell >
                        {(!addSize) ? <Button color='teal' onClick={this.onPressEdit.bind(this, size, "Size")}><Icon name='pencil' />Edit</Button> : null }
                        {(!addSize) ? <Button color='red' onClick={this.onPressDelete.bind(this, size, "Size")}><Icon name='trash outline' />Delete</Button> : null }
                    </Table.Cell>
                </Table.Row>
            )
        }, this);
        const unitView = units.map(function (unit) {
            return (
                <Table.Row key={unit.id}>
                    <Table.Cell>{unit.key}</Table.Cell>
                    <Table.Cell>{unit.description}</Table.Cell>
                    <Table.Cell >
                        {(!addUnit) ? <Button color='teal' onClick={this.onPressEdit.bind(this, unit, "Unit")}><Icon name='pencil' />Edit</Button> : null }
                        {(!addUnit) ? <Button color='red' onClick={this.onPressDelete.bind(this, unit, "Unit")}><Icon name='trash outline' />Delete</Button> : null }
                    </Table.Cell>
                </Table.Row>
            )
        }, this);
        let qualityTableView = <h4>No Qualities Found. Please Add Some </h4>
        let typeTableView = <h4>No Types Found. Please Add Some </h4>
        let patternTableView = <h4>No Patterns Found. Please Add Some </h4>
        let colorTableView = <h4>No Colors Found. Please Add Some </h4>
        let sizeTableView = <h4>No Sizes Found. Please Add Some </h4>
        let unitTableView = <h4>No Units Found. Please Add Some </h4>
        if (qualities.length > 0) {
            qualityTableView = (
                <Table celled fixed>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1}>Key</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Description</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Options</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {qualityView}
                    </Table.Body>
                </Table>
            )
        }
        if (types.length > 0) {
            typeTableView = (
                <Table celled fixed>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1}>Key</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Description</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Options</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {typeView}
                    </Table.Body>
                </Table>
            )
        }
        if (patterns.length > 0) {
            patternTableView = (
                <Table celled fixed>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1}>Key</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Description</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Options</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {patternView}
                    </Table.Body>
                </Table>
            )
        }
        if (colors.length > 0) {
            colorTableView = (
                <Table celled fixed>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1}>Key</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Description</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Options</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {colorView}
                    </Table.Body>
                </Table>
            )
        }
        if (sizes.length > 0) {
            sizeTableView = (
                <Table celled fixed>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1}>Key</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Description</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Options</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {sizeView}
                    </Table.Body>
                </Table>
            )
        }
        if (units.length > 0) {
            unitTableView = (
                <Table celled fixed>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1}>Key</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Description</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Options</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {unitView}
                    </Table.Body>
                </Table>
            )
        }
        const qualityTab = (
           <div>
              <Container className="featureBox">
                <Header as="h2">Quality List</Header>
                  {error}
                  {qualityTableView}
                  { (!addQuality) ?
                    <Button floated='right' icon labelPosition='left' primary size='small' onClick={this.onPressAdd.bind(this, "Quality")}>
                      <Icon name='add' /> Add Quality
                    </Button> : null}
                </Container>
                { (addQuality) ?
                <Container className="featureBox">
                  <Grid divided>
                        <Grid.Row textAlign='center'>
                              <Grid.Column width={8} className="alignRight">
                                <Label>Key</Label>
                              </Grid.Column>
                              <Grid.Column width={6} className="alignLeft">
                                <Input className="pwdBox" type='text' defaultValue={key} onChange={this.handleKey.bind(this)}/>
                              </Grid.Column>
                          </Grid.Row>
                          <Grid.Row textAlign='center'>
                              <Grid.Column width={8} className="alignRight">
                                <Label>Description</Label>
                              </Grid.Column>
                              <Grid.Column width={6} className="alignLeft">
                                <Input className="pwdBox" type='text' defaultValue={description}  onChange={this.handleDescription.bind(this)}/>
                              </Grid.Column>
                          </Grid.Row>
                          <Grid.Row textAlign='center'>
                              <Grid.Column>
                                { (addButton) ? <Button onClick={this.onSaveAdd.bind(this, "Quality")}>Add</Button> : null }
                                { (updateButton) ? <Button onClick={this.onSaveUpdate.bind(this, "Quality")}>Update</Button> : null }
                                <Button onClick={this.onPressClose.bind(this, "Quality")}>Cancel</Button>
                              </Grid.Column>
                          </Grid.Row>
                      </Grid>
                </Container> : null }
            </div>
        )
        const typeTab = (
            <div>
                <Container className="featureBox">
                    <Header as="h2">Type List</Header>
                    {error}
                    {typeTableView}
                    { (!addType) ?
                    <Button floated='right' icon labelPosition='left' primary size='small' onClick={this.onPressAdd.bind(this, "Type")}>
                      <Icon name='add' /> Add Type
                    </Button> : null }
                </Container>
                { (addType) ?
                <Container className="featureBox">
                  <Grid divided>
                        <Grid.Row textAlign='center'>
                              <Grid.Column width={8} className="alignRight">
                                <Label>Key</Label>
                              </Grid.Column>
                              <Grid.Column width={6} className="alignLeft">
                                <Input className="pwdBox" type='text' defaultValue={key} onChange={this.handleKey.bind(this)}/>
                              </Grid.Column>
                          </Grid.Row>
                          <Grid.Row textAlign='center'>
                              <Grid.Column width={8} className="alignRight">
                                <Label>Description</Label>
                              </Grid.Column>
                              <Grid.Column width={6} className="alignLeft">
                                <Input className="pwdBox" type='text' defaultValue={description} onChange={this.handleDescription.bind(this)}/>
                              </Grid.Column>
                          </Grid.Row>
                          <Grid.Row textAlign='center'>
                              <Grid.Column>
                                { (addButton) ? <Button onClick={this.onSaveAdd.bind(this, "Type")}>Add</Button> : null }
                                { (updateButton) ? <Button onClick={this.onSaveUpdate.bind(this, "Type")}>Update</Button> : null }
                                <Button onClick={this.onPressClose.bind(this, "Type")}>Cancel</Button>
                              </Grid.Column>
                          </Grid.Row>
                      </Grid>
                </Container> : null }
            </div>
        )
        const patternTab = (
            <div>
                <Container className="featureBox">
                    <Header as="h2">Pattern List</Header>
                    {error}
                    {patternTableView}
                    { (!addPattern) ?
                    <Button floated='right' icon labelPosition='left' primary size='small' onClick={this.onPressAdd.bind(this, "Pattern")}>
                      <Icon name='add' /> Add Pattern
                    </Button> : null }
                </Container>
                { (addPattern) ?
                <Container className="featureBox">
                  <Grid divided>
                        <Grid.Row textAlign='center'>
                              <Grid.Column width={8} className="alignRight">
                                <Label >Key</Label>
                              </Grid.Column>
                              <Grid.Column width={6} className="alignLeft">
                                <Input className="pwdBox" type='text' defaultValue={key} onChange={this.handleKey.bind(this)}/>
                              </Grid.Column>
                          </Grid.Row>
                          <Grid.Row textAlign='center'>
                              <Grid.Column width={8} className="alignRight">
                                <Label >Description</Label>
                              </Grid.Column>
                              <Grid.Column width={6} className="alignLeft">
                                <Input className="pwdBox" type='text' defaultValue={description} onChange={this.handleDescription.bind(this)}/>
                              </Grid.Column>
                          </Grid.Row>
                          <Grid.Row textAlign='center'>
                              <Grid.Column>
                                { (addButton) ? <Button onClick={this.onSaveAdd.bind(this, "Pattern")}>Add</Button> : null }
                                { (updateButton) ? <Button onClick={this.onSaveUpdate.bind(this, "Pattern")}>Update</Button> : null }
                                <Button onClick={this.onPressClose.bind(this, "Pattern")}>Cancel</Button>
                              </Grid.Column>
                          </Grid.Row>
                      </Grid>
                </Container> : null }


            </div>
        )
        const colorTab = (
            <div>
                <Container className="featureBox">
                    <Header as="h2">Color List</Header>
                    {error}
                    {colorTableView}
                    { (!addColor) ?
                    <Button floated='right' icon labelPosition='left' primary size='small' onClick={this.onPressAdd.bind(this, "Color")}>
                      <Icon name='add' /> Add Color
                    </Button> : null }
                </Container>
                { (addColor) ?
                <Container className="featureBox">
                  <Grid divided>
                        <Grid.Row textAlign='center'>
                              <Grid.Column width={8} className="alignRight">
                                <Label>Key</Label>
                              </Grid.Column>
                              <Grid.Column width={6} className="alignLeft">
                                <Input className="pwdBox" type='text' defaultValue={key} onChange={this.handleKey.bind(this)}/>
                              </Grid.Column>
                          </Grid.Row>
                          <Grid.Row textAlign='center'>
                              <Grid.Column width={8} className="alignRight">
                                <Label>Description</Label>
                              </Grid.Column>
                              <Grid.Column width={6} className="alignLeft">
                                <Input className="pwdBox" type='text' defaultValue={description} onChange={this.handleDescription.bind(this)}/>
                              </Grid.Column>
                          </Grid.Row>
                          <Grid.Row textAlign='center'>
                              <Grid.Column>
                                { (addButton) ? <Button onClick={this.onSaveAdd.bind(this, "Color")}>Add</Button> : null }
                                { (updateButton) ? <Button onClick={this.onSaveUpdate.bind(this, "Color")}>Update</Button> : null }
                                <Button onClick={this.onPressClose.bind(this, "Color")}>Cancel</Button>
                              </Grid.Column>
                          </Grid.Row>
                      </Grid>
                </Container> : null }
            </div>
        )
        const sizeTab = (
            <div>
                <Container className="featureBox">
                    <Header as="h2">Size List</Header>
                    {error}
                    {sizeTableView}
                    { (!addSize) ?
                    <Button floated='right' icon labelPosition='left' primary size='small' onClick={this.onPressAdd.bind(this, "Size")}>
                      <Icon name='add' /> Add Size
                    </Button> : null }
                </Container>
                { (addSize) ?
                <Container className="featureBox">
                  <Grid divided>
                        <Grid.Row textAlign='center'>
                              <Grid.Column width={8} className="alignRight">
                                <Label>Key</Label>
                              </Grid.Column>
                              <Grid.Column width={6} className="alignLeft">
                                <Input className="pwdBox" type='text' defaultValue={key} onChange={this.handleKey.bind(this)}/>
                              </Grid.Column>
                          </Grid.Row>
                          <Grid.Row textAlign='center'>
                              <Grid.Column width={8} className="alignRight">
                                <Label>Description</Label>
                              </Grid.Column>
                              <Grid.Column width={6} className="alignLeft">
                                <Input className="pwdBox" type='text' defaultValue={description} onChange={this.handleDescription.bind(this)}/>
                              </Grid.Column>
                          </Grid.Row>
                          <Grid.Row textAlign='center'>
                              <Grid.Column>
                                { (addButton) ? <Button onClick={this.onSaveAdd.bind(this, "Size")}>Add</Button> : null }
                                { (updateButton) ? <Button onClick={this.onSaveUpdate.bind(this, "Size")}>Update</Button> : null }
                                <Button onClick={this.onPressClose.bind(this, "Size")}>Cancel</Button>
                              </Grid.Column>
                          </Grid.Row>
                      </Grid>
                </Container> : null }
            </div>
        )
        const unitTab = (
            <div>
                <Container className="featureBox">
                    <Header as="h2">Unit List</Header>
                    {error}
                    {unitTableView}
                    { (!addUnit) ?
                    <Button floated='right' icon labelPosition='left' primary size='small' onClick={this.onPressAdd.bind(this, "Unit")}>
                      <Icon name='add' /> Add Unit
                    </Button> : null}
                </Container>
                { (addUnit) ?
                <Container className="featureBox">
                  <Grid divided>
                        <Grid.Row textAlign='center'>
                              <Grid.Column width={8} className="alignRight">
                                <Label>Key</Label>
                              </Grid.Column>
                              <Grid.Column width={6} className="alignLeft">
                                <Input className="pwdBox" type='text' defaultValue={key} onChange={this.handleKey.bind(this)}/>
                              </Grid.Column>
                          </Grid.Row>
                          <Grid.Row textAlign='center'>
                              <Grid.Column width={8} className="alignRight">
                                <Label>Description</Label>
                              </Grid.Column>
                              <Grid.Column width={6} className="alignLeft">
                                <Input className="pwdBox" type='text' defaultValue={description} onChange={this.handleDescription.bind(this)}/>
                              </Grid.Column>
                          </Grid.Row>
                          <Grid.Row textAlign='center'>
                              <Grid.Column>
                                { (addButton) ? <Button onClick={this.onSaveAdd.bind(this, "Unit")}>Add</Button> : null }
                                { (updateButton) ? <Button onClick={this.onSaveUpdate.bind(this, "Unit")}>Update</Button> : null }
                                <Button onClick={this.onPressClose.bind(this, "Unit")}>Cancel</Button>
                              </Grid.Column>
                          </Grid.Row>
                      </Grid>
                </Container> : null }
            </div>
        )
        const panes = [
            { menuItem: 'Quality', render: () => <Tab.Pane attached={false}>{qualityTab}</Tab.Pane> },
            { menuItem: 'Type', render: () => <Tab.Pane attached={false}>{typeTab}</Tab.Pane> },
            { menuItem: 'Pattern', render: () => <Tab.Pane attached={false}>{patternTab}</Tab.Pane> },
            { menuItem: 'Color', render: () => <Tab.Pane attached={false}>{colorTab}</Tab.Pane> },
            { menuItem: 'Size', render: () => <Tab.Pane attached={false}>{sizeTab}</Tab.Pane> },
            { menuItem: 'Unit', render: () => <Tab.Pane attached={false}>{unitTab}</Tab.Pane> },
        ]
        return (
          <BaseLayout>
              <Segment textAlign='center' padded='very'>
                <Header as="h2">Features Management</Header>
                <Tab menu={{ pointing: true }} panes={panes} />
              </Segment>
          </BaseLayout>
        )
    }
}

function mapStatesToProps(state) {
    return {
        token: state.auth.token,
        feature: state.feature,
        auth: state.auth
    }
}

export default connect(mapStatesToProps)(ViewFeatures);
