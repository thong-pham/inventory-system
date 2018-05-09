import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Container, Button, Input, Grid, Label, Tab } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { getQualities, getTypes, getPatterns, getColors, getSizes, getUnits,
          addQuality, addType, addPattern, addColor, addSize, addUnit,
          handleInputKey, handleInputDescription, addFeature, deleteFeature
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
    onPressEdit() {
        const { user } = this.props.auth;
        const { dispatch } = this.props;

    }

    onPressAdd(data) {
        const { dispatch } = this.props;
        if (data === "Quality"){
            dispatch(addQuality());
        }
        else if (data === "Type"){
            dispatch(addType());
        }
        else if (data === "Pattern"){
            dispatch(addPattern());
        }
        else if (data === "Color"){
            dispatch(addColor());
        }
        else if (data === "Size"){
            dispatch(addSize());
        }
        else if (data === "Unit"){
            dispatch(addUnit());
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

    render() {
        const { user } = this.props.auth;
        const { qualities, types, patterns, colors, sizes, units, isAddingFeature, addingFeatureError,
                isFetchingQuality, fetchingQualityError, isFetchingType, fetchingTypeError,
                isFetchingPattern, fetchingPatternError, isFetchingColor, fetchingColorError,
                isFetchingSize, fetchingSizeError, isFetchingUnit, fetchingUnitError,
                addQuality, addType, addPattern, addColor, addSize, addUnit } = this.props.feature;
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
        const qualityView = qualities.map(function (quality) {
            return (
                <Table.Row key={quality.id}>
                    <Table.Cell>{quality.key}</Table.Cell>
                    <Table.Cell>{quality.description}</Table.Cell>
                    <Table.Cell >
                       <Icon name='pencil' size='large' onClick={this.onPressEdit.bind(this, quality)} />
                       <Icon name='trash outline' size='large' onClick={this.onPressDelete.bind(this, quality, "Quality")} />
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
                       <Icon name='pencil' size='large' onClick={this.onPressEdit.bind(this, type)} />
                       <Icon name='trash outline' size='large' onClick={this.onPressDelete.bind(this, type, "Type")} />
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
                       <Icon name='pencil' size='large' onClick={this.onPressEdit.bind(this, pattern)} />
                       <Icon name='trash outline' size='large' onClick={this.onPressDelete.bind(this, pattern, "Pattern")} />
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
                       <Icon name='pencil' size='large' onClick={this.onPressEdit.bind(this, color)} />
                       <Icon name='trash outline' size='large' onClick={this.onPressDelete.bind(this, color, "Color")} />
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
                       <Icon name='pencil' size='large' onClick={this.onPressEdit.bind(this, size)} />
                       <Icon name='trash outline' size='large' onClick={this.onPressDelete.bind(this, size, "Size")} />
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
                       <Icon name='pencil' size='large' onClick={this.onPressEdit.bind(this, unit)} />
                       <Icon name='trash outline' size='large' onClick={this.onPressDelete.bind(this, unit, "Unit")} />
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
                              <Grid.Column width={8}>
                                <Label>Key</Label>
                              </Grid.Column>
                              <Grid.Column width={6}>
                                <Input className="pwdBox" type='text' onChange={this.handleKey.bind(this)}/>
                              </Grid.Column>
                          </Grid.Row>
                          <Grid.Row textAlign='center'>
                              <Grid.Column width={8}>
                                <Label>Description</Label>
                              </Grid.Column>
                              <Grid.Column width={6}>
                                <Input className="pwdBox" type='text'  onChange={this.handleDescription.bind(this)}/>
                              </Grid.Column>
                          </Grid.Row>
                          <Grid.Row textAlign='center'>
                              <Grid.Column>
                                <Button onClick={this.onSaveAdd.bind(this, "Quality")}>Save Changes</Button>
                                <Button onClick={this.onPressAdd.bind(this, "Quality")}>Cancel</Button>
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
                              <Grid.Column width={8}>
                                <Label>Key</Label>
                              </Grid.Column>
                              <Grid.Column width={6}>
                                <Input className="pwdBox" type='text' onChange={this.handleKey.bind(this)}/>
                              </Grid.Column>
                          </Grid.Row>
                          <Grid.Row textAlign='center'>
                              <Grid.Column width={8}>
                                <Label>Description</Label>
                              </Grid.Column>
                              <Grid.Column width={6}>
                                <Input className="pwdBox" type='text'  onChange={this.handleDescription.bind(this)}/>
                              </Grid.Column>
                          </Grid.Row>
                          <Grid.Row textAlign='center'>
                              <Grid.Column>
                                <Button onClick={this.onSaveAdd.bind(this, "Type")}>Save Changes</Button>
                                <Button onClick={this.onPressAdd.bind(this, "Type")}>Cancel</Button>
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
                              <Grid.Column width={8}>
                                <Label>Key</Label>
                              </Grid.Column>
                              <Grid.Column width={6}>
                                <Input className="pwdBox" type='text' onChange={this.handleKey.bind(this)}/>
                              </Grid.Column>
                          </Grid.Row>
                          <Grid.Row textAlign='center'>
                              <Grid.Column width={8}>
                                <Label>Description</Label>
                              </Grid.Column>
                              <Grid.Column width={6}>
                                <Input className="pwdBox" type='text'  onChange={this.handleDescription.bind(this)}/>
                              </Grid.Column>
                          </Grid.Row>
                          <Grid.Row textAlign='center'>
                              <Grid.Column>
                                <Button onClick={this.onSaveAdd.bind(this, "Pattern")}>Save Changes</Button>
                                <Button onClick={this.onPressAdd.bind(this, "Pattern")}>Cancel</Button>
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
                              <Grid.Column width={8}>
                                <Label>Key</Label>
                              </Grid.Column>
                              <Grid.Column width={6}>
                                <Input className="pwdBox" type='text' onChange={this.handleKey.bind(this)}/>
                              </Grid.Column>
                          </Grid.Row>
                          <Grid.Row textAlign='center'>
                              <Grid.Column width={8}>
                                <Label>Description</Label>
                              </Grid.Column>
                              <Grid.Column width={6}>
                                <Input className="pwdBox" type='text'  onChange={this.handleDescription.bind(this)}/>
                              </Grid.Column>
                          </Grid.Row>
                          <Grid.Row textAlign='center'>
                              <Grid.Column>
                                <Button onClick={this.onSaveAdd.bind(this, "Color")}>Save Changes</Button>
                                <Button onClick={this.onPressAdd.bind(this, "Color")}>Cancel</Button>
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
                              <Grid.Column width={8}>
                                <Label>Key</Label>
                              </Grid.Column>
                              <Grid.Column width={6}>
                                <Input className="pwdBox" type='text' onChange={this.handleKey.bind(this)}/>
                              </Grid.Column>
                          </Grid.Row>
                          <Grid.Row textAlign='center'>
                              <Grid.Column width={8}>
                                <Label>Description</Label>
                              </Grid.Column>
                              <Grid.Column width={6}>
                                <Input className="pwdBox" type='text'  onChange={this.handleDescription.bind(this)}/>
                              </Grid.Column>
                          </Grid.Row>
                          <Grid.Row textAlign='center'>
                              <Grid.Column>
                                <Button onClick={this.onSaveAdd.bind(this, "Size")}>Save Changes</Button>
                                <Button onClick={this.onPressAdd.bind(this, "Size")}>Cancel</Button>
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
                              <Grid.Column width={8}>
                                <Label>Key</Label>
                              </Grid.Column>
                              <Grid.Column width={6}>
                                <Input className="pwdBox" type='text' onChange={this.handleKey.bind(this)}/>
                              </Grid.Column>
                          </Grid.Row>
                          <Grid.Row textAlign='center'>
                              <Grid.Column width={8}>
                                <Label>Description</Label>
                              </Grid.Column>
                              <Grid.Column width={6}>
                                <Input className="pwdBox" type='text'  onChange={this.handleDescription.bind(this)}/>
                              </Grid.Column>
                          </Grid.Row>
                          <Grid.Row textAlign='center'>
                              <Grid.Column>
                                <Button onClick={this.onSaveAdd.bind(this, "Unit")}>Save Changes</Button>
                                <Button onClick={this.onPressAdd.bind(this, "Unit")}>Cancel</Button>
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
